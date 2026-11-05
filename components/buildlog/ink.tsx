/**
 * Four strokes of ink down the cover's margins, laid in as it settles.
 *
 * The space either side of the name was doing nothing, and what went in it
 * first was a stroked line of even thickness, which is the one thing a pen
 * never draws. These are real strokes: a centreline with a width that
 * starts at nothing, swells past the middle and runs out again, built as a
 * filled shape rather than an outline, so they have the weight and the
 * taper of something drawn in one go.
 *
 * They are drawn last of everything on the cover, and drawn rather than
 * faded, by wiping a mask along the centreline. The mask is the only thing
 * animating: the shape underneath never changes, it is just uncovered from
 * one end to the other.
 *
 * Geometry generated from a handful of waypoints, smoothed through them and
 * then thinned out. The curve is a spline so there are no corners in it,
 * and the points that a straight run did not need are gone.
 */

type Stroke = {
  id: string;
  side: "left" | "right";
  /** Seconds after the rest of the cover has finished arriving. */
  at: number;
  /** The stroke itself, as a closed shape. */
  body: string;
  /** Its centreline, which the mask is wiped along. */
  line: string;
};

const STROKES: Stroke[] = [
  {
    id: "la",
    side: "left",
    /* A long one down the whole margin, with a curl in it. */
    at: 0.0,
    body:
      "M-70 30 L-61.8 38.7 L-30.1 69.4 L57.8 152.4 L80 172.2 L125.8 210.6 L147.8 " +
      "230 L168.3 249.9 L180.8 263.6 L192.3 278 L209.1 300.7 L224.8 324.5 L234.4 " +
      "340.5 L246.9 364.7 L253.9 380.5 L259.4 396 L263.3 411 L264.7 418.4 L266.4 " +
      "433.5 L266.8 448.8 L266.1 464.1 L262.8 486.6 L259.3 500.8 L254.9 514.2 " +
      "L249.7 526.5 L246.8 532.1 L240.4 542.4 L236.5 547.4 L232.2 552.3 L222.3 " +
      "561.9 L216.9 566.4 L205.5 574.9 L187.4 585.6 L175.5 591 L164.3 594.8 " +
      "L159.1 596 L150 597 L146 596.7 L137.4 594.3 L128.3 589.7 L119.1 583.4 " +
      "L110.3 575.7 L98.6 562.8 L92.3 554 L85.9 542 L84 535.4 L83.7 528.1 L84 524 " +
      "L85.7 515.5 L88.6 506.7 L92.5 498.2 L97.2 490.3 L102.6 483.4 L108.3 478 " +
      "L111.2 475.9 L114.1 474.3 L120.9 471.9 L129.5 470.2 L139.3 469.4 L149.9 " +
      "469.6 L160.8 470.8 L176.9 474.4 L186.7 478.2 L191.2 480.4 L199.2 485.6 " +
      "L210 495.9 L220.2 509.1 L229.4 524.8 L237.3 542.5 L243.5 561.9 L246.6 " +
      "575.6 L248.7 589.9 L250.5 614.1 L250.5 640.7 L249.6 659.3 L246.9 687.6 " +
      "L244.1 706.1 L238.6 732.7 L234 749.1 L228 764.9 L216.9 788.2 L208.4 803.5 " +
      "L181.5 848.6 L173 863.6 L158 893.6 L134.6 937.4 L123.9 959.3 L115 981.5 " +
      "L110.7 996.5 L107.9 1011.7 L106.6 1027.3 L106.4 1043.2 L107.3 1059.3 " +
      "L109.3 1075.6 L112.1 1091.7 L115.8 1107.6 L120.2 1123.2 L125.3 1138.2 " +
      "L130.9 1152.5 L134.2 1159.5 L142.3 1173.9 L157.3 1195.4 L173.9 1216.1 L214 " +
      "1262 L214 1262 L174.8 1215.4 L158.6 1194.5 L144 1172.8 L136.2 1158.5 " +
      "L133.1 1151.5 L127.7 1137.3 L122.9 1122.3 L118.7 1106.9 L115.3 1091.1 " +
      "L112.7 1075.1 L111 1059 L110.3 1043.1 L110.7 1027.5 L112.1 1012.3 L115 " +
      "997.5 L119.4 983 L128.3 961.4 L139.2 939.9 L163.1 896.2 L178.4 866.5 " +
      "L186.9 851.8 L214.3 806.9 L223 791.5 L234.6 767.7 L240.9 751.4 L245.9 " +
      "734.5 L251.7 707.4 L254.6 688.6 L257.6 659.9 L258.9 631.8 L258.8 613.8 " +
      "L257.2 589 L255 574.1 L250 552.8 L243 533 L234.3 514.9 L224.2 499 L212.9 " +
      "485.7 L204.8 478.4 L200.4 475.2 L190.6 469.7 L185.2 467.5 L174 463.9 " +
      "L156.4 460.7 L144.7 459.9 L133.5 460.2 L123.2 461.6 L118.4 462.6 L109.9 " +
      "465.7 L106.1 467.8 L102.4 470.5 L95.5 477 L89.3 484.8 L83.9 493.7 L79.5 " +
      "503.1 L76.2 513 L74.3 522.8 L73.9 527.6 L74.3 537 L76.8 545.6 L81.2 554.7 " +
      "L87.3 564.1 L99 578.3 L108.1 587.1 L118 594.9 L128.4 601.2 L139.1 605.4 " +
      "L144.5 606.6 L150 607 L161 605.8 L166.9 604.5 L179.2 600.3 L192 594.5 " +
      "L204.8 587.2 L217.2 578.8 L229 569.4 L239.5 559.1 L244.2 553.7 L248.5 " +
      "548.2 L255.6 536.9 L258.7 530.8 L264.2 517.6 L268.8 503.5 L272.4 488.5 " +
      "L275.8 465 L276.6 448.9 L276.1 432.8 L274.2 416.8 L272.7 409 L268.5 393.2 " +
      "L262.6 377 L255.4 360.7 L242.4 336 L232.5 319.6 L216.4 295.6 L199.2 272.6 " +
      "L181 251 L167.5 237.2 L145.9 217.5 L69.5 154.1 L-35.2 60 L-60.7 37.5 L-70 " +
      "30Z",
    line:
      "M-70 30 L60 150 L143.2 220.5 L177.8 253.8 L212.7 298.2 L238.4 338.2 L258.3 " +
      "378.8 L268 410 L271.2 433.1 L270.9 464.6 L267.6 487.5 L259.6 515.9 L251.2 " +
      "534.5 L240.4 550.6 L225.6 565.6 L202.1 583 L183.5 593 L165.6 599.6 L150 " +
      "602 L135.5 598.9 L116 587.3 L94.7 565.9 L81.3 543.8 L78.8 527.8 L81 514.2 " +
      "L88.2 495.9 L99 480.2 L108.6 471.9 L119.7 467.3 L133.9 464.9 L155.9 465.4 " +
      "L172.8 468.4 L197.9 479 L209.7 488.9 L220.5 501.7 L238.9 534.7 L250.8 " +
      "574.8 L254.7 613.9 L253.6 659.6 L247.9 706.8 L237.5 750.2 L219.9 789.9 " +
      "L175.7 865.1 L126.1 960.4 L112.9 997 L108.6 1027.4 L109.2 1059.2 L113.7 " +
      "1091.4 L121.5 1122.8 L132 1152 L143.1 1173.3 L157.9 1195 L214 1262",
  },
  {
    id: "ra",
    side: "right",
    /* The long one on the other side, calmer, one bend. */
    at: 0.22,
    body:
      "M470 24 L442.8 42.5 L404.5 70.3 L371 96.3 L347 116.6 L301.1 159.1 L269.2 " +
      "190.2 L246.4 214.7 L225.6 239.9 L213.5 257.1 L208.1 265.7 L198.3 283.1 " +
      "L185.4 310 L174.6 337.5 L166.1 365.6 L159.9 393.9 L156.2 422.3 L155.1 " +
      "441.2 L155 450.8 L155.7 470.2 L158.9 499.7 L162.2 519.3 L169.1 548.4 " +
      "L174.7 567.4 L184.7 594.8 L192.3 612.3 L196.6 620.8 L206.2 637.5 L216.9 " +
      "653.7 L234.3 677.3 L252.8 700.1 L295.7 751.1 L321 778.6 L359.9 817.7 " +
      "L378.4 836.9 L390 849.9 L400.7 863 L415.9 884.4 L430.5 907.6 L444.2 930.9 " +
      "L474 984 L474 984 L445.6 930.1 L432.4 906.5 L418.2 882.9 L403.3 861 L392.8 " +
      "847.5 L375.4 827.7 L324.8 774.9 L300.2 747.3 L258 695.8 L239.9 672.9 L223 " +
      "649.5 L208 625.4 L199.4 608.8 L188.8 583 L179.9 555.6 L174.9 536.8 L169 " +
      "508.1 L166.3 488.8 L164.6 469.7 L164 450.8 L164.5 432.3 L167.4 404.7 " +
      "L172.7 377.1 L180.3 349.6 L190 322.5 L201.9 296 L215.9 270.3 L226.7 253.6 " +
      "L245.9 228.7 L267.6 204.1 L298.7 172.4 L344.4 128.6 L359.2 114.9 L383.2 " +
      "94.3 L407.6 74.4 L456.8 35.6 L466.4 27.6 L470 24Z",
    line:
      "M470 24 L397.8 78.7 L349.3 119.2 L272.2 193.1 L242.5 225.8 L223 251 L197.8 " +
      "294 L175.9 348.2 L162.9 404.1 L159.5 450.8 L161.9 489.3 L170.7 537.8 L185 " +
      "584.4 L204.6 627.3 L237.1 675.1 L297.9 749.2 L373.9 829.1 L402 862 L431.5 " +
      "907 L474 984",
  },
  {
    id: "lb",
    side: "left",
    /* A short tail near the foot of the first. */
    at: 0.58,
    body:
      "M-60 752 L-56.4 754.5 L-46.5 759.9 L4.2 785 L27.8 797.5 L48.8 810.3 L54.7 " +
      "814.4 L64.9 822.6 L79 835.7 L87.6 844.8 L99.1 858.8 L105.6 868.3 L113.2 " +
      "882.4 L116.7 891.6 L118.8 900.5 L119.5 909.4 L119.2 914.1 L117.7 923.7 " +
      "L113.1 938.3 L106.4 952.6 L98.2 965.7 L89.3 977 L83.1 983.1 L72 991.2 L59 " +
      "997.9 L44.9 1003.3 L35.3 1006.1 L25.8 1008.3 L12.2 1010.2 L3.8 1010.6 " +
      "L-0.6 1010.3 L-9.6 1008.7 L-23.6 1004.6 L-37.1 999.4 L-64 988 L-64 988 " +
      "L-37.6 1000.6 L-24.2 1006.3 L-10.2 1011 L-0.9 1012.9 L3.6 1013.4 L12.4 " +
      "1013.3 L26.4 1011.7 L36.2 1009.7 L46.1 1007.1 L60.7 1001.9 L74.4 995.2 " +
      "L86.3 986.9 L93.1 980.5 L102.7 968.9 L111.4 955.4 L118.6 940.5 L123.6 " +
      "925.1 L125.4 914.7 L125.7 909.5 L125.2 899.5 L122.9 889.7 L119.1 879.8 " +
      "L111.1 864.8 L104.4 854.9 L92.5 840.4 L83.6 831 L69.1 817.7 L58.4 809.3 " +
      "L52.2 805.1 L38.2 796.6 L22.7 788.3 L6.5 780.3 L-17.7 769.4 L-45.5 757.6 " +
      "L-60 752Z",
    line:
      "M-60 752 L29.2 795 L50.5 807.7 L67 820.2 L90.1 842.6 L108.4 866.6 L119.8 " +
      "890.6 L122.6 909.5 L120.6 924.4 L115.9 939.4 L100.5 967.3 L84.7 985 L59.9 " +
      "999.9 L26.1 1010 L-0.7 1011.6 L-23.9 1005.5 L-64 988",
  },
  {
    id: "rb",
    side: "right",
    /* And a short one tucked inside the long right. */
    at: 0.8,
    body:
      "M474 196 L456 204.9 L435.9 215.6 L419.7 225.3 L409 232.5 L394.4 244 L373.1 " +
      "265.8 L360.3 280.7 L352.1 291.2 L341.1 307.7 L335.1 318.8 L330.3 330.1 " +
      "L327.1 341.4 L326.1 347.1 L325.4 358.8 L325.9 370.8 L327.6 383 L330.2 " +
      "395.2 L333.7 407.1 L337.8 418.8 L344.8 435.1 L352.7 449.9 L359 459 L370.2 " +
      "471.8 L382.6 483.6 L395.5 494.4 L422.8 515.7 L433.8 523.3 L444.9 529.9 " +
      "L476 546 L476 546 L445.6 528.6 L434.8 521.7 L424.2 513.9 L397.6 491.9 " +
      "L385.1 480.9 L373.2 469 L365.9 460.7 L359.5 452 L354.1 442.9 L347 427.8 " +
      "L340.6 411.3 L335.5 393.8 L333.1 382 L331.6 370.3 L331.2 358.9 L332 347.9 " +
      "L334.2 337.4 L338 326.8 L343.2 316.1 L349.6 305.4 L356.9 294.8 L364.8 " +
      "284.4 L377.4 269.6 L398 247.9 L411.9 236.4 L427.4 225.6 L465.3 202.3 L474 " +
      "196Z",
    line:
      "M474 196 L410.5 234.4 L396.2 246 L375.3 267.7 L354.5 293 L340.6 314.7 " +
      "L331.3 336.6 L328.3 358.8 L330.3 382.5 L336.2 406.3 L347.1 434.1 L360.8 " +
      "457.7 L383.9 482.2 L423.5 514.8 L445.2 529.3 L476 546",
  },
];

function Margin({ side }: { side: "left" | "right" }) {
  const mine = STROKES.filter((stroke) => stroke.side === side);

  return (
    <svg
      className="bl-ink"
      data-side={side}
      /* the box is the shape of the margin it sits in, so slicing it
         crops a few pixels rather than stretching the strokes */
      viewBox="0 0 400 1200"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        {mine.map((stroke) => (
          <mask
            key={stroke.id}
            id={`bl-ink-${stroke.id}`}
            maskUnits="userSpaceOnUse"
            x="-110"
            y="-90"
            width="660"
            height="1440"
          >
            {/*
              Wider than the widest part of the stroke it uncovers, so the
              wipe clears the whole of it and the edges are the shape's own
              rather than the mask's.
            */}
            <path
              className="bl-ink-wipe"
              d={stroke.line}
              pathLength={1}
              /* the beat belongs on the wipe, since the wipe is the only
                 thing that moves; it lives in defs, so it inherits
                 nothing from the shape it uncovers */
              style={{ "--at": `${stroke.at}s` } as React.CSSProperties}
            />
          </mask>
        ))}
      </defs>

      {mine.map((stroke) => (
        <path
          key={stroke.id}
          className="bl-ink-body"
          d={stroke.body}
          mask={`url(#bl-ink-${stroke.id})`}
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
