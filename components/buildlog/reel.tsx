"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { logEntries, logStories, type LogEntry } from "@/lib/portfolio-data";
import { Plate } from "./plate";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * The five rooms, set as one long spread inside a framed panel.
 *
 * The act pins and the spread travels left as you scroll, so reading down
 * the page means reading right across the spread. Blocks zigzag: one sits
 * against the top of the frame, the next against the bottom, so the eye
 * moves up and down as it moves right.
 *
 * The strip along the bottom is a real scrubber. Dragging it, or clicking
 * anywhere along it, maps straight back onto the window's scroll position
 * inside the pinned stretch, so it moves the spread rather than just
 * reporting on it.
 *
 * One layout at every width. The columns and type shrink, but a phone gets
 * the same spread rather than a different section.
 */

export function Reel({ onOpen }: { onOpen: (entry: LogEntry) => void }) {
  const panel = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const strip = useRef<HTMLDivElement>(null);
  const trigger = useRef<ScrollTrigger | null>(null);
  /** The room the spread last settled on, which each step is taken from. */
  const settled = useRef(0);
  const [progress, setProgress] = useState(0);
  const [at, setAt] = useState(0);
  /** True once the spread is actually being scrubbed by the scroll. */
  const [running, setRunning] = useState(false);
  /** The route the thread takes, measured off the rooms themselves. */
  const [thread, setThread] = useState("");

  useEffect(() => {
    const panelNode = panel.current;
    const trackNode = track.current;
    if (!panelNode || !trackNode) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Pin the act, not this panel: pinning the inner box leaves the rest of
    // the page free to scroll up behind it and the next section slides in
    // over the top while the spread is still running.
    const act = panelNode.closest("section");
    if (!act) return;

    setRunning(true);

    const context = gsap.context(() => {
      const distance = () =>
        Math.max(0, trackNode.scrollWidth - panelNode.clientWidth + 48);

      /* Five stops, evenly spaced through the pinned stretch, one per room.
         Not the columns' own left edges: on a wide screen three rooms are
         already in the frame at once, so most columns can never be brought
         to the left edge and snapping to them would collapse the last two
         stops into one. Even stops always give five. */
      const last = logEntries.length - 1;

      const tween = gsap.to(trackNode, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: act,
          start: "top top",
          /* One screen of scrolling per screen of travel. The spread read
             too fast at this length once, but that was with columns half
             this width, which put four rooms in the frame at a time and
             left a step barely a paragraph long. Wider rooms and the snap
             below do the slowing down now; stretching this as well only
             made the reader work for the same five rooms. */
          end: () => `+=${distance()}`,
          pin: act,
          scrub: 0.8,
          invalidateOnRefresh: true,
          /* One flick, one room.
             Snapping to the nearest of five stops was not enough on its
             own: ScrollTrigger projects the scroll's velocity before it
             picks a stop, and a flick of any conviction projects past the
             last room, so the whole log went by in one gesture. Inertia is
             off and the step is taken from where the spread already is,
             which is what makes a gesture worth exactly one room however
             hard it is thrown. */
          snap: {
            snapTo: (value) => {
              const asked = value * last;
              const from = settled.current;
              /* the dead zone keeps a nudge from counting as a step */
              let next = from;
              if (asked > from + 0.08) next = Math.min(last, from + 1);
              else if (asked < from - 0.08) next = Math.max(0, from - 1);
              settled.current = next;
              return next / last;
            },
            inertia: false,
            duration: { min: 0.22, max: 0.55 },
            delay: 0.04,
            ease: "power2.out",
          },
          onUpdate: (self) => {
            setProgress(self.progress);
            setAt(
              Math.min(
                logEntries.length - 1,
                Math.round(self.progress * (logEntries.length - 1)),
              ),
            );
          },
        },
      });

      trigger.current = tween.scrollTrigger ?? null;
    }, act);

    // The marks change the width of the spread as they decode, and the pin
    // distance is read off that width. Recompute once they are in.
    const images = Array.from(trackNode.querySelectorAll("img"));
    let pending = images.length;
    const settle = () => {
      pending -= 1;
      if (pending <= 0) ScrollTrigger.refresh();
    };
    if (!images.length) ScrollTrigger.refresh();
    for (const image of images) {
      if (image.complete) settle();
      else image.addEventListener("load", settle, { once: true });
      image.addEventListener("error", settle, { once: true });
    }

    return () => {
      trigger.current = null;
      context.revert();
    };
  }, []);

  /** Put the window where the given fraction of the spread would be. */
  const seek = (ratio: number) => {
    const st = trigger.current;
    if (!st) return;
    const clamped = Math.min(1, Math.max(0, ratio));
    settled.current = Math.round(clamped * (logEntries.length - 1));
    window.scrollTo({
      top: st.start + clamped * (st.end - st.start),
      behavior: "auto",
    });
  };

  const seekFromPointer = (clientX: number) => {
    const node = strip.current;
    if (!node) return;
    const box = node.getBoundingClientRect();
    seek((clientX - box.left) / box.width);
  };

  const onStripDown = (event: React.PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    seekFromPointer(event.clientX);
  };

  const onStripMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
    seekFromPointer(event.clientX);
  };

  /*
   * The thread's route, measured rather than guessed.
   *
   * A hard-coded path is wrong at every width but one: the columns are laid
   * out by flex, they are a different size on a phone, and the zigzag makes
   * the free band a different shape beside each of them. So each room is
   * asked where it is, and the line is drawn through the gap next to it:
   * under the ones sitting high, over the ones sitting low. That is also
   * what keeps it visible, since the rooms themselves are opaque.
   */
  useEffect(() => {
    const trackNode = track.current;
    if (!trackNode) return;

    const measure = () => {
      const cols = [...trackNode.querySelectorAll<HTMLElement>(".bl-spread-col")];
      if (!cols.length) return;
      const box = trackNode.getBoundingClientRect();
      if (!box.width || !box.height) return;

      const points = cols.map((col) => {
        const r = col.getBoundingClientRect();
        const x = ((r.left - box.left + r.width / 2) / box.width) * 1000;
        const high = col.dataset.drop === "up";
        /*
         * The rooms overlap through the middle of the track, so the free
         * band is not between them: it is under the ones sitting high and
         * over the ones sitting low. Held a stroke's width off the edge of
         * the track either way, so the line never runs along the rim.
         */
        const RIM = 22;
        const raw = high ? r.bottom - box.top + 18 : r.top - box.top - 18;
        const edge = Math.min(box.height - RIM, Math.max(RIM, raw));
        return { x, y: (edge / box.height) * 300 };
      });

      // run off both ends, so the line arrives from somewhere and leaves
      const first = points[0];
      const last = points[points.length - 1];
      const all = [{ x: -40, y: first.y }, ...points, { x: 1040, y: last.y }];

      // a smooth curve through the lot: each segment eased half way across
      let d = `M${all[0].x.toFixed(1)} ${all[0].y.toFixed(1)}`;
      for (let i = 1; i < all.length; i++) {
        const a = all[i - 1];
        const b = all[i];
        const mid = (a.x + b.x) / 2;
        d += ` C${mid.toFixed(1)} ${a.y.toFixed(1)} ${mid.toFixed(1)} ${b.y.toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
      }
      setThread((was) => (was === d ? was : d));
    };

    measure();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    ro.observe(trackNode);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const current = logEntries[at];

  return (
    <div className="bl-spread" ref={panel}>
      <div className="bl-spread-viewport">
        <div className="bl-spread-track" ref={track}>
          {/*
            One stroke threading the five rooms, drawn as the spread travels.
            The columns already sit up, down, up, down, so the line only has
            to join them to read as the route the eye is taking anyway.

            Its route is measured off the rooms, not written down here: see
            the effect above. pathLength="1" then lets the dash be stated in
            the same 0 to 1 the scroll reports, so the drawing needs no
            measuring of its own and none again at another width.

            Fully drawn where the spread is not being scrubbed at all, which
            is the reduced-motion case: a line permanently a tenth of itself
            is worse than no line.
          */}
          <svg
            className="bl-spread-thread"
            viewBox="0 0 1000 300"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {thread && (
              <path
                pathLength={1}
                vectorEffect="non-scaling-stroke"
                d={thread}
                style={{ strokeDashoffset: running ? 1 - progress : 0 }}
              />
            )}
          </svg>

          {logEntries.map((entry, index) => {
            const story = logStories[entry.id];
            return (
              <article
                className="bl-spread-col"
                key={entry.id}
                /* up, down, up, down: the eye moves vertically as it moves right */
                data-drop={index % 2 === 0 ? "up" : "down"}
                data-on={at === index}
                style={{ "--tint": entry.tint } as React.CSSProperties}
              >
                <p className="bl-spread-kicker">
                  {entry.period} · {entry.location}
                </p>

                <h3 className="bl-spread-head">{entry.company}.</h3>

                <p className="bl-spread-role">{entry.role}</p>

                <p className="bl-spread-body">{story?.brief ?? entry.headline}</p>

                {/* one number off the entry, so a column carries a fact and
                    not only a description. Worded figures are skipped: they
                    read as a second title next to the company name. */}
                {(() => {
                  const figure = entry.metrics.find((metric) =>
                    /\d/.test(metric.value),
                  );
                  if (!figure) return null;
                  return (
                    <p className="bl-spread-figure">
                      <strong>{figure.value}</strong>
                      <span>{figure.label}</span>
                    </p>
                  );
                })()}

                <figure className="bl-spread-shot">
                  <Plate
                    dir="log"
                    name={entry.id}
                    src={entry.image}
                    monogram={entry.monogram}
                    alt={`${entry.company} logo`}
                    bare
                  />
                </figure>

                <button
                  type="button"
                  className="bl-spread-more"
                  onClick={() => onOpen(entry)}
                >
                  Read the entry
                </button>
              </article>
            );
          })}
        </div>
      </div>

      {/* the scrubber: drag it, or click anywhere along it */}
      <footer
        className="bl-spread-strip"
        ref={strip}
        onPointerDown={onStripDown}
        onPointerMove={onStripMove}
        role="slider"
        tabIndex={0}
        aria-label="Move through the spread"
        aria-valuemin={1}
        aria-valuemax={logEntries.length}
        aria-valuenow={at + 1}
        aria-valuetext={current?.company}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") {
            event.preventDefault();
            seek((at + 1) / (logEntries.length - 1));
          } else if (event.key === "ArrowLeft") {
            event.preventDefault();
            seek((at - 1) / (logEntries.length - 1));
          }
        }}
      >
        <span className="bl-spread-ticks" aria-hidden="true" />
        <span
          className="bl-spread-fill"
          aria-hidden="true"
          style={{ transform: `scaleX(${Math.max(0.004, progress)})` }}
        />
        <span
          className="bl-spread-head-pos"
          aria-hidden="true"
          style={{ left: `${progress * 100}%` }}
        />

        <ol>
          {logEntries.map((entry, index) => (
            <li key={entry.id} data-on={at === index}>
              <span className="bl-spread-thumb">
                <Plate
                  dir="log"
                  name={entry.id}
                  src={entry.image}
                  monogram={entry.monogram}
                  alt=""
                  bare
                />
              </span>
              {/* the years and months the strip is ruled in */}
              <em>{entry.year}</em>
              <i>{entry.period.split(" to ")[0]}</i>
            </li>
          ))}
        </ol>
      </footer>
    </div>
  );
}
