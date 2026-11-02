"use client";

import { useEffect, useRef, useState } from "react";
import { profile, sections } from "@/lib/portfolio-data";
import { useSmoothScroll } from "./smooth";
import { MarkArrow, MarkClose, MarkDownload } from "./marks";

/**
 * The bar, and the contents page behind it.
 *
 * What was here before was the row of centred uppercase tabs with a ring
 * sliding between them: the default bar, the one every generated site wears,
 * and it spent the full width of the page telling you about seven places you
 * were not. A book does not print its contents across the top of every page.
 *
 * So the bar holds three things and no more: the mark, which act you are
 * reading, and the way out to the CV. The act is a button, and it opens the
 * contents as a page of its own. A hairline across the very top is how far
 * through you are, which is the one thing a bar can say that a book cannot.
 */
export function BuildLogNav({ active }: { active: string }) {
  const { scrollTo } = useSmoothScroll();
  const [hidden, setHidden] = useState(false);
  const [stuck, setStuck] = useState(false);
  const [open, setOpen] = useState(false);
  const [read, setRead] = useState(0);
  /** Which page of the book you are on, and how many there are. */
  const [folio, setFolio] = useState({ at: 1, of: 1 });
  const lastScroll = useRef(0);

  // Hide on the way down, bring it back on the way up, and keep the hairline
  // pinned to how much of the page is behind you.
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const span =
        document.documentElement.scrollHeight - window.innerHeight;
      setRead(span > 0 ? Math.min(1, Math.max(0, y / span)) : 0);

      /*
       * A folio, because this is a book and a book tells you where you are
       * by the page. A screenful is a page: it is the only definition that
       * means anything on a document that reflows, and it is honest about
       * being an approximation because the last one is rarely full.
       */
      const of = Math.max(1, Math.round(document.documentElement.scrollHeight / window.innerHeight));
      const at = Math.min(of, Math.floor(y / window.innerHeight) + 1);
      setFolio((prev) => (prev.at === at && prev.of === of ? prev : { at, of }));
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
        <span
          className="bl-nav-read"
          aria-hidden="true"
          style={{ transform: `scaleX(${read})` }}
        />

        <a
          className="bl-brand"
          href="#top"
          onClick={(event) => {
            event.preventDefault();
            scrollTo(0);
          }}
        >
          <span className="bl-brand-stamp" aria-hidden="true">SDR</span>
          <span className="bl-brand-title" aria-hidden="true">
            The Build Log
          </span>
          <span className="bl-sr">S. Dhruv Reddy, home</span>
        </a>

        <button
          className="bl-act"
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={open}
          aria-haspopup="dialog"
        >
          <span className="bl-act-no">{current ? current.act : "00"}</span>
          <span className="bl-act-name">
            {current ? current.label : "The cover"}
          </span>
          <i className="bl-act-rule" aria-hidden="true" />
          <span className="bl-act-word">Contents</span>
        </button>

        <p className="bl-folio" aria-hidden="true">
          <i>p.</i>
          <b>{String(folio.at).padStart(2, "0")}</b>
          <span>/ {String(folio.of).padStart(2, "0")}</span>
        </p>

        <a
          className="bl-resume"
          href={profile.resume}
          target="_blank"
          rel="noreferrer"
        >
          Résumé <MarkDownload size={12} />
        </a>
      </header>

      {open && (
        <div
          className="bl-contents"
          role="dialog"
          aria-modal="true"
          aria-label="Contents"
        >
          <div className="bl-contents-bar">
            <p className="bl-contents-kicker">The Build Log, contents</p>
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
