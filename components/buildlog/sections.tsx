"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  awards,
  logEntries,
  profile,
  sections,
  type CaseFile,
  type LogEntry,
} from "@/lib/portfolio-data";
import { Reveal } from "./reveal";
import { Counter, Magnetic } from "./smooth";
import { Plate } from "./plate";
import { Rotator } from "./rotator";
import {
  MarkArrow,
  MarkPin,
  MarkWindow,
  MarkClose,
  MarkCross,
  MarkGithub,
  MarkLinkedin,
  MarkMail,
  MarkPaper,
  MarkRosette,
} from "./marks";

/* ------------------------------------------------------------- section head */

export function SectionHeader({
  label,
  title,
  lead,
}: {
  label: string;
  title: React.ReactNode;
  lead?: string;
}) {
  return (
    <Reveal className="bl-head" as="header">
      <p className="bl-head-label">{label}</p>
      <h2 className="bl-head-title">{title}</h2>
      {lead && <p className="bl-head-lead">{lead}</p>}
    </Reveal>
  );
}

/* -------------------------------------------------------------------- hero */

/** The credentials that belong beside the name, not buried in a section. */
const CREDENTIALS = [
  { icon: <MarkRosette size={18} />, label: "CGPA", value: "9.34 / 10", note: "MVSR" },
  {
    icon: <MarkPin size={18} />,
    label: "MVSR Engineering College",
    value: "B.E. CSIT",
    note: "Hyderabad",
  },
  {
    icon: <MarkPaper size={18} />,
    label: "IIT Madras",
    value: "BS Data Science",
    note: "Diploma stage",
  },
  {
    icon: <MarkWindow size={18} />,
    label: "Freelancer",
    value: "ByUsForU",
    note: "7 brands",
  },
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
  { label: "Email", href: `mailto:${profile.email}`, icon: <MarkMail size={15} /> },
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
              I&apos;m a <Rotator words={ROLES} />
            </p>
          </Reveal>

          <Reveal delay={210}>
            <p className="bl-hero-blurb">
              Building real-world products at the intersection of web, applied AI
              and problem solving. Things that hold up after the demo.
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
        <ul className="bl-hero-creds">
          {CREDENTIALS.map((item, index) => (
            <Reveal as="li" key={item.label} delay={360 + index * 70}>
              <span className="bl-cred-icon" aria-hidden="true">
                {item.icon}
              </span>
              <span className="bl-cred-text">
                <strong>{item.value}</strong>
                <small>{item.label}</small>
              </span>
              <em>{item.note}</em>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- the log */

function LogPreview({ listRef }: { listRef: React.RefObject<HTMLDivElement | null> }) {
  const card = useRef<HTMLDivElement>(null);
  const [entry, setEntry] = useState<LogEntry | null>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const onOver = (event: PointerEvent) => {
      const row = (event.target as HTMLElement)?.closest?.("[data-entry]");
      const id = row instanceof HTMLElement ? row.dataset.entry : undefined;
      setEntry(logEntries.find((item) => item.id === id) ?? null);
    };
    const onLeave = () => setEntry(null);

    list.addEventListener("pointerover", onOver);
    list.addEventListener("pointerleave", onLeave);
    return () => {
      list.removeEventListener("pointerover", onOver);
      list.removeEventListener("pointerleave", onLeave);
    };
  }, [listRef]);

  useEffect(() => {
    const node = card.current;
    if (!node) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const at = { x: 0, y: 0 };
    const to = { x: 0, y: 0 };
    let frame = 0;

    const onMove = (event: PointerEvent) => {
      to.x = event.clientX;
      to.y = event.clientY;
    };
    const loop = () => {
      at.x += (to.x - at.x) * 0.14;
      at.y += (to.y - at.y) * 0.14;
      node.style.transform = `translate3d(${at.x}px, ${at.y}px, 0)`;
      frame = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    frame = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="bl-log-preview" ref={card} data-on={Boolean(entry)} aria-hidden="true">
      {entry && (
        <>
          <Plate dir="log" name={entry.id} src={entry.image} monogram={entry.monogram} alt="" />
          <p>
            <strong>{entry.company}</strong>
            <span>{entry.period}</span>
          </p>
        </>
      )}
    </div>
  );
}

function LogRow({ entry, index }: { entry: LogEntry; index: number }) {
  const [open, setOpen] = useState(index === 0);

  return (
    <Reveal as="article" delay={index * 60}>
      <div
        className="bl-entry"
        data-entry={entry.id}
        data-open={open}
        onClick={() => setOpen((value) => !value)}
        role="button"
        tabIndex={0}
        aria-expanded={open}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setOpen((value) => !value);
          }
        }}
      >
        <div className="bl-entry-meta">
          <span className="bl-entry-year">{entry.period}</span>
          {entry.status === "current" ? (
            <span className="bl-entry-flag">
              <i aria-hidden="true" /> Current
            </span>
          ) : (
            <span className="bl-mono">{entry.location}</span>
          )}
        </div>

        <div className="bl-entry-body">
          <h3 className="bl-entry-company">
            {entry.company}
            {entry.org && <small>{entry.org}</small>}
          </h3>
          <p className="bl-entry-role">{entry.role}</p>
          <p className="bl-entry-headline">{entry.headline}</p>
        </div>

        <span className="bl-entry-ghost" aria-hidden="true">
          {String(index + 1).padStart(2, "0")}
        </span>

        <span className="bl-entry-toggle" aria-hidden="true">
          <MarkCross size={15} />
        </span>

        <div
          className="bl-entry-detail"
          style={{
            display: "grid",
            gridTemplateRows: open ? "1fr" : "0fr",
            transition: "grid-template-rows 0.6s cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          <div style={{ minHeight: 0, overflow: "hidden" }}>
            <div className="bl-entry-detail-inner">
              <div>
                <p className="bl-entry-summary">{entry.summary}</p>
                <ul className="bl-list">
                  {entry.work.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="bl-entry-side">
                <Plate
                  dir="log"
                  name={entry.id}
                  src={entry.image}
                  monogram={entry.monogram}
                  alt={`${entry.company}, ${entry.role}`}
                />
                <div className="bl-metrics">
                  {entry.metrics.map((metric) => (
                    <div className="bl-metric" key={metric.label}>
                      <strong>
                        <Counter value={metric.value} />
                      </strong>
                      <span>{metric.label}</span>
                    </div>
                  ))}
                </div>
                <div className="bl-chips">
                  {entry.stack.map((tech) => (
                    <span className="bl-chip" key={tech}>
                      {tech}
                    </span>
                  ))}
                </div>
                <p className="bl-note">{entry.highlight}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

export function LogSection() {
  const list = useRef<HTMLDivElement>(null);

  return (
    <section className="bl-section" id="log">
      <SectionHeader
        label="01 / Experience"
        title="Where it happened"
        lead="Five rooms, five different problems, and what came out of each."
      />

      <div className="bl-log-list" ref={list}>
        {logEntries.map((entry, index) => (
          <LogRow key={entry.id} entry={entry} index={index} />
        ))}
      </div>

      <LogPreview listRef={list} />
    </section>
  );
}

/* ------------------------------------------------------------------ wins */

export function WinsSection() {
  const [hero, ...rest] = awards;

  return (
    <section className="bl-section" id="wins">
      <SectionHeader
        label="05 / Recognition"
        title="What it won"
        lead="Competitions, and the people it was built for."
      />

      <div className="bl-wins-grid">
        <article className="bl-win bl-win-hero">
          <div className="bl-win-inner">
            <span className="bl-win-kind">{hero.kind}</span>
            <h3 className="bl-win-title">{hero.title}</h3>
            <p className="bl-win-org">
              {hero.org} · {hero.place}
            </p>
            <p className="bl-win-body">{hero.body}</p>
            <ul className="bl-win-facts">
              {hero.facts.map((fact) => (
                <li key={fact}>{fact}</li>
              ))}
            </ul>
            <div className="bl-metrics" style={{ maxWidth: "22rem" }}>
              {hero.metrics.map((metric) => (
                <div className="bl-metric" key={metric.label}>
                  <strong>
                    <Counter value={metric.value} />
                  </strong>
                  <span>{metric.label}</span>
                </div>
              ))}
            </div>
          </div>

          {hero.image && (
            <div className="bl-win-shot">
              <Image
                src={hero.image}
                alt="Dhruv Reddy and team Error404 receiving the Data Dynamo 2.0 award"
                fill
                sizes="(max-width: 880px) 100vw, 50vw"
              />
            </div>
          )}
        </article>

        {rest.map((award) => (
          <article className="bl-win" key={award.id}>
            <Plate
              dir="wins"
              name={award.id}
              src={award.image}
              monogram={award.monogram}
              alt={award.title}
              className="bl-plate-slot--wide"
            />
            <span className="bl-win-kind">{award.kind}</span>
            <h3 className="bl-win-title">{award.title}</h3>
            <p className="bl-win-org">
              {award.org} · {award.year}
            </p>
            <p className="bl-win-body">{award.body}</p>
            <ul className="bl-win-facts">
              {award.facts.map((fact) => (
                <li key={fact}>{fact}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- contact */

export function ContactSection() {
  return (
    <section className="bl-section bl-contact" id="contact">
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
          Bring the hard problem. I will bring the architecture, the awkward
          questions, and an unreasonable number of browser tabs.
        </p>
      </Reveal>

      <Reveal delay={200}>
        <Magnetic strength={0.22}>
          <a className="bl-cta" href={`mailto:${profile.email}`}>
            <span className="bl-cta-ring" aria-hidden="true" />
            <span className="bl-cta-label">
              <span>Email me</span>
              <span>Email me</span>
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
          <span>Typically replies within a day</span>
        </p>
      </Reveal>

      <Reveal delay={320}>
        <div className="bl-contact-links">
          <a className="bl-btn" href={profile.github} target="_blank" rel="noreferrer">
            <MarkGithub size={14} /> {profile.githubHandle}
          </a>
          <a className="bl-btn" href={profile.linkedin} target="_blank" rel="noreferrer">
            <MarkLinkedin size={14} /> {profile.linkedinHandle}
          </a>
          <a className="bl-btn" href={profile.studio} target="_blank" rel="noreferrer">
            ByUsForU <MarkArrow size={12} />
          </a>
          <a className="bl-btn" href={profile.resume} target="_blank" rel="noreferrer">
            <MarkPaper size={14} /> Résumé
          </a>
        </div>
      </Reveal>
    </section>
  );
}

export function BuildLogFooter({ time }: { time: string }) {
  return (
    <footer className="bl-footer" id="footer">
      <div className="bl-footer-name" aria-hidden="true">
        <div className="bl-footer-run">
          {[0, 1].map((copy) => (
            <span key={copy}>
              S. Dhruv Reddy <i /> Full-stack <i /> Applied AI <i />
            </span>
          ))}
        </div>
      </div>

      <div className="bl-footer-grid">
        <div className="bl-footer-col">
          <p className="bl-head-label">Sections</p>
          {sections.map((item) => (
            <a key={item.id} href={`#${item.id}`}>
              {item.label}
            </a>
          ))}
        </div>

        <div className="bl-footer-col">
          <p className="bl-head-label">Elsewhere</p>
          <a href={profile.github} target="_blank" rel="noreferrer">
            GitHub <span>{profile.githubHandle}</span>
          </a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer">
            LinkedIn <span>{profile.linkedinHandle}</span>
          </a>
          <a href={profile.studio} target="_blank" rel="noreferrer">
            ByUsForU <span>freelance.byus4u.in</span>
          </a>
          <a href={profile.resume} target="_blank" rel="noreferrer">
            Résumé <span>PDF</span>
          </a>
        </div>

        <div className="bl-footer-col">
          <p className="bl-head-label">Say hello</p>
          <a className="bl-footer-mail" href={`mailto:${profile.email}`}>
            {profile.email}
          </a>
          <p className="bl-footer-live">
            <i aria-hidden="true" /> Hyderabad · {time}
          </p>
          <p className="bl-footer-coords">{profile.coords}</p>
        </div>
      </div>

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
