"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { ArrowUpRight } from "lucide-react";
import "./typography-intro.css";

export function TypographyIntro({ onEnter, entered }: { onEnter: () => void; entered: boolean }) {
  const [ready, setReady] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const started = useRef(false);
  useEffect(() => {
    const delay = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 1800;
    const id = setTimeout(() => setReady(true), delay);
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
  return <div className={`type-intro ${ready ? "is-ready" : ""} ${leaving ? "is-leaving" : ""}`}>
    <div className="type-intro-top"><span>DR<span className="type-dot">.</span></span><span>FULL-STACK × APPLIED AI</span></div>
    <div className="type-intro-copy">
      <p className="type-intro-greeting">Hi, I’m Dhruv Reddy.</p>
      <h1 aria-label="I build full-stack products, applied AI systems, and data experiences.">
        <span className="type-line"><span>I BUILD</span></span>
        <span className="type-line"><span>FULL-STACK</span></span>
        <span className="type-line"><span>PRODUCTS<span className="type-dot">.</span></span></span>
      </h1>
      <p className="type-intro-sub">Applied AI systems.<span />And data experiences.</p>
    </div>
    <div className="type-intro-bottom"><p>Ready to take a look?</p><button type="button" disabled={!ready || leaving || entered} onClick={enter}>Enter portfolio <ArrowUpRight size={22} /><kbd>↵</kbd></button></div>
  </div>;
}
