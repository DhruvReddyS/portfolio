"use client";

import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { logEntries, type LogEntry } from "@/lib/portfolio-data";
import { servable } from "@/lib/image-sizes";
import { MarkArrow } from "./marks";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * The five rooms, strung along one route that draws itself as you read.
 *
 * The rooms used to be a spread that travelled sideways under a pinned act,
 * and the complaint about it was fair: reading down the page meant reading
 * across the panel, so the five were a thing you operated rather than a
 * thing you read. This is the plain version. The page goes down, the route
 * goes down, and a room arrives as you reach it.
 *
 * The route is one thick ribbon that snakes between the sides, and the
 * accent copy of it is drawn by the scroll rather than played on arrival:
 * the line is only ever as long as you have read, so it is a measure of
 * where you are in the five and not an animation that happens at you.
 *
 * The names sit on top of the ribbon and are haloed in the page's own
 * ground colour, which is what lets a word cross the line without either
 * one getting out of the way. Each room's mark rides on the line beside
 * its name, and the role and dates come up underneath on a tag, tilted off
 * the horizontal so the column reads as a route with things pinned to it
 * rather than a list.
 */

/*
 * The ribbon, in a 1000 x 1900 box it is stretched to fill.
 *
 * Laid out through a line of waypoints and then smoothed, rather than
 * drawn curve by curve: every join here carries on in the direction it
 * arrived in, which is the difference between a route and a row of arcs
 * with corners between them. It runs level where each name sits and
 * swings wide between, so the eye is carried across the page five times
 * on the way down instead of falling straight through the middle.
 */
const ROUTE =
  "M1140 -80 C1086.7 -55.0 940.0 33.3 820 70 C700.0 106.7 530.0 101.7 420 140 " +
  "C310.0 178.3 186.7 249.2 160 300 C133.3 350.8 180.0 415.0 260 445 " +
  "C340.0 475.0 533.3 454.2 640 480 C746.7 505.8 873.3 553.3 900 600 " +
  "C926.7 646.7 880.0 720.0 800 760 C720.0 800.0 528.3 803.3 420 840 " +
  "C311.7 876.7 181.7 931.7 150 980 C118.3 1028.3 148.3 1093.3 230 1130 " +
  "C311.7 1166.7 525.0 1168.3 640 1200 C755.0 1231.7 890.0 1273.3 920 1320 " +
  "C950.0 1366.7 901.7 1439.2 820 1480 C738.3 1520.8 538.3 1528.3 430 1565 " +
  "C321.7 1601.7 186.7 1650.8 170 1700 C153.3 1749.2 225.0 1818.3 330 1860 " +
  "C435.0 1901.7 663.3 1925.0 800 1950 C936.7 1975.0 1091.7 2000.0 1150 2010";

/**
 * Where each room sits against the ribbon, as a share of the box.
 *
 * A first guess, not the final word: these put the room over the stretch
 * of line it belongs to, and `sit` below lands it on the line. They are
 * evenly spread because the ribbon's level stretches are, and the indent
 * alternates so the five read as two columns rather than one.
 */
const PLACES = [
  { side: "left", edge: "20%", top: "5.5%" },
  { side: "right", edge: "3%", top: "23%" },
  { side: "left", edge: "2%", top: "41.5%" },
  { side: "right", edge: "4%", top: "61%" },
  { side: "left", edge: "18%", top: "80%" },
] as const;

/**
 * Each mark's own proportions, so the chip it sits in is the shape of the
 * logo rather than a square with a logo lost in the middle of it. Four of
 * the five are wider than they are tall, and two of those by a long way.
 */
const MARK_PX = 160;

const MARKS: Record<string, { width: number; height: number }> = {
  simplehire: { width: 518, height: 160 },
  axon: { width: 200, height: 200 },
  paper: { width: 1552, height: 1566 },
  sai: { width: 1920, height: 1358 },
  otbi: { width: 442, height: 214 },
};

/** How far a room may be shifted to meet the line, before it is left alone. */
const NUDGE = 84;

/** And the air kept between one room and the next, whatever that costs. */
const CLEAR = 40;

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * What to call a room on the route.
 *
 * Every name here is short enough to set as a display line except one, and
 * that one carries the abbreviation everybody actually uses in `org`. The
 * rule picks it up without a second field that would be the same as
 * `company` four times out of five.
 */
function nameOf(entry: LogEntry) {
  const short = entry.org;
  if (short && entry.company.length > 24 && short.length < entry.company.length) {
    return short;
  }
  return entry.company;
}

export function Route({ onOpen }: { onOpen: (entry: LogEntry) => void }) {
  const wrap = useRef<HTMLDivElement>(null);
  const fill = useRef<SVGPathElement>(null);
  const ghost = useRef<SVGPathElement>(null);

  /*
   * Sit every name down on the ribbon.
   *
   * The places above put each room against the stretch of line it belongs
   * to, but they cannot land it on the line at every width, and this is
   * the reason: the box keeps its proportions as it narrows and the ribbon
   * with it, while a name is a run of type whose width does not shrink in
   * step. So the same name covers a third of the box on a laptop and half
   * of it on a phone, its middle sits over a different part of the curve,
   * and the ribbon has sloped away underneath it by the time it gets
   * there.
   *
   * There is no pair of percentages that is right at both. So the name is
   * asked where it ended up, the ribbon is asked how high it is at that
   * point, and the room is dropped the difference.
   */
  const sit = useCallback(() => {
    const box = wrap.current;
    const line = ghost.current;
    if (!box || !line) return;

    const bounds = box.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;

    // the ribbon, in the box's own pixels rather than the path's units
    const length = line.getTotalLength();
    const STEPS = 700;
    const route: Array<[number, number]> = [];
    for (let i = 0; i <= STEPS; i += 1) {
      const point = line.getPointAtLength((length * i) / STEPS);
      route.push([
        (point.x / 1000) * bounds.width,
        (point.y / 1900) * bounds.height,
      ]);
    }

    const seats: Array<{
      stop: HTMLElement;
      top: number;
      height: number;
      want: number;
    }> = [];

    for (const stop of box.querySelectorAll<HTMLElement>(".bl-route-stop")) {
      const name = stop.querySelector<HTMLElement>(".bl-route-name");
      if (!name) continue;

      /* The first line of the name, not the whole block: a name that wraps
         grows downwards, and it is the top line the ribbon runs through. */
      const range = document.createRange();
      range.selectNodeContents(name);
      const first = range.getClientRects()[0];
      if (!first) continue;

      /*
       * Where the line would be with nothing done to it. The name carries
       * the reveal, and until its cue it is parked a whole line below
       * itself; measured as it stands, every room below the fold would be
       * sat down to meet a ribbon it is not actually near. The translation
       * is read off the computed transform and taken back out, so this is
       * the laid-out position whether the reveal has run or not.
       */
      const moved = new DOMMatrix(getComputedStyle(name).transform).f;
      const x = first.left - bounds.left + first.width / 2;
      const y = first.top - bounds.top - moved + first.height / 2;

      /* The ribbon doubles back, so one x can be two or three heights.
         The one meant here is whichever is already nearest. */
      let near = Number.POSITIVE_INFINITY;
      let sits = y;
      for (const [rx, ry] of route) {
        if (Math.abs(rx - x) > 14) continue;
        const away = Math.abs(ry - y);
        if (away < near) {
          near = away;
          sits = ry;
        }
      }

      /*
       * Where it is lying before any of this, and where it would rather
       * be. The shift is relative to a position that already includes the
       * last shift, so both are taken back to the laid-out figure first;
       * otherwise the second run of this undoes the first, and it runs
       * again on every resize and whenever the box changes size.
       */
      const was = Number.parseFloat(stop.style.getPropertyValue("--sit")) || 0;
      const rect = stop.getBoundingClientRect();
      const top = rect.top - bounds.top - was;
      const want = Number.isFinite(near)
        ? Math.max(-NUDGE, Math.min(NUDGE, was + sits - y))
        : was;

      seats.push({ stop, top, height: rect.height, want });
    }

    /*
     * Down the column, each room taking its seat but never climbing into
     * the one above it. A narrow screen pulls the ribbon's level stretches
     * closer together than the rooms themselves can go, and without this
     * the fourth lands on top of the third. Sitting a little off the line
     * is a worse drawing; two rooms in the same place is a broken one.
     */
    let floor = 0;
    for (const seat of seats) {
      const shift = Math.max(floor - seat.top, seat.want);
      seat.stop.style.setProperty("--sit", `${shift.toFixed(1)}px`);
      floor = seat.top + shift + seat.height + CLEAR;
    }
  }, []);

  useIsomorphicLayoutEffect(() => {
    const box = wrap.current;
    if (!box) return;

    let frame = 0;
    const again = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        sit();
      });
    };

    sit();

    /*
     * Watched rather than run once. Between the first layout and the page
     * settling, the box changes height, the face finishes loading and the
     * names change width with it, and the curtain comes up; each of those
     * moves a name off the line it was just sat on. The shift is worked
     * out from where things actually are, so running it again is free and
     * running it too few times is the only way to get this wrong.
     */
    const watch = new ResizeObserver(again);
    watch.observe(box);
    for (const name of box.querySelectorAll(".bl-route-name")) watch.observe(name);

    window.addEventListener("resize", again);
    return () => {
      watch.disconnect();
      window.removeEventListener("resize", again);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [sit]);

  useEffect(() => {
    const box = wrap.current;
    const line = fill.current;
    if (!box || !line) return;

    /*
     * Reduced motion gets the route already drawn and every room up. The
     * section still says the same thing; it just does not spend the
     * reader's scroll saying it.
     */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      line.style.strokeDasharray = "none";
      line.style.strokeDashoffset = "0";
      return;
    }

    const context = gsap.context(() => {
      /*
       * The length is in the path's own units and does not change when the
       * box is resized, because the stroke is taken out of the scaling. So
       * it is measured once and the dash is stated in those units.
       */
      const length = line.getTotalLength();
      gsap.set(line, { strokeDasharray: length, strokeDashoffset: length });

      gsap.to(line, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: box,
          // from the head of the route reaching the lower third to the
          // tail of it leaving the upper
          start: "top 74%",
          end: "bottom 62%",
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });

      /*
       * One trigger per room rather than one staggered set, which is what
       * makes them arrive one at a time however fast the page is scrolled.
       * A stagger plays on the first room's cue and the last room is then
       * already up by the time it is reached.
       *
       * And in the order a room is read: the mark lands, the name comes up
       * from under its own line, then the role and the dates. Three beats
       * inside a third of a second, which is a thing assembling rather
       * than three things fading.
       */
      gsap.utils.toArray<HTMLElement>(".bl-route-stop").forEach((stop) => {
        const cue = { trigger: stop, start: "top 86%" };

        /*
         * Hand the element back to the stylesheet when the arrival is
         * over. A tween left to settle writes its last frame to the
         * element's own style attribute, and an inline transform beats
         * any rule in the sheet: the chip would hold the tilt it was
         * given here and refuse the one the hover asks for.
         */
        const tidy = "all";

        gsap.from(stop.querySelector(".bl-route-chip"), {
          scale: 0.4,
          rotate: -26,
          opacity: 0,
          duration: 0.55,
          ease: "back.out(2)",
          clearProps: tidy,
          scrollTrigger: cue,
        });

        /* out from behind its own edge, not faded up in place: the name is
           the one thing here big enough for the difference to read */
        gsap.from(stop.querySelector(".bl-route-name"), {
          yPercent: 108,
          duration: 0.8,
          delay: 0.08,
          ease: "power4.out",
          clearProps: tidy,
          scrollTrigger: cue,
        });

        gsap.from(stop.querySelector(".bl-route-tag"), {
          y: 26,
          scale: 0.9,
          opacity: 0,
          duration: 0.65,
          delay: 0.26,
          ease: "power3.out",
          clearProps: tidy,
          scrollTrigger: cue,
        });
      });
    }, box);

    return () => context.revert();
  }, []);

  return (
    <div className="bl-route" ref={wrap}>
      <svg
        className="bl-route-line"
        viewBox="0 0 1000 1900"
        /* stretched to the box, so the snake lengthens on a narrow screen
           instead of the five rooms being squeezed into a short one */
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {/* the whole way, faint: you can see where this is going */}
        <path
          className="bl-route-ghost"
          d={ROUTE}
          ref={ghost}
          vectorEffect="non-scaling-stroke"
        />
        {/* and how far you have come */}
        <path
          className="bl-route-ink"
          d={ROUTE}
          ref={fill}
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {logEntries.map((entry, index) => {
        const place = PLACES[index] ?? PLACES[PLACES.length - 1];
        const mark = MARKS[entry.id];
        const shown = nameOf(entry);
        const short = shown !== entry.company;

        return (
          <article
            className="bl-route-stop"
            key={entry.id}
            data-side={place.side}
            style={
              {
                /* which edge it is held off is the stylesheet's call, since
                   a narrow screen wants every room against the same one */
                "--edge": place.edge,
                /*
                 * The mark's proportions live out here rather than on the
                 * chip itself, because the chip's own style attribute is
                 * handed back to the stylesheet when its arrival finishes
                 * and anything written on it goes with it. Custom
                 * properties inherit, so the chip still reads it.
                 */
                "--ar": mark
                  ? Math.min(3.1, Math.max(0.92, mark.width / mark.height))
                  : 1,
                top: place.top,
              } as React.CSSProperties
            }
          >
            <button
              className="bl-route-head"
              type="button"
              onClick={() => onOpen(entry)}
            >
              <span
                className="bl-route-chip"
                aria-hidden="true"
                data-mark={entry.image && mark ? "logo" : "letters"}
              >
                {/* under the mark, not instead of it: a logo that fails to
                    load leaves a blank white tile, and the initials behind
                    it mean the chip still says which room this is */}
                <span className="bl-route-initials">{entry.monogram}</span>
                {entry.image && mark ? (
                  <Image
                    src={entry.image}
                    alt=""
                    /* the chip's own size, not the file's: two of these are
                       1500px square on disk and the chip is forty high, and
                       the declared width is what the optimiser is asked for */
                    {...servable(
                      Math.round((MARK_PX * mark.width) / mark.height),
                      MARK_PX,
                    )}
                  />
                ) : null}
              </span>

              {/* the slot the name rises out of; the padding is the halo's,
                  which would otherwise be shaved off by the clipping */}
              <span className="bl-route-slot">
                <span className="bl-route-name" aria-hidden={short || undefined}>
                  {shown}
                </span>
              </span>

              {/*
                One of the five goes up as its initials, because its real
                name is six words long and will not set as a display line.
                The name itself still has to be here: it is what the room
                is called, and a reader using a screen reader, or anything
                else reading the page rather than looking at it, should get
                the name and not the abbreviation.
              */}
              {short && <span className="bl-sr">{entry.company}</span>}

              <span className="bl-route-go" aria-hidden="true">
                <MarkArrow size={16} />
              </span>
              <span className="bl-sr">, open the file</span>
            </button>

            {/*
              What the room was, in the order it is asked: the job, the
              thing that came of it, and when and where. The middle line
              is the one that earns the stop — a role and a date say a
              post was held, and the page is meant to say what was done
              in it.
            */}
            <p className="bl-route-tag">
              <b>{entry.role}</b>
              <q>{entry.headline}</q>
              <span>
                {entry.period}
                <i aria-hidden="true" />
                {entry.location}
              </span>
              {entry.status === "current" && <em className="bl-route-now">Now</em>}
            </p>
          </article>
        );
      })}
    </div>
  );
}

export default Route;
