"use client";

import * as React from "react";

/**
 * Webs in the corners, a spider on a thread, and a bug you can fix.
 *
 * The bug walks the floor of whatever section this is dropped into, turning
 * to face where it is going. Click it and it is squashed: a splat in ink, a
 * stamp, and one on the tally. Another turns up a moment later, because they
 * always do.
 *
 * Three colours and no more, which is the page's whole palette: black ground,
 * bone line, orange splat. The splat is ink rather than gore on purpose. It
 * is a joke about debugging on an engineer's portfolio, not a horror film,
 * and ink is also what every other mark on this site is drawn in.
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

type Splat = { id: number; x: number; y: number; a: number };

const clamp = (v: number, lo: number, hi: number) => (v < lo ? lo : v > hi ? hi : v);

/*
 * Path numbers, rounded.
 *
 * The web is drawn from sines and cosines, and the last bits of a double do
 * not have to agree between the renderer on the server and the one in the
 * browser. React compares the two `d` strings character by character, finds
 * them different, and reports a hydration mismatch over a web nobody can
 * see the difference in. Three places is finer than one device pixel here.
 */
const n3 = (v: number) => Number(v.toFixed(3));

export interface BugHuntProps {
  /** How far up the box the bug is allowed to wander, 0 to 1. */
  roam?: number;
  className?: string;
}

/* ---------------------------------------------------------------- drawings */

const Web = ({ flip = false }: { flip?: boolean }) => (
  <svg
    className="bl-web"
    data-flip={flip ? "true" : undefined}
    viewBox="0 0 120 120"
    fill="none"
    aria-hidden="true"
  >
    {/* the radials */}
    {[0, 18, 36, 54, 72, 90].map((deg) => (
      <line
        key={deg}
        x1="0"
        y1="0"
        x2={n3(120 * Math.cos((deg * Math.PI) / 180))}
        y2={n3(120 * Math.sin((deg * Math.PI) / 180))}
      />
    ))}
    {/* and the spiral, as arcs sagging between them */}
    {[26, 48, 70, 94, 116].map((r) => (
      <path
        key={r}
        d={`M${r} 0 ${[18, 36, 54, 72, 90]
          .map((deg) => {
            const t = (deg * Math.PI) / 180;
            const pull = r * 0.86;
            return `Q${n3(pull * Math.cos(t - 0.16))} ${n3(pull * Math.sin(t - 0.16))} ${n3(
              r * Math.cos(t),
            )} ${n3(r * Math.sin(t))}`;
          })
          .join(" ")}`}
      />
    ))}
  </svg>
);

const Spider = () => (
  <svg viewBox="-14 -10 28 24" fill="none" aria-hidden="true">
    <path d="M-3 -2 -11 -7M-3 0 -13 1M-3 2 -11 8M3 -2 11 -7M3 0 13 1M3 2 11 8" />
    <ellipse className="bl-fill" cx="0" cy="3" rx="5" ry="6" />
    <circle className="bl-fill" cx="0" cy="-4" r="3.2" />
  </svg>
);

const Beetle = () => (
  <svg viewBox="-12 -14 24 28" fill="none" aria-hidden="true">
    <path d="M-5 -5 -11 -10M-5 0 -12 0M-5 5 -11 10M5 -5 11 -10M5 0 12 0M5 5 11 10" />
    <path d="M-2 -9 -4 -13M2 -9 4 -13" />
    <ellipse className="bl-fill" cx="0" cy="1" rx="6" ry="9" />
    <circle className="bl-fill" cx="0" cy="-8" r="3" />
    <path className="bl-split" d="M0 -5V9" />
  </svg>
);

const Splatter = () => (
  <svg viewBox="-20 -20 40 40" aria-hidden="true">
    <path d="M-7 -4c-3-4 1-9 5-7 3-5 10-2 9 3 4 1 4 7 0 8 1 5-5 8-8 4-4 3-9-1-8-5-3-1-2-4 2-3Z" />
    <circle cx="-13" cy="-9" r="2.1" />
    <circle cx="12" cy="-11" r="1.5" />
    <circle cx="14" cy="7" r="2.4" />
    <circle cx="-11" cy="10" r="1.8" />
    <circle cx="2" cy="15" r="1.3" />
    <circle cx="-17" cy="3" r="1.1" />
  </svg>
);

/* ------------------------------------------------------------------ the lot */

export function BugHunt({ roam = 0.42, className }: BugHuntProps) {
  const zone = React.useRef<HTMLDivElement>(null);
  const body = React.useRef<HTMLButtonElement>(null);
  const bug = React.useRef<Bug>({ x: 0, y: 0, a: 0, turn: 0, speed: 26 });
  const box = React.useRef({ w: 0, h: 0 });
  const alive = React.useRef(true);

  const [fixed, setFixed] = React.useState(0);
  const [splats, setSplats] = React.useState<Splat[]>([]);
  const [squashed, setSquashed] = React.useState(false);
  const [reduced, setReduced] = React.useState(false);

  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  React.useEffect(() => {
    const node = zone.current;
    if (!node || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(([entry]) => {
      box.current = { w: entry.contentRect.width, h: entry.contentRect.height };
      const b = bug.current;
      if (!b.x) {
        b.x = box.current.w * 0.2;
        b.y = box.current.h * (1 - roam * 0.4);
      }
    });
    ro.observe(node);
    return () => ro.disconnect();
  }, [roam]);

  // The walk. Written straight to the element each frame; it never re-renders.
  React.useEffect(() => {
    if (reduced) return;
    let raf = 0;
    let last = performance.now();
    let onScreen = true;
    let steer = 0;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!onScreen || document.hidden || !alive.current) {
        last = now;
        return;
      }
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const b = bug.current;
      const { w, h } = box.current;
      if (!w) return;

      // a new heading now and then, so it wanders rather than patrols
      steer -= dt;
      if (steer <= 0) {
        b.turn = (Math.random() - 0.5) * 2.4;
        b.speed = 20 + Math.random() * 26;
        steer = 0.5 + Math.random() * 1.4;
      }
      b.a += b.turn * dt;

      const top = h * (1 - roam);
      let nx = b.x + Math.cos(b.a) * b.speed * dt;
      let ny = b.y + Math.sin(b.a) * b.speed * dt;

      // turn away from the walls rather than stopping at them
      if (nx < 18 || nx > w - 18) {
        b.a = Math.PI - b.a;
        nx = clamp(nx, 18, w - 18);
      }
      if (ny < top || ny > h - 16) {
        b.a = -b.a;
        ny = clamp(ny, top, h - 16);
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
    raf = requestAnimationFrame(frame);

    const io =
      typeof IntersectionObserver === "function"
        ? new IntersectionObserver(([e]) => {
            onScreen = e.isIntersecting;
          })
        : null;
    if (zone.current) io?.observe(zone.current);

    return () => {
      cancelAnimationFrame(raf);
      io?.disconnect();
    };
  }, [reduced, roam]);

  const squash = () => {
    if (!alive.current) return;
    alive.current = false;
    const b = bug.current;
    const id = Date.now();
    setSplats((list) => [...list, { id, x: b.x, y: b.y, a: b.a }].slice(-4));
    setSquashed(true);
    setFixed((n) => n + 1);

    // the ink dries and the page is clean again
    window.setTimeout(() => {
      setSplats((list) => list.filter((s) => s.id !== id));
    }, 7100);

    // there is always another one
    window.setTimeout(() => {
      const { w, h } = box.current;
      b.x = 20 + Math.random() * Math.max(1, w - 40);
      b.y = h * (1 - roam * Math.random());
      b.a = Math.random() * Math.PI * 2;
      alive.current = true;
      setSquashed(false);
    }, 2600);
  };

  return (
    <div ref={zone} className={["bl-hunt", className].filter(Boolean).join(" ")} aria-hidden="true">
      <Web />
      <Web flip />

      <span className="bl-spider">
        <i className="bl-spider-thread" />
        <Spider />
      </span>

      {splats.map((splat) => (
        <span
          key={splat.id}
          className="bl-splat"
          style={{ transform: `translate3d(${splat.x}px, ${splat.y}px, 0) rotate(${splat.a}rad)` }}
        >
          <Splatter />
          <b>Bug fixed</b>
        </span>
      ))}

      <button
        ref={body}
        type="button"
        className="bl-bug"
        data-gone={squashed ? "true" : undefined}
        aria-hidden="true"
        tabIndex={-1}
        onClick={squash}
      >
        <Beetle />
      </button>

      {fixed > 0 && (
        <p className="bl-hunt-tally">
          <span>Bugs fixed</span>
          <b>{String(fixed).padStart(2, "0")}</b>
        </p>
      )}
    </div>
  );
}

export default BugHunt;
