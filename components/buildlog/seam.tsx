"use client";

/**
 * The joins between the acts.
 *
 * Eight acts met at eight identical gaps, and a gap is not a join: the
 * page went flat every time one thing ended and the next began, and
 * the only thing marking the change was the next heading. Two of the
 * seams already had a curved band of type running over them, which is
 * why those two were the only ones that read as a turn in the page.
 *
 * So every seam gets a mark, and no two are the same object. They are
 * all wordless on purpose. This page already says a great deal and the
 * one thing a join does not need is a sentence announcing it; what it
 * needs is to be a different thing than the last one, so that arriving
 * at it tells the reader, before they have read anything, that the
 * subject just changed.
 *
 * All six are drawn out of the page's own kit: one rule weight, one
 * accent, and shapes that belong to the things the acts are about. A
 * measure before the log, because what follows is dated. A perforation
 * between the log and the case files, because that is where a page is
 * torn out. A stitch before the toolkit. A film rail before the
 * photographs. A thread under the cover, and a flourish before the
 * last page.
 */

export type SeamKind =
  | "thread"
  | "measure"
  | "tear"
  | "stitch"
  | "film"
  | "flourish";

export function Seam({ kind }: { kind: SeamKind }) {
  return (
    <div className={`bl-seam bl-seam-${kind}`} aria-hidden="true">
      {kind === "thread" && (
        <>
          <i className="bl-seam-drop" />
          <b className="bl-seam-bead" />
        </>
      )}

      {kind === "measure" && (
        <>
          <i className="bl-seam-ticks" />
          <b className="bl-seam-pip" />
          <i className="bl-seam-ticks" />
        </>
      )}

      {kind === "tear" && (
        <>
          <b className="bl-seam-notch" />
          <i className="bl-seam-perf" />
          <b className="bl-seam-notch" />
        </>
      )}

      {kind === "stitch" && (
        <>
          <i className="bl-seam-zig" />
          <b className="bl-seam-eye" />
          <i className="bl-seam-zig" />
        </>
      )}

      {kind === "film" && <i className="bl-seam-rail" />}

      {kind === "flourish" && (
        <>
          <i className="bl-seam-hair" />
          <svg className="bl-seam-curl" viewBox="0 0 64 24" role="presentation">
            <path d="M2 18c8 0 11-14 20-14 7 0 8 11 1 11-6 0-7-9 2-9 8 0 11 12 19 12 7 0 11-5 18-5" />
          </svg>
          <i className="bl-seam-hair" />
        </>
      )}
    </div>
  );
}

export default Seam;
