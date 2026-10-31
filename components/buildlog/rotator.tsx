"use client";

import { useEffect, useState } from "react";

/**
 * Cycles a word in place, one at a time, so a single sentence can carry the
 * whole range of the work. The full list is written out for screen readers
 * once, because a word that changes under them is noise.
 */
export function Rotator({
  words,
  every = 2200,
}: {
  words: string[];
  every?: number;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(
      () => setIndex((value) => (value + 1) % words.length),
      every,
    );
    return () => window.clearInterval(timer);
  }, [words.length, every]);

  return (
    <span className="bl-rotator">
      {/* reserves the width of the longest word so nothing jumps */}
      <span className="bl-rotator-ghost" aria-hidden="true">
        {words.reduce((a, b) => (b.length > a.length ? b : a))}
      </span>
      <span className="bl-rotator-word" key={index} aria-hidden="true">
        {words[index]}
      </span>
      <span className="bl-sr">{words.join(", ")}</span>
    </span>
  );
}
