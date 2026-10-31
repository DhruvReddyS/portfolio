"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { sections } from "@/lib/portfolio-data";
import { MarkArrow } from "./marks";
import type { GrokAnimation } from "./grok-avatar";

const GrokAvatar = dynamic(() => import("./grok-avatar"), {
  ssr: false,
  loading: () => <span className="bl-bot-skeleton" aria-hidden="true" />,
});

/**
 * Grok is a guide with a job, not a mascot that chatters.
 *
 * It keeps a docked position, tracks which acts you have actually reached,
 * and only speaks when it has something specific to offer: the act you have
 * not seen yet, or the next step once you have seen them all. The ring around
 * it shows how much of the log you have read.
 */

type Prompt = {
  line: string;
  action?: { label: string; href: string };
  animation: GrokAnimation;
};

const ACTS = sections.map((item) => item.id);

export function GrokCompanion({ section }: { section: string }) {
  const [seen, setSeen] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [nudging, setNudging] = useState(false);
  const idle = useRef<number | undefined>(undefined);

  // Remember every act that has been reached.
  useEffect(() => {
    if (section === "top" || !ACTS.includes(section)) return;
    queueMicrotask(() =>
      setSeen((prev) => (prev.includes(section) ? prev : [...prev, section])),
    );
  }, [section]);

  const unseen = ACTS.filter((id) => !seen.includes(id));
  const read = Math.round(((ACTS.length - unseen.length) / ACTS.length) * 100);

  // It speaks up only after you have gone quiet, and only once per pause.
  useEffect(() => {
    const wake = () => {
      setNudging(false);
      window.clearTimeout(idle.current);
      idle.current = window.setTimeout(() => setNudging(true), 9000);
    };

    wake();
    const events: (keyof WindowEventMap)[] = ["scroll", "pointerdown", "keydown"];
    events.forEach((e) => window.addEventListener(e, wake, { passive: true }));
    return () => {
      window.clearTimeout(idle.current);
      events.forEach((e) => window.removeEventListener(e, wake));
    };
  }, []);

  const prompt: Prompt = useMemo(() => {
    if (unseen.length === 0) {
      return {
        line: "That is the whole log. Still here?",
        action: { label: "Say hello", href: "#contact" },
        animation: "excited",
      };
    }

    if (seen.length === 0) {
      return {
        line: "Seven acts down there. I will keep count.",
        action: { label: "Start at the log", href: "#log" },
        animation: "idle",
      };
    }

    const next = sections.find((item) => item.id === unseen[0]);
    return {
      line: `You have not been to ${next?.label ?? "the rest"} yet.`,
      action: next ? { label: `Take me there`, href: `#${next.id}` } : undefined,
      animation: "curious",
    };
  }, [unseen, seen.length]);

  const avatar = useMemo(
    () => (
      <GrokAvatar
        animation={prompt.animation}
        size="100%"
        ariaLabel=""
      />
    ),
    [prompt.animation],
  );

  // Never over the hero: the credentials live in that corner.
  const showing = (open || nudging) && section !== "hero";

  return (
    <div className="bl-bot" data-showing={showing}>
      {showing && (
        <div className="bl-bot-card" role="status">
          <p>{prompt.line}</p>
          {prompt.action && (
            <a
              className="bl-bot-go"
              href={prompt.action.href}
              onClick={() => {
                setNudging(false);
                setOpen(false);
              }}
            >
              {prompt.action.label} <MarkArrow size={12} />
            </a>
          )}
        </div>
      )}

      <button
        className="bl-bot-dock"
        type="button"
        aria-expanded={open}
        aria-label={`Guide. ${read}% of the log read. ${prompt.line}`}
        onClick={() => {
          setOpen((v) => !v);
          setNudging(false);
        }}
      >
        {/* the ring is how much of the log has been reached */}
        <svg className="bl-bot-ring" viewBox="0 0 44 44" aria-hidden="true">
          <circle className="bl-bot-ring-track" cx="22" cy="22" r="20" />
          <circle
            className="bl-bot-ring-fill"
            cx="22"
            cy="22"
            r="20"
            style={{ strokeDashoffset: 125.6 - (125.6 * read) / 100 }}
          />
        </svg>
        <span className="bl-bot-body">{avatar}</span>
      </button>

      <span className="bl-bot-read" aria-hidden="true">
        {read}%
      </span>
    </div>
  );
}
