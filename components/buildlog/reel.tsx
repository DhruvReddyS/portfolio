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
 * Built off the reference: a bordered screen inset from the page with a bar
 * across the top, editorial columns running away to the right at different
 * heights, and a finely ruled strip along the bottom carrying thumbnails.
 * The act pins and the spread travels left as you scroll, so reading down
 * the page means reading right across the spread.
 *
 * The blocks do not sit on a shared baseline. Each takes one of three drops
 * so the spread reads as something laid out by hand rather than a row of
 * cards, which is what the earlier pass got wrong.
 *
 * Wide screens only. Pinning an act and turning scroll sideways is a poor
 * trade on a phone, where the stacked timeline reads better.
 */

/** Which vertical drop each column takes, repeating down the spread. */
const DROPS = [0, 2, 1, 0, 2];

export function Reel({ onOpen }: { onOpen: (entry: LogEntry) => void }) {
  const panel = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [at, setAt] = useState(0);

  useEffect(() => {
    const panelNode = panel.current;
    const trackNode = track.current;
    if (!panelNode || !trackNode) return;

    const wide = window.matchMedia("(min-width: 1040px)");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!wide.matches || still.matches) return;

    // Pin the act, not this panel: pinning the inner box leaves the rest of
    // the page free to scroll up behind it and the next section slides in
    // over the top while the spread is still running.
    const act = panelNode.closest("section");
    if (!act) return;

    const context = gsap.context(() => {
      const distance = () =>
        Math.max(0, trackNode.scrollWidth - panelNode.clientWidth + 80);

      gsap.to(trackNode, {
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

    return () => context.revert();
  }, []);

  const current = logEntries[at];

  return (
    <div className="bl-spread" ref={panel}>
      {/* the bar across the top of the panel */}
      <header className="bl-spread-bar">
        <span className="bl-spread-brand">TheLog</span>
        <p>
          Five rooms between June 2025 and now. Scroll to read across the
          spread.
        </p>
        <span className="bl-spread-meter" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
          <i />
        </span>
        <span className="bl-spread-count">
          {String(at + 1).padStart(2, "0")} / {String(logEntries.length).padStart(2, "0")}
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
                data-drop={DROPS[index % DROPS.length]}
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

          {/* the rule the spread is set against */}
          <span className="bl-spread-divider" aria-hidden="true" />
        </div>
      </div>

      {/* the ruled strip, with the same five marks on it */}
      <footer className="bl-spread-strip">
        <span className="bl-spread-ticks" aria-hidden="true" />
        <span
          className="bl-spread-fill"
          aria-hidden="true"
          style={{ transform: `scaleX(${Math.max(0.004, progress)})` }}
        />
        <ol>
          {logEntries.map((entry, index) => (
            <li key={entry.id} data-on={at === index}>
              <Plate
                dir="log"
                name={entry.id}
                src={entry.image}
                monogram={entry.monogram}
                alt=""
                bare
              />
            </li>
          ))}
        </ol>
        <span className="bl-spread-now" aria-live="polite">
          {current?.company}
        </span>
      </footer>
    </div>
  );
}
