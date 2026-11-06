"use client";

/**
 * The picture a build gets when there is no screenshot of it.
 *
 * Half of these are back-ends, hackathon submissions and a thing that never
 * shipped, so there is no screen to photograph and never will be. The
 * alternative was a ruled field with the stack typed across it, which looked
 * like a card that had not finished loading.
 *
 * So the card prints a banner instead: the project's own mark where it has
 * one, its initials set in the poster face where it does not, the name, and
 * the four things it is built out of. The marks keep their own colours. They
 * belong to the projects, not to this page, and a wall where every logo has
 * been recoloured to match the wall is a wall of one project.
 */

import Image from "next/image";
import { servable } from "@/lib/image-sizes";

export type BannerLogo = { src: string; width: number; height: number };

/** A repeatable angle per project, so a card looks the same twice. */
function lean(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) % 997;
  return h / 997;
}

export function ProjectBanner({
  id,
  name,
  stack,
  logo,
  monogram,
}: {
  id: string;
  name: string;
  stack: string[];
  logo?: BannerLogo;
  monogram: string;
}) {
  const tilt = lean(id);

  return (
    <div
      className="bl-banner"
      data-has-logo={logo ? "true" : "false"}
      style={
        {
          // the wash comes from a different corner on every card
          "--bl-banner-x": `${18 + tilt * 64}%`,
          "--bl-banner-y": `${tilt > 0.5 ? 86 : 12}%`,
        } as React.CSSProperties
      }
    >
      <span className="bl-banner-grid" aria-hidden="true" />

      {/*
        The kind used to be printed here as well as on the card's own
        pill, which sits directly over this line: two labels a hair
        apart saying the same four words. The pill stays, because it is
        the one that is set to be read; this one went.
      */}

      <div className="bl-banner-mark">
        {logo ? (
          // declared at a width the optimiser will serve, not the file's own
          <Image src={logo.src} alt="" {...servable(logo.width, logo.height)} />
        ) : (
          <span className="bl-banner-mono" aria-hidden="true">
            {monogram}
          </span>
        )}
      </div>

      <p className="bl-banner-name">{name}</p>

      <p className="bl-banner-stack">
        {stack.slice(0, 4).map((part) => (
          <span key={part}>{part}</span>
        ))}
        {stack.length > 4 && <em>+{stack.length - 4}</em>}
      </p>
    </div>
  );
}

export default ProjectBanner;
