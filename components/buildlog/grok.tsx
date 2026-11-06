"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { caseFiles, education, logEntries, studio } from "@/lib/portfolio-data";
import type { GrokAnimation } from "./grok-avatar";

const GrokAvatar = dynamic(() => import("./grok-avatar"), {
  ssr: false,
  loading: () => <span className="bl-bot-skeleton" aria-hidden="true" />,
});

/**
 * The guide, which is a face in the corner and nothing else.
 *
 * It has been a progress bar with a face on it, then a panel of
 * questions with a ring and a percentage and a list of chips, and the
 * panel was the problem: a page that is already seven acts of reading
 * does not want an eighth thing to operate in the bottom right corner.
 * Everything that panel offered is a link somewhere on the page
 * already, and the one thing it had that the page did not was the face.
 *
 * So it is the face. It watches which act you are in and says one short
 * thing about it, once, the first time you arrive. It notices the page
 * being thrown about. It gets heavy and goes to sleep if you stop
 * touching anything. It looks up when the pointer comes near it, and it
 * answers being clicked. There is nothing to open and nothing to close.
 */

/** What its face is doing in each act, when nothing else is happening. */
const MOOD: Record<string, GrokAnimation> = {
  log: "searching",
  work: "curious",
  education: "thinking",
  stack: "working",
  wins: "happy",
  studio: "proud",
  contact: "excited",
};

/** The room he is in now, if he is in one. */
const live = logEntries.find((entry) => entry.status === "current");

/*
 * One line per act, said once, the first time it is reached.
 *
 * Every one of them is either a fact counted off the data or a thing
 * the reader can do here that is not obvious from looking. None of
 * them repeats a line the act has already printed: a guide that reads
 * the headline back to you is a guide that wastes the corner it is
 * standing in.
 */
const WORD: Record<string, string> = {
  log: live
    ? `${logEntries.length} rooms down here. ${live.company} is the one he has not left.`
    : `${logEntries.length} rooms down here.`,
  work: `${caseFiles.length} files, and every one of them opens. Press one.`,
  education: `${education[0].short} and ${education[1].short}, in the same weeks. Not one after the other.`,
  stack: "You can pick those up and throw them at each other, by the way.",
  wins: "Drag the line. There are more of them than fit.",
  studio: `Not coursework, this one. ${studio.shipped} builds, ${studio.delivered} delivered.`,
  contact: "Right. This is the part that needs you in it.",
};

/*
 * And what it says if you keep clicking it.
 *
 * In order, so that doing it over and over tells a small story rather
 * than shuffling a bag: surprise, amusement, suspicion, the slow loss
 * of patience, an apology, and then it gives up and enjoys itself.
 */
const POKES: { animation: GrokAnimation; line: string }[] = [
  { animation: "surprised", line: "Oh. Hello." },
  { animation: "laughing", line: "Again? Go on then." },
  { animation: "suspicious", line: "You are not reading any of this, are you." },
  { animation: "playful", line: "Two of us are enjoying this." },
  { animation: "bored", line: "There is a whole log down there, you know." },
  { animation: "angry", line: "Right. That is quite enough of that." },
  { animation: "shy", line: "Sorry. That was uncalled for." },
  { animation: "celebrate", line: "Fine, you win. Go and read something." },
];

export function GrokCompanion({ section }: { section: string }) {
  /** What it is saying, if anything, and why. */
  const [says, setSays] = useState<{ line: string; mood?: GrokAnimation } | null>(
    null,
  );
  /** 0 awake, 1 getting heavy, 2 asleep. Cleared by any interaction. */
  const [still, setStill] = useState(0);
  /** True for a moment after the page is thrown past it. */
  const [rushing, setRushing] = useState(false);
  /** True while the pointer is on it. */
  const [near, setNear] = useState(false);
  /** How many times it has been clicked. */
  const [pokes, setPokes] = useState(0);
  const [poking, setPoking] = useState(false);

  const hush = useRef<number | undefined>(undefined);
  const reacting = useRef<number | undefined>(undefined);
  /** Acts it has already said its piece about. */
  const told = useRef(new Set<string>());

  /** Say one thing, for a while, then stop saying it. */
  const speak = useCallback((line: string, mood: GrokAnimation | undefined, ms: number) => {
    setSays({ line, mood });
    window.clearTimeout(hush.current);
    hush.current = window.setTimeout(() => setSays(null), ms);
  }, []);

  /*
   * A word on arriving somewhere new, once per act per visit, and a
   * beat late so that it lands after the act has, rather than racing
   * the heading onto the screen.
   */
  useEffect(() => {
    const line = WORD[section];
    if (!line || told.current.has(section)) return;

    /*
     * Marked as told when it is actually said, not when it is lined up.
     *
     * Scrolling through the page changes the act several times on the
     * way past, and each change cancels the one before it. Marking the
     * act on the way in meant every act was ticked off by a reader
     * going down the page at any speed at all, and it then had nothing
     * to say anywhere. It has to get the words out first.
     */
    const wait = window.setTimeout(() => {
      told.current.add(section);
      speak(line, MOOD[section], 6000);
    }, 1400);

    return () => window.clearTimeout(wait);
  }, [section, speak]);

  /*
   * It gets heavy, then it goes under, and any touch brings it back. A
   * face that is wide awake in the corner of a long page is a face that
   * is staring.
   */
  useEffect(() => {
    const heavy: number[] = [];

    const wake = () => {
      setStill(0);
      heavy.forEach(window.clearTimeout);
      heavy.length = 0;
      heavy.push(window.setTimeout(() => setStill(1), 22000));
      heavy.push(window.setTimeout(() => setStill(2), 40000));
    };

    wake();
    const events: (keyof WindowEventMap)[] = ["scroll", "pointerdown", "keydown"];
    events.forEach((e) => window.addEventListener(e, wake, { passive: true }));
    return () => {
      heavy.forEach(window.clearTimeout);
      events.forEach((e) => window.removeEventListener(e, wake));
    };
  }, []);

  /* and it notices being thrown down the page, which is the one thing a
     reader does that a face in the corner could plausibly react to */
  useEffect(() => {
    let was = window.scrollY;
    let when = performance.now();
    let calm = 0;

    const onScroll = () => {
      const now = performance.now();
      const gap = now - when;
      if (gap < 40) return;
      const speed = Math.abs(window.scrollY - was) / gap;
      was = window.scrollY;
      when = now;

      if (speed < 2.4) return;
      setRushing(true);
      window.clearTimeout(calm);
      calm = window.setTimeout(() => setRushing(false), 900);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(calm);
    };
  }, []);

  useEffect(
    () => () => {
      window.clearTimeout(hush.current);
      window.clearTimeout(reacting.current);
    },
    [],
  );

  /* a click: the next reaction, held long enough to be read */
  const prod = useCallback(() => {
    const next = POKES[pokes % POKES.length];
    setPokes((n) => n + 1);
    setPoking(true);
    window.clearTimeout(reacting.current);
    reacting.current = window.setTimeout(() => setPoking(false), 2600);
    speak(next.line, next.animation, 2600);
  }, [pokes, speak]);

  /*
   * Which claim on its face wins.
   *
   * Being clicked beats everything, because that is the one thing the
   * reader did on purpose to the face itself. Then whatever it is
   * saying. Then the pointer arriving near it, then sleep, then the
   * page being thrown, and last the act it is standing in.
   */
  const mood: GrokAnimation = poking
    ? POKES[(pokes - 1 + POKES.length) % POKES.length].animation
    : (says?.mood ??
      (near
        ? "listening"
        : still === 2
          ? "sleeping"
          : still === 1
            ? "drowsy"
            : rushing
              ? "surprised"
              : (MOOD[section] ?? "idle")));

  const avatar = useMemo(
    () => <GrokAvatar animation={mood} size="100%" ariaLabel="" />,
    [mood],
  );

  /* Never over the hero, where the credentials live in that corner. */
  const here = section !== "hero";

  return (
    <div className="bl-bot" data-showing={here} data-quiet={!says || undefined}>
      {says && here && (
        <p className="bl-bot-puff" key={says.line} role="status">
          {says.line}
        </p>
      )}

      <button
        className="bl-bot-dock"
        type="button"
        aria-label="The guide. Click it."
        onClick={prod}
        onPointerEnter={() => setNear(true)}
        onPointerLeave={() => setNear(false)}
        data-poked={poking || undefined}
      >
        <span className="bl-bot-body" data-asleep={still === 2 || undefined}>
          {avatar}
        </span>
      </button>
    </div>
  );
}
