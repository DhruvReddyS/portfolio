"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { LoadingAnimation } from "@/components/ui/loading-animation";
import { portraitFrames } from "@/lib/portrait-frames";
import { profile } from "@/lib/portfolio-data";

/**
 * The cover of the book, held over the page until the page is built.
 *
 * His own photograph, at 66 by 53, one bit per cell. The pixels fly in and
 * settle into him, a design-tool layer walks itself across the frame measuring
 * what it finds, and a bar fills along the foot. It holds one block short of
 * full until the type has loaded, the hero plate has decoded and the browser
 * has had two clear frames to lay the page out, which is the point at which
 * scrolling is actually smooth rather than merely possible.
 *
 * So the number on the bar is not a number anyone made up: the sheet is up for
 * as long as there is something to wait for, with a floor of four and a half
 * seconds so it is a cover rather than a flash, and a ceiling so a file that
 * never arrives cannot lock the page behind it.
 *
 * Renders nothing on the server, so the page underneath is complete before
 * this ever mounts. Anyone who has asked for reduced motion skips it.
 */

/** Long enough to read as a cover. */
const FLOOR = 4600;
/** And never longer than this, whatever is still in flight. */
const CEILING = 6500;
/** How long the pixels take to blow apart and the sheet to fade after them. */
const EXIT = 620;

/** Resolves when the file is decoded, or when it is clear it will not be. */
function decoded(src: string) {
  return new Promise<void>((resolve) => {
    const image = new Image();
    image.onload = () => resolve();
    image.onerror = () => resolve();
    image.src = src;
    if (image.complete) resolve();
  });
}

export function Cover() {
  /** Null until the sheet is up, and null again once it has gone. */
  const [boot, setBoot] = useState<{ font: string } | null>(null);
  const [ready, setReady] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const lock = useRef(false);
  const done = useRef(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    queueMicrotask(() => {
      // The canvas draws its labels with ctx.font, which cannot read a custom
      // property, so the family next/font generated has to be resolved here
      // and handed over as a real name.
      const mono = getComputedStyle(document.documentElement)
        .getPropertyValue("--font-mono")
        .trim();
      setBoot({
        font: mono ? `${mono}, ui-monospace, monospace` : "ui-monospace, monospace",
      });
    });
  }, []);

  const play = boot !== null;

  useEffect(() => {
    if (!play) return;

    document.documentElement.classList.add("bl-locked");
    lock.current = true;
    let alive = true;
    const settle = () => {
      // two clear frames: one for the layout, one to prove it held
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          if (alive) setReady(true);
        }),
      );
    };

    const ceiling = window.setTimeout(settle, CEILING);
    Promise.all([
      document.fonts ? document.fonts.ready : Promise.resolve(),
      decoded("/assets/dhruv-hero.png"),
    ]).then(settle);

    return () => {
      alive = false;
      window.clearTimeout(ceiling);
    };
  }, [play]);

  // Give the page back the moment the sheet starts to go, so the first flick
  // of the wheel lands on the hero rather than on nothing.
  const release = useCallback(() => {
    if (!lock.current) return;
    lock.current = false;
    document.documentElement.classList.remove("bl-locked");
  }, []);

  /*
   * Take the sheet away. The animation calls this when its pixels have blown
   * apart, and the timer below calls it if the animation never gets there:
   * the whole thing runs on requestAnimationFrame, which a browser is free to
   * stop delivering (a background tab, a throttled frame loop, a device that
   * decided to sleep). A loader that cannot finish has locked the page behind
   * it, so finishing cannot be allowed to depend on frames arriving.
   */
  const finish = useCallback(() => {
    if (done.current) return;
    done.current = true;
    release();
    setLeaving(true);
    window.setTimeout(() => setBoot(null), EXIT);
  }, [release]);

  useEffect(() => {
    if (!play) return;
    // the ceiling is when readiness is forced; this is that plus the time the
    // pixels need to blow apart, and a little slack for a slow frame
    const bail = window.setTimeout(finish, CEILING + EXIT + 900);
    return () => window.clearTimeout(bail);
  }, [play, finish]);

  useEffect(() => () => release(), [release]);

  if (!boot) return null;

  return (
    <div className="bl-cover-wrap" data-leaving={leaving} aria-hidden="true">
      <LoadingAnimation
        className="bl-cover-sheet"
        loader
        ready={ready}
        minDuration={FLOOR}
        frames={portraitFrames}
        font={boot.font}
        title="The Build Log"
        name={profile.full}
        role="Full-stack & applied AI"
        loadingLabel="Setting the page"
        readyLabel="Ready"
        footer={[profile.full, profile.location, profile.coords]}
        size={0.64}
        spread={1.15}
        colors={{
          tint: "#070605",
          ink: "#f2efe6",
          accent: "#e05a2b",
          blue: "#7f9d8e",
        }}
        onComplete={finish}
      />
    </div>
  );
}
