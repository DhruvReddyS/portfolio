"use client";

import { Fragment, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  SiCloudflare,
  SiCloudinary,
  SiDocker,
  SiExpress,
  SiFastapi,
  SiFirebase,
  SiFlask,
  SiFramer,
  SiGit,
  SiGithub,
  SiGreensock,
  SiJavascript,
  SiLangchain,
  SiMongodb,
  SiMysql,
  SiNeo4J,
  SiNextdotjs,
  SiNodedotjs,
  SiOllama,
  SiPhp,
  SiPostgresql,
  SiPython,
  SiQdrant,
  SiReact,
  SiRedis,
  SiRender,
  SiSqlite,
  SiTailwindcss,
  SiTypescript,
  SiVercel,
  SiVuedotjs,
} from "react-icons/si";
import { SectionHeader } from "./sections";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type Group = "Interface" | "Server" | "Applied AI" | "Data" | "Delivery";

type Tool = {
  name: string;
  group: Group;
  color: string;
  icon: React.ReactNode;
};

/** Every one of these has shipped in something on this page. */
const tools: Tool[] = [
  { name: "React", group: "Interface", color: "#61DAFB", icon: <SiReact /> },
  { name: "Next.js", group: "Interface", color: "var(--bl-ink)", icon: <SiNextdotjs /> },
  { name: "TypeScript", group: "Interface", color: "#3178C6", icon: <SiTypescript /> },
  { name: "JavaScript", group: "Interface", color: "#F7DF1E", icon: <SiJavascript /> },
  { name: "Vue.js", group: "Interface", color: "#42B883", icon: <SiVuedotjs /> },
  { name: "Tailwind", group: "Interface", color: "#06B6D4", icon: <SiTailwindcss /> },
  { name: "Framer Motion", group: "Interface", color: "#FF5C9A", icon: <SiFramer /> },
  { name: "GSAP", group: "Interface", color: "#8FD000", icon: <SiGreensock /> },

  { name: "Node.js", group: "Server", color: "#5FA04E", icon: <SiNodedotjs /> },
  { name: "Express", group: "Server", color: "var(--bl-ink)", icon: <SiExpress /> },
  { name: "Python", group: "Server", color: "#3776AB", icon: <SiPython /> },
  { name: "Flask", group: "Server", color: "var(--bl-ink)", icon: <SiFlask /> },
  { name: "FastAPI", group: "Server", color: "#009688", icon: <SiFastapi /> },
  { name: "PHP", group: "Server", color: "#777BB4", icon: <SiPhp /> },

  { name: "LangGraph", group: "Applied AI", color: "#1C9C7C", icon: <SiLangchain /> },
  { name: "Ollama", group: "Applied AI", color: "var(--bl-ink)", icon: <SiOllama /> },
  { name: "Qdrant", group: "Applied AI", color: "#DC244C", icon: <SiQdrant /> },

  { name: "PostgreSQL", group: "Data", color: "#4169E1", icon: <SiPostgresql /> },
  { name: "MongoDB", group: "Data", color: "#47A248", icon: <SiMongodb /> },
  { name: "Neo4j", group: "Data", color: "#4581C3", icon: <SiNeo4J /> },
  { name: "MySQL", group: "Data", color: "#4479A1", icon: <SiMysql /> },
  { name: "SQLite", group: "Data", color: "#5AA9E6", icon: <SiSqlite /> },
  { name: "Redis", group: "Data", color: "#FF4438", icon: <SiRedis /> },
  { name: "Firebase", group: "Data", color: "#FFCA28", icon: <SiFirebase /> },

  { name: "Docker", group: "Delivery", color: "#2496ED", icon: <SiDocker /> },
  { name: "Cloudflare", group: "Delivery", color: "#F38020", icon: <SiCloudflare /> },
  { name: "Vercel", group: "Delivery", color: "var(--bl-ink)", icon: <SiVercel /> },
  { name: "Render", group: "Delivery", color: "#46E3B7", icon: <SiRender /> },
  { name: "Cloudinary", group: "Delivery", color: "#3448C5", icon: <SiCloudinary /> },
  { name: "Git", group: "Delivery", color: "#F05032", icon: <SiGit /> },
  { name: "GitHub", group: "Delivery", color: "var(--bl-ink)", icon: <SiGithub /> },
];

const GROUPS: Group[] = ["Interface", "Server", "Applied AI", "Data", "Delivery"];

/**
 * The toolkit, as the key to a map.
 *
 * This is the layout the project had before the rebuild: brand-coloured marks
 * on pills, wrapped and centred, with a strip of category labels ruled
 * underneath. It beats both the watch face and the web for one reason:
 * thirty-one tools is a legend, not a diagram, and a legend should be
 * scannable in one pass rather than explored.
 */
export function ToolkitSection() {
  const key = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = key.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const context = gsap.context(() => {
      gsap.from(".bl-key > div", {
        y: 18,
        opacity: 0,
        scale: 0.94,
        duration: 0.55,
        ease: "power3.out",
        stagger: { each: 0.028, from: "start" },
        scrollTrigger: { trigger: node, start: "top 82%", once: true },
      });

      gsap.from(".bl-key-strip i", {
        scaleX: 0,
        transformOrigin: "left",
        duration: 0.9,
        ease: "power2.out",
        stagger: 0.09,
        scrollTrigger: { trigger: ".bl-key-strip", start: "top 90%", once: true },
      });
    }, node);

    return () => context.revert();
  }, []);

  return (
    <section className="bl-section bl-toolkit" id="stack">
      <SectionHeader
        label="04 / Toolkit"
        title="Thirty-one things I build with"
        lead="Correct tools, correct colours, zero filler. Every one has shipped in something on this page."
      />

      <div className="bl-key" ref={key} aria-label="Technology toolkit">
        {tools.map((tool) => (
          <div key={tool.name} style={{ "--tool": tool.color } as React.CSSProperties}>
            <span aria-hidden="true">{tool.icon}</span>
            <strong>{tool.name}</strong>
          </div>
        ))}
      </div>

      <div className="bl-key-strip" aria-hidden="true">
        {GROUPS.map((group, index) => (
          <Fragment key={group}>
            <span>{group}</span>
            {index < GROUPS.length - 1 && <i />}
          </Fragment>
        ))}
      </div>
    </section>
  );
}