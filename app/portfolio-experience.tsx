"use client";

import { useEffect, useState } from "react";
import { BuildLogNav } from "@/components/buildlog/nav";
import { GrokCompanion } from "@/components/buildlog/grok";
import { ToolkitSection } from "@/components/buildlog/toolkit";
import { EducationSection } from "@/components/buildlog/education";
import { StudioSection } from "@/components/buildlog/studio";
import { WorkIndex } from "@/components/buildlog/work-index";
import { SmoothScroll } from "@/components/buildlog/smooth";
import { Cover } from "@/components/buildlog/cover";
import { useCurtainHeld } from "@/lib/curtain";
import {
  BuildLogFooter,
  CaseModal,
  ContactSection,
  Hero,
  LogSection,
  WinsSection,
} from "@/components/buildlog/sections";
import type { CaseFile } from "@/lib/portfolio-data";

const WATCHED = [
  "top",
  "log",
  "work",
  "education",
  "stack",
  "wins",
  "studio",
  "contact",
];

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

/** The acts that run with the lamp on. */
const LIT = new Set(["education", "stack"]);

function BuildLog() {
  const active = useActiveSection();
  // Everything that opens on arrival hangs off this one attribute.
  const held = useCurtainHeld();
  const time = useHyderabadTime();
  const [openCase, setOpenCase] = useState<CaseFile | null>(null);

  // The companion's mood map keys off "hero" rather than the "top" anchor id.
  const mood = active === "top" ? "hero" : active;

  // The nav is fixed over whichever act is being read, so it has to know
  // which side of the page that act is on.
  useEffect(() => {
    document.documentElement.dataset.over = LIT.has(active) ? "paper" : "dark";
  }, [active]);

  return (
    <div className="bl-root" data-held={held ? "true" : undefined}>
      <a className="bl-skip" href="#log">
        Skip to the log
      </a>
      <Cover />
      <div className="bl-grain-layer" aria-hidden="true" />

      <BuildLogNav active={active === "top" ? "" : active} />

      <main className="bl-main">
        <Hero time={time} />
        <LogSection />
        <WorkIndex onOpen={setOpenCase} />

        {/* The lamp comes on. Study and the toolkit run together as one lit
            sheet laid on the dark, so the page cuts into the light once and
            back out of it once rather than flickering act by act. */}
        <div className="bl-leaf" data-light="paper">
          <EducationSection />
          <ToolkitSection />
        </div>

        <WinsSection />
        <StudioSection />
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
    <SmoothScroll>
      <BuildLog />
    </SmoothScroll>
  );
}
