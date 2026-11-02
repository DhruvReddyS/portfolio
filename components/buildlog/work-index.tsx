"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { caseFiles, sideQuests, type CaseFile } from "@/lib/portfolio-data";
import { MarkArrow, MarkGithub, MarkPaper, MarkRosette, MarkWindow } from "./marks";
import { Plate } from "./plate";
import { SectionHeader } from "./sections";
import { Marked, MarkedLine } from "./marked";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * The work, set as the index of a book rather than a wall of cards.
 *
 * Cards were the wrong instrument. Eight of them want eight pictures, and
 * five of these builds have no picture to give; they want eight equal
 * sentences, and these have one strong one each; they want a shape, and the
 * shape kept being the subject. A list has none of those appetites. It says
 * what there is, in the order it happened, and it is read the way a contents
 * page is read: down the left, stopping where something catches.
 *
 * What a list cannot do is show the work, so the margin does that instead.
 * The plate alongside follows whichever row is under the pointer, and on a
 * narrow screen it goes away entirely and each row carries its own line.
 * Nothing is duplicated for a reader on a phone; it is simply fewer things.
 */

/** The figure a row is filed under, or what kind of build it was. */
function filedUnder(file: CaseFile) {
  const figure = file.metrics.find((metric) => /\d/.test(metric.value));
  return figure ? `${figure.value} ${figure.label}` : file.kind;
}

type Row = {
  id: string;
  index: string;
  name: string;
  field: string;
  filed: string;
  line: string;
  mark?: string;
  stack: string[];
  image?: string;
  link?: { label: string; href: string };
  repo?: string;
  decorated?: boolean;
  /** Absent on the side quests, which have no case file behind them. */
  file?: CaseFile;
  quest?: true;
};

const rows: Row[] = [
  ...caseFiles.map((file) => ({
    id: file.id,
    index: file.index,
    name: file.name,
    field: file.domain,
    filed: filedUnder(file),
    line: file.thesis,
    mark: file.mark,
    stack: file.stack,
    image: file.image,
    link: file.link,
    repo: file.repo,
    decorated: Boolean(file.awards),
    file,
  })),
  ...sideQuests.map((quest, offset) => ({
    id: quest.id,
    index: String(caseFiles.length + offset + 1).padStart(2, "0"),
    name: quest.name,
    field: "Side quest",
    filed: quest.context,
    line: quest.blurb,
    stack: quest.stack,
    quest: true as const,
  })),
];

export function WorkIndex({ onOpen }: { onOpen: (file: CaseFile) => void }) {
  const list = useRef<HTMLDivElement>(null);
  const [at, setAt] = useState(0);

  useEffect(() => {
    const node = list.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const context = gsap.context(() => {
      gsap.from(".bl-index-row", {
        y: 22,
        opacity: 0,
        duration: 0.55,
        ease: "power3.out",
        stagger: 0.055,
        scrollTrigger: { trigger: node, start: "top 80%", once: true },
      });
    }, node);

    return () => context.revert();
  }, []);

  const current = rows[at];

  return (
    <section className="bl-section bl-index" id="work">
      <SectionHeader
        label="02 / Selected work"
        title="What got built"
        lead="Six builds and two side quests, in the order they happened. Open any of the six for the case file."
      />

      <div className="bl-index-body" ref={list}>
        <ol className="bl-index-list">
          {rows.map((row, index) => (
            <Fragment key={row.id}>
              {/* where the numbered builds end and the rest begins */}
              {row.quest && !rows[index - 1]?.quest && (
                <li className="bl-index-break" aria-hidden="true">
                  <span>Built because it bugged me</span>
                  <i />
                </li>
              )}

              <li
                className="bl-index-row"
                data-on={at === index}
                data-quest={row.quest ? "true" : undefined}
                onMouseEnter={() => setAt(index)}
              >
                <span className="bl-index-num">{row.index}</span>

                <h3 className="bl-index-name">
                  {row.file ? (
                    <button
                      type="button"
                      onClick={() => onOpen(row.file as CaseFile)}
                      onFocus={() => setAt(index)}
                    >
                      {row.name}
                      <MarkArrow size={16} />
                    </button>
                  ) : (
                    <span>{row.name}</span>
                  )}
                </h3>

                <p className="bl-index-field">{row.field}</p>
                <p className="bl-index-filed">{row.filed}</p>

                {/* the sentence lives in the margin on a wide screen; on a
                    narrow one there is no margin, so it lives here */}
                <p className="bl-index-line">
                  <MarkedLine text={row.line} mark={row.mark} />
                </p>

                <div className="bl-index-links">
                  {row.link && (
                    <a href={row.link.href} target="_blank" rel="noreferrer">
                      <MarkWindow size={12} /> Live
                    </a>
                  )}
                  {row.repo && (
                    <a href={row.repo} target="_blank" rel="noreferrer">
                      <MarkGithub size={12} /> Source
                    </a>
                  )}
                  {row.decorated && (
                    <span className="bl-index-award">
                      <MarkRosette size={12} /> Winner, twice
                    </span>
                  )}
                </div>
              </li>
            </Fragment>
          ))}
        </ol>

        {/* the margin: what the list cannot say, for the row being read */}
        <aside className="bl-index-margin" aria-hidden="true">
          {/* every plate is mounted and only one is shown. Swapping the
              source of a single plate instead would send it back through
              its own lookup on each hover, so the artwork would drop out
              and fade in again every time the pointer crossed a row. */}
          <div className="bl-index-plate">
            {rows.map((row, index) => (
              <figure key={row.id} data-on={at === index}>
                <Plate
                  bare
                  dir="work"
                  name={row.id}
                  src={row.image}
                  monogram={row.name}
                  alt=""
                />
              </figure>
            ))}
          </div>

          <p className="bl-index-sentence">
            <MarkedLine text={current.line} mark={current.mark} />
          </p>

          <p className="bl-index-stack">
            {current.stack.slice(0, 7).join("  /  ")}
          </p>

          <div className="bl-note bl-note-margin">
            <p className="bl-note-label">Margin note</p>
            <MarkPaper className="bl-note-mark" size={22} />
            <p className="bl-note-line">
              A demo proves it <Marked kind="circle">runs</Marked>. A case file
              proves it holds.
            </p>
            <p className="bl-note-foot">
              Every numbered row opens one: the architecture, the figures, what
              broke.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
