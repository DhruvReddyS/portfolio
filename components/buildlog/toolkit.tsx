"use client";

import { Fragment, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SectionHeader } from "./sections";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type Group = "Interface" | "Server" | "Applied AI" | "Data" | "Delivery";

/**
 * The toolkit, set as a page from the back of the book.
 *
 * This was thirty-one vendor logos, each in its own brand colour, in its own
 * rounded pill. It is the single most copied block on the internet and the
 * fastest way to tell a reader that nobody chose anything: the palette comes
 * from the vendors, the shapes come from the icon library, and the page ends
 * up advertising thirty-one other companies.
 *
 * A toolkit is a list. So it is set as one, in the book's own type, under the
 * lamp, with the shelf in the margin and the names running on. The only thing
 * it now says about React is that he uses it, which is the only thing it was
 * ever saying.
 */

const shelves: Record<Group, string[]> = {
  Interface: [
    "React",
    "Next.js",
    "TypeScript",
    "JavaScript",
    "Vue.js",
    "Tailwind",
    "Framer Motion",
    "GSAP",
  ],
  Server: ["Node.js", "Express", "Python", "Flask", "FastAPI", "PHP"],
  "Applied AI": ["LangGraph", "Ollama", "Qdrant"],
  Data: [
    "PostgreSQL",
    "MongoDB",
    "Neo4j",
    "MySQL",
    "SQLite",
    "Redis",
    "Firebase",
  ],
  Delivery: [
    "Docker",
    "Cloudflare",
    "Vercel",
    "Render",
    "Cloudinary",
    "Git",
    "GitHub",
  ],
};

const GROUPS: Group[] = ["Interface", "Server", "Applied AI", "Data", "Delivery"];

const TOTAL = GROUPS.reduce((sum, group) => sum + shelves[group].length, 0);

export function ToolkitSection() {
  const sheet = useRef<HTMLDListElement>(null);

  useEffect(() => {
    const node = sheet.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const context = gsap.context(() => {
      // the shelves rule themselves in, one line at a time
      gsap.from(".bl-shelf", {
        y: 14,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: { trigger: node, start: "top 84%", once: true },
      });
    }, node);

    return () => context.revert();
  }, []);

  return (
    <section className="bl-section bl-tools" id="stack">
      <SectionHeader
        label="04 / Toolkit"
        title="Thirty-one things I build with"
        lead="No logos. Every name here has shipped inside something else on this page, which is the only endorsement any of them gets."
        note={`${TOTAL} entries · 5 shelves`}
      />

      <dl className="bl-tools-sheet" ref={sheet}>
        {GROUPS.map((group) => (
          <Fragment key={group}>
            <div className="bl-shelf">
              <dt>
                <span className="bl-shelf-name">{group}</span>
                <span className="bl-shelf-count">
                  {String(shelves[group].length).padStart(2, "0")}
                </span>
              </dt>
              <dd>
                {shelves[group].map((tool, index) => (
                  <Fragment key={tool}>
                    {index > 0 && <i aria-hidden="true">·</i>}
                    <span>{tool}</span>
                  </Fragment>
                ))}
              </dd>
            </div>
          </Fragment>
        ))}
      </dl>
    </section>
  );
}
