"use client";

import { Settle } from "./settle";

/**
 * One sentence between the cover and the log, read to you at the speed
 * you are already going.
 *
 * The page says what he has done in seven acts of evidence and never once
 * says what he thinks, which is the thing a reader decides on. This is the
 * one place it does, and it is set to be read rather than seen.
 *
 * The arrival is <Settle />, the same way the studio's own paragraph comes
 * in: the words start crowded, over-size and tilted, and straighten into
 * the sentence as the scroll reaches them. It is the one mechanic on this
 * page worth using twice, because what it imitates is the eye moving along
 * a line and that is what both of these paragraphs are for.
 *
 * Scrubbed rather than played. A sentence that animates on its own runs
 * once, at its own pace, probably before you looked at it; tied to the
 * scroll it cannot finish ahead of you, and you can push it back to read a
 * word again.
 *
 * Not pinned. Pinning would hold the page still while the line fills,
 * which is the version of this that fights a thumb on a phone.
 */
export function Statement({
  children,
  id,
  cite,
}: {
  children: string;
  id?: string;
  /** The small line under it, if the quote wants signing. */
  cite?: string;
}) {
  return (
    <figure className="bl-saybox">
      <Settle as="blockquote" className="bl-statement" id={id}>
        {children}
      </Settle>

      {cite && (
        <figcaption className="bl-saycite">
          <i aria-hidden="true" />
          {cite}
        </figcaption>
      )}
    </figure>
  );
}

export default Statement;
