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

/**
 * The one that walks. A spider rather than a beetle, and bigger than the
 * ones sitting on the webs, because it is the thing you are meant to spot
 * crossing three headings and go after.
 */
const Crawler = () => (
  <svg viewBox="-16 -14 32 29" fill="none" aria-hidden="true">
    {/* two sets of legs, swapped a few times a second, which is a scuttle */}
    <g className="bl-bug-legs bl-bug-legs-a">
      <path d="M-4 -4 -10 -10 -14 -8M-4 -1 -11 -2 -15 1M-4 2 -10 5 -13 10M4 -4 10 -10 14 -8M4 -1 11 -2 15 1M4 2 10 5 13 10" />
    </g>
    <g className="bl-bug-legs bl-bug-legs-b">
      <path d="M-4 -4 -11 -8 -15 -4M-4 -1 -11 1 -14 5M-4 2 -9 8 -12 12M4 -4 11 -8 15 -4M4 -1 11 1 14 5M4 2 9 8 12 12" />
    </g>
    <ellipse className="bl-fill" cx="0" cy="4" rx="5.6" ry="6.8" />
    <circle className="bl-fill" cx="0" cy="-4" r="3.6" />
    <circle className="bl-dot" cx="-1.4" cy="-5" r="0.85" />
    <circle className="bl-dot" cx="1.4" cy="-5" r="0.85" />
  </svg>
);

/* ------------------------------------------------------------------ the lot */

export interface BugHuntProps {
  /**
   * Selectors, inside this section, for the things a web hangs off. Each
   * may match more than one element and every match gets its own web; the
   * first in the list is treated as the main one and is hung larger and
   * higher than the rest.
   */
  anchors?: string[];
  className?: string;
}

const MAIN_ANCHORS = [".bl-head-title", ".bl-degree"];

export function BugHunt({ anchors = MAIN_ANCHORS, className }: BugHuntProps) {
  const host = React.useRef<HTMLDivElement>(null);
  const body = React.useRef<HTMLButtonElement>(null);
  const bug = React.useRef<Bug>({ x: 0, y: 0, a: 0, turn: 0, speed: 24 });
  const walk = React.useRef<Zone | null>(null);
  const alive = React.useRef(true);
  const placed = React.useRef(false);

  const [zones, setZones] = React.useState<Zone[]>([]);
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
    const parent = node?.parentElement;
    if (!node || !parent) return;

    const marks: HTMLElement[] = [];
    for (const selector of anchors) {
      for (const found of parent.querySelectorAll(selector)) {
        if (found instanceof HTMLElement) marks.push(found);
      }
    }
    if (!marks.length) return;

    const measure = () => {
      const h = node.getBoundingClientRect();
      const next = marks.map((mark) => {
        const m = mark.getBoundingClientRect();
        return {
          x: m.left - h.left,
          y: m.top - h.top,
          w: m.width,
          h: m.height,
          hw: h.width,
          hh: h.height,
        };
      });

      /*
       * One walk across the lot rather than one per web. There is a single
       * spider and it is supposed to cross the heading and both cards, so
       * what it is allowed to roam is the box that holds all of them.
       */
      const box = next.reduce<Zone | null>((all, one) => {
        if (!all) return { ...one };
        const left = Math.min(all.x, one.x);
        const top = Math.min(all.y, one.y);
        return {
          x: left,
          y: top,
          w: Math.max(all.x + all.w, one.x + one.w) - left,
          h: Math.max(all.y + all.h, one.y + one.h) - top,
          hw: one.hw,
          hh: one.hh,
        };
      }, null);
      walk.current = box;

      setZones((prev) => {
        if (prev.length === next.length) {
          const same = prev.every(
            (p, i) =>
              p.x === next[i].x &&
              p.y === next[i].y &&
              p.w === next[i].w &&
              p.h === next[i].h &&
              p.hw === next[i].hw,
          );
          if (same) return prev;
        }
        return next;
      });

      if (!placed.current && box && box.w) {
        placed.current = true;
        bug.current.x = box.x + box.w * 0.22;
        bug.current.y = box.y + box.h * 0.2;
      }
    };

    measure();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    ro.observe(node);
    for (const mark of marks) ro.observe(mark);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
    // the list is a literal at every call site, so its identity is stable
    // enough to key on its contents rather than the array
  }, [anchors.join("|")]); // eslint-disable-line react-hooks/exhaustive-deps

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

  return (
    <>
      <div
        ref={host}
        className={["bl-hunt", className].filter(Boolean).join(" ")}
        data-ready={zones.length ? "true" : "false"}
      >
        {zones.map((zone, index) => (
          <span
            key={index}
            className="bl-web-rig"
            /* the first is the heading's and hangs above it; the rest tuck
               into the top corner of the card they belong to */
            data-main={index === 0 ? "true" : undefined}
            style={{
              left: zone.x + zone.w - (index === 0 ? 86 : 64),
              top: zone.y - (index === 0 ? 74 : 26),
            }}
            aria-hidden="true"
          >
            <Web />
          </span>
        ))}

        <button
          ref={body}
          type="button"
          className="bl-bug"
          data-gone={squashed ? "true" : undefined}
          onClick={squash}
          aria-label="There is a spider loose in this section. Squash it."
        >
          <Crawler />
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
