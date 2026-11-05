"use client";

import { caseFiles, sideQuests, type CaseFile } from "@/lib/portfolio-data";
import { MarkArrow, MarkGithub, MarkRosette, MarkWindow } from "./marks";
import { Plate } from "./plate";
import { ProjectBanner, type BannerLogo } from "./banner";
import { SectionHeader } from "./sections";

/**
 * The work, as a wall you read across.
 *
 * It has been tiles, a typed index, a wall and then a rack you turned
 * through. The rack is a good way to look at one thing and a poor way to
 * judge eight: seven of them were always facing away, and the caption under
 * it belonged to whichever had been turned to the front. A wall says here
 * are eight, compare them, and every card carries its own caption so none
 * has to be turned to be read.
 *
 * Each picture is the control. Point at one and the accent comes up over it
 * and says what pressing it does, which is the only hover on this page that
 * has something to tell you rather than something to show you.
 *
 * Three of the eight have a screenshot and five do not, so five carry a
 * banner of their own instead: see banner.tsx. A wall of five empty frames
 * is the failure this section has been avoiding since the tiles.
 */

/*
 * Marks pulled out of the projects' own repositories. Only two of the eight
 * have one; the rest are back-ends and submissions that were never branded,
 * and those get their initials set instead.
 */
const LOGOS: Record<string, BannerLogo> = {
  trinetra: { src: "/assets/work/logos/trinetra.png", width: 504, height: 516 },
  codesync: { src: "/assets/work/logos/codesync.png", width: 609, height: 289 },
};

/** The initials a build is filed under when it has no mark of its own. */
function initials(name: string) {
  const words = name.replace(/[^A-Za-z ]/g, " ").trim().split(/\s+/);
  if (words.length > 1) return words.slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

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
  return (
    <section className="bl-section bl-work" id="work">
      <SectionHeader
        label="02 / Selected work"
        title="What got built"
        lead="Six that went live and two that never left the bench. Each one keeps its own file: what it was for, what broke, and what it cost to put right."
        note={`${rows.length} on the wall`}
      />

      {/*
        A wall rather than a rack.
        The rack showed one card at a time and kept the other seven turned
        away, which is a good way to look at one thing and a bad way to
        judge eight. Here they are all out at once and each carries its own
        caption, so nothing has to be turned to be read.
      */}
      <div className="bl-wk-wall">
        {rows.map((row) => {
          const open = row.file ? () => onOpen(row.file as CaseFile) : undefined;

          return (
            <article className="bl-wk" key={row.id} data-open={open ? "true" : undefined}>
              {/* the picture is the control, where there is a file behind it */}
              <button
                type="button"
                className="bl-wk-media"
                data-plate={row.image ? "shot" : "set"}
                onClick={open}
                disabled={!open}
                aria-label={open ? `Open the case file for ${row.name}` : undefined}
              >
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
                  <ProjectBanner
                    id={row.id}
                    name={row.name}
                    kind={row.kind}
                    stack={row.stack}
                    logo={LOGOS[row.id]}
                    monogram={initials(row.name)}
                  />
                )}

                {row.decorated ? (
                  <span className="bl-wk-tag" data-win="true">
                    <MarkRosette size={11} /> Winner, twice
                  </span>
                ) : (
                  <span className="bl-wk-tag">{row.kind}</span>
                )}

                {/* the accent comes up over the picture, and says what to do */}
                <span className="bl-wk-wipe" aria-hidden="true" />
                <span className="bl-wk-go" aria-hidden="true">
                  {open ? "Open the file" : "No file, just the build"}
                </span>
              </button>

              <div className="bl-wk-meta">
                <span className="bl-wk-no" aria-hidden="true">
                  {row.index}
                </span>

                <div className="bl-wk-say">
                  <b>{row.name}</b>
                  <small>{row.filed}</small>
                </div>

                <span className="bl-wk-arr" aria-hidden="true">
                  <MarkArrow size={15} />
                </span>
              </div>

              {(row.link || row.repo) && (
                <p className="bl-wk-side">
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
                </p>
              )}
            </article>
          );
        })}
      </div>

    </section>
  );
}
