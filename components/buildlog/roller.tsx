"use client";

import { useEffect, useState } from "react";

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
 */

/** The arc the band is painted along. */
const BAND = "M-60 188 Q600 36 1260 188";
/** And the one the words ride, a little above its centre line. */
const LINE = "M-60 190 Q600 38 1260 190";

export function Roller({
  text,
  /** Seconds for one full pass. Longer is calmer. */
  pace = 26,
  className,
}: {
  text: string;
  pace?: number;
  className?: string;
}) {
  const [still, setStill] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setStill(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  /*
   * Twice round. The text has to be long enough to still fill the arc when
   * it has travelled a full copy's width, or the tail pulls away from the
   * head and the band runs empty behind it.
   */
  const run = `${text} ✦ `.repeat(6);

  return (
    <div className={["bl-roller", className].filter(Boolean).join(" ")} aria-hidden="true">
      <svg viewBox="0 0 1200 230" preserveAspectRatio="xMidYMid slice">
        <defs>
          <path id="bl-roller-line" d={LINE} />
        </defs>

        <path className="bl-roller-band" d={BAND} />

        <text className="bl-roller-text">
          <textPath href="#bl-roller-line" startOffset="0%">
            {run}
            {!still && (
              <animate
                attributeName="startOffset"
                from="0%"
                to="-16.6667%"
                dur={`${pace}s`}
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
