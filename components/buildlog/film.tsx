"use client";

import { Fragment, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { caseFiles, sideQuests, type CaseFile } from "@/lib/portfolio-data";
import { MarkGithub, MarkPaper, MarkRosette, MarkWindow } from "./marks";
import { Plate } from "./plate";
import { SectionHeader } from "./sections";
import { Marked, MarkedLine } from "./marked";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * The six builds, laid out as a bento.
 *
 * Tiles come in four sizes and the sizes are fixed per slot, not per card,
 * so the wall keeps its shape whatever the content does. The order is the
 * order of the data, which keeps the ghosted numerals reading 01 to 06 down
 * the wall, and each build landed in the slot its artwork suits: the lead
 * one takes the big square, the one with a wide photograph takes a wide
 * slot, and the two with no screenshot at all take the small ones, where a
 * monogram is all a tile has room for anyway.
 *
 * A tile shows as much as its size can hold. The big one carries the whole
 * card; the small ones carry a name and a way in. That is the point of the
 * layout: were every tile to say the same amount, the sizes would be
 * decoration.
 */

/** Slot sizes, in the order the cards are written. */
const SLOTS = ["big", "wide", "small", "small", "wide", "wide"] as const;

/** Slot sizes for the two side quests, which follow the note. */
const QUEST_SLOTS = ["small", "small"] as const;

/**
 * The note pinned up among the cards.
 *
 * A wall of nothing but cards asks to be skimmed, and skimming is how a
 * reader comes away thinking all eight were the same kind of thing. One
 * tile that is not a card breaks the run and says what the cards are for.
 * It is pinned paper, not a card: kraft rather than dark, dashed rather
 * than ruled, and set in the display face the headings use.
 */
function WallNote() {
  return (
    <aside className="bl-note" data-size="wide">
      <p className="bl-note-label">Margin note</p>

      <MarkPaper className="bl-note-mark" size={26} />

      <p className="bl-note-line">
        A demo proves it <Marked kind="circle">runs</Marked>. A case file
        proves it holds.
      </p>

      <p className="bl-note-foot">
        Every card here opens one: the architecture, the numbers, what broke.
      </p>
    </aside>
  );
}

export function FilmStrip({ onOpen }: { onOpen: (file: CaseFile) => void }) {
  const track = useRef<HTMLDivElement>(null);

  // The cards used to pin this act and turn vertical scroll sideways. The
  // log does that now, and two pinned acts back to back is the same trick
  // twice: a reader gets two consecutive stretches where scrolling down
  // does not move the page down. The wall lays out and simply scrolls.
  useEffect(() => {
    const trackNode = track.current;
    if (!trackNode) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const context = gsap.context(() => {
      gsap.from(".bl-film-track > *", {
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
            {caseFiles.map((file, index) => (
              <Fragment key={file.id}>
              <article
                className="bl-panel"
                data-size={SLOTS[index] ?? "wide"}
              >
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

              {/* the note sits mid-wall, where the run of cards would
                  otherwise be at its most uniform */}
              {index === 3 && <WallNote />}
              </Fragment>
            ))}

            {/* the side quests used to be a list of names under the wall,
                which read as a footnote to the work rather than part of it.
                They are tiles now, at the size their story needs: a name, a
                sentence, and where it was built. There is no case file
                behind either, so neither tile offers one. */}
            {sideQuests.map((quest, index) => (
              <article
                className="bl-panel"
                key={quest.id}
                data-size={QUEST_SLOTS[index] ?? "small"}
                data-kind="quest"
              >
                <div className="bl-panel-media">
                  <Plate bare dir="work" name={quest.id} monogram={quest.name} alt="" />
                </div>

                <div className="bl-panel-copy">
                  <p className="bl-panel-domain">Side quest · {quest.context}</p>
                  <h3 className="bl-panel-name">{quest.name}</h3>
                  <p className="bl-panel-blurb">{quest.blurb}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

      </section>
    </>
  );
}
