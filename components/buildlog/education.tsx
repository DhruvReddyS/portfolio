"use client";

import { education } from "@/lib/portfolio-data";
import { Reveal } from "./reveal";
import { Counter } from "./smooth";
import { SectionHeader } from "./sections";
import { MarkPaper } from "./marks";

/**
 * Two degrees, set as two entries on the lit sheet.
 *
 * They were a pair of tall cards, each opening with a plate for a photograph
 * of the campus. There are no photographs of either campus, so both opened
 * with an empty frame holding a letter, and an empty frame is worse than no
 * frame: it is a promise the page cannot keep.
 *
 * What a degree actually has is a name, a subject, a mark and a few things
 * that happened there. So that is what is printed, and the mark gets the
 * size, because it is the only number on the page that took four years.
 */
export function EducationSection() {
  return (
    <section className="bl-section bl-study" id="education">
      <SectionHeader
        label="03 / Study"
        title="A dual degree, run in parallel"
        lead="One on campus at MVSR, one online with IIT Madras. Both ongoing, at the same time, which is the whole point of the entry."
        note="2 degrees · both running"
      />

      <div className="bl-degrees">
        {education.map((school, index) => (
          <Reveal key={school.id} delay={index * 110}>
            <article className="bl-degree">
              <p className="bl-degree-kicker">
                <span>{school.period}</span>
                <i aria-hidden="true" />
                <span>{school.location}</span>
                <em>{school.status}</em>
              </p>

              <div className="bl-degree-head">
                <h3 className="bl-degree-name">{school.school}</h3>

                <p className="bl-degree-mark">
                  <strong>
                    <Counter value={school.mark.value} />
                  </strong>
                  <span>{school.mark.label}</span>
                </p>
              </div>

              <p className="bl-degree-field">
                <strong>{school.degree}</strong>
                {school.field}
              </p>

              <ul className="bl-degree-points">
                {school.highlights.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>

              {school.certificates && (
                <div className="bl-degree-certs">
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
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
