"use client";

import { Fragment } from "react";
import Image from "next/image";
import { studio } from "@/lib/portfolio-data";
import { Reveal } from "./reveal";
import { Counter } from "./smooth";
import { Roll, SectionHeader } from "./sections";
import { MarkedLine } from "./marked";
import { MarkArrow, MarkMail } from "./marks";

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


export function StudioSection() {
  return (
    <section className="bl-section bl-studio" id="studio">
      <SectionHeader
        label="06 / Independent"
        title="And a studio he runs"
        lead="Clients, not coursework. Seven builds so far, two of them for clients in the US, and a year of support after each one goes live."
        note={`${studio.shipped} builds · ${studio.delivered} delivered`}
      />

      <Reveal>
        <div className="bl-studio-card">
          <header className="bl-studio-head">
            <span className="bl-studio-logo">
              <Image src={studio.logo} alt={studio.name} width={949} height={297} priority={false} />
            </span>

            <div className="bl-studio-id">
              <h3 className="bl-studio-name">{studio.name}</h3>
              <p className="bl-studio-tagline">{studio.tagline}</p>
            </div>

            <span className="bl-studio-role">{studio.role}</span>
          </header>

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

            <dl className="bl-studio-figures">
              {studio.marks.map((mark) => (
                <div key={mark.label}>
                  <dt>{mark.label}</dt>
                  <dd>
                    <Counter value={mark.value} />
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* what the work is, counted rather than named */}
          <div className="bl-roster">
            <p className="bl-roster-head">
              <span>The work</span>
              <i aria-hidden="true" />
              <em>{studio.services.join(" · ")}</em>
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
