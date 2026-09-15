"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { ArrowUpRight } from "lucide-react";
import "./typography-intro.css";

const lines = ["Hi, I’m Dhruv Reddy.", "I BUILD", "FULL-STACK", "PRODUCTS.", "Applied AI systems.", "And data experiences.", "Ready to take a look?"];
const offsets = lines.map((_, index) => lines.slice(0, index).join("").length);
const total = lines.join("").length;

export function TypographyIntro({ onEnter, entered }: { onEnter: () => void; entered: boolean }) {
  const [ready, setReady] = useState(false);
  const [typed, setTyped] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const started = useRef(false);
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
    return () => { clearTimeout(id); if (timer.current) clearTimeout(timer.current); };
  }, []);
  const enter = useCallback(() => {
    if (!ready || started.current || entered) return;
    started.current = true;
    setLeaving(true);
    timer.current = setTimeout(onEnter, window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 550);
  }, [ready, entered, onEnter]);
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Enter" && !entered && !event.repeat) { event.preventDefault(); enter(); }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [enter, entered]);
  const text = (index: number) => <span aria-hidden="true">{Array.from(lines[index]).map((char, position) => {
    const at = offsets[index] + position;
    return <span key={position} className={`typed-char ${at < typed ? "visible" : ""} ${at === typed - 1 && !ready ? "typing-caret" : ""}`}>{char}</span>;
  })}</span>;
  const complete = (index: number) => typed >= offsets[index] + lines[index].length;
  return <div className={`type-intro ${ready ? "is-ready" : ""} ${leaving ? "is-leaving" : ""}`}>
    <div className="type-intro-top"><span>DR<span className="type-dot">.</span></span><span>FULL-STACK × APPLIED AI</span></div>
    <div className="type-intro-copy">
      <p className={`type-intro-greeting ink-circle ${complete(0) ? "ink-drawn" : ""}`} aria-label={lines[0]}>{text(0)}<svg viewBox="0 0 300 65" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M280 16 C224 -4 56 0 15 23 C-22 55 122 67 245 48 C301 40 310 17 265 10" /></svg></p>
      <h1 aria-label="I build full-stack products, applied AI systems, and data experiences.">
        <span className="type-line"><span>{text(1)}</span></span>
        <span className="type-line"><span className={`ink-highlight ${complete(2) ? "ink-drawn" : ""}`}>{text(2)}</span></span>
        <span className="type-line"><span className={`ink-underline ${complete(3) ? "ink-drawn" : ""}`}>{text(3)}<svg viewBox="0 0 700 20" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M4 12 Q230 0 695 7 M55 18 Q320 7 640 13" /></svg></span></span>
      </h1>
      <p className="type-intro-sub" aria-label={`${lines[4]} ${lines[5]}`}><span className="typed-phrase">{text(4)}</span><span className="type-divider" /><span className="typed-phrase">{text(5)}</span></p>
    </div>
    <div className="type-intro-bottom"><p aria-label={lines[6]}>{text(6)}</p><button type="button" disabled={!ready || leaving || entered} onClick={enter}>Enter portfolio <ArrowUpRight size={22} /><kbd>↵</kbd></button></div>
  </div>;
}
