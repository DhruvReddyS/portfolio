"use client";

import { education } from "@/lib/portfolio-data";
import { Reveal } from "./reveal";
import { Counter } from "./smooth";
import { SectionHeader } from "./sections";
import { MarkPaper } from "./marks";
import { Plate } from "./plate";

/**
 * Two degrees, running at the same time. Laid out as a pair of tall plates so
 * the act reads differently from the stacked log and the sideways case files.
 */
export function EducationSection() {
  return (
    <section className="bl-section bl-study" id="education">
      <SectionHeader
        label="03 / Study"
        title="Two degrees at once"
        lead="One on campus at MVSR, one online with IIT Madras."
      />

      <div className="bl-study-grid">
        {education.map((school, index) => (
          <Reveal key={school.id} delay={index * 110}>
            <article className="bl-school">
              <div className="bl-school-plate">
                <Plate
                  dir="edu"
                  name={school.id}
                  src={school.image}
                  monogram={school.monogram}
                  alt={school.school}
                />
                <span className="bl-school-status">{school.status}</span>
              </div>

              <div className="bl-school-copy">
                <p className="bl-eyebrow">
                  {school.period} · {school.location}
                </p>

                <h3 className="bl-school-name">{school.school}</h3>

                <p className="bl-school-degree">
                  <strong>{school.degree}</strong> {school.field}
                </p>

                <div className="bl-school-mark">
                  <strong>
                    <Counter value={school.mark.value} />
                  </strong>
                  <span>{school.mark.label}</span>
                </div>

                <ul className="bl-school-points">
                  {school.highlights.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>

                {school.certificates && (
                  <div className="bl-edu-certs">
                    {school.certificates.map((cert) => (
                      <a
                        key={cert.href}
                        href={cert.href}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <MarkPaper size={11} /> {cert.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
