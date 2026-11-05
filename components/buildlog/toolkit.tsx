"use client";

import {
  SiClaude, SiCloudflare, SiCloudinary, SiCursor, SiDocker, SiExpress,
  SiFastapi, SiFirebase, SiFlask, SiFramer, SiGit, SiGithub, SiGooglegemini,
  SiGreensock, SiHuggingface, SiJavascript, SiLangchain, SiMongodb, SiMysql,
  SiNeo4J, SiNextdotjs, SiNodedotjs, SiOllama, SiPhp, SiPostgresql, SiPython,
  SiPythonanywhere, SiQdrant, SiRailway, SiReact, SiRedis, SiRender, SiSqlite,
  SiTailwindcss, SiTypescript, SiVercel, SiVuedotjs,
} from "react-icons/si";
import { FallingSkills, type FallingItem } from "@/components/ui/falling-skills";
import { Reveal } from "./reveal";
import { SectionHeader } from "./sections";

/**
 * The toolkit, as a heap you can pick things out of.
 *
 * This has been a wall of pills, then a typeset index, and the index was the
 * better page but it was also a lie about the thing it described: a toolkit
 * is not a tidy list of equal rows, it is a pile that has accumulated. So
 * they fall in and land on each other, and you can pick any one of them up
 * and throw it at the others.
 *
 * The marks keep their makers' colours, every one of them, which is the one
 * place on this page that is true to its subject rather than to the palette:
 * these are other people's logos and pretending otherwise helps nobody.
 *
 * Nothing here is counted any more. A heading that opens with a number turns
 * a toolkit into a score, and the honest answer to how many tools somebody
 * uses changes the week after you publish it.
 */

/* ----------------------------------------------------------------------
   Four of the newer tools have no mark in the icon set, so they get one
   drawn here. Deliberately not imitations of their logos: a wrong logo is
   worse than an honest glyph, and these say what the thing does.
   ---------------------------------------------------------------------- */

function Glyph({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9}
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}

/** A prompt, for the one that lives in a terminal. */
const GlyphCodex = (
  <Glyph>
    <path d="M4.5 4.2h15c.7 0 1.3.6 1.3 1.3v13c0 .7-.6 1.3-1.3 1.3h-15c-.7 0-1.3-.6-1.3-1.3v-13c0-.7.6-1.3 1.3-1.3z" />
    <path d="M7.2 9.6 10 12l-2.8 2.4" />
    <path d="M12.6 15h4.2" />
  </Glyph>
);

/** A heart, for the one named after liking what comes out. */
const GlyphLovable = (
  <Glyph>
    <path d="M12 20.3c-3.1-2-8-5.3-8-9.6 0-2.6 2-4.5 4.4-4.5 1.5 0 2.8.8 3.6 2 .8-1.2 2.1-2 3.6-2 2.4 0 4.4 1.9 4.4 4.5 0 4.3-4.9 7.6-8 9.6z" />
  </Glyph>
);

/** Rings going out from a point, for the one named after what that is. */
const GlyphEmergent = (
  <Glyph>
    <path d="M12 11v.1" strokeWidth={3} />
    <path d="M8.3 14.8a5.3 5.3 0 0 1 0-7.5M15.7 7.3a5.3 5.3 0 0 1 0 7.5" />
    <path d="M5.4 17.8a9.4 9.4 0 0 1 0-13.3M18.6 4.5a9.4 9.4 0 0 1 0 13.3" />
  </Glyph>
);

/** Something leaving the floor, for the one named after not having one. */
const GlyphAntigravity = (
  <Glyph>
    <path d="M12 14.6V3.9" />
    <path d="M8.4 7.3 12 3.7l3.6 3.6" />
    <path d="M4.3 19.5h15.4" />
    <path d="M7.6 16.4h2M14.4 16.4h2" />
  </Glyph>
);

/** Documents going into an answer, for retrieval. */
const GlyphRag = (
  <Glyph>
    <path d="M4.2 5.4h6.1v6.1H4.2zM4.2 13.6h6.1v5H4.2z" />
    <path d="M13.2 12h3.1" />
    <path d="M14.9 10.3 16.8 12l-1.9 1.7" />
    <path d="M19.8 8.2a5.4 5.4 0 0 1 0 7.6" />
  </Glyph>
);

type Shelf =
  | "Interface"
  | "Server"
  | "Applied AI"
  | "Assistants"
  | "Data"
  | "Delivery";

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

  { shelf: "Applied AI", name: "LangGraph", tone: "#2F7A6A", icon: <SiLangchain /> },
  { shelf: "Applied AI", name: "RAG", tone: "#C77C3C", icon: GlyphRag },
  { shelf: "Applied AI", name: "Hugging Face", tone: "#E0A52C", icon: <SiHuggingface /> },
  { shelf: "Applied AI", name: "Ollama", tone: "#F2EFE6", icon: <SiOllama /> },
  { shelf: "Applied AI", name: "Qdrant", tone: "#E0455F", icon: <SiQdrant /> },

  /* The ones that sit beside him while he works. They are tools he uses
     the way the rest of this shelf is, and leaving them off a 2026 toolkit
     to look pure about it would be the only dishonest thing on the page. */
  { shelf: "Assistants", name: "Claude", tone: "#D97757", icon: <SiClaude /> },
  { shelf: "Assistants", name: "Codex", tone: "#F2EFE6", icon: GlyphCodex },
  { shelf: "Assistants", name: "Cursor", tone: "#C3C3C3", icon: <SiCursor /> },
  { shelf: "Assistants", name: "Gemini", tone: "#4588E8", icon: <SiGooglegemini /> },
  { shelf: "Assistants", name: "Antigravity", tone: "#8C7BE0", icon: GlyphAntigravity },
  { shelf: "Assistants", name: "Lovable", tone: "#E05A8C", icon: GlyphLovable },
  { shelf: "Assistants", name: "Emergent", tone: "#3FA9A0", icon: GlyphEmergent },

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
  { shelf: "Delivery", name: "Railway", tone: "#A98BE8", icon: <SiRailway /> },
  { shelf: "Delivery", name: "Render", tone: "#1C9C8A", icon: <SiRender /> },
  { shelf: "Delivery", name: "PythonAnywhere", tone: "#4BA6D4", icon: <SiPythonanywhere /> },
  { shelf: "Delivery", name: "Cloudinary", tone: "#3448C5", icon: <SiCloudinary /> },
  { shelf: "Delivery", name: "Git", tone: "#F05032", icon: <SiGit /> },
  { shelf: "Delivery", name: "GitHub", tone: "#F2EFE6", icon: <SiGithub /> },
];

/**
 * The key to the heap, which is the one thing a heap cannot tell you.
 *
 * It used to print a count against each shelf, which was the same number
 * three different ways: the heading counted, the note counted, and then
 * the key counted again. What a key is for is saying what a group is,
 * so each one now says what its half of the work does.
 */
const SHELVES: Array<[Shelf, string]> = [
  ["Interface", "what you look at"],
  ["Server", "what answers it"],
  ["Applied AI", "what reasons over it"],
  ["Assistants", "what sits beside me"],
  ["Data", "what remembers"],
  ["Delivery", "what gets it live"],
];

export function ToolkitSection() {
  return (
    <section className="bl-section bl-tools" id="stack">
      <SectionHeader
        label="04 / Toolkit"
        title="Everything on the bench"
        lead="Every one of them has shipped inside something else on this page, which is the only endorsement any of them gets."
        note="Heavier than it looks"
      />

      <Reveal>
        <p className="bl-pile-cue">
          <span>Mind your head.</span>
          <i aria-hidden="true" />
          <em>Pick one up and throw it at the others.</em>
        </p>
      </Reveal>

      <FallingSkills items={tools} label="The whole toolkit, in a heap" />

      <dl className="bl-shelf-key">
        {SHELVES.map(([shelf, gloss]) => (
          <div key={shelf}>
            <dt>{shelf}</dt>
            <dd>{gloss}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
