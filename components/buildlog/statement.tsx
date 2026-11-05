"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

/**
 * One sentence, read to you at the speed you are already going.
 *
 * The page says what he has done in seven acts of evidence and never once
 * says what he thinks, which is the thing a reader decides on. This is the
 * one place it does, and it is set to be read rather than seen: the words
 * arrive out of focus, come up sharp one at a time as the scroll reaches
 * them, catch the light for a moment, and settle. What that is imitating is
 * the eye moving along a line, which is what makes it feel like reading and
 * not like a heading animating.
 *
 * Three things happen to each word and they are deliberately out of step: it
 * sharpens, then it lights, then it cools. A word that did all three at once
 * would be a word fading in.
 *
 * Scrubbed rather than played. A sentence that animates on its own runs once,
 * at its own pace, probably before you looked at it; tied to the scroll it
 * cannot finish ahead of you, and you can push it back to read a word again.
 *
 * Not pinned. Pinning would hold the page still while the line fills, which
 * is the version of this that fights a thumb on a phone.
 */
export function Statement({
  children,
  id,
  cite,
}: {
  children: string;
  id?: string;
  /** The small line under it, if the quote wants signing. */
  cite?: string;
}) {
  const host = useRef<HTMLQuoteElement>(null);

  useEffect(() => {
    const node = host.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const context = gsap.context(() => {
      const words = gsap.utils.toArray<HTMLElement>(".bl-statement-word > span");
      if (!words.length) return;

      const line = gsap.timeline({
        scrollTrigger: {
          trigger: node,
          /* from the line entering the lower third to it leaving the upper */
          start: "top 80%",
          end: "bottom 46%",
          scrub: 0.5,
          invalidateOnRefresh: true,
        },
      });

      /* out of focus and dark, to sharp: the word arriving */
      line.fromTo(
        words,
        { opacity: 0.12, filter: "blur(7px)" },
        {
          opacity: 1,
          filter: "blur(0px)",
          ease: "none",
          stagger: { each: 0.4 },
        },
        0,
      );

      /*
       * And the light coming off it a beat later. Each word is handed over
       * in the accent and cools into the page's ink behind the reader, so
       * what travels along the sentence is a lit band three or four words
       * wide rather than a hard edge.
       */
      line.fromTo(
        words,
        { color: "var(--bl-accent)" },
        {
          color: "var(--bl-ink)",
          ease: "none",
          stagger: { each: 0.4 },
        },
        0.95,
      );
    }, node);

    return () => context.revert();
  }, []);

  const words = children.split(" ");

  return (
    <figure className="bl-saybox">
      <blockquote className="bl-statement" id={id} ref={host}>
        {words.map((word, index) => (
          /* the outer span keeps the word whole across a line break; the
             inner one is what the scroll actually works on */
          <span className="bl-statement-word" key={`${word}-${index}`}>
            <span>{word}</span>
            {index < words.length - 1 ? " " : ""}
          </span>
        ))}
      </blockquote>

      {cite && (
        <figcaption className="bl-saycite">
          <i aria-hidden="true" />
          {cite}
        </figcaption>
      )}
    </figure>
  );
}

export default Statement;
