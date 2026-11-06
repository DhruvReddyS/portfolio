"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import {
  awards,
  caseFiles,
  education,
  logEntries,
  profile,
  sections,
  studio,
} from "@/lib/portfolio-data";
import { MarkArrow } from "./marks";
import type { GrokAnimation } from "./grok-avatar";

const GrokAvatar = dynamic(() => import("./grok-avatar"), {
  ssr: false,
  loading: () => <span className="bl-bot-skeleton" aria-hidden="true" />,
});

/**
 * The guide, which answers questions rather than announcing itself.
 *
 * It began as a progress bar with a face on it, waiting for you to go
 * still and then telling you which act you had not reached. Then it
 * became a short list of the questions a stranger actually arrives
 * with, which was better and still had two things wrong with it.
 *
 * The first was that it typed its own facts. It told people there were
 * thirty-one tools in the heap for a week after the heap stopped being
 * thirty-one, and nothing in the build would ever have caught it,
 * because a hand-written sentence about the data is not the data.
 * Everything it says is now computed from the same source the acts are
 * drawn from, so the only way for it to go stale is for the page to go
 * stale with it.
 *
 * The second was that it did not know where you were standing. It had
 * the current act the whole time and used it for nothing but a nudge.
 * The first thing it offers now is a question about the act in front of
 * you, answered out of that act's own entries, so a reader in the case
 * files is handed the case files and a reader at the studio is handed
 * the studio. The four standing questions keep their place underneath.
 */

type Answer = {
  /** What the visitor presses. */
  ask: string;
  /** What it says back, which has to be true and has to be short. */
  line: string;
  go?: { label: string; href: string };
  animation: GrokAnimation;
};

const ACTS = sections.map((item) => item.id);

/** The room he is in now, if he is in one. */
const live = logEntries.find((entry) => entry.status === "current");

/*
 * The question that belongs to whatever is on screen, answered out of
 * that act's own entries. Null for the acts where the page is already
 * saying the only thing worth saying.
 */
function forAct(id: string, pick: number): Answer | null {
  switch (id) {
    case "log":
      return {
        ask: "What were these?",
        line: live
          ? `${logEntries.length} rooms. ${live.company} is the one still running: ${live.headline}`
          : `${logEntries.length} rooms, four companies and a research lab.`,
        animation: "searching",
      };

    case "work": {
      const file = caseFiles[pick % caseFiles.length];
      return {
        ask: "Which one first?",
        line: `${file.name}. ${file.thesis}`,
        go: { label: "Open it", href: "#work" },
        animation: "proud",
      };
    }

    case "education":
      return {
        ask: "Two at once, really?",
        line: `${education[0].short} at ${education[0].mark.value} ${education[0].mark.label}, and ${education[1].short} with ${education[1].mark.value} ${education[1].mark.label}. The same weeks, not one after the other.`,
        animation: "surprised",
      };

    case "stack":
      return {
        ask: "Has he used all of it?",
        line: "Every one of them has shipped inside something else on this page. That is the only endorsement any of them gets here.",
        animation: "working",
      };

    case "wins":
      return {
        ask: "What did he actually win?",
        line: `${awards[0].title}: ${awards[0].place}. ${awards.length} pinned up in all.`,
        go: { label: "Read it", href: "#wins" },
        animation: "celebrate",
      };

    case "studio":
      return {
        ask: "Is the studio real?",
        line: `${studio.shipped} builds, ${studio.delivered} delivered, and two of the people paying for them are in the United States.`,
        go: { label: "Visit it", href: studio.site },
        animation: "proud",
      };

    case "contact":
      return {
        ask: "How fast does he reply?",
        line: "Within a day, usually sooner. Send the hard part rather than the job title.",
        animation: "excited",
      };

    default:
      return null;
  }
}

/*
 * And the four a stranger arrives with, in the order they arrive: can I
 * hire him, what is he, what has he made, and has anybody else paid for
 * it. Pressing the third one again moves to the next build, which is the
 * only thing in here worth pressing twice.
 */
function standing(pick: number): Answer[] {
  const file = caseFiles[pick % caseFiles.length];

  return [
    {
      ask: "Is he free?",
      line: `Open to work, from ${profile.location} or remote, and he answers inside a day.`,
      go: { label: "Write to him", href: "#contact" },
      animation: "excited",
    },
    {
      ask: "What is he best at?",
      line: "Full stack, with applied AI on top. Everything in the heap has shipped inside something else on this page.",
      go: { label: "See the heap", href: "#stack" },
      animation: "thinking",
    },
    {
      ask: "Show me one thing",
      line: `${file.name}. ${file.thesis}`,
      go: { label: `All ${caseFiles.length} case files`, href: "#work" },
      animation: "playful",
    },
    {
      ask: "Has anyone paid him?",
      line: `${studio.delivered} delivered out of ${studio.shipped}, through a studio he founded and still runs.`,
      go: { label: "See the studio", href: "#studio" },
      animation: "curious",
    },
  ];
}

export function GrokCompanion({ section }: { section: string }) {
  const [seen, setSeen] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [nudging, setNudging] = useState(false);
  /**
   * Which question is being answered, and which act it was asked in.
   *
   * The act it was asked in is carried with it so that moving to
   * another one drops the selection by arithmetic rather than by an
   * effect reaching back in to clear it: a different act offers a
   * different first question, and an index kept across the change
   * points at the wrong one.
   */
  const [asked, setAsked] = useState<{ at: string; of: number } | null>(null);
  /** Which build it is offering. Pressing for another moves it on. */
  const [pick, setPick] = useState(0);
  /** True once the log has run out above the last page. */
  const [ending, setEnding] = useState(false);
  const idle = useRef<number | undefined>(undefined);
  /** How many times it has spoken up uninvited. Two is the ration. */
  const spoke = useRef(0);

  // Remember every act that has been reached.
  useEffect(() => {
    if (section === "top" || !ACTS.includes(section)) return;
    queueMicrotask(() =>
      setSeen((prev) => (prev.includes(section) ? prev : [...prev, section])),
    );
  }, [section]);

  const unseen = ACTS.filter((id) => !seen.includes(id));
  const read = Math.round(((ACTS.length - unseen.length) / ACTS.length) * 100);

  /*
   * It speaks up after a pause, and only twice in a visit.
   *
   * It used to do this every nine seconds of stillness, for ever. On a
   * page this long, stillness is what reading looks like: the reader
   * stops to take in an act and gets interrupted for it, again and
   * again, by a card over the bottom right corner of whatever they
   * were reading.
   */
  useEffect(() => {
    const wake = () => {
      setNudging(false);
      window.clearTimeout(idle.current);
      if (open || spoke.current >= 2) return;
      idle.current = window.setTimeout(() => {
        spoke.current += 1;
        setNudging(true);
      }, 14000);
    };

    wake();
    const events: (keyof WindowEventMap)[] = ["scroll", "pointerdown", "keydown"];
    events.forEach((e) => window.addEventListener(e, wake, { passive: true }));
    return () => {
      window.clearTimeout(idle.current);
      events.forEach((e) => window.removeEventListener(e, wake));
    };
  }, [open]);

  /*
   * And it stands down over the last page, where every line is already
   * a way to reach him.
   *
   * Measured off the foot of <main> rather than off the footer itself,
   * which cannot be watched for this: the footer is pinned to the
   * bottom of the window for the whole of the page so that the log can
   * slide off it, so it is technically on screen from the first scroll
   * and an observer on it reports the end of the page at the start of
   * it. What actually says the footer is showing is the log running out
   * above it.
   */
  useEffect(() => {
    const log = document.querySelector<HTMLElement>(".bl-main");
    if (!log) return;

    let frame = 0;
    const look = () => {
      frame = 0;
      setEnding(log.getBoundingClientRect().bottom <= window.innerHeight - 40);
    };
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(look);
    };

    look();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  /* the act's own question first, then the four anybody would ask */
  const asks = useMemo(() => {
    const here = forAct(section, pick);
    return here ? [here, ...standing(pick)] : standing(pick);
  }, [section, pick]);

  /** What it says when nobody has asked it anything. */
  const resting = useMemo<Answer>(() => {
    if (unseen.length === 0) {
      return {
        ask: "",
        line: "That is the whole log, all seven. The only thing left is the part that needs you in it.",
        go: { label: "Go to the close", href: "#contact" },
        animation: "celebrate",
      };
    }
    if (seen.length === 0) {
      return {
        ask: "",
        line: `${ACTS.length} acts down there. Ask me something, or I will keep count.`,
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

  const picked = asked && asked.at === section ? asked.of : null;
  const saying = picked === null ? resting : (asks[picked] ?? resting);

  const avatar = useMemo(
    () => <GrokAvatar animation={saying.animation} size="100%" ariaLabel="" />,
    [saying.animation],
  );

  const quiet = useCallback(() => {
    setNudging(false);
    setOpen(false);
    setAsked(null);
  }, []);

  /* Never over the hero, where the credentials live in that corner,
     and never over the last page, which is nothing but ways to reach
     him already. */
  const showing = (open || nudging) && section !== "hero" && !ending;

  return (
    <div className="bl-bot" data-showing={showing} data-open={open || undefined}>
      {showing && (
        <div className="bl-bot-card" role="status">
          <p className="bl-bot-say" key={saying.line}>
            {saying.line}
          </p>

          {saying.go && (
            <a
              className="bl-bot-go"
              href={saying.go.href}
              target={saying.go.href.startsWith("#") ? undefined : "_blank"}
              rel={saying.go.href.startsWith("#") ? undefined : "noreferrer"}
              onClick={quiet}
            >
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
                {asks.map((answer, index) => (
                  <li key={answer.ask}>
                    <button
                      type="button"
                      data-on={picked === index ? "true" : undefined}
                      onClick={() => {
                        /* pressing the one already open asks it again,
                           which for the two that offer a build means
                           the next build rather than nothing */
                        if (picked === index) {
                          if (/one|first/i.test(answer.ask)) setPick((n) => n + 1);
                          else setAsked(null);
                          return;
                        }
                        setAsked({ at: section, of: index });
                      }}
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
        aria-label={open ? "Close the guide" : "Open the guide"}
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
