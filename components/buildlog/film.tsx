"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { caseFiles, sideQuests, type CaseFile } from "@/lib/portfolio-data";
import { Ink } from "./ink";
import { MaskLines } from "./smooth";
import { MarkArrow, MarkRosette } from "./marks";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * The six builds, run through horizontally while the section is pinned.
 * Below the breakpoint it falls back to a native snap-scrolling strip, which
 * is both simpler and better on a touch screen.
 */
export function FilmStrip({ onOpen }: { onOpen: (file: CaseFile) => void }) {
  const section = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const sectionNode = section.current;
    const trackNode = track.current;
    if (!sectionNode || !trackNode) return;

    const wide = window.matchMedia("(min-width: 861px)");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!wide.matches || still.matches) return;

    const context = gsap.context(() => {
      const distance = () =>
        Math.max(0, trackNode.scrollWidth - window.innerWidth);

      gsap.to(trackNode, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: sectionNode,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.85,
          invalidateOnRefresh: true,
          onUpdate: (self) => setProgress(self.progress),
        },
      });

      // each still drifts against the travel, so the strip has depth
      gsap.utils.toArray<HTMLElement>(".bl-panel-media img").forEach((image) => {
        gsap.fromTo(
          image,
          { xPercent: -6 },
          {
            xPercent: 6,
            ease: "none",
            scrollTrigger: {
              trigger: sectionNode,
              start: "top top",
              end: () => `+=${distance()}`,
              scrub: 1,
            },
          },
        );
      });
    }, sectionNode);

    return () => context.revert();
  }, []);

  return (
    <>
        <section className="bl-film" id="work" ref={section}>
        <header className="bl-film-head">
          <span className="bl-act-num" aria-hidden="true">
            II
          </span>
          <div>
            <p className="bl-eyebrow">Act II</p>
            <MaskLines
              className="bl-film-title"
              as="h2"
              lines={[
                <>
                  Six things I{" "}
                  <Ink type="highlight" delay={500} iterations={1}>
                    actually shipped
                  </Ink>
                </>,
              ]}
            />
          </div>
        </header>

        <div className="bl-film-viewport">
          <div className="bl-film-track" ref={track}>
            {caseFiles.map((file) => (
              <article
                className="bl-panel"
                key={file.id}
                data-plain={file.image ? "false" : "true"}
              >
                {file.image && (
                  <div className="bl-panel-media">
                    <Image
                      src={file.image}
                      alt={`${file.name}, ${file.tagline}`}
                      fill
                      sizes="70vw"
                    />
                  </div>
                )}

                <span className="bl-panel-index" aria-hidden="true">
                  {file.index}
                </span>

                <div className="bl-panel-copy">
                  <p className="bl-panel-domain">{file.domain}</p>
                  <h3 className="bl-panel-name">{file.name}</h3>
                  <p className="bl-panel-tagline">{file.tagline}</p>
                  <p className="bl-panel-thesis">{file.thesis}</p>

                  <p className="bl-panel-stack">{file.stack.slice(0, 6).join("  /  ")}</p>

                  <div className="bl-panel-actions">
                    <button
                      type="button"
                      className="bl-btn bl-btn-solid"
                      onClick={() => onOpen(file)}
                    >
                      Open case file <MarkArrow size={13} />
                    </button>
                    {file.link && (
                      <a
                        className="bl-btn"
                        href={file.link.href}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Live site <MarkArrow size={12} />
                      </a>
                    )}
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

        <div className="bl-film-progress" aria-hidden="true">
          <span style={{ transform: `scaleX(${Math.max(0.02, progress)})` }} />
        </div>

      </section>

      <section className="bl-section bl-quests-section">
        <div className="bl-quests">
          <div className="bl-quests-head">
            <p className="bl-eyebrow">Side quests</p>
            <i aria-hidden="true" />
            <span className="bl-hand">built because it bugged me</span>
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
