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
 */

/** A small deterministic wobble in [0, 1) for word `i`. */
const wobble = (i: number, salt: number) =>
  ((Math.sin((i + 1) * salt) + 1) / 2) % 1;

export function Settle({
  children,
  className,
  as = "p",
  id,
}: {
  children: string;
  className?: string;
  /** The element the words are set in. */
  as?: "p" | "blockquote";
  id?: string;
}) {
  const host = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = host.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const context = gsap.context(() => {
      const words = gsap.utils.toArray<HTMLElement>(".bl-settle-word > span");
      if (!words.length) return;

      const line = gsap.timeline({
        scrollTrigger: {
          trigger: node,
          start: "top 88%",
          end: "bottom 48%",
          scrub: 0.6,
          invalidateOnRefresh: true,
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
          ease: "none",
          stagger: { each: 0.34 },
        },
        0,
      );

      /* the focus arriving a beat behind the position */
      line.fromTo(
        words,
        { filter: "blur(4px)" },
        { filter: "blur(0px)", ease: "none", stagger: { each: 0.34 } },
        0.4,
      );

      /*
       * And the light coming off it last, so the band of accent lags the
       * band of movement and the paragraph is lit where it is being read
       * rather than where it is being assembled.
       */
      line.fromTo(
        words,
        { color: "var(--bl-accent)" },
        { color: "var(--bl-ink)", ease: "none", stagger: { each: 0.34 } },
        0.9,
      );
    }, node);

    return () => context.revert();
  }, [children]);

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
