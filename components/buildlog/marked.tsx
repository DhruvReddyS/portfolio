"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A phrase with a mark drawn over it by hand.
 *
 * The site had rough-notation doing this once. It was torn out because it
 * appends its SVG to the annotated element's *parent*, which puts a node in
 * the tree that React did not render and cannot account for; the first
 * re-render that touched a sibling threw `insertBefore`. This draws the mark
 * as a child the component owns, so React stays in charge of the whole tree.
 *
 * The stroke is a dash as long as the path, offset out of sight, and the
 * offset animates to zero when the phrase comes into view: the line draws
 * itself at the speed a pen would. Hovering runs it again.
 */

const INK = {
  /* a line that wanders the way a hand does, overshooting at the end */
  underline: "M3,13.6 C18,9.8 34,15.4 50,11.8 C66,8.4 82,13.2 97,10.4",
  /* a loop that starts low on the left, goes round, and crosses itself */
  circle:
    "M62,3.4 C30,1.6 5,5.4 4.6,10.4 C4.2,15.8 32,19 58,18.4 C84,17.8 97,14 95.6,9.6 C94.4,5.8 76,2.4 48,3",
  /* a quick slash through the middle */
  strike: "M3,10.4 C26,8.2 52,12 74,9.2 C84,8 92,9.4 97,8.6",
} as const;

export type MarkKind = keyof typeof INK;

export function Marked({
  children,
  kind = "underline",
  /** Milliseconds after the phrase is seen before the pen starts. */
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  kind?: MarkKind;
  delay?: number;
  className?: string;
}) {
  const host = useRef<HTMLSpanElement>(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const node = host.current;
    if (!node) return;

    // Reduced motion needs no observer: the stylesheet already shows the mark
    // finished rather than drawing it. Watching for it here would also mean
    // setting state synchronously inside the effect, which cascades renders.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setDrawn(true);
        observer.disconnect();
      },
      { threshold: 0.6 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <span
      ref={host}
      className={["bl-marked", className].filter(Boolean).join(" ")}
      data-kind={kind}
      data-drawn={drawn}
      style={{ "--mark-delay": `${delay}ms` } as React.CSSProperties}
    >
      <span className="bl-marked-text">{children}</span>
      <svg
        className="bl-marked-ink"
        viewBox="0 0 100 20"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <path d={INK[kind]} />
      </svg>
    </span>
  );
}

/**
 * A line of prose with one phrase inside it marked.
 *
 * Every log entry, case file and award in the data already names the phrase
 * worth marking, in its `mark` field. This splits the line on that phrase and
 * hands the middle to `Marked`, so the annotation lives in the content rather
 * than being hard-coded next to the markup.
 *
 * A phrase that is not in the line leaves the line alone, which means a copy
 * edit can never produce a half-drawn mark.
 */
export function MarkedLine({
  text,
  mark,
  kind = "underline",
  delay = 240,
}: {
  text: string;
  mark?: string;
  kind?: MarkKind;
  delay?: number;
}) {
  if (!mark) return <>{text}</>;

  const at = text.indexOf(mark);
  if (at === -1) return <>{text}</>;

  return (
    <>
      {text.slice(0, at)}
      <Marked kind={kind} delay={delay}>
        {mark}
      </Marked>
      {text.slice(at + mark.length)}
    </>
  );
}
