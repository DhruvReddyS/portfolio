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
 * of patience, an apology, a truce, and then it gives up and enjoys
 * itself. The register is the page's own, which is dry: a guide that
 * tells jokes is unbearable, and one that is quietly unimpressed with
 * you is funny for as long as you keep going.
 */
const POKES: { animation: GrokAnimation; line: string }[] = [
  { animation: "surprised", line: "Oh. Hello." },
  { animation: "laughing", line: "Again? Go on then." },
  { animation: "curious", line: "You are not reading any of this, are you." },
  { animation: "playful", line: "Two of us are enjoying this. One of us is me." },
  { animation: "bored", line: "There is a whole log down there. Seven acts. All dated." },
  { animation: "suspicious", line: "I am starting to think you came for the button." },
  { animation: "angry", line: "Right. That is quite enough of that." },
  { animation: "shy", line: "Sorry. That was uncalled for." },
  { animation: "confused", line: "Truce?" },
  { animation: "celebrate", line: "Fine. You win. I will just stand here looking pleased." },
];

/*
 * And then the ones nobody is meant to get to, for the reader who
 * keeps going after the story has finished. They are rarer on purpose:
 * the joke is that there is more, not that there is a lot.
 */
const DEEP: { animation: GrokAnimation; line: string }[] = [
  { animation: "bored", line: "You have now clicked me more times than anyone has read act four." },
  { animation: "suspicious", line: "I have twenty-three faces. You have seen most of them." },
  { animation: "playful", line: "This is the most engagement this corner has ever had." },
  { animation: "proud", line: "At this rate I am going on the CV." },
  { animation: "laughing", line: "He built me to answer questions. You have not asked one." },
  { animation: "happy", line: "Genuinely, though. The case files are good. Go on." },
];

/*
 * A word at the quarters, once each. The ring already says how far
 * down you are; this is the part the ring cannot do, which is have an
 * opinion about it.
 */
const MILE: { at: number; animation: GrokAnimation; line: string }[] = [
  { at: 0.25, animation: "curious", line: "A quarter down. The good bit is further in." },
  { at: 0.5, animation: "happy", line: "Halfway. Nobody gets halfway by accident." },
  { at: 0.75, animation: "proud", line: "Three quarters. He is going to be insufferable about this." },
  { at: 0.98, animation: "celebrate", line: "That is the lot. You read a portfolio to the end. Who does that." },
];

/** The one-offs, for the things a reader does that nothing else covers. */
const MOMENT: Record<string, { animation: GrokAnimation; line: string }> = {
  skimmed: {
    animation: "surprised",
    line: "You went straight to the bottom. Bold. There were seven acts.",
  },
  back: { animation: "happy", line: "Oh. You came back." },
  linger: { animation: "shy", line: "Yes? Is there something on my face?" },
  dozing: { animation: "drowsy", line: "Right. I am having a sit down." },
  woken: { animation: "waking", line: "I am up. I am up." },
};

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
  /** The face the last click asked for, held while it is reacting. */
  const [reaction, setReaction] = useState<GrokAnimation>("surprised");
  /** How far down the page the reader has got, 0 to 1. */
  const [through, setThrough] = useState(0);

  const hush = useRef<number | undefined>(undefined);
  const reacting = useRef<number | undefined>(undefined);
  const lingering = useRef<number | undefined>(undefined);
  /** Acts it has already said its piece about. */
  const told = useRef(new Set<string>());
  /** Quarters it has already had an opinion about. */
  const passed = useRef(new Set<number>());
  /** One-offs it has already used up. */
  const spent = useRef(new Set<string>());
  /** Deep cuts already heard, so it works through them rather than
      landing on the same one twice running. */
  const heard = useRef(new Set<number>());

  /** Say one thing, for a while, then stop saying it. */
  const speak = useCallback((line: string, mood: GrokAnimation | undefined, ms: number) => {
    setSays({ line, mood });
    window.clearTimeout(hush.current);
    hush.current = window.setTimeout(() => setSays(null), ms);
  }, []);

  /** One of the one-offs, if it has not been used yet. */
  const moment = useCallback(
    (key: keyof typeof MOMENT, ms = 3400) => {
      if (spent.current.has(key)) return;
      spent.current.add(key);
      const say = MOMENT[key];
      speak(say.line, say.animation, ms);
    },
    [speak],
  );

  /*
   * The quarters, and the reader who went straight past all of them.
   *
   * Held in a ref and called from the scroll frame rather than run as
   * its own effect on `through`, which would be an effect firing on
   * every pixel of a very long page.
   */
  const mark = useCallback(
    (at: number) => {
      for (const stop of MILE) {
        if (at < stop.at || passed.current.has(stop.at)) continue;
        passed.current.add(stop.at);

        /* the bottom, reached by somebody who has not stopped anywhere:
           the only reading of that is a thumb on the scrollbar */
        if (stop.at > 0.9 && told.current.size < 3) {
          moment("skimmed", 4200);
          return;
        }

        speak(stop.line, stop.animation, 4200);
        return;
      }
    },
    [moment, speak],
  );

  /* a click: the next reaction, held long enough to be read, and once
     the story has run out, one of the ones nobody is meant to see */
  const prod = useCallback(() => {
    const done = pokes >= POKES.length;

    let next: { animation: GrokAnimation; line: string };
    if (!done) {
      next = POKES[pokes];
    } else {
      /* work through them rather than landing on the same one twice */
      if (heard.current.size >= DEEP.length) heard.current.clear();
      const left = DEEP.map((_, i) => i).filter((i) => !heard.current.has(i));
      const index = left[Math.floor(Math.random() * left.length)];
      heard.current.add(index);
      next = DEEP[index];
    }

    setPokes((n) => n + 1);
    setPoking(true);
    setReaction(next.animation);
    window.clearTimeout(reacting.current);
    reacting.current = window.setTimeout(() => setPoking(false), 2800);
    speak(next.line, next.animation, 2800);
  }, [pokes, speak]);

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

  /*
   * How far down it is, and how fast it is going.
   *
   * Both come off the same listener because they are the same
   * question asked twice: the ring round the face is where the reader
   * has got to, and the startled look is how quickly they got there.
   * Read on an animation frame rather than on every scroll event,
   * which on a page this long is a great many of them.
   */
  useEffect(() => {
    let was = window.scrollY;
    let when = performance.now();
    let calm = 0;
    let frame = 0;

    const read = () => {
      frame = 0;
      const run = document.documentElement.scrollHeight - window.innerHeight;
      const at = run > 0 ? Math.min(1, Math.max(0, window.scrollY / run)) : 0;
      setThrough(at);
      mark(at);

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

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(read);
    };

    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.clearTimeout(calm);
      if (frame) cancelAnimationFrame(frame);
    };
    /* stable: it is built from two callbacks that are themselves
       stable, so listing it costs nothing and saying so is cheaper
       than a reader wondering whether it was left out on purpose */
  }, [mark]);

  /*
   * Coming back to the tab, which is the one thing a reader does that
   * happens entirely outside the page.
   */
  useEffect(() => {
    const look = () => {
      if (document.visibilityState === "visible") moment("back");
    };
    document.addEventListener("visibilitychange", look);
    return () => document.removeEventListener("visibilitychange", look);
  }, [moment]);

  /*
   * And going under, and coming back up. It says so, because an object
   * that falls asleep without mentioning it has simply stopped.
   */
  useEffect(() => {
    if (still === 1) moment("dozing", 2600);
  }, [still, moment]);

  useEffect(() => {
    window.clearTimeout(hush.current);
    window.clearTimeout(reacting.current);
    window.clearTimeout(lingering.current);
    return () => {
      window.clearTimeout(hush.current);
      window.clearTimeout(reacting.current);
      window.clearTimeout(lingering.current);
    };
  }, []);

  /*
   * Which claim on its face wins.
   *
   * Being clicked beats everything, because that is the one thing the
   * reader did on purpose to the face itself. Then whatever it is
   * saying. Then the pointer arriving near it, then sleep, then the
   * page being thrown, and last the act it is standing in.
   */
  const mood: GrokAnimation = poking
    ? reaction
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
        aria-label={`The guide, ${Math.round(through * 100)}% down the page. Click it.`}
        onClick={prod}
        onPointerEnter={() => {
          setNear(true);
          /* standing over it without pressing it is its own thing */
          window.clearTimeout(lingering.current);
          lingering.current = window.setTimeout(() => moment("linger"), 2600);
        }}
        onPointerLeave={() => {
          setNear(false);
          window.clearTimeout(lingering.current);
        }}
        data-poked={poking || undefined}
      >
        {/* the rim is how far down the page the reader has got */}
        <svg className="bl-bot-ring" viewBox="0 0 44 44" aria-hidden="true">
          <circle className="bl-bot-ring-track" cx="22" cy="22" r="20" />
          <circle
            className="bl-bot-ring-fill"
            cx="22"
            cy="22"
            r="20"
            style={{ strokeDashoffset: 125.6 * (1 - through) }}
          />
        </svg>

        <span className="bl-bot-body" data-asleep={still === 2 || undefined}>
          {avatar}
        </span>
      </button>

      <span className="bl-bot-read" aria-hidden="true">
        {Math.round(through * 100)}%
      </span>
    </div>
  );
}
