"use client";

import { StaggeredGrid } from "@/components/ui/staggered-grid";
import { Ink } from "./ink";
import { ActHeader } from "./sections";

/** Everything below has shipped in something real. */
const toolkit = [
  ["React", "Next.js", "TypeScript", "JavaScript", "Vue.js", "Tailwind CSS", "Framer Motion", "GSAP"],
  ["Node.js", "Express", "Python", "Flask", "FastAPI", "PHP", "LangGraph", "Ollama", "Qwen3"],
  ["PostgreSQL", "MongoDB", "MySQL", "SQLite", "Redis", "Qdrant", "Neo4j", "pgvector", "Firebase"],
  ["Docker", "Cloudflare", "Vercel", "Render", "DreamHost", "Git", "GitHub", "Cloudinary"],
];

function Marquee({
  items,
  reverse = false,
  seconds,
}: {
  items: string[];
  reverse?: boolean;
  seconds: number;
}) {
  return (
    <div className="bl-marquee" data-reverse={reverse}>
      <div className="bl-marquee-run" style={{ animationDuration: `${seconds}s` }}>
        {[0, 1].map((copy) => (
          <span className="bl-marquee-set" key={copy} aria-hidden={copy === 1}>
            {items.map((item) => (
              <span className="bl-marquee-item" key={item}>
                {item}
                <i aria-hidden="true" />
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}

export function StackSection() {
  return (
    <section className="bl-section bl-stack" id="stack">
      <ActHeader
        act="III"
        title={
          <>
            What it&apos;s{" "}
            <Ink type="box" delay={400} padding={7} strokeWidth={2}>
              built with
            </Ink>
          </>
        }
        note="no filler, all used"
      />

      <StaggeredGrid
        className="bl-stack-grid"
        images={[
          "/assets/healthcare-3d.png",
          "/assets/rag-3d.png",
          "/assets/ml-groundwater-3d.png",
          "/assets/data-dynamo-win.png",
          "/assets/byusforu-logo.png",
        ]}
        bentoItems={[]}
        centerText="THE STACK"
        showFooter={false}
      />

      <div className="bl-marquees" aria-label="Technology toolkit">
        {toolkit.map((row, index) => (
          <Marquee
            key={index}
            items={row}
            reverse={index % 2 === 1}
            seconds={42 + index * 7}
          />
        ))}
      </div>
    </section>
  );
}
