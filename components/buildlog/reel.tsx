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
  const [progress, setProgress] = useState(0);
  const [at, setAt] = useState(0);

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

    const context = gsap.context(() => {
      const distance = () =>
        Math.max(0, trackNode.scrollWidth - panelNode.clientWidth + 48);

      const tween = gsap.to(trackNode, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: act,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: act,
          scrub: 0.8,
          invalidateOnRefresh: true,
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

  const current = logEntries[at];

  return (
    <div className="bl-spread" ref={panel}>
      <header className="bl-spread-bar">
        <span className="bl-spread-brand">TheLog</span>
        <p>Five rooms, June 2025 to now. Scroll, or drag the strip below.</p>
        <span className="bl-spread-meter" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
          <i />
        </span>
        <span className="bl-spread-count">
          {String(at + 1).padStart(2, "0")} /{" "}
          {String(logEntries.length).padStart(2, "0")}
        </span>
        <span className="bl-spread-flags" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
      </header>

      <div className="bl-spread-viewport">
        <div className="bl-spread-track" ref={track}>
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
