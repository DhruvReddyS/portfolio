"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface TypingKeyboardProps extends React.HTMLAttributes<HTMLDivElement> {
  autoTypeText?: string;
  loop?: boolean;
  onTypingComplete?: () => void;
  onEnter?: () => void;
  typingSpeed?: [number, number];
  scale?: number;
  accentColor?: string;
  secondaryAccent?: string;
}

function Key({
  size = "",
  accent = "",
  className = "",
  onClick,
  ariaLabel,
}: {
  size?: string;
  accent?: string;
  className?: string;
  onClick?: () => void;
  ariaLabel?: string;
}) {
  const sizeClass = size ? `--${size}` : "";
  const accentClass = accent === "b" ? " tk-face--b" : accent === "o" ? " tk-face--o" : "";
  const faceClass = (face: "front" | "back" | "right" | "left" | "top" | "bottom") => {
    const shade = accentClass === " tk-face--b"
      ? face === "front" ? " tk-face--b3" : face === "left" || face === "bottom" ? " tk-face--b2" : " tk-face--b1"
      : accentClass === " tk-face--o"
        ? face === "front" ? " tk-face--o3" : face === "left" || face === "bottom" ? " tk-face--o2" : " tk-face--o1"
        : "";
    return `tk-key__${face} tk-face${size ? ` tk-key__${face}${sizeClass}` : ""}${shade}`;
  };

  return (
    <div
      className={`tk-key tk-flex${size ? ` tk-key${sizeClass}` : ""}${className ? ` ${className}` : ""}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={ariaLabel}
      onKeyDown={onClick ? (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick();
        }
      } : undefined}
    >
      <div className={faceClass("front")} />
      <div className={faceClass("back")} />
      <div className={faceClass("right")} />
      <div className={faceClass("left")} />
      <div className={faceClass("top")} />
      <div className={faceClass("bottom")} />
    </div>
  );
}

const KEY_MAP: Record<string, number> = {
  q: 15, w: 16, e: 17, r: 18, t: 19, y: 20, u: 21, i: 22, o: 23, p: 24,
  a: 29, s: 30, d: 31, f: 32, g: 33, h: 34, j: 35, k: 36, l: 37,
  z: 41, x: 42, c: 43, v: 44, b: 45, n: 46, m: 47,
  " ": 56, "\n": 39, "\b": 27,
};

const HUMAN_SCRIPT = [
  { type: "text", value: "Hi, I’m Dhruv Reddy.\n" },
  { type: "pause", value: 520 },
  { type: "text", value: "I build full-stcak" },
  { type: "pause", value: 380 },
  { type: "backspace", value: 3 },
  { type: "text", value: "ack products, applied AI systems,\n" },
  { type: "pause", value: 420 },
  { type: "text", value: "and data experiences.\n" },
  { type: "pause", value: 560 },
  { type: "text", value: "Ready to take a look?" },
] as const;

function humanDelay(char: string, index: number, min: number, max: number) {
  if (char === "\n") return 270;
  if (char === "." || char === "?") return 460;
  if (char === ",") return 235;
  if (char === " ") return index % 4 === 0 ? 118 : 76;
  const burst = [0.42, 0.56, 0.48, 0.9, 0.52, 0.44, 1.14, 0.62][index % 8];
  return Math.round(min + (max - min) * burst);
}

export function TypingKeyboard({
  className,
  autoTypeText,
  loop = false,
  onTypingComplete,
  onEnter,
  typingSpeed = [28, 92],
  scale = 0.8,
  accentColor = "#bdf73c",
  secondaryAccent = "#f7b955",
  ...props
}: TypingKeyboardProps) {
  const kbRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const keyTimersRef = useRef(new Set<ReturnType<typeof setTimeout>>());
  const [displayText, setDisplayText] = useState("");
  const [ready, setReady] = useState(false);
  const [entering, setEntering] = useState(false);
  const minTypingDelay = typingSpeed[0];
  const maxTypingDelay = typingSpeed[1];

  const pressKey = (char: string, strength: "normal" | "heavy" | "enter" = "normal") => {
    const keyboard = kbRef.current;
    if (!keyboard) return;
    const keys = keyboard.querySelectorAll<HTMLDivElement>(".tk-key");
    const index = KEY_MAP[char.toLowerCase()] ?? KEY_MAP[" "];
    const key = keys[index];
    if (!key) return;

    key.classList.add("tk-key--down", `tk-key--${strength}`);
    if (strength === "heavy") keyboard.classList.add("tk-space-impact");
    if (strength === "enter") keyboard.classList.add("tk-enter-impact");
    const hold = strength === "enter" ? 260 : strength === "heavy" ? 130 : 76;
    const timer = setTimeout(() => {
      key.classList.remove("tk-key--down", `tk-key--${strength}`);
      keyboard.classList.remove("tk-space-impact", "tk-enter-impact");
      keyTimersRef.current.delete(timer);
    }, hold);
    keyTimersRef.current.add(timer);
  };

  const activate = () => {
    if (!ready || entering) return;
    setEntering(true);
    pressKey("\n", "enter");
    timerRef.current = setTimeout(() => onEnter?.(), 760);
  };

  useEffect(() => {
    if (!ready) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        event.preventDefault();
        activate();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  });

  useEffect(() => {
    let alive = true;
    let scriptIndex = 0;
    let charIndex = 0;
    let rendered = "";
    const keyTimers = keyTimersRef.current;
    const script = autoTypeText
      ? [{ type: "text", value: autoTypeText } as const]
      : HUMAN_SCRIPT;

    const finish = () => {
      onTypingComplete?.();
      timerRef.current = setTimeout(() => {
        if (!alive) return;
        setReady(true);
        kbRef.current?.classList.add("tk-enter-ready");
      }, 860);
    };

    const run = () => {
      if (!alive) return;
      const operation = script[scriptIndex];
      if (!operation) {
        finish();
        return;
      }

      if (operation.type === "pause") {
        scriptIndex += 1;
        charIndex = 0;
        timerRef.current = setTimeout(run, operation.value);
        return;
      }

      if (operation.type === "backspace") {
        if (charIndex < operation.value) {
          rendered = rendered.slice(0, -1);
          setDisplayText(rendered);
          pressKey("\b");
          charIndex += 1;
          timerRef.current = setTimeout(run, charIndex === 1 ? 145 : 82);
          return;
        }
        scriptIndex += 1;
        charIndex = 0;
        timerRef.current = setTimeout(run, 190);
        return;
      }

      const char = operation.value[charIndex];
      if (char !== undefined) {
        rendered += char;
        setDisplayText(rendered);
        pressKey(char, char === " " ? "heavy" : char === "\n" ? "enter" : "normal");
        charIndex += 1;
        timerRef.current = setTimeout(run, humanDelay(char, charIndex, minTypingDelay, maxTypingDelay));
        return;
      }

      scriptIndex += 1;
      charIndex = 0;
      timerRef.current = setTimeout(run, 70);
    };

    timerRef.current = setTimeout(run, 1050);
    return () => {
      alive = false;
      if (timerRef.current) clearTimeout(timerRef.current);
      keyTimers.forEach(clearTimeout);
      keyTimers.clear();
    };
  }, [autoTypeText, loop, maxTypingDelay, minTypingDelay, onTypingComplete]);

  return (
    <div
      className={cn("tk-container", ready && "tk-ready", entering && "tk-entering", className)}
      style={{
        "--tk-scale": scale,
        "--tk-accent": accentColor,
        "--tk-secondary": secondaryAccent,
      } as React.CSSProperties}
      {...props}
    >
      <span className="tk-sr-only">
        Hi, I’m Dhruv Reddy. I build full-stack products, applied AI systems, and data experiences. Ready to take a look? Press Enter to enter the portfolio.
      </span>
      <div className="tk-dust" aria-hidden="true" />
      <div className="tk-main tk-flex">
        <div className="tk-keyboard tk-flex" ref={kbRef}>
          <div className="tk-monitor-shell tk-flex">
            <div className="tk-monitor-bloom" aria-hidden="true" />
            <div className="tk-screen" aria-live="polite">
              <span>{displayText}</span>
              <i className="tk-caret" aria-hidden="true" />
              {ready && (
                <button type="button" onClick={activate} aria-label="Enter portfolio">
                  [ ENTER ]
                </button>
              )}
            </div>
          </div>

          <div className="tk-keyboard__front tk-face" />
          <div className="tk-keyboard__back tk-face" />
          <div className="tk-keyboard__right tk-face" />
          <div className="tk-keyboard__left tk-face" />
          <div className="tk-keyboard__top tk-face">
            <div className="tk-keys">
              <Key accent="b" />
              {Array.from({ length: 12 }).map((_, index) => <Key key={`r1-${index}`} />)}
              <Key size="w2" accent="b" />
            </div>
            <div className="tk-keys">
              <Key size="w2" accent="b" />
              {Array.from({ length: 12 }).map((_, index) => <Key key={`r2-${index}`} />)}
              <Key accent="b" />
            </div>
            <div className="tk-keys">
              <Key size="w3" accent="b" />
              {Array.from({ length: 10 }).map((_, index) => <Key key={`r3-${index}`} />)}
              <Key size="w2" accent="o" className="tk-physical-enter" onClick={activate} ariaLabel="Press the physical Enter key" />
            </div>
            <div className="tk-keys">
              <Key size="w2" accent="b" />
              {Array.from({ length: 11 }).map((_, index) => <Key key={`r4-${index}`} />)}
              <Key size="w3" accent="b" />
            </div>
            <div className="tk-keys">
              <Key accent="b" />
              <Key accent="o" />
              {Array.from({ length: 2 }).map((_, index) => <Key key={`r5a-${index}`} accent="b" />)}
              <Key size="w6" className="tk-spacebar" />
              {Array.from({ length: 5 }).map((_, index) => <Key key={`r5b-${index}`} accent="b" />)}
            </div>
          </div>
          <div className="tk-keyboard__bottom tk-face" />
        </div>
      </div>
    </div>
  );
}

export default TypingKeyboard;
