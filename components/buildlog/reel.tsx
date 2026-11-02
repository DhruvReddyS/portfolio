"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { logEntries, logStories, type LogEntry } from "@/lib/portfolio-data";
import { Plate } from "./plate";
import { MarkArrow } from "./marks";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * The five rooms, run through sideways.
 *
 * The act pins and the track travels left as you scroll, so reading down
 * the page means moving right along the years. Each room is a column on a
 * ruled axis: its mark on the line, then the company, the role, the dates
 * and the brief underneath. A scrubber along the bottom carries the same
 * five marks and fills as you go, so you can always see how far through
 * the stretch you are and jump back.
 *
 * Wide screens only. Pinning an act and turning vertical scroll sideways is
 * a poor trade on a phone, where the stacked timeline reads better; the
 * guard below bails out and leaves that one showing.
 */
export function Reel({ onOpen }: { onOpen: (entry: LogEntry) => void }) {
  const section = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [at, setAt] = useState(0);

  useEffect(() => {
    const sectionNode = section.current;
    const trackNode = track.current;
    if (!sectionNode || !trackNode) return;

    const wide = window.matchMedia("(min-width: 1040px)");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!wide.matches || still.matches) return;

    // Pin the act, not this box. Pinning the inner box left the rest of the
    // page free to scroll up behind it, so the case files slid in over the
    // reel while it was still running.
    const act = sectionNode.closest("section");
    if (!act) return;

    const context = gsap.context(() => {
      const distance = () =>
        Math.max(0, trackNode.scrollWidth - window.innerWidth + 120);

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

    // The marks change the width of the track as they decode, and the pin
    // distance is measured from that width. Recompute once they are in.
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

  return (
    <div className="bl-reel" ref={section}>
      <div className="bl-reel-viewport">
        <div className="bl-reel-track" ref={track}>
          {/* the ruled line the rooms stand on */}
          <span className="bl-reel-axis" aria-hidden="true" />

          {logEntries.map((entry, index) => {
            const story = logStories[entry.id];
            return (
              <article
                className="bl-reel-stop"
                key={entry.id}
                data-status={entry.status}
                data-on={at === index}
                style={{ "--tint": entry.tint } as React.CSSProperties}
              >
                <span className="bl-reel-mark" aria-hidden="true">
                  <Plate
                    dir="log"
                    name={entry.id}
                    src={entry.image}
                    monogram={entry.monogram}
                    alt=""
                    bare
                  />
                </span>

                <span className="bl-reel-node" aria-hidden="true" />

                <div className="bl-reel-copy">
                  <p className="bl-reel-when">
                    {entry.period}
                    <em>{entry.location}</em>
                  </p>

                  <h3 className="bl-reel-name">
                    {entry.company}
                    {entry.org && <small>{entry.org}</small>}
                  </h3>

                  <p className="bl-reel-role">{entry.role}</p>

                  {entry.status === "current" && (
                    <span className="bl-entry-flag">
                      <i aria-hidden="true" /> Current
                    </span>
                  )}

                  <p className="bl-reel-brief">{story?.brief ?? entry.headline}</p>

                  <div className="bl-job-chips">
                    {entry.stack.slice(0, 4).map((tech) => (
                      <span className="bl-chip" key={tech}>
                        {tech}
                      </span>
                    ))}
                  </div>

                  <button
                    type="button"
                    className="bl-btn"
                    onClick={() => onOpen(entry)}
                  >
                    Read the entry <MarkArrow size={12} />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* the scrubber: the same five marks, and how far through you are */}
      <div className="bl-reel-scrub">
        <span className="bl-reel-ticks" aria-hidden="true" />
        <span
          className="bl-reel-fill"
          aria-hidden="true"
          style={{ transform: `scaleX(${Math.max(0.01, progress)})` }}
        />
        <ol className="bl-reel-dots">
          {logEntries.map((entry, index) => (
            <li key={entry.id} data-on={at === index}>
              <span aria-hidden="true">
                <Plate
                  dir="log"
                  name={entry.id}
                  src={entry.image}
                  monogram={entry.monogram}
                  alt=""
                  bare
                />
              </span>
              <em>{entry.company}</em>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
