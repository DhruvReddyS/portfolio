"use client";

import { useEffect, useRef } from "react";

/**
 * Margin doodles that ink themselves in when scrolled to.
 *
 * Each one is a single wobbly stroke, drawn by animating the dash offset,
 * so it reads as a pen moving across the page rather than a shape fading in.
 */

type Kind = "arrowDown" | "arrowLoop" | "brace" | "squiggle" | "tick" | "burst";

const PATHS: Record<Kind, { box: string; d: string[] }> = {
  // a long arrow curving down and to the right
  arrowDown: {
    box: "0 0 90 150",
    d: [
      "M18 8c-6 36 2 68 22 92 9 11 21 21 34 29",
      "M58 118c6 4 11 7 16 11-8 1-16 3-23 6",
    ],
  },
  // a loop that doubles back on itself
  arrowLoop: {
    box: "0 0 140 90",
    d: [
      "M8 62c22-38 52-54 82-44 18 6 27 24 18 38-8 13-27 14-33 2-5-11 4-22 18-24 24-3 40 12 44 30",
      "M131 62c1 6 2 11 5 16-6-2-12-3-18-3",
    ],
  },
  // a tall curly brace for bracketing a block of text
  brace: {
    box: "0 0 40 220",
    d: [
      "M30 6c-10 2-14 8-14 18v70c0 10-4 15-13 16 9 1 13 6 13 16v70c0 10 4 16 14 18",
    ],
  },
  // a wavy emphasis line
  squiggle: {
    box: "0 0 200 24",
    d: [
      "M6 15c14-11 26 6 40-3 13-9 25 7 39-2 14-9 26 7 40-2 13-9 26 6 40-3 10-6 18-1 28 3",
    ],
  },
  // a quick approving tick
  tick: {
    box: "0 0 70 60",
    d: ["M6 32c8 7 15 14 21 22C36 36 48 19 64 6"],
  },
  // a small burst of marks, the kind drawn beside something good
  burst: {
    box: "0 0 80 80",
    d: [
      "M40 8v18",
      "M40 54v18",
      "M8 40h18",
      "M54 40h18",
      "M17 17l13 13",
      "M50 50l13 13",
      "M63 17L50 30",
      "M30 50L17 63",
    ],
  },
};

export function Doodle({
  kind,
  className,
  delay = 0,
  duration = 900,
  width,
  alt = false,
}: {
  kind: Kind;
  className?: string;
  delay?: number;
  duration?: number;
  width?: string;
  alt?: boolean;
}) {
  const host = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const node = host.current;
    if (!node) return;

    const strokes = Array.from(node.querySelectorAll<SVGPathElement>("path"));
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    strokes.forEach((stroke) => {
      const length = stroke.getTotalLength();
      stroke.style.setProperty("--bl-draw", `${length}`);
      stroke.style.strokeDasharray = `${length}`;
      stroke.style.strokeDashoffset = still ? "0" : `${length}`;
    });

    if (still) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        strokes.forEach((stroke, index) => {
          stroke.style.transition = `stroke-dashoffset ${duration}ms cubic-bezier(0.22,1,0.36,1) ${
            delay + index * 110
          }ms`;
          stroke.style.strokeDashoffset = "0";
        });
      },
      { threshold: 0.4 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [kind, delay, duration]);

  const shape = PATHS[kind];

  return (
    <svg
      ref={host}
      className={["bl-doodle", className].filter(Boolean).join(" ")}
      data-alt={alt}
      viewBox={shape.box}
      style={width ? { width } : undefined}
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      {shape.d.map((d, index) => (
        <path key={index} d={d} />
      ))}
    </svg>
  );
}
