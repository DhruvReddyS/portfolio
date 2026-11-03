"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type SmoothValue = {
  scrollTo: (target: string | number | HTMLElement) => void;
};

const SmoothContext = createContext<SmoothValue>({ scrollTo: () => {} });

/**
 * Inertia scrolling, driven by GSAP's ticker so that ScrollTrigger pinning
 * stays in step with it.
 *
 * Left out entirely on a touch screen, and when the visitor has asked for
 * reduced motion. A phone's own scrolling is already handed off to the
 * compositor and runs whatever else the page is doing; putting it back on
 * the main thread, behind a frame loop and a ScrollTrigger update on every
 * event, is how a site that scrolls beautifully on a laptop comes to stutter
 * in a hand. Native scrolling is the better inertia here, and it is free.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenis = useRef<Lenis | null>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const touch = window.matchMedia("(pointer: coarse)").matches;
    if (reduced || touch) return;

    const instance = new Lenis({
      lerp: 0.085,
      wheelMultiplier: 1,
      smoothWheel: true,
    });
    lenis.current = instance;

    instance.on("scroll", ScrollTrigger.update);

    // Expose how fast the page is moving so sections can lean into it.
    const root = document.documentElement;
    instance.on("scroll", ({ velocity }: { velocity: number }) => {
      const lean = Math.max(-1.7, Math.min(1.7, velocity * 0.035));
      root.style.setProperty("--bl-skew", `${lean.toFixed(3)}deg`);
    });

    const raf = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      instance.destroy();
      document.documentElement.style.removeProperty("--bl-skew");
      lenis.current = null;
    };
  }, []);

  const scrollTo = useCallback((target: string | number | HTMLElement) => {
    if (lenis.current) {
      lenis.current.scrollTo(target, { offset: -10, duration: 1.4 });
      return;
    }

    if (typeof target === "number") {
      window.scrollTo({ top: target, behavior: "smooth" });
      return;
    }

    const node =
      typeof target === "string" ? document.querySelector(target) : target;
    node?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <SmoothContext.Provider value={{ scrollTo }}>{children}</SmoothContext.Provider>
  );
}

export function useSmoothScroll() {
  return useContext(SmoothContext);
}

/**
 * Reveals its lines from behind a mask as they scroll in. Each child line is
 * wrapped so it can slide up independently.
 */
export function MaskLines({
  lines,
  className,
  as: Tag = "h2",
  delay = 0,
}: {
  lines: React.ReactNode[];
  className?: string;
  as?: "h1" | "h2" | "h3" | "p";
  delay?: number;
}) {
  const host = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = host.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={host as any}
      className={["bl-mask", className].filter(Boolean).join(" ")}
      data-in={shown ? "true" : "false"}
    >
      {lines.map((line, index) => (
        <span className="bl-mask-line" key={index}>
          <span
            className="bl-mask-inner"
            style={{ transitionDelay: `${delay + index * 90}ms` }}
          >
            {line}
          </span>
        </span>
      ))}
    </Tag>
  );
}


/**
 * Counts a figure up from zero the first time it is scrolled into view.
 * Keeps whatever prefix and suffix the written value had, so "~85%" counts
 * the 85 and leaves the rest alone.
 */
export function Counter({ value }: { value: string }) {
  const host = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState<string | null>(null);
  const parts = value.match(/^([^0-9]*)([0-9][0-9,.]*)(.*)$/);

  useEffect(() => {
    const node = host.current;
    // Matched again in here: the array identity changes on every render, so
    // depending on it would restart the count each time.
    const matched = value.match(/^([^0-9]*)([0-9][0-9,.]*)(.*)$/);
    if (!node || !matched) return;

    const digits = matched[2];
    const target = Number(digits.replace(/,/g, ""));
    if (!Number.isFinite(target)) return;

    const decimals = (digits.split(".")[1] ?? "").length;
    const grouped = digits.includes(",");
    // "05" should stay two digits all the way up, not collapse to "5"
    const pad = digits.startsWith("0") ? digits.split(".")[0].length : 0;

    const format = (n: number) => {
      const fixed = n.toFixed(decimals);
      const [rawWhole, rest] = fixed.split(".");
      let whole = rawWhole;
      if (grouped) whole = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      if (pad) whole = whole.padStart(pad, "0");
      return rest ? `${whole}.${rest}` : whole;
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      queueMicrotask(() => setShown(format(target)));
      return;
    }

    // Drop to zero only once scripting has taken over, so the figure itself
    // is what sits in the server-rendered markup.
    queueMicrotask(() => setShown(format(0)));

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        const counter = { n: 0 };
        gsap.to(counter, {
          n: target,
          duration: Math.min(2.1, 0.9 + Math.log10(target + 1) * 0.35),
          ease: "power2.out",
          onUpdate: () => setShown(format(counter.n)),
        });
      },
      { threshold: 0.6 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [value]);

  if (!parts) return <span>{value}</span>;

  const [, prefix, digits, suffix] = parts;
  return (
    <span ref={host}>
      {prefix}
      {shown ?? digits}
      {suffix}
    </span>
  );
}

/**
 * Pulls its child a little way toward the cursor while the pointer is near,
 * then lets it spring back.
 */
export function Magnetic({
  children,
  strength = 0.32,
  className,
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) {
  const host = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = host.current;
    if (!node) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const target = node.firstElementChild as HTMLElement | null;
    if (!target) return;

    const onMove = (event: PointerEvent) => {
      const box = node.getBoundingClientRect();
      const inside =
        event.clientX > box.left - 60 &&
        event.clientX < box.right + 60 &&
        event.clientY > box.top - 60 &&
        event.clientY < box.bottom + 60;

      if (!inside) {
        gsap.to(target, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.4)" });
        return;
      }

      gsap.to(target, {
        x: (event.clientX - (box.left + box.width / 2)) * strength,
        y: (event.clientY - (box.top + box.height / 2)) * strength,
        duration: 0.5,
        ease: "power3.out",
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      gsap.killTweensOf(target);
    };
  }, [strength]);

  return (
    <span ref={host} className={className} style={{ display: "inline-flex" }}>
      {children}
    </span>
  );
}


/**
 * Drifts an element against the scroll while it passes through the viewport.
 * Returns the ref to hang on whatever should move.
 */
export function useParallax<T extends HTMLElement>({
  y = 0,
  scale,
  from = "top bottom",
  to = "bottom top",
}: {
  y?: number;
  scale?: number;
  from?: string;
  to?: string;
} = {}) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const context = gsap.context(() => {
      gsap.fromTo(
        node,
        { y: 0, ...(scale ? { scale: 1 } : {}) },
        {
          y,
          ...(scale ? { scale } : {}),
          ease: "none",
          scrollTrigger: {
            trigger: node,
            start: from,
            end: to,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        },
      );
    }, node);

    return () => context.revert();
  }, [y, scale, from, to]);

  return ref;
}
