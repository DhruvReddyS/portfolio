"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { profile, sections } from "@/lib/portfolio-data";
import { useLamp } from "./lamp";
import { useSmoothScroll } from "./smooth";
import { MarkClose, MarkDownload, MarkLamp, MarkLines } from "./marks";

export function BuildLogNav({ active }: { active: string }) {
  const { lamp, toggle } = useLamp();
  const { scrollTo } = useSmoothScroll();
  const [hidden, setHidden] = useState(false);
  const [menu, setMenu] = useState(false);
  const [ring, setRing] = useState<{ x: number; w: number } | null>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const lastScroll = useRef(0);

  // Hide the bar on the way down, bring it back on the way up.
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > 240 && y > lastScroll.current);
      lastScroll.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Slide the hand-drawn ring onto whichever tab is current.
  useLayoutEffect(() => {
    const container = tabsRef.current;
    if (!container) return;

    const move = () => {
      const node = container.querySelector<HTMLElement>(`[data-id="${active}"]`);
      if (!node) {
        setRing(null);
        return;
      }
      setRing({ x: node.offsetLeft, w: node.offsetWidth });
    };

    move();
    window.addEventListener("resize", move);
    return () => window.removeEventListener("resize", move);
  }, [active]);

  useEffect(() => {
    document.documentElement.classList.toggle("bl-locked", menu);
    return () => document.documentElement.classList.remove("bl-locked");
  }, [menu]);

  const go = (id: string) => {
    setMenu(false);
    const node = document.getElementById(id);
    if (node) scrollTo(node);
  };

  return (
    <>
      <header className="bl-nav" data-hidden={hidden && !menu}>
        <a
          className="bl-brand"
          href="#top"
          onClick={(event) => {
            event.preventDefault();
            scrollTo(0);
          }}
        >
          <i aria-hidden="true" />
          Build Log
        </a>

        <div className="bl-tabs" ref={tabsRef}>
          {ring && (
            <span
              className="bl-tab-ring"
              aria-hidden="true"
              style={{ transform: `translateX(${ring.x}px)`, width: ring.w }}
            />
          )}
          {sections.map((item) => (
            <button
              key={item.id}
              type="button"
              className="bl-tab"
              data-id={item.id}
              data-active={active === item.id}
              onClick={() => go(item.id)}
            >
              <sup>{item.act}</sup>
              {item.label}
            </button>
          ))}
        </div>

        <div className="bl-nav-actions">
          <button
            className="bl-lamp"
            type="button"
            onClick={toggle}
            aria-label={lamp === "off" ? "Turn the desk lamp on" : "Turn the desk lamp off"}
            title={lamp === "off" ? "Lights on" : "Lights out"}
          >
            <MarkLamp size={15} lit={lamp === "on"} />
          </button>

          <a className="bl-resume" href={profile.resume} target="_blank" rel="noreferrer">
            Résumé <MarkDownload size={12} />
          </a>

          <button
            className="bl-burger"
            type="button"
            onClick={() => setMenu((value) => !value)}
            aria-label="Menu"
            aria-expanded={menu}
          >
            {menu ? <MarkClose size={16} /> : <MarkLines size={16} />}
          </button>
        </div>
      </header>

      {menu && (
        <nav className="bl-mobile-nav" aria-label="Sections">
          {sections.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(event) => {
                event.preventDefault();
                go(item.id);
              }}
            >
              {item.label}
              <span>{item.act}</span>
            </a>
          ))}
          <a href={profile.resume} target="_blank" rel="noreferrer">
            Résumé
            <span>PDF</span>
          </a>
        </nav>
      )}
    </>
  );
}
