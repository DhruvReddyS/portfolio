"use client";

import { useEffect, useRef, useState } from "react";
import { profile, sections } from "@/lib/portfolio-data";
import { useSmoothScroll } from "./smooth";
import { MarkArrow, MarkClose, MarkDownload } from "./marks";

/**
 * The site's mark: the D, set in its own counter, with the dot that goes
 * with it. The lime it was drawn in belongs to no other thing on this page,
 * so it is the accent here and the square carries it.
 */
function BrandMark() {
  return (
    <span className="bl-brand-stamp" aria-hidden="true">
      <svg viewBox="0 0 64 64" fill="none">
        <rect className="bl-brand-plate" width="64" height="64" rx="18" />
        <path
          className="bl-brand-letter"
          d="M16 16h15c11 0 18 6 18 16s-7 16-18 16H16V16Zm10 9v14h5c5 0 8-2 8-7s-3-7-8-7h-5Z"
        />
        <circle className="bl-brand-dot" cx="49" cy="15" r="5" />
      </svg>
    </span>
  );
}

/**
 * The bar, and the contents page behind it.
 *
 * It is a capsule rather than a strip across the top: the page under it is a
 * poster that bleeds off both edges, and a full-width band laid over that cuts
 * the picture in half. Floating and inset, it sits on the page instead of
 * cropping it.
 *
 * The middle of it is the spine of the book. Seven acts, seven numerals, and
 * only the one you are reading says its name; point at any other and it says
 * its own. That way the whole contents is on screen at all times and takes
 * the room of a word, instead of seven tabs spending the full width telling
 * you about six places you are not.
 *
 * Below a laptop the spine will not fit honestly, so it goes, and the
 * contents opens as a page of its own.
 */
export function BuildLogNav({ active }: { active: string }) {
  const { scrollTo } = useSmoothScroll();
  const [hidden, setHidden] = useState(false);
  const [stuck, setStuck] = useState(false);
  const [open, setOpen] = useState(false);
  const [read, setRead] = useState(0);
  const lastScroll = useRef(0);

  // Hide on the way down, bring it back on the way up, and keep the hairline
  // pinned to how much of the page is behind you.
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const span = document.documentElement.scrollHeight - window.innerHeight;
      setRead(span > 0 ? Math.min(1, Math.max(0, y / span)) : 0);
      setHidden(y > 320 && y > lastScroll.current);
      setStuck(y > 12);
      lastScroll.current = y;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("bl-locked", open);
    if (!open) return;

    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", escape);
    return () => {
      document.documentElement.classList.remove("bl-locked");
      window.removeEventListener("keydown", escape);
    };
  }, [open]);

  const go = (id: string) => {
    setOpen(false);
    const node = document.getElementById(id);
    if (node) scrollTo(node);
  };

  const current = sections.find((item) => item.id === active);

  return (
    <>
      <header className="bl-nav" data-hidden={hidden && !open} data-stuck={stuck}>
        <div className="bl-nav-shell">
          <a
            className="bl-brand"
            href="#top"
            onClick={(event) => {
              event.preventDefault();
              scrollTo(0);
            }}
          >
            <BrandMark />
            <span className="bl-brand-title" aria-hidden="true">
              The Build Log
            </span>
            <span className="bl-sr">S. Dhruv Reddy, home</span>
          </a>

          {/* the spine: every act, named */}
          <nav className="bl-spine" aria-label="Sections">
            {sections.map((item) => (
              <button
                key={item.id}
                type="button"
                className="bl-spine-act"
                data-active={active === item.id}
                onClick={() => go(item.id)}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="bl-nav-end">
            <a
              className="bl-resume"
              href={profile.resume}
              target="_blank"
              rel="noreferrer"
            >
              <span>Résumé</span>
              <MarkDownload size={12} />
            </a>

            {/*
              Two rules rather than three: the third does nothing a closed
              menu needs to say, and on the open state the outer two cross
              over, which the middle one would have to be hidden for anyway.
            */}
            <button
              className="bl-nav-menu"
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-haspopup="dialog"
            >
              <i aria-hidden="true" />
              <i aria-hidden="true" />
              <span className="bl-sr">Contents</span>
            </button>
          </div>

          <span
            className="bl-nav-read"
            aria-hidden="true"
            style={{ transform: `scaleX(${read})` }}
          />
        </div>
      </header>

      {open && (
        <div
          className="bl-contents"
          role="dialog"
          aria-modal="true"
          aria-label="Contents"
        >
          <div className="bl-contents-bar">
            <p className="bl-contents-kicker">
              The Build Log
              <i aria-hidden="true" />
              <b>{current ? current.label : "The cover"}</b>
            </p>
            <button
              className="bl-contents-close"
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close the contents"
            >
              <MarkClose size={15} />
            </button>
          </div>

          <ol className="bl-contents-list">
            {sections.map((item, index) => (
              <li key={item.id} style={{ "--i": index } as React.CSSProperties}>
                <button
                  type="button"
                  onClick={() => go(item.id)}
                  data-active={active === item.id}
                >
                  <span className="bl-contents-no">{item.act}</span>
                  <span className="bl-contents-name">{item.label}</span>
                  <span className="bl-contents-note">{item.note}</span>
                  <i aria-hidden="true" />
                  <span className="bl-contents-go" aria-hidden="true">
                    <MarkArrow size={14} />
                  </span>
                </button>
              </li>
            ))}
          </ol>

          <div className="bl-contents-foot">
            <a href={profile.resume} target="_blank" rel="noreferrer">
              Résumé, PDF
            </a>
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
            <span>
              {profile.location} · {profile.coords}
            </span>
          </div>
        </div>
      )}
    </>
  );
}
