"use client";

import { education } from "@/lib/portfolio-data";
import { Reveal } from "./reveal";
import { Counter } from "./smooth";
import { SectionHeader } from "./sections";
import { MarkPaper } from "./marks";
import { Plate } from "./plate";
import { Lanyard } from "./lanyard";

/**
 * Two degrees, as the two cards you would have to carry to be on both
 * campuses at once.
 *
 * They were two transcripts set as typographic plates, which was clean
 * and said nothing a line of copy could not. The strongest thing about
 * this act is not either degree on its own, it is that both of them
 * are live in the same week, and a reader believes that the moment
 * they see two passes hanging side by side rather than two paragraphs
 * claiming it.
 *
 * So they hang, on straps that actually hang: take hold of one and
 * swing it, flick it and it keeps going, let the pair of them settle
 * and they settle at their own speeds. It is the only thing on this
 * page you can pick up, and it is in the act about the two things he
 * is carrying at once, which is the joke.
 *
 * The webs and the spider that used to be slung off this heading are
 * gone. There is something to play with here now, and two of them in
 * one act is a fairground.
 */

/** Everything a pass has on it that is not about the school. */
const HOLDER = "S. Dhruv Reddy";

export function EducationSection() {
  return (
    <section className="bl-section bl-study" id="education">
      <SectionHeader
        label="03 / Study"
        title="Two degrees, one timetable"
        lead="A B.E. on campus at MVSR and a BS from IIT Madras, carried together rather than one after the other. Same weeks, two sets of deadlines."
        note="Both passes still valid"
      />

      <div className="bl-passes">
        {education.map((school, index) => (
          <Reveal key={school.id} delay={index * 140}>
            {/*
              The two are hung at different points and on different
              lengths of strap, and only one of them gets a shove on
              arrival, so they are never swinging in step. A pair of
              pendulums in phase reads as one object with two halves.
            */}
            <Lanyard
              at={index ? 0.56 : 0.44}
              drop={index ? 0.3 : 0.26}
              push={index ? 0 : 9}
            >
              <article className="bl-id" data-school={school.id}>
                {/* the school, alone: the top right corner of a pass is
                    where the status gets overprinted, and two things in
                    one corner is two things on top of each other */}
                <header className="bl-id-head">
                  <span className="bl-id-org">{school.short}</span>
                </header>

                {/*
                  The campus, in the slot a pass keeps for a photograph.
                  It holds its shape whether or not a file is behind it,
                  so one school having a picture and the other not is a
                  state the card already knows how to be in.
                */}
                <span className="bl-id-shot">
                  <Plate
                    dir="edu"
                    name={school.id}
                    monogram={school.monogram}
                    alt={`${school.school} campus`}
                    bare
                  />
                </span>

                <p className="bl-id-name">{HOLDER}</p>

                <p className="bl-id-course">
                  <strong>{school.degree}</strong>
                  <span>{school.field}</span>
                </p>

                {/* the figure, which is the thing worth knowing */}
                <p className="bl-id-figure">
                  <strong>
                    <Counter value={school.mark.value} />
                  </strong>
                  <span>{school.mark.label}</span>
                </p>

                <p className="bl-id-stamp">{school.status}</p>

                {/* every pass has one, and none of them mean anything */}
                <span className="bl-id-code" aria-hidden="true" />
                <span className="bl-id-kind">Student pass</span>

                <span className="bl-sr">{school.school}</span>
              </article>
            </Lanyard>
          </Reveal>
        ))}
      </div>

      <p className="bl-pass-cue" aria-hidden="true">
        <i />
        Go on, swing one
        <i />
      </p>

      {/*
        And what is on the back of them: what each degree has actually
        got to, which will not fit on a pass and should not be left off
        the page because of it.
      */}
      <dl className="bl-study-notes">
        {education.map((school) => (
          <div key={school.id}>
            <dt>{school.school}</dt>
            <dd>
              <ul>
                {school.highlights.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>

              {school.certificates && (
                <div className="bl-study-certs">
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
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
