"use client";

import { studio } from "@/lib/portfolio-data";
import { Ink, Reveal } from "./ink";
import { Counter } from "./smooth";
import { ActHeader } from "./sections";
import { MarkArrow, MarkMail } from "./marks";

/**
 * The studio he runs, set on an inverted panel so the act reads as a separate
 * business rather than another entry in the log.
 */
export function StudioSection() {
  return (
    <section className="bl-section bl-studio" id="studio">
      <ActHeader
        act="VI"
        title={
          <>
            And a studio he{" "}
            <Ink type="circle" delay={400} padding={8} strokeWidth={2}>
              runs
            </Ink>
          </>
        }
        note="clients, not coursework"
      />

      <Reveal>
        <div className="bl-studio-panel">
          <header className="bl-studio-head">
            <span className="bl-studio-logo" aria-hidden="true">
              {studio.initials}
            </span>

            <div>
              <h3 className="bl-studio-name">{studio.name}</h3>
              <p className="bl-studio-tagline">{studio.tagline}</p>
            </div>

            <span className="bl-studio-role">{studio.role}</span>
          </header>

          <div className="bl-studio-body">
            <div className="bl-studio-lead">
              <p>{studio.summary}</p>

              <div className="bl-studio-marks">
                {studio.marks.map((mark) => (
                  <div key={mark.label}>
                    <strong>
                      <Counter value={mark.value} />
                    </strong>
                    <span>{mark.label}</span>
                  </div>
                ))}
              </div>

              <div className="bl-studio-actions">
                <a
                  className="bl-btn bl-btn-solid"
                  href={studio.site}
                  target="_blank"
                  rel="noreferrer"
                >
                  Visit the studio <MarkArrow size={13} />
                </a>
                <a className="bl-btn" href={`mailto:${studio.email}`}>
                  <MarkMail size={14} /> {studio.email}
                </a>
              </div>
            </div>

            <div className="bl-studio-services">
              <p className="bl-eyebrow">Handled end to end</p>
              <ul>
                {studio.services.map((service) => (
                  <li key={service}>{service}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* the six steps, as a run of stations */}
          <div className="bl-studio-process">
            {studio.process.map((stage) => (
              <div className="bl-stage" key={stage.step}>
                <span className="bl-stage-step">{stage.step}</span>
                <strong>{stage.title}</strong>
                <p>{stage.note}</p>
              </div>
            ))}
          </div>

          <div className="bl-studio-clients">
            <div className="bl-quests-head">
              <p className="bl-eyebrow">On the books</p>
              <i aria-hidden="true" />
              <span className="bl-studio-count">{studio.clients.length} brands</span>
            </div>

            <ul>
              {studio.clients.map((client) => (
                <li key={client.name} data-status={client.status}>
                  <strong>{client.name}</strong>
                  <p>{client.note}</p>
                  <em>{client.status}</em>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
