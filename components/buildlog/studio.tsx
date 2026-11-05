"use client";

import { useState } from "react";
import Image from "next/image";
import { studio } from "@/lib/portfolio-data";
import { servable } from "@/lib/image-sizes";
import { Reveal } from "./reveal";
import { Ruler } from "./ruler";
import { SectionHeader } from "./sections";
import {
  MarkAgent,
  MarkArrow,
  MarkChat,
  MarkLoop,
  MarkMail,
  MarkPhone,
  MarkRise,
  MarkSeek,
  MarkSpeaker,
  MarkWindow,
} from "./marks";

/**
 * The studio, as a shelf of books.
 *
 * What a studio does is a list, and every way of drawing a list had already
 * been used on this page by the time this act arrives: a grid of cards, a
 * row of chips, a deck you push through, a ring of things going round a
 * mark. A shelf is none of those. It is eight objects of different sizes
 * standing up next to each other, which is what eight services actually are
 * when one of them is most of the work and another is a Tuesday afternoon.
 *
 * Point at a spine and it comes out of the shelf, and the line under the
 * plank says what is in it. Nothing is hidden behind the interaction: the
 * titles are on the spines, the way titles are on spines.
 */

/** The marks, by the name the data gives them. */
const SERVICE_MARKS: Record<string, React.ReactNode> = {
  window: <MarkWindow size={15} />,
  phone: <MarkPhone size={15} />,
  agent: <MarkAgent size={15} />,
  chat: <MarkChat size={15} />,
  seek: <MarkSeek size={15} />,
  loop: <MarkLoop size={15} />,
  speaker: <MarkSpeaker size={15} />,
  rise: <MarkRise size={15} />,
};

/**
 * How each book is cut.
 *
 * By hand rather than from a formula, because a shelf of books generated
 * from an index reads as a bar chart: the eye finds the rule immediately
 * and stops looking. These are uneven the way a shelf is, with the two
 * fattest spines next to each other near the middle and a thin one leaning
 * on the end.
 */
const CUT = [
  { tall: 94, thick: 3.1, tone: 1, lean: 0 },
  { tall: 86, thick: 2.2, tone: 3, lean: 0 },
  { tall: 100, thick: 3.6, tone: 0, lean: 0 },
  { tall: 90, thick: 2.6, tone: 2, lean: 0 },
  { tall: 81, thick: 2.1, tone: 4, lean: 0 },
  { tall: 96, thick: 3.2, tone: 1, lean: 0 },
  { tall: 84, thick: 2.4, tone: 3, lean: 0 },
  /* the last one is tipped against the bookend, because a shelf that is
     not quite full is the only kind anybody has ever owned */
  { tall: 88, thick: 2.8, tone: 2, lean: 9 },
] as const;

function Bookshelf() {
  /** Which spine is out. The first one is out on arrival, so the caption
      under the plank has something to say before anybody touches it. */
  const [out, setOut] = useState(0);
  const open = studio.services[out];

  return (
    <div className="bl-shelf-unit">
      {/*
        The mark, mounted above the shelf at the size a mark is meant to
        be read at. It spent a version stood on the plank like a framed
        photograph, which made it one more object in a row of objects:
        the thing the shelf belongs to cannot be the smallest thing on it.
      */}
      <p className="bl-shelf-mast">
        <span className="bl-shelf-sign">
          <Image src={studio.logo} alt={studio.name} {...servable(949, 297)} />
        </span>
        <i aria-hidden="true" />
        <em>Studio shelf</em>
      </p>

      <div className="bl-shelf-rack">
        <div className="bl-books">
          {studio.services.map((service, index) => {
            const cut = CUT[index] ?? CUT[0];
            return (
              <button
                className="bl-book"
                type="button"
                key={service.label}
                data-out={index === out ? "true" : undefined}
                data-tone={cut.tone}
                aria-pressed={index === out}
                onMouseEnter={() => setOut(index)}
                onFocus={() => setOut(index)}
                onClick={() => setOut(index)}
                style={
                  {
                    "--tall": `${cut.tall}%`,
                    "--thick": `${cut.thick}rem`,
                    "--lean": `${cut.lean}deg`,
                  } as React.CSSProperties
                }
              >
                <span className="bl-book-face">
                  <span className="bl-book-band" aria-hidden="true" />
                  <span className="bl-book-title">{service.label}</span>
                  <span className="bl-book-mark" aria-hidden="true">
                    {SERVICE_MARKS[service.mark]}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {/* something for the leaning one to lean on */}
        <span className="bl-shelf-end" aria-hidden="true" />
      </div>

      {/* the plank, with its front edge and the shadow it throws */}
      <span className="bl-shelf-plank" aria-hidden="true" />

      <p className="bl-shelf-say" aria-live="polite">
        <b>{open.label}</b>
        <span>{open.note}</span>
      </p>
    </div>
  );
}

export function StudioSection() {
  return (
    <section className="bl-section bl-studio" id="studio">
      <SectionHeader
        label="06 / Independent"
        title="And a studio he runs"
        lead="Clients, not coursework. He founded it, he scopes it, he builds it, and two of the people paying for it are in the United States."
        note="Founder, still shipping"
      />

      <Reveal>
        <div className="bl-bfu">
          <Bookshelf />

          <div className="bl-bfu-say">
            <p className="bl-bfu-kicker">
              <i aria-hidden="true" />
              Founder
            </p>

            <h3 className="bl-bfu-name">{studio.name}</h3>
            <p className="bl-bfu-what">The creative design studio</p>
            <p className="bl-bfu-job">{studio.tagline}</p>

            {/*
              And where it came from, set the way the rest of this column
              is not: large, heavy and tight. It is the only paragraph in
              the studio act, so it is allowed to be the thing you look
              at rather than the thing under the thing you look at.

              It is uncovered under a ruler rather than assembled out of
              its own words, which is the statement act's trick and is
              not borrowed here. Same idea, reading at the speed of the
              scroll; two different ways of showing it.
            */}
            <p className="bl-bfu-lab">How it started</p>
            <Ruler className="bl-bfu-story">{studio.story}</Ruler>

            <p className="bl-bfu-count">
              <strong>5+</strong>
              <span>projects shipped</span>
            </p>

            <div className="bl-bfu-ways">
              <a
                className="bl-bfu-site"
                href={studio.site}
                target="_blank"
                rel="noreferrer"
              >
                <span>freelance.byus4u.in</span>
                <MarkArrow size={14} />
              </a>
              <a className="bl-bfu-mail" href={`mailto:${studio.email}`}>
                <MarkMail size={13} />
                <span>{studio.email}</span>
              </a>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
