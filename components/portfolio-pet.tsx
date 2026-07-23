"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, MessageCircle, Send, X } from "lucide-react";

type ChatMessage = {
  from: "pet" | "user";
  text: string;
};

const faqs = [
  {
    label: "Who is Dhruv?",
    keywords: ["who", "about", "dhruv", "introduce"],
    answer:
      "Dhruv Reddy is a full-stack engineer and applied AI builder from Hyderabad. He enjoys turning difficult product ideas into polished, useful systems.",
  },
  {
    label: "What does he build?",
    keywords: ["build", "skills", "stack", "technology", "technologies"],
    answer:
      "Dhruv builds full-stack platforms, RAG and NLP systems, data products, and machine-learning workflows using React, Vue, Node.js, Flask, Python, MongoDB, Redis, SQL, and Firebase.",
  },
  {
    label: "Show me his projects",
    keywords: ["project", "work", "portfolio", "codesync", "rag", "quiz"],
    answer:
      "Highlights include CodeSync, Healthcare OS, QuizMaster, Legal RAG, Tender NLP, Groundwater ML, and Ascend. Scroll through the 3D project flight to see all seven.",
  },
  {
    label: "Work experience?",
    keywords: ["experience", "intern", "job", "company", "leadership"],
    answer:
      "Dhruv worked as a full-stack intern at Axon Development, led AI research at OTBI, founded the ByUsForU digital studio, and served as president of ASTRA at MVSR.",
  },
  {
    label: "Education?",
    keywords: ["education", "college", "iit", "iitm", "degree", "diploma", "cgpa"],
    answer:
      "He is pursuing B.E. in CSIT at MVSR with a 9.43 CGPA. At IIT Madras, he completed the Foundation and Programming Diploma stages and is currently pursuing the Diploma in Data Science.",
  },
  {
    label: "Biggest achievement?",
    keywords: ["achievement", "award", "winner", "hackathon", "dynamo"],
    answer:
      "Dhruv and his team won the national-level Data Dynamo 2.0 hackathon, building CodeSync in 24 hours among 65+ teams and 300+ participants.",
  },
  {
    label: "Can I hire him?",
    keywords: ["hire", "contact", "email", "freelance", "available"],
    answer:
      "Yes—Dhruv is open to ambitious engineering, AI, and freelance work. Email him at dhruvreddysripathi2006@gmail.com.",
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
    ? match.faq.answer
    : "I know Dhruv’s projects, skills, experience, education, hackathon win, and availability. Try asking about one of those.";
}

export function PortfolioPet({ visible }: { visible: boolean }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      from: "pet",
      text: "Hey! I’m Dhruv’s portfolio companion. Ask me anything about him.",
    },
  ]);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    logRef.current?.scrollTo({
      top: logRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const ask = (question: string) => {
    const cleanQuestion = question.trim();
    if (!cleanQuestion) return;
    setMessages((current) => [
      ...current,
      { from: "user", text: cleanQuestion },
      { from: "pet", text: answerFor(cleanQuestion) },
    ]);
    setInput("");
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    ask(input);
  };

  return (
    <aside className={`portfolio-pet ${visible ? "is-visible" : ""}`}>
      {open && (
        <section className="pet-chat" role="dialog" aria-label="Ask about Dhruv">
          <header>
            <div className="pet-chat-avatar">
              <Image src="/assets/dhruv-hero.png" alt="" fill sizes="42px" />
            </div>
            <div>
              <strong>Dhruv’s companion</strong>
              <span><i /> Portfolio guide</span>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close chat">
              <X size={17} />
            </button>
          </header>

          <div className="pet-chat-log" ref={logRef} aria-live="polite">
            {messages.map((message, index) => (
              <p className={message.from} key={`${message.from}-${index}`}>
                {message.text}
              </p>
            ))}
          </div>

          <div className="pet-prompts" aria-label="Suggested questions">
            {faqs.slice(0, 4).map((faq) => (
              <button type="button" onClick={() => ask(faq.label)} key={faq.label}>
                {faq.label}
              </button>
            ))}
          </div>

          <form onSubmit={onSubmit}>
            <label className="sr-only" htmlFor="pet-question">Ask about Dhruv</label>
            <input
              id="pet-question"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about Dhruv…"
              autoComplete="off"
            />
            <button type="submit" aria-label="Send question">
              <Send size={16} />
            </button>
          </form>

          <a href="mailto:dhruvreddysripathi2006@gmail.com">
            Contact Dhruv directly <ArrowUpRight size={14} />
          </a>
        </section>
      )}

      {!open && <span className="pet-nudge">Ask me about Dhruv</span>}
      <button
        className="pet-character"
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-label={open ? "Close portfolio companion" : "Ask Dhruv’s portfolio companion"}
        aria-expanded={open}
      >
        <Image
          src="/assets/dhruv-hero.png"
          alt=""
          fill
          sizes="96px"
          className="pet-character-image"
        />
        <span><MessageCircle size={14} /></span>
      </button>
    </aside>
  );
}
