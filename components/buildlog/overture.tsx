"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { profile } from "@/lib/portfolio-data";

/**
 * The cover of the log book, lifted away on arrival.
 *
 * Renders nothing on the server, so the page underneath is complete before
 * this ever mounts. Anyone who has asked for reduced motion skips it.
 */
export function Overture() {
  const [play, setPlay] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const count = useRef<HTMLSpanElement>(null);
  const rule = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // Plays on every arrival. Only a reduced-motion preference skips it.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    queueMicrotask(() => setPlay(true));
  }, []);

  useEffect(() => {
    if (!play) return;

    const node = root.current;
    if (!node) return;

    document.documentElement.classList.add("bl-locked");

    const ticker = { n: 0 };
    const timeline = gsap.timeline({
      onComplete: () => {
        document.documentElement.classList.remove("bl-locked");
        setPlay(false);
      },
    });

    timeline
      .from(node.querySelectorAll(".bl-overture-line > span"), {
        yPercent: 110,
        duration: 1,
        ease: "power3.out",
        stagger: 0.09,
      })
      .to(
        rule.current,
        { scaleX: 1, duration: 1.3, ease: "power2.inOut" },
        0.1,
      )
      .to(
        ticker,
        {
          n: 100,
          duration: 1.5,
          ease: "power1.inOut",
          onUpdate: () => {
            if (count.current) {
              count.current.textContent = String(Math.round(ticker.n)).padStart(3, "0");
            }
          },
        },
        0,
      )
      .to(node.querySelectorAll(".bl-overture-fade"), {
        opacity: 0,
        duration: 0.4,
        ease: "power2.in",
      })
      // the cover lifts, and the page is underneath
      .to(node, {
        yPercent: -100,
        duration: 1.05,
        ease: "power4.inOut",
      });

    return () => {
      timeline.kill();
      document.documentElement.classList.remove("bl-locked");
    };
  }, [play]);

  if (!play) return null;

  return (
    <div className="bl-overture" ref={root} aria-hidden="true">
      <div className="bl-overture-inner">
        <p className="bl-overture-kicker bl-overture-fade">
          {profile.location} · {profile.coords}
        </p>

        <h2 className="bl-overture-title">
          <span className="bl-overture-line">
            <span>The</span>
          </span>
          <span className="bl-overture-line">
            <span>
              Build <em>Log</em>
            </span>
          </span>
        </h2>

        <span className="bl-overture-rule" ref={rule} />

        <p className="bl-overture-foot bl-overture-fade">
          <span>{profile.full}</span>
          <span className="bl-overture-count">
            <span ref={count}>000</span>
          </span>
        </p>
      </div>
    </div>
  );
}
