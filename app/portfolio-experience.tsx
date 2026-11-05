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
import { Cursor } from "@/components/buildlog/cursor";
import { Roller } from "@/components/buildlog/roller";
import { Statement } from "@/components/buildlog/statement";
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

function BuildLog() {
  const active = useActiveSection();
  // Everything that opens on arrival hangs off this one attribute.
  const held = useCurtainHeld();
  const time = useHyderabadTime();
  const [openCase, setOpenCase] = useState<CaseFile | null>(null);

  // The companion's mood map keys off "hero" rather than the "top" anchor id.
  const mood = active === "top" ? "hero" : active;

  return (
    <div className="bl-root" data-held={held ? "true" : undefined}>
      <a className="bl-skip" href="#log">
        Skip to the log
      </a>
      {/*
        The ground the cover is drawn on, in the markup from the first byte.
        <Cover /> renders nothing until it has mounted and read a font off
        the document, and for those few frames the hero was simply the page:
        his photograph, then the intro starting over the top of it.
      */}
      <div className="bl-preboot" aria-hidden="true" />
      <Cursor />
      <Cover />
      <div className="bl-grain-layer" aria-hidden="true" />

      <BuildLogNav active={active === "top" ? "" : active} />

      <main className="bl-main">
        <Hero time={time} />

        {/*
          Eight acts of evidence and nowhere he says what he thinks, which
          is the thing a reader actually decides on. Here, once, before any
          of it.
        */}
        <section className="bl-say" aria-label="What he is for">
          <p className="bl-say-kicker">A word before the log</p>
          <Statement>
            Anyone can make a thing work once. I am interested in the part where it keeps
            working.
          </Statement>
        </section>

        <LogSection />
        <WorkIndex onOpen={setOpenCase} />

        {/* the seam between what got built and where he learned to */}
        <Roller text="Shipped, not demoed" />

        <EducationSection />
        <ToolkitSection />
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
