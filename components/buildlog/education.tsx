"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { education } from "@/lib/portfolio-data";
import { Reveal } from "./reveal";
import { Counter } from "./smooth";
import { SectionHeader } from "./sections";
import { MarkPaper } from "./marks";
import { Plate } from "./plate";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

/**
 * Two degrees, drawn as the one timetable the heading says they are.
 *
 * This act has now been two typographic plates, two cards and two
 * passes on lanyards, and every one of them had the same fault: they
 * were two objects next to each other, and the thing worth knowing is
 * not either degree, it is that both of them are running in the same
 * weeks. Two objects side by side say "here are two things". Two lanes
 * with one line down through them say "at the same time", which is the
 * whole claim, and it is the only drawing of it that does not need a
 * sentence underneath explaining what it means.
 *
 * So: two lanes, laid one over the other on a common rule. The upper
 * one runs the length of the act with nothing to tick off, because a
 * four-year engineering degree has no milestones in it anybody outside
 * the building would recognise. The lower one is in three stages, two
 * of them closed and one still open. A line crosses both at today, and
 * everything to the left of it has happened.
 *
 * The lanes are drawn by the scroll, from the left, in the order a
 * timetable is read.
 */
export function EducationSection() {
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const frame = box.current;
    if (!frame) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const context = gsap.context(() => {
      /*
       * Each stage opens out from its own left edge, in reading order,
       * then the line that says where today is drops through both lanes.
       *
       * Three things here are not decoration:
       *
       * `fromTo` rather than `from`, with its own trigger object per
       * tween. Handing the same plain object to two ScrollTriggers lets
       * the second one take it over, and the first lane was left at
       * nought width with no error anywhere to say why.
       *
       * `immediateRender: false`, so a cue that never arrives leaves the
       * drawing drawn rather than leaving it empty.
       *
       * And `clearProps` at the end, so the lanes are handed back to the
       * stylesheet: an inline transform left behind by a tween outranks
       * any rule in the sheet, and the lift on hover would never land.
       */
      const sweep = (start: string) => ({
        trigger: frame,
        start,
        once: true,
      });

      gsap.fromTo(
        ".bl-plan-stage",
        { scaleX: 0, opacity: 0 },
        {
          scaleX: 1,
          opacity: 1,
          duration: 0.75,
          ease: "power3.out",
          stagger: 0.13,
          immediateRender: false,
          clearProps: "transform,opacity",
          scrollTrigger: sweep("top 82%"),
        },
      );

      gsap.fromTo(
        ".bl-plan-now",
        { scaleY: 0, opacity: 0 },
        {
          scaleY: 1,
          opacity: 1,
          duration: 0.6,
          delay: 0.55,
          ease: "power2.out",
          immediateRender: false,
          clearProps: "transform,opacity",
          scrollTrigger: sweep("top 82%"),
        },
      );

      /* and the figures and the scale, a beat behind the lanes they
         belong to, so the panel assembles rather than appears */
      gsap.fromTo(
        [".bl-plan-scale", ".bl-plan-who"],
        { y: 14, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power2.out",
          stagger: 0.1,
          immediateRender: false,
          clearProps: "transform,opacity",
          scrollTrigger: sweep("top 84%"),
        },
      );
    }, frame);

    return () => context.revert();
  }, []);

  return (
    <section className="bl-section bl-study" id="education">
      <SectionHeader
        label="03 / Study"
        title="Two degrees, one timetable"
        lead="A B.E. on campus at MVSR and a BS from IIT Madras, carried together rather than one after the other. Same weeks, two sets of deadlines."
        note="Both still running"
      />

      <Reveal>
        <div className="bl-plan" ref={box}>
          {/* the rule the two lanes are measured against */}
          <p className="bl-plan-scale" aria-hidden="true">
            <span>Jun 2025</span>
            <i />
            <span>Today</span>
          </p>

          {education.map((school) => (
            <div className="bl-plan-lane" key={school.id} data-school={school.id}>
              <div className="bl-plan-who">
                {/*
                  The campus, in a slot that keeps its shape whether or
                  not a file is behind it. It is the one place on the
                  page a photograph of either school can live, and the
                  short name holds the space until one turns up.
                */}
                <span className="bl-plan-shot">
                  <Plate
                    dir="edu"
                    name={school.id}
                    monogram={school.short}
                    alt={`${school.school} campus`}
                    bare
                  />
                </span>

                <div className="bl-plan-said">
                  <h3>{school.school}</h3>
                <p className="bl-plan-what">
                  <strong>{school.degree}</strong>
                  <span>{school.field}</span>
                </p>

                {/* the figure belongs with the name, not at the far end
                    of the lane: the line that marks today runs down the
                    right-hand edge of every lane and would cross it */}
                  <p className="bl-plan-figure">
                    <strong>
                      <Counter value={school.mark.value} />
                    </strong>
                    <span>{school.mark.label}</span>
                  </p>
                </div>
              </div>

              <div className="bl-plan-run">
                {school.track.map((stage) => (
                  <div
                    className="bl-plan-stage"
                    key={stage.label}
                    data-state={stage.state}
                    style={{ flexGrow: stage.span }}
                  >
                    <b>{stage.label}</b>
                    <span>{stage.note}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/*
            Today, crossing both lanes at once. It is the only thing in
            this drawing that is shared, and it is the entire argument.
          */}
          <span className="bl-plan-now" aria-hidden="true">
            <i />
            <em>Now</em>
          </span>
        </div>
      </Reveal>

      {/* what each one has actually got to, which no lane can carry */}
      <dl className="bl-study-notes">
        {education.map((school) => (
          <div key={school.id}>
            <dt>{school.short}</dt>
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
