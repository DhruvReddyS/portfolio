"use client";

import { education } from "@/lib/portfolio-data";
import { Reveal } from "./reveal";
import { Counter } from "./smooth";
import { SectionHeader } from "./sections";
import { MarkPaper } from "./marks";
import { Plate } from "./plate";
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
        title="Two degrees, one timetable"
        lead="A B.E. on campus at MVSR and a BS from IIT Madras, carried together rather than one after the other. Same weeks, two sets of deadlines."
        note={`${education.length} degrees · both running`}
      />

      <div className="bl-degrees">
        {education.map((school, index) => (
          <Reveal key={school.id} delay={index * 110}>
            <article className="bl-degree">
              {/*
                The place itself. A transcript is a list of claims about
                somewhere, and until now the somewhere was a name set in
                type; this is the campus the claims were earned on. The
                slot keeps its shape whether or not a file is behind it,
                so one school having a photograph and the other not is a
                state the card already knows how to be in.
              */}
              <span className="bl-degree-shot">
                <Plate
                  dir="edu"
                  name={school.id}
                  monogram={school.short}
                  alt={`${school.school} campus`}
                  bare
                />
              </span>

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

              {/*
                Two, not all of them. This act is the shortest thing the
                page has to say: two degrees, run at the same time, with
                the marks to show for it. A third bullet on each card was
                turning the shortest answer into the longest card.
              */}
              <ul className="bl-degree-points">
                {school.highlights.slice(0, 2).map((point) => (
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
