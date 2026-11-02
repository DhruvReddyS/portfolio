"use client";

import { Fragment, useState } from "react";
import { caseFiles, sideQuests, type CaseFile } from "@/lib/portfolio-data";
import { Coverflow } from "@/components/ui/coverflow";
import { MarkArrow, MarkGithub, MarkPaper, MarkRosette, MarkWindow } from "./marks";
import { Plate } from "./plate";
import { SectionHeader } from "./sections";
import { Marked, MarkedLine } from "./marked";

/**
 * The work, as a rack you turn through.
 *
 * It has been tiles at four sizes, a typed index, and a wall of cards. The
 * wall was the best of those and this is not an argument that it was wrong:
 * it is a different claim about what eight builds are. A wall says here are
 * eight things, compare them. A rack says here is one thing, and there are
 * seven more behind it.
 *
 * The thing that has never gone away is that three of the eight have a
 * screenshot and five do not, so a rack of faces is a rack of five empty
 * frames unless the five are given something true to carry. They carry what
 * the build is made of, set out on ruled ground, which is what this section
 * has been doing since the cards and is the one part worth keeping.
 *
 * Every entry's copy is in the page, not only the one facing you. The rack
 * shows one at a time; a crawler, a reader with no JavaScript and the test
 * suite all see all eight.
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

export function WorkIndex({ onOpen }: { onOpen: (file: CaseFile) => void }) {
  const [at, setAt] = useState(0);

  return (
    <section className="bl-section bl-work" id="work">
      <SectionHeader
        label="02 / Selected work"
        title="What got built"
        lead="Six builds and two side quests. Turn the rack, and press the one facing you for the full case file."
        note={`${rows.length} on the rack`}
      />

      <Coverflow
        className="bl-work-rack"
        cardWidth={520}
        ariaLabel="Six builds and two side quests"
        slides={rows.map((row) => ({
          key: row.id,
          label: `${row.name}, ${row.kind}`,
          cover: (
            <div className="bl-card-shot" data-plate={row.image ? "shot" : "set"}>
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
                  {row.stack.slice(0, 9).map((part, i) => (
                    <Fragment key={part}>
                      {i > 0 && <i aria-hidden="true">·</i>}
                      <span>{part}</span>
                    </Fragment>
                  ))}
                  <span className="bl-sr">{row.name}</span>
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
          ),
        }))}
        onActivate={setAt}
        onOpen={(index) => {
          const row = rows[index];
          if (row?.file) onOpen(row.file);
        }}
      />

      {/* All eight, stacked in one cell. Only the one on the rack is shown,
          and the rest are inert rather than merely invisible. */}
      <div className="bl-flow-caption">
        {rows.map((row, index) => (
          <article
            key={row.id}
            className="bl-flow-info"
            data-on={index === at ? "true" : undefined}
            inert={index === at ? undefined : true}
          >
            <p className="bl-flow-kicker">
              <span>{row.index}</span>
              <i aria-hidden="true" />
              {row.field}
            </p>

            <h3 className="bl-flow-name">{row.name}</h3>

            <p className="bl-flow-line">
              <MarkedLine text={row.line} mark={row.mark} />
            </p>

            <div className="bl-flow-foot">
              <p className="bl-flow-filed">{row.filed}</p>

              <div className="bl-flow-acts">
                {row.link && (
                  <a className="bl-card-side" href={row.link.href} target="_blank" rel="noreferrer">
                    <MarkWindow size={12} /> Live
                  </a>
                )}
                {row.repo && (
                  <a className="bl-card-side" href={row.repo} target="_blank" rel="noreferrer">
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
          </article>
        ))}
      </div>

      <aside className="bl-note bl-note-aside">
        <p className="bl-note-label">
          <MarkPaper className="bl-note-mark" size={14} /> Margin note
        </p>
        <p className="bl-note-line">
          A demo proves it{" "}
          <span className="bl-nobreak">
            <Marked kind="circle">runs</Marked>.
          </span>{" "}
          A case file proves it holds.
        </p>
        <p className="bl-note-foot">
          Every numbered card opens one: the architecture, the figures, what broke.
        </p>
      </aside>
    </section>
  );
}
