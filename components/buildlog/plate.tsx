"use client";

import { useState } from "react";

/**
 * An image slot that needs no wiring.
 *
 * Drop a file at the expected path and it appears on the next load. Until one
 * exists the monogram is shown instead, so the layout is always the right
 * shape and a missing file never looks like a broken page.
 *
 * It uses a plain <img> rather than next/image on purpose: the optimiser
 * throws on a file that is not there, and the whole point here is that the
 * file may not be there yet.
 */

// Two is enough; each miss costs a failed request.
const EXTENSIONS = ["png", "jpg"];

export function Plate({
  /** Folder under /public/assets, e.g. "log" or "edu". */
  dir,
  /** File name without an extension, normally the item's id. */
  name,
  /** Shown until a file turns up. */
  monogram,
  alt,
  className,
  /** Overrides the lookup when a path is set explicitly in the data. */
  src,
  /** Fills the parent with no frame of its own. */
  bare = false,
}: {
  dir: string;
  name: string;
  monogram: string;
  alt: string;
  className?: string;
  src?: string;
  bare?: boolean;
}) {
  // A dropped file is tried first, so adding one never needs a code change.
  // Anything named in the data is kept as the fallback behind it.
  const candidates = [
    ...EXTENSIONS.map((extension) => `/assets/${dir}/${name}.${extension}`),
    ...(src ? [src] : []),
  ];

  const [attempt, setAttempt] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const exhausted = attempt >= candidates.length;

  return (
    <div
      className={[bare ? "bl-plate-bare" : "bl-plate-slot", className]
        .filter(Boolean)
        .join(" ")}
    >
      {/* always drawn, and simply covered once a real file loads */}
      <span aria-hidden="true">{monogram}</span>

      {!exhausted && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={candidates[attempt]}
          alt={alt}
          loading="lazy"
          decoding="async"
          data-loaded={loaded}
          onLoad={() => setLoaded(true)}
          onError={() => {
            setLoaded(false);
            setAttempt((value) => value + 1);
          }}
        />
      )}
    </div>
  );
}
