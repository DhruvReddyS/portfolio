"use client";

import { useState } from "react";
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
import { Ink, Reveal } from "./ink";
import { ActHeader } from "./sections";

type Group = "Interface" | "Server" | "Applied AI" | "Data" | "Delivery";

const GROUPS: Group[] = ["Interface", "Server", "Applied AI", "Data", "Delivery"];

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

export function ToolkitSection() {
  const [group, setGroup] = useState<Group | null>(null);

  return (
    <section className="bl-section bl-toolkit" id="stack">
      <ActHeader
        act="IV"
        title={
          <>
            Thirty-one things I{" "}
            <Ink type="box" delay={400} padding={7} strokeWidth={2}>
              build with
            </Ink>
          </>
        }
        note="pick a shelf"
      />

      <Reveal className="bl-toolkit-filters">
        <button
          type="button"
          className="bl-toolkit-filter"
          data-active={group === null}
          onClick={() => setGroup(null)}
        >
          Everything
          <small>{tools.length}</small>
        </button>
        {GROUPS.map((name) => (
          <button
            key={name}
            type="button"
            className="bl-toolkit-filter"
            data-active={group === name}
            onClick={() => setGroup(group === name ? null : name)}
          >
            {name}
            <small>{tools.filter((tool) => tool.group === name).length}</small>
          </button>
        ))}
      </Reveal>

      <div className="bl-toolkit-wall">
        {tools.map((tool, index) => {
          const dim = group !== null && tool.group !== group;

          return (
            <div
              key={tool.name}
              className="bl-tool"
              data-dim={dim}
              style={
                {
                  "--tool": tool.color,
                  "--tool-delay": `${(index % 12) * 60}ms`,
                } as React.CSSProperties
              }
            >
              <span className="bl-tool-icon">{tool.icon}</span>
              <strong>{tool.name}</strong>
              <em>{tool.group}</em>
            </div>
          );
        })}
      </div>
    </section>
  );
}
