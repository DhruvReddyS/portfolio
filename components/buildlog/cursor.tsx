"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The pointer, redrawn.
 *
 * Two parts, because one is not enough to say anything: a dot that is exactly
 * where the pointer is, and a ring that is always a little behind it. The lag
 * is the whole effect. A single ring locked to the cursor is just a cursor in
 * a different shape; a ring that catches up reads as weight.
 *
 * It states what is under it rather than decorating it. Over a link the ring
 * opens and takes the accent, over the bug it becomes a reticle, over text it
 * narrows to a bar. Everywhere else it is a thin circle you stop noticing.
 *
 * Only on a device with a real pointer, and never when motion is unwelcome:
 * hiding the system cursor on a touch screen hides nothing and helps no one,
 * and a trailing ring is exactly the kind of motion that setting is for.
 */

type State = "idle" | "link" | "text" | "hunt";

const LINK = 'a, button, [role="button"], summary, label, select, .bl-spine-act';
const TEXT = "input, textarea, [contenteditable='true']";

export function Cursor() {
  const dot = useRef<HTMLSpanElement>(null);
  const ring = useRef<HTMLSpanElement>(null);
  const [on, setOn] = useState(false);
  const [state, setState] = useState<State>("idle");
  const [down, setDown] = useState(false);
  const [out, setOut] = useState(true);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    const check = () => setOn(fine.matches && !still.matches);
    check();
    fine.addEventListener("change", check);
    still.addEventListener("change", check);
    return () => {
      fine.removeEventListener("change", check);
      still.removeEventListener("change", check);
    };
  }, []);

  useEffect(() => {
    if (!on) return;
    document.documentElement.classList.add("bl-cursor-on");

    const to = { x: innerWidth / 2, y: innerHeight / 2 };
    const at = { ...to };
    let raf = 0;

    const move = (event: PointerEvent) => {
      to.x = event.clientX;
      to.y = event.clientY;
      setOut(false);

      const target = event.target;
      if (!(target instanceof Element)) return;
      setState(
        target.closest(".bl-bug")
          ? "hunt"
          : target.closest(TEXT)
            ? "text"
            : target.closest(LINK)
              ? "link"
              : "idle",
      );
    };

    const loop = () => {
      // the dot is where the pointer is; the ring is always catching up
      at.x += (to.x - at.x) * 0.18;
      at.y += (to.y - at.y) * 0.18;
      if (dot.current) {
        dot.current.style.transform = `translate3d(${to.x}px, ${to.y}px, 0)`;
      }
      if (ring.current) {
        ring.current.style.transform = `translate3d(${at.x.toFixed(2)}px, ${at.y.toFixed(2)}px, 0)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const leave = () => setOut(true);
    const enter = () => setOut(false);
    const press = () => setDown(true);
    const release = () => setDown(false);

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    document.addEventListener("pointerenter", enter);
    window.addEventListener("pointerdown", press);
    window.addEventListener("pointerup", release);
    window.addEventListener("blur", leave);

    return () => {
      document.documentElement.classList.remove("bl-cursor-on");
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
      document.removeEventListener("pointerenter", enter);
      window.removeEventListener("pointerdown", press);
      window.removeEventListener("pointerup", release);
      window.removeEventListener("blur", leave);
    };
  }, [on]);

  if (!on) return null;

  return (
    <>
      <span ref={dot} className="bl-cursor-dot" data-state={state} data-out={out} aria-hidden="true" />
      <span
        ref={ring}
        className="bl-cursor-ring"
        data-state={state}
        data-down={down}
        data-out={out}
        aria-hidden="true"
      >
        <i />
        <i />
        <i />
        <i />
      </span>
    </>
  );
}

export default Cursor;
