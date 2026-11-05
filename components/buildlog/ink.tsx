/**
 * Four lines down the cover's margins, laid in once it has settled.
 *
 * They are meant to complement the cover, not compete with it, so they are
 * hairlines at a third of the accent's strength: the sort of thing you
 * notice on the second look. A heavier version of this was tried, with a
 * real pen's taper to it, and it was the wrong idea in the right place.
 * At the size these run, weight reads as clutter.
 *
 * The curve is a spline through a handful of waypoints, so there is not a
 * corner anywhere in it, then thinned of the points a straight run did not
 * need. They draw themselves rather than fade in, which is the one piece
 * of movement they are allowed, and they go on last of everything.
 */

type Line = {
  id: string;
  side: "left" | "right";
  /** Seconds after the rest of the cover has finished arriving. */
  at: number;
  d: string;
};

const LINES: Line[] = [
  {
    id: "la",
    side: "left",
    /* A long one down the whole margin, with one curl in it. */
    at: 0.0,
    d:
      "M-70 30 L60 150 L143.2 220.5 L177.8 253.8 L212.7 298.2 L238.4 338.2 " +
      "L258.3 378.8 L268 410 L271.2 433.1 L270.9 464.6 L267.6 487.5 L259.6 " +
      "515.9 L251.2 534.5 L240.4 550.6 L225.6 565.6 L202.1 583 L183.5 593 " +
      "L165.6 599.6 L150 602 L135.5 598.9 L116 587.3 L94.7 565.9 L81.3 543.8 " +
      "L78.8 527.8 L81 514.2 L88.2 495.9 L99 480.2 L108.6 471.9 L119.7 467.3 " +
      "L133.9 464.9 L155.9 465.4 L172.8 468.4 L197.9 479 L209.7 488.9 L220.5 " +
      "501.7 L238.9 534.7 L250.8 574.8 L254.7 613.9 L253.6 659.6 L247.9 706.8 " +
      "L237.5 750.2 L219.9 789.9 L175.7 865.1 L126.1 960.4 L112.9 997 L108.6 " +
      "1027.4 L109.2 1059.2 L113.7 1091.4 L121.5 1122.8 L132 1152 L143.1 1173.3 " +
      "L157.9 1195 L214 1262",
  },
  {
    id: "ra",
    side: "right",
    /* The long one opposite, calmer, a single bend. */
    at: 0.22,
    d:
      "M470 24 L397.8 78.7 L349.3 119.2 L272.2 193.1 L242.5 225.8 L223 251 " +
      "L197.8 294 L175.9 348.2 L162.9 404.1 L159.5 450.8 L161.9 489.3 L170.7 " +
      "537.8 L185 584.4 L204.6 627.3 L237.1 675.1 L297.9 749.2 L373.9 829.1 " +
      "L402 862 L431.5 907 L474 984",
  },
  {
    id: "lb",
    side: "left",
    /* A short tail near the foot of the first. */
    at: 0.58,
    d:
      "M-60 752 L29.2 795 L50.5 807.7 L67 820.2 L90.1 842.6 L108.4 866.6 L119.8 " +
      "890.6 L122.6 909.5 L120.6 924.4 L115.9 939.4 L100.5 967.3 L84.7 985 " +
      "L59.9 999.9 L26.1 1010 L-0.7 1011.6 L-23.9 1005.5 L-64 988",
  },
  {
    id: "rb",
    side: "right",
    /* And a short one tucked inside the long right. */
    at: 0.8,
    d:
      "M474 196 L410.5 234.4 L396.2 246 L375.3 267.7 L354.5 293 L340.6 314.7 " +
      "L331.3 336.6 L328.3 358.8 L330.3 382.5 L336.2 406.3 L347.1 434.1 L360.8 " +
      "457.7 L383.9 482.2 L423.5 514.8 L445.2 529.3 L476 546",
  },
];

function Margin({ side }: { side: "left" | "right" }) {
  return (
    <svg
      className="bl-ink"
      data-side={side}
      /* the box is the shape of the margin it sits in, so slicing it
         crops a few pixels rather than stretching the curve */
      viewBox="0 0 400 1200"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {LINES.filter((line) => line.side === side).map((line) => (
        <path
          key={line.id}
          d={line.d}
          /* declared as 1, so the dash is a plain fraction and nothing
             has to be measured to animate it */
          pathLength={1}
          vectorEffect="non-scaling-stroke"
          style={{ "--at": `${line.at}s` } as React.CSSProperties}
        />
      ))}
    </svg>
  );
}

export function HeroInk() {
  return (
    <div className="bl-inks" aria-hidden="true">
      <Margin side="left" />
      <Margin side="right" />
    </div>
  );
}

export default HeroInk;
