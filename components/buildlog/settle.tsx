"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

/**
 * A paragraph that arrives as a heap of type and sets itself straight.
 *
 * Every word starts over-size, tilted off the baseline, pushed out of
 * its own slot and lit in the accent, so before the reader gets to it
 * the block genuinely crowds: at this scale the words are wider than the
 * spaces they belong in and they overlap each other. As the scroll
 * reaches each one it comes down to full size, turns level, slides back
 * into its place and cools into the page's ink, and the heap resolves
 * into a sentence from the first word to the last.
 *
 * The overlap is the whole trick. Without the oversize this is type
 * fading up; with it, the settling reads as the sentence finding its own
 * spacing, which is why it feels like reading rather than watching.
 *
 * Four things move and they are deliberately uneven:
 *
 *   the tilt alternates, but not by the same amount twice running, so
 *   the heap looks spilled rather than fanned;
 *   the drop and the sideways shove vary with the word's place in the
 *   line, so no two settle along the same path;
 *   the focus comes in a beat behind the position, which is what stops
 *   the whole thing reading as one rigid object being nudged;
 *   and the colour cools last, so what travels along the paragraph is a
 *   lit band a few words wide rather than a hard edge.
 *
 * All of it off deterministic arithmetic on the index rather than
 * Math.random, so a word settles the same way every time the reader
 * scrolls back over it.
 *
 * ---------------------------------------------------------------------
 *
 * Three things were making it stutter, and all three are about how often
 * the browser is asked to do work rather than about what it is asked to
 * draw.
 *
 * The blur was the expensive one by a distance. Measured over the same
 * stretch of scroll, with it animating continuously: a median frame of
 * 16.9ms and a worst of 163. With it off: 10.5 and 40, and 60% more
 * frames drawn over the same distance. A blur on display type a hundred
 * pixels tall is a full repaint of the word, and it was being asked for
 * on every frame of the scroll.
 *
 * It is still there, and it still looks the same. It just moves in whole
 * pixels now: four steps from four to zero, and the filter is written
 * only on the frames where the step actually changes, which is four
 * frames per word out of the few hundred the band takes to cross. At a
 * hundred-pixel type size, a pixel of blur either way is not a thing the
 * eye can find; the repaint it costs is.
 *
 * The second was the shape of the band. A word took half a beat to land
 * and the next started a third of a beat later, so barely more than one
 * word was ever moving: the sentence arrived as a row of separate little
 * events. A word now takes about four times as long as the gap to the
 * one behind it, so four or five are in the air at once and what crosses
 * the paragraph is a wave rather than a queue. Nothing moves faster; it
 * overlaps, which is the whole difference between a stutter and a flow.
 *
 * And the third: each word used to travel at a constant speed and stop
 * dead on arrival, because a scrubbed tween is usually written linear so
 * the scroll alone sets the pace. The scroll still sets the pace of the
 * band, but each word now eases into its own slot, so it arrives the way
 * a thrown thing lands instead of the way a lift stops.
 */

/** A small deterministic wobble in [0, 1) for word `i`. */
const wobble = (i: number, salt: number) =>
  ((Math.sin((i + 1) * salt) + 1) / 2) % 1;

/** How far out of focus a word starts, in whole pixels. */
const SOFT = 4;

/** How many stops there are between the accent and the ink. */
const STOPS = 32;

/** A CSS colour read off the page, as three numbers. Hex only, which is
    what this page's two type colours are; anything else takes the
    fallback rather than a guess. */
function tint(value: string, fallback: [number, number, number]) {
  const hex = value.trim();
  const short = /^#([0-9a-f])([0-9a-f])([0-9a-f])$/i.exec(hex);
  const long = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex);
  if (long) return [1, 2, 3].map((i) => parseInt(long[i], 16)) as [number, number, number];
  if (short) return [1, 2, 3].map((i) => parseInt(short[i] + short[i], 16)) as [number, number, number];
  return fallback;
}

/** One channel, part of the way between two of them. */
const blend = (from: number, to: number, at: number) =>
  Math.round(from + (to - from) * at);

/**
 * The band, in timeline beats.
 *
 * `BAND` is the whole crossing and `HOLD` is one word's own journey, so
 * the gap between two words falls out of the sentence's length rather
 * than being fixed. A seven-word line and a twenty-word one therefore
 * take the same amount of scroll, and the wave is the same thickness in
 * both: it is the step between words that gets shorter, which is what a
 * longer sentence read at the same speed actually does.
 */
const BAND = 3;
const HOLD = 1.25;

export function Settle({
  children,
  className,
  as = "p",
  id,
  lit = 0,
}: {
  children: string;
  className?: string;
  /** The element the words are set in. */
  as?: "p" | "blockquote";
  id?: string;
  /**
   * How many words at the end keep the accent instead of cooling into
   * the ink. For a sentence whose second half is the argument: the
   * claim stays lit and the setup settles back into the page.
   */
  lit?: number;
}) {
  const host = useRef<HTMLElement>(null);
  /* both painters, once the effect has built them */
  const paintAll = useRef<() => void>(() => {});

  useEffect(() => {
    const node = host.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const context = gsap.context(() => {
      const words = gsap.utils.toArray<HTMLElement>(".bl-settle-word > span");
      if (!words.length) return;

      const step = words.length > 1 ? (BAND - HOLD) / (words.length - 1) : 0;
      const stagger = { each: step } as const;

      /*
       * The focus is tweened on plain numbers rather than on the words,
       * and only reaches the page when one of them crosses a whole
       * pixel. `shown` is what each word is currently wearing, so the
       * comparison is against the DOM's actual state and not against
       * the previous frame's intention: scrubbing backwards repaints
       * exactly as rarely as scrubbing forwards.
       */
      const focus = words.map(() => ({ px: SOFT }));
      const shown = words.map(() => -1);

      const paint = () => {
        for (let i = 0; i < words.length; i++) {
          const px = Math.round(focus[i].px);
          if (px === shown[i]) continue;
          shown[i] = px;
          words[i].style.filter = px > 0 ? `blur(${px}px)` : "none";
        }
      };

      paint();

      const line = gsap.timeline({
        onUpdate: () => paintAll.current(),
        scrollTrigger: {
          trigger: node,
          start: "top 86%",
          end: "bottom 50%",
          /*
           * A little heavier than it was. The scrub is the only damping
           * between a notched mouse wheel and seven words moving: at
           * 0.6 a single notch still arrived as a shove, and the band
           * jumped a word at a time with the wheel instead of running
           * under it.
           */
          scrub: 0.9,
          invalidateOnRefresh: true,
          /*
           * The layers are asked for while the band is crossing and
           * given back afterwards. Held permanently, seven words of
           * display type sit in their own compositor layers for the
           * whole length of the page for the sake of three seconds of
           * scroll.
           */
          onToggle: (self) =>
            gsap.set(words, { willChange: self.isActive ? "transform" : "auto" }),
        },
      });

      /* out of its slot, over-size and tilted: the word before it lands */
      line.fromTo(
        words,
        {
          yPercent: (i: number) => 12 + wobble(i, 1.7) * 10,
          xPercent: (i: number) => (i % 2 ? -1 : 1) * (2 + wobble(i, 2.3) * 5),
          rotate: (i: number) => (i % 2 ? 1 : -1) * (3.5 + wobble(i, 1.1) * 5),
          scale: 1.16,
        },
        {
          yPercent: 0,
          xPercent: 0,
          rotate: 0,
          scale: 1,
          duration: HOLD,
          /* eased into its own slot rather than stopped in it */
          ease: "power2.out",
          force3D: true,
          stagger,
        },
        0,
      );

      /* the focus arriving a beat behind the position */
      line.fromTo(
        focus,
        { px: SOFT },
        { px: 0, duration: HOLD, ease: "power1.out", stagger },
        0.22,
      );

      /*
       * And the light coming off it last, so the band of accent lags the
       * band of movement and the paragraph is lit where it is being read
       * rather than where it is being assembled.
       *
       * The two colours are read off the page once and handed over as
       * numbers. They used to be handed over as `var(--bl-accent)` and
       * `var(--bl-ink)`, which worked on most loads and silently did not
       * on some: where the variable failed to resolve at the moment the
       * tween recorded its start, the start became transparent, and what
       * travelled along the sentence was a band of *invisible* words
       * fading up into the ink rather than a band of accent cooling into
       * it. The word's own measured colour was rgba(60, 59, 57, 0.247),
       * which is ink at a quarter: exactly what you get interpolating
       * out of nothing instead of out of the accent.
       *
       * And, like the focus, it is written in steps rather than on every
       * frame: thirty-two stops between the two colours, which is finer
       * than the eye can follow at the speed a word crosses, and about
       * a thirtieth of the repaints.
       */
      const held = words.length - Math.max(0, lit);
      const face = getComputedStyle(node);
      const hot = tint(face.getPropertyValue("--bl-accent"), [224, 90, 43]);
      const cold = tint(face.getPropertyValue("--bl-ink"), [243, 241, 234]);

      const cool = words.map(() => ({ at: 0 }));
      const inked = words.map(() => -1);

      const stain = () => {
        for (let i = 0; i < words.length; i++) {
          /* the words that carry the claim never cool: they arrive in
             the accent with the rest and are simply the ones left lit
             when the band has gone past */
          if (i >= held) continue;
          const step = Math.round(cool[i].at * STOPS);
          if (step === inked[i]) continue;
          inked[i] = step;
          const t = step / STOPS;
          words[i].style.color = `rgb(${blend(hot[0], cold[0], t)}, ${blend(
            hot[1],
            cold[1],
            t,
          )}, ${blend(hot[2], cold[2], t)})`;
        }
      };

      /* every word lit before anything moves, including the ones the
         band has not reached and the ones it never cools */
      gsap.set(words, { color: `rgb(${hot[0]}, ${hot[1]}, ${hot[2]})` });
      stain();

      line.to(cool, { at: 1, duration: HOLD, ease: "none", stagger }, 0.62);

      paintAll.current = () => {
        paint();
        stain();
      };
    }, node);

    return () => {
      context.revert();
      gsap.set(".bl-settle-word > span", { clearProps: "filter,color" });
    };
  }, [children, lit]);

  const words = children.split(" ");
  const Tag = as;

  return (
    <Tag
      className={["bl-settle", className].filter(Boolean).join(" ")}
      id={id}
      ref={host as React.Ref<HTMLParagraphElement & HTMLQuoteElement>}
    >
      {words.map((word, index) => (
        /* the outer span holds the word together across a line break; the
           inner one is the thing that turns, scales, sharpens and cools */
        <span className="bl-settle-word" key={`${word}-${index}`}>
          <span>{word}</span>
          {index < words.length - 1 ? " " : ""}
        </span>
      ))}
    </Tag>
  );
}

export default Settle;
