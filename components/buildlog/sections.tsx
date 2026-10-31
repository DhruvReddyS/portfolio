"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  awards,
  education,
  logEntries,
  profile,
  type CaseFile,
  type LogEntry,
} from "@/lib/portfolio-data";
import { Ink, Reveal, Scribble } from "./ink";
import { Counter, Magnetic, useParallax } from "./smooth";
import { Doodle } from "./doodle";
import {
  MarkArrow,
  MarkClose,
  MarkCross,
  MarkGithub,
  MarkLinkedin,
  MarkMail,
  MarkPaper,
  MarkRosette,
} from "./marks";

/* ---------------------------------------------------------------- act head */

export function ActHeader({
  act,
  title,
  note,
}: {
  act: string;
  title: React.ReactNode;
  note: string;
}) {
  return (
    <Reveal className="bl-act" as="header">
      <span className="bl-act-num" aria-hidden="true">
        {act}
      </span>
      <div className="bl-act-copy">
        <p className="bl-eyebrow">Act {act}</p>
        <h2>{title}</h2>
      </div>
      <i className="bl-act-rule" aria-hidden="true" />
      <span className="bl-hand" aria-hidden="true">
        <Scribble text={note} speed={46} />
      </span>
    </Reveal>
  );
}

/* -------------------------------------------------------------------- hero */

export function Hero() {
  // Anchored to the top of the page: the drift starts from rest on load
  // rather than picking up a tween that is already half finished.
  const plate = useParallax<HTMLDivElement>({
    y: -80,
    from: "top top",
    to: "bottom top",
  });
  const name = useParallax<HTMLDivElement>({
    y: 48,
    from: "top top",
    to: "bottom top",
  });

  return (
    <section className="bl-hero" id="top">
      <div className="bl-hero-copy">
        <Reveal delay={80}>
          <span className="bl-hero-stamp">
            <i aria-hidden="true" />
            Open to work · {profile.location}
          </span>
        </Reveal>

        <Reveal delay={160}>
          <div ref={name}>
            <h1 className="bl-hero-name">
              Dhruv
              <br />
              <em>Reddy.</em>
            </h1>
          </div>
        </Reveal>

        <Reveal delay={240}>
          <p className="bl-hero-role">
            Full-stack Engineer <i aria-hidden="true" /> Applied AI
          </p>
        </Reveal>

        <Reveal delay={320}>
          <p className="bl-hero-thesis">
            I build systems that{" "}
            <Ink type="underline" delay={1400} strokeWidth={2.5}>
              hold up after the demo
            </Ink>
            . Five internships, six platforms, two competitions won. All of it is
            logged below.
          </p>
        </Reveal>

        <Reveal delay={400}>
          <div className="bl-hero-cta">
            <Magnetic>
              <a className="bl-btn bl-btn-solid" href="#work">
                Read the case files <MarkArrow size={13} />
              </a>
            </Magnetic>
            <Magnetic>
              <a className="bl-btn" href={`mailto:${profile.email}`}>
                <MarkMail size={14} /> Get in touch
              </a>
            </Magnetic>
          </div>
        </Reveal>

        <Reveal delay={480}>
          <div className="bl-hero-counts">
            <div>
              <strong>
                <Counter value={`0${profile.totals.internships}`} />
              </strong>
              <span>Internships</span>
            </div>
            <div>
              <strong>
                <Counter value={`0${profile.totals.projects}`} />
              </strong>
              <span>Major builds</span>
            </div>
            <div>
              <strong>
                <Counter value={`0${profile.totals.awards}`} />
              </strong>
              <span>Wins &amp; leadership</span>
            </div>
            <div>
              <strong>
                <Counter value="9.34" />
              </strong>
              <span>CGPA at MVSR</span>
            </div>
          </div>
        </Reveal>
      </div>

      <div className="bl-plate" ref={plate}>
        <div className="bl-plate-frame">
          <Image
            src={profile.portrait}
            alt={`${profile.full}, full-stack engineer`}
            fill
            priority
            sizes="(max-width: 1000px) 60vw, 28rem"
          />
          <span className="bl-plate-wipe" aria-hidden="true" />
        </div>

        <span className="bl-plate-tape" data-corner="tl" aria-hidden="true" />
        <span className="bl-plate-tape" data-corner="br" aria-hidden="true" />

        <span className="bl-plate-tag" aria-hidden="true">
          Plate 01 · {profile.coords}
        </span>

        <div className="bl-plate-note" aria-hidden="true">
          <span className="bl-hand">
            <Scribble text="that's him" delay={2200} speed={70} />
          </span>
        </div>

      </div>

      <p className="bl-hero-scroll" aria-hidden="true">
        Scroll to begin
      </p>

      <Doodle kind="arrowDown" className="bl-doodle-hero" delay={900} />
    </section>
  );
}

/* --------------------------------------------------------------- the log */

function LogRow({ entry, index }: { entry: LogEntry; index: number }) {
  const [open, setOpen] = useState(index === 0);
  const headline = entry.mark ? entry.headline.split(entry.mark) : [entry.headline];

  return (
    <Reveal as="article" delay={index * 60}>
      <div
        className="bl-entry"
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
          <p className="bl-entry-headline">
            {headline[0]}
            {entry.mark && (
              <Ink type="underline" delay={240} strokeWidth={2}>
                {entry.mark}
              </Ink>
            )}
            {headline[1]}
          </p>
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
                <ul className="bl-work-list">
                  {entry.work.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="bl-entry-side">
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
                <p className="bl-keynote">{entry.highlight}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

export function LogSection() {
  return (
    <section className="bl-section" id="log">
      <ActHeader
        act="I"
        title={
          <>
            Where it{" "}
            <Ink type="circle" delay={400} padding={8} strokeWidth={2}>
              happened
            </Ink>
          </>
        }
        note="five rooms, five problems"
      />

      <Doodle kind="brace" className="bl-doodle-log" delay={200} />

      <div className="bl-log-list">
        {logEntries.map((entry, index) => (
          <LogRow key={entry.id} entry={entry} index={index} />
        ))}
      </div>

      <Doodle kind="arrowLoop" className="bl-doodle-edu" delay={120} alt />

      <Reveal className="bl-edu">
        {education.map((item) => (
          <div className="bl-edu-card" key={item.id}>
            <p className="bl-eyebrow">{item.period}</p>
            <h4>{item.school}</h4>
            <p>{item.degree}</p>
            <p>
              <strong>{item.detail}</strong>
            </p>
            {"certificates" in item && item.certificates && (
              <div className="bl-edu-certs">
                {item.certificates.map((cert) => (
                  <a key={cert.href} href={cert.href} target="_blank" rel="noreferrer">
                    <MarkPaper size={11} /> {cert.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </Reveal>
    </section>
  );
}

/* ------------------------------------------------------------------ wins */

export function WinsSection() {
  const [hero, ...rest] = awards;

  return (
    <section className="bl-section" id="wins">
      <ActHeader
        act="IV"
        title={
          <>
            What it{" "}
            <Ink type="circle" delay={400} padding={9} strokeWidth={2}>
              won
            </Ink>
          </>
        }
        note="and who it helped"
      />

      <Doodle kind="burst" className="bl-doodle-wins" delay={240} alt />

      <div className="bl-wins-grid">
        <article className="bl-win bl-win-hero">
          <div className="bl-win-inner">
            <span className="bl-win-kind">{hero.kind}</span>
            <h3 className="bl-win-title">{hero.title}</h3>
            <p className="bl-win-org">
              {hero.org} · {hero.place}
            </p>
            <p className="bl-win-headline">{hero.headline}</p>
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
              <div className="bl-win-shot-hud" aria-hidden="true">
                <span>Team / Error404</span>
                <span>Result / 01</span>
              </div>
            </div>
          )}
        </article>

        {rest.map((award) => (
          <article className="bl-win" key={award.id}>
            <span className="bl-win-kind">{award.kind}</span>
            <h3 className="bl-win-title">{award.title}</h3>
            <p className="bl-win-org">
              {award.org} · {award.year}
            </p>
            <p className="bl-win-headline">{award.headline}</p>
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
      <ActHeader
        act="V"
        title={
          <>
            What happens{" "}
            <Ink type="underline" delay={400} strokeWidth={3}>
              next
            </Ink>
          </>
        }
        note="your move"
      />

      <Reveal>
        <div className="bl-contact-huge-wrap">
          <p className="bl-contact-huge">
            Let&apos;s
            <br />
            <em>build.</em>
          </p>
          <Doodle kind="squiggle" className="bl-doodle-contact" delay={700} />
        </div>
      </Reveal>

      <Reveal delay={120}>
        <p className="bl-lede">
          Bring the hard problem. I will bring the architecture, the awkward
          questions, and an unreasonable number of browser tabs.
        </p>
      </Reveal>

      <Reveal delay={200}>
        <Magnetic strength={0.18}>
          <a className="bl-contact-mail" href={`mailto:${profile.email}`}>
            {profile.email} <MarkArrow size={18} />
          </a>
        </Magnetic>
      </Reveal>

      <Reveal delay={280}>
        <div className="bl-contact-links">
          <a className="bl-btn" href={profile.github} target="_blank" rel="noreferrer">
            <MarkGithub size={14} /> GitHub
          </a>
          <a className="bl-btn" href={profile.linkedin} target="_blank" rel="noreferrer">
            <MarkLinkedin size={14} /> LinkedIn
          </a>
          <a className="bl-btn" href={profile.studio} target="_blank" rel="noreferrer">
            ByUsForU <MarkArrow size={12} />
          </a>
          <a className="bl-btn" href={profile.resume} target="_blank" rel="noreferrer">
            <MarkPaper size={14} /> Résumé
          </a>
        </div>
      </Reveal>

      <Reveal delay={340}>
        <p className="bl-contact-note">
          <i aria-hidden="true" /> Open to internships, full-stack roles and freelance
          builds
          <Doodle kind="tick" className="bl-doodle-tick" delay={300} />
        </p>
      </Reveal>
    </section>
  );
}

export function BuildLogFooter({ time }: { time: string }) {
  return (
    <footer className="bl-footer">
      <span>{profile.coords}</span>
      <span>Hyderabad · {time}</span>
      <span>
        <a href="/colophon">Colophon &amp; privacy</a>
      </span>
      <span>Designed and engineered by Dhruv</span>
      <span>© {new Date().getFullYear()}, keep building</span>
    </footer>
  );
}

/* ---------------------------------------------------------- case modal */

export function CaseModal({
  file,
  onClose,
}: {
  file: CaseFile;
  onClose: () => void;
}) {
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
            Case file {file.index} · {file.domain}
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
            <p className="bl-eyebrow">{file.tagline}</p>
            <h3 className="bl-modal-title">{file.name}</h3>
            <p className="bl-modal-overview">{file.overview}</p>
          </div>

          {file.image && (
            <div className="bl-modal-art">
              <Image
                src={file.image}
                alt={`${file.name} visual`}
                fill
                sizes="(max-width: 1100px) 100vw, 64rem"
              />
            </div>
          )}

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
                <ul className="bl-work-list">
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="bl-divider" />

          <div>
            <p className="bl-eyebrow" style={{ marginBottom: "0.55rem" }}>
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

          {file.note && <p className="bl-keynote">{file.note}</p>}

          <div className="bl-contact-links">
            {file.link && (
              <a
                className="bl-btn bl-btn-solid"
                href={file.link.href}
                target="_blank"
                rel="noreferrer"
              >
                {file.link.label} <MarkArrow size={13} />
              </a>
            )}
            {file.status && <span className="bl-chip">{file.status}</span>}
          </div>
        </div>
      </article>
    </div>
  );
}
