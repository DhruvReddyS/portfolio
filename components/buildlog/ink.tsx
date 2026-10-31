"use client";

import { useEffect, useRef, useState } from "react";
import type { RoughAnnotation, RoughAnnotationType } from "rough-notation/lib/model";
import { useLamp } from "./lamp";

/** Fires once the element has been on screen, then stops observing. */
export function useInView<T extends HTMLElement>(
  options: { threshold?: number; rootMargin?: string; once?: boolean } = {},
) {
  const { threshold = 0.25, rootMargin = "0px 0px -10% 0px", once = true } = options;
  const ref = useRef<T>(null);
  // Without an observer there is nothing to wait for, so start visible.
  const [inView, setInView] = useState(
    () => typeof IntersectionObserver === "undefined",
  );

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return { ref, inView };
}

type InkProps = {
  children: React.ReactNode;
  type?: RoughAnnotationType;
  /** ms to wait after the text enters view before the stroke starts drawing. */
  delay?: number;
  duration?: number;
  strokeWidth?: number;
  padding?: number | [number, number, number, number];
  iterations?: number;
  /** Use the warm secondary ink instead of the primary. */
  alt?: boolean;
  color?: string;
  className?: string;
  multiline?: boolean;
};

/**
 * Hand-drawn annotation that draws itself when scrolled into view.
 * Re-draws when the lamp flips, because the ink colour changes with the theme.
 */
export function Ink({
  children,
  type = "underline",
  delay = 180,
  duration = 850,
  strokeWidth = 2,
  padding = 3,
  iterations = 2,
  alt = false,
  color,
  className,
  multiline = true,
}: InkProps) {
  const { lamp } = useLamp();
  const { ref, inView } = useInView<HTMLSpanElement>({ threshold: 0.6 });
  const annotation = useRef<RoughAnnotation | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || !inView) return;

    let cancelled = false;
    let timer: number | undefined;

    const draw = async () => {
      const { annotate } = await import("rough-notation");
      if (cancelled || !ref.current) return;

      const styles = getComputedStyle(document.documentElement);
      const resolved =
        color ??
        styles.getPropertyValue(alt ? "--bl-hand-2" : "--bl-hand").trim() ??
        "#bdf73c";

      annotation.current?.remove();
      annotation.current = annotate(ref.current, {
        type,
        color: resolved,
        strokeWidth,
        padding,
        iterations,
        multiline,
        animationDuration: duration,
      });

      timer = window.setTimeout(() => {
        if (!cancelled) annotation.current?.show();
      }, delay);
    };

    void draw();

    return () => {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
    };
    // `lamp` is a dependency so the stroke is repainted in the new ink colour.
  }, [
    inView,
    lamp,
    type,
    delay,
    duration,
    strokeWidth,
    padding,
    iterations,
    alt,
    color,
    multiline,
    ref,
  ]);

  useEffect(() => {
    return () => {
      annotation.current?.remove();
      annotation.current = null;
    };
  }, []);

  return (
    <span ref={ref} className={className} style={{ position: "relative" }}>
      {children}
    </span>
  );
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
  as?: "div" | "section" | "li" | "article" | "header";
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

/**
 * Types out a line of text character by character once it is in view.
 * Used for the hero's handwritten margin notes.
 */
export function Scribble({
  text,
  speed = 42,
  delay = 0,
  className,
}: {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
}) {
  const { ref, inView } = useInView<HTMLSpanElement>({ threshold: 0.5 });
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let index = 0;
    let interval: number | undefined;
    const start = window.setTimeout(() => {
      interval = window.setInterval(() => {
        index += 1;
        setShown(index);
        if (index >= text.length && interval) window.clearInterval(interval);
      }, speed);
    }, delay);

    return () => {
      window.clearTimeout(start);
      if (interval) window.clearInterval(interval);
    };
  }, [inView, text, speed, delay]);

  return (
    <span ref={ref} className={className} aria-label={text}>
      <span aria-hidden="true">{text.slice(0, shown)}</span>
    </span>
  );
}
