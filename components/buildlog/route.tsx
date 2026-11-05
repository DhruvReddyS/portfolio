"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
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
 * And the same route for a tall, narrow box.
 *
 * The ribbon is stretched to whatever shape the box is, which means the
 * stretches where it runs level move as that shape changes. On a laptop
 * the five land where the five rooms do; squeezed into a phone they do
 * not, and the seating pass then has to drag each name a different
 * distance to put it back on the line, which is what pulled the rooms
 * unevenly apart down the column.
 *
 * So a phone gets its own drawing: a switchback, five long level runs
 * at five evenly spaced heights with a turn at alternating ends.
 *
 * Long on purpose. A first version put a short flat stretch at the one
 * x each name's middle happened to land on, which was exact at the
 * width it was measured at and wrong forty pixels either side of it,
 * because a name as wide as the page wraps differently as the page
 * changes and its middle moves with it. These runs are level across
 * two thirds of the width, so wherever a name's middle falls the line
 * is at the same height under it and there is nothing left to correct.
 */
const ROUTE_NARROW =
  "M1120 -60 L1001.8 -5 L930 30 L904.9 44.3 L843.7 85.1 L812.8 103 L787.9 " +
  "113.7 L760.7 121 L731.5 124.7 L701 125.6 L571 119.1 L319.2 118.9 " +
  "L189.6 113 L152.9 114.6 L130 119 L111.4 126.3 L96.4 135.8 L80.8 151.4 " +
  "L69 169.5 L55 200 L49.4 217.1 L43.9 249.8 L41.9 284.6 L43.2 369.7 " +
  "L46.2 396 L50.8 415.1 L58 432 L74 456.6 L85.8 468 L101.7 477.4 L117.4 " +
  "483 L137.1 487.2 L179.6 490 L319.2 486.1 L571.1 485.9 L703.6 480.2 " +
  "L743.3 481.7 L770 486 L802.1 495.8 L817.1 502.1 L837.9 513.1 L862.4 " +
  "530.1 L873.1 539.5 L887.1 554.5 L898.4 570.5 L904.1 582.3 L908.4 595.1 " +
  "L913.5 622.7 L915.5 658.7 L914.6 732.5 L913.1 758.5 L909.1 783.4 " +
  "L901.2 806.4 L888.2 826.9 L865.4 850.1 L842.7 866.6 L816.2 880.8 L794 " +
  "889.4 L770 896 L743.5 900 L714.1 901.4 L571.1 896.1 L319.2 895.9 " +
  "L189.8 889.9 L161.7 890.8 L137.2 894.1 L117 900.6 L95.6 912.7 L79.2 " +
  "928.2 L66.7 946.6 L52 978 L46.3 996.1 L41.7 1023.9 L39.5 1061.4 L40 " +
  "1118 L41.9 1160.6 L45.5 1188.8 L52.1 1214.3 L66.9 1244.6 L79.6 1263.1 " +
  "L89.4 1272.6 L97.3 1278.2 L117.4 1287.5 L144.7 1293.6 L189.3 1295.7 " +
  "L319.2 1291.1 L571.1 1290.9 L682.4 1285.5 L723.9 1285.3 L752.5 1287.7 " +
  "L778.3 1293.2 L802.1 1301.3 L831.2 1315.4 L856.6 1332.5 L882.8 1356.6 " +
  "L898.4 1377.3 L904.1 1388.9 L908.5 1401.4 L912.8 1421.4 L915.4 1448.8 " +
  "L914.1 1517.2 L912 1534.2 L909 1545.8 L904.3 1556.8 L897.4 1567.4 L888 " +
  "1578 L871.7 1592.5 L851.8 1607.1 L834.4 1617.3 L815 1626.5 L793.6 " +
  "1634.2 L770 1640 L752.8 1642.5 L704.1 1644.6 L571.1 1640.1 L319.5 " +
  "1639.9 L196.9 1633.9 L162.3 1635.6 L140 1640 L115.4 1650.4 L105 1657.2 " +
  "L91.3 1668.9 L73.4 1691.6 L60.2 1716.8 L48.2 1751.4 L42.3 1784.9 L42 " +
  "1805.3 L43.5 1818.4 L46.7 1831 L51.7 1842.6 L66.3 1863.2 L84.7 1881.7 " +
  "L102.3 1894.5 L124.5 1906.5 L152.3 1917.8 L186.8 1928.5 L214.2 1935.4 " +
  "L262.4 1944.9 L318 1953.7 L400.4 1964.3 L622.8 1988.4 L781.2 2002.6 " +
  "L1080 2026";

/**
 * Where each room sits against the ribbon, as a share of the box.
 *
 * A first guess, not the final word: these put the room over the stretch
 * of line it belongs to, and `sit` below lands it on the line. They are
 * evenly spread because the ribbon's level stretches are, and the indent
 * alternates so the five read as two columns rather than one.
 */
const PLACES = [
  { side: "left", edge: "20%", top: "5.5%", tall: "3.85%" },
  { side: "right", edge: "3%", top: "23%", tall: "23.17%" },
  { side: "left", edge: "2%", top: "41.5%", tall: "44.75%" },
  { side: "right", edge: "4%", top: "61%", tall: "65.51%" },
  { side: "left", edge: "18%", top: "80%", tall: "83.9%" },
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
  /* both of these were the whole lock-up, wordmark and tagline included,
     which at chip size came out as a mark with a smudge under it; they
     are cropped to the mark itself */
  sai: { width: 640, height: 333 },
  otbi: { width: 238, height: 209 },
};

/**
 * How far a room may be shifted to meet the line, before it is left alone.
 *
 * Generous, because the clearance below is what actually stops two rooms
 * landing on each other and this only has to stop a wild answer. Each
 * drawing is laid out so the shift is a pixel or two at the widths it was
 * drawn for; it is the widths in between, where a name wraps differently
 * than either drawing expects, that need the room.
 */
const NUDGE = 170;

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
  const tip = useRef<HTMLSpanElement>(null);
  /** True once the box is narrow enough to want the other drawing. */
  const [narrow, setNarrow] = useState(false);

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

  /*
   * Which of the two drawings. Before paint, so a phone never shows the
   * wide one for a frame.
   *
   * Narrower than the breakpoint the rooms stack their marks at, and on
   * purpose: the narrow drawing is laid out around where a phone's
   * column puts the middle of each name, and by five hundred and sixty
   * the names have stopped wrapping and stopped being there. Above this
   * the wide drawing and the seating pass between them do a better job
   * than a drawing tuned for a width nobody is at.
   */
  useIsomorphicLayoutEffect(() => {
    const mq = window.matchMedia("(max-width: 560px)");
    const on = () => setNarrow(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
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
    // a different drawing is a different set of places to sit
  }, [sit, narrow]);

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
       * The ribbon measured in the box's own pixels, which is the only
       * unit either half of this works in.
       *
       * The path is written in a 1000 x 1900 box and stretched to fill
       * whatever shape the real one is, and the stroke has the scaling
       * taken out of it. That last part is what makes this necessary: a
       * non-scaling stroke is drawn in screen space, so the dash pattern
       * that reveals the ink is in screen pixels too, while
       * `getPointAtLength` answers in the path's own units. The two
       * disagree by a quarter of the route at a laptop width, which is
       * why the light at the end of the ink used to be a long way from
       * the end of the ink.
       *
       * So the path is walked once per layout and both the dash and the
       * light are driven off the same table of screen distances.
       */
      let table: Array<[number, number, number]> = [];
      let span = 0;
      let wide = 1;
      let high = 1;

      /** Where each room sits along the route, as a screen distance. */
      let gates: Array<{ stop: HTMLElement; at: number }> = [];

      const chart = () => {
        const bounds = box.getBoundingClientRect();
        if (!bounds.width || !bounds.height) return;
        wide = bounds.width;
        high = bounds.height;

        const length = line.getTotalLength();
        const STEPS = 900;
        table = [];
        let run = 0;
        let lastX = 0;
        let lastY = 0;

        for (let i = 0; i <= STEPS; i += 1) {
          const point = line.getPointAtLength((length * i) / STEPS);
          const x = (point.x / 1000) * wide;
          const y = (point.y / 1900) * high;
          if (i) run += Math.hypot(x - lastX, y - lastY);
          table.push([x, y, run]);
          lastX = x;
          lastY = y;
        }

        span = run;
        gsap.set(line, { strokeDasharray: span });

        /*
         * And where each room is along it. A room is reached when the ink
         * has got down to the height its mark is at: the route runs down
         * the page, so height is the only ordering that holds whichever
         * way the ribbon happens to be swinging at the time.
         */
        gates = [];
        for (const stop of box.querySelectorAll<HTMLElement>(".bl-route-stop")) {
          const chip = stop.querySelector<HTMLElement>(".bl-route-chip");
          if (!chip) continue;
          const rect = chip.getBoundingClientRect();
          const middle = rect.top - bounds.top + rect.height / 2;
          let at = span;
          for (const [, y, d] of table) {
            if (y >= middle) {
              at = d;
              break;
            }
          }
          gates.push({ stop, at });
        }
      };

      /**
       * The nib: a light exactly where the ink stops, with the tail
       * lined up along the direction of travel.
       */
      const nib = (progress: number) => {
        const node = tip.current;
        if (!node || !table.length) return;

        const want = span * progress;
        let index = table.length - 1;
        for (let i = 0; i < table.length; i += 1) {
          if (table[i][2] >= want) {
            index = i;
            break;
          }
        }

        const [x, y] = table[index];
        const back = table[Math.max(0, index - 6)];
        node.style.setProperty("--tx", `${((x / wide) * 100).toFixed(3)}%`);
        node.style.setProperty("--ty", `${((y / high) * 100).toFixed(3)}%`);
        node.style.setProperty(
          "--ang",
          `${(Math.atan2(y - back[1], x - back[0]) * 180) / Math.PI}deg`,
        );

        /* nothing to point at before it starts, or once the route has
           run off the foot of the box on its way to the next act */
        node.dataset.on = progress > 0.004 && progress < 0.965 ? "true" : "false";

        /* and the rooms it has already been to, which is what makes the
           five light up one after another rather than all at once */
        for (const gate of gates) {
          gate.stop.dataset.passed = want >= gate.at ? "true" : "false";
        }
      };

      /*
       * Held in a box rather than named directly, because ScrollTrigger
       * runs the update once while it is still building the tween, and
       * the name would not exist yet when it did.
       */
      const held: { draw?: gsap.core.Tween } = {};

      chart();
      gsap.set(line, { strokeDashoffset: span });

      held.draw = gsap.to(line, {
        strokeDashoffset: 0,
        ease: "none",
        /*
         * Done by the time the last room settles, not a third of a screen
         * later. Starting and ending on the same line means the scrub
         * lasts exactly as long as the route takes to pass it.
         */
        scrollTrigger: {
          trigger: box,
          start: "top 74%",
          end: "bottom 76%",
          scrub: 0.8,
          invalidateOnRefresh: true,
          /* the box changes shape on a refresh, so the table and the dash
             that is stated in its units both have to be redrawn */
          onRefresh: () => {
            const was = held.draw?.progress() ?? 0;
            chart();
            gsap.set(line, { strokeDashoffset: span * (1 - was) });
            nib(was);
          },
        },
        // the tween's own progress, not the scroll's: with a scrub between
        // them the two are a moment apart, and the nib has to be on the ink
        onUpdate: () => nib(held.draw?.progress() ?? 0),
      });

      nib(0);

      /*
       * Watched as well as refreshed. The names change width as the face
       * finishes loading and the rooms are sat down on the line after
       * that, both of which move the gates without changing the scroll.
       */
      let frame = 0;
      const again = () => {
        if (frame) return;
        frame = requestAnimationFrame(() => {
          frame = 0;
          const was = held.draw?.progress() ?? 0;
          chart();
          gsap.set(line, { strokeDashoffset: span * (1 - was) });
          nib(was);
        });
      };

      const watch = new ResizeObserver(again);
      watch.observe(box);

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

      return () => {
        watch.disconnect();
        if (frame) cancelAnimationFrame(frame);
      };
    }, box);

    return () => context.revert();
    // the other drawing is a different length, so the dash is too
  }, [narrow]);

  const route = narrow ? ROUTE_NARROW : ROUTE;

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
          d={route}
          ref={ghost}
          vectorEffect="non-scaling-stroke"
        />
        {/*
          And the way ahead, with something running along it. It is drawn
          over the faint copy and under the inked one, so it is only ever
          visible on the stretch the reader has not got to: the route is
          busy in front of you and settled behind you, which is the one
          thing a line being drawn by a scroll cannot say on its own.
        */}
        <path
          className="bl-route-dots"
          d={route}
          vectorEffect="non-scaling-stroke"
        />
        {/* and how far you have come */}
        <path
          className="bl-route-ink"
          d={route}
          ref={fill}
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* the light at the end of the drawn stretch, with the glow it is
          dragging behind it lined up along the way it is going */}
      <span className="bl-route-tip" ref={tip} data-on="false" aria-hidden="true">
        <b />
        <i />
      </span>

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
                /* the two drawings put their level stretches at
                   different heights, so each has its own set */
                top: narrow ? place.tall : place.top,
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
              What the room was, in the order it is asked: the job, when
              it was held, and the thing that came of it.
              
              The three used to be set at three sizes of the same grey,
              which made the card a paragraph with a coloured first line.
              A role and a date are the two facts a recruiter is actually
              scanning for, so they are given the top line together and
              the date is set as a stamp rather than as more type: it is
              the one thing on the card you are allowed to read without
              reading the card.
            */}
            <div className="bl-route-tag">
              <p className="bl-route-job">
                <b>{entry.role}</b>
                <time className="bl-route-when">{entry.period}</time>
              </p>

              <q>{entry.headline}</q>

              <p className="bl-route-at">
                <i aria-hidden="true" />
                {entry.location}
              </p>

              {entry.status === "current" && <em className="bl-route-now">Now</em>}
            </div>
          </article>
        );
      })}
    </div>
  );
}

export default Route;
