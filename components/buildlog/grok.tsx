"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { GrokAnimation } from "./grok-avatar";

/**
 * Loaded in the browser only: the avatar package compiles a JSON schema at
 * import time, which the Workers runtime used for SSR does not allow.
 */
const GrokAvatar = dynamic(() => import("./grok-avatar"), {
  ssr: false,
  loading: () => <span className="bl-bot-skeleton" aria-hidden="true" />,
});

/** What it is doing, and what it has to say, in each act. */
const MOODS: Record<string, { animation: GrokAnimation; lines: string[] }> = {
  hero: {
    animation: "idle",
    lines: ["Oh. You came.", "Scroll. I walk down with you."],
  },
  log: {
    animation: "thinking",
    lines: [
      "Five rooms. Five different problems.",
      "The top one is still running.",
      "Open an entry, the numbers are real.",
    ],
  },
  work: {
    animation: "searching",
    lines: [
      "Six builds. This bit moves sideways.",
      "Corpusil is the deep one.",
      "Two of these won something.",
    ],
  },
  education: {
    animation: "curious",
    lines: ["Two degrees at once.", "9.34, in case you skimmed."],
  },
  stack: {
    animation: "working",
    lines: ["All of this has shipped.", "No filler. I checked."],
  },
  wins: {
    animation: "proud",
    lines: [
      "This part he is quiet about.",
      "First prize. Six hundred people.",
      "Then it won again.",
    ],
  },
  studio: {
    animation: "happy",
    lines: [
      "He runs this one himself.",
      "Real clients. Real invoices.",
      "Seven brands on the books.",
    ],
  },
  contact: {
    animation: "excited",
    lines: ["Here is the part where you email him.", "He replies. Quickly."],
  },
};

const LINE_MS = 5400;

/**
 * Grok walks down the left margin as the page scrolls, keeping pace with the
 * ink rail rather than jumping between fixed points. Its vertical position is
 * the scroll progress, so the movement is continuous and belongs to the page.
 */
export function GrokCompanion({ section }: { section: string }) {
  const mood = MOODS[section] ?? MOODS.hero;

  const [line, setLine] = useState(0);
  const [progress, setProgress] = useState(0);
  const [stepping, setStepping] = useState(false);
  const step = useRef<number | undefined>(undefined);

  useEffect(() => {
    queueMicrotask(() => setLine(0));
    const timer = window.setInterval(() => setLine((value) => value + 1), LINE_MS);
    return () => window.clearInterval(timer);
  }, [section]);

  // Walk with the scroll.
  useEffect(() => {
    let frame = 0;
    let last = 0;

    const measure = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const next = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;

      // a short stride animation whenever it is actually moving
      if (Math.abs(next - last) > 0.0008) {
        last = next;
        setStepping(true);
        window.clearTimeout(step.current);
        step.current = window.setTimeout(() => setStepping(false), 220);
      }

      setProgress(next);
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
      window.clearTimeout(step.current);
    };
  }, []);

  // Keep it inside the viewport, and let it duck out over the footer so it
  // never sits on top of the links.
  const top = 27 + progress * 54;
  const away = progress > 0.965;

  return (
    <div
      className="bl-bot"
      style={{ top: `${top}%` }}
      data-stepping={stepping}
      data-away={away}
    >
      <div className="bl-bot-body">
        <GrokAvatar
          animation={mood.animation}
          size="100%"
          ariaLabel="Grok, a companion walking down the margin with you"
        />
      </div>

      {line < mood.lines.length && (
        <p className="bl-bot-bubble" key={`${section}-${line}`}>
          {mood.lines[line]}
        </p>
      )}
    </div>
  );
}
