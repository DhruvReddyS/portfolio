"use client";

import { Fragment, useEffect, useRef } from "react";
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
 * The work, as a wall of cards of one size.
 *
 * Earlier versions of this section went looking for a shape: tiles at four
 * sizes, then a typed index with the artwork following the pointer. Both
 * were defensible and neither was liked, and the reason is probably that a
 * work section has one job, which is to show the work. A shape that makes
 * the work smaller in order to make the page more interesting has the
 * trade backwards.
 *
 * So: nine cells, one size, three across. Picture, what field it sits in,
 * the name, the one sentence that says why it exists, then what it is
 * filed under and the way in. The note takes the middle cell.
 */

/** The figure a card is filed under, or what kind of build it was. */
function filedUnder(file: CaseFile) {
  const figure = file.metrics.find((metric) => /\d/.test(metric.value));
  return figure ? `${figure.value} ${figure.label}` : file.kind;
}

type Row = {
  id: string;
  index: string;
  name: string;
  field: string;
  kind: string;
  filed: string;
  line: string;
  mark?: string;
  image?: string;
  link?: { label: string; href: string };
  repo?: string;
  decorated?: boolean;
  /** What it is made of, used to set the entry when there is no plate. */
  stack: string[];
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
    kind: file.kind,
    filed: filedUnder(file),
    line: file.thesis,
    mark: file.mark,
    image: file.image,
    link: file.link,
    repo: file.repo,
    decorated: Boolean(file.awards),
    stack: file.stack,
    file,
  })),
  ...sideQuests.map((quest, offset) => ({
    id: quest.id,
    index: String(caseFiles.length + offset + 1).padStart(2, "0"),
    name: quest.name,
    field: quest.stack.slice(0, 3).join(" · "),
    kind: "Side quest",
    filed: quest.context,
    line: quest.blurb,
    stack: quest.stack,
    quest: true as const,
  })),
];

/** After the fourth card, which is the middle cell of a three-across wall. */
const NOTE_AFTER = 3;

export function WorkIndex({ onOpen }: { onOpen: (file: CaseFile) => void }) {
  const wall = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const node = wall.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const context = gsap.context(() => {
      gsap.from(".bl-card", {
        y: 26,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.06,
        scrollTrigger: { trigger: node, start: "top 82%", once: true },
      });
    }, node);

    return () => context.revert();
  }, []);

  return (
    <section className="bl-section bl-work" id="work">
      <SectionHeader
        label="02 / Selected work"
        title="What got built"
        lead="Six builds and two side quests. Open any of the six for the full case file."
      />

      <ol className="bl-work-wall" ref={wall}>
        {rows.map((row, index) => (
          <Fragment key={row.id}>
            <li
              className="bl-card"
              data-quest={row.quest ? "true" : undefined}
              /*
               * Three of these have a screenshot and five do not, and every
               * arrangement this section has worn so far was really a way of
               * arranging five empty frames. A frame with the project's name
               * ghosted inside it is not a picture of anything.
               *
               * So an entry without a plate does not get one. The space goes
               * to what the thing is made of, set out on ruled ground, which
               * is what a log book does when there is nothing to paste in.
               */
              data-plate={row.image ? "shot" : "set"}
            >
              <div className="bl-card-shot">
                {row.image ? (
                  <Plate
                    bare
                    dir="work"
                    name={row.id}
                    src={row.image}
                    monogram={row.name}
                    alt={`${row.name}, ${row.kind}`}
                  />
                ) : (
                  <p className="bl-card-set">
                    {row.stack.slice(0, 9).map((part, at) => (
                      <Fragment key={part}>
                        {at > 0 && <i aria-hidden="true">·</i>}
                        <span>{part}</span>
                      </Fragment>
                    ))}
                  </p>
                )}

                <span className="bl-card-num">{row.index}</span>

                {row.decorated ? (
                  <span className="bl-card-tag" data-win="true">
                    <MarkRosette size={11} /> Winner, twice
                  </span>
                ) : (
                  <span className="bl-card-tag">{row.kind}</span>
                )}
              </div>

              <div className="bl-card-body">
                <p className="bl-card-kicker">{row.field}</p>
                <h3 className="bl-card-name">{row.name}</h3>
                <p className="bl-card-line">
                  <MarkedLine text={row.line} mark={row.mark} />
                </p>

                <div className="bl-card-foot">
                  <p className="bl-card-filed">{row.filed}</p>

                  <div className="bl-card-acts">
                    {row.link && (
                      <a
                        className="bl-card-side"
                        href={row.link.href}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <MarkWindow size={12} /> Live
                      </a>
                    )}
                    {row.repo && (
                      <a
                        className="bl-card-side"
                        href={row.repo}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <MarkGithub size={12} /> Source
                      </a>
                    )}
                    {row.file && (
                      <button
                        type="button"
                        className="bl-card-open"
                        onClick={() => onOpen(row.file as CaseFile)}
                      >
                        Case file <MarkArrow size={13} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </li>

            {/* the middle cell of the wall, where a reader is already pausing */}
            {index === NOTE_AFTER && (
              <li className="bl-card bl-note bl-note-card">
                <p className="bl-note-label">Margin note</p>
                <MarkPaper className="bl-note-mark" size={24} />
                <p className="bl-note-line">
                  {/* the mark and the stop it belongs to must not be split
                      across a line break, or the sentence starts with "." */}
                  A demo proves it{" "}
                  <span className="bl-nobreak">
                    <Marked kind="circle">runs</Marked>.
                  </span>{" "}
                  A case file proves it holds.
                </p>
                <p className="bl-note-foot">
                  Every numbered card opens one: the architecture, the figures,
                  what broke.
                </p>
              </li>
            )}
          </Fragment>
        ))}
      </ol>
    </section>
  );
}
