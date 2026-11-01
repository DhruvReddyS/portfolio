"use client";

import { studio } from "@/lib/portfolio-data";
import { Reveal } from "./reveal";
import { Counter } from "./smooth";
import { SectionHeader } from "./sections";
import { MarkedLine } from "./marked";
import { MarkArrow, MarkMail } from "./marks";

/**
 * The studio he runs, set on an inverted panel so the act reads as a separate
 * business rather than another entry in the log.
 */
export function StudioSection() {
  return (
    <section className="bl-section bl-studio" id="studio">
      <SectionHeader
        label="06 / Independent"
        title="And a studio he runs"
        lead="Clients, not coursework."
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
              <p>
                <MarkedLine text={studio.summary} mark="no templates" />
              </p>

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
              <p className="bl-head-label">Handled end to end</p>
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

        </div>
      </Reveal>
    </section>
  );
}
