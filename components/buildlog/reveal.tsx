"use client";

import { useEffect, useRef, useState } from "react";
import { whenCurtainOpens } from "@/lib/curtain";

/** Fires once the element has been on screen, then stops observing. */
export function useInView<T extends HTMLElement>(
  options: { threshold?: number; rootMargin?: string; once?: boolean } = {},
) {
  const { threshold = 0.25, rootMargin = "0px 0px -10% 0px", once = true } = options;
  const ref = useRef<T>(null);
  /*
   * Out of view on both sides of the wire.
   *
   * This used to start as `typeof IntersectionObserver === "undefined"`,
   * which is true on the server and false in the browser, so every reveal on
   * the page was server-rendered with data-in="true" and hydrated expecting
   * "false". React reports that mismatch and does not patch attributes, so
   * the DOM kept the server's "true" and not one reveal on this site has ever
   * actually run. They were all simply there.
   *
   * Hiding is behind `@media (scripting: enabled)` in the stylesheet, so a
   * page with no JavaScript shows everything regardless of what this says;
   * a browser with script but no observer is handled below.
   */
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    // script, but no observer to ask: show it as soon as the cover is gone
    if (typeof IntersectionObserver === "undefined") {
      return whenCurtainOpens(() => setInView(true));
    }

    // Everything on the first screen is already intersecting while the cover
    // is up, so without this their transitions are over before the sheet has
    // gone and the hero is simply there when it lifts.
    let release = () => {};

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          release = whenCurtainOpens(() => setInView(true));
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      release();
    };
  }, [threshold, rootMargin, once]);

  return { ref, inView };
}

/**
 * Scroll-in: fade and lift, staggered by index.
 *
 * The hidden state lives in CSS behind the `js` class on <html>, so the
 * server-rendered page is fully visible before (and without) hydration.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article" | "header" | "p";
}) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.12 });

  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      className={["bl-reveal", className].filter(Boolean).join(" ")}
      data-in={inView ? "true" : "false"}
      style={{ "--bl-reveal-delay": `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </Tag>
  );
}

