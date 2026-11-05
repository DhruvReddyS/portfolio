"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

/**
 * One sentence, resolving a word at a time as it goes past.
 *
 * The page says what he has done in eight acts of evidence and never once
 * says what he thinks, which is the thing a reader decides on. This is the
 * one place it does, and it is set to be read slowly: the words arrive dim
 * and come up to full left to right under the scroll, so the sentence is
 * taken a word at a time at the speed the reader is already moving.
 *
 * Scrubbed rather than played. A sentence that animates on its own runs
 * once, at its own pace, probably before you looked at it; tied to the
 * scroll it cannot finish ahead of you, and you can push it back to read a
 * word again.
 *
 * Not pinned. Pinning would hold the page still while the line fills, which
 * is the version of this that fights a thumb on a phone. The words resolve
 * as the line crosses the screen instead, which costs nobody their scroll.
 */
export function Statement({ children, id }: { children: string; id?: string }) {
  const host = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const node = host.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const context = gsap.context(() => {
      gsap.fromTo(
        ".bl-statement-word > span",
        { opacity: 0.16 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.5,
          scrollTrigger: {
            trigger: node,
            // from the line entering the lower third to it leaving the upper
            start: "top 78%",
            end: "bottom 42%",
            scrub: 0.5,
          },
        },
      );
    }, node);

    return () => context.revert();
  }, []);

  const words = children.split(" ");

  return (
    <p className="bl-statement" id={id} ref={host}>
      {words.map((word, index) => (
        // the outer span keeps the word whole across a line break; the
        // inner one is what the scroll actually fades
        <span className="bl-statement-word" key={`${word}-${index}`}>
          <span>{word}</span>
          {index < words.length - 1 ? " " : ""}
        </span>
      ))}
    </p>
  );
}

export default Statement;
