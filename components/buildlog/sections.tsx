"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  awards,
  logStories,
  profile,
  type Award,
  type CaseFile,
  type LogEntry,
} from "@/lib/portfolio-data";
import { Reveal } from "./reveal";
import { whenCurtainOpens } from "@/lib/curtain";
import { Counter, Magnetic, useSmoothScroll } from "./smooth";
import { HeroInk } from "./ink";
import { Plate } from "./plate";
import { Rotator } from "./rotator";
import { Marked, MarkedLine } from "./marked";
import { Route } from "./route";
import { CrowdCanvas } from "@/components/ui/skiper39";
import { PolaroidLine } from "@/components/ui/polaroid-line";
import { StampedWordmark } from "@/components/ui/stamped-wordmark";
import {
  MarkArrow,
  MarkWindow,
  MarkClose,
  MarkGithub,
  MarkLinkedin,
  MarkMail,
  MarkPaper,
  MarkRosette,
} from "./marks";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ------------------------------------------------------------- section head */

/**
 * How an act opens: a ruled folio line carrying the act's number and name,
 * then the title hanging under it in the book's serif, left, in mixed case,
 * with the lede set out to the right.
 *
 * Every act used to open with the same centred uppercase slab. Six of them
 * in a row is what a template looks like, and it was shouting over the hero,
 * which is the one place on the page that voice is meant to be.
 */
export function SectionHeader({
  label,
  title,
  lead,
  note,
}: {
  /** "03 / Study": the act number, then what the act is. */
  label: string;
  title: React.ReactNode;
  lead?: string;
  /** Optional right-hand end of the rule: a count, a date, a folio. */
  note?: string;
}) {
  const [no, tag] = label.split("/").map((part) => part.trim());

  return (
    <Reveal className="bl-head" as="header">
      <p className="bl-head-rule">
        <span className="bl-head-no">{no}</span>
        <span className="bl-head-tag">{tag ?? label}</span>
        <i aria-hidden="true" />
        {note && <span className="bl-head-note">{note}</span>}
      </p>
      <h2 className="bl-head-title">{title}</h2>
      {lead && <p className="bl-head-lead">{lead}</p>}
    </Reveal>
  );
}

/* -------------------------------------------------------------------- hero */

/** The credentials that belong beside the name, not buried in a section. */
/* Read as a spec sheet, so the left column stays short and the right column
   carries the substance. The icons went with the boxes. */
/*
 * Three numbers, counted off the rest of the page rather than claimed: five
 * entries in the log, six case files and two side quests, two degrees that
 * are both running. Anything that needed a sentence to stand up (the CGPA,
 * the studio, which degree is which) belongs in the act that covers it,
 * where there is room to say it properly.
 */
const TALLY = [
  { figure: "05", label: "Internships", note: "Five rooms, five problems" },
  { figure: "08", label: "Shipped", note: "Six platforms, two side quests" },
  { figure: "02", label: "Degrees", note: "Both running right now" },
  { figure: "9.34", label: "CGPA", note: "Carried while running both" },
];

/*
 * The ground behind the cover: a technical grid, masked off at the edges.
 *
 * It used to carry ten drifting tool names as well. The stack has a whole
 * act of its own further down with thirty-one of them in it, so all this
 * did was say the same thing first, quieter, over the one picture on the
 * page that has to land in a second.
 */
/**
 * A label that rolls over on hover: the word leaves upward and the same
 * word arrives from below, so the button answers the pointer with the one
 * thing it has to say rather than with a change of colour.
 */
export function Roll({ children }: { children: string }) {
  return (
    <span className="bl-roll">
      <span>{children}</span>
      <span aria-hidden="true">{children}</span>
    </span>
  );
}

function HeroField() {
  return <div className="bl-field" aria-hidden="true" />;
}

const ROLES = [
  "full-stack developer",
  "AI builder",
  "freelancer",
  "RAG engineer",
  "problem solver",
];

const SOCIALS = [
  { label: "GitHub", href: profile.github, icon: <MarkGithub size={15} /> },
  { label: "LinkedIn", href: profile.linkedin, icon: <MarkLinkedin size={15} /> },
];

export function Hero({ time }: { time: string }) {
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = stage.current;
    if (!node) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const to = { x: 0, y: 0 };
    const at = { x: 0, y: 0 };
    /* where the light is, and where it is heading, in the cover's own
       pixels rather than the -1..1 the parallax works in */
    const lit = { x: 0, y: 0 };
    const goes = { x: 0, y: 0 };
    let placed = false;
    let raf = 0;

    /*
     * The cover's own box. Read on the way in and on resize rather than
     * on every move: it is the first thing on the page, so it only
     * changes when the window does.
     */
    let box = { top: 0, height: 0 };
    const remeasure = () => {
      box = { top: node.offsetTop, height: node.offsetHeight || 1 };
      goes.x = window.innerWidth / 2;
      goes.y = box.height * 0.42;
    };
    remeasure();
    lit.x = goes.x;
    lit.y = goes.y;

    const onMove = (event: PointerEvent) => {
      to.x = (event.clientX / window.innerWidth) * 2 - 1;
      to.y = (event.clientY / window.innerHeight) * 2 - 1;
      goes.x = event.clientX;
      goes.y = event.clientY + window.scrollY - box.top;
    };

    const loop = () => {
      at.x += (to.x - at.x) * 0.05;
      at.y += (to.y - at.y) * 0.05;
      node.style.setProperty("--mx", at.x.toFixed(4));
      node.style.setProperty("--my", at.y.toFixed(4));

      /* the light is carried rather than dragged: a shade quicker than
         the parallax, so it arrives first and the sheet follows */
      lit.x += (goes.x - lit.x) * 0.08;
      lit.y += (goes.y - lit.y) * 0.08;

      /* the pool itself is moved, not redrawn: a gradient restated every
         frame repaints the whole cover, and a transform does not */
      node.style.setProperty("--lpx", `${lit.x.toFixed(1)}px`);
      node.style.setProperty("--lpy", `${lit.y.toFixed(1)}px`);
      /* and this is the one thing the light has to tell the type, which
         is only where it is across the sheet */
      node.style.setProperty(
        "--lx",
        `${((lit.x / window.innerWidth) * 100).toFixed(2)}%`,
      );

      if (!placed) {
        placed = true;
        node.dataset.lit = "true";
      }

      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("resize", remeasure);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", remeasure);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Leaving the hero, its layers travel at different speeds and fade: the
  // name furthest and fastest, the portrait a little behind it, the copy
  // slowest. Scrubbed, so scrolling back up puts it all together again.
  useEffect(() => {
    const node = stage.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const context = gsap.context(() => {
      const exit = gsap.timeline({
        scrollTrigger: {
          trigger: node,
          start: "top top",
          end: "bottom top",
          scrub: 0.4,
        },
      });

      /*
       * Every layer leaves at its own rate, which is the whole of the trick:
       * the name furthest and fastest because it is nearest, the grid behind
       * it slower, the portrait slower still. Inside the two columns the
       * same thing happens again, item by item, so the hero comes apart as
       * a depth of field rather than as one sheet sliding off.
       *
       * The targets are the contents of each reveal, never the reveal
       * itself: that element's transform belongs to the CSS that brings it
       * in, and two owners of one transform means whichever wrote last wins.
       */
      exit
        .to(".bl-hero-wordmark", { yPercent: -44, opacity: 0.06, ease: "none" }, 0)
        .to(".bl-field", { yPercent: -26, opacity: 0, ease: "none" }, 0)
        .to(".bl-hero-figure", { yPercent: -13, scale: 1.06, opacity: 0.22, ease: "none" }, 0)
        .to(
          ".bl-hero-left .bl-reveal > *",
          // pixels, not percent: these five are a caption, a headline, a
          // paragraph and two rows of links, and a share of each one's own
          // height puts the tall middle of the stack out in front of the
          // things below it instead of behind them
          { y: (i: number) => -(12 + i * 26), opacity: 0, ease: "none" },
          0,
        )
        .to(
          ".bl-tally-row dt",
          { yPercent: (i: number) => -14 - i * 12, opacity: 0, ease: "none" },
          0,
        )
        .to(
          ".bl-tally-row dd",
          { yPercent: (i: number) => -5 - i * 8, opacity: 0, ease: "none" },
          0,
        );
    }, node);

    return () => context.revert();
  }, []);

  // The opening, in one order: the ground settles, the man rises into it,
  // the name resolves, then the detail and the figures arrive one at a
  // time down the column, and the ink goes on last. Everything here is
  // counted from the same moment, the cover going, because three things
  // opening on three clocks is not a sequence, it is a pile-up, and that
  // is what this was. The name used to land half a second after the copy
  // that is supposed to follow it.
  //
  // The beats are kept in one place: this timeline, the delays on the
  // Reveals below, and the two CSS animations (the wordmark, and the ink)
  // all read off the same score, written out in bl-hero in the css.
  //
  // Held until the cover starts leaving. It used to run on mount, which is
  // three seconds before anyone could see it, so the sheet dissolved onto a
  // hero that had already finished arriving.
  useEffect(() => {
    const node = stage.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let context: gsap.Context | null = null;

    const release = whenCurtainOpens(() => {
      context = gsap.context(() => {
        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .from(".bl-field", { opacity: 0, scale: 1.08, duration: 1.3 }, 0)
          .from(
            ".bl-hero-figure",
            { yPercent: 9, opacity: 0, duration: 1.25, clearProps: "opacity" },
            0.3,
          )
          .from(".bl-hero-aura", { opacity: 0, scale: 0.75, duration: 1.4 }, 0.4);
      }, node);
    });

    return () => {
      release();
      context?.revert();
    };
  }, []);

  return (
    <section className="bl-hero" id="top" ref={stage}>
      <HeroField />

      {/*
        The light. It is drawn where the pointer is and nothing else in
        the cover moves with it, so the sheet reads as a flat thing in a
        room rather than a screen with a glow on it.
      */}
      <div className="bl-keylight" aria-hidden="true">
        <i />
      </div>

      {/* and the ink down the margins, which goes on last of all */}
      <HeroInk />

      {/* the name, large, behind everything */}
      <h1 className="bl-hero-wordmark" aria-hidden="true">
        {/* the word is given twice: once as the sheet, and once more on
            the layer the light falls on. See bl-hero-wordmark in the css */}
        <span data-line="1" data-word="SRIPATHI">
          SRIPATHI
        </span>
        <span data-line="2" data-word="DHRUV REDDY">
          DHRUV REDDY
        </span>
      </h1>
      <span className="bl-sr">S. Dhruv Reddy</span>

      <div className="bl-hero-grid">
        <div className="bl-hero-left">
          <Reveal delay={800} rise={14}>
            <span className="bl-pill">Open to work · {time} IST</span>
          </Reveal>

          <Reveal delay={920} rise={20}>
            <p className="bl-hero-am">
              I&apos;m <Rotator words={ROLES} />
            </p>
          </Reveal>

          <Reveal delay={1040} rise={27}>
            <p className="bl-hero-blurb">
              Building real-world products at the intersection of web,{" "}
              <Marked kind="circle" delay={900}>
                applied AI
              </Marked>{" "}
              and problem solving. Things that{" "}
              <Marked kind="underline" delay={1500}>
                hold up after the demo
              </Marked>
              .
            </p>
          </Reveal>

          {/*
            One button. There were four rounded outlines stacked down this
            column before (two buttons, two social chips) and under a name
            that size they read as a row of tabs, with nothing among them
            saying which one to press.
          */}
          <Reveal delay={1160} rise={34}>
            <div className="bl-hero-cta">
              <Magnetic>
                <a className="bl-btn bl-btn-solid bl-go" href="#work">
                  <Roll>Explore projects</Roll>
                  <span className="bl-go-mark" aria-hidden="true">
                    <MarkArrow size={13} />
                    <MarkArrow size={13} />
                  </span>
                </a>
              </Magnetic>
              <a className="bl-hero-link bl-go" href={`mailto:${profile.email}`}>
                <span className="bl-go-mark bl-go-mark-lead" aria-hidden="true">
                  <MarkMail size={13} />
                  <MarkMail size={13} />
                </span>
                <Roll>Hire me</Roll>
              </a>
            </div>
          </Reveal>

          <Reveal delay={1280} rise={40}>
            <ul className="bl-socials">
              {SOCIALS.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target={item.href.startsWith("mailto") ? undefined : "_blank"}
                    rel="noreferrer"
                    aria-label={item.label}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <div className="bl-hero-figure">
          <span className="bl-hero-aura" aria-hidden="true" />
          <Image
            src="/assets/dhruv.png"
            alt={`${profile.full}, full-stack engineer`}
            fill
            priority
            sizes="(max-width: 1024px) 60vw, 30rem"
          />
        </div>

        {/* the count, in the poster face */}
        <dl className="bl-tally">
          {TALLY.map((item, index) => (
            <Reveal as="div" className="bl-tally-row" key={item.label} delay={1420 + index * 120}>
              <dt>
                {item.figure}
                {!item.figure.includes(".") && <i aria-hidden="true">.</i>}
              </dt>
              <dd>
                <b>{item.label}</b>
                <em>{item.note}</em>
              </dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- the log */

/* ----------------------------------------------------------------- the log */

const LINK_MARK = {
  site: MarkWindow,
  demo: MarkArrow,
  repo: MarkGithub,
} as const;

/** The whole account, over the page. */
export function LogModal({
  entry,
  onClose,
}: {
  entry: LogEntry;
  onClose: () => void;
}) {
  const story = logStories[entry.id];

  useEffect(() => {
    document.documentElement.classList.add("bl-locked");
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", escape);
    return () => {
      document.documentElement.classList.remove("bl-locked");
      window.removeEventListener("keydown", escape);
    };
  }, [onClose]);

  return (
    <div
      className="bl-modal"
      role="dialog"
      aria-modal="true"
      aria-label={`${entry.company}, full entry`}
      onClick={onClose}
    >
      <article
        className="bl-modal-sheet bl-job-sheet"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="bl-modal-head">
          <span className="bl-mono">
            {entry.period} · {entry.location}
          </span>
          <button
            className="bl-modal-close"
            type="button"
            onClick={onClose}
            aria-label="Close this entry"
          >
            <MarkClose size={14} />
          </button>
        </header>

        <div className="bl-modal-body">
          <div className="bl-job-sheet-head">
            <span className="bl-job-mark" aria-hidden="true">
              {entry.monogram}
            </span>
            <div>
              <h3 className="bl-modal-title">{entry.company}</h3>
              <p className="bl-job-role">{entry.role}</p>
            </div>
          </div>

          <p className="bl-job-sheet-lead">
            <MarkedLine text={entry.headline} mark={entry.mark} />
          </p>

          <div
            className="bl-metrics"
            style={{ gridTemplateColumns: "repeat(auto-fit,minmax(9rem,1fr))" }}
          >
            {entry.metrics.map((metric) => (
              <div className="bl-metric" key={metric.label}>
                <strong>
                  <Counter value={metric.value} />
                </strong>
                <span>{metric.label}</span>
              </div>
            ))}
          </div>

          {story?.blocks.map((block) => (
            <section className="bl-job-block" key={block.heading}>
              <h4>{block.heading}</h4>
              <p>{block.body}</p>
            </section>
          ))}

          <section className="bl-job-block">
            <h4>Everything it covered</h4>
            <ul className="bl-stack-work">
              {entry.work.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <div className="bl-chips">
            {entry.stack.map((tech) => (
              <span className="bl-chip" key={tech}>
                {tech}
              </span>
            ))}
          </div>

          {story?.links && story.links.length > 0 && (
            <div className="bl-job-sheet-links">
              {story.links.map((link) => {
                const Icon = LINK_MARK[link.kind];
                return (
                  <a
                    className="bl-btn"
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Icon size={13} /> {link.label}
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </article>
    </div>
  );
}

export function LogSection() {
  const [open, setOpen] = useState<LogEntry | null>(null);

  return (
    <section className="bl-section bl-log" id="log">
      <SectionHeader
        label="01 / Experience"
        title="Where it happened"
        lead="Four companies and a research lab, from June 2025 to now. The shortest ran two months; in one of them he was handed four developers and a deadline."
      />

      <Route onOpen={setOpen} />

      {open && <LogModal entry={open} onClose={() => setOpen(null)} />}
    </section>
  );
}

/* ------------------------------------------------------------------ wins */

/** The brief behind the frame. */
function WinModal({ award, onClose }: { award: Award; onClose: () => void }) {
  useEffect(() => {
    document.documentElement.classList.add("bl-locked");
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", escape);
    return () => {
      document.documentElement.classList.remove("bl-locked");
      window.removeEventListener("keydown", escape);
    };
  }, [onClose]);

  return (
    <div
      className="bl-modal"
      role="dialog"
      aria-modal="true"
      aria-label={award.title}
      onClick={onClose}
    >
      <article
        className="bl-modal-sheet bl-job-sheet"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="bl-modal-head">
          <span className="bl-mono">
            {award.kind} · {award.year}
          </span>
          <button
            className="bl-modal-close"
            type="button"
            onClick={onClose}
            aria-label="Close"
          >
            <MarkClose size={14} />
          </button>
        </header>

        <div className="bl-modal-body">
          <div className="bl-modal-hero">
            <p className="bl-head-label">
              {award.org} · {award.place}
            </p>
            <h3 className="bl-modal-title">{award.title}</h3>
            <p className="bl-job-sheet-lead">
              <MarkedLine text={award.headline} mark={award.mark} kind="circle" />
            </p>
          </div>

          {award.image && (
            <Plate
              dir="wins"
              name={award.id}
              src={award.image}
              monogram={award.monogram}
              alt={award.title}
              className="bl-modal-art"
            />
          )}

          <div
            className="bl-metrics"
            style={{ gridTemplateColumns: "repeat(auto-fit,minmax(9rem,1fr))" }}
          >
            {award.metrics.map((metric) => (
              <div className="bl-metric" key={metric.label}>
                <strong>
                  <Counter value={metric.value} />
                </strong>
                <span>{metric.label}</span>
              </div>
            ))}
          </div>

          <section className="bl-job-block">
            <h4>The brief</h4>
            <p>{award.body}</p>
          </section>

          <section className="bl-job-block">
            <h4>For the record</h4>
            <ul className="bl-list">
              {award.facts.map((fact) => (
                <li key={fact}>{fact}</li>
              ))}
            </ul>
          </section>
        </div>
      </article>
    </div>
  );
}

/**
 * The wins, pegged to a line on a wall.
 *
 * They were four tiles in a grid, which is the right object for work and the
 * wrong one for this: these are photographs of rooms with people in them,
 * taken on days that mattered, and a grid files them. A line of prints on a
 * wall is how anybody actually keeps those.
 *
 * Drag the line, use the arrows, or press the one in the middle to read it.
 */
export function WinsSection() {
  const [open, setOpen] = useState<Award | null>(null);

  return (
    <section className="bl-section bl-wall-act" id="wins">
      <SectionHeader
        label="05 / Recognition"
        title="What it won"
        lead="A hackathon taken off sixty-five other teams, a club that kept filling up, and two more besides. Drag the line."
        note={`${awards.length} pinned up`}
      />

      <PolaroidLine
        className="bl-wall"
        /* taller than the default, because the bar under the line now
           carries two or three lines on each win as well as its name */
        height="35rem"
        prints={awards.map((award) => ({
          cover: (
            <Plate
              dir="wins"
              name={award.id}
              src={award.image}
              monogram={award.monogram}
              alt={award.title}
              bare
            />
          ),
          note: award.kind,
          title: award.title,
          caption: `${award.org} · ${award.place}`,
          /* the two or three lines that say what it actually was. The
             line used to carry a name and a place and nothing else,
             which told a reader a prize existed and not what for. */
          blurb: award.body,
          alt: award.title,
        }))}
        onOpen={(index) => setOpen(awards[index])}
        openLabel="Read it"
        ariaLabel="Four wins, pegged to a line"
      />

      {open && <WinModal award={open} onClose={() => setOpen(null)} />}
    </section>
  );
}

/* --------------------------------------------------------------- contact */

export function ContactSection() {
  return (
    <section className="bl-section bl-contact" id="contact">
      {/*
        A crowd along the foot of the last act. The whole page argues that
        the work was for people and with people, and this is the one place
        that could say so without another paragraph. Set as ink at a
        whisper, with the light falling off at the top and bottom, so they
        read as figures going past behind the invitation rather than as an
        illustration of it.
      */}
      <div className="bl-crowd" aria-hidden="true">
        <CrowdCanvas
          src="/assets/crowd/peeps.png"
          rows={15}
          cols={7}
          className="bl-crowd-canvas"
        />
      </div>

      {/*
        And the close: one line and two ways to answer it.

        This has been a centred column of links, then a desk laid out like
        a form, then a brief with the questions already filled in. Each of
        those was a page's worth of furniture at the exact point the reader
        has either decided or not, and none of it changed the decision. A
        last act earns nothing by being busy.

        So: who the page is for, the one claim on it that is still
        untested, and the two addresses. The figures walking along the foot
        are what it is about, and now there is nothing between the line and
        them.
      */}
      <Reveal>
        <p className="bl-close-kicker">
          <span>07 / Contact</span>
          <i aria-hidden="true" />
          <em>Open to work</em>
        </p>
      </Reveal>

      {/*
        Three drafts of this line said something about hiring him: don't
        take a chance, five teams already did, nobody above hired a CV.
        All three put him on one side of a table asking to be let over,
        and the page has spent seven acts earning the right not to stand
        there. The work above is finished, dated and someone else's
        problem now. The only interesting thing left is the one nobody
        has built, and that is a sentence with two people in it.

        It had a drawing of two hands over it for a while. The line does
        not need illustrating, and the figures walking along the foot of
        the act are already a picture of the same idea with nothing
        drawn on purpose.
      */}
      <Reveal delay={120}>
        <h2 className="bl-close-line">
          Everything above already exists.
          <em>The next one needs two of us.</em>
        </h2>
      </Reveal>

      <Reveal delay={240}>
        <div className="bl-close-ways">
          {/*
            The address is written out rather than hidden behind a word,
            because half of the people who read this will want to paste it
            somewhere and not open a mail client.
          */}
          <a className="bl-close-way" href={`mailto:${profile.email}`}>
            <span className="bl-close-mark" aria-hidden="true">
              <MarkMail size={16} />
            </span>
            <span className="bl-close-text">
              <b>Email</b>
              {/* broken at the at-sign rather than wherever the column
                  runs out, which on a phone was mid-domain */}
              <span>
                {profile.email.split("@")[0]}
                <wbr />
                {`@${profile.email.split("@")[1]}`}
              </span>
            </span>
            <span className="bl-close-go" aria-hidden="true">
              <MarkArrow size={14} />
            </span>
          </a>

          <a
            className="bl-close-way"
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer"
          >
            <span className="bl-close-mark" aria-hidden="true">
              <MarkLinkedin size={16} />
            </span>
            <span className="bl-close-text">
              <b>LinkedIn</b>
              <span>{profile.linkedinHandle}</span>
            </span>
            <span className="bl-close-go" aria-hidden="true">
              <MarkArrow size={14} />
            </span>
          </a>
        </div>
      </Reveal>
    </section>
  );
}

/**
 * The back page: a colophon, not a sitemap.
 *
 * There were three columns of links and a marquee running the name across
 * the bottom for ever. Both are filler. The contents already live in the bar,
 * so repeating them here only says the page ran out of things to put at the
 * end, and an infinite scroller of your own name says less the longer it
 * runs.
 *
 * A colophon is the opposite: the small print a book keeps for the people
 * who are still reading. What it is set in, what it was made with, where it
 * was made, and one way to reach the person who made it.
 */
/**
 * The four things a recruiter checks before anything else, running
 * across the top of the last page.
 *
 * They used to sit in the close as a list of three, where they were
 * furniture in front of the one line that act exists for. Down here
 * they are what a ticker is for: the facts that are true today and
 * might not be in a month, moving, in the smallest type on the site.
 *
 * Nothing on this page repeats: the page has two other moving bands and
 * both are curved, accent-filled and say one sentence. This is straight,
 * ruled top and bottom, tipped off the horizontal, and says five.
 */
const TICKER = [
  "Open to work",
  "Full-stack and applied AI",
  "Hyderabad, open to remote",
  "Replies within a day",
  "Freelance through ByUsForU",
];

function TickerRun() {
  return (
    <span className="bl-ticker-set">
      {TICKER.map((line) => (
        <span className="bl-ticker-one" key={line}>
          {line}
          <i aria-hidden="true" />
        </span>
      ))}
    </span>
  );
}

export function BuildLogFooter({ time }: { time: string }) {
  const { scrollTo } = useSmoothScroll();
  const giant = useRef<HTMLParagraphElement>(null);
  const foot = useRef<HTMLElement>(null);

  /*
   * Whether the last page can be uncovered rather than scrolled to.
   *
   * Pinning it to the foot of the window only works while the whole
   * thing fits in the window; a page taller than that would be pinned
   * with its head cut off and the colophon would never be reachable.
   * Which widths and heights those are is not something a media query
   * can be told, because the answer depends on how tall this footer
   * happens to be at that width, and that moves every time a line of
   * it is rewritten. So it is measured.
   */
  useEffect(() => {
    const node = foot.current;
    if (!node) return;

    let was: boolean | null = null;
    const fits = () => {
      const ok =
        window.innerWidth >= 880 && node.offsetHeight <= window.innerHeight - 8;
      /* only written when it changes, so observing the element whose
         own attribute this is cannot turn into a loop */
      if (ok === was) return;
      was = ok;
      if (ok) node.dataset.reveal = "true";
      else delete node.dataset.reveal;
    };

    fits();
    const watch = new ResizeObserver(fits);
    watch.observe(node);
    window.addEventListener("resize", fits);

    return () => {
      watch.disconnect();
      window.removeEventListener("resize", fits);
    };
  }, []);

  /*
   * The watermark rises as the curtain lifts.
   *
   * Tied to the footer rather than played on arrival, because the
   * footer is pinned for the whole of its own reveal: the scroll that
   * uncovers it is the only clock this can run on that matches what
   * the reader is doing.
   */
  useEffect(() => {
    const word = giant.current;
    if (!word) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const context = gsap.context(() => {
      gsap.fromTo(
        word,
        { yPercent: 26, scale: 0.86, opacity: 0 },
        {
          yPercent: 0,
          scale: 1,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: word.closest(".bl-footer"),
            start: "top bottom",
            end: "bottom bottom",
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        },
      );
    }, word);

    return () => context.revert();
  }, []);

  return (
    <footer className="bl-footer" id="footer" ref={foot}>
      {/* the word this act is, set the size of the act */}
      <p className="bl-footer-giant" ref={giant} aria-hidden="true">
        Colophon
      </p>

      {/* and the standing facts, going past */}
      <div className="bl-ticker" aria-hidden="true">
        <div className="bl-ticker-run">
          <TickerRun />
          <TickerRun />
        </div>
      </div>

      {/*
        The last page, in three parts and in the order you would want them:
        how to reach him, what the thing is made of, and then his name.

        It used to open with the name and close with the small print, with
        a portrait drawn in ASCII characters and an email set two sizes
        larger than anything near it in between. The portrait was already
        on the cover and the address does not need shouting; what a last
        page owes a reader is the way out, legibly, and then nothing.
      */}
      <div className="bl-colo">
        <div className="bl-colo-say">
          <p className="bl-colo-kicker">Say hello</p>

          <a className="bl-colo-mail" href={`mailto:${profile.email}`}>
            {profile.email}
          </a>

          <p className="bl-colo-where">
            <i aria-hidden="true" />
            {profile.location} · {time} · {profile.coords}
          </p>

          <div className="bl-colo-links">
            <a href={profile.github} target="_blank" rel="noreferrer">
              <MarkGithub size={13} /> {profile.githubHandle}
            </a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer">
              <MarkLinkedin size={13} /> {profile.linkedinHandle}
            </a>
            <a href={profile.studio} target="_blank" rel="noreferrer">
              ByUsForU <MarkArrow size={11} />
            </a>
            <a href={profile.resume} target="_blank" rel="noreferrer">
              <MarkPaper size={13} /> Résumé
            </a>
          </div>
        </div>

        <dl className="bl-colo-set">
          <div>
            <dt>Set in</dt>
            <dd>Fraunces, Instrument Sans, Archivo and JetBrains Mono.</dd>
          </div>
          <div>
            <dt>Built with</dt>
            <dd>Next.js, GSAP and Lenis, served from the edge.</dd>
          </div>
          <div>
            <dt>Tracks</dt>
            <dd>Nothing. No analytics, no cookies, no third-party scripts.</dd>
          </div>
          <div>
            <dt>Written by</dt>
            {/* not his name a third time in the same six inches of page:
                it is signed above, and stamped the size of a door below */}
            <dd>One person, in {profile.location}, by hand.</dd>
          </div>
        </dl>
      </div>

      <div className="bl-footer-base">
        <span>
          © {new Date().getFullYear()} {profile.full}
        </span>
        <a href="/colophon">Colophon, privacy &amp; terms</a>
        <span>No template, no page builder, no agency</span>

        {/* the end of a book is the one place a way back belongs */}
        <Magnetic strength={0.3}>
          <button type="button" className="bl-totop" onClick={() => scrollTo(0)}>
            <MarkArrow size={12} />
            Back to the cover
          </button>
        </Magnetic>
      </div>

      {/*
        And his name, pressed into the very last of the page, under
        everything else. It is the only thing down here that is allowed
        to be large, and it is the last thing the page says.
      */}
      <div className="bl-signoff">
        <StampedWordmark
          word="S. Dhruv Reddy"
          count={13}
          marks={[
            <MarkRosette key="r" size={20} />,
            <MarkPaper key="p" size={20} />,
            <MarkWindow key="w" size={20} />,
            <MarkGithub key="g" size={20} />,
            <MarkArrow key="a" size={20} />,
            <MarkMail key="m" size={20} />,
          ]}
        />
        <p className="bl-signoff-end" aria-hidden="true">
          <i />
          End of log
          <i />
        </p>
      </div>
    </footer>
  );
}

/* ---------------------------------------------------------- case modal */

export function CaseModal({ file, onClose }: { file: CaseFile; onClose: () => void }) {
  useEffect(() => {
    document.documentElement.classList.add("bl-locked");
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", escape);
    return () => {
      document.documentElement.classList.remove("bl-locked");
      window.removeEventListener("keydown", escape);
    };
  }, [onClose]);

  return (
    <div
      className="bl-modal"
      role="dialog"
      aria-modal="true"
      aria-label={`${file.name} case file`}
      onClick={onClose}
    >
      <article className="bl-modal-sheet" onClick={(event) => event.stopPropagation()}>
        <header className="bl-modal-head">
          <span className="bl-mono">
            {file.index} · {file.domain}
          </span>
          <button
            className="bl-modal-close"
            type="button"
            onClick={onClose}
            aria-label="Close case file"
          >
            <MarkClose size={14} />
          </button>
        </header>

        <div className="bl-modal-body">
          <div className="bl-modal-hero">
            <p className="bl-head-label">{file.tagline}</p>
            <h3 className="bl-modal-title">{file.name}</h3>
            <p className="bl-modal-overview">{file.overview}</p>
          </div>

          <Plate
            dir="work"
            name={file.id}
            src={file.image}
            monogram={file.name}
            alt={`${file.name} visual`}
            className="bl-modal-art"
          />

          {file.awards && (
            <div className="bl-modal-awards">
              {file.awards.map((award) => (
                <span key={award}>
                  <MarkRosette size={13} /> {award}
                </span>
              ))}
            </div>
          )}

          <div
            className="bl-metrics"
            style={{ gridTemplateColumns: "repeat(auto-fit,minmax(9rem,1fr))" }}
          >
            {file.metrics.map((metric) => (
              <div className="bl-metric" key={metric.label}>
                <strong>
                  <Counter value={metric.value} />
                </strong>
                <span>{metric.label}</span>
              </div>
            ))}
          </div>

          <div className="bl-divider" />

          <div className="bl-feature-grid">
            {file.features.map((group) => (
              <div className="bl-feature" key={group.title}>
                <h4>{group.title}</h4>
                <ul className="bl-list">
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="bl-divider" />

          <div>
            <p className="bl-head-label" style={{ marginBottom: "0.55rem" }}>
              Built with
            </p>
            <div className="bl-chips">
              {file.stack.map((tech) => (
                <span className="bl-chip" key={tech}>
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {file.note && <p className="bl-note">{file.note}</p>}

          <div className="bl-contact-links">
            {file.link && (
              <a
                className="bl-btn bl-btn-solid"
                href={file.link.href}
                target="_blank"
                rel="noreferrer"
              >
                {file.link.label} <MarkArrow size={14} />
              </a>
            )}
            {file.status && <span className="bl-chip">{file.status}</span>}
          </div>
        </div>
      </article>
    </div>
  );
}
