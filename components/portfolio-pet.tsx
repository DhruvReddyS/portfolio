"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  Bot,
  BriefcaseBusiness,
  Code2,
  GraduationCap,
  Mail,
  MessageCircleQuestion,
  Rocket,
  Send,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";

type MessageAction = {
  href: string;
  label: string;
  external?: boolean;
};

type ChatMessage = {
  id: number;
  from: "pixel" | "user";
  text: string;
  action?: MessageAction;
};

const faqs = [
  {
    id: "intro",
    label: "Meet Dhruv",
    shortLabel: "About",
    icon: UserRound,
    keywords: ["who", "about", "dhruv", "introduce", "profile", "person"],
    answer:
      "Dhruv Reddy is a full-stack engineer and applied AI builder from Hyderabad. He turns complicated briefs into clear, production-ready products—and likes owning the journey from interface to infrastructure.",
    action: { href: "#about", label: "See Dhruv’s story" },
  },
  {
    id: "projects",
    label: "Best projects",
    shortLabel: "Projects",
    icon: Rocket,
    keywords: ["project", "work", "portfolio", "codesync", "rag", "quiz", "best"],
    answer:
      "Start with CodeSync for competitive-programming intelligence, Healthcare OS for full-stack product depth, Legal RAG and Tender NLP for grounded AI, and Groundwater ML for scientific prediction. There are seven builds in the 3D project flight.",
    action: { href: "#projects", label: "Fly through the projects" },
  },
  {
    id: "skills",
    label: "Technical toolkit",
    shortLabel: "Skills",
    icon: Code2,
    keywords: ["build", "skills", "stack", "technology", "technologies", "tools"],
    answer:
      "Dhruv works across React, Vue, Node.js, Flask, Python, TypeScript, MongoDB, Redis, SQL, Firebase, RAG, NLP, and machine-learning workflows. The real strength is connecting those tools into complete systems.",
    action: { href: "#expertise", label: "Explore his expertise" },
  },
  {
    id: "experience",
    label: "Work experience",
    shortLabel: "Experience",
    icon: BriefcaseBusiness,
    keywords: ["experience", "intern", "job", "company", "leadership", "career"],
    answer:
      "Dhruv shipped full-stack product work at Axon Development, led an AI research team at OTBI, founded the ByUsForU digital studio, and led 25+ members as ASTRA president. Each role added a different kind of ownership.",
    action: { href: "#experience", label: "Open the work timeline" },
  },
  {
    id: "education",
    label: "Education",
    shortLabel: "Education",
    icon: GraduationCap,
    keywords: ["education", "college", "iit", "iitm", "degree", "diploma", "cgpa"],
    answer:
      "He is pursuing B.E. in CSIT at MVSR with a 9.43 CGPA. At IIT Madras, he completed the Foundation and Programming Diploma stages and is currently pursuing the Diploma in Data Science.",
    action: { href: "#education", label: "View education & certificates" },
  },
  {
    id: "achievement",
    label: "Hackathon win",
    shortLabel: "Win",
    icon: Award,
    keywords: ["achievement", "award", "winner", "hackathon", "dynamo", "won"],
    answer:
      "The headline win: Data Dynamo 2.0. Dhruv and his team built CodeSync in 24 hours and won at the national level among 65+ teams and 300+ participants.",
    action: { href: "#achievement", label: "See the winning moment" },
  },
  {
    id: "studio",
    label: "ByUsForU studio",
    shortLabel: "Studio",
    icon: Sparkles,
    keywords: ["studio", "byusforu", "freelance", "founder", "client"],
    answer:
      "ByUsForU is Dhruv’s independent digital studio. He uses it to take client ideas from rough requirements to strategy, design, engineering, deployment, and post-launch ownership.",
    action: {
      href: "https://freelance.byus4u.in/",
      label: "Visit ByUsForU",
      external: true,
    },
  },
  {
    id: "contact",
    label: "Work with Dhruv",
    shortLabel: "Contact",
    icon: Mail,
    keywords: ["hire", "contact", "email", "available", "work with", "reach"],
    answer:
      "Yes—Dhruv is open to ambitious full-stack, AI, and freelance opportunities. The fastest route is email; include the problem, timeline, and what success should look like.",
    action: {
      href: "mailto:dhruvreddysripathi2006@gmail.com",
      label: "Email Dhruv",
    },
  },
];

function answerFor(question: string) {
  const normalized = question.toLowerCase();
  const match = faqs
    .map((faq) => ({
      faq,
      score: faq.keywords.filter((keyword) => normalized.includes(keyword)).length,
    }))
    .sort((a, b) => b.score - a.score)[0];

  return match?.score
    ? { text: match.faq.answer, action: match.faq.action }
    : {
        text:
          "That one sits outside my tiny knowledge core—for now. I’m best at Dhruv’s projects, skills, experience, education, studio, hackathon win, and availability. Pick a signal below and I’ll give you the useful version.",
      };
}

const initialMessage: ChatMessage = {
  id: 1,
  from: "pixel",
  text:
    "Welcome in. I know the short version, the detailed version, and the numbers behind Dhruv’s work. Choose a topic—or ask me your own question.",
};

export function PortfolioPet({ visible }: { visible: boolean }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"intro" | "chat">("intro");
  const [introduced, setIntroduced] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([initialMessage]);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const messageIdRef = useRef(2);

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const enterChat = () => {
    clearTimer();
    setIntroduced(true);
    setMode("chat");
    window.setTimeout(() => inputRef.current?.focus(), 350);
  };

  const openPixel = () => {
    if (open) {
      clearTimer();
      setOpen(false);
      return;
    }

    setOpen(true);
    if (introduced) {
      setMode("chat");
      window.setTimeout(() => inputRef.current?.focus(), 350);
      return;
    }

    setMode("intro");
    timerRef.current = setTimeout(enterChat, 3200);
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        clearTimer();
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      clearTimer();
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  useEffect(() => {
    logRef.current?.scrollTo({
      top: logRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, thinking]);

  const ask = (question: string) => {
    const cleanQuestion = question.trim();
    if (!cleanQuestion || thinking) return;

    const response = answerFor(cleanQuestion);
    setMessages((current) => [
      ...current,
      { id: messageIdRef.current++, from: "user", text: cleanQuestion },
    ]);
    setInput("");
    setThinking(true);

    clearTimer();
    timerRef.current = setTimeout(() => {
      setMessages((current) => [
        ...current,
        {
          id: messageIdRef.current++,
          from: "pixel",
          text: response.text,
          action: response.action,
        },
      ]);
      setThinking(false);
    }, 520);
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    ask(input);
  };

  return (
    <aside
      className={`portfolio-pet ${visible ? "is-visible" : ""} ${open ? "is-open" : ""} ${thinking ? "is-thinking" : ""}`}
    >
      {open && (
        <section
          className={`pet-chat pixel-${mode}`}
          role="dialog"
          aria-modal="false"
          aria-label="Pixel, Dhruv’s portfolio guide"
        >
          {mode === "intro" ? (
            <div className="pixel-intro">
              <button
                className="pixel-intro-close"
                type="button"
                onClick={() => {
                  clearTimer();
                  setOpen(false);
                }}
                aria-label="Close Pixel introduction"
              >
                <X size={17} />
              </button>

              <div className="pixel-intro-grid" aria-hidden="true" />
              <div className="pixel-intro-orbit" aria-hidden="true">
                <i />
                <i />
                <i />
              </div>
              <div className="pixel-intro-avatar">
                <Image src="/assets/pixel-mascot.png" alt="" fill sizes="180px" />
              </div>
              <p>PORTFOLIO COMPANION / ONLINE</p>
              <h2>Hi, I’m <span>Pixel.</span></h2>
              <strong>
                I live between Dhruv’s projects. I can show you what he built,
                where he worked, and why he might be right for your next idea.
              </strong>
              <div className="pixel-intro-progress" aria-hidden="true"><i /></div>
              <button className="pixel-intro-enter" type="button" onClick={enterChat}>
                Ask me anything <ArrowRight size={15} />
              </button>
            </div>
          ) : (
            <>
              <header>
                <div className="pet-chat-avatar">
                  <Image src="/assets/pixel-mascot.png" alt="" fill sizes="52px" />
                  <i />
                </div>
                <div>
                  <p>PIXEL / PORTFOLIO GUIDE</p>
                  <strong>Dhruv knowledge core</strong>
                  <span><i /> Ready for questions</span>
                </div>
                <button type="button" onClick={() => setOpen(false)} aria-label="Close Pixel">
                  <X size={17} />
                </button>
              </header>

              <div className="pixel-console-status" aria-hidden="true">
                <span>FAQ ENGINE</span>
                <i />
                <span>8 SIGNALS LOADED</span>
                <i />
                <span>LOCAL / FAST</span>
              </div>

              <div className="pet-chat-log" ref={logRef} aria-live="polite">
                {messages.map((message) => (
                  <article className={message.from} key={message.id}>
                    {message.from === "pixel" && (
                      <span className="pixel-message-mark"><Bot size={12} /></span>
                    )}
                    <div>
                      <p>{message.text}</p>
                      {message.action && (
                        <a
                          href={message.action.href}
                          target={message.action.external ? "_blank" : undefined}
                          rel={message.action.external ? "noreferrer" : undefined}
                          onClick={() => {
                            if (message.action?.href.startsWith("#")) setOpen(false);
                          }}
                        >
                          {message.action.label} <ArrowUpRight size={13} />
                        </a>
                      )}
                    </div>
                  </article>
                ))}

                {thinking && (
                  <article className="pet pixel-thinking" aria-label="Pixel is thinking">
                    <span className="pixel-message-mark"><Bot size={12} /></span>
                    <div><i /><i /><i /></div>
                  </article>
                )}
              </div>

              <div className="pet-prompts" aria-label="Suggested questions">
                <div>
                  <MessageCircleQuestion size={13} />
                  <span>Choose a signal</span>
                </div>
                <div className="pet-prompt-grid">
                  {faqs.map((faq) => {
                    const TopicIcon = faq.icon;
                    return (
                      <button
                        type="button"
                        onClick={() => ask(faq.label)}
                        key={faq.id}
                        disabled={thinking}
                      >
                        <TopicIcon size={14} />
                        <span>{faq.shortLabel}</span>
                        <ArrowUpRight size={11} />
                      </button>
                    );
                  })}
                </div>
              </div>

              <form onSubmit={onSubmit}>
                <label className="sr-only" htmlFor="pet-question">Ask Pixel about Dhruv</label>
                <input
                  ref={inputRef}
                  id="pet-question"
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Ask Pixel about Dhruv…"
                  autoComplete="off"
                  disabled={thinking}
                />
                <button type="submit" aria-label="Send question" disabled={!input.trim() || thinking}>
                  <Send size={16} />
                </button>
              </form>
            </>
          )}
        </section>
      )}

      {!open && (
        <span className="pet-nudge">
          <small>NEW SIGNAL</small>
          <strong>Meet your portfolio guide</strong>
          <ArrowUpRight size={13} />
        </span>
      )}
      <button
        className="pet-character"
        type="button"
        onClick={openPixel}
        aria-label={open ? "Close Pixel" : "Meet Pixel, Dhruv’s portfolio guide"}
        aria-expanded={open}
      >
        <Image
          src="/assets/pixel-mascot.png"
          alt=""
          fill
          sizes="132px"
          className="pet-character-image"
        />
        <span><Sparkles size={14} /></span>
      </button>
    </aside>
  );
}
