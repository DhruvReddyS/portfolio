"use client";

import { education } from "@/lib/portfolio-data";
import { Reveal } from "./reveal";
import { Counter } from "./smooth";
import { SectionHeader } from "./sections";
import { MarkPaper } from "./marks";
import { BugHunt } from "@/components/ui/bug-hunt";

/**
 * Two degrees, as two transcripts, with the mark given the size it earned.
 *
 * The last version set them as two tidy typographic entries, which was clean
 * and said nothing. The strongest thing on this page is that one of these is
 * a 9.34 and the other is two completed diplomas, and both are being carried
 * at once; a layout that prints those at body size is burying its own lead.
 *
 * So each is a plate with its figure at display size and everything else
 * hanging off it, stamped with where it has got to, and the two are tied
 * together underneath, because the parallel is the point and it has to be
 * drawn rather than asserted in the heading.
 */
export function EducationSection() {
  return (
    <section className="bl-section bl-study" id="education">
      {/*
        A web slung off the end of the heading, with something living on it.
        Two degrees left running in parallel is the one heading on the page
        that has been sitting there a while, which is where a web turns up.
      */}
      <BugHunt />

      <SectionHeader
        label="03 / Study"
        title="A dual degree, run in parallel"
        lead="One on campus at MVSR, one online with IIT Madras. Not one after the other."
        note={`${education.length} degrees · both running`}
      />

      <div className="bl-degrees">
        {education.map((school, index) => (
          <Reveal key={school.id} delay={index * 110}>
            <article className="bl-degree">
              <p className="bl-degree-where">
                <span>{school.period}</span>
                <i aria-hidden="true" />
                <span>{school.location}</span>
              </p>

              {/* the figure first, because it is the thing worth knowing */}
              <p className="bl-degree-figure">
                <strong>
                  <Counter value={school.mark.value} />
                </strong>
                <span>{school.mark.label}</span>
              </p>

              <h3 className="bl-degree-name">{school.school}</h3>

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
                    <a key={cert.href} href={cert.href} target="_blank" rel="noreferrer">
                      <MarkPaper size={11} /> {cert.label}
                    </a>
                  ))}
                </div>
              )}

              {/* where it has got to, stamped on rather than set in */}
              <p className="bl-degree-stamp" aria-label={`Status: ${school.status}`}>
                {school.status}
              </p>
            </article>
          </Reveal>
        ))}
      </div>

      {/* the parallel, drawn */}
      <p className="bl-degree-tie" aria-hidden="true">
        <i />
        <span>Both of these are running right now</span>
        <i />
      </p>
    </section>
  );
}
