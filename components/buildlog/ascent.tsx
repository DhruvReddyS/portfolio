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
 * The five rooms as a flight of slabs.
 *
 * Each job is a monolith standing on a dark floor, taller than the one
 * before it, with its mark hanging in the air above and lit in its own
 * colour. A short flight of steps runs between one slab and the next, so
 * the act reads as a climb rather than a list.
 *
 * This is CSS 3D, not WebGL. The whole flight sits inside one rotated stage
 * with `preserve-3d`, and every slab is four faces of a box placed in that
 * space. The angle is a gentle three-quarter view rather than a true
 * isometric: at a real isometric the text on a slab face shears far enough
 * to stop being readable, and the text here is the point.
 *
 * It is the wide-screen view only. Below the breakpoint the stacked
 * timeline takes over, which is a better shape for a phone than any amount
 * of perspective.
 */
export function Ascent({ onOpen }: { onOpen: (entry: LogEntry) => void }) {
  const scene = useRef<HTMLDivElement>(null);
  const [focus, setFocus] = useState<number | null>(null);

  useEffect(() => {
    const node = scene.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const context = gsap.context(() => {
      // The flight builds itself as the act arrives: each slab rises out of
      // the floor, then its mark drops in above it.
      const build = gsap.timeline({
        scrollTrigger: { trigger: node, start: "top 78%", once: true },
      });

      build
        .from(".bl-slab", {
          yPercent: 42,
          opacity: 0,
          duration: 0.85,
          ease: "power3.out",
          stagger: 0.11,
        })
        .from(
          ".bl-slab-mark",
          {
            y: -26,
            opacity: 0,
            duration: 0.6,
            ease: "back.out(1.6)",
            stagger: 0.11,
          },
          0.32,
        )
        .from(
          ".bl-flight",
          { opacity: 0, duration: 0.5, ease: "none", stagger: 0.11 },
          0.4,
        );

      // and the whole stage settles a few degrees as you scroll through it,
      // which is what sells the depth
      gsap.fromTo(
        ".bl-stage",
        { rotateX: 17, rotateY: -27 },
        {
          rotateX: 9,
          rotateY: -18,
          ease: "none",
          scrollTrigger: {
            trigger: node,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.8,
          },
        },
      );
    }, node);

    return () => context.revert();
  }, []);

  return (
    <div className="bl-scene" ref={scene}>
      <div className="bl-stage">
        <div className="bl-floor" aria-hidden="true" />

        {logEntries.map((entry, index) => {
          return (
            <div
              className="bl-slot"
              key={entry.id}
              style={
                {
                  "--i": index,
                  "--tint": entry.tint,
                } as React.CSSProperties
              }
            >
              {index > 0 && <span className="bl-flight" aria-hidden="true" />}

              <button
                type="button"
                className="bl-slab"
                data-status={entry.status}
                data-on={focus === index}
                onPointerEnter={() => setFocus(index)}
                onPointerLeave={() => setFocus(null)}
                onFocus={() => setFocus(index)}
                onBlur={() => setFocus(null)}
                onClick={() => onOpen(entry)}
                aria-label={`${entry.company}, ${entry.role}, ${entry.period}. Open the full entry.`}
              >
                <span className="bl-slab-mark" aria-hidden="true">
                  <Plate
                    dir="log"
                    name={entry.id}
                    src={entry.image}
                    monogram={entry.monogram}
                    alt=""
                    bare
                  />
                </span>

                <span className="bl-slab-pool" aria-hidden="true" />

                <span className="bl-slab-face">
                  <strong>{entry.company}</strong>
                  <em>{entry.role}</em>
                  <small>{entry.period}</small>
                  {entry.status === "current" && (
                    <i className="bl-slab-now">Current</i>
                  )}
                  <span className="bl-slab-open">
                    Read the entry <MarkArrow size={11} />
                  </span>
                </span>

                <span className="bl-slab-side" aria-hidden="true" />
                <span className="bl-slab-cap" aria-hidden="true" />
                <span className="bl-slab-strip" aria-hidden="true" />
              </button>
            </div>
          );
        })}
      </div>

      {/* what the slab cannot hold, read off to the side */}
      <p className="bl-scene-read" aria-live="polite">
        {focus === null ? (
          <>
            <strong>Five rooms</strong>
            <em>Hover a slab. Click to open it.</em>
          </>
        ) : (
          <>
            <strong>{logEntries[focus].company}</strong>
            <em>{logStories[logEntries[focus].id]?.brief ?? logEntries[focus].headline}</em>
          </>
        )}
      </p>
    </div>
  );
}
