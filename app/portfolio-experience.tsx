"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Award,
  BrainCircuit,
  Check,
  Code2,
  Database,
  Download,
  FileCheck2,
  Globe2,
  GraduationCap,
  Layers3,
  Mail,
  Map,
  Orbit,
  ScanSearch,
  Sparkles,
  Trophy,
  Workflow,
  X,
  Zap,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  SiCss,
  SiFirebase,
  SiFlask,
  SiGit,
  SiGithub,
  SiHtml5,
  SiJavascript,
  SiLeetcode,
  SiMongodb,
  SiMysql,
  SiNodedotjs,
  SiPython,
  SiReact,
  SiRedis,
  SiSqlite,
  SiTailwindcss,
  SiTypescript,
  SiVuedotjs,
} from "react-icons/si";
import { FaLinkedinIn } from "react-icons/fa";
import { TypingKeyboard } from "@/components/ui/typing-keyboard";
import { NotchNavbar } from "@/components/ui/notch-navbar";
import { StaggeredGrid } from "@/components/ui/staggered-grid";
import { PerspectiveGrid } from "@/components/ui/perspective-grid";
import { CreepyButton } from "@/components/ui/creepy-button";
import { AnimatedFooter } from "@/components/ui/animated-footer";
import { PortfolioPet } from "@/components/portfolio-pet";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    number: "01",
    name: "CodeSync",
    eyebrow: "Competitive programming intelligence",
    description:
      "A unified intelligence layer across coding platforms and GitHub—contest tracking, peer benchmarking, AI guidance, code workflows, and career signals in one system.",
    impact: "200+ learners",
    tech: ["React", "Node.js", "Firebase", "MongoDB"],
    image: "/assets/data-dynamo-win.png",
    color: "#bdf73c",
    link: "https://codesync.byus4u.in/",
  },
  {
    number: "02",
    name: "Healthcare OS",
    eyebrow: "Multi-role care operations",
    description:
      "A complete clinic operating system for patients, doctors, and admins with appointments, treatment records, secure workflows, background jobs, caching, and reporting.",
    impact: "40% faster response",
    tech: ["Flask", "Vue", "Redis", "Celery"],
    image: "/assets/healthcare-3d.png",
    color: "#f7b955",
    link: "https://hms.byus4u.in/",
  },
  {
    number: "03",
    name: "QuizMaster",
    eyebrow: "Adaptive learning platform",
    description:
      "A focused evaluation environment with question-bank operations, timed attempts, performance analytics, and role-based content administration.",
    impact: "Learning, measured",
    tech: ["Python", "Flask", "SQLite", "Jinja"],
    image: "/assets/healthcare-3d.png",
    color: "#d7ff7b",
  },
  {
    number: "04",
    name: "Legal RAG",
    eyebrow: "Cited legal intelligence",
    description:
      "Retrieval-augmented legal research that grounds every answer in source documents, surfaces clauses, preserves context, and keeps conclusions traceable.",
    impact: "Answers with evidence",
    tech: ["Python", "LLMs", "Embeddings", "RAG"],
    image: "/assets/rag-3d.png",
    color: "#bdf73c",
  },
  {
    number: "05",
    name: "Tender NLP",
    eyebrow: "Document intelligence",
    description:
      "An NLP engine for dense tender documents—semantic retrieval, requirement extraction, qualification checks, and evidence-backed summaries.",
    impact: "Docs → decisions",
    tech: ["NLP", "RAG", "Vector search", "APIs"],
    image: "/assets/rag-3d.png",
    color: "#f7b955",
  },
  {
    number: "06",
    name: "Groundwater ML",
    eyebrow: "Scientific prediction & mapping",
    description:
      "Processed 10,000+ readings through interpolation, Gaussian smoothing, and scientific visualization to predict groundwater conditions with 85%+ accuracy.",
    impact: "85%+ accuracy",
    tech: ["Python", "SciPy", "Pandas", "NumPy"],
    image: "/assets/ml-groundwater-3d.png",
    color: "#c7e6d1",
  },
  {
    number: "07",
    name: "Ascend",
    eyebrow: "Modular learning system",
    description:
      "A course-creation platform with structured modules, draft publishing, validation, and Cloudinary media delivery tuned for speed.",
    impact: "70% fewer errors",
    tech: ["Flask", "MongoDB", "Cloudinary", "JavaScript"],
    image: "/assets/ml-groundwater-3d.png",
    color: "#f7b955",
    link: "https://ascend.byus4u.in/",
  },
];

const experience = [
  {
    number: "01",
    period: "DEC 2025 — FEB 2026",
    role: "Full-stack Developer Intern",
    company: "Axon Development · Texas, USA",
    description:
      "Owned WestBrookHomes from responsive interface decisions through API-driven lead workflows and deployment.",
    result: "60%",
    resultLabel: "less manual lead handling",
    icon: Globe2,
    image: "/assets/healthcare-3d.png",
    bullets: ["Production React interfaces", "Automated lead follow-up", "End-to-end delivery"],
  },
  {
    number: "02",
    period: "JUN — JUL 2025",
    role: "AI Research Intern & Team Lead",
    company: "OTBI · Osmania University",
    description:
      "Led a three-person research team building a scientific groundwater prediction, mapping, and reporting system.",
    result: "10K+",
    resultLabel: "data points processed",
    icon: BrainCircuit,
    image: "/assets/ml-groundwater-3d.png",
    bullets: ["Research team leadership", "Gaussian smoothing pipelines", "Automated scientific reports"],
  },
  {
    number: "03",
    period: "FOUNDER · ONGOING",
    role: "Independent Digital Studio",
    company: "ByUsForU",
    description:
      "Turned ambiguous client needs into product strategy, full-stack platforms, launches, and long-term technical ownership.",
    result: "5+",
    resultLabel: "platforms delivered",
    icon: Sparkles,
    image: "/assets/byusforu-logo.png",
    bullets: ["Product discovery", "Full-stack execution", "Post-launch ownership"],
  },
  {
    number: "04",
    period: "PRESIDENT · 2024—25",
    role: "Tech Community Leadership",
    company: "ASTRA · MVSR",
    description:
      "Led technical programming for a 25+ member community, including events, coding contests, and the DevLoop bootcamp.",
    result: "25+",
    resultLabel: "members led",
    icon: Trophy,
    image: "/assets/data-dynamo-win.png",
    bullets: ["Community systems", "Mentoring", "Practical learning formats"],
  },
];

const domains = [
  {
    number: "A1",
    title: "Product engineering",
    note: "Interfaces, APIs, background jobs, caching, and deployment designed as one coherent product.",
    icon: Layers3,
    proof: "5+ shipped platforms",
  },
  {
    number: "A2",
    title: "Applied AI & RAG",
    note: "Evidence-grounded retrieval systems that keep context, citations, and usefulness in the same loop.",
    icon: BrainCircuit,
    proof: "4 intelligence workflows",
  },
  {
    number: "A3",
    title: "Document intelligence",
    note: "Legal and tender pipelines that transform dense documents into searchable, traceable decisions.",
    icon: ScanSearch,
    proof: "2 domain engines",
  },
  {
    number: "A4",
    title: "Data systems",
    note: "Readable schemas, transformations, fast query paths, caching, and operational reporting layers.",
    icon: Database,
    proof: "10K+ records",
  },
  {
    number: "A5",
    title: "Machine learning",
    note: "Scientific prediction, numerical processing, evaluation, and visual explanation built for real use.",
    icon: Map,
    proof: "85%+ accuracy",
  },
  {
    number: "A6",
    title: "Technical ownership",
    note: "Discovery, architecture, iteration, delivery, and the connective work that keeps products moving.",
    icon: Workflow,
    proof: "End-to-end",
  },
];

const skillIcons = [
  { label: "React", icon: <SiReact />, color: "#61DAFB" },
  { label: "Vue.js", icon: <SiVuedotjs />, color: "#42B883" },
  { label: "Node.js", icon: <SiNodedotjs />, color: "#5FA04E" },
  { label: "Flask", icon: <SiFlask />, color: "#F3F1EA" },
  { label: "Python", icon: <SiPython />, color: "#3776AB" },
  { label: "TypeScript", icon: <SiTypescript />, color: "#3178C6" },
  { label: "JavaScript", icon: <SiJavascript />, color: "#F7DF1E" },
  { label: "MongoDB", icon: <SiMongodb />, color: "#47A248" },
  { label: "Firebase", icon: <SiFirebase />, color: "#FFCA28" },
  { label: "Redis", icon: <SiRedis />, color: "#FF4438" },
  { label: "MySQL", icon: <SiMysql />, color: "#4479A1" },
  { label: "SQLite", icon: <SiSqlite />, color: "#5AA9E6" },
  { label: "Tailwind", icon: <SiTailwindcss />, color: "#06B6D4" },
  { label: "HTML5", icon: <SiHtml5 />, color: "#E34F26" },
  { label: "CSS3", icon: <SiCss />, color: "#663399" },
  { label: "Git", icon: <SiGit />, color: "#F05032" },
  { label: "GitHub", icon: <SiGithub />, color: "#F3F1EA" },
];

const bentoItems = [
  {
    id: "systems",
    title: "Product systems",
    subtitle: "Interface → infrastructure",
    description: "Production web systems with complete technical ownership.",
    icon: <Code2 />,
    image: "/assets/healthcare-3d.png",
  },
  {
    id: "intelligence",
    title: "AI intelligence",
    subtitle: "Grounded answers",
    description: "RAG, NLP, retrieval, citations, and model-assisted workflows.",
    icon: <BrainCircuit />,
    image: "/assets/rag-3d.png",
  },
  {
    id: "data",
    title: "Data engines",
    subtitle: "Signals into decisions",
    description: "Structured pipelines, analytics, ML, and scientific reporting.",
    icon: <Database />,
    image: "/assets/ml-groundwater-3d.png",
  },
  {
    id: "ship",
    title: "Delivery",
    subtitle: "Ideas into production",
    description: "Architecture, iteration, deployment, and ownership.",
    icon: <Zap />,
    image: "/assets/data-dynamo-win.png",
  },
];

export default function PortfolioExperience() {
  const rootRef = useRef<HTMLElement>(null);
  const [introReady, setIntroReady] = useState(false);
  const [entered, setEntered] = useState(false);
  const [activeProject, setActiveProject] = useState<(typeof projects)[number] | null>(null);
  const [activeChapter, setActiveChapter] = useState(0);

  useEffect(() => {
    document.documentElement.classList.toggle("intro-locked", !entered);
    return () => document.documentElement.classList.remove("intro-locked");
  }, [entered]);

  useEffect(() => {
    document.documentElement.classList.toggle("modal-locked", Boolean(activeProject));
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveProject(null);
    };
    window.addEventListener("keydown", close);
    return () => {
      document.documentElement.classList.remove("modal-locked");
      window.removeEventListener("keydown", close);
    };
  }, [activeProject]);

  const enterPortfolio = () => {
    if (!introReady) return;
    setEntered(true);
    window.setTimeout(() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" }), 520);
  };

  useLayoutEffect(() => {
    if (!entered || !rootRef.current) return;

    const context = gsap.context(() => {
      gsap.to(".c9-world-art", {
        yPercent: 16,
        scale: 1.12,
        ease: "none",
        scrollTrigger: {
          trigger: ".c9-hero",
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      gsap.from(".c9-hero-copy > *", {
        y: 70,
        autoAlpha: 0,
        stagger: 0.1,
        duration: 1.05,
        ease: "power4.out",
      });

      gsap.utils.toArray<HTMLElement>(".c9-manifesto-beat").forEach((beat, index) => {
        ScrollTrigger.create({
          trigger: beat,
          start: "top 54%",
          end: "bottom 46%",
          onEnter: () => setActiveChapter(index),
          onEnterBack: () => setActiveChapter(index),
        });
        gsap.from(beat, {
          y: 90,
          rotateX: -12,
          autoAlpha: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: beat,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        });
      });

      const projectTrack = document.querySelector<HTMLElement>(".c9-project-track");
      if (projectTrack) {
        gsap.to(projectTrack, {
          x: () => -(projectTrack.scrollWidth - window.innerWidth + window.innerWidth * 0.08),
          ease: "none",
          scrollTrigger: {
            trigger: ".c9-project-flight",
            start: "top top",
            end: () => `+=${projectTrack.scrollWidth * 0.82}`,
            pin: ".c9-project-viewport",
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
      }

      gsap.utils.toArray<HTMLElement>(".c9-log-card").forEach((card, index) => {
        gsap.from(card, {
          x: index % 2 ? 110 : -110,
          rotateY: index % 2 ? -9 : 9,
          autoAlpha: 0,
          duration: 1.05,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 76%",
            toggleActions: "play none none reverse",
          },
        });
      });

      gsap.from(".c9-domain-node", {
        scale: 0.65,
        y: 70,
        autoAlpha: 0,
        stagger: 0.09,
        duration: 0.9,
        ease: "back.out(1.25)",
        scrollTrigger: {
          trigger: ".c9-domain-field",
          start: "top 72%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.from(".c9-proof-photo", {
        clipPath: "inset(48% 0 48% 0 round 32px)",
        scale: 1.16,
        ease: "none",
        scrollTrigger: {
          trigger: ".c9-proof",
          start: "top 80%",
          end: "top 24%",
          scrub: 1,
        },
      });
    }, rootRef);

    return () => context.revert();
  }, [entered]);

  return (
    <main ref={rootRef} className={`c9-shell ${entered ? "is-entered" : ""}`}>
      <NotchNavbar />

      <section id="home" className={`c9-intro ${entered ? "is-gone" : ""}`}>
        <div className="c9-intro-ambient" aria-hidden="true" />
        <div className="c9-intro-index"><span>DR / PORTFOLIO</span><span>HYD · IND</span></div>
        <TypingKeyboard
          autoTypeText="Hi, I’m Dhruv Reddy. I build full-stack products, applied AI systems, and data experiences above the obvious."
          typingSpeed={[34, 70]}
          scale={0.88}
          loop={false}
          onTypingComplete={() => setIntroReady(true)}
          accentColor="#bdf73c"
          secondaryAccent="#f7b955"
        />
        <button
          className={`c9-enter ${introReady ? "is-ready" : ""}`}
          type="button"
          onClick={enterPortfolio}
          disabled={!introReady}
        >
          <span>ENTER CLOUD NINE</span>
          <ArrowDown size={16} />
        </button>
      </section>

      <section id="about" className="c9-hero">
        <Image
          className="c9-world-art"
          src="/assets/cloud-nine-world.png"
          alt=""
          fill
          priority
          sizes="100vw"
        />
        <div className="c9-hero-shade" />
        <div className="c9-cloud cloud-a" aria-hidden="true" />
        <div className="c9-cloud cloud-b" aria-hidden="true" />
        <div className="c9-altitude" aria-hidden="true">
          <span>ALT / 09</span><i /><i /><i /><i /><b>∞</b>
        </div>

        <div className="c9-hero-copy">
          <p className="c9-kicker"><Sparkles size={14} /> FULL-STACK × APPLIED AI</p>
          <h1>Building above<br />the <em>obvious.</em></h1>
          <p>
            I’m Dhruv Reddy—an engineer turning difficult product ideas into
            cinematic interfaces, dependable systems, and useful intelligence.
          </p>
          <div className="c9-hero-actions">
            <a href="#projects">Explore the work <ArrowDown size={15} /></a>
            <a href="/assets/dhruv-reddy-resume.pdf" target="_blank">
              Résumé <Download size={14} />
            </a>
          </div>
        </div>

        <div className="c9-identity-card">
          <div className="c9-portrait">
            <Image
              src="/assets/dhruv-hero.png"
              alt="Illustrated portrait of Dhruv Reddy"
              fill
              sizes="(max-width: 700px) 76vw, 33vw"
              priority
            />
          </div>
          <div className="c9-identity-meta">
            <span>AVAILABLE FOR AMBITIOUS BUILDS</span>
            <strong>Dhruv Reddy</strong>
            <p>Hyderabad, India · 9.43 CGPA</p>
          </div>
          <nav aria-label="Dhruv’s social profiles">
            <a href="https://github.com/DhruvReddyS" target="_blank" rel="noreferrer" aria-label="GitHub"><SiGithub /></a>
            <a href="https://www.linkedin.com/in/sripathi-dhruv-reddy" target="_blank" rel="noreferrer" aria-label="LinkedIn"><FaLinkedinIn /></a>
            <a href="https://leetcode.com/u/DhruvReddyS/" target="_blank" rel="noreferrer" aria-label="LeetCode"><SiLeetcode /></a>
            <a href="mailto:dhruvreddysripathi2006@gmail.com" aria-label="Email Dhruv"><Mail /></a>
          </nav>
        </div>

        <div className="c9-hero-marquee" aria-hidden="true">
          <span>PRODUCT ENGINEERING · RAG SYSTEMS · MACHINE LEARNING · DATA PRODUCTS · TECHNICAL OWNERSHIP ·</span>
          <span>PRODUCT ENGINEERING · RAG SYSTEMS · MACHINE LEARNING · DATA PRODUCTS · TECHNICAL OWNERSHIP ·</span>
        </div>
      </section>

      <section className="c9-manifesto">
        <div className="c9-manifesto-sticky">
          <p className="c9-kicker">THE OPERATING SYSTEM / 01—04</p>
          <h2>Not a list of skills.<br /><em>A way of building.</em></h2>
          <div className="c9-manifesto-visual" aria-hidden="true">
            <div className={`c9-core core-${activeChapter}`}>
              <span>0{activeChapter + 1}</span>
              <Orbit />
            </div>
            <i /><i /><i />
          </div>
          <div className="c9-manifesto-progress" aria-hidden="true">
            {[0, 1, 2, 3].map((item) => <i className={item <= activeChapter ? "active" : ""} key={item} />)}
          </div>
        </div>
        <div className="c9-manifesto-beats">
          {[
            ["01", "See the whole system.", "The interface, API, data model, intelligence layer, and deployment are one product—not separate chores."],
            ["02", "Make intelligence traceable.", "AI becomes useful when retrieval, context, citations, and user decisions are designed together."],
            ["03", "Turn evidence into experience.", "Numbers matter. But the best systems also make complexity understandable, responsive, and human."],
            ["04", "Own the final mile.", "A build is only real when it ships, works for people, and keeps working after the demo."],
          ].map(([number, title, copy]) => (
            <article className="c9-manifesto-beat" key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="projects" className="c9-project-flight">
        <div className="c9-project-viewport">
          <header className="c9-flight-header">
            <div>
              <p className="c9-kicker">PROJECT CONSTELLATION / 01—07</p>
              <h2>Seven worlds.<br /><em>One orbit.</em></h2>
            </div>
            <p>Scroll to travel <ArrowRight size={15} /></p>
          </header>

          <div className="c9-orbit-line" aria-hidden="true" />
          <div className="c9-project-track">
            {projects.map((project) => (
              <button
                className="c9-project-card"
                type="button"
                key={project.name}
                onClick={() => setActiveProject(project)}
                style={{ "--project-accent": project.color } as React.CSSProperties}
                aria-label={`Open ${project.name} project`}
              >
                <div className="c9-project-image">
                  <Image src={project.image} alt="" fill sizes="(max-width: 800px) 88vw, 54vw" />
                  <span>{project.number}</span>
                  <i>OPEN CASE FILE <ArrowUpRight size={12} /></i>
                </div>
                <div className="c9-project-copy">
                  <p>{project.eyebrow}</p>
                  <h3>{project.name}</h3>
                  <strong>{project.impact}</strong>
                  <div>{project.tech.map((item) => <span key={item}>{item}</span>)}</div>
                </div>
              </button>
            ))}
            <div className="c9-flight-end">
              <Orbit size={64} />
              <p>Seven shipped signals.<br />The next one could be yours.</p>
              <a href="mailto:dhruvreddysripathi2006@gmail.com">Start a build <ArrowUpRight size={15} /></a>
            </div>
          </div>
        </div>
      </section>

      <section id="experience" className="c9-flight-log">
        <header className="c9-section-head">
          <p className="c9-kicker">FLIGHT LOG / EXPERIENCE</p>
          <h2>Real work.<br /><em>Real altitude.</em></h2>
          <p>Different roles. One pattern: take ownership, create clarity, and leave the system stronger.</p>
        </header>

        <div className="c9-log-path" aria-hidden="true"><i /><i /><i /><i /></div>
        <div className="c9-log-list">
          {experience.map((item) => {
            const ItemIcon = item.icon;
            return (
              <article className="c9-log-card" key={item.company}>
                <div className="c9-log-image">
                  <Image src={item.image} alt="" fill sizes="(max-width: 800px) 94vw, 38vw" />
                  <span>{item.number}</span>
                  <div><ItemIcon size={21} /><b>{item.result}</b><small>{item.resultLabel}</small></div>
                </div>
                <div className="c9-log-copy">
                  <p>{item.period}</p>
                  <h3>{item.role}</h3>
                  <h4>{item.company}</h4>
                  <p>{item.description}</p>
                  <ul>{item.bullets.map((bullet) => <li key={bullet}><Check size={14} /> {bullet}</li>)}</ul>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section id="expertise" className="c9-expertise">
        <div className="c9-expertise-sky" aria-hidden="true" />
        <header className="c9-section-head">
          <p className="c9-kicker">INTELLIGENCE LAYERS / 01—06</p>
          <h2>The systems<br /><em>behind the spectacle.</em></h2>
          <p>Six connected domains that let me move from an ambitious brief to a dependable product.</p>
        </header>
        <div className="c9-domain-field">
          <div className="c9-domain-core" aria-hidden="true">
            <BrainCircuit />
            <span>DHRUV<br />SYSTEMS</span>
          </div>
          {domains.map((domain) => {
            const DomainIcon = domain.icon;
            return (
              <article className="c9-domain-node" key={domain.number}>
                <div><span>{domain.number}</span><DomainIcon /></div>
                <h3>{domain.title}</h3>
                <p>{domain.note}</p>
                <strong>{domain.proof}</strong>
              </article>
            );
          })}
        </div>
      </section>

      <section className="c9-stack">
        <header className="c9-section-head">
          <p className="c9-kicker">SYSTEM CORE / THE TOOLKIT</p>
          <h2>Tools in motion.<br /><em>Zero filler.</em></h2>
          <p>Real technologies, accurate colors, and the combinations I use to ship across web, AI, data, and delivery.</p>
        </header>
        <StaggeredGrid
          className="c9-stack-grid"
          images={[
            "/assets/healthcare-3d.png",
            "/assets/rag-3d.png",
            "/assets/ml-groundwater-3d.png",
            "/assets/data-dynamo-win.png",
            "/assets/byusforu-logo.png",
          ]}
          bentoItems={bentoItems}
          skillIcons={skillIcons}
          centerText="SYSTEM CORE"
          showFooter={false}
        />
        <div className="c9-skill-ribbon">
          {skillIcons.map((skill) => (
            <span key={skill.label} style={{ color: skill.color }}>
              {skill.icon}<b>{skill.label}</b>
            </span>
          ))}
        </div>
      </section>

      <section id="achievement" className="c9-proof">
        <div className="c9-proof-photo">
          <Image
            src="/assets/data-dynamo-win.png"
            alt="Dhruv Reddy and team receiving the Data Dynamo 2.0 national hackathon award"
            fill
            sizes="100vw"
          />
        </div>
        <div className="c9-proof-overlay" />
        <div className="c9-proof-copy">
          <p className="c9-kicker"><Award size={15} /> NATIONAL HACKATHON WINNER</p>
          <h2>24 hours.<br />65+ teams.<br /><em>Cloud nine.</em></h2>
          <p>
            Built CodeSync among 300+ participants, transformed the pressure into
            a working platform, and won Data Dynamo 2.0 at the national level.
          </p>
          <div><span>WINNER</span><span>300+ PARTICIPANTS</span><span>NATIONAL LEVEL</span></div>
        </div>
      </section>

      <section id="education" className="c9-education">
        <header className="c9-section-head">
          <p className="c9-kicker">LEARNING ORBIT / FORMAL PROOF</p>
          <h2>Two tracks.<br /><em>One compounding journey.</em></h2>
        </header>
        <div className="c9-education-grid">
          <article className="c9-degree-card primary">
            <div><GraduationCap /><span>IIT MADRAS · BS DATA SCIENCE</span></div>
            <h3>Foundation complete.<br />Programming diploma complete.</h3>
            <p><i /> Currently pursuing Diploma in Data Science</p>
            <nav>
              <a href="/assets/iitm-foundation-certificate.pdf" target="_blank">Foundation certificate <FileCheck2 /></a>
              <a href="/assets/iitm-programming-certificate.pdf" target="_blank">Programming diploma <FileCheck2 /></a>
            </nav>
          </article>
          <article className="c9-degree-card">
            <div><Code2 /><span>MVSR ENGINEERING COLLEGE</span></div>
            <h3>B.E. Computer Science & Information Technology</h3>
            <strong>9.43 <small>CGPA</small></strong>
            <p>SEP 2023 — PRESENT</p>
          </article>
          <article className="c9-studio-card">
            <Image src="/assets/byusforu-logo.png" alt="ByUsForU studio" fill sizes="420px" />
            <div>
              <span>FOUNDER / DIGITAL STUDIO</span>
              <h3>Ideas deserve<br />a runway.</h3>
              <a href="https://freelance.byus4u.in/" target="_blank" rel="noreferrer">Visit studio <ArrowUpRight /></a>
            </div>
          </article>
        </div>
      </section>

      <section className="c9-transmission">
        <PerspectiveGrid gridSize={32} fadeRadius={78} className="c9-transmission-grid" />
        <div className="c9-transmission-copy">
          <p className="c9-kicker">FINAL TRANSMISSION</p>
          <h2>Have an impossible<br />idea in orbit?</h2>
          <p>Good. Those are usually the interesting ones.</p>
          <CreepyButton
            className="c9-contact-button"
            coverClassName="c9-contact-cover"
            onClick={() => {
              window.location.href = "mailto:dhruvreddysripathi2006@gmail.com";
            }}
          >
            LET’S BUILD IT
          </CreepyButton>
        </div>
      </section>

      <section className="c9-footer">
        <AnimatedFooter
          headingLines={["LET’S", "BUILD"]}
          leftImage="/assets/dhruv-hero.png"
          rightImage="/assets/ml-groundwater-3d.png"
          background="#050706"
          textColor="#f4f0e6"
          charColor="#60761d"
          hoverColor="#bdf73c"
          hoverCharColor="#050706"
          columns={64}
          cellSize={18}
          fontSize={15}
        />
        <div className="c9-footer-contact">
          <a href="mailto:dhruvreddysripathi2006@gmail.com">
            dhruvreddysripathi2006@gmail.com <ArrowUpRight />
          </a>
          <nav>
            <a href="https://github.com/DhruvReddyS" target="_blank" rel="noreferrer">GitHub</a>
            <a href="https://www.linkedin.com/in/sripathi-dhruv-reddy" target="_blank" rel="noreferrer">LinkedIn</a>
            <a href="https://leetcode.com/u/DhruvReddyS/" target="_blank" rel="noreferrer">LeetCode</a>
          </nav>
          <span>HYDERABAD · INDIA / 2026</span>
        </div>
      </section>

      <PortfolioPet visible={entered} />

      {activeProject && (
        <div className="c9-modal" role="dialog" aria-modal="true" aria-label={`${activeProject.name} project details`} onClick={() => setActiveProject(null)}>
          <article onClick={(event) => event.stopPropagation()}>
            <button type="button" onClick={() => setActiveProject(null)} aria-label="Close project details"><X /></button>
            <div className="c9-modal-image">
              <Image src={activeProject.image} alt="" fill sizes="(max-width: 800px) 94vw, 50vw" />
              <span>{activeProject.number}</span>
            </div>
            <div className="c9-modal-copy">
              <p>{activeProject.eyebrow}</p>
              <h2>{activeProject.name}</h2>
              <p>{activeProject.description}</p>
              <strong>{activeProject.impact}</strong>
              <div>{activeProject.tech.map((item) => <span key={item}>{item}</span>)}</div>
              {activeProject.link && (
                <a href={activeProject.link} target="_blank" rel="noreferrer">
                  Visit project <ArrowUpRight />
                </a>
              )}
            </div>
          </article>
        </div>
      )}
    </main>
  );
}
