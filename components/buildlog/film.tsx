"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { caseFiles, sideQuests, type CaseFile } from "@/lib/portfolio-data";
import { MarkGithub, MarkPaper, MarkRosette, MarkWindow } from "./marks";
import { Plate } from "./plate";
import { SectionHeader } from "./sections";
import { MarkedLine } from "./marked";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * The six builds, run through horizontally while the section is pinned.
 * Below the breakpoint it falls back to a native snap-scrolling strip, which
 * is both simpler and better on a touch screen.
 */
export function FilmStrip({ onOpen }: { onOpen: (file: CaseFile) => void }) {
  const track = useRef<HTMLDivElement>(null);

  // The cards used to pin this act and turn vertical scroll sideways. The
  // log does that now, and two pinned acts back to back is the same trick
  // twice: a reader gets two consecutive stretches where scrolling down
  // does not move the page down. These lay out as a grid and simply scroll.
  useEffect(() => {
    const trackNode = track.current;
    if (!trackNode) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const context = gsap.context(() => {
      gsap.from(".bl-panel", {
        y: 42,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: { trigger: trackNode, start: "top 82%", once: true },
      });
    }, trackNode);

    return () => context.revert();
  }, []);

  return (
    <>
        <section className="bl-film" id="work">
        <SectionHeader
        label="02 / Selected work"
        title="Six things I shipped"
        lead="Six builds. Open any one for the full case file."
      />

      <div className="bl-film-viewport">
          <div className="bl-film-track" ref={track}>
            {caseFiles.map((file) => (
              <article className="bl-panel" key={file.id}>
                <div className="bl-panel-media">
                  <Plate
                    bare
                    dir="work"
                    name={file.id}
                    src={file.image}
                    monogram={file.name}
                    alt={`${file.name}, ${file.tagline}`}
                  />
                </div>

                <span className="bl-panel-index" aria-hidden="true">
                  {file.index}
                </span>

                <div className="bl-panel-copy">
                  <p className="bl-panel-domain">{file.domain}</p>
                  <h3 className="bl-panel-name">{file.name}</h3>
                  <p className="bl-panel-tagline">{file.tagline}</p>
                  <p className="bl-panel-thesis">
                    <MarkedLine text={file.thesis} mark={file.mark} />
                  </p>

                  <p className="bl-panel-stack">{file.stack.slice(0, 6).join("  /  ")}</p>

                  {/* three ways in: the live site, the source, the write-up.
                      A link only appears when there is a real one to follow. */}
                  <div className="bl-panel-actions">
                    {file.link && (
                      <a
                        className="bl-btn bl-btn-solid"
                        href={file.link.href}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <MarkWindow size={13} /> Visit site
                      </a>
                    )}
                    {file.repo && (
                      <a
                        className="bl-btn"
                        href={file.repo}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <MarkGithub size={13} /> Source
                      </a>
                    )}
                    <button
                      type="button"
                      className={file.link ? "bl-btn" : "bl-btn bl-btn-solid"}
                      onClick={() => onOpen(file)}
                    >
                      <MarkPaper size={13} /> Case file
                    </button>
                    {file.awards && (
                      <span className="bl-panel-award">
                        <MarkRosette size={13} /> Winner, twice
                      </span>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

      </section>

      <section className="bl-section bl-quests-section">
        <div className="bl-quests">
          <div className="bl-quests-head">
            <p className="bl-head-label">Side quests</p>
            <i aria-hidden="true" />
            <span className="bl-mono">Built because it bugged me</span>
          </div>
          <ul className="bl-quest-list">
            {sideQuests.map((quest) => (
              <li className="bl-quest" key={quest.id}>
                <strong>{quest.name}</strong>
                <p>{quest.blurb}</p>
                <em>{quest.context}</em>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
