/**
 * Hand-drawn marks, used instead of an icon library.
 *
 * Every path is deliberately imperfect: lines overshoot their corners, circles
 * do not close, and strokes wobble, the way they do when drawn with a pen.
 * Strokes inherit `currentColor` and scale with the `size` prop.
 */

type MarkProps = {
  size?: number;
  className?: string;
  strokeWidth?: number;
};

function Mark({
  size = 16,
  className,
  strokeWidth = 1.6,
  mark,
  children,
}: MarkProps & { mark?: string; children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      /*
       * The class is what lets a mark be drawn on as its section arrives and
       * answer a pointer on whatever is holding it; the name is what lets it
       * answer in its own way, since an arrow leaving and a tick closing are
       * not the same gesture.
       */
      className={["bl-mark", className].filter(Boolean).join(" ")}
      data-mark={mark}
      style={{ flexShrink: 0, overflow: "visible" }}
    >
      {children}
    </svg>
  );
}

/** A pen stroke that leaves the box, the way a real arrow does. */
export function MarkArrow(props: MarkProps) {
  return (
    <Mark mark="arrow" {...props}>
      <path d="M5.5 18.4C9 15 12.4 11.3 18.2 5.6" />
      <path d="M11.4 5.1c2.6-.2 5.2-.3 7.1-.2.2 1.9.1 4.4-.1 7" />
    </Mark>
  );
}

/** Straight arrow, for "keep going down". */
export function MarkArrowDown(props: MarkProps) {
  return (
    <Mark mark="arrowdown" {...props}>
      <path d="M12.1 4.2c.2 5.1.1 10.2-.2 15.3" />
      <path d="M6.8 13.9c1.9 2 3.6 3.8 5.1 5.6 1.6-1.9 3.3-3.8 5-5.4" />
    </Mark>
  );
}

/** An envelope drawn in two strokes without lifting much. */
export function MarkMail(props: MarkProps) {
  return (
    <Mark mark="mail" {...props}>
      <path d="M3.3 6.1c5.8-.5 11.7-.6 17.5-.2.3 4 .3 8 0 12-5.8.4-11.7.3-17.5-.1-.3-3.9-.3-7.8 0-11.7z" />
      <path d="M3.9 6.8c2.9 2.6 5.6 4.8 8.2 6.5 2.6-1.8 5.3-4 8.1-6.6" />
    </Mark>
  );
}

/** The octocat silhouette, simplified to a drawn blob and legs. */
export function MarkGithub(props: MarkProps) {
  return (
    <Mark mark="github" {...props}>
      <path d="M9.2 20.6c-3.9 1.1-3.9-2.1-5.5-2.6m11 4.1c0-1.9.1-3.4.1-4.1 0-1-.3-1.6-.7-2 3.1-.3 6.3-1.5 6.3-6.6a5 5 0 0 0-1.4-3.6 4.7 4.7 0 0 0-.1-3.5s-1.1-.3-3.6 1.4a12.3 12.3 0 0 0-6.4 0C6.3 1.9 5.2 2.3 5.2 2.3a4.7 4.7 0 0 0-.2 3.5A5.1 5.1 0 0 0 3.6 9.5c0 5 3.1 6.2 6.1 6.6-.4.4-.7 1-.8 1.8v4.2" />
    </Mark>
  );
}

export function MarkLinkedin(props: MarkProps) {
  return (
    <Mark mark="linkedin" {...props}>
      <path d="M4.4 9.3c.1 4 .1 7.9 0 11.5" />
      <path d="M4.4 4.6c.1.4.1.9 0 1.3" strokeWidth={2.6} />
      <path d="M9.5 20.8c-.1-3.6-.1-7.5 0-11.5" />
      <path d="M9.6 12.8c1.5-3 4.6-3.3 6.5-2.1 1.3.8 1.7 2.3 1.8 3.8.1 1.9.1 4.1 0 6.3" />
    </Mark>
  );
}

/** A sheet of paper with a folded corner and two ruled lines. */
export function MarkPaper(props: MarkProps) {
  return (
    <Mark mark="paper" {...props}>
      <path d="M5.4 2.8c3.1-.3 6.2-.3 9.3-.1 1.8 1.8 3.5 3.6 5 5.4.2 4.4.2 8.8-.1 13.1-4.7.3-9.4.3-14.1 0-.3-6.1-.3-12.2-.1-18.4z" />
      <path d="M14.4 2.9c-.1 1.8-.1 3.6 0 5.4 1.8.1 3.6.1 5.3 0" />
      <path d="M8.4 13.4c2.4-.2 4.8-.2 7.2 0" />
      <path d="M8.4 16.8c2.4-.2 4.8-.2 7.2 0" />
    </Mark>
  );
}

/** A rosette, scribbled rather than stamped. */
export function MarkRosette(props: MarkProps) {
  return (
    <Mark mark="rosette" {...props}>
      <path d="M12.1 2.6c3.5-.1 6.4 2.7 6.4 6.2.1 3.5-2.7 6.4-6.2 6.5-3.6.1-6.5-2.7-6.5-6.2 0-3.4 2.8-6.4 6.3-6.5z" />
      <path d="M8.4 14.3c-.7 2.4-1.3 4.8-1.8 7.1 1.9-1 3.7-1.9 5.4-2.7 1.8.9 3.6 1.8 5.5 2.8-.5-2.4-1.1-4.8-1.8-7.2" />
    </Mark>
  );
}

/** A cross used both as "expand" and, rotated, as "close". */
export function MarkCross(props: MarkProps) {
  return (
    <Mark mark="cross" {...props}>
      <path d="M12.2 4.4c-.2 5.1-.2 10.2 0 15.3" />
      <path d="M4.5 11.9c5.1-.2 10.2-.2 15.3.1" />
    </Mark>
  );
}

export function MarkClose(props: MarkProps) {
  return (
    <Mark mark="close" {...props}>
      <path d="M5.6 5.2c4.4 4.5 8.8 9 13.1 13.6" />
      <path d="M18.8 5.4C14.3 9.8 9.9 14.3 5.4 18.8" />
    </Mark>
  );
}

/** Three strokes of unequal length, like a jotted list. */
export function MarkLines(props: MarkProps) {
  return (
    <Mark mark="lines" {...props}>
      <path d="M3.8 6.6c5.6-.3 11.2-.3 16.8-.1" />
      <path d="M3.9 12.1c4.4-.3 8.8-.3 13.2-.1" />
      <path d="M3.8 17.6c5.6-.3 11.2-.3 16.7-.1" />
    </Mark>
  );
}

export function MarkDownload(props: MarkProps) {
  return (
    <Mark mark="download" {...props}>
      <path d="M12.1 3.3c.2 4.1.1 8.2-.1 12.3" />
      <path d="M7.6 11.2c1.6 1.7 3.1 3.3 4.4 4.7 1.4-1.5 2.9-3.1 4.3-4.6" />
      <path d="M4.2 18.9c5.3.4 10.5.4 15.7.1" />
    </Mark>
  );
}

/** A desk lamp bulb. Filled rays when lit, bare glass when not. */
export function MarkLamp({ lit = false, ...props }: MarkProps & { lit?: boolean }) {
  return (
    <Mark mark="lamp" {...props}>
      <path d="M12.1 3.4c3.1-.1 5.6 2.4 5.6 5.3 0 2-1.2 3.3-2.1 4.4-.6.7-.9 1.4-1 2.3-1.6.2-3.2.2-4.8 0-.1-.9-.4-1.6-1-2.4-.9-1.1-2-2.4-2-4.3 0-2.9 2.3-5.2 5.3-5.3z" />
      <path d="M9.9 18.3c1.5.2 3 .2 4.5 0" />
      <path d="M10.6 20.9c1 .1 2 .1 3 0" />
      {lit && (
        <>
          <path d="M12.1 1.1v-.9M3.6 9.1h-1M21.6 9.1h-1M5.6 3.1 4.9 2.4M19.1 3.1l.7-.7" />
        </>
      )}
    </Mark>
  );
}

export function MarkSpeaker({ muted = false, ...props }: MarkProps & { muted?: boolean }) {
  return (
    <Mark mark="speaker" {...props}>
      <path d="M11.2 4.6c-1.7 1.4-3.3 2.8-4.7 4.1-1 0-2 0-2.9.1-.2 2.1-.2 4.2 0 6.3.9.1 1.9.1 2.9.1 1.5 1.4 3 2.8 4.6 4.2.3-4.9.3-9.9.1-14.8z" />
      {muted ? (
        <path d="M16.1 9.4c1.5 1.7 3 3.4 4.4 5m0-5c-1.5 1.7-3 3.3-4.4 5" />
      ) : (
        <path d="M15.6 8.9c1.6 2 1.6 4.1 0 6.1m3.1-8.6c2.8 3.5 2.8 7.6 0 11.1" />
      )}
    </Mark>
  );
}

/** A small location pin, for the Hyderabad coordinates. */
export function MarkPin(props: MarkProps) {
  return (
    <Mark mark="pin" {...props}>
      <path d="M12.1 2.6c3.9-.1 6.9 3 6.8 6.7-.1 4.4-4.1 8.9-6.8 12.1-2.8-3.3-6.8-7.7-6.8-12.1 0-3.6 3-6.6 6.8-6.7z" />
      <path d="M12.1 7.1c1.4 0 2.5 1.1 2.5 2.4 0 1.4-1.1 2.5-2.4 2.5-1.4 0-2.5-1.1-2.5-2.4 0-1.3 1.1-2.4 2.4-2.5z" />
    </Mark>
  );
}

/* ---- concept marks, used for the four pillars of the stack ------------- */

/** A browser pane, sketched. */
export function MarkWindow(props: MarkProps) {
  return (
    <Mark mark="window" {...props}>
      <path d="M3.2 5.3c5.9-.4 11.8-.4 17.7-.1.3 4.6.3 9.2 0 13.7-5.9.3-11.8.3-17.7 0-.3-4.5-.3-9.1 0-13.6z" />
      <path d="M3.4 9.2c5.8-.3 11.6-.3 17.4-.1" />
      <path d="M6.3 7.1h.1M8.8 7.1h.1" strokeWidth={2.4} />
    </Mark>
  );
}

/** A glass over a word, for the search work. */
export function MarkSeek(props: MarkProps) {
  return (
    <Mark mark="seek" {...props}>
      <path d="M10.6 3.4c3.9-.2 7.2 2.9 7.3 6.8.1 3.9-3 7.2-6.9 7.3-3.9.1-7.2-3-7.3-6.9-.1-3.8 2.9-7.1 6.9-7.2z" />
      <path d="M15.9 15.6c1.7 1.6 3.3 3.1 4.8 4.6" />
      <path d="M7.9 11.6c.9-.8 1.7-1.6 2.5-2.4 1 .9 1.9 1.8 2.8 2.7" />
    </Mark>
  );
}

/** A bubble with something said in it, for the chat work. */
export function MarkChat(props: MarkProps) {
  return (
    <Mark mark="chat" {...props}>
      <path d="M4 6.1c5.4-.5 10.8-.5 16.1-.1.3 3.5.3 7 0 10.4-3.3.3-6.6.4-9.9.3-1.5 1.3-3 2.4-4.6 3.4.2-1.2.4-2.4.5-3.6-.7-.1-1.4-.1-2.1-.2-.3-3.4-.3-6.8 0-10.2z" />
      <path d="M8.2 10.9h.1M12 10.9h.1M15.8 10.9h.1" strokeWidth={2.4} />
    </Mark>
  );
}

/** A line going up over its own bars, for the growth work. */
export function MarkRise(props: MarkProps) {
  return (
    <Mark mark="rise" {...props}>
      <path d="M4 20.2c5.4.3 10.8.3 16.2.1" />
      <path d="M7.1 20V15M11.4 20v-7.6M15.7 20V9.4" />
      <path d="M4.6 11.1C8.1 9 11.6 6.7 15.4 4.4" />
      <path d="M11.9 3.9c1.4-.1 2.7-.2 3.9-.2.1 1.2.1 2.5 0 3.8" />
    </Mark>
  );
}

/** Looping thought, for the applied-AI pillar. */
export function MarkLoop(props: MarkProps) {
  return (
    <Mark mark="loop" {...props}>
      <path d="M12.2 3.3c4.4-.2 8 3.3 8 7.6 0 3.1-1.8 5.8-4.4 7.1-.4 1.6-1.8 2.8-3.6 2.8-1.9 0-3.4-1.3-3.7-3-2.4-1.4-4.1-4-4.1-6.9 0-4.2 3.5-7.5 7.8-7.6z" />
      <path d="M9.4 11.1c1.1-1.4 2.6-1.5 3.6-.5.9.9.8 2.3-.3 3.2" />
      <path d="M12.3 15.3v.1" strokeWidth={2.4} />
    </Mark>
  );
}

/** A handset, for the work that has to live in a pocket. */
export function MarkPhone(props: MarkProps) {
  return (
    <Mark mark="phone" {...props}>
      <path d="M8.1 2.9c2.6-.2 5.2-.2 7.8 0 .9.1 1.5.7 1.5 1.6.2 5 .2 10 0 15-.1.9-.7 1.5-1.6 1.6-2.5.2-5.1.2-7.6 0-.9-.1-1.5-.7-1.6-1.6-.2-5-.2-10 0-15 0-.9.6-1.5 1.5-1.6z" />
      <path d="M10.4 4.9c1.1-.1 2.2-.1 3.3 0" />
      <path d="M12 18.1v.1" strokeWidth={2.4} />
    </Mark>
  );
}

/** A small head with two wires out of it, for the agents. */
export function MarkAgent(props: MarkProps) {
  return (
    <Mark mark="agent" {...props}>
      <path d="M6.8 8.1c3.5-.3 7-.3 10.5 0 1 .1 1.7.8 1.8 1.8.2 2.1.2 4.2 0 6.3-.1 1-.8 1.7-1.8 1.8-3.5.3-7 .3-10.5 0-1-.1-1.7-.8-1.8-1.8-.2-2.1-.2-4.2 0-6.3.1-1 .8-1.7 1.8-1.8z" />
      <path d="M12 8V5.2" />
      <path d="M11.9 2.6c.9 0 1.4.6 1.4 1.3s-.6 1.3-1.4 1.3-1.4-.6-1.4-1.3.6-1.3 1.4-1.3z" />
      <path d="M9.4 12.3v.1M14.6 12.3v.1" strokeWidth={2.4} />
      <path d="M2.9 11.3v3.4M21.1 11.3v3.4" />
    </Mark>
  );
}

/** Stacked discs, for the data pillar. */
export function MarkDisks(props: MarkProps) {
  return (
    <Mark mark="disks" {...props}>
      <path d="M12.1 3.2c4.3 0 7.4 1.1 7.4 2.5s-3.1 2.6-7.4 2.6c-4.4 0-7.5-1.2-7.5-2.6s3.2-2.5 7.5-2.5z" />
      <path d="M4.6 5.9c-.1 4.1-.1 8.2 0 12.3 0 1.4 3.2 2.5 7.5 2.5 4.3 0 7.4-1.1 7.4-2.5.1-4.1.1-8.2 0-12.3" />
      <path d="M4.7 12c.4 1.3 3.4 2.3 7.4 2.3 4.1 0 7-1 7.4-2.3" />
    </Mark>
  );
}

/** A checked-off crate, for the shipping pillar. */
export function MarkCrate(props: MarkProps) {
  return (
    <Mark mark="crate" {...props}>
      <path d="M3.4 7.2c2.9-1.4 5.8-2.7 8.7-4 3 1.3 5.9 2.6 8.6 4-.1 3.3-.1 6.5 0 9.7-2.8 1.4-5.7 2.7-8.6 4-2.9-1.3-5.8-2.6-8.7-4-.2-3.2-.2-6.4 0-9.7z" />
      <path d="M3.6 7.4c2.9 1.4 5.7 2.7 8.5 3.9 2.8-1.2 5.6-2.5 8.4-3.9" />
      <path d="M12.1 11.3c.2 3.2.2 6.4 0 9.6" />
    </Mark>
  );
}

/** A rounded square with a lens, drawn by hand. */
export function MarkInstagram(props: MarkProps) {
  return (
    <Mark mark="instagram" {...props}>
      <path d="M7.2 3.3c3.2-.2 6.4-.2 9.6 0 2.3.2 3.8 1.8 4 4 .2 3.1.2 6.2 0 9.3-.2 2.3-1.8 3.9-4.1 4.1-3.1.2-6.3.2-9.4 0-2.3-.2-3.9-1.8-4.1-4.1-.2-3.1-.2-6.2 0-9.3.2-2.2 1.7-3.8 4-4z" />
      <path d="M12.1 8.2c2.1-.1 3.9 1.6 3.9 3.7 0 2.1-1.7 3.9-3.8 3.9-2.1 0-3.8-1.7-3.8-3.8 0-2 1.7-3.7 3.7-3.8z" />
      <path d="M17.4 6.8v.1" strokeWidth={2.4} />
    </Mark>
  );
}
