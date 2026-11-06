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

/**
 * The height the prints have, once the caption under them is taken off.
 * `gap` is the air left between the lowest print and the rule above the
 * caption, so the two never touch even at the bottom of the sag.
 */
export function roomFor(height: number, foot: number, gap = 14): number {
  return Math.max(160, height - foot - gap);
}

/** Where the string hangs, inside that room. */
export function stringTop(room: number): number {
  return Math.max(18, room * 0.1);
}

/** How far it sags. A short room gets a shallower curve, not a deeper one. */
export function sagIn(room: number, sag: number): number {
  return Math.min(sag, room * 0.09);
}

/**
 * The widest a print can be and still hang clear.
 *
 * A print is its own width of photograph plus the sheet around it: 22px
 * of padding either side of the window, 11 above it and the 46 of the
 * hand-written band below. Add the string, the sag and the 6px the peg
 * lifts it by, and this is what is left.
 */
export function widest(room: number, sag: number): number {
  return room - stringTop(room) - 2 * sagIn(room, sag) - 40;
}

/**
 * How much of the line one print is allowed.
 *
 * A bit over two fit across a desk, which is what makes the row read as
 * a row. A phone cannot hold two at a size worth looking at, so it gets
 * one and the edges of its neighbours, which is also what fills the
 * room under the string: at the desk share a phone's prints came out
 * small enough to leave half the line hanging empty below them.
 */
export function share(width: number): number {
  return width < 520 ? 0.56 : 0.44;
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
  /** Two or three lines on what the thing actually was. */
  blurb?: string;
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
  /** `foot` is the height of the bar under the line, measured. */
  const [size, setSize] = React.useState({ w: 1200, h: 520, cw: cardWidth, foot: 0 });

  const root = React.useRef<HTMLDivElement>(null);
  const bar = React.useRef<HTMLDivElement>(null);
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

  /*
   * How big a print can be is a question about the room above the bar,
   * not about the box.
   *
   * It used to be a share of the whole height, and the bar under the
   * line is absolutely positioned at the foot of that same box: the
   * prints were sized as though the caption were not there, so the one
   * hanging lowest — the one in the middle, on the sag, at full size —
   * came down across the title of the very win it is a picture of. At
   * a laptop width it covered the middle of a long title; at a tablet
   * width, where the line is half as wide and the blurb takes three
   * lines instead of two, it covered most of it.
   *
   * So the bar is measured and taken off first, and everything else is
   * worked out inside what is left: the string's height, how far it
   * sags, and how big a print can be and still hang clear of the
   * caption at the bottom of the sag.
   */
  React.useEffect(() => {
    const node = root.current;
    if (!node) return;

    const measure = () => {
      const box = node.getBoundingClientRect();
      if (!box.width || !box.height) return;
      const foot = bar.current?.offsetHeight ?? 0;
      const room = roomFor(box.height, foot);
      const cw = Math.round(
        Math.max(
          120,
          Math.min(cardWidth, box.width * share(box.width), widest(room, opts.current.sag)),
        ),
      );
      setSize((prev) =>
        prev.cw === cw &&
        prev.foot === foot &&
        Math.abs(prev.w - box.width) < 2 &&
        Math.abs(prev.h - box.height) < 2
          ? prev
          : { w: box.width, h: box.height, cw, foot },
      );
    };

    /*
     * Measured more than once, on purpose.
     *
     * The caption's height is the whole of this sum, and the caption is
     * set in a face that arrives after the markup does: measured once,
     * on the first observation, the bar is whatever height it is before
     * the webfont lands and the prints are cut to a room that is not
     * the room they end up in. It only corrected itself when the line
     * moved on to the next win and the bar changed height under it,
     * which is a second or two of the wrong answer and, on a set of
     * wins whose captions all wrap the same way, for ever.
     */
    measure();
    const frame = requestAnimationFrame(measure);
    document.fonts?.ready.then(measure).catch(() => {});

    const observer =
      typeof ResizeObserver === "undefined" ? null : new ResizeObserver(measure);
    observer?.observe(node);
    if (bar.current) observer?.observe(bar.current);
    window.addEventListener("resize", measure);

    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      window.removeEventListener("resize", measure);
    };
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
      const { w, h, cw, foot } = size;
      const room = roomFor(h, foot);
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
      const y0 = stringTop(room);
      const sg = sagIn(room, o.sag);
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
        const y = stringY(x, w, y0, sg) - 6;
        el.style.transform =
          `translate(${(x - cw / 2).toFixed(1)}px,${y.toFixed(1)}px) rotate(${a.toFixed(4)}rad)`;
        el.style.zIndex = String(i === near ? n + 1 : n - Math.abs(i - near));
      }

      line.current?.setAttribute(
        "d",
        `M0 ${y0} Q${w / 2} ${y0 + 2 * sg} ${w} ${y0}`,
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

      <div className="bl-line-bar" ref={bar}>
        <div className="bl-line-cap" key={active}>
          {showing.title && <span className="bl-line-title">{showing.title}</span>}
          {showing.caption && <span className="bl-line-sub">{showing.caption}</span>}
          {showing.blurb && <span className="bl-line-blurb">{showing.blurb}</span>}
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
