"use client";

import { useEffect, useState } from "react";
import { LampProvider } from "@/components/buildlog/lamp";
import { BuildLogNav } from "@/components/buildlog/nav";
import { MarginRail } from "@/components/buildlog/rail";
import { GrokCompanion } from "@/components/buildlog/grok";
import { StackSection } from "@/components/buildlog/stack";
import { FilmStrip } from "@/components/buildlog/film";
import { Cursor, SmoothScroll } from "@/components/buildlog/smooth";
import { Overture } from "@/components/buildlog/overture";
import {
  BuildLogFooter,
  CaseModal,
  ContactSection,
  Hero,
  LogSection,
  WinsSection,
} from "@/components/buildlog/sections";
import type { CaseFile } from "@/lib/portfolio-data";

const WATCHED = ["top", "log", "work", "stack", "wins", "contact"];

function useActiveSection() {
  const [active, setActive] = useState("top");

  useEffect(() => {
    let frame = 0;

    const measure = () => {
      frame = 0;
      // whichever act is crossing the reading line owns the page right now
      const line = window.innerHeight * 0.42;
      let current = "top";

      for (const id of WATCHED) {
        const node = document.getElementById(id);
        if (!node) continue;
        const box = node.getBoundingClientRect();
        if (box.top <= line && box.bottom > line) current = id;
      }

      setActive(current);
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return active;
}

function useHyderabadTime() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () =>
      setTime(
        new Intl.DateTimeFormat("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          timeZone: "Asia/Kolkata",
        }).format(new Date()),
      );

    tick();
    const interval = window.setInterval(tick, 30000);
    return () => window.clearInterval(interval);
  }, []);

  return time;
}

function BuildLog() {
  const active = useActiveSection();
  const time = useHyderabadTime();
  const [openCase, setOpenCase] = useState<CaseFile | null>(null);

  // The companion's mood map keys off "hero" rather than the "top" anchor id.
  const mood = active === "top" ? "hero" : active;

  return (
    <div className="bl-root">
      <Overture />
      <Cursor />
      <div className="bl-paper" aria-hidden="true" />
      <div className="bl-margin-rule" aria-hidden="true" />
      <div className="bl-grain-layer" aria-hidden="true" />

      <BuildLogNav active={active === "top" ? "" : active} />
      <MarginRail active={active} />

      <main className="bl-main">
        <Hero />
        <LogSection />
        <FilmStrip onOpen={setOpenCase} />
        <StackSection />
        <WinsSection />
        <ContactSection />
      </main>

      <BuildLogFooter time={time} />

      <GrokCompanion section={mood} />

      {openCase && (
        <CaseModal file={openCase} onClose={() => setOpenCase(null)} />
      )}
    </div>
  );
}

export default function PortfolioExperience() {
  return (
    <LampProvider>
      <SmoothScroll>
        <BuildLog />
      </SmoothScroll>
    </LampProvider>
  );
}
