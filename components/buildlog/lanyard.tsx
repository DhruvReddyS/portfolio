"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * A card on a lanyard, hung off the top of its own box, that you can
 * take hold of and swing.
 *
 * The strap is a rope rather than a picture of one: a line of points
 * stepped forward each frame under gravity, then pulled back to their
 * rest spacing a few times over, which is the whole of Verlet
 * integration and about forty lines of it. The card hangs off the last
 * point and takes its angle from the last length of strap, so when the
 * strap whips the card whips with it, and when it settles the card
 * settles level. Nothing about that is scripted; it falls out of the
 * rope.
 *
 * Why by hand and not with the physics engine already in this project:
 * the engine is in the toolkit act running thirty-odd bodies in a box
 * with collisions, which is what it is for. A rope of twenty points
 * with one constraint each needs none of that, and the card has to be
 * a real element of the page, with real text in it that can be read,
 * selected and searched, rather than something drawn into a canvas.
 *
 * Dragging is a pointer capture on the card: while it is held, the end
 * of the rope is moved to wherever the pointer is and its velocity
 * thrown away, so the rope is dragged rather than thrown. Letting go
 * hands it back to gravity, carrying whatever speed the last frame of
 * the drag gave it, which is what makes a flick work.
 */

/** How many points the strap is made of, the first one pinned. */
const LINKS = 18;
/** Pixels of gravity per frame squared. */
const FALL = 1.15;
/** How much speed survives a frame. */
const KEEP = 0.985;
/** Passes of the length constraint per frame. More is stiffer. */
const PASSES = 14;

type Point = { x: number; y: number; px: number; py: number };

export function Lanyard({
  children,
  /** Where along the top of the box the strap is pinned, 0 to 1. */
  at = 0.5,
  /** How long the strap is, as a share of the box's height. */
  drop = 0.34,
  /** A nudge on arrival, so it is visibly a thing that swings. */
  push = 0,
  className,
}: {
  children: ReactNode;
  at?: number;
  drop?: number;
  push?: number;
  className?: string;
}) {
  const box = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const rope = useRef<SVGPolylineElement>(null);
  const stitch = useRef<SVGPolylineElement>(null);

  useEffect(() => {
    const frame = box.current;
    const tag = card.current;
    const line = rope.current;
    const seam = stitch.current;
    if (!frame || !tag || !line || !seam) return;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let span = 0;
    let points: Point[] = [];
    let raf = 0;

    /** Where the pointer has the card, and where on the card it took hold. */
    let held: { id: number; dx: number; dy: number } | null = null;

    const hang = () => {
      const rect = frame.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const length = height * drop;
      span = length / (LINKS - 1);

      /* straight down from the pin, at rest */
      points = [];
      for (let i = 0; i < LINKS; i += 1) {
        const x = width * at;
        const y = i * span;
        points.push({ x, y, px: x, py: y });
      }

      /* and a shove, so the two of them are not hanging dead straight
         the first time anybody looks at the act */
      if (push && !still) {
        const end = points[LINKS - 1];
        end.px = end.x - push;
      }
    };

    const draw = () => {
      const last = points[LINKS - 1];
      const before = points[LINKS - 2];
      const lean = (Math.atan2(last.x - before.x, last.y - before.y) * -180) / Math.PI;

      tag.style.setProperty("--x", `${last.x.toFixed(2)}px`);
      tag.style.setProperty("--y", `${last.y.toFixed(2)}px`);
      tag.style.setProperty("--lean", `${lean.toFixed(2)}deg`);

      const path = points.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
      line.setAttribute("points", path);
      seam.setAttribute("points", path);
    };

    const step = () => {
      raf = requestAnimationFrame(step);

      for (let i = 1; i < LINKS; i += 1) {
        const p = points[i];
        const vx = (p.x - p.px) * KEEP;
        const vy = (p.y - p.py) * KEEP;
        p.px = p.x;
        p.py = p.y;
        p.x += vx;
        p.y += vy + FALL;
      }

      for (let pass = 0; pass < PASSES; pass += 1) {
        /* the pin never moves */
        points[0].x = width * at;
        points[0].y = 0;

        /* nor does the end while it is being held */
        if (held) {
          const end = points[LINKS - 1];
          end.px = end.x;
          end.py = end.y;
        }

        for (let i = 0; i < LINKS - 1; i += 1) {
          const a = points[i];
          const b = points[i + 1];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const gap = Math.hypot(dx, dy) || 0.0001;
          const pull = (gap - span) / gap / 2;
          const ox = dx * pull;
          const oy = dy * pull;

          /* a pinned or held end takes none of the correction, so the
             other end takes all of it */
          const aFixed = i === 0;
          const bFixed = held !== null && i + 1 === LINKS - 1;

          if (!aFixed && !bFixed) {
            a.x += ox;
            a.y += oy;
            b.x -= ox;
            b.y -= oy;
          } else if (aFixed && !bFixed) {
            b.x -= ox * 2;
            b.y -= oy * 2;
          } else if (!aFixed && bFixed) {
            a.x += ox * 2;
            a.y += oy * 2;
          }
        }
      }

      draw();
    };

    const take = (event: PointerEvent) => {
      const rect = frame.getBoundingClientRect();
      const end = points[LINKS - 1];
      held = {
        id: event.pointerId,
        dx: event.clientX - rect.left - end.x,
        dy: event.clientY - rect.top - end.y,
      };
      /* capture keeps the drag alive when the pointer leaves the card,
         which it will, because the card moves out from under it. It
         throws if the pointer is already gone, and a drag that works
         matters more than a capture that does */
      try {
        tag.setPointerCapture(event.pointerId);
      } catch {
        // no capture: the drag still runs while the pointer is over it
      }

      tag.dataset.held = "true";
    };

    const move = (event: PointerEvent) => {
      if (!held || held.id !== event.pointerId) return;
      event.preventDefault();
      const rect = frame.getBoundingClientRect();
      const end = points[LINKS - 1];
      /* the previous position is left where it was, so letting go of a
         fast drag throws the card instead of dropping it */
      end.x = event.clientX - rect.left - held.dx;
      end.y = Math.max(span, event.clientY - rect.top - held.dy);
    };

    const drop_ = (event: PointerEvent) => {
      if (!held || held.id !== event.pointerId) return;
      held = null;
      delete tag.dataset.held;
      try {
        tag.releasePointerCapture(event.pointerId);
      } catch {
        // it was never captured, which is the other half of the above
      }
    };

    hang();
    draw();

    if (!still) {
      raf = requestAnimationFrame(step);
      tag.addEventListener("pointerdown", take);
      tag.addEventListener("pointermove", move);
      tag.addEventListener("pointerup", drop_);
      tag.addEventListener("pointercancel", drop_);
    }

    const watch = new ResizeObserver(() => {
      hang();
      draw();
    });
    watch.observe(frame);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      watch.disconnect();
      tag.removeEventListener("pointerdown", take);
      tag.removeEventListener("pointermove", move);
      tag.removeEventListener("pointerup", drop_);
      tag.removeEventListener("pointercancel", drop_);
    };
  }, [at, drop, push]);

  return (
    <div className={["bl-hang", className].filter(Boolean).join(" ")} ref={box}>
      <svg className="bl-hang-strap" aria-hidden="true">
        {/* the webbing, then the stitch down the middle of it */}
        <polyline className="bl-hang-tape" ref={rope} />
        <polyline className="bl-hang-stitch" ref={stitch} />
      </svg>

      {/* the ring the strap is threaded through */}
      <span className="bl-hang-pin" aria-hidden="true" style={{ left: `${at * 100}%` }} />

      <div className="bl-hang-card" ref={card}>
        <span className="bl-hang-clip" aria-hidden="true" />
        {children}
      </div>
    </div>
  );
}

export default Lanyard;
