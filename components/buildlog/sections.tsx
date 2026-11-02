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
import { Counter, Magnetic } from "./smooth";
import { Plate } from "./plate";
import { Rotator } from "./rotator";
import { Marked, MarkedLine } from "./marked";
import { Reel } from "./reel";
import { AsciiArt } from "@/components/ui/ascii-art";
import { CrowdCanvas } from "@/components/ui/skiper39";
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
const CREDENTIALS = [
  { label: "CGPA", value: "9.34 / 10", note: "MVSR" },
  { label: "Degree", value: "B.E. CSIT", note: "MVSR, Hyderabad" },
  { label: "Second degree", value: "BS Data Science", note: "IIT Madras" },
  { label: "Freelance", value: "ByUsForU", note: "Founder · 5+ shipped" },
];

/** Words that fill the space around the figure, at a whisper. */
const FIELD = [
  { text: "React", x: 6, y: 20 },
  { text: "Next.js", x: 17, y: 62 },
  { text: "FastAPI", x: 9, y: 80 },
  { text: "LangGraph", x: 78, y: 17 },
  { text: "Qdrant", x: 90, y: 44 },
  { text: "Neo4j", x: 82, y: 72 },
  { text: "TypeScript", x: 28, y: 12 },
  { text: "Python", x: 68, y: 86 },
  { text: "RAG", x: 94, y: 28 },
  { text: "Vue", x: 3, y: 46 },
];

function HeroField() {
  return (
    <div className="bl-field" aria-hidden="true">
      {/* the toolkit, scattered and faint */}
      {FIELD.map((item) => (
        <span
          key={item.text}
          className="bl-field-word"
          style={{ left: `${item.x}%`, top: `${item.y}%` }}
        >
          {item.text}
        </span>
      ))}
    </div>
  );
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
    let raf = 0;

    const onMove = (event: PointerEvent) => {
      to.x = (event.clientX / window.innerWidth) * 2 - 1;
      to.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    const loop = () => {
      at.x += (to.x - at.x) * 0.05;
      at.y += (to.y - at.y) * 0.05;
      node.style.setProperty("--mx", at.x.toFixed(4));
      node.style.setProperty("--my", at.y.toFixed(4));
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("pointermove", onMove);
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

      exit
        .to(".bl-hero-wordmark", { yPercent: -36, opacity: 0.1, ease: "none" }, 0)
        .to(".bl-hero-figure", { yPercent: -16, scale: 1.05, opacity: 0.25, ease: "none" }, 0)
        .to(".bl-hero-left", { yPercent: -8, opacity: 0, ease: "none" }, 0)
        .to(".bl-specs", { yPercent: -5, opacity: 0, ease: "none" }, 0)
        .to(".bl-field", { yPercent: -22, opacity: 0, ease: "none" }, 0);
    }, node);

    return () => context.revert();
  }, []);

  // The opening: the ground settles, the portrait rises into it, and the
  // detail arrives after both. The wordmark has its own CSS animation, so
  // this works around it rather than fighting it for the same properties.
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
            0.35,
          )
          .from(".bl-hero-aura", { opacity: 0, scale: 0.75, duration: 1.4 }, 0.45);
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

      {/* the name, large, behind everything */}
      <h1 className="bl-hero-wordmark" aria-hidden="true">
        <span data-line="1">SRIPATHI</span>
        <span data-line="2">DHRUV REDDY</span>
      </h1>
      <span className="bl-sr">S. Dhruv Reddy</span>

      <div className="bl-hero-grid">
        <div className="bl-hero-left">
          <Reveal delay={60}>
            <span className="bl-pill">
              <i aria-hidden="true" />
              Open to work · {time} IST
            </span>
          </Reveal>

          <Reveal delay={150}>
            <p className="bl-hero-am">
              I&apos;m <Rotator words={ROLES} />
            </p>
          </Reveal>

          <Reveal delay={210}>
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

          <Reveal delay={270}>
            <div className="bl-hero-cta">
              <Magnetic>
                <a className="bl-btn bl-btn-solid" href="#work">
                  Explore projects <MarkArrow size={13} />
                </a>
              </Magnetic>
              <Magnetic>
                <a className="bl-btn" href={`mailto:${profile.email}`}>
                  <MarkMail size={14} /> Hire me
                </a>
              </Magnetic>
            </div>
          </Reveal>

          <Reveal delay={330}>
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

        {/* the credentials, each given room to breathe */}
        <dl className="bl-specs">
          {CREDENTIALS.map((item, index) => (
            <Reveal as="div" className="bl-spec" key={item.label} delay={360 + index * 70}>
              <dt>{item.label}</dt>
              <i aria-hidden="true" />
              <dd>
                {item.value}
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
        lead="Five rooms, five different problems. Open any one for the whole account."
      />

      <Reel onOpen={setOpen} />

      {open && <LogModal entry={open} onClose={() => setOpen(null)} />}
    </section>
  );
}

/* ------------------------------------------------------------------ wins */

/**
 * The wins, hung as a wall.
 *
 * Each one is a framed piece: a mat, a plate inside it, and a plaque screwed
 * on underneath. The frames are set at slightly different sizes and tilts so
 * the wall reads as hung rather than laid out, and a light follows the pointer
 * across the glass. Clicking a frame gives the brief behind it.
 */
function WinFrame({
  award,
  index,
  onOpen,
}: {
  award: Award;
  index: number;
  onOpen: () => void;
}) {
  const frame = useRef<HTMLDivElement>(null);

  const track = (event: React.PointerEvent<HTMLDivElement>) => {
    const node = frame.current;
    if (!node) return;
    const box = node.getBoundingClientRect();
    const x = event.clientX - box.left;
    const y = event.clientY - box.top;
    node.style.setProperty("--px", `${x}px`);
    node.style.setProperty("--py", `${y}px`);
    // and the same reading as a pair from -1 to 1, which is what the tilt
    // wants. Kept small on purpose: the tile should stay square to the
    // reader and get its depth from the layers, not from leaning over.
    node.style.setProperty("--rx", (y / box.height - 0.5).toFixed(3));
    node.style.setProperty("--ry", (x / box.width - 0.5).toFixed(3));
  };

  const rest = () => {
    const node = frame.current;
    if (!node) return;
    node.style.setProperty("--rx", "0");
    node.style.setProperty("--ry", "0");
  };

  return (
    <Reveal delay={index * 80}>
      <div
        ref={frame}
        className="bl-bento-tile"
        data-lead={index === 0}
        onPointerMove={track}
        onPointerLeave={rest}
        onClick={onOpen}
        role="button"
        tabIndex={0}
        aria-label={`See the brief for ${award.title}`}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onOpen();
          }
        }}
      >
        <div className="bl-bento-art">
        <Plate
          dir="wins"
          name={award.id}
          src={award.image}
          monogram={award.monogram}
          alt={award.title}
          bare
        />
        <span className="bl-bento-scrim" aria-hidden="true" />
        <span className="bl-frame-glass" aria-hidden="true" />
      </div>

      <div className="bl-bento-copy">
        <span className="bl-frame-kind">{award.kind}</span>
        <strong>{award.title}</strong>
        <em>
          {award.org} · {award.place}
        </em>
        <span className="bl-bento-open">
          Read it <MarkArrow size={11} />
        </span>
      </div>
      </div>
    </Reveal>
  );
}

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

export function WinsSection() {
  const [open, setOpen] = useState<Award | null>(null);
  const wall = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = wall.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const context = gsap.context(() => {
      gsap.from(".bl-bento-tile", {
        z: -220,
        yPercent: 14,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.09,
        scrollTrigger: { trigger: node, start: "top 80%", once: true },
      });
    }, node);

    return () => context.revert();
  }, []);

  return (
    <section className="bl-section bl-wall-act" id="wins">
      <SectionHeader
        label="05 / Recognition"
        title="What it won"
        lead="Four of them. Open any tile for the story behind it."
      />

      <div className="bl-bento" ref={wall}>
        {awards.map((award, index) => (
          <WinFrame
            key={award.id}
            award={award}
            index={index}
            onOpen={() => setOpen(award)}
          />
        ))}
      </div>

      {open && <WinModal award={open} onClose={() => setOpen(null)} />}
    </section>
  );
}

/* --------------------------------------------------------------- contact */

export function ContactSection() {
  return (
    <section className="bl-section bl-contact" id="contact">
      {/*
        A crowd along the foot of the last act. The whole page argues that the
        work was for people and with people, and this is the one place that
        could say so without another paragraph. Set as ink at a whisper, with
        the light falling off at the top and bottom, so they read as figures
        going past behind the invitation rather than as an illustration of it.
      */}
      <div className="bl-crowd" aria-hidden="true">
        <CrowdCanvas
          src="/assets/crowd/peeps.png"
          rows={15}
          cols={7}
          className="bl-crowd-canvas"
        />
      </div>

      <SectionHeader label="07 / Contact" title="What happens next" />

      <Reveal>
        <p className="bl-contact-huge">
          Let&apos;s
          <br />
          <em>build.</em>
        </p>
      </Reveal>

      <Reveal delay={120}>
        <p className="bl-lede">
          Bring the{" "}
          <Marked kind="circle" delay={320}>
            hard problem
          </Marked>
          . I will bring the architecture, the awkward questions, and an
          unreasonable number of browser tabs.
        </p>
      </Reveal>

      <Reveal delay={200}>
        <Magnetic strength={0.22}>
          <a className="bl-cta" href={`mailto:${profile.email}`}>
            <span className="bl-cta-ring" aria-hidden="true" />
            <span className="bl-cta-label">
              <span>Hire the guy</span>
              <span>Hire the guy</span>
            </span>
            <span className="bl-cta-mark" aria-hidden="true">
              <MarkArrow size={22} />
            </span>
          </a>
        </Magnetic>
      </Reveal>

      <Reveal delay={260}>
        <p className="bl-cta-sub">
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
          <span>Replies within a day. Usually sooner.</span>
        </p>
      </Reveal>

      {/* The same four links used to sit here and again in the footer, two
          hundred pixels apart. They belong in the colophon, which is where a
          reader goes looking for them. */}
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
export function BuildLogFooter({ time }: { time: string }) {
  return (
    <footer className="bl-footer" id="footer">
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

        {/* signed off in characters, which is the only portrait a log book
            would have room to print */}
        <div className="bl-colo-art">
          <AsciiArt
            src="/assets/dhruv.png"
            resolution={62}
            charset="standard"
            color="var(--bl-ink-soft)"
            backgroundColor="transparent"
            animationStyle="fade"
            animationDuration={1.4}
            animateOnView={false}
            objectFit="contain"
            className="bl-ascii"
          />
        </div>
      </div>

      <dl className="bl-colo-set">
        <div>
          <dt>Set in</dt>
          <dd>Fraunces, Instrument Sans and JetBrains Mono.</dd>
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
          <dd>{profile.full}, in {profile.location}, by hand.</dd>
        </div>
      </dl>

      <div className="bl-footer-base">
        <span>
          © {new Date().getFullYear()} {profile.full}
        </span>
        <a href="/colophon">Colophon, privacy &amp; terms</a>
        <span>Designed and engineered by {profile.name}</span>
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
