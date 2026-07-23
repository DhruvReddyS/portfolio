"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  ArrowDown,
  ArrowUpRight,
  Award,
  BrainCircuit,
  Building2,
  Code2,
  Database,
  FileCheck2,
  GraduationCap,
  Layers3,
  Map,
  Sparkles,
  Trophy,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TypingKeyboard } from "@/components/ui/typing-keyboard";
import { MusicPlayer } from "@/components/ui/music-player";
import { ImageScatter } from "@/components/ui/image-scatter";
import { NotchNavbar } from "@/components/ui/notch-navbar";
import { AnimatedFooter } from "@/components/ui/animated-footer";
import { CreepyButton } from "@/components/ui/creepy-button";
import { CylinderCarousel } from "@/components/ui/cylinder-carousel";
import { StaggeredGrid, type BentoItem } from "@/components/ui/staggered-grid";
import { PerspectiveGrid } from "@/components/ui/perspective-grid";
import {
  SiCss,
  SiFirebase,
  SiFlask,
  SiGit,
  SiGithub,
  SiHtml5,
  SiJavascript,
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

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const projects = [
  {
    number: "01",
    name: "CodeSync",
    type: "Competitive programming intelligence",
    description:
      "Unified analytics across 5+ coding platforms and GitHub, with contest tracking, peer benchmarking, an AI copilot, code editor, and ATS-ready career tools.",
    impact: "200+ learners",
    tech: ["React", "Node.js", "Firebase", "MongoDB", "REST"],
    image: "/assets/data-dynamo-win.png",
    accent: "lime",
  },
  {
    number: "02",
    name: "Healthcare OS",
    type: "Multi-role care operations",
    description:
      "A full-stack clinic platform for patients, doctors, and admins—appointments, treatments, secure JWT workflows, background jobs, caching, and reports.",
    impact: "40% faster response",
    tech: ["Flask", "Vue.js", "Redis", "Celery", "SQLAlchemy"],
    image: "/assets/healthcare-3d.png",
    accent: "silver",
  },
  {
    number: "03",
    name: "QuizMaster",
    type: "Adaptive learning platform",
    description:
      "A focused quiz and evaluation system with question-bank workflows, timed attempts, performance analytics, and role-based content administration.",
    impact: "Learning, measured",
    tech: ["Python", "Flask", "SQLite", "Jinja", "Bootstrap"],
    image: "/assets/healthcare-3d.png",
    accent: "amber",
  },
  {
    number: "04",
    name: "Legal RAG",
    type: "Cited legal intelligence",
    description:
      "Retrieval-augmented legal research that grounds answers in source documents, surfaces clauses, preserves context, and keeps every conclusion traceable.",
    impact: "Answers with evidence",
    tech: ["Python", "LLMs", "Embeddings", "Vector DB", "RAG"],
    image: "/assets/rag-3d.png",
    accent: "lime",
  },
  {
    number: "05",
    name: "Tender NLP",
    type: "Document intelligence with RAG",
    description:
      "An NLP pipeline for dense tender documents—semantic retrieval, requirement extraction, qualification checks, and fast evidence-backed summaries.",
    impact: "Dense docs → decisions",
    tech: ["NLP", "RAG", "Python", "Vector Search", "APIs"],
    image: "/assets/rag-3d.png",
    accent: "silver",
  },
  {
    number: "06",
    name: "Groundwater ML",
    type: "Scientific prediction & mapping",
    description:
      "Processed 10,000+ readings using interpolation, Gaussian smoothing, and scientific visualization to predict and map groundwater with 85%+ accuracy.",
    impact: "85%+ accuracy",
    tech: ["Python", "SciPy", "Pandas", "NumPy", "Matplotlib"],
    image: "/assets/ml-groundwater-3d.png",
    accent: "earth",
  },
  {
    number: "07",
    name: "Ascend",
    type: "Modular learning system",
    description:
      "A course creation platform with structured modules, draft publishing, validation, and Cloudinary media delivery tuned for sub-two-second asset loads.",
    impact: "70% fewer form errors",
    tech: ["Flask", "MongoDB", "Cloudinary", "JavaScript"],
    image: "/assets/ml-groundwater-3d.png",
    accent: "amber",
  },
];

const experience = [
  {
    date: "DEC 2025 — FEB 2026",
    role: "Full-stack Developer Intern",
    company: "Axon Development · Texas, USA",
    summary:
      "Owned the full lifecycle of WestBrookHomes’ luxury real-estate platform—from responsive React interfaces to API-driven lead workflows.",
    metric: "60%",
    metricLabel: "less manual lead handling",
    image: "/assets/healthcare-3d.png",
    icon: Building2,
  },
  {
    date: "JUN — JUL 2025",
    role: "AI Research Intern & Team Lead",
    company: "OTBI · Osmania University",
    summary:
      "Led a three-person team building an AI groundwater prediction and mapping system, with scientific preprocessing, smoothing, interpolation, and automated reporting.",
    metric: "10K+",
    metricLabel: "data points processed",
    image: "/assets/ml-groundwater-3d.png",
    icon: BrainCircuit,
  },
  {
    date: "FOUNDER · ONGOING",
    role: "Independent Digital Studio",
    company: "ByUsForU",
    summary:
      "Founded a compact freelance studio delivering strategic platforms and digital experiences for growing businesses—shipped with speed and full technical ownership.",
    metric: "5+",
    metricLabel: "platforms delivered",
    image: "/assets/byusforu-logo.png",
    icon: Sparkles,
  },
  {
    date: "PRESIDENT · 2024—25",
    role: "Tech Community Leadership",
    company: "ASTRA · MVSR Engineering College",
    summary:
      "Led 25+ members across technical events, coding contests, and DevLoop—a practical web-development bootcamp built to help peers ship.",
    metric: "25+",
    metricLabel: "members led",
    image: "/assets/data-dynamo-win.png",
    icon: Trophy,
  },
];

const capabilities = [
  { icon: Code2, label: "Full-stack systems", note: "React · Vue · Node · Flask" },
  { icon: BrainCircuit, label: "Applied AI", note: "RAG · NLP · LLM workflows" },
  { icon: Database, label: "Data engineering", note: "Pipelines · SQL · Redis" },
  { icon: Map, label: "Machine learning", note: "Prediction · interpolation · viz" },
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
  { label: "Tailwind CSS", icon: <SiTailwindcss />, color: "#06B6D4" },
  { label: "HTML5", icon: <SiHtml5 />, color: "#E34F26" },
  { label: "CSS3", icon: <SiCss />, color: "#663399" },
  { label: "Git", icon: <SiGit />, color: "#F05032" },
  { label: "GitHub", icon: <SiGithub />, color: "#F3F1EA" },
];

const skillBentoItems: BentoItem[] = [
  {
    id: "web",
    title: "Web Engineering",
    subtitle: "Interfaces + APIs",
    description: "React, Vue, Node, Flask, TypeScript",
    icon: <SiReact size={24} color="#61DAFB" />,
    image: "/assets/healthcare-3d.png",
  },
  {
    id: "ai",
    title: "AI & Machine Learning",
    subtitle: "Useful intelligence",
    description: "RAG, NLP, prediction, scientific computing",
    icon: <BrainCircuit size={24} color="#BDF73C" />,
    image: "/assets/rag-3d.png",
  },
  {
    id: "data",
    title: "Data Systems",
    subtitle: "Reliable foundations",
    description: "MongoDB, Redis, SQL, Firebase",
    icon: <SiMongodb size={24} color="#47A248" />,
    image: "/assets/ml-groundwater-3d.png",
  },
  {
    id: "ship",
    title: "Delivery",
    subtitle: "From zero to live",
    description: "Git, APIs, automation, cloud deployment",
    icon: <SiGit size={24} color="#F05032" />,
    image: "/assets/data-dynamo-win.png",
  },
];

export default function PortfolioExperience() {
  const rootRef = useRef<HTMLElement>(null);
  const [introReady, setIntroReady] = useState(false);
  const [entered, setEntered] = useState(false);

  const scatterData = useMemo(
    () => [
      {
        heading: "FULL-STACK SYSTEMS",
        images: [
          "/assets/healthcare-3d.png",
          "/assets/data-dynamo-win.png",
          "/assets/byusforu-logo.png",
        ],
      },
      {
        heading: "APPLIED AI / RAG",
        images: [
          "/assets/rag-3d.png",
          "/assets/ml-groundwater-3d.png",
          "/assets/dhruv-hero.png",
        ],
      },
      {
        heading: "DATA + MACHINE LEARNING",
        images: [
          "/assets/ml-groundwater-3d.png",
          "/assets/data-dynamo-win.png",
          "/assets/healthcare-3d.png",
        ],
      },
    ],
    [],
  );

  useEffect(() => {
    const readyTimer = window.setTimeout(() => setIntroReady(true), 10_200);
    return () => window.clearTimeout(readyTimer);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("intro-locked", !entered);
    return () => document.documentElement.classList.remove("intro-locked");
  }, [entered]);

  const enterPortfolio = () => {
    setEntered(true);
    window.setTimeout(() => {
      document.querySelector("#about")?.scrollIntoView({ behavior: "smooth" });
    }, 120);
  };

  useLayoutEffect(() => {
    if (!rootRef.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const context = gsap.context(() => {
      gsap.to(".intro-stage", {
        scale: 0.5,
        opacity: 0,
        filter: "blur(22px)",
        scrollTrigger: {
          trigger: ".intro",
          start: "38% top",
          end: "bottom top",
          scrub: 0.8,
        },
      });

      gsap.to(".portfolio-shell > header", {
        opacity: 1,
        pointerEvents: "auto",
        scrollTrigger: {
          trigger: ".story",
          start: "top bottom",
          end: "top 70%",
          scrub: true,
        },
      });

      gsap.set(".identity-beat", { autoAlpha: 0, y: 70 });
      const identityTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: ".story",
          start: "top top",
          end: "+=360%",
          pin: ".story-sticky",
          scrub: 1,
          anticipatePin: 1,
        },
      });

      identityTimeline
        .fromTo(
          ".identity-portrait",
          { autoAlpha: 0, scale: 0.42, z: -900, rotateY: -34, rotateX: 12 },
          {
            autoAlpha: 1,
            scale: 1,
            z: 0,
            rotateY: 0,
            rotateX: 0,
            duration: 1.2,
            ease: "expo.out",
          },
        )
        .fromTo(
          ".identity-name",
          { autoAlpha: 0, y: 120, letterSpacing: "0.08em" },
          { autoAlpha: 1, y: 0, letterSpacing: "-0.08em", duration: 1 },
          0.15,
        )
        .to(".identity-beat-1", { autoAlpha: 1, y: 0, duration: 0.7 }, 0.55)
        .to(".identity-beat-1", { autoAlpha: 0, y: -70, duration: 0.55 }, 1.75)
        .to(
          ".identity-portrait",
          { xPercent: 32, scale: 0.82, rotateY: 8, duration: 0.9 },
          1.75,
        )
        .to(".identity-beat-2", { autoAlpha: 1, y: 0, duration: 0.7 }, 1.85)
        .to(".identity-beat-2", { autoAlpha: 0, y: -70, duration: 0.55 }, 3.05)
        .to(
          ".identity-name",
          { opacity: 0.09, scale: 1.15, y: -30, duration: 0.8 },
          3.05,
        )
        .to(".identity-beat-3", { autoAlpha: 1, y: 0, duration: 0.75 }, 3.12)
        .to(".identity-facts", { autoAlpha: 1, y: 0, duration: 0.7 }, 3.35)
        .to({}, { duration: 0.8 });

      const projectCards = gsap.utils.toArray<HTMLElement>(".project-card");
      const projectTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: ".projects-flight",
          start: "top top",
          end: `+=${projectCards.length * 115}%`,
          pin: ".projects-viewport",
          scrub: 1,
          anticipatePin: 1,
        },
      });

      projectCards.forEach((card, index) => {
        const direction = index % 2 === 0 ? -1 : 1;
        projectTimeline
          .fromTo(
            card,
            {
              autoAlpha: 0,
              z: -1500,
              y: 320,
              x: direction * 240,
              rotateY: direction * -28,
              rotateX: 18,
              scale: 0.55,
            },
            {
              autoAlpha: 1,
              z: 0,
              y: 0,
              x: 0,
              rotateY: direction * 3,
              rotateX: 0,
              scale: 1,
              duration: 1,
              ease: "power2.out",
            },
          )
          .to(card, {
            autoAlpha: 0,
            z: 850,
            y: -520,
            x: direction * -180,
            rotateY: direction * 22,
            rotateX: -14,
            scale: 1.28,
            duration: 0.75,
            ease: "power2.in",
          });
      });

      const workCards = gsap.utils.toArray<HTMLElement>(".experience-card");
      const workTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: ".experience-flight",
          start: "top top",
          end: `+=${workCards.length * 135}%`,
          pin: ".experience-viewport",
          scrub: 1,
          anticipatePin: 1,
        },
      });

      workCards.forEach((card, index) => {
        const direction = index % 2 === 0 ? -1 : 1;
        workTimeline
          .fromTo(
            card,
            {
              autoAlpha: 0,
              z: -1300,
              x: direction * 620,
              rotateY: direction * -42,
              scale: 0.62,
            },
            {
              autoAlpha: 1,
              z: 0,
              x: 0,
              rotateY: direction * 4,
              scale: 1,
              duration: 1.1,
              ease: "expo.out",
            },
          )
          .to(card, {
            autoAlpha: 0,
            z: 700,
            x: direction * -420,
            rotateY: direction * 34,
            scale: 1.18,
            duration: 0.8,
            ease: "power2.in",
          });
      });

      gsap.from(".achievement-image", {
        clipPath: "inset(48% 0 48% 0 round 28px)",
        scale: 1.18,
        scrollTrigger: {
          trigger: ".achievement",
          start: "top 75%",
          end: "top 25%",
          scrub: 1,
        },
      });
    }, rootRef);

    return () => context.revert();
  }, []);

  return (
    <main ref={rootRef} className="portfolio-shell">
      <NotchNavbar />

      <section id="home" className={`intro ${entered ? "intro-entered" : ""}`}>
        <div className="intro-stage">
          <div className="keyboard-wrap">
            <TypingKeyboard
              autoTypeText="Hi, I’m Dhruv Reddy. I build full-stack products, applied AI systems, and data experiences. Ready to enter?       "
              typingSpeed={[36, 78]}
              scale={0.88}
              loop={false}
              accentColor="#3b82f6"
              secondaryAccent="#a855f7"
            />
          </div>
          <div className={`intro-action ${introReady ? "is-ready" : ""}`}>
            <button type="button" onClick={enterPortfolio}>
              <span>ENTER PORTFOLIO</span>
              <ArrowDown size={16} />
            </button>
          </div>
        </div>
      </section>

      <section id="about" className="story">
        <div className="story-sticky">
          <div className="identity-grid" aria-hidden="true" />
          <h2 className="identity-name" aria-label="Dhruv Reddy">DHRUV<br />REDDY</h2>
          <div className="identity-portrait">
            <Image
              src="/assets/dhruv-hero.png"
              alt="Illustrated portrait of Dhruv Reddy"
              fill
              sizes="(max-width: 900px) 82vw, 42vw"
              priority
            />
          </div>

          <article className="identity-beat identity-beat-1">
            <p className="eyebrow">01 / HELLO</p>
            <h3>Dhruv Reddy.</h3>
            <p>Full-stack engineer and applied AI builder from Hyderabad, India.</p>
          </article>

          <article className="identity-beat identity-beat-2">
            <p className="eyebrow">02 / WHAT I BUILD</p>
            <h3>Systems behind<br />the <span>screen.</span></h3>
            <p>
              Production web platforms, retrieval-augmented intelligence, and
              data products engineered for real users and measurable outcomes.
            </p>
          </article>

          <article className="identity-beat identity-beat-3">
            <p className="eyebrow">03 / CURRENTLY</p>
            <h3>Learning and<br /><span>shipping.</span></h3>
            <p>
              B.E. CSIT at MVSR. IIT Madras Foundation and Programming Diploma
              complete. Currently pursuing the Diploma in Data Science.
            </p>
            <div className="identity-facts">
              <div><strong>9.43</strong><span>CGPA</span></div>
              <div><strong>85%+</strong><span>ML accuracy</span></div>
              <div><strong>5+</strong><span>client platforms</span></div>
            </div>
          </article>

          <div className="identity-scroll-cue">
            <span>Scroll to know me</span>
            <ArrowDown size={15} />
          </div>
        </div>
      </section>

      <section id="projects" className="projects-flight">
        <div className="projects-viewport">
          <div className="flight-header">
            <div>
              <p className="eyebrow">SELECTED PROJECTS / 01—07</p>
              <h2>A 3D flight through the work.</h2>
            </div>
            <p>Keep scrolling <ArrowDown size={14} /></p>
          </div>

          <div className="project-stage">
            {projects.map((project) => (
              <article className={`project-card accent-${project.accent}`} key={project.name}>
                <div className="project-visual">
                  <Image src={project.image} alt="" fill sizes="80vw" />
                  <div className="project-number">{project.number}</div>
                </div>
                <div className="project-content">
                  <div>
                    <p className="project-type">{project.type}</p>
                    <h3>{project.name}</h3>
                  </div>
                  <p>{project.description}</p>
                  <div className="project-bottom">
                    <div className="tech-list">
                      {project.tech.map((item) => <span key={item}>{item}</span>)}
                    </div>
                    <strong>{project.impact}</strong>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <div className="flight-progress" aria-hidden="true">
            {projects.map((project) => <i key={project.number} />)}
          </div>
        </div>
      </section>

      <section id="experience" className="experience-flight">
        <div className="experience-viewport">
          <div className="flight-header">
            <div>
              <p className="eyebrow">EXPERIENCE / FIELD NOTES</p>
              <h2>Where the work met the world.</h2>
            </div>
            <p>Depth in motion <Layers3 size={14} /></p>
          </div>

          <div className="experience-stage">
            {experience.map((item) => {
              const Icon = item.icon;
              return (
                <article className="experience-card" key={item.company}>
                  <div className="experience-media">
                    <Image src={item.image} alt="" fill sizes="55vw" />
                    <span><Icon size={20} /></span>
                  </div>
                  <div className="experience-copy">
                    <p className="experience-date">{item.date}</p>
                    <h3>{item.role}</h3>
                    <h4>{item.company}</h4>
                    <p>{item.summary}</p>
                    <div className="experience-metric">
                      <strong>{item.metric}</strong>
                      <span>{item.metricLabel}</span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="cylinder-showcase">
        <div className="cylinder-copy">
          <p className="eyebrow">THE PROJECT ORBIT</p>
          <h2>Seven builds.<br /><span>Always in motion.</span></h2>
          <p>
            A rotating field of platforms, research, client work, and experiments—
            each one pushing the next build further.
          </p>
        </div>
        <div className="cylinder-stage">
          <CylinderCarousel
            images={[
              { src: "/assets/healthcare-3d.png", alt: "Healthcare platform visualization" },
              { src: "/assets/rag-3d.png", alt: "Retrieval augmented generation visualization" },
              { src: "/assets/ml-groundwater-3d.png", alt: "Groundwater machine learning visualization" },
              { src: "/assets/data-dynamo-win.png", alt: "Data Dynamo hackathon win" },
              { src: "/assets/dhruv-hero.png", alt: "Dhruv Reddy portrait" },
              { src: "/assets/byusforu-logo.png", alt: "ByUsForU studio" },
              { src: "/assets/rag-3d.png", alt: "Tender NLP visualization" },
            ]}
            cardWidth={210}
            animationDuration={34}
            cardClassName="cylinder-card"
          />
        </div>
      </section>

      <section id="expertise" className="expertise">
        <div className="section-heading">
          <p className="eyebrow">DOMAINS OF EXPERTISE</p>
          <h2>Wide range. One standard: <span>ship it well.</span></h2>
        </div>
        <div className="scatter-frame">
          <ImageScatter data={scatterData} cardWidth={230} cardHeight={280} />
        </div>
        <div className="capability-row">
          {capabilities.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label}>
                <Icon size={20} />
                <strong>{item.label}</strong>
                <span>{item.note}</span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="skills-lab">
        <div className="skills-heading">
          <p className="eyebrow">THE ACTUAL TOOLKIT</p>
          <h2>Correct tools.<br /><span>Correct colors. Zero filler.</span></h2>
          <p>
            The languages, frameworks, databases, and delivery tools I use across
            production web systems, RAG pipelines, and machine-learning work.
          </p>
        </div>
        <StaggeredGrid
          images={[
            "/assets/healthcare-3d.png",
            "/assets/rag-3d.png",
            "/assets/ml-groundwater-3d.png",
            "/assets/data-dynamo-win.png",
            "/assets/byusforu-logo.png",
          ]}
          bentoItems={skillBentoItems}
          skillIcons={skillIcons}
          centerText="STACK"
          showFooter={false}
          className="skills-staggered"
        />
        <div className="skill-key" aria-label="Technology color key">
          {skillIcons.map((skill) => (
            <div key={skill.label}>
              <span style={{ color: skill.color }}>{skill.icon}</span>
              <strong>{skill.label}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="perspective-cta">
        <PerspectiveGrid gridSize={34} fadeRadius={74} className="perspective-field" />
        <div className="perspective-copy">
          <p className="eyebrow">NEXT GRID / YOUR IDEA</p>
          <h2>There’s room here<br />for one more <span>ambitious build.</span></h2>
          <p>Bring the difficult brief. I’ll bring the systems thinking.</p>
          <CreepyButton
            className="contact-creepy"
            coverClassName="creepy-cover"
            onClick={() => {
              window.location.href = "mailto:dhruvreddysripathi2006@gmail.com";
            }}
          >
            START A CONVERSATION
          </CreepyButton>
        </div>
      </section>

      <section className="achievement">
        <div className="achievement-copy">
          <p className="eyebrow">NATIONAL HACKATHON WINNER</p>
          <div className="achievement-kicker"><Trophy size={18} /> DATA DYNAMO 2.0</div>
          <h2>24 hours.<br />65+ teams.<br /><span>One winning build.</span></h2>
          <p>
            Built CodeSync as a smart-campus competitive programming evaluation platform
            among 300+ participants—then took the national win.
          </p>
          <div className="achievement-facts">
            <span><Award size={16} /> Winner</span>
            <span>300+ participants</span>
            <span>National level</span>
          </div>
        </div>
        <div className="achievement-image">
          <Image
            src="/assets/data-dynamo-win.png"
            alt="Dhruv Reddy and team receiving the Data Dynamo 2.0 hackathon award"
            fill
            sizes="(max-width: 900px) 100vw, 58vw"
          />
        </div>
      </section>

      <section className="education">
        <div className="section-heading">
          <p className="eyebrow">LEARNING, FORMALIZED</p>
          <h2>Two tracks. <span>One compounding journey.</span></h2>
        </div>
        <div className="education-grid">
          <article className="education-card featured">
            <div className="education-icon"><GraduationCap /></div>
            <p>IIT MADRAS · BS DATA SCIENCE</p>
            <h3>Foundation complete.<br />Programming diploma complete.</h3>
            <div className="pursuing"><i /> Currently pursuing Diploma in Data Science</div>
            <div className="certificate-links">
              <a href="/assets/iitm-foundation-certificate.pdf" target="_blank">
                Foundation certificate <FileCheck2 size={15} />
              </a>
              <a href="/assets/iitm-programming-certificate.pdf" target="_blank">
                Programming diploma <FileCheck2 size={15} />
              </a>
            </div>
          </article>
          <article className="education-card">
            <div className="education-icon"><Code2 /></div>
            <p>MVSR ENGINEERING COLLEGE</p>
            <h3>B.E. Computer Science & Information Technology</h3>
            <div className="education-score">
              <strong>9.43</strong>
              <span>CGPA · Sep 2023—Present</span>
            </div>
          </article>
          <article className="education-card studio">
            <div className="studio-logo">
              <Image src="/assets/byusforu-logo.png" alt="ByUsForU studio logo" fill sizes="240px" />
            </div>
            <p>FOUNDER · FREELANCE STUDIO</p>
            <h3>By us.<br />For you.</h3>
            <a href="https://freelance.byus4u.in" target="_blank" rel="noreferrer">
              Visit the studio <ArrowUpRight size={15} />
            </a>
          </article>
        </div>
      </section>

      <section className="footer-wrap">
        <AnimatedFooter
          headingLines={["LET’S", "BUILD"]}
          leftImage="/assets/dhruv-hero.png"
          rightImage="/assets/ml-groundwater-3d.png"
          background="#070707"
          textColor="#f4f3ed"
          charColor="#4a5a22"
          hoverColor="#bdf73c"
          hoverCharColor="#070707"
          columns={64}
          cellSize={18}
          fontSize={15}
        />
        <div className="footer-contact">
          <p>Have an ambitious build in mind?</p>
          <a href="mailto:dhruvreddysripathi2006@gmail.com">
            dhruvreddysripathi2006@gmail.com <ArrowUpRight size={18} />
          </a>
          <div>
            <a href="https://github.com/" target="_blank" rel="noreferrer">GitHub</a>
            <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer">LinkedIn</a>
            <span>Hyderabad · India</span>
          </div>
        </div>
      </section>

      <aside className="music-dock" aria-label="Portfolio soundtrack">
        <MusicPlayer
          tracks={[
            {
              title: "Deep Work",
              artist: "Dhruv’s portfolio loop",
              src: "/assets/focus-loop.wav",
              artwork: "/assets/dhruv-hero.png",
            },
          ]}
          avatar="/assets/dhruv-hero.png"
          accentColor="#bdf73c"
          loop
          defaultCollapsed
        />
      </aside>
    </main>
  );
}
