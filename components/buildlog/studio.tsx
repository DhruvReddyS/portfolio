"use client";

import { Fragment } from "react";
import { studio } from "@/lib/portfolio-data";
import { Reveal } from "./reveal";
import { Counter } from "./smooth";
import { SectionHeader } from "./sections";
import { MarkedLine } from "./marked";
import { MarkArrow, MarkMail } from "./marks";

/**
 * The studio, as its own letterhead laid on the log.
 *
 * Two things were wrong with the last one. It read as another section of this
 * site rather than as another business, which is the whole claim the heading
 * makes; and it was selling a studio with three round numbers while seven
 * named clients sat in the data file, unrendered, four of them delivered.
 * "100% custom builds" is a thing anyone can type. "WestBrook Homes,
 * delivered" is not.
 *
 * So the roster leads, and the card takes its own colour: every accent inside
 * it resolves to the studio's green instead of the log's red pen, which is a
 * single token override and makes it read as a letterhead from somewhere
 * else without touching a line of the page around it.
 */

const delivered = studio.clients.filter((client) => client.status === "Delivered").length;

export function StudioSection() {
  return (
    <section className="bl-section bl-studio" id="studio">
      <SectionHeader
        label="06 / Independent"
        title="And a studio he runs"
        lead="Clients, not coursework. Seven brands so far, and a year of support after each one goes live."
        note={`${studio.clients.length} brands · ${delivered} delivered`}
      />

      <Reveal>
        <div className="bl-studio-card">
          <header className="bl-studio-head">
            <span className="bl-studio-logo" aria-hidden="true">
              {studio.initials}
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
                <a className="bl-btn bl-btn-solid" href={studio.site} target="_blank" rel="noreferrer">
                  Visit the studio <MarkArrow size={13} />
                </a>
                <a className="bl-btn" href={`mailto:${studio.email}`}>
                  <MarkMail size={14} /> {studio.email}
                </a>
              </div>
            </div>

            <dl className="bl-studio-figures">
              <div>
                <dt>Brands</dt>
                <dd>
                  <Counter value={String(studio.clients.length)} />
                </dd>
              </div>
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

          {/* the roster, which is the part that was sitting in the data file */}
          <div className="bl-roster">
            <p className="bl-roster-head">
              <span>The roster</span>
              <i aria-hidden="true" />
              <em>{studio.services.join(" · ")}</em>
            </p>

            <ul>
              {studio.clients.map((client) => (
                <li key={client.name}>
                  <strong>{client.name}</strong>
                  <span>{client.note}</span>
                  <em data-state={client.status === "Delivered" ? "done" : "building"}>
                    {client.status}
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
