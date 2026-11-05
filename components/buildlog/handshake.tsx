"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Two hands meeting, over the close.
 *
 * Drawn rather than fetched: it is one stroke weight in the page's own
 * ink, the same hand the marks elsewhere are drawn in, so it belongs to
 * this site and not to an icon set. Each hand is a filled outline in the
 * page's ground colour, which is what lets the right one pass in front
 * of the left where they overlap without either of them becoming a
 * silhouette.
 *
 * It arrives the way the thing it is about does. The two arms come in
 * from their own edges and meet in the middle, the contact throws a
 * ring, and then the pair shakes: a short burst, a rest, and again, the
 * way an actual handshake goes rather than a loop that never stops.
 *
 * Nothing happens until it is on screen, and nothing happens at all for
 * a reader who has asked for less motion, who gets the two hands already
 * met, which is the picture anyway.
 */
export function Handshake() {
  const host = useRef<HTMLDivElement>(null);
  const [met, setMet] = useState(false);

  useEffect(() => {
    const node = host.current;
    if (!node) return;

    /*
     * Once, on arrival: a handshake that replays every time the reader
     * scrolls past it is a handshake with something wrong with it.
     *
     * No check for reduced motion here. The attribute is only a cue;
     * what it means is settled in the stylesheet, where a reader who
     * has asked for less motion gets the two hands already met and
     * nothing moving, which is the picture anyway.
     */
    const watch = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          setMet(true);
          watch.disconnect();
        }
      },
      { threshold: 0.45 },
    );

    watch.observe(node);
    return () => watch.disconnect();
  }, []);

  return (
    <div
      className="bl-shake"
      ref={host}
      data-met={met ? "true" : undefined}
      aria-hidden="true"
    >
      <svg viewBox="0 0 260 140" role="presentation">
        {/* the ring the contact throws */}
        <g className="bl-shake-spark">
          <circle cx="130" cy="62" r="34" />
          <circle cx="130" cy="62" r="34" />
          <path d="M130 18V5M86 27 75 15M174 27 185 15" />
        </g>

        <g className="bl-shake-pair">
          {/* his, in the page's ink, underneath */}
          <g className="bl-shake-left">
            <path d="M-46 113 82 63 94 93 -34 143Z" />
            {/* reaching a little higher than the hand that closes over
                it, so his knuckles are still in the picture */}
            <path d="M82 63c14-27 43-42 66-36 19 5 29 20 24 36-5 16-23 24-41 19-13-4-27 1-33 10l-5-2z" />
            <path className="bl-shake-cuff" d="M5 93 17 123" />
          </g>

          {/*
            and theirs, in the accent, closing over the top.

            Carried in the page's own ground as a stroke laid outside the
            fill, which is what cuts it away from the hand behind it. Two
            solid shapes of different colours with no gap between them
            read as one shape in two colours.
          */}
          <g className="bl-shake-right">
            <path d="M306 113 178 63 166 93 294 143Z" />
            <path d="M178 63c-13-20-38-33-60-29-18 4-28 18-23 33 5 15 22 23 39 18 13-4 26 1 32 10l5-2z" />
            <path className="bl-shake-cuff" d="M255 93 243 123" />
            {/* the thumb over the knuckles and three fingers round the
                back, which is the whole difference between a grip and
                two shapes that happen to overlap */}
            <path className="bl-shake-crease" d="M109 46c11-8 27-5 33 6" />
            <path className="bl-shake-crease" d="M104 61 96 70M113 67 105 76M123 72 116 81" />
          </g>
        </g>
      </svg>
    </div>
  );
}

export default Handshake;
