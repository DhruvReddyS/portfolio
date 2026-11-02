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
 * Cards were the wrong instrument. Eight of them want eight pictures and
 * five of these builds have none; they want eight equally weighted
 * sentences and these have one strong one each; and they want a shape,
 * which kept turning into the subject. A list has none of those appetites.
 * It says what there is, in the order it happened, and it is read the way
 * a contents page is read: down the left, stopping where something catches.
 *
 * What a list cannot do is show the work, so the picture follows the
 * pointer instead of sitting in a column of its own. That costs the layout
 * nothing, which is the point: the list gets the whole width, and the
 * artwork is only there while someone is actually looking for it.
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
  const body = useRef<HTMLDivElement>(null);
  const follower = useRef<HTMLDivElement>(null);
  const aimAt = useRef<((clientX: number, clientY: number) => void) | null>(null);

  const [at, setAt] = useState(0);
  const [showing, setShowing] = useState(false);

  useEffect(() => {
    const node = body.current;
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

  /* The follower is placed against the list's own box rather than the
     viewport. A fixed element would be at the mercy of any transformed
     ancestor, and this page has plenty: a transform on a parent makes it
     the containing block and the thing lands somewhere else entirely.

     The pointer's position is written straight onto the element and the
     easing is left to a CSS transition, rather than being chased round a
     frame loop. One statement per event instead of sixty a second, and it
     still holds its place in a tab nobody is looking at, where a frame
     loop is simply not called. */
  useEffect(() => {
    const node = body.current;
    const plate = follower.current;
    if (!node || !plate) return;
    if (!window.matchMedia("(hover: hover)").matches) return;

    let placed = false;

    const aim = (clientX: number, clientY: number) => {
      const box = node.getBoundingClientRect();
      const half = plate.offsetWidth / 2;
      // kept inside the list's own width, so it never hangs off the page
      const x = Math.min(box.width - half, Math.max(half, clientX - box.left));
      const y = clientY - box.top;

      // the first reading is a jump, not a glide: otherwise the picture
      // sails in from wherever it was left the last time
      if (!placed) {
        placed = true;
        plate.style.transition = "none";
        plate.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
        void plate.offsetHeight;
        plate.style.transition = "";
        return;
      }

      plate.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    };

    aimAt.current = aim;

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      aim(event.clientX, event.clientY);
    };

    const onEnter = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      setShowing(true);
    };

    const onLeave = () => {
      placed = false;
      setShowing(false);
    };

    node.addEventListener("pointermove", onMove);
    node.addEventListener("pointerenter", onEnter);
    node.addEventListener("pointerleave", onLeave);

    return () => {
      node.removeEventListener("pointermove", onMove);
      node.removeEventListener("pointerenter", onEnter);
      node.removeEventListener("pointerleave", onLeave);
      aimAt.current = null;
    };
  }, []);

  /** Keyboard has no pointer, so the plate is put beside the focused row. */
  const placeAt = (element: HTMLElement) => {
    const node = body.current;
    const plate = follower.current;
    if (!node || !plate || !aimAt.current) return;
    const box = node.getBoundingClientRect();
    const row = element.getBoundingClientRect();
    aimAt.current(box.right - plate.offsetWidth / 2, row.top + row.height / 2);
  };

  return (
    <section className="bl-section bl-index" id="work">
      <SectionHeader
        label="02 / Selected work"
        title="What got built"
        lead="Six builds and two side quests, in the order they happened. Open any of the six for the case file."
      />

      <div className="bl-index-body" ref={body}>
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
                onPointerEnter={() => setAt(index)}
              >
                <span className="bl-index-num">{row.index}</span>

                {/* name, leader, figure: one line, so the leader is a flex
                    child that takes whatever is left between them. As grid
                    areas the rows underneath inflated the auto columns and
                    the leader got what was left of that, which was a stub */}
                <div className="bl-index-head">
                <h3 className="bl-index-name">
                  {row.file ? (
                    <button
                      type="button"
                      onClick={() => onOpen(row.file as CaseFile)}
                      onFocus={(event) => {
                        setAt(index);
                        setShowing(true);
                        placeAt(event.currentTarget);
                      }}
                      onBlur={() => setShowing(false)}
                    >
                      {row.name}
                      <MarkArrow size={16} />
                    </button>
                  ) : (
                    <span>{row.name}</span>
                  )}
                </h3>

                <i className="bl-index-lead" aria-hidden="true" />

                <p className="bl-index-filed">{row.filed}</p>
                </div>

                <p className="bl-index-field">{row.field}</p>

                <p className="bl-index-line">
                  <MarkedLine text={row.line} mark={row.mark} />
                </p>

                <div className="bl-index-foot">
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

                {/* the parts list is the one thing held back for the row
                    being read: eight of them at once is a wall of nouns */}
                <p className="bl-index-stack">
                  {row.stack.slice(0, 7).join("  /  ")}
                </p>
                </div>
              </li>
            </Fragment>
          ))}
        </ol>

        {/* Every plate is mounted and one is shown. Swapping the source of
            a single plate would send it back through its own file lookup
            on each hover, so the artwork would drop out and fade in again
            every time the pointer crossed a row. */}
        <div
          className="bl-index-follow"
          ref={follower}
          data-on={showing}
          aria-hidden="true"
        >
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
      </div>

      {/* the note, set out in the margin the way one would be on paper */}
      <div className="bl-note bl-note-end">
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
    </section>
  );
}
