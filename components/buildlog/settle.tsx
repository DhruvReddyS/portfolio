"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

/**
 * A paragraph that arrives in pieces and sets itself straight.
 *
 * Every word starts out over-size, tilted off the baseline one way and
 * then the other, nudged down and lit in the accent, so before the
 * reader gets to it the block is a heap of type rather than a sentence.
 * As the scroll reaches each word it comes down to full size, turns
 * level and cools into the page's ink, and the heap resolves into a
 * paragraph from the first word to the last.
 *
 * The point of the oversize is the overlap: at 1.14 the words are wider
 * than their own slots, so the unsettled state genuinely crowds, which
 * is what makes the settling read as the sentence finding its spacing
 * rather than as type fading up.
 *
 * Different from the statement before the log on purpose, which goes
 * from out of focus to sharp. Two scroll-read paragraphs on one page
 * have to arrive by different routes or the second is a rerun.
 */
export function Settle({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  const host = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const node = host.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const context = gsap.context(() => {
      const words = gsap.utils.toArray<HTMLElement>(".bl-settle-word > span");
      if (!words.length) return;

      gsap.fromTo(
        words,
        {
          yPercent: 11,
          rotate: (index: number) => (index % 2 ? 5 : -5),
          scale: 1.14,
          color: "var(--bl-accent)",
        },
        {
          yPercent: 0,
          rotate: 0,
          scale: 1,
          color: "var(--bl-ink)",
          ease: "none",
          stagger: { each: 0.35 },
          scrollTrigger: {
            trigger: node,
            start: "top 86%",
            end: "bottom 52%",
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        },
      );
    }, node);

    return () => context.revert();
  }, [children]);

  const words = children.split(" ");

  return (
    <p className={["bl-settle", className].filter(Boolean).join(" ")} ref={host}>
      {words.map((word, index) => (
        /* the outer span holds the word together across a line break; the
           inner one is the thing that turns, scales and cools */
        <span className="bl-settle-word" key={`${word}-${index}`}>
          <span>{word}</span>
          {index < words.length - 1 ? " " : ""}
        </span>
      ))}
    </p>
  );
}

export default Settle;
