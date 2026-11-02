"use client";

import * as React from "react";
import Matter from "matter-js";

/**
 * A pile of things, dropped in and then thrown around.
 *
 * Adapted from the falling-badges block of the portfolio-hero component. What
 * changed: it is bounded by its own container rather than a hero, it waits to
 * be scrolled to rather than firing on mount, it sleeps while it is off screen,
 * each chip carries a mark as well as a name, and it is drawn from this site's
 * own tokens instead of a fixed palette.
 *
 * The physics is the point and the point is honest: thirty-one tools is a
 * heap, and a heap is a better picture of a toolkit than a tidy list of
 * thirty-one equal rows. You can pick any one of them up.
 */

export type FallingItem = {
  name: string;
  /** Small mark drawn before the name. */
  icon?: React.ReactNode;
  /** The mark's own colour. The chip itself stays in the page's ink. */
  tone?: string;
  /** Pulls the chip out of the pile: filled in the accent rather than outlined. */
  lead?: boolean;
};

export interface FallingSkillsProps {
  items: FallingItem[];
  /**
   * Height of the box the pile falls into, as a custom property rather than an
   * inline height: how deep the heap ends up depends on how many chips fit per
   * row, so a narrow box needs a taller one and that is a decision only the
   * stylesheet can make.
   */
  height?: string;
  /** Milliseconds between one chip landing and the next being released. */
  stagger?: number;
  className?: string;
  /** Spoken label for the whole box. */
  label?: string;
}

/* Heavy and high-friction: these should land and stay landed, not bounce
   around like beach balls. */
const PHYSICS = {
  gravity: 1.9,
  restitution: 0.05,
  friction: 0.85,
  frictionStatic: 1.3,
  frictionAir: 0.013,
  density: 0.006,
};

const STEP = 1000 / 120;
const between = (a: number, b: number) => a + Math.random() * (b - a);

export function FallingSkills({
  items,
  height,
  stagger = 58,
  className,
  label = "Toolkit",
}: FallingSkillsProps) {
  const zone = React.useRef<HTMLDivElement>(null);
  const tiles = React.useRef<(HTMLDivElement | null)[]>([]);
  const [box, setBox] = React.useState({ w: 0, h: 0 });
  const [armed, setArmed] = React.useState(false);

  /* Deliberately not shuffled here. Randomising the order during render is
     impure, and on a server-rendered page it also means the markup the
     server sent and the markup the browser expects disagree. The variety
     comes from where each chip is released and at what angle, which is
     decided inside the effect where randomness belongs. */
  const order = items;

  React.useEffect(() => {
    const node = zone.current;
    if (!node || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(([entry]) => {
      const w = Math.round(entry.contentRect.width);
      const h = Math.round(entry.contentRect.height);
      setBox((prev) => (Math.abs(prev.w - w) > 8 || prev.h !== h ? { w, h } : prev));
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Nothing drops until it has been scrolled to: a pile that formed while the
  // reader was four sections above it is just a static heap by the time they
  // arrive, which is the whole of the effect thrown away.
  React.useEffect(() => {
    const node = zone.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      queueMicrotask(() => setArmed(true));
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setArmed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    const node = zone.current;
    if (!node || !box.w || !armed) return;

    const { Engine, Bodies, Body, Composite, Constraint, Sleeping } = Matter;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const W = box.w;
    const H = box.h;
    const WALL = 200;

    const engine = Engine.create({
      enableSleeping: true,
      positionIterations: 20,
      velocityIterations: 14,
    });
    engine.gravity.y = PHYSICS.gravity;

    Composite.add(engine.world, [
      Bodies.rectangle(W / 2, H + WALL / 2 - 2, W * 3, WALL, { isStatic: true, friction: 1 }),
      Bodies.rectangle(-WALL / 2, H / 2 - 600, WALL, H + 1600, { isStatic: true }),
      Bodies.rectangle(W + WALL / 2, H / 2 - 600, WALL, H + 1600, { isStatic: true }),
    ]);

    type Chip = Matter.Body & { el: HTMLDivElement; w: number; h: number };

    const elements = tiles.current.slice(0, order.length).filter(Boolean) as HTMLDivElement[];
    for (const el of elements) el.style.visibility = "hidden";

    const bodies: Chip[] = elements.map((el) => {
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      const body = Bodies.rectangle(
        between(w / 2 + 6, Math.max(w / 2 + 7, W - w / 2 - 6)),
        0,
        w,
        h,
        {
          chamfer: { radius: Math.min(14, h / 2) },
          restitution: PHYSICS.restitution,
          friction: PHYSICS.friction,
          frictionStatic: PHYSICS.frictionStatic,
          frictionAir: PHYSICS.frictionAir,
          density: PHYSICS.density,
          sleepThreshold: 42,
        },
      ) as Chip;
      body.el = el;
      body.w = w;
      body.h = h;
      return body;
    });

    let raf = 0;
    let running = false;
    let last = 0;
    let carry = 0;
    let dropped = 0;
    let onScreen = true;
    let drag: Matter.Constraint | null = null;
    const timers: number[] = [];

    const paint = () => {
      for (const b of bodies) {
        b.el.style.transform =
          `translate(${(b.position.x - b.w / 2).toFixed(1)}px,` +
          `${(b.position.y - b.h / 2).toFixed(1)}px) rotate(${b.angle.toFixed(4)}rad)`;
      }
    };

    const tick = (now: number) => {
      if (!last) last = now;
      carry += Math.min(50, now - last);
      last = now;
      while (carry >= STEP) {
        Engine.update(engine, STEP);
        carry -= STEP;
      }
      paint();
      // Stop once everything has been released and gone to sleep: a settled
      // pile costs nothing until somebody picks a chip up again.
      if (dropped === bodies.length && !drag && bodies.every((b) => b.isSleeping)) {
        running = false;
        last = 0;
        carry = 0;
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    const wake = () => {
      if (running || !onScreen) return;
      running = true;
      last = 0;
      raf = requestAnimationFrame(tick);
    };

    const release = (body: Chip, y: number) => {
      Body.setPosition(body, { x: body.position.x, y });
      Body.setAngle(body, between(-0.6, 0.6));
      Composite.add(engine.world, body);
      Body.setVelocity(body, { x: between(-1, 1), y: between(3, 6) });
      Body.setAngularVelocity(body, between(-0.05, 0.05));
    };

    const local = (event: PointerEvent) => {
      const rect = node.getBoundingClientRect();
      return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    };

    const detach: Array<() => void> = [];
    for (const body of bodies) {
      const el = body.el;
      const down = (event: PointerEvent) => {
        if (!engine.world.bodies.includes(body)) return;
        event.preventDefault();
        el.setPointerCapture(event.pointerId);
        el.dataset.held = "true";
        const point = local(event);
        const dx = point.x - body.position.x;
        const dy = point.y - body.position.y;
        const cos = Math.cos(-body.angle);
        const sin = Math.sin(-body.angle);
        drag = Constraint.create({
          pointA: point,
          bodyB: body,
          pointB: { x: dx * cos - dy * sin, y: dx * sin + dy * cos },
          stiffness: 0.12,
          damping: 0.08,
          length: 0,
        });
        Composite.add(engine.world, drag);
        Sleeping.set(body, false);
        wake();
      };
      const move = (event: PointerEvent) => {
        if (!drag || drag.bodyB !== body) return;
        drag.pointA = local(event);
        Sleeping.set(body, false);
      };
      const up = () => {
        if (!drag || drag.bodyB !== body) return;
        Composite.remove(engine.world, drag);
        drag = null;
        delete el.dataset.held;
        for (const other of bodies) Sleeping.set(other, false);
        wake();
      };
      el.addEventListener("pointerdown", down);
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerup", up);
      el.addEventListener("pointercancel", up);
      detach.push(() => {
        el.removeEventListener("pointerdown", down);
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerup", up);
        el.removeEventListener("pointercancel", up);
      });
    }

    if (reduced) {
      // Same pile, no falling: settle it off screen and show the result.
      bodies.forEach((body, i) => release(body, -70 - i * 42));
      for (let i = 0; i < 1600; i++) Engine.update(engine, STEP);
      paint();
      for (const body of bodies) body.el.style.visibility = "visible";
      dropped = bodies.length;
    } else {
      bodies.forEach((body, i) => {
        timers.push(
          window.setTimeout(() => {
            release(body, -50 - between(0, 120));
            body.el.style.visibility = "visible";
            dropped += 1;
            wake();
          }, 220 + i * stagger),
        );
      });
    }

    const visibility =
      typeof IntersectionObserver === "function"
        ? new IntersectionObserver(
            ([entry]) => {
              onScreen = entry.isIntersecting;
              if (onScreen) wake();
            },
            { rootMargin: "120px" },
          )
        : null;
    visibility?.observe(node);

    return () => {
      cancelAnimationFrame(raf);
      for (const id of timers) window.clearTimeout(id);
      for (const off of detach) off();
      visibility?.disconnect();
      Composite.clear(engine.world, false);
      Engine.clear(engine);
    };
  }, [box, order, armed, stagger]);

  return (
    <div
      ref={zone}
      className={["bl-pile", className].filter(Boolean).join(" ")}
      style={height ? ({ "--bl-pile-h": height } as React.CSSProperties) : undefined}
      role="list"
      aria-label={label}
    >
      {order.map((item, i) => (
        <div
          key={item.name}
          role="listitem"
          ref={(el) => {
            tiles.current[i] = el;
          }}
          className="bl-tool"
          data-lead={item.lead ? "true" : undefined}
          style={{ visibility: "hidden" }}
        >
          {item.icon && (
            <span className="bl-tool-mark" style={item.tone ? { color: item.tone } : undefined} aria-hidden="true">
              {item.icon}
            </span>
          )}
          <span className="bl-tool-name">{item.name}</span>
        </div>
      ))}
    </div>
  );
}

export default FallingSkills;
