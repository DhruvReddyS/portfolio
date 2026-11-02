"use client";

import * as React from "react";

/**
 * A name stamped across the last page, with things drifting down around it.
 *
 * Taken from the doodle-crew footer: the storyboard timing, the per-letter
 * stamp with a puff of dust, the ground line that draws itself, the ink
 * filter that roughens the edges and eats specks out of the fill, and the
 * drift of small marks that scatter from the pointer and pop when caught.
 *
 * Not taken: the crew. A yeti leaning on the first letter and a cat on the
 * last is a lovely thing on a games studio's footer and has nothing to say
 * on an engineer's. The marks that drift here are this site's own, the same
 * hand-drawn set used in its buttons and its links, so the last page is
 * signed in the same hand as the rest.
 */

// #region layout — pure

/** Deterministic hash to [0, 1), so the page lays out the same way each time. */
export function hash(n: number): number {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
}

export function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}

/**
 * Lays a word out from per-letter advances in font units: the left edge of
 * each letter with `tracking` (in em) between them, and the total width. A
 * non-finite or negative advance counts as zero, so one bad glyph cannot
 * throw the whole word off the page.
 */
export function layoutWord(
  advances: number[],
  tracking: number,
  fontSize: number,
): { x: number[]; w: number[]; width: number } {
  const x: number[] = [];
  const w: number[] = [];
  let at = 0;
  const gap = (Number.isFinite(tracking) ? tracking : 0) * fontSize;
  for (let i = 0; i < advances.length; i++) {
    const a = Number.isFinite(advances[i]) && advances[i] > 0 ? advances[i] : 0;
    x.push(at);
    w.push(a);
    at += a + (i < advances.length - 1 ? gap : 0);
  }
  return { x, w, width: Math.max(0, at) };
}

export type Drifter = {
  x: number; y: number; vx: number; vy: number;
  rot: number; vr: number; fall: number; phase: number;
  /** Seconds left of a pop; 0 means alive. */
  pop: number;
};

/**
 * One step of a mark's drift: it falls at its own speed and sways, the
 * pointer pushes it away within `radius`, it eases back when let go, and it
 * wraps round the box so the sky never empties.
 */
export function stepDrifter(
  d: Drifter, dt: number, t: number, w: number, h: number,
  px: number, py: number, radius: number, rand: () => number,
): Drifter {
  const step = clamp(Number.isFinite(dt) ? dt : 0, 0, 0.05);
  const edge = 40;
  if (d.pop > 0) {
    d.pop -= step;
    if (d.pop <= 0) { d.pop = 0; d.x = rand() * w; d.y = -edge; d.vx = 0; d.vy = d.fall; }
    return d;
  }
  const sway = Math.sin(t * 0.7 + d.phase) * 13;
  if (Number.isFinite(px) && Number.isFinite(py) && radius > 0) {
    const dx = d.x - px;
    const dy = d.y - py;
    const dist = Math.hypot(dx, dy);
    if (dist < radius && dist > 0.01) {
      const k = (1 - dist / radius) ** 2 * 2200;
      d.vx += (dx / dist) * k * step;
      d.vy += (dy / dist) * k * step;
      d.vr += (dx > 0 ? 1 : -1) * k * 0.004 * step;
    }
  }
  const ease = Math.min(1, step * 2.4);
  d.vx += (sway - d.vx) * ease;
  d.vy += (d.fall - d.vy) * ease;
  d.vr += (Math.sin(d.phase * 3) * 16 - d.vr) * Math.min(1, step * 0.8);
  d.x += d.vx * step;
  d.y += d.vy * step;
  d.rot = (d.rot + d.vr * step) % 360;
  if (d.y > h + edge) { d.y = -edge; d.x = rand() * w; }
  else if (d.y < -edge * 3) { d.y = h + edge; }
  if (d.x < -edge) d.x = w + edge;
  else if (d.x > w + edge) d.x = -edge;
  return d;
}

/** The storyboard, in ms from the moment the footer comes into view. */
export function timeline(letters: number) {
  const L = Math.max(0, Math.floor(letters) || 0);
  const letter = (i: number) => 150 + i * 75;
  const last = letter(Math.max(0, L - 1));
  return { ground: 50, letter, drift: last + 160, total: last + 620 };
}

// #endregion

const FONT_SIZE = 200;

type Metrics = { advances: number[]; cap: number };

const guess = (word: string): Metrics => ({
  advances: Array.from(word).map(
    (c) => (c === " " ? 0.3 : /[IJ1]/.test(c) ? 0.42 : /[MW]/.test(c) ? 0.98 : 0.76) * FONT_SIZE,
  ),
  cap: 0.73 * FONT_SIZE,
});

/**
 * Canvas cannot parse a CSS custom property in ctx.font: handed
 * `var(--bl-sans), system-ui` it silently keeps its 10px default, every
 * advance comes back a twentieth of the right size, and the word is laid out
 * in a viewBox eighty units wide holding two-hundred-unit glyphs. So the
 * variables are substituted for their computed values first.
 */
const resolveFamily = (family: string): string => {
  if (typeof document === "undefined" || !family.includes("var(")) return family;
  const root = getComputedStyle(document.documentElement);
  return family.replace(
    /var\((--[\w-]+)\)/g,
    (_, name: string) => root.getPropertyValue(name).trim() || "sans-serif",
  );
};

const measure = (word: string, family: string): Metrics | null => {
  if (typeof document === "undefined") return null;
  const ctx = document.createElement("canvas").getContext("2d");
  if (!ctx) return null;
  ctx.font = `900 ${FONT_SIZE}px ${resolveFamily(family)}`;
  const chars = Array.from(word);
  const advances: number[] = [];
  let prev = 0;
  for (let i = 0; i < chars.length; i++) {
    const now = ctx.measureText(chars.slice(0, i + 1).join("")).width;
    advances.push(now - prev);
    prev = now;
  }
  const m = ctx.measureText(word.replace(/\s/g, "") || "H");
  const cap = m.actualBoundingBoxAscent > 0 ? m.actualBoundingBoxAscent : 0.73 * FONT_SIZE;
  // A cap height a fraction of the size asked for means the font string was
  // not understood at all. Better the estimate than a word laid out to the
  // wrong scale.
  if (cap < FONT_SIZE * 0.4) return null;
  return { advances, cap };
};

export interface StampedWordmarkProps {
  /** Short and upper case reads best. */
  word: string;
  /** The small marks that drift down around it. */
  marks?: React.ReactNode[];
  /** How many are in the air at once. */
  count?: number;
  /** Letter spacing, in em. */
  tracking?: number;
  /** Family for the stamp. A heavy grotesk stamps best. */
  fontFamily?: string;
  className?: string;
}

export function StampedWordmark({
  word,
  marks = [],
  count = 10,
  tracking = -0.02,
  fontFamily = 'var(--bl-sans), system-ui, sans-serif',
  className,
}: StampedWordmarkProps) {
  const uid = React.useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const chars = React.useMemo(() => Array.from(word.toUpperCase()), [word]);

  const root = React.useRef<HTMLDivElement>(null);
  const sky = React.useRef<HTMLDivElement>(null);

  const [metrics, setMetrics] = React.useState(() => guess(word.toUpperCase()));
  const [play, setPlay] = React.useState(false);
  const [reduced, setReduced] = React.useState(false);

  // Measure the real face once it is there: next/font arrives after first
  // paint, and a word laid out on the fallback's advances is a word with
  // gaps in it.
  React.useEffect(() => {
    const read = () => {
      const m = measure(word.toUpperCase(), fontFamily);
      if (m) setMetrics(m);
    };
    read();
    const fonts = document.fonts;
    if (!fonts) return;
    let alive = true;
    fonts.ready.then(() => { if (alive) read(); });
    return () => { alive = false; };
  }, [word, fontFamily]);

  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  React.useEffect(() => {
    const node = root.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setPlay(true); io.disconnect(); } },
      { threshold: 0.15 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  const layout = React.useMemo(
    () => layoutWord(metrics.advances, tracking, FONT_SIZE),
    [metrics, tracking],
  );
  const cap = metrics.cap;
  const tl = timeline(chars.length);

  /* the ground, wobbled so it reads as drawn rather than ruled */
  const ground = React.useMemo(() => {
    const x1 = layout.width;
    let d = "M0 6";
    const n = 14;
    for (let k = 1; k <= n; k++) {
      const x = (x1 * k) / n;
      d += ` Q${(x - x1 / n / 2).toFixed(1)} ${(6 + (hash(k * 3.1) - 0.5) * 5).toFixed(1)} ${x.toFixed(1)} ${(6 + (hash(k * 7.7) - 0.5) * 2).toFixed(1)}`;
    }
    return d;
  }, [layout.width]);

  const view = { x: -24, y: -cap - 28, w: layout.width + 48, h: cap + 70 };

  const flock = React.useMemo(
    () => (marks.length ? Array.from({ length: clamp(count, 0, 24) }, (_, k) => ({
      mark: marks[k % marks.length],
      size: 20 + hash(k * 4.7) * 13,
      seed: k,
    })) : []),
    [marks, count],
  );

  const sim = React.useRef({ list: [] as Drifter[], w: 0, h: 0, px: NaN, py: NaN, inside: false, seed: 1 });
  const nodes = React.useRef<(HTMLSpanElement | null)[]>([]);

  /* lay the drift out once the sky has a size, and keep it across resizes */
  React.useEffect(() => {
    const node = sky.current;
    if (!node || typeof ResizeObserver === "undefined") return;
    const S = sim.current;
    const size = () => {
      const r = node.getBoundingClientRect();
      const ow = S.w;
      const oh = S.h;
      S.w = r.width;
      S.h = r.height;
      if (S.list.length !== flock.length || !ow) {
        S.list = flock.map((_, k) => ({
          x: (0.04 + 0.92 * ((k + hash(k * 9.1) * 0.8) / Math.max(1, flock.length))) * r.width,
          y: (0.02 + hash(k * 3.3) * 0.5) * r.height,
          vx: 0, vy: 0,
          rot: (hash(k * 1.7) - 0.5) * 50,
          vr: (hash(k * 6.1) - 0.5) * 26,
          fall: 8 + hash(k * 2.9) * 14,
          phase: hash(k * 8.3) * Math.PI * 2,
          pop: 0,
        }));
      } else if (oh) {
        for (const d of S.list) { d.x *= r.width / ow; d.y *= r.height / oh; }
      }
    };
    size();
    const ro = new ResizeObserver(size);
    ro.observe(node);
    return () => ro.disconnect();
  }, [flock]);

  /* the drift itself */
  React.useEffect(() => {
    if (!flock.length || reduced) return;
    const S = sim.current;
    let raf = 0;
    let last = performance.now();
    let onScreen = true;
    const rand = () => { S.seed = (S.seed * 16807) % 2147483647; return S.seed / 2147483647; };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!onScreen || document.hidden) { last = now; return; }
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const node = sky.current;
      if (!node) return;
      const r = node.getBoundingClientRect();
      const px = S.inside ? S.px - r.left : NaN;
      const py = S.inside ? S.py - r.top : NaN;
      for (let i = 0; i < S.list.length; i++) {
        const d = stepDrifter(S.list[i], dt, now / 1000, S.w, S.h, px, py, 100, rand);
        const el = nodes.current[i];
        if (!el) continue;
        let scale = 1;
        let opacity = 1;
        if (d.pop > 0) {
          const age = 1.3 - d.pop;
          scale = 1 + Math.min(1, age / 0.28) * 0.7;
          opacity = Math.max(0, 1 - age / 0.28);
        }
        el.style.transform = `translate3d(${d.x.toFixed(1)}px,${d.y.toFixed(1)}px,0) rotate(${d.rot.toFixed(1)}deg) scale(${scale.toFixed(3)})`;
        el.style.opacity = String(opacity);
      }
    };
    raf = requestAnimationFrame(frame);

    const io = typeof IntersectionObserver === "function"
      ? new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; }, { rootMargin: "100px" })
      : null;
    if (sky.current) io?.observe(sky.current);

    return () => { cancelAnimationFrame(raf); io?.disconnect(); };
  }, [flock, reduced]);

  const track = (e: React.PointerEvent) => {
    const S = sim.current;
    S.px = e.clientX;
    S.py = e.clientY;
    S.inside = true;
  };
  const leave = () => { sim.current.inside = false; };
  const pop = (i: number) => {
    const d = sim.current.list[i];
    if (d && d.pop <= 0) d.pop = 1.3;
  };

  return (
    <div
      ref={root}
      className={["bl-stamp", className].filter(Boolean).join(" ")}
      data-play={play || reduced ? "1" : "0"}
      onPointerMove={track}
      onPointerLeave={leave}
    >
      <div className="bl-stamp-sky" ref={sky} aria-hidden="true">
        {flock.map((f, k) => (
          <span
            key={k}
            className="bl-stamp-drift"
            ref={(el) => { nodes.current[k] = el; }}
            style={{
              width: f.size, height: f.size,
              marginLeft: -f.size / 2, marginTop: -f.size / 2,
              ["--d" as string]: `${tl.drift + k * 70}ms`,
            }}
            onPointerDown={() => pop(k)}
          >
            {f.mark}
          </span>
        ))}
      </div>

      <svg
        className="bl-stamp-svg"
        viewBox={`${view.x} ${view.y} ${view.w} ${view.h}`}
        role="img"
        aria-label={word}
      >
        <defs>
          {/* roughens the edge and eats specks out of the fill, so the type
              reads as pressed into the page rather than set on it */}
          <filter id={`${uid}-ink`} x="-4%" y="-6%" width="108%" height="112%">
            <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="3" seed="11" result="edge" />
            <feDisplacementMap in="SourceGraphic" in2="edge" scale="5" xChannelSelector="R" yChannelSelector="G" result="rough" />
            <feTurbulence type="fractalNoise" baseFrequency="0.018 0.32" numOctaves="2" seed="4" result="streak" />
            <feColorMatrix in="streak" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -16 5.6" result="streakA" />
            <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="1" seed="9" result="speck" />
            <feColorMatrix in="speck" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -24 7" result="speckA" />
            <feComposite in="streakA" in2="speckA" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="holes" />
            <feComposite in="rough" in2="holes" operator="out" />
          </filter>
        </defs>

        <path
          className="bl-stamp-ground"
          pathLength={1}
          d={ground}
          style={{ ["--d" as string]: `${tl.ground}ms` }}
        />

        {chars.map((c, i) =>
          c === " " ? null : (
            <g
              key={i}
              className="bl-stamp-letter"
              style={{
                ["--d" as string]: `${tl.letter(i)}ms`,
                ["--r" as string]: `${((hash(i * 2.3) - 0.5) * 8).toFixed(2)}deg`,
              }}
            >
              <text
                x={layout.x[i]}
                y={0}
                fontSize={FONT_SIZE}
                fontWeight={900}
                style={{ fontFamily }}
                filter={`url(#${uid}-ink)`}
              >
                {c}
              </text>
              <path
                className="bl-stamp-dust"
                d={`M${layout.x[i] - 6} -6 l-16 -6 M${layout.x[i] - 4} -16 l-12 -12 M${layout.x[i] + layout.w[i] + 6} -6 l16 -6 M${layout.x[i] + layout.w[i] + 4} -16 l12 -12`}
              />
            </g>
          ),
        )}
      </svg>
    </div>
  );
}

export default StampedWordmark;
