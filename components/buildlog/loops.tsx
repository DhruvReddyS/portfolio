/**
 * Two curls of line in the cover's margins, drawn on arrival.
 *
 * The cover is a name, a man and a column of facts, and the space either
 * side of them was doing nothing. This is what goes in it: a thin line
 * that comes in off the edge, loops once and leaves, drawn rather than
 * faded in, so the first thing the page does is put a pen down.
 *
 * It is the same gesture as the ribbon through the five rooms further
 * down, at a tenth of the weight. That is deliberate: the heavy version
 * carries the work and this one only has to rhyme with it.
 *
 * No script. The draw is a keyframe on a path whose length is declared as
 * 1, so the dash can be stated as a fraction and nothing has to be
 * measured; the curtain pauses it the same way it pauses the name.
 */

/** Left margin: in off the edge, one tight loop, then away down. */
const LEFT = [
  "M-70 84 C74 188 252 274 288 428 C316 548 204 652 110 608 C38 574 66 484 138 512 C204 538 212 650 164 754",
  "M-70 536 C52 578 126 650 86 716 C62 756 6 766 -70 744",
];

/** Right margin: one long arc, and a shorter one inside it. */
const RIGHT = [
  "M470 34 C336 112 86 238 92 422 C98 600 272 656 470 712",
  "M470 142 C372 180 308 262 334 350 C356 420 420 454 470 472",
];

export function HeroLoops() {
  return (
    <div className="bl-loops" aria-hidden="true">
      <svg className="bl-loop" data-side="left" viewBox="0 0 400 800" preserveAspectRatio="none">
        {LEFT.map((d, index) => (
          <path
            key={d}
            d={d}
            /* declared as 1, so the dash below is a plain fraction and no
               script has to measure the curve to animate it */
            pathLength={1}
            vectorEffect="non-scaling-stroke"
            style={{ "--d": `${0.75 + index * 0.22}s` } as React.CSSProperties}
          />
        ))}
      </svg>

      <svg className="bl-loop" data-side="right" viewBox="0 0 400 800" preserveAspectRatio="none">
        {RIGHT.map((d, index) => (
          <path
            key={d}
            d={d}
            pathLength={1}
            vectorEffect="non-scaling-stroke"
            style={{ "--d": `${0.85 + index * 0.22}s` } as React.CSSProperties}
          />
        ))}
      </svg>
    </div>
  );
}

export default HeroLoops;
