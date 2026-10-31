"use client";

import { useEffect, useState } from "react";
import { sections } from "@/lib/portfolio-data";
import { useSmoothScroll } from "./smooth";

/**
 * The left margin: a line of wet ink that fills as the page scrolls,
 * with a tick for each act.
 */
export function MarginRail({ active }: { active: string }) {
  const [progress, setProgress] = useState(0);
  const { scrollTo } = useSmoothScroll();

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const activeIndex = sections.findIndex((item) => item.id === active);

  return (
    <div className="bl-rail-wrap" aria-hidden="true">
      <div className="bl-rail-line">
        <span
          className="bl-rail-fill"
          style={{ height: `${progress * 100}%` }}
        />
        <span className="bl-rail-nib" style={{ top: `${progress * 100}%` }} />

        <div className="bl-rail-ticks">
          {sections.map((item, index) => (
            <button
              key={item.id}
              type="button"
              className="bl-rail-tick"
              style={{ top: `${(index / (sections.length - 1)) * 100}%` }}
              data-active={active === item.id}
              data-done={index <= activeIndex}
              tabIndex={-1}
              onClick={() => {
                const node = document.getElementById(item.id);
                if (node) scrollTo(node);
              }}
            >
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
      <p className="bl-rail-pct">{String(Math.round(progress * 100)).padStart(2, "0")}%</p>
    </div>
  );
}
