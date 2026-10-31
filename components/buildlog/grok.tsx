"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import type { GrokAnimation } from "./grok-avatar";

if (typeof window !== "undefined") {
  gsap.registerPlugin(MotionPathPlugin);
}

/**
 * Loaded in the browser only: the avatar package compiles a JSON schema at
 * import time, which the Workers runtime used for SSR does not allow.
 */
const GrokAvatar = dynamic(() => import("./grok-avatar"), {
  ssr: false,
  loading: () => <span className="bl-bot-skeleton" aria-hidden="true" />,
});

type Stop = {
  /** Where on the viewport the bot parks for this act, in percent. */
  x: number;
  y: number;
  animation: GrokAnimation;
  /** It works through these while you stay in the act, then goes quiet. */
  lines: string[];
};

const STOPS: Record<string, Stop> = {
  hero: {
    x: 45,
    y: 88,
    animation: "waking",
    lines: [
      "Oh. You came.",
      "Go on, scroll. I'll follow you down.",
      "I know all of this by heart.",
    ],
  },
  log: {
    x: 8,
    y: 62,
    animation: "thinking",
    lines: [
      "Five rooms. Five different problems.",
      "That top one is still running, by the way.",
      "Open an entry. The numbers are real.",
    ],
  },
  work: {
    x: 91,
    y: 62,
    animation: "searching",
    lines: [
      "Six builds. It moves sideways here.",
      "Corpusil is the deep one.",
      "Two of these won something.",
      "Still scrolling past? Bold.",
    ],
  },
  stack: {
    x: 9,
    y: 30,
    animation: "working",
    lines: [
      "Everything here, he has shipped with.",
      "No filler. I checked.",
      "Thirty-four of them. I counted twice.",
    ],
  },
  wins: {
    x: 88,
    y: 28,
    animation: "proud",
    lines: [
      "This is the part he is quiet about.",
      "First prize. Six hundred people.",
      "Then the same build won again.",
    ],
  },
  contact: {
    x: 14,
    y: 44,
    animation: "excited",
    lines: [
      "This is the part where you email him.",
      "He actually replies. Quickly.",
      "I will wait here. No pressure.",
      "Alright, some pressure.",
    ],
  },
};

const LINE_MS = 5200;
const TRAVEL_S = 1.5;

export function GrokCompanion({ section }: { section: string }) {
  const stop = STOPS[section] ?? STOPS.hero;

  const bot = useRef<HTMLDivElement>(null);
  const trail = useRef<SVGPathElement>(null);
  const place = useRef<{ x: number; y: number } | null>(null);

  const [line, setLine] = useState(0);
  const [travelling, setTravelling] = useState(false);
  const [side, setSide] = useState(stop.x < 50 ? "left" : "right");

  // Work through this act's lines, then stop talking so the page can be read.
  useEffect(() => {
    queueMicrotask(() => setLine(0));
    const timer = window.setInterval(() => setLine((value) => value + 1), LINE_MS);
    return () => window.clearInterval(timer);
  }, [section]);

  // Walk to the next stop along an arc, drawing a pen line behind it.
  useEffect(() => {
    const node = bot.current;
    if (!node) return;

    const target = {
      x: (stop.x / 100) * window.innerWidth,
      y: (stop.y / 100) * window.innerHeight,
    };

    // First placement: put it there, no journey. Deferred two frames so the
    // viewport has finished settling, otherwise it parks against a stale height.
    if (!place.current) {
      place.current = target;
      gsap.set(node, { x: target.x, y: target.y });

      let second = 0;
      const first = requestAnimationFrame(() => {
        second = requestAnimationFrame(() => {
          const settled = {
            x: (stop.x / 100) * window.innerWidth,
            y: (stop.y / 100) * window.innerHeight,
          };
          place.current = settled;
          gsap.set(node, { x: settled.x, y: settled.y });
        });
      });

      return () => {
        cancelAnimationFrame(first);
        if (second) cancelAnimationFrame(second);
      };
    }

    const from = place.current;
    place.current = target;

    const dx = target.x - from.x;
    const dy = target.y - from.y;
    const distance = Math.hypot(dx, dy);
    if (distance < 4) return;

    // Apex of the arc: the midpoint pushed out perpendicular to the travel.
    const lift = Math.min(distance * 0.3, 280);
    const apex = {
      x: (from.x + target.x) / 2 - (dy / distance) * lift,
      y: (from.y + target.y) / 2 + (dx / distance) * lift * 0.35 - lift * 0.35,
    };

    queueMicrotask(() => {
      setTravelling(true);
      setSide(stop.x < 50 ? "left" : "right");
    });

    // The trail is a quadratic curve through that same apex.
    const control = {
      x: 2 * apex.x - (from.x + target.x) / 2,
      y: 2 * apex.y - (from.y + target.y) / 2,
    };

    const path = trail.current;
    let trailTween: gsap.core.Tween | undefined;
    let fade: gsap.core.Tween | undefined;

    if (path) {
      path.setAttribute(
        "d",
        `M ${from.x} ${from.y} Q ${control.x} ${control.y} ${target.x} ${target.y}`,
      );
      const length = path.getTotalLength();
      gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: length,
        opacity: 1,
      });
      trailTween = gsap.to(path, {
        strokeDashoffset: 0,
        duration: TRAVEL_S,
        ease: "power2.inOut",
        onComplete: () => {
          fade = gsap.to(path, { opacity: 0, duration: 0.9, delay: 0.3 });
        },
      });
    }

    const travel = gsap.to(node, {
      duration: TRAVEL_S,
      ease: "power2.inOut",
      motionPath: { path: [from, apex, target], curviness: 1.6 },
      onComplete: () => setTravelling(false),
    });

    // lean into the direction of travel, then settle back
    const lean = gsap.to(node, {
      rotation: dx > 0 ? 12 : -12,
      duration: TRAVEL_S * 0.45,
      ease: "power1.inOut",
      yoyo: true,
      repeat: 1,
    });

    return () => {
      travel.kill();
      lean.kill();
      trailTween?.kill();
      fade?.kill();
    };
  }, [stop, section]);

  // Keep the parked position right when the window is resized.
  useEffect(() => {
    const onResize = () => {
      const node = bot.current;
      if (!node) return;
      const target = {
        x: (stop.x / 100) * window.innerWidth,
        y: (stop.y / 100) * window.innerHeight,
      };
      place.current = target;
      gsap.set(node, { x: target.x, y: target.y });
    };

    window.addEventListener("resize", onResize);
    window.visualViewport?.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      window.visualViewport?.removeEventListener("resize", onResize);
    };
  }, [stop]);

  const animation: GrokAnimation = travelling ? "curious" : stop.animation;

  return (
    <>
      <svg className="bl-bot-trail" aria-hidden="true">
        <path ref={trail} />
      </svg>

      <div className="bl-bot" ref={bot} data-side={side} data-travelling={travelling}>
        <div className="bl-bot-body">
          <GrokAvatar
            animation={animation}
            size="100%"
            ariaLabel="Grok, a companion that follows you through the page"
          />
        </div>

        {line < stop.lines.length && !travelling && (
          <p className="bl-bot-bubble" key={`${section}-${line}`}>
            {stop.lines[line]}
          </p>
        )}
      </div>
    </>
  );
}
