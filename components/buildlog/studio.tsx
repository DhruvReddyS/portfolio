"use client";

import { Fragment, useEffect, useRef } from "react";
import Image from "next/image";
import { studio } from "@/lib/portfolio-data";
import { servable } from "@/lib/image-sizes";
import { Reveal } from "./reveal";
import { Counter } from "./smooth";
import { Roll, SectionHeader } from "./sections";
import { MarkedLine } from "./marked";
import {
  MarkArrow,
  MarkChat,
  MarkLoop,
  MarkMail,
  MarkRise,
  MarkSeek,
  MarkWindow,
} from "./marks";

/**
 * The studio, as its own letterhead laid on the log.
 *
 * Two things were wrong with the last one. It read as another section of this
 * site rather than as another business, which is the whole claim the heading
 * makes; and it was selling a studio with three round numbers while seven
 * The work is counted, not named. Who a studio builds for is the client's
 * to announce, and a roster of other people's brands on his portfolio is a
 * claim they never agreed to make; seven builds, four delivered and two of
 * them for clients in the US says the same thing and is his to say.
 *
 * The card used to take a green of its own so it would read as a letterhead
 * from somewhere else. It is not somewhere else. One site, one accent.
 */


/** The five service marks, by the name the data gives them. */
const SERVICE_MARKS: Record<string, React.ReactNode> = {
  window: <MarkWindow size={15} />,
  seek: <MarkSeek size={15} />,
  chat: <MarkChat size={15} />,
  loop: <MarkLoop size={15} />,
  rise: <MarkRise size={15} />,
};

/**
 * The five services, as a deck.
 *
 * A row of five cards that scrolls sideways and snaps, and turns as it
 * goes: the one in the middle faces you and the ones either side are
 * angled away, so the row reads as a deck being pushed through rather
 * than a list that happens to be horizontal. The turn is measured off
 * each card's distance from the middle of the window on every scroll
 * frame, which is also what decides which one is lit.
 *
 * Native scrolling underneath all of it. Dragging, a trackpad, a wheel,
 * a touch flick and the keyboard all work because none of them have
 * been reimplemented; the script only reads where the scroll got to and
 * writes an angle back.
 */
function ServiceDeck() {
  const rail = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = rail.current;
    if (!track) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const turn = () => {
      frame = 0;
      const box = track.getBoundingClientRect();
      const middle = box.left + box.width / 2;
      for (const card of track.children) {
        if (!(card instanceof HTMLElement)) continue;
        const rect = card.getBoundingClientRect();
        /* how far this card's middle is from the rail's, as a share of
           the rail: -1 at the left edge, 0 in the middle, 1 at the right */
        const off = (rect.left + rect.width / 2 - middle) / (box.width / 2);
        const away = Math.min(1, Math.abs(off));
        card.style.setProperty("--turn", `${(-off * 26).toFixed(2)}deg`);
        card.style.setProperty("--lift", `${(1 - away * 0.14).toFixed(3)}`);
        card.style.setProperty("--fade", `${(1 - away * 0.55).toFixed(3)}`);
        /* assigning undefined to a dataset property writes the string
           "undefined", which is still an attribute and still matches */
        if (away < 0.28) card.dataset.front = "true";
        else delete card.dataset.front;
      }
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(turn);
    };

    turn();
    track.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      track.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="bl-deck">
      <div className="bl-deck-rail" ref={rail}>
        {studio.services.map((service, index) => (
          <article className="bl-deck-card" key={service.label}>
            <span className="bl-deck-no">{String(index + 1).padStart(2, "0")}</span>
            <span className="bl-deck-mark" aria-hidden="true">
              {SERVICE_MARKS[service.mark]}
            </span>
            <h4>{service.label}</h4>
            <p>{service.note}</p>
          </article>
        ))}
      </div>

      <p className="bl-deck-cue" aria-hidden="true">
        <i />
        Push it along
        <i />
      </p>
    </div>
  );
}

export function StudioSection() {
  return (
    <section className="bl-section bl-studio" id="studio">
      <SectionHeader
        label="06 / Independent"
        title="And a studio he runs"
        lead="Clients, not coursework. He founded it, he scopes it, he builds it, and two of the people paying for it are in the United States."
        note={`${studio.shipped} builds · ${studio.delivered} delivered`}
      />

      <Reveal>
        <div className="bl-studio-card">
          <header className="bl-studio-head">
            {/*
              The mark, at the size a mark is meant to be read at, with
              the one claim on this card that is about him rather than
              about it pinned under it.

              It spent a while in a small disc with the services going
              round it on a ring, which was a diagram of a studio rather
              than a studio: the logo came out two centimetres wide and
              the five services were five words going past. The mark gets
              the masthead now and the services get a deck of their own
              below, where each one has room to say what it is.
            */}
            <div className="bl-studio-mast">
              <span className="bl-studio-logo">
                <Image
                  src={studio.logo}
                  alt={studio.name}
                  {...servable(949, 297)}
                />
              </span>
              <span className="bl-founder">
                <i aria-hidden="true" />
                Founder
              </span>
            </div>

            <div className="bl-studio-id">
              <h3 className="bl-studio-name">{studio.name}</h3>
              <p className="bl-studio-tagline">{studio.tagline}</p>

              <ul className="bl-studio-brief">
                {studio.brief.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>

              <p className="bl-studio-count">
                <strong>
                  <Counter value={String(studio.shipped).padStart(2, "0")} />
                </strong>
                <span>projects shipped</span>
              </p>
            </div>

            <span className="bl-studio-role">{studio.role}</span>
          </header>

          {/* and the five things it takes on, as a deck you push through */}
          <ServiceDeck />

          <div className="bl-studio-body">
            <div className="bl-studio-lead">
              <p className="bl-studio-summary">
                <MarkedLine text={studio.summary} mark="no templates" />
              </p>

              <div className="bl-studio-actions">
                <a
                  className="bl-btn bl-btn-solid bl-go"
                  href={studio.site}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Roll>Visit the studio</Roll>
                  <span className="bl-go-mark" aria-hidden="true">
                    <MarkArrow size={13} />
                    <MarkArrow size={13} />
                  </span>
                </a>
                <a className="bl-btn bl-btn-lit bl-go" href={`mailto:${studio.email}`}>
                  <span className="bl-go-mark bl-go-mark-lead" aria-hidden="true">
                    <MarkMail size={14} />
                    <MarkMail size={14} />
                  </span>
                  <Roll>{studio.email}</Roll>
                </a>
              </div>
            </div>
          </div>

          {/* what the work is, counted rather than named */}
          <div className="bl-roster">
            <p className="bl-roster-head">
              <span>The work</span>
              <i aria-hidden="true" />
              <em>{studio.services.map((one) => one.label).join(" · ")}</em>
            </p>

            <ul>
              {studio.work.map((lot) => (
                <li key={lot.kind}>
                  <b>{lot.count}</b>
                  <strong>{lot.kind}</strong>
                  <span>{lot.note}</span>
                  <em data-state={lot.state.includes("deliver") ? "done" : "building"}>
                    {lot.state}
                  </em>
                </li>
              ))}
            </ul>
          </div>

          <p className="bl-studio-run">
            {studio.process.map((stage, index) => (
              <Fragment key={stage.step}>
                {index > 0 && <i aria-hidden="true" />}
                <span>
                  <em>{stage.step}</em> {stage.title}
                </span>
              </Fragment>
            ))}
          </p>
        </div>
      </Reveal>
    </section>
  );
}
