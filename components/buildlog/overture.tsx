"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { profile } from "@/lib/portfolio-data";

/**
 * The cover of the book, lifted away on arrival.
 *
 * It used to count 000 to 100 while a rule grew across the screen. Nothing
 * on this page is loading at that point, so the number was describing
 * nothing: it was there because every site has one, which is the whole
 * problem with it. A percentage you invented is the loudest possible way to
 * tell someone the page was assembled rather than made.
 *
 * What is left is what a book actually puts on its cover, and nothing else:
 * the title, whose it is, where and when. The frame rules itself in, the
 * title sets, and the sheet lifts. Under two seconds, once, and it never
 * claims to be doing any work.
 *
 * Renders nothing on the server, so the page underneath is complete before
 * this ever mounts. Anyone who has asked for reduced motion skips it.
 */
export function Overture() {
  const [play, setPlay] = useState(false);
  const root = useRef<HTMLDivElement>(null);

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

    const timeline = gsap.timeline({
      defaults: { ease: "power3.out" },
      onComplete: () => {
        document.documentElement.classList.remove("bl-locked");
        setPlay(false);
      },
    });

    timeline
      // the frame is ruled on, across first and then down
      .from(node.querySelectorAll(".bl-cover-frame > i"), {
        scaleX: 0,
        duration: 0.62,
        ease: "power2.inOut",
        stagger: 0.06,
      })
      .from(
        node.querySelectorAll(".bl-cover-frame > b"),
        { scaleY: 0, duration: 0.55, ease: "power2.inOut", stagger: 0.06 },
        0.14,
      )
      // then the title sets, line by line, out from behind its own baseline
      .from(
        node.querySelectorAll(".bl-cover-line > span"),
        { yPercent: 115, duration: 0.78, stagger: 0.08 },
        0.3,
      )
      .from(
        node.querySelectorAll(".bl-cover-meta"),
        { opacity: 0, y: 10, duration: 0.5, stagger: 0.07 },
        0.62,
      )
      // and the sheet is turned
      .to(node, { yPercent: -100, duration: 0.95, ease: "power4.inOut" }, 1.26);

    return () => {
      timeline.kill();
      document.documentElement.classList.remove("bl-locked");
    };
  }, [play]);

  if (!play) return null;

  return (
    <div className="bl-cover" ref={root} aria-hidden="true">
      <div className="bl-cover-frame">
        <i /> <i /> <b /> <b />

        <h2 className="bl-cover-title">
          <span className="bl-cover-line">
            <span>The</span>
          </span>
          <span className="bl-cover-line">
            <span>
              Build <em>Log</em>
            </span>
          </span>
        </h2>

        <p className="bl-cover-meta bl-cover-by">{profile.full}</p>

        <p className="bl-cover-meta bl-cover-foot">
          <span>{profile.location}</span>
          <span>{profile.coords}</span>
        </p>
      </div>
    </div>
  );
}
