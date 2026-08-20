"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
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
  FileText,
  GraduationCap,
  Mail,
  Map,
  Layers3,
  ScanSearch,
  Sparkles,
  Trophy,
  Workflow,
  Zap,
  X,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TypingKeyboard } from "@/components/ui/typing-keyboard";
import { NotchNavbar } from "@/components/ui/notch-navbar";
import { AnimatedFooter } from "@/components/ui/animated-footer";
import { CreepyButton } from "@/components/ui/creepy-button";
import { CylinderCarousel } from "@/components/ui/cylinder-carousel";
import { PerspectiveGrid } from "@/components/ui/perspective-grid";
import { StaggeredGrid } from "@/components/ui/staggered-grid";
import { PortfolioPet } from "@/components/portfolio-pet";
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

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const projects = [
  {
    number: "01",
    name: "CodeSync",
    type: "Competitive programming intelligence",
    thesis: "One command center for every coding profile, contest, and career signal.",
    description:
      "Unified analytics across 5+ coding platforms and GitHub, with contest tracking, peer benchmarking, an AI copilot, code editor, and ATS-ready career tools.",
    impact: "200+ learners",
    tech: ["React", "Node.js", "Firebase", "MongoDB", "REST"],
    image: "/assets/data-dynamo-win.png",
    accent: "lime",
    visual: "codesync",
  },
  {
    number: "02",
    name: "Healthcare OS",
    type: "Multi-role care operations",
    thesis: "A calmer operating system for patients, doctors, and clinic teams.",
    description:
      "A full-stack clinic platform for patients, doctors, and admins—appointments, treatments, secure JWT workflows, background jobs, caching, and reports.",
    impact: "40% faster response",
    tech: ["Flask", "Vue.js", "Redis", "Celery", "SQLAlchemy"],
    image: "/assets/healthcare-3d.png",
    accent: "silver",
    visual: "healthcare",
  },
  {
    number: "03",
    name: "QuizMaster",
    type: "Adaptive learning platform",
    thesis: "Question banks, timed attempts, and feedback shaped into one learning loop.",
    description:
      "A focused quiz and evaluation system with question-bank workflows, timed attempts, performance analytics, and role-based content administration.",
    impact: "Learning, measured",
    tech: ["Python", "Flask", "SQLite", "Jinja", "Bootstrap"],
    image: "/assets/healthcare-3d.png",
    accent: "amber",
    visual: "quiz",
  },
  {
    number: "04",
    name: "Legal RAG",
    type: "Cited legal intelligence",
    thesis: "Legal answers that never lose the clause, context, or source behind them.",
    description:
      "Retrieval-augmented legal research that grounds answers in source documents, surfaces clauses, preserves context, and keeps every conclusion traceable.",
    impact: "Answers with evidence",
    tech: ["Python", "LLMs", "Embeddings", "Vector DB", "RAG"],
    image: "/assets/rag-3d.png",
    accent: "lime",
    visual: "legal",
  },
  {
    number: "05",
    name: "Tender NLP",
    type: "Document intelligence with RAG",
    thesis: "Dense tender documents translated into requirements, evidence, and decisions.",
    description:
      "An NLP pipeline for dense tender documents—semantic retrieval, requirement extraction, qualification checks, and fast evidence-backed summaries.",
    impact: "Dense docs → decisions",
    tech: ["NLP", "RAG", "Python", "Vector Search", "APIs"],
    image: "/assets/rag-3d.png",
    accent: "silver",
    visual: "tender",
  },
  {
    number: "06",
    name: "Groundwater ML",
    type: "Scientific prediction & mapping",
    thesis: "Ten thousand readings turned into a readable map of what lies below.",
    description:
      "Processed 10,000+ readings using interpolation, Gaussian smoothing, and scientific visualization to predict and map groundwater with 85%+ accuracy.",
    impact: "85%+ accuracy",
    tech: ["Python", "SciPy", "Pandas", "NumPy", "Matplotlib"],
    image: "/assets/ml-groundwater-3d.png",
    accent: "earth",
    visual: "groundwater",
  },
  {
    number: "07",
    name: "Ascend",
    type: "Modular learning system",
    thesis: "A publishing system that lets structured courses rise from draft to delivery.",
    description:
      "A course creation platform with structured modules, draft publishing, validation, and Cloudinary media delivery tuned for sub-two-second asset loads.",
    impact: "70% fewer form errors",
    tech: ["Flask", "MongoDB", "Cloudinary", "JavaScript"],
    image: "/assets/ml-groundwater-3d.png",
    accent: "amber",
    visual: "ascend",
  },
];

const experience = [
  {
    date: "DEC 2025 — FEB 2026",
    year: "2025—26",
    chapter: "PRODUCTION SYSTEMS",
    signal: "structured",
    role: "Full-stack Developer Intern",
    company: "Axon Development · Texas, USA",
    summary:
      "Owned the full lifecycle of WestBrookHomes’ luxury real-estate platform—from responsive React interfaces to API-driven lead workflows.",
    metric: "60%",
    metricLabel: "less manual lead handling",
    image: "/assets/healthcare-3d.png",
    icon: Building2,
    link: "https://github.com/DhruvReddyS",
    linkLabel: "GitHub profile",
    focus: "Product engineering",
    stack: ["React", "REST APIs", "Lead workflows", "Responsive UI"],
    bullets: [
      "Built production interfaces for luxury property discovery.",
      "Connected lead capture to automated follow-up workflows.",
      "Owned implementation from UI decisions through deployment.",
    ],
  },
  {
    date: "JUN — JUL 2025",
    year: "2025",
    chapter: "APPLIED RESEARCH",
    signal: "research",
    role: "AI Research Intern & Team Lead",
    company: "OTBI · Osmania University",
    summary:
      "Led a three-person team building an AI groundwater prediction and mapping system, with scientific preprocessing, smoothing, interpolation, and automated reporting.",
    metric: "10K+",
    metricLabel: "data points processed",
    image: "/assets/ml-groundwater-3d.png",
    icon: BrainCircuit,
    link: "https://otbi.in/",
    linkLabel: "Visit OTBI",
    focus: "AI research leadership",
    stack: ["Python", "SciPy", "Pandas", "Interpolation"],
    bullets: [
      "Led a three-person applied research team.",
      "Designed preprocessing and Gaussian smoothing pipelines.",
      "Turned scientific outputs into readable automated reports.",
    ],
  },
  {
    date: "FOUNDER · ONGOING",
    year: "NOW",
    chapter: "INDEPENDENT PRACTICE",
    signal: "studio",
    role: "Independent Digital Studio",
    company: "ByUsForU",
    summary:
      "Founded a compact freelance studio delivering strategic platforms and digital experiences for growing businesses—shipped with speed and full technical ownership.",
    metric: "5+",
    metricLabel: "platforms delivered",
    image: "/assets/byusforu-logo.png",
    icon: Sparkles,
    link: "https://freelance.byus4u.in/",
    linkLabel: "Visit ByUsForU",
    focus: "Founder & delivery",
    stack: ["Strategy", "Full-stack", "Cloud", "Client delivery"],
    bullets: [
      "Translated ambiguous business needs into product roadmaps.",
      "Designed and shipped complete customer-facing platforms.",
      "Handled technical ownership after launch.",
    ],
  },
  {
    date: "PRESIDENT · 2024—25",
    year: "2024—25",
    chapter: "COMMUNITY MOMENTUM",
    signal: "community",
    role: "Tech Community Leadership",
    company: "ASTRA · MVSR Engineering College",
    summary:
      "Led 25+ members across technical events, coding contests, and DevLoop—a practical web-development bootcamp built to help peers ship.",
    metric: "25+",
    metricLabel: "members led",
    image: "/assets/data-dynamo-win.png",
    icon: Trophy,
    link: "https://www.linkedin.com/in/sripathi-dhruv-reddy",
    linkLabel: "View leadership",
    focus: "Community systems",
    stack: ["Leadership", "Mentoring", "Events", "DevLoop"],
    bullets: [
      "Coordinated 25+ members across technical programs.",
      "Ran coding contests and hands-on development sessions.",
      "Built repeatable learning formats instead of one-off events.",
    ],
  },
];

const domains = [
  {
    number: "01",
    title: "Full-stack product systems",
    kicker: "Interfaces to infrastructure",
    description:
      "Role-aware products with thoughtful interaction design, dependable APIs, background work, caching, and deployment considered as one system.",
    image: "/assets/healthcare-3d.png",
    icon: Layers3,
    metric: "5+",
    metricLabel: "production platforms",
    tech: ["React", "Vue", "Node.js", "Flask"],
  },
  {
    number: "02",
    title: "Applied AI & RAG",
    kicker: "Answers with evidence",
    description:
      "Retrieval systems that keep conclusions grounded in the source—chunking, embeddings, semantic search, context assembly, and cited responses.",
    image: "/assets/rag-3d.png",
    icon: BrainCircuit,
    metric: "4",
    metricLabel: "intelligence workflows",
    tech: ["LLMs", "Embeddings", "Vector DB", "RAG"],
  },
  {
    number: "03",
    title: "Document intelligence",
    kicker: "Dense documents → decisions",
    description:
      "NLP pipelines for legal and tender corpora that surface requirements, clauses, qualification signals, and traceable summaries.",
    image: "/assets/rag-3d.png",
    icon: ScanSearch,
    metric: "2×",
    metricLabel: "domain-specific engines",
    tech: ["NLP", "Semantic search", "Extraction", "Citations"],
  },
  {
    number: "04",
    title: "Data systems",
    kicker: "Pipelines that stay readable",
    description:
      "Clean schemas, repeatable transformations, fast query paths, caching, and reporting layers designed for real operational use.",
    image: "/assets/data-dynamo-win.png",
    icon: Database,
    metric: "10K+",
    metricLabel: "records processed",
    tech: ["SQL", "MongoDB", "Redis", "Firebase"],
  },
  {
    number: "05",
    title: "Machine learning",
    kicker: "Scientific prediction",
    description:
      "Practical ML and numerical workflows combining interpolation, Gaussian smoothing, evaluation, and visual explanation.",
    image: "/assets/ml-groundwater-3d.png",
    icon: Map,
    metric: "85%+",
    metricLabel: "prediction accuracy",
    tech: ["Python", "SciPy", "Pandas", "NumPy"],
  },
  {
    number: "06",
    title: "Product delivery",
    kicker: "From brief to shipped",
    description:
      "The connective work around the code: product framing, scope control, client communication, iteration, deployment, and ownership after launch.",
    image: "/assets/byusforu-logo.png",
    icon: Workflow,
    metric: "End-to-end",
    metricLabel: "technical ownership",
    tech: ["Discovery", "Architecture", "Delivery", "Iteration"],
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
  { label: "Tailwind CSS", icon: <SiTailwindcss />, color: "#06B6D4" },
  { label: "HTML5", icon: <SiHtml5 />, color: "#E34F26" },
  { label: "CSS3", icon: <SiCss />, color: "#663399" },
  { label: "Git", icon: <SiGit />, color: "#F05032" },
  { label: "GitHub", icon: <SiGithub />, color: "#F3F1EA" },
];

const skillBentoItems = [
  {
    id: "web",
    title: "Web systems",
    subtitle: "Production interfaces",
    description: "Responsive, accessible product surfaces connected to dependable APIs.",
    icon: <Code2 />,
    image: "/assets/healthcare-3d.png",
  },
  {
    id: "ai",
    title: "AI workflows",
    subtitle: "Grounded intelligence",
    description: "RAG, NLP, vector retrieval, and model-assisted product features.",
    icon: <BrainCircuit />,
    image: "/assets/rag-3d.png",
  },
  {
    id: "data",
    title: "Data engines",
    subtitle: "Useful pipelines",
    description: "Structured storage, transformation, caching, analysis, and reporting.",
    icon: <Database />,
    image: "/assets/ml-groundwater-3d.png",
  },
  {
    id: "ship",
    title: "Delivery",
    subtitle: "Ideas to production",
    description: "Architecture, iteration, deployment, and long-term technical ownership.",
    icon: <Zap />,
    image: "/assets/data-dynamo-win.png",
  },
];

const projectLinks: Record<string, string> = {
  CodeSync: "https://codesync.byus4u.in/",
  "Healthcare OS": "https://hms.byus4u.in/",
  Ascend: "https://ascend.byus4u.in/",
};

type PortfolioProject = (typeof projects)[number];

function ProjectVisual({ project }: { project: PortfolioProject }) {
  const usesImage = ["codesync", "healthcare", "legal", "groundwater"].includes(project.visual);

  return (
    <div
      className={`project-media-inner visual-${project.visual}`}
      role="img"
      aria-label={`${project.name} project visualization`}
    >
      {usesImage && (
        <Image src={project.image} alt="" fill sizes="(max-width: 900px) 92vw, 78vw" />
      )}

      {project.visual === "codesync" && (
        <div className="visual-codesync-overlay" aria-hidden="true">
          <span>05 SOURCES CONNECTED</span>
          <i /><i /><i /><i />
          <strong>SYNC / 100%</strong>
        </div>
      )}

      {project.visual === "healthcare" && (
        <div className="visual-healthcare-overlay" aria-hidden="true">
          <span>PATIENT FLOW</span>
          <i className="healthcare-scan" />
          <div><b>07</b><small>ACTIVE CARE PATHS</small></div>
        </div>
      )}

      {project.visual === "quiz" && (
        <div className="visual-quiz-system" aria-hidden="true">
          <div className="quiz-score"><span>86</span><small>MASTERY</small></div>
          <div className="quiz-question">
            <small>QUESTION / 08</small>
            <strong>Which path resolves the system?</strong>
            <i /><i className="is-selected" /><i />
          </div>
          <div className="quiz-module"><b>12</b><span>MODULES</span></div>
          <div className="quiz-timer">09:42</div>
        </div>
      )}

      {project.visual === "legal" && (
        <div className="visual-legal-overlay" aria-hidden="true">
          <span>CITATION GRAPH</span>
          <i /><i /><i />
          <b>§ 4.2</b>
          <small>SOURCE VERIFIED</small>
        </div>
      )}

      {project.visual === "tender" && (
        <div className="visual-tender-system" aria-hidden="true">
          <div className="tender-document tender-document-a"><span>RFP / 2026</span><i /><i /><i /><i /></div>
          <div className="tender-document tender-document-b"><span>REQUIREMENTS</span><i /><i /><i /></div>
          <div className="tender-vector"><i /><i /><i /><i /><b>92%</b></div>
          <small>QUALIFICATION SIGNALS</small>
        </div>
      )}

      {project.visual === "groundwater" && (
        <div className="visual-groundwater-overlay" aria-hidden="true">
          <span>10,482 READINGS</span>
          <i /><i /><i />
          <b>85.7%</b><small>PREDICTION CONFIDENCE</small>
        </div>
      )}

      {project.visual === "ascend" && (
        <div className="visual-ascend-system" aria-hidden="true">
          <div className="ascend-axis"><i /><i /><i /><i /></div>
          <div className="ascend-module module-one"><small>01</small><strong>FOUNDATION</strong><span>READY</span></div>
          <div className="ascend-module module-two"><small>02</small><strong>BUILD</strong><span>LIVE</span></div>
          <div className="ascend-module module-three"><small>03</small><strong>SHIP</strong><span>PUBLISHED</span></div>
          <b>↗</b>
        </div>
      )}
    </div>
  );
}

export default function PortfolioExperience() {
  const rootRef = useRef<HTMLElement>(null);
  const [entered, setEntered] = useState(false);
  const [activeProject, setActiveProject] = useState<(typeof projects)[number] | null>(null);
  const [activeExperience, setActiveExperience] = useState<(typeof experience)[number] | null>(null);
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const [activeWorkIndex, setActiveWorkIndex] = useState(0);
  const [activeDomainIndex, setActiveDomainIndex] = useState(0);
  const activeDomain = domains[activeDomainIndex];
  const ActiveDomainIcon = activeDomain.icon;

  useEffect(() => {
    document.documentElement.classList.toggle("intro-locked", !entered);
    return () => document.documentElement.classList.remove("intro-locked");
  }, [entered]);

  useEffect(() => {
    const modalOpen = Boolean(activeProject || activeExperience);
    document.documentElement.classList.toggle("modal-locked", modalOpen);
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveProject(null);
        setActiveExperience(null);
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.documentElement.classList.remove("modal-locked");
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [activeProject, activeExperience]);

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
      const placeProjectCards = (progress: number) => {
        const travel = progress * (projectCards.length - 1);
        const nextIndex = Math.round(travel);
        const radius = Math.min(window.innerWidth * 0.42, 650);
        setActiveProjectIndex((current) => (current === nextIndex ? current : nextIndex));

        projectCards.forEach((card, index) => {
          const phase = index - travel;
          const distance = Math.abs(phase);
          const direction = phase === 0 ? 0 : Math.sign(phase);
          const isFuture = phase > 0;
          const closeness = Math.max(0, 1 - distance);
          const horizontal = direction * Math.pow(Math.min(distance, 3.2), 0.78) * radius;
          const depth = -Math.pow(distance, 0.82) * (isFuture ? 780 : 520);
          const rotateY = isFuture
            ? -Math.min(78, distance * 64)
            : Math.min(38, distance * 26);
          gsap.set(card, {
            xPercent: -50,
            x: horizontal,
            y: phase * 48 + distance * 18,
            z: depth,
            rotateY,
            rotateX: phase * -1.8,
            scale: Math.max(0.56, 1 - distance * 0.17),
            autoAlpha: Math.max(0, 1 - distance * (isFuture ? 0.34 : 0.42)),
            filter: `blur(${Math.min(8, distance * (isFuture ? 2.8 : 2.1))}px) saturate(${Math.max(0.28, 1 - distance * 0.28)})`,
            zIndex: Math.round(100 - distance * 12),
            pointerEvents: distance < 0.5 ? "auto" : "none",
          });
          card.style.setProperty("--project-light", String(0.2 + closeness * 0.8));
        });
      };

      placeProjectCards(0);
      ScrollTrigger.create({
        trigger: ".projects-flight",
        start: "top top",
        end: `+=${projectCards.length * 125}%`,
        pin: ".projects-viewport",
        scrub: 0.75,
        anticipatePin: 1,
        onUpdate: (self) => placeProjectCards(self.progress),
      });

      const experienceScenes = gsap.utils.toArray<HTMLElement>(".career-chapter");
      gsap.set(experienceScenes, { autoAlpha: 0, pointerEvents: "none" });
      const careerTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: ".experience-signal",
          start: "top top",
          end: `+=${experienceScenes.length * 185}%`,
          pin: ".experience-signal-sticky",
          scrub: 1,
          anticipatePin: 1,
          onUpdate: (self) => {
            const nextIndex = Math.min(experienceScenes.length - 1, Math.floor(self.progress * experienceScenes.length));
            setActiveWorkIndex((current) => (current === nextIndex ? current : nextIndex));
          },
        },
      });

      careerTimeline.fromTo(
        ".career-signal-pulse",
        { top: "20%" },
        { top: "80%", duration: experienceScenes.length * 4, ease: "none" },
        0,
      );

      experienceScenes.forEach((scene, index) => {
        const start = index * 4;
        const media = scene.querySelector(".career-memory");
        const companyOutline = scene.querySelector(".career-company-outline");
        const companySolid = scene.querySelector(".career-company-solid");
        const role = scene.querySelector(".career-role");
        const description = scene.querySelector(".career-description");
        const accomplishments = scene.querySelectorAll(".career-accomplishments li");
        const metric = scene.querySelector(".career-metric");
        const action = scene.querySelector(".career-chapter-action");

        careerTimeline
          .set(scene, { autoAlpha: 1, pointerEvents: "auto" }, start)
          .fromTo(scene.querySelector(".career-ghost-year"),
            { autoAlpha: 0, xPercent: -8, scale: 1.08 },
            { autoAlpha: 0.055, xPercent: 0, scale: 1, duration: 0.8, ease: "power3.out" },
            start,
          )
          .fromTo(companyOutline,
            { autoAlpha: 0, y: 55 },
            { autoAlpha: 0.68, y: 0, duration: 0.62, ease: "power3.out" },
            start + 0.2,
          )
          .fromTo(companySolid,
            { clipPath: "inset(0 100% 0 0)", autoAlpha: 0 },
            { clipPath: "inset(0 0% 0 0)", autoAlpha: 1, duration: 0.72, ease: "expo.inOut" },
            start + 0.72,
          )
          .fromTo(role,
            { autoAlpha: 0, y: 34 },
            { autoAlpha: 1, y: 0, duration: 0.58, ease: "power3.out" },
            start + 0.95,
          )
          .fromTo(media,
            { clipPath: "inset(48% 48% 48% 48% round 28px)", scale: 1.12, autoAlpha: 0 },
            { clipPath: "inset(0% 0% 0% 0% round 28px)", scale: 1, autoAlpha: 1, duration: 0.9, ease: "expo.inOut" },
            start + 0.55,
          )
          .fromTo(description,
            { autoAlpha: 0, y: 28 },
            { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" },
            start + 1.35,
          )
          .fromTo(accomplishments,
            { autoAlpha: 0, y: 24 },
            { autoAlpha: 1, y: 0, stagger: 0.12, duration: 0.45, ease: "power3.out" },
            start + 1.62,
          )
          .fromTo(metric,
            { autoAlpha: 0, scale: 1.8, filter: "blur(10px)" },
            { autoAlpha: 1, scale: 1, filter: "blur(0px)", duration: 0.66, ease: "power3.out" },
            start + 2.02,
          )
          .fromTo(action,
            { autoAlpha: 0, x: -18 },
            { autoAlpha: 1, x: 0, duration: 0.42 },
            start + 2.2,
          );

        if (index < experienceScenes.length - 1) {
          careerTimeline
            .to(media, {
              clipPath: "inset(49% 48% 49% 48% round 28px)",
              scale: 0.88,
              duration: 0.58,
              ease: "power3.inOut",
            }, start + 3.28)
            .to(scene, {
              autoAlpha: 0,
              filter: "blur(10px)",
              pointerEvents: "none",
              duration: 0.5,
              ease: "power2.in",
            }, start + 3.42);
        }
      });

      gsap.utils.toArray<HTMLElement>(".domain-card").forEach((card, index) => {
        ScrollTrigger.create({
          trigger: card,
          start: "top 58%",
          end: "bottom 42%",
          onEnter: () => setActiveDomainIndex(index),
          onEnterBack: () => setActiveDomainIndex(index),
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

      gsap.from(".cylinder-copy > *", {
        y: 70,
        rotateX: -18,
        autoAlpha: 0,
        stagger: 0.12,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".cylinder-showcase",
          start: "top 72%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.from(".domain-story-heading", {
        clipPath: "inset(0 100% 0 0)",
        duration: 1.2,
        ease: "expo.inOut",
        scrollTrigger: {
          trigger: ".domain-story",
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.from(".skills-heading h2", {
        letterSpacing: "0.02em",
        filter: "blur(12px)",
        autoAlpha: 0,
        duration: 1.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".skills-lab",
          start: "top 68%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.from(".perspective-copy", {
        scale: 0.72,
        rotateZ: -2.5,
        autoAlpha: 0,
        duration: 1.25,
        ease: "back.out(1.35)",
        scrollTrigger: {
          trigger: ".perspective-cta",
          start: "top 66%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.from(".achievement-copy > *", {
        x: -80,
        autoAlpha: 0,
        stagger: 0.11,
        duration: 0.85,
        ease: "power4.out",
        scrollTrigger: {
          trigger: ".achievement",
          start: "top 64%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.from(".education-card", {
        y: (index) => (index % 2 === 0 ? 110 : -70),
        rotate: (index) => (index - 1) * 2.4,
        autoAlpha: 0,
        stagger: 0.14,
        duration: 1.05,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".education-grid",
          start: "top 78%",
          toggleActions: "play none none reverse",
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
              typingSpeed={[26, 88]}
              scale={0.88}
              loop={false}
              onEnter={enterPortfolio}
              accentColor="#bdf73c"
              secondaryAccent="#f7b955"
            />
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
            <nav className="hero-socials" aria-label="Dhruv’s profiles">
              <a href="https://github.com/DhruvReddyS" target="_blank" rel="noreferrer" aria-label="GitHub">
                <SiGithub />
              </a>
              <a href="https://www.linkedin.com/in/sripathi-dhruv-reddy" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                <FaLinkedinIn />
              </a>
              <a href="https://leetcode.com/u/DhruvReddyS/" target="_blank" rel="noreferrer" aria-label="LeetCode">
                <SiLeetcode />
              </a>
              <a href="mailto:dhruvreddysripathi2006@gmail.com" aria-label="Email Dhruv">
                <Mail />
              </a>
              <a href="/assets/dhruv-reddy-resume.pdf" target="_blank" aria-label="Open resume">
                <FileText />
              </a>
            </nav>
          </article>

          <article className="identity-beat identity-beat-2">
            <p className="eyebrow">02 / WHAT I BUILD</p>
            <h3>Systems behind<br />the <span className="effect-orbit-word">screen.</span></h3>
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

      <section id="projects" className={`projects-flight signature-${projects[activeProjectIndex].visual}`}>
        <div className="projects-viewport">
          <div className="gallery-environment" aria-hidden="true">
            <div className="gallery-depth-grid" />
            <div className="gallery-fog" />
            <div className="gallery-signature"><i /><i /><i /><i /><i /><i /></div>
            <span className="gallery-coordinate coordinate-a">X 05.17 / Y 09.43</span>
            <span className="gallery-coordinate coordinate-b">ARCHIVE / {String(activeProjectIndex + 1).padStart(2, "0")}</span>
          </div>

          <div className="flight-header">
            <div>
              <p className="eyebrow">SELECTED WORK / 01—07</p>
              <h2>A flight through what I’ve <span className="effect-marker">built.</span></h2>
            </div>
            <p>Scroll deeper <ArrowDown size={14} /></p>
          </div>

          <div className="project-stage">
            {projects.map((project, index) => (
              <article
                className={`project-card accent-${project.accent} ${index === activeProjectIndex ? "is-active" : ""}`}
                key={project.name}
                role="button"
                tabIndex={0}
                aria-label={`Open details for ${project.name}`}
                onClick={() => setActiveProject(project)}
                onPointerMove={(event) => {
                  if (index !== activeProjectIndex) return;
                  const bounds = event.currentTarget.getBoundingClientRect();
                  const x = (event.clientX - bounds.left) / bounds.width - 0.5;
                  const y = (event.clientY - bounds.top) / bounds.height - 0.5;
                  event.currentTarget.style.setProperty("--pointer-x", `${x * 10}px`);
                  event.currentTarget.style.setProperty("--pointer-y", `${y * 8}px`);
                }}
                onPointerLeave={(event) => {
                  event.currentTarget.style.setProperty("--pointer-x", "0px");
                  event.currentTarget.style.setProperty("--pointer-y", "0px");
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setActiveProject(project);
                  }
                }}
              >
                <div className="project-visual">
                  <ProjectVisual project={project} />
                  <div className="project-card-index">{project.number} / 07</div>
                </div>
                <div className="project-content">
                  <div className="project-title-lockup">
                    <p className="project-type">{project.type}</p>
                    <h3>{project.name}</h3>
                    <p className="project-thesis">{project.thesis}</p>
                  </div>
                  <div className="project-bottom">
                    <div className="tech-list">
                      {project.tech.slice(0, 4).map((item) => <span key={item}>{item}</span>)}
                    </div>
                    <div className="project-outcome">
                      <span>Signal</span>
                      <strong>{project.impact}</strong>
                    </div>
                    <span className="project-open">Open case study <ArrowUpRight size={14} /></span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="gallery-progress" aria-label={`Project ${activeProjectIndex + 1} of ${projects.length}`}>
            {projects.map((project, index) => (
              <div
                className={`gallery-progress-step ${index < activeProjectIndex ? "is-past" : ""} ${index === activeProjectIndex ? "is-active" : ""}`}
                key={project.number}
              >
                <span>{project.number}</span>
                {index < projects.length - 1 && <i />}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="experience" className={`experience-signal signal-${experience[activeWorkIndex].signal}`}>
        <div className="experience-signal-sticky">
          <div className="career-atmosphere" aria-hidden="true">
            <div className="career-light-shafts" />
            <div className="career-film-grain" />
          </div>

          <header className="career-header">
            <div>
              <p className="eyebrow">EXPERIENCE / THE CAREER SIGNAL</p>
              <h2>Built in the <span>real world.</span></h2>
            </div>
            <p><span>{String(activeWorkIndex + 1).padStart(2, "0")}</span> Scroll through time</p>
          </header>

          <div className="career-signal-track" aria-hidden="true">
            <i className="career-signal-line" />
            <i className="career-signal-pulse" />
            <div className="career-signal-nodes">
              {experience.map((item, index) => (
                <span className={index <= activeWorkIndex ? "is-active" : ""} key={item.company}>
                  {String(index + 1).padStart(2, "0")}
                </span>
              ))}
            </div>
          </div>

          <div className="career-chapters">
            {experience.map((item, index) => {
              const ExperienceIcon = item.icon;
              const companyName = item.company.split("·")[0].trim();
              const companyContext = item.company.split("·")[1]?.trim();
              return (
                <article className={`career-chapter career-${item.signal}`} key={item.company}>
                  <div className="career-ghost-year" aria-hidden="true">{item.year}</div>

                  <div className="career-memory">
                    <Image src={item.image} alt="" fill sizes="(max-width: 900px) 100vw, 52vw" />
                    <div className="career-memory-shade" />
                    <div className="career-memory-meta">
                      <span>{item.chapter}</span>
                      <span>MEMORY / {String(index + 1).padStart(2, "0")}</span>
                    </div>
                    <div className="career-memory-mark">
                      <ExperienceIcon size={25} />
                      <span>{item.focus}</span>
                    </div>
                  </div>

                  <div className="career-copy">
                    <div className="career-meta">
                      <span>CHAPTER {String(index + 1).padStart(2, "0")}</span>
                      <span>{item.date}</span>
                      <i />
                      <span>{companyContext}</span>
                    </div>

                    <div className="career-company-lockup">
                      <span className="career-company-outline">{companyName}</span>
                      <span className="career-company-solid">{companyName}</span>
                    </div>

                    <h3 className="career-role">{item.role}</h3>
                    <p className="career-description">{item.summary}</p>

                    <ol className="career-accomplishments">
                      {item.bullets.slice(0, 3).map((bullet, bulletIndex) => (
                        <li key={bullet}>
                          <span>{String(bulletIndex + 1).padStart(2, "0")}</span>
                          <p>{bullet}</p>
                        </li>
                      ))}
                    </ol>

                    <div className="career-chapter-footer">
                      <div className="career-metric">
                        <strong>{item.metric}</strong>
                        <span>{item.metricLabel}</span>
                      </div>
                      <div className="career-stack">
                        {item.stack.map((technology) => <span key={technology}>{technology}</span>)}
                      </div>
                    </div>

                    <div className="career-actions">
                      <a className="career-source-link" href={item.link} target="_blank" rel="noreferrer">
                        {item.linkLabel} <ArrowUpRight size={15} />
                      </a>
                      <button className="career-chapter-action" type="button" onClick={() => setActiveExperience(item)}>
                        View chapter <ArrowUpRight size={15} />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="career-index-rail" aria-hidden="true">
            {experience.map((item, index) => (
              <span className={index === activeWorkIndex ? "is-active" : ""} key={item.company}>
                {String(index + 1).padStart(2, "0")} / {item.company.split("·")[0].trim()}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="cylinder-showcase">
        <div className="cylinder-copy">
          <p className="eyebrow">THE PROJECT ORBIT</p>
          <h2>Seven builds.<br /><span className="effect-underline">Always in motion.</span></h2>
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

      <section id="expertise" className="domain-story">
        <div className="domain-story-heading">
          <p className="eyebrow">DOMAINS OF EXPERTISE / 01—06</p>
          <h2>
            Six ways I turn complexity into{" "}
            <span className="effect-orbit-word">working software.</span>
          </h2>
          <p>
            Scroll the cards. The story, evidence, and toolkit change with every
            domain—without making you hunt for the important part.
          </p>
        </div>

        <div className="domain-story-layout">
          <aside className="domain-story-copy" aria-live="polite">
            <div className="domain-copy-index">
              <span>{activeDomain.number}</span>
              <ActiveDomainIcon size={24} />
            </div>
            <p className="domain-kicker">{activeDomain.kicker}</p>
            <h3>{activeDomain.title}</h3>
            <p>{activeDomain.description}</p>

            <div className="domain-evidence">
              <strong>{activeDomain.metric}</strong>
              <span>{activeDomain.metricLabel}</span>
            </div>

            <div className="domain-tech">
              {activeDomain.tech.map((technology) => (
                <span key={technology}>{technology}</span>
              ))}
            </div>

            <div className="domain-progress" aria-hidden="true">
              {domains.map((domain, index) => (
                <i
                  className={index <= activeDomainIndex ? "is-active" : ""}
                  key={domain.number}
                />
              ))}
            </div>
          </aside>

          <div className="domain-card-rail">
            {domains.map((domain, index) => {
              const DomainIcon = domain.icon;
              return (
                <button
                  className={`domain-card ${index === activeDomainIndex ? "is-active" : ""}`}
                  type="button"
                  key={domain.number}
                  onClick={() => setActiveDomainIndex(index)}
                  aria-label={`Show ${domain.title}`}
                >
                  <Image
                    src={domain.image}
                    alt=""
                    fill
                    sizes="(max-width: 900px) 92vw, 48vw"
                  />
                  <div className="domain-card-top">
                    <span>{domain.number}</span>
                    <DomainIcon size={22} />
                  </div>
                  <div className="domain-card-label">
                    <p>{domain.kicker}</p>
                    <h3>{domain.title}</h3>
                    <span>{domain.metric} · {domain.metricLabel}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="skills-lab">
        <div className="skills-heading">
          <p className="eyebrow">THE ACTUAL TOOLKIT</p>
          <h2>Correct tools.<br /><span className="effect-marker effect-marker-amber">Correct colors. Zero filler.</span></h2>
          <p>
            The languages, frameworks, databases, and delivery tools I use across
            production web systems, RAG pipelines, and machine-learning work.
          </p>
        </div>
        <StaggeredGrid
          className="skills-staggered"
          images={[
            "/assets/healthcare-3d.png",
            "/assets/rag-3d.png",
            "/assets/ml-groundwater-3d.png",
            "/assets/data-dynamo-win.png",
            "/assets/byusforu-logo.png",
          ]}
          bentoItems={skillBentoItems}
          skillIcons={skillIcons}
          centerText="THE STACK"
          showFooter={false}
        />
        <div className="skill-key" aria-label="Technology toolkit">
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
          <h2>There’s room here<br />for one more <span className="effect-signal">ambitious build.</span></h2>
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

      <section id="achievement" className="achievement">
        <div className="achievement-copy">
          <p className="eyebrow">NATIONAL HACKATHON WINNER</p>
          <div className="achievement-kicker"><Trophy size={18} /> DATA DYNAMO 2.0</div>
          <h2>24 hours.<br />65+ teams.<br /><span className="effect-stamp">One winning build.</span></h2>
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

      <section id="education" className="education">
        <div className="section-heading">
          <p className="eyebrow">LEARNING, FORMALIZED</p>
          <h2>Two tracks. <span className="effect-underline">One compounding journey.</span></h2>
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
          background="#070807"
          textColor="#f3f1ea"
          charColor="#536814"
          hoverColor="#bdf73c"
          hoverCharColor="#070807"
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
            <a href="https://github.com/DhruvReddyS" target="_blank" rel="noreferrer">GitHub</a>
            <a href="https://www.linkedin.com/in/sripathi-dhruv-reddy" target="_blank" rel="noreferrer">LinkedIn</a>
            <span>Hyderabad · India</span>
          </div>
        </div>
      </section>

      <PortfolioPet visible={entered} />

      {activeProject && (
        <div className="detail-modal" role="dialog" aria-modal="true" aria-label={`${activeProject.name} project details`} onClick={() => setActiveProject(null)}>
          <article onClick={(event) => event.stopPropagation()}>
            <button className="detail-modal-close" type="button" onClick={() => setActiveProject(null)} aria-label="Close project details">
              <X size={18} />
            </button>
            <div className="detail-modal-media">
              <ProjectVisual project={activeProject} />
              <span>{activeProject.number}</span>
            </div>
            <div className="detail-modal-copy">
              <p className="eyebrow">{activeProject.type}</p>
              <h2>{activeProject.name}</h2>
              <p>{activeProject.description}</p>
              <div className="detail-impact">
                <span>Outcome</span>
                <strong>{activeProject.impact}</strong>
              </div>
              <div className="tech-list">
                {activeProject.tech.map((item) => <span key={item}>{item}</span>)}
              </div>
              {projectLinks[activeProject.name] && (
                <a href={projectLinks[activeProject.name]} target="_blank" rel="noreferrer">
                  Open live project <ArrowUpRight size={16} />
                </a>
              )}
            </div>
          </article>
        </div>
      )}

      {activeExperience && (
        <div className={`detail-modal experience-detail-modal modal-${activeExperience.signal}`} role="dialog" aria-modal="true" aria-label={`${activeExperience.role} experience details`} onClick={() => setActiveExperience(null)}>
          <article onClick={(event) => event.stopPropagation()}>
            <button className="detail-modal-close" type="button" onClick={() => setActiveExperience(null)} aria-label="Close experience details">
              <X size={18} />
            </button>
            <div className="detail-modal-media">
              <Image src={activeExperience.image} alt="" fill sizes="(max-width: 900px) 100vw, 48vw" />
              <span>{(() => {
                const ExperienceIcon = activeExperience.icon;
                return <ExperienceIcon size={19} />;
              })()}</span>
            </div>
            <div className="detail-modal-copy">
              <p className="eyebrow">{activeExperience.date}</p>
              <h2>{activeExperience.role}</h2>
              <h3>{activeExperience.company}</h3>
              <p>{activeExperience.summary}</p>
              <div className="detail-impact">
                <span>{activeExperience.metricLabel}</span>
                <strong>{activeExperience.metric}</strong>
              </div>
              <a href="mailto:dhruvreddysripathi2006@gmail.com">
                Discuss this experience <ArrowUpRight size={16} />
              </a>
            </div>
          </article>
        </div>
      )}
    </main>
  );
}
