"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { profile, sections } from "@/lib/portfolio-data";
import { MarkArrow } from "./marks";
import type { GrokAnimation } from "./grok-avatar";

const GrokAvatar = dynamic(() => import("./grok-avatar"), {
  ssr: false,
  loading: () => <span className="bl-bot-skeleton" aria-hidden="true" />,
});

/**
 * The guide, which answers questions rather than announcing itself.
 *
 * It used to do one thing: wait for you to go still, then say which act
 * you had not reached. That is a progress bar with a face on it, and a
 * progress bar is not a reason to press anything.
 *
 * So it keeps the count, and the ring still shows it, but the thing it
 * opens is a short list of the questions somebody actually arrives with.
 * Every answer is a fact that is already on this page, with the way to go
 * and read it in full: the guide is a shortcut through the log, not a
 * second version of it.
 */

type Answer = {
  /** What the visitor presses. */
  ask: string;
  /** What it says back, which has to be true and has to be short. */
  line: string;
  go?: { label: string; href: string };
  animation: GrokAnimation;
};

/*
 * Four questions, in the order a stranger asks them: can I hire him, what
 * is he, what has he made, and has anyone else paid for it.
 */
const ANSWERS: Answer[] = [
  {
    ask: "Is he free?",
    line: `Open to work, from ${profile.location} or remote, and he answers inside a day.`,
    go: { label: "Write to him", href: "#contact" },
    animation: "excited",
  },
  {
    ask: "What is he best at?",
    line: "Full stack, with applied AI on top. Thirty-one tools in the heap and every one has shipped inside something on this page.",
    go: { label: "See the heap", href: "#stack" },
    animation: "curious",
  },
  {
    ask: "Show me one thing",
    line: "Corpusil: legal answers that cite their sources, or do not get given at all.",
    go: { label: "Open the case files", href: "#work" },
    animation: "excited",
  },
  {
    ask: "Has anyone paid him?",
    line: "Two clients in the United States, through a studio he founded and still runs.",
    go: { label: "See the studio", href: "#studio" },
    animation: "curious",
  },
];

const ACTS = sections.map((item) => item.id);

export function GrokCompanion({ section }: { section: string }) {
  const [seen, setSeen] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [nudging, setNudging] = useState(false);
  /** Which of the four is being answered, if any. */
  const [asked, setAsked] = useState<number | null>(null);
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

  /** What it says when nobody has asked it anything. */
  const resting = useMemo<Answer>(() => {
    if (unseen.length === 0) {
      return {
        ask: "",
        line: "That is the whole log. Anything you want to know?",
        animation: "excited",
      };
    }
    if (seen.length === 0) {
      return {
        ask: "",
        line: "Seven acts down there. Ask me something, or I will keep count.",
        animation: "idle",
      };
    }
    const next = sections.find((item) => item.id === unseen[0]);
    return {
      ask: "",
      line: `You have not been to ${next?.label ?? "the rest"} yet.`,
      go: next ? { label: "Take me there", href: `#${next.id}` } : undefined,
      animation: "curious",
    };
  }, [unseen, seen.length]);

  const saying = asked === null ? resting : ANSWERS[asked];

  const avatar = useMemo(
    () => <GrokAvatar animation={saying.animation} size="100%" ariaLabel="" />,
    [saying.animation],
  );

  const quiet = useCallback(() => {
    setNudging(false);
    setOpen(false);
    setAsked(null);
  }, []);

  // Never over the hero: the credentials live in that corner.
  const showing = (open || nudging) && section !== "hero";

  return (
    <div className="bl-bot" data-showing={showing} data-open={open || undefined}>
      {showing && (
        <div className="bl-bot-card" role="status">
          <p className="bl-bot-say" key={saying.line}>
            {saying.line}
          </p>

          {saying.go && (
            <a className="bl-bot-go" href={saying.go.href} onClick={quiet}>
              {saying.go.label} <MarkArrow size={12} />
            </a>
          )}

          {/*
            The questions only appear once it has been opened on purpose.
            A nudge that arrives on its own has said its one thing and
            should not then unfold into a menu.
          */}
          {open && (
            <>
              <p className="bl-bot-rule" aria-hidden="true">
                <i />
                Ask it
                <i />
              </p>

              <ul className="bl-bot-asks">
                {ANSWERS.map((answer, index) => (
                  <li key={answer.ask}>
                    <button
                      type="button"
                      data-on={asked === index ? "true" : undefined}
                      onClick={() => setAsked(asked === index ? null : index)}
                    >
                      {answer.ask}
                    </button>
                  </li>
                ))}
              </ul>

              <p className="bl-bot-count">
                {ACTS.length - unseen.length} of {ACTS.length} acts read
              </p>
            </>
          )}
        </div>
      )}

      <button
        className="bl-bot-dock"
        type="button"
        aria-expanded={open}
        aria-label={`Guide. ${read}% of the log read. ${saying.line}`}
        onClick={() => {
          setOpen((v) => !v);
          setNudging(false);
          setAsked(null);
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
