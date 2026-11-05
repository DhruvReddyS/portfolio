"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

/**
 * A paragraph read under a ruler.
 *
 * The part you have reached is in full ink; the part below it is still
 * under a veil of the page's own ground, with a thin accent rule lying
 * across the line you are on. Scroll and the rule travels down the
 * block, the veil goes with it, and the paragraph is uncovered a line
 * at a time in exactly the order anybody would read it.
 *
 * Which is the point of doing it this way rather than the way the
 * statement before the log arrives. That one works on the words: they
 * come in crowded and tilted and straighten out. This one never touches
 * the type at all, it only moves a light across it, so the two acts
 * read as two different things happening and not as one effect used
 * twice. A page that answers every paragraph the same way has one idea.
 *
 * One text node, no second copy. The veil and the rule are both drawn
 * by the element's own pseudo-elements off a single custom property, so
 * what a screen reader gets, what a search engine gets and what somebody
 * with JavaScript switched off gets is the paragraph, in full ink,
 * with nothing in front of it.
 */
export function Ruler({
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
      /*
       * Where each line of the paragraph ends.
       *
       * The rule has to lie between two lines and not through one. A
       * percentage of the block's height does not know where the lines
       * are, so at most scroll positions it came down as a strikethrough
       * across whatever word happened to be at that height. A range over
       * the paragraph's own contents hands back one rectangle per line
       * box, which is the only thing that does know.
       */
      let stops: number[] = [0];
      /** The last progress seen, so a relayout can put the rule back. */
      let at = 0;

      const rule = () => {
        const range = document.createRange();
        range.selectNodeContents(node);
        const box = node.getBoundingClientRect();
        const lines = [...range.getClientRects()].filter(
          (rect) => rect.height > 1 && rect.width > 1,
        );

        stops = [0];
        for (const line of lines) {
          const foot = line.bottom - box.top;
          /* one entry per line, not one per text fragment: a line split
             by markup comes back as two rectangles at the same height */
          if (foot - stops[stops.length - 1] > 2) stops.push(foot);
        }
        if (stops.length < 2) stops = [0, box.height];
      };

      /** The foot of whichever line the scroll has finished. */
      const put = (progress: number) => {
        at = progress;
        const last = stops.length - 1;
        const index = Math.max(
          0,
          Math.min(last, Math.floor(progress * last + 0.0001)),
        );
        node.style.setProperty("--read", `${stops[index].toFixed(1)}px`);
        node.dataset.reading =
          progress > 0.002 && progress < 0.998 ? "true" : "false";
      };

      rule();
      put(0);

      gsap.to(
        {},
        {
          scrollTrigger: {
            trigger: node,
            /* begins as the first line clears the fold and is finished by
               the time the last line is in the comfortable middle of the
               screen, so the rule is never still while the block is in
               front of somebody */
            start: "top 84%",
            end: "bottom 56%",
            scrub: true,
            invalidateOnRefresh: true,
            onRefresh: (self) => {
              rule();
              put(self.progress);
            },
            onUpdate: (self) => put(self.progress),
          },
        },
      );

      /*
       * The lines move when the column is resized and when the face
       * finishes loading, and both of those change where the rule
       * belongs without changing the scroll. Measured again and put
       * back where it was; no global refresh, which from inside an
       * observer on the thing being measured is a loop.
       */
      const watch = new ResizeObserver(() => {
        rule();
        put(at);
      });
      watch.observe(node);

      return () => watch.disconnect();
    }, node);

    return () => {
      context.revert();
      delete node.dataset.reading;
    };
  }, [children]);

  return (
    <p className={["bl-ruler", className].filter(Boolean).join(" ")} ref={host}>
      {children}
    </p>
  );
}

export default Ruler;
