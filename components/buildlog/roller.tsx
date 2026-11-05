"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

/**
 * A band of type bent over an arc, running between two acts.
 *
 * The page is a stack of full-height acts, and between any two of them there
 * is a seam where one stops and the next starts. This is what goes in the
 * seam: one sentence, set as big as the name on the cover, carried round a
 * curve so it reads as a thing passing through rather than another heading.
 *
 * Built on a real arc rather than a tilt. A strip rotated a few degrees is
 * the cheap version of this and it looks like exactly that: the letters all
 * lean the same way instead of standing up off the curve. Here the band is a
 * stroked path and the words ride a second path inside it, so each letter
 * finds its own angle the way it would on a painted sign.
 *
 * The travel is SMIL, which is declarative: the browser owns the timeline,
 * pauses it with the tab, and there is no frame loop of ours anywhere near
 * it. It is left out entirely when motion is unwelcome, which is the one
 * thing SMIL cannot ask about itself.
 *
 * Two of these on one page would be a tic if they were the same band twice,
 * so the second is the first one turned over: the arc bends the other way,
 * the words travel the other way, and the colour is the negative. A pair,
 * rather than a repeat.
 */

/*
 * The two arcs, mirrored about the middle of the viewBox so the pair is
 * symmetrical. Each is given twice: the band is painted along the first and
 * the words ride the second, which sits two units lower — caps on a middle
 * baseline read high in their own band, and this is the correction.
 */
const ARC = {
  up: { band: "M-60 188 Q600 36 1260 188", line: "M-60 190 Q600 38 1260 190" },
  down: { band: "M-60 42 Q600 194 1260 42", line: "M-60 44 Q600 196 1260 44" },
} as const;

/*
 * How many times the sentence is written out. The band has to still be full
 * when the words have travelled a whole copy's width, which needs the arc's
 * length plus one copy; four is that with room to spare at every size the
 * type is set at, and every copy past what is needed is laid out, measured
 * and then clipped off the end of the path for nothing.
 */
const COPIES = 4;

/** ViewBox units a word travels per second. Shared, so the pair keeps step. */
const SPEED = 30;

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

export function Roller({
  text,
  /** Which way the arc bows. */
  bend = "up",
  /** Which way the words travel. */
  way = "left",
  /** Accent band with dark words, or the negative of it. */
  tone = "accent",
  className,
}: {
  text: string;
  bend?: "up" | "down";
  way?: "left" | "right";
  tone?: "accent" | "negative";
  className?: string;
}) {
  const words = useRef<SVGTextElement>(null);
  const line = useRef<SVGPathElement>(null);
  /*
   * How far to travel, as a share of the arc, and how long to take over it.
   *
   * Both are measured rather than written down, and that is the whole point
   * of them. A loop is only seamless if the words move exactly one copy of
   * themselves per pass; a round number in the markup is one copy only by
   * luck, and the band visibly snaps back at the end of every pass when it
   * is not. One copy's width depends on the sentence, on the type size,
   * which changes at the narrow breakpoint, and on whether the face has
   * loaded yet, so there is no number that is right in advance.
   */
  const [loop, setLoop] = useState<{ span: number; dur: number } | null>(null);
  const [still, setStill] = useState(false);

  const measure = useCallback(() => {
    const run = words.current;
    const arc = line.current;
    if (!run || !arc) return;

    const length = arc.getTotalLength();
    const copy = run.getComputedTextLength() / COPIES;
    if (!length || !copy) return;

    setLoop((was) => {
      const span = (copy / length) * 100;
      const dur = copy / SPEED;
      // nothing moved; leave the running animation alone rather than restart it
      if (was && Math.abs(was.span - span) < 0.01) return was;
      return { span, dur };
    });
  }, []);

  // before paint, so the words are never seen at an offset they then jump from
  useIsomorphicLayoutEffect(() => {
    measure();

    // the face is a webfont, and the sentence is a different width without it
    document.fonts?.ready.then(measure).catch(() => {});

    let frame = 0;
    const onResize = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        measure();
      });
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [measure, text]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setStill(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  const arc = ARC[bend];
  // the arc is drawn left to right, so a falling offset walks the words left
  const span = loop ? loop.span : 0;
  const from = way === "left" ? 0 : -span;
  const to = way === "left" ? -span : 0;
  // two of these on a page, and each needs its own id to point a textPath at
  const id = `bl-roller-${bend}-${way}`;
  const run = `${text} ✦ `.repeat(COPIES);

  return (
    <div
      className={["bl-roller", className].filter(Boolean).join(" ")}
      data-tone={tone}
      aria-hidden="true"
    >
      <svg viewBox="0 0 1200 230" preserveAspectRatio="xMidYMid slice">
        <defs>
          <path id={id} ref={line} d={arc.line} />
        </defs>

        <path className="bl-roller-band" d={arc.band} />

        <text className="bl-roller-text" ref={words}>
          <textPath href={`#${id}`} startOffset={`${from}%`}>
            {run}
            {loop && !still && (
              <animate
                // a new span is a new loop, so let React swap the whole
                // element: SMIL does not re-read an attribute mid-run
                key={loop.span}
                attributeName="startOffset"
                from={`${from}%`}
                to={`${to}%`}
                dur={`${loop.dur}s`}
                repeatCount="indefinite"
              />
            )}
          </textPath>
        </text>
      </svg>

      {/* the sentence itself, for anything that reads rather than looks */}
      <p className="bl-sr">{text}</p>
    </div>
  );
}

export default Roller;
