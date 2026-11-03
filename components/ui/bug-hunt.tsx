"use client";

import * as React from "react";

/**
 * A web strung across a heading, a spider on it, and a bug you can fix.
 *
 * The web is not a corner ornament. It is measured onto a real element in
 * the page, slung off the end of that heading the way one is slung off the
 * end of anything left alone, and the bug walks the heading itself rather
 * than a band of empty section under it.
 *
 * The web is built rather than drawn: an irregular frame, spokes at uneven
 * angles, and a capture spiral that sags between consecutive spokes the way
 * a thread under its own weight does. Concentric circles are what a web is
 * mistaken for; the sag is the whole of why a real one reads as one.
 *
 * Click the bug and it is fixed, which on an engineer's page means a commit
 * and a green tick, not gore.
 */

type Bug = {
  x: number;
  y: number;
  /** Heading in radians. */
  a: number;
  /** Radians per second it is currently turning. */
  turn: number;
  speed: number;
};

/** The heading's box, and the layer's own, both in the layer's coordinates. */
type Zone = { x: number; y: number; w: number; h: number; hw: number; hh: number };

const clamp = (v: number, lo: number, hi: number) => (v < lo ? lo : v > hi ? hi : v);

/** How close to the edge of the layer the bug's centre may get. */
const RIM = 18;

/*
 * Path numbers, rounded.
 *
 * The web comes off sines and cosines, and the last bits of a double do not
 * have to agree between the renderer on the server and the one in the
 * browser. React compares the two `d` strings character by character, finds
 * them different, and reports a hydration mismatch over a web nobody can see
 * the difference in. Three places is finer than one device pixel here.
 */
const n3 = (v: number) => Number(v.toFixed(3));

/** Repeatable jitter. A web has to be irregular and the same one twice. */
const jit = (i: number) => {
  const x = Math.sin(i * 12.9898 + 4.1414) * 43758.5453;
  return x - Math.floor(x);
};

/* ------------------------------------------------------------------ the web */

const TAU = Math.PI * 2;
const SPOKES = 11;
const RINGS = 7;
const HUB = { x: 104, y: 74 };

/** Where each spoke ends: uneven angles, uneven lengths. */
const spokes = Array.from({ length: SPOKES }, (_, i) => {
  const a = (i / SPOKES) * TAU - Math.PI / 2 + (jit(i) - 0.5) * 0.22;
  const r = 68 + jit(i + 50) * 30;
  return { a, r, x: HUB.x + Math.cos(a) * r, y: HUB.y + Math.sin(a) * r };
});

/**
 * One turn of the capture spiral.
 *
 * Each segment runs spoke to spoke and is pulled back toward the hub at its
 * midpoint, which is what the thread does hanging between two anchors.
 */
function ring(k: number) {
  const f = (0.17 + (k / RINGS) * 0.83) * (0.94 + jit(k * 3) * 0.12);
  const at = (i: number) => {
    const s = spokes[i % SPOKES];
    return { x: HUB.x + Math.cos(s.a) * s.r * f, y: HUB.y + Math.sin(s.a) * s.r * f };
  };
  let d = `M${n3(at(0).x)} ${n3(at(0).y)}`;
  for (let i = 1; i <= SPOKES; i++) {
    const q = at(i - 1);
    const p = at(i);
    const sag = 0.84 + jit(k * 17 + i) * 0.12;
    const mx = (q.x + p.x) / 2;
    const my = (q.y + p.y) / 2;
    d += ` Q${n3(HUB.x + (mx - HUB.x) * sag)} ${n3(HUB.y + (my - HUB.y) * sag)} ${n3(p.x)} ${n3(
      p.y,
    )}`;
  }
  return d;
}

/** The outer frame, which is the only part of a web pulled taut. */
const frame = spokes
  .map((s, i) => `${i === 0 ? "M" : "L"}${n3(s.x)} ${n3(s.y)}`)
  .concat("Z")
  .join("");

/** The bridge threads that hold the whole thing up, running off the top. */
const bridges = [1, 2, 9, 10].map((i) => {
  const s = spokes[i % SPOKES];
  return `M${n3(s.x)} ${n3(s.y)} Q${n3(s.x + (jit(i) - 0.5) * 22)} ${n3(s.y - 34)} ${n3(
    s.x + (jit(i + 9) - 0.5) * 50,
  )} -24`;
});

/** Two strands that have gone, because an occupied web is never intact. */
const torn = [4, 6].map((i) => {
  const s = spokes[i];
  return `M${n3(s.x)} ${n3(s.y)} q${n3(3 + jit(i) * 5)} ${n3(12 + jit(i) * 8)} ${n3(
    -2 - jit(i) * 6,
  )} ${n3(23 + jit(i) * 12)}`;
});

const Web = () => (
  <svg className="bl-web" viewBox="-10 -26 228 190" fill="none" aria-hidden="true">
    <g className="bl-web-sway">
      {bridges.map((d) => (
        <path key={d} className="bl-web-bridge" d={d} />
      ))}
      <path className="bl-web-frame" d={frame} />
      {spokes.map((s) => (
        <line
          key={s.a}
          className="bl-web-spoke"
          x1={HUB.x}
          y1={HUB.y}
          x2={n3(s.x)}
          y2={n3(s.y)}
        />
      ))}
      {Array.from({ length: RINGS }, (_, k) => (
        <path key={k} className="bl-web-silk" d={ring(k + 1)} />
      ))}
      {torn.map((d) => (
        <path key={d} className="bl-web-torn" d={d} />
      ))}
    </g>
  </svg>
);

const Spider = () => (
  <svg viewBox="-15 -11 30 26" fill="none" aria-hidden="true">
    <path d="M-3 -2 -8 -8 -12 -6M-3 0 -9 -1 -13 2M-3 2 -8 6 -11 10M3 -2 8 -8 12 -6M3 0 9 -1 13 2M3 2 8 6 11 10" />
    <ellipse className="bl-fill" cx="0" cy="4" rx="4.6" ry="5.6" />
    <circle className="bl-fill" cx="0" cy="-3.4" r="3" />
    <circle className="bl-dot" cx="-1.2" cy="-4.2" r="0.7" />
    <circle className="bl-dot" cx="1.2" cy="-4.2" r="0.7" />
  </svg>
);

const Beetle = () => (
  <svg viewBox="-13 -15 26 30" fill="none" aria-hidden="true">
    {/* two sets of legs, swapped a few times a second, which is a scuttle */}
    <g className="bl-bug-legs bl-bug-legs-a">
      <path d="M-5 -5 -10 -11M-5 0 -12 -1M-5 5 -10 11M5 -5 11 -9M5 0 12 2M5 5 10 12" />
    </g>
    <g className="bl-bug-legs bl-bug-legs-b">
      <path d="M-5 -5 -11 -9M-5 0 -12 2M-5 5 -10 12M5 -5 10 -11M5 0 12 -1M5 5 10 11" />
    </g>
    <path className="bl-bug-feeler" d="M-2 -9 -5 -14M2 -9 5 -14" />
    <ellipse className="bl-fill" cx="0" cy="1.5" rx="5.8" ry="8.6" />
    <circle className="bl-fill" cx="0" cy="-8" r="3" />
    <path className="bl-split" d="M0 -4.5V9" />
    <path className="bl-split" d="M-4.6 -1h9M-4.2 3h8.4" />
  </svg>
);

/* ------------------------------------------------------------------ the lot */

export interface BugHuntProps {
  /** A selector, inside this section, for the element the web hangs on. */
  anchor?: string;
  className?: string;
}

export function BugHunt({ anchor = ".bl-head-title", className }: BugHuntProps) {
  const host = React.useRef<HTMLDivElement>(null);
  const body = React.useRef<HTMLButtonElement>(null);
  const bug = React.useRef<Bug>({ x: 0, y: 0, a: 0, turn: 0, speed: 24 });
  const walk = React.useRef<Zone | null>(null);
  const alive = React.useRef(true);
  const placed = React.useRef(false);

  const [zone, setZone] = React.useState<Zone | null>(null);
  const [fixed, setFixed] = React.useState(0);
  const [showFix, setShowFix] = React.useState(false);
  const [squashed, setSquashed] = React.useState(false);
  const [reduced, setReduced] = React.useState(false);

  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  /*
   * Put the web and the walk on the heading, in this layer's own coordinates.
   * Measured rather than guessed at: the heading is two lines on a phone and
   * one on a laptop, and a web positioned in percentages ends up beside it.
   */
  React.useEffect(() => {
    const node = host.current;
    const mark = node?.parentElement?.querySelector(anchor);
    if (!node || !(mark instanceof HTMLElement)) return;

    const measure = () => {
      const h = node.getBoundingClientRect();
      const m = mark.getBoundingClientRect();
      const next = {
        x: m.left - h.left,
        y: m.top - h.top,
        w: m.width,
        h: m.height,
        hw: h.width,
        hh: h.height,
      };
      walk.current = next;
      setZone((prev) =>
        prev &&
        prev.x === next.x &&
        prev.y === next.y &&
        prev.w === next.w &&
        prev.h === next.h &&
        prev.hw === next.hw
          ? prev
          : next,
      );
      if (!placed.current && next.w) {
        placed.current = true;
        bug.current.x = next.x + next.w * 0.22;
        bug.current.y = next.y + next.h * 0.7;
      }
    };

    measure();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    ro.observe(node);
    ro.observe(mark);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [anchor]);

  // The walk. Written straight to the element each frame; it never re-renders.
  React.useEffect(() => {
    if (reduced) return;
    let raf = 0;
    let last = performance.now();
    let onScreen = true;
    let steer = 0;

    const frameStep = (now: number) => {
      raf = requestAnimationFrame(frameStep);
      if (!onScreen || document.hidden || !alive.current) {
        last = now;
        return;
      }
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const b = bug.current;
      const z = walk.current;
      if (!z || !z.w) return;

      // a new heading now and then, so it wanders rather than patrols
      steer -= dt;
      if (steer <= 0) {
        b.turn = (Math.random() - 0.5) * 2.6;
        b.speed = 16 + Math.random() * 22;
        steer = 0.4 + Math.random() * 1.3;
      }
      b.a += b.turn * dt;

      /*
       * A margin, so it can step off the edge of the words a little, but
       * never past the edge of the page: on a phone the heading runs the
       * full column and that margin put half a bug off the screen.
       */
      const x0 = Math.max(RIM, z.x - 14);
      const x1 = Math.min(z.hw - RIM, z.x + z.w + 14);
      const y0 = Math.max(RIM, z.y - 10);
      const y1 = Math.min(z.hh - RIM, z.y + z.h + 10);
      if (x1 <= x0 || y1 <= y0) return;

      let nx = b.x + Math.cos(b.a) * b.speed * dt;
      let ny = b.y + Math.sin(b.a) * b.speed * dt;

      // turn away from the edges rather than stopping at them
      if (nx < x0 || nx > x1) {
        b.a = Math.PI - b.a;
        nx = clamp(nx, x0, x1);
      }
      if (ny < y0 || ny > y1) {
        b.a = -b.a;
        ny = clamp(ny, y0, y1);
      }
      b.x = nx;
      b.y = ny;

      const el = body.current;
      if (el) {
        el.style.transform =
          `translate3d(${b.x.toFixed(1)}px, ${b.y.toFixed(1)}px, 0)` +
          ` rotate(${(b.a + Math.PI / 2).toFixed(3)}rad)`;
      }
    };
    raf = requestAnimationFrame(frameStep);

    const io =
      typeof IntersectionObserver === "function"
        ? new IntersectionObserver(([e]) => {
            onScreen = e.isIntersecting;
          })
        : null;
    if (host.current) io?.observe(host.current);

    return () => {
      cancelAnimationFrame(raf);
      io?.disconnect();
    };
  }, [reduced]);

  const squash = () => {
    if (!alive.current) return;
    alive.current = false;
    setSquashed(true);
    setShowFix(true);
    setFixed((n) => n + 1);

    window.setTimeout(() => setShowFix(false), 3200);

    // there is always another one
    window.setTimeout(() => {
      const z = walk.current;
      const b = bug.current;
      if (z) {
        b.x = clamp(z.x + Math.random() * z.w, RIM, Math.max(RIM, z.hw - RIM));
        b.y = clamp(z.y + Math.random() * z.h, RIM, Math.max(RIM, z.hh - RIM));
      }
      b.a = Math.random() * TAU;
      alive.current = true;
      setSquashed(false);
    }, 3400);
  };

  const web = zone
    ? { left: zone.x + zone.w - 86, top: zone.y - 74 }
    : { left: 0, top: 0, visibility: "hidden" as const };

  return (
    <>
      <div
        ref={host}
        className={["bl-hunt", className].filter(Boolean).join(" ")}
        data-ready={zone ? "true" : "false"}
      >
        <span className="bl-web-rig" style={web} aria-hidden="true">
          <Web />
          <span className="bl-spider">
            <i className="bl-spider-thread" />
            <Spider />
          </span>
        </span>

        <button
          ref={body}
          type="button"
          className="bl-bug"
          data-gone={squashed ? "true" : undefined}
          onClick={squash}
          aria-label="There is a bug on this heading. Fix it."
        >
          <Beetle />
        </button>
      </div>

      {showFix && (
        <div className="bl-fixed" role="status" aria-live="polite">
          <div className="bl-fixed-card">
            <p className="bl-fixed-chrome" aria-hidden="true">
              <i />
              <i />
              <i />
              <span>bug-{String(fixed).padStart(3, "0")}.log</span>
            </p>
            <div className="bl-fixed-body">
              <p className="bl-fixed-cmd">
                <span>$</span> git commit -m &quot;fix: one fewer bug&quot;
              </p>
              <p className="bl-fixed-ok">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M4.5 12.8 9.6 18 19.5 6.4" />
                </svg>
                Bug fixed
              </p>
              <p className="bl-fixed-meta">
                1 file changed · {fixed} squashed this session · 0 regressions
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default BugHunt;
