"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import "./typography-intro.css";

const lines = ["Hi, I’m Dhruv Reddy.", "I BUILD", "FULL-STACK", "PRODUCTS.", "Applied AI systems.", "And data experiences.", "Scroll. There’s a story here."];
const offsets = lines.map((_, index) => lines.slice(0, index).join("").length);
const total = lines.join("").length;

export function TypographyIntro() {
  const [ready, setReady] = useState(false);
  const [typed, setTyped] = useState(0);
  useEffect(() => {
    let id: ReturnType<typeof setTimeout>;
    let count = 0;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tick = () => {
      count = reduced ? total : count + 1;
      setTyped(count);
      if (count === total) { id = setTimeout(() => setReady(true), reduced ? 0 : 650); return; }
      const char = lines.join("")[count - 1];
      const pause = offsets.includes(count) ? 300 : /[.,?]/.test(char) ? 160 : char === " " ? 65 : 22 + (count * 17 % 35);
      id = setTimeout(tick, pause);
    };
    id = setTimeout(tick, reduced ? 0 : 350);
    return () => clearTimeout(id);
  }, []);
  const text = (index: number) => <span aria-hidden="true">{Array.from(lines[index]).map((char, position) => {
    const at = offsets[index] + position;
    return <span key={position} className={`typed-char ${at < typed ? "visible" : ""} ${at === typed - 1 && !ready ? "typing-caret" : ""}`}>{char}</span>;
  })}</span>;
  const complete = (index: number) => typed >= offsets[index] + lines[index].length;
  return <div className={`type-intro ${ready ? "is-ready" : ""}`}>
    <div className="type-intro-top"><span>DR<span className="type-dot">.</span></span><span>FULL-STACK × APPLIED AI</span></div>
    <div className="intro-personal-layout"><div className="type-intro-copy">
      <p className={`type-intro-greeting ink-circle ${complete(0) ? "ink-drawn" : ""}`} aria-label={lines[0]}>{text(0)}<svg viewBox="0 0 300 65" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M280 16 C224 -4 56 0 15 23 C-22 55 122 67 245 48 C301 40 310 17 265 10" /></svg></p>
      <h1 aria-label="I build full-stack products, applied AI systems, and data experiences.">
        <span className="type-line"><span>{text(1)}</span></span>
        <span className="type-line"><span className={`ink-highlight ${complete(2) ? "ink-drawn" : ""}`}>{text(2)}</span></span>
        <span className="type-line"><span className={`ink-underline ${complete(3) ? "ink-drawn" : ""}`}>{text(3)}<svg viewBox="0 0 700 20" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M4 12 Q230 0 695 7 M55 18 Q320 7 640 13" /></svg></span></span>
      </h1>
      <p className="type-intro-sub" aria-label={`${lines[4]} ${lines[5]}`}><span className="typed-phrase">{text(4)}</span><span className="type-divider" /><span className="typed-phrase">{text(5)}</span></p>
    </div><figure className="intro-portrait"><Image src="/assets/dhruv-hero.png" alt="Illustrated portrait of Dhruv Reddy" fill sizes="(max-width: 760px) 85vw, 36vw" priority /><figcaption>HYDERABAD, INDIA <span>ENGINEER / FOUNDER</span></figcaption></figure></div>
    <div className="intro-biography"><p>I connect the interface to the intelligence behind it. Full-stack applications, useful AI, and data systems that solve real problems.</p><div><span>MY FREELANCE CHAPTER</span><h2>Built independently.<br />Made for real people.</h2><p>I founded <a href="https://freelance.byus4u.in/" target="_blank" rel="noreferrer">ByUsForU ↗</a> to take client ideas from a rough brief to a working product—design, engineering, deployment, and everything in between.</p></div></div>
    <div className="type-intro-bottom"><p aria-label={lines[6]}>{text(6)}</p><a className="intro-explore" href="#projects">Explore my work <ArrowUpRight size={22} /></a><a href="/assets/dhruv-reddy-resume.pdf" target="_blank" rel="noreferrer">Read my résumé ↗</a></div>
  </div>;
}
