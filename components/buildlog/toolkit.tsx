"use client";

import {
  SiCloudflare, SiCloudinary, SiDocker, SiExpress, SiFastapi, SiFirebase,
  SiFlask, SiFramer, SiGit, SiGithub, SiGreensock, SiJavascript, SiLangchain,
  SiMongodb, SiMysql, SiNeo4J, SiNextdotjs, SiNodedotjs, SiOllama, SiPhp,
  SiPostgresql, SiPython, SiQdrant, SiReact, SiRedis, SiRender, SiSqlite,
  SiTailwindcss, SiTypescript, SiVercel, SiVuedotjs,
} from "react-icons/si";
import { FallingSkills, type FallingItem } from "@/components/ui/falling-skills";
import { Reveal } from "./reveal";
import { SectionHeader } from "./sections";

/**
 * The toolkit, as a heap you can pick things out of.
 *
 * This has been a wall of pills, then a typeset index, and the index was the
 * better page but it was also a lie about the thing it described: thirty-one
 * tools is not a tidy list of thirty-one equal rows, it is a pile that has
 * accumulated. So they fall in and land on each other, and you can pick any
 * one of them up and throw it at the others.
 *
 * The marks keep their makers' colours, every one of them, which is the one
 * place on this page that is true to its subject rather than to the palette:
 * these are other people's logos and pretending otherwise helps nobody. Three
 * of them used to come filled in this page's accent to mark them out, which
 * made them the only tools in the heap wearing a colour that was not theirs.
 * The chip around them is the page's own, and it is the same chip for all
 * thirty-one.
 */

type Shelf = "Interface" | "Server" | "Applied AI" | "Data" | "Delivery";

type Tool = FallingItem & { shelf: Shelf };

const tools: Tool[] = [
  { shelf: "Interface", name: "React", tone: "#61DAFB", icon: <SiReact /> },
  { shelf: "Interface", name: "Next.js", tone: "#F2EFE6", icon: <SiNextdotjs /> },
  { shelf: "Interface", name: "TypeScript", tone: "#3178C6", icon: <SiTypescript /> },
  { shelf: "Interface", name: "JavaScript", tone: "#D6B400", icon: <SiJavascript /> },
  { shelf: "Interface", name: "Vue.js", tone: "#42B883", icon: <SiVuedotjs /> },
  { shelf: "Interface", name: "Tailwind", tone: "#0891B2", icon: <SiTailwindcss /> },
  { shelf: "Interface", name: "Framer Motion", tone: "#E0247B", icon: <SiFramer /> },
  { shelf: "Interface", name: "GSAP", tone: "#5E8C00", icon: <SiGreensock /> },

  { shelf: "Server", name: "Node.js", tone: "#5FA04E", icon: <SiNodedotjs /> },
  { shelf: "Server", name: "Express", tone: "#F2EFE6", icon: <SiExpress /> },
  { shelf: "Server", name: "Python", tone: "#3776AB", icon: <SiPython /> },
  { shelf: "Server", name: "Flask", tone: "#F2EFE6", icon: <SiFlask /> },
  { shelf: "Server", name: "FastAPI", tone: "#009688", icon: <SiFastapi /> },
  { shelf: "Server", name: "PHP", tone: "#6B70A8", icon: <SiPhp /> },

  /* These three used to come filled in the page's accent, which made them
     the only tools here wearing somebody else's colour. Every mark now
     keeps its own, including the ones whose own is a flat black. */
  { shelf: "Applied AI", name: "LangGraph", tone: "#2F7A6A", icon: <SiLangchain /> },
  { shelf: "Applied AI", name: "Ollama", tone: "#F2EFE6", icon: <SiOllama /> },
  { shelf: "Applied AI", name: "Qdrant", tone: "#E0455F", icon: <SiQdrant /> },

  { shelf: "Data", name: "PostgreSQL", tone: "#4169E1", icon: <SiPostgresql /> },
  { shelf: "Data", name: "MongoDB", tone: "#47A248", icon: <SiMongodb /> },
  { shelf: "Data", name: "Neo4j", tone: "#4581C3", icon: <SiNeo4J /> },
  { shelf: "Data", name: "MySQL", tone: "#2C6A91", icon: <SiMysql /> },
  { shelf: "Data", name: "SQLite", tone: "#2F7FB8", icon: <SiSqlite /> },
  { shelf: "Data", name: "Redis", tone: "#D93A2E", icon: <SiRedis /> },
  { shelf: "Data", name: "Firebase", tone: "#C9971F", icon: <SiFirebase /> },

  { shelf: "Delivery", name: "Docker", tone: "#2496ED", icon: <SiDocker /> },
  { shelf: "Delivery", name: "Cloudflare", tone: "#E07B20", icon: <SiCloudflare /> },
  { shelf: "Delivery", name: "Vercel", tone: "#F2EFE6", icon: <SiVercel /> },
  { shelf: "Delivery", name: "Render", tone: "#1C9C8A", icon: <SiRender /> },
  { shelf: "Delivery", name: "Cloudinary", tone: "#3448C5", icon: <SiCloudinary /> },
  { shelf: "Delivery", name: "Git", tone: "#F05032", icon: <SiGit /> },
  { shelf: "Delivery", name: "GitHub", tone: "#F2EFE6", icon: <SiGithub /> },
];

const SHELVES: Shelf[] = ["Interface", "Server", "Applied AI", "Data", "Delivery"];

const count = (shelf: Shelf) => tools.filter((tool) => tool.shelf === shelf).length;

export function ToolkitSection() {
  return (
    <section className="bl-section bl-tools" id="stack">
      <SectionHeader
        label="04 / Toolkit"
        title="Thirty-one things I build with"
        lead="Every one of them has shipped inside something else on this page, which is the only endorsement any of them gets."
        note={`${tools.length} entries · ${SHELVES.length} shelves`}
      />

      <Reveal>
        <p className="bl-pile-cue">
          <span>Mind your head.</span>
          <i aria-hidden="true" />
          <em>Pick one up and throw it at the others.</em>
        </p>
      </Reveal>

      <FallingSkills items={tools} label="Thirty-one tools, in a heap" />

      {/* the key to the heap, which is the one thing a heap cannot tell you */}
      <dl className="bl-shelf-key">
        {SHELVES.map((shelf) => (
          <div key={shelf}>
            <dt>{shelf}</dt>
            <dd>{String(count(shelf)).padStart(2, "0")}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
