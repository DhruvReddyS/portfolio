import { useEffect, useState } from "react";

/**
 * The cover holds the page back, and hands it its entrance on the way out.
 *
 * The hero has an opening: the ground settles, the portrait rises into it,
 * the name resolves out of a blur, and the detail arrives after both. All of
 * it used to run on mount, which is while the cover was still up, so it had
 * been over for three seconds by the time anyone could see it. What you got
 * was a sheet fading onto a hero that had already finished arriving, and no
 * amount of easing on the fade can fix that: there was nothing underneath it
 * to cut to.
 *
 * So anything that opens on arrival asks here first. The cover raises the
 * curtain at the moment its own pixels start to go, which is what makes the
 * two halves overlap instead of queue.
 *
 * The held flag is rendered, not written to the DOM from script. Writing it
 * to <html> before hydration works, but React then finds an attribute it did
 * not render and says so; rendering it means the server and the first client
 * pass agree, and the wordmark's CSS animation is paused from frame zero
 * rather than from whenever the bundle happens to arrive.
 */

/** Nothing may hold the page longer than this, whatever went wrong. */
const SAFETY = 11000;

/** The cover plays unless motion is unwelcome, which is the one case it sits out. */
function coverWillPlay() {
  if (typeof window === "undefined") return false;
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

let open = !coverWillPlay();
const waiting = new Set<() => void>();

if (!open) window.setTimeout(openCurtain, SAFETY);

/** The cover is going. Everything that was waiting for it starts now. */
export function openCurtain() {
  if (open) return;
  open = true;
  const run = [...waiting];
  waiting.clear();
  for (const fn of run) fn();
}

/**
 * Run this once the cover is going, or at once if it was never up.
 * Returns the usual unsubscribe, for a component that leaves before it does.
 */
export function whenCurtainOpens(run: () => void): () => void {
  if (open) {
    run();
    return () => {};
  }
  waiting.add(run);
  return () => {
    waiting.delete(run);
  };
}

/**
 * True until the cover starts leaving.
 *
 * Starts true on the server and on the client's first pass, so the markup
 * matches, and anything keyed off it is held from the first painted frame.
 * Where there is no cover at all, the effect clears it immediately after
 * hydration, which is a frame nobody sees.
 */
export function useCurtainHeld() {
  const [held, setHeld] = useState(true);
  useEffect(() => whenCurtainOpens(() => setHeld(false)), []);
  return held;
}
