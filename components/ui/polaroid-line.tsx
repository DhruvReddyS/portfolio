"use client";

import * as React from "react";

/**
 * Polaroid Line — instant prints pegged to a sagging string.
 *
 * Drag the line, press the arrows or use the keyboard and the prints slide
 * along it, swinging on their pegs with the speed you give them and settling
 * back with a little overshoot. Even at rest they move in a light breeze. The
 * one in the middle is the one you are looking at, and clicking it opens it.
 *
 * Adapted from the polaroid-line-carousel component. What changed: the
 * painted-landscape generator is gone, because every print here is a real
 * photograph and a hundred lines of canvas drawing mountains had nothing to
 * do with this site; the palette comes from the page's own tokens; a click on
 * the print already in the middle opens it rather than doing nothing; and the
 * options the simulation reads are written in an effect rather than during
 * render.
 */

// #region logic — pure, and the part worth testing

export function clamp(v: number, a: number, b: number): number {
  return Math.min(b, Math.max(a, v));
}

/** Height of a string sagging by `sag` between (0, y0) and (w, y0), at x. */
export function stringY(x: number, w: number, y0: number, sag: number): number {
  const t = clamp(x / w, 0, 1);
  return y0 + 4 * sag * t * (1 - t);
}

/** One step of a critically damped spring toward target. */
export function springStep(
  x: number,
  v: number,
  target: number,
  dt: number,
  k = 70,
): [number, number] {
  const c = 2 * Math.sqrt(k);
  const nv = v + (k * (target - x) - c * v) * dt;
  return [x + nv * dt, nv];
}

/**
 * One step of a print's swing. `lineVel` is the prints' on-screen speed in
 * px/s, positive moving right: a print lags behind the motion, is pulled back
 * by gravity, and is damped.
 */
export function swingStep(
  a: number,
  w: number,
  lineVel: number,
  dt: number,
  gain: number,
): [number, number] {
  const nw = w + (-38 * a - 4.2 * w + lineVel * 0.0034 * gain) * dt;
  return [clamp(a + nw * dt, -0.6, 0.6), nw];
}

/** Index of the print nearest the centre for a given line offset. */
export function nearestAt(off: number, spacing: number, n: number): number {
  return clamp(Math.round(off / spacing), 0, Math.max(0, n - 1));
}

export function pad2(n: number): string {
  return n < 10 ? "0" + n : String(n);
}

// #endregion

export type Print = {
  image?: string;
  /**
   * Anything that fills the frame, in place of `image`. This site passes its
   * own Plate, which already knows where a win's photograph lives and what to
   * draw while it is not there.
   */
  cover?: React.ReactNode;
  /** Written on the white band under the photograph, in the hand. */
  note?: string;
  title?: string;
  caption?: string;
  alt?: string;
  /** Drawn in the frame when there is no photograph. */
  monogram?: string;
};

export type PolaroidLineProps = {
  prints: Print[];
  /** Any CSS length. */
  height?: string;
  /** Width of a print in px. It shrinks on narrow screens. */
  cardWidth?: number;
  /** How far the string sags in the middle, px. */
  sag?: number;
  /** How much the prints swing. 0 holds them still. */
  swing?: number;
  /** ms per print. 0 turns it off; it waits while anyone is interacting. */
  autoplay?: number;
  /** Clicking the print already in the middle. */
  onOpen?: (index: number) => void;
  onChange?: (index: number) => void;
  className?: string;
  ariaLabel?: string;
  /** Word on the button under the line. */
  openLabel?: string;
};

export function PolaroidLine({
  prints,
  height = "30rem",
  cardWidth = 290,
  sag = 40,
  swing = 1,
  autoplay = 5200,
  onOpen,
  onChange,
  className,
  ariaLabel = "Photographs on a line",
  openLabel = "Read it",
}: PolaroidLineProps) {
  const n = prints.length;
  const [active, setActive] = React.useState(0);
  const [dragging, setDragging] = React.useState(false);
  const [size, setSize] = React.useState({ w: 1200, h: 520, cw: cardWidth });

  const root = React.useRef<HTMLDivElement>(null);
  const line = React.useRef<SVGPathElement>(null);
  const cards = React.useRef<(HTMLDivElement | null)[]>([]);
  const sim = React.useRef({ off: 0, vel: 0, target: 0, a: [] as number[], w: [] as number[] });
  const drag = React.useRef<null | {
    x: number; off: number; lx: number; lt: number; v: number; moved: boolean;
  }>(null);
  const touched = React.useRef(0);
  const current = React.useRef(0);
  const opts = React.useRef({ sag, swing });
  const hooks = React.useRef({ onOpen, onChange });

  // Written after render, not during it: the loop reads these every frame and
  // a ref assigned in the render body is a write during render.
  React.useEffect(() => {
    opts.current = { sag, swing };
    hooks.current = { onOpen, onChange };
  });

  const spacing = size.cw * 1.09;

  const goTo = React.useCallback(
    (i: number) => {
      sim.current.target = clamp(i, 0, n - 1) * spacing;
    },
    [n, spacing],
  );

  React.useEffect(() => {
    const node = root.current;
    if (!node || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => {
      const box = node.getBoundingClientRect();
      const cw = Math.round(
        Math.max(150, Math.min(cardWidth, box.width * 0.44, box.height * 0.52)),
      );
      setSize((prev) =>
        prev.cw === cw && Math.abs(prev.w - box.width) < 2 && Math.abs(prev.h - box.height) < 2
          ? prev
          : { w: box.width, h: box.height, cw },
      );
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [cardWidth]);

  // keep the line on the active print when the spacing changes under it
  React.useEffect(() => {
    sim.current.target = current.current * spacing;
    sim.current.off = current.current * spacing;
  }, [spacing]);

  React.useEffect(() => {
    hooks.current.onChange?.(active);
  }, [active]);

  // the simulation, written straight to the DOM each frame
  React.useEffect(() => {
    const node = root.current;
    if (!node) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let onScreen = true;
    let raf = 0;
    let prev = performance.now();
    const S = sim.current;

    const frame = (now: number) => {
      raf = 0;
      if (!onScreen) return;
      const dt = Math.min(0.033, (now - prev) / 1000);
      prev = now;
      const { w, h, cw } = size;
      const y0 = Math.max(36, h * 0.17);
      const held = drag.current;

      let lineVel: number;
      if (held && held.moved) {
        lineVel = held.v * 1000;
      } else {
        const before = S.off;
        [S.off, S.vel] = springStep(S.off, S.vel, S.target, dt);
        lineVel = -(S.off - before) / Math.max(dt, 1e-3);
      }

      const o = opts.current;
      const gain = reduced ? 0 : o.swing;
      const near = nearestAt(S.off, spacing, n);

      for (let i = 0; i < n; i++) {
        const el = cards.current[i];
        if (!el) continue;
        const x = w / 2 + i * spacing - S.off;
        if (x < -cw * 1.5 || x > w + cw * 1.5) {
          el.style.visibility = "hidden";
          continue;
        }
        el.style.visibility = "visible";
        let a = S.a[i] || 0;
        let av = S.w[i] || 0;
        [a, av] = swingStep(a, av, lineVel, dt, gain);
        if (gain) a += Math.sin(now / 1300 + i * 1.7) * 0.0009 * gain;
        S.a[i] = a;
        S.w[i] = av;
        const y = stringY(x, w, y0, o.sag) - 6;
        el.style.transform =
          `translate(${(x - cw / 2).toFixed(1)}px,${y.toFixed(1)}px) rotate(${a.toFixed(4)}rad)`;
        el.style.zIndex = String(i === near ? n + 1 : n - Math.abs(i - near));
      }

      line.current?.setAttribute(
        "d",
        `M0 ${y0} Q${w / 2} ${y0 + 2 * o.sag} ${w} ${y0}`,
      );

      if (near !== current.current) {
        current.current = near;
        setActive(near);
      }
      raf = requestAnimationFrame(frame);
    };

    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      if (onScreen && !raf) {
        prev = performance.now();
        raf = requestAnimationFrame(frame);
      }
    });
    io.observe(node);
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [size, spacing, n]);

  React.useEffect(() => {
    if (!autoplay || n < 2) return;
    const id = window.setInterval(() => {
      if (document.hidden || drag.current) return;
      if (performance.now() - touched.current < autoplay) return;
      goTo(current.current >= n - 1 ? 0 : current.current + 1);
    }, autoplay);
    return () => window.clearInterval(id);
  }, [autoplay, n, goTo]);

  const onDown = (event: React.PointerEvent) => {
    if ((event.target as HTMLElement).closest(".bl-line-bar")) return;
    touched.current = performance.now();
    drag.current = {
      x: event.clientX, off: sim.current.off, lx: event.clientX,
      lt: event.timeStamp, v: 0, moved: false,
    };
  };

  const onMove = (event: React.PointerEvent) => {
    const held = drag.current;
    if (!held) return;
    const dx = event.clientX - held.x;
    if (!held.moved && Math.abs(dx) > 5) {
      held.moved = true;
      setDragging(true);
      root.current?.setPointerCapture(event.pointerId);
    }
    if (!held.moved) return;
    const dt = Math.max(1, event.timeStamp - held.lt);
    held.v = 0.7 * ((event.clientX - held.lx) / dt) + 0.3 * held.v;
    held.lx = event.clientX;
    held.lt = event.timeStamp;
    const max = (n - 1) * spacing;
    let off = held.off - dx;
    if (off < 0) off *= 0.35;
    if (off > max) off = max + (off - max) * 0.35;
    sim.current.off = off;
  };

  const onUp = (event: React.PointerEvent) => {
    const held = drag.current;
    drag.current = null;
    touched.current = performance.now();
    if (!held) return;
    if (held.moved) {
      setDragging(false);
      sim.current.vel = -held.v * 1000;
      goTo(nearestAt(sim.current.off - held.v * 180, spacing, n));
      return;
    }
    const card = (event.target as HTMLElement).closest("[data-i]");
    if (!card) return;
    const i = Number(card.getAttribute("data-i"));
    // the one already under your eye opens; the others come to the middle first
    if (i === current.current) hooks.current.onOpen?.(i);
    else goTo(i);
  };

  const step = (dir: number) => {
    touched.current = performance.now();
    goTo(clamp(current.current + dir, 0, n - 1));
  };

  const onKey = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowRight") step(1);
    else if (event.key === "ArrowLeft") step(-1);
    else if (event.key === "Enter") hooks.current.onOpen?.(current.current);
    else return;
    event.preventDefault();
  };

  const showing = prints[active] || {};

  return (
    <div
      ref={root}
      className={["bl-line", className].filter(Boolean).join(" ")}
      style={{ height, ["--bl-print-w" as string]: size.cw + "px" }}
      data-drag={dragging ? "1" : "0"}
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      tabIndex={0}
      onKeyDown={onKey}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
    >
      <svg className="bl-line-string" aria-hidden="true">
        <path ref={line} fill="none" strokeWidth="1.5" strokeLinecap="round" />
      </svg>

      {prints.map((print, i) => (
        <div
          key={i}
          className="bl-print"
          data-i={i}
          data-on={i === active ? "1" : "0"}
          ref={(el) => {
            cards.current[i] = el;
          }}
          aria-hidden={i === active ? undefined : true}
        >
          <div className="bl-print-sheet">
            <div className="bl-print-shot">
              {print.cover ??
                (print.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={print.image} alt={print.alt || print.title || ""} draggable={false} />
                ) : (
                  <span aria-hidden="true">{print.monogram}</span>
                ))}
            </div>
            <div className="bl-print-note">{print.note || print.title || ""}</div>
          </div>
          <span className="bl-print-peg" aria-hidden="true" />
        </div>
      ))}

      <div className="bl-line-bar">
        <div className="bl-line-cap" key={active}>
          {showing.title && <span className="bl-line-title">{showing.title}</span>}
          {showing.caption && <span className="bl-line-sub">{showing.caption}</span>}
        </div>

        <span className="bl-line-count" aria-hidden="true">
          <b>{pad2(active + 1)}</b> / {pad2(n)}
        </span>

        {onOpen && (
          <button type="button" className="bl-line-open" onClick={() => onOpen(active)}>
            {openLabel}
          </button>
        )}

        <button type="button" className="bl-line-btn" aria-label="Previous" onClick={() => step(-1)}>
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M10 3 5 8l5 5" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </button>
        <button type="button" className="bl-line-btn" aria-label="Next" onClick={() => step(1)}>
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="m6 3 5 5-5 5" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </button>
      </div>

      <p className="bl-sr" aria-live="polite">
        {`Print ${active + 1} of ${n}${showing.title ? ": " + showing.title : ""}`}
      </p>
    </div>
  );
}

export default PolaroidLine;
