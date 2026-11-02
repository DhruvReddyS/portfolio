"use client";

/**
 * LoadingAnimation
 * A scroll-driven animation. A pixel figure turns, centred on a field.
 * Scrolling blows its pixels apart and sets the headline in selection frames. The call-to-action pulls the pixels
 * back together, the figure turns once as the loader, then `onComplete` fires.
 * Move the cursor and a faint design-tool layer (rulers, grid, selection frame, panels) shows under it.
 * The further you scroll, the more of that layer there is to find.
 *
 * One file, one dependency (react). Styles are scoped under `.la` and injected once. No Tailwind needed.
 *
 * ---------------------------------------------------------------------------
 * Changed for this project, on top of the component as it shipped:
 *
 *  - `loader` mode. The original is a landing section that a reader scrolls
 *    through; a loader is a sheet that holds the page back until it is ready.
 *    In loader mode the track collapses to the viewport, the headline, cue and
 *    call-to-action step aside, the figure assembles instead of dispersing, and
 *    a timeline drives the whole thing with no scrolling at all.
 *  - `ready`. The bar fills to one block short and waits there. A loader that
 *    finishes before the page does is just a delay with a progress bar on it.
 *  - `font`. The original injects Space Mono from Google Fonts. This site ships
 *    its own self-hosted faces and its colophon says it loads no third-party
 *    scripts, so passing a family here skips that request entirely.
 *  - The reveal layer drives itself in loader mode, since nobody is moving a
 *    cursor over a sheet that is about to disappear.
 *
 * The scroll behaviour is untouched: with no `loader` prop this is the
 * component as given.
 * ---------------------------------------------------------------------------
 *
 * NOTE: the built-in figure frames are sampled from a third-party video of real people.
 * Pass your own `frames` (66x53, 1-bit, base64-packed) before publishing this publicly.
 * This project passes its own, generated from a photograph: see lib/portrait-frames.ts.
 */
import * as React from "react";

// <engine>
export type ChipRow = Array<[text: string, kind?: string]>;

export interface LoadingAnimationOptions {
  /** Name shown on the selection frame in the cursor layer. */
  name?: string;
  /** Headline, one array per row. Each piece is [text, kind?]; kind "frame" wraps the text in a selection frame with handles. Spaces inside pieces are kept. */
  rows?: ChipRow[];
  /** Label on the call-to-action button. */
  cta?: string;
  /** Label above the progress bar while the figure turns. */
  loadingLabel?: string;
  /** Label shown when loading finishes (before `onComplete` takes the page elsewhere). */
  readyLabel?: string;
  replayLabel?: string;
  /** How much scrolling it takes to disperse the figure. Any CSS length. */
  scrollHeight?: string;
  /** Figure height as a fraction of the stage (0.2 to 1). Smaller means smaller pixels. */
  size?: number;
  /** How far the pixels travel when they disperse (0.2 to 2). */
  spread?: number;
  /** Show the design-tool layer under the cursor. */
  showReveal?: boolean;
  /** Play the whole sequence by itself, in a loop, with no scrolling. Use it for previews and embeds. */
  autoplay?: boolean;
  /**
   * Run as a sheet over the page rather than a section in it: fixed to the
   * viewport, no scroll track, driven by a timeline. Finishes once `ready` is
   * true and `minDuration` has passed.
   */
  loader?: boolean;
  /** Loader mode: the page behind is built and can be shown. */
  ready?: boolean;
  /** Loader mode: the shortest the sheet will stay up, in ms. */
  minDuration?: number;
  /** Loader mode: a line of credit set along the foot. */
  footer?: string[];
  /** Loader mode: the small line at the head of the sheet. */
  title?: string;
  /** Type family for the whole thing. Set it and the Google Fonts request is skipped. */
  font?: string;
  colors?: Partial<{ accent: string; blue: string; ink: string; tint: string }>;
  /** Base64-packed 66x53 1-bit frames of a full turn. Defaults to the built-in turn. */
  frames?: string[];
  onGetStarted?: () => void;
  /**
   * Loader mode: the exit has started and the pixels are on their way apart.
   * Fires about two thirds of a second before `onComplete`, which is the room
   * the page underneath needs to begin arriving while this is still leaving.
   */
  onLeave?: () => void;
  onComplete?: () => void;
}

const GW = 66;
const GH = 53;
const CELL_ASPECT = 14.65 / 10.8; // the source cells are slightly taller than wide
const FADE_ROWS = 9; // the bust is cut off at the bottom, so its last rows dissolve in a dither instead of a hard edge
/** Drops keys whose value is undefined, so a missing prop never overrides a default. */
const defined = <T extends object>(x: T): T => Object.fromEntries(Object.entries(x).filter(([, v]) => v !== undefined)) as T;
const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const smooth = (t: number) => { t = clamp(t); return t * t * (3 - 2 * t); };
const hsh = (x: number, y: number) => (((x * 73856093) ^ (y * 19349663)) >>> 0) % 1000 / 1000;
const esc = (t: string) => t.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" } as Record<string, string>)[c]);
const rgba = (hex: string, a: number) => {
  const h = hex.replace("#", ""), v = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  return `rgba(${(v >> 16) & 255},${(v >> 8) & 255},${v & 255},${a})`;
};

const DEFAULT_ROWS: ChipRow[] = [
  [["You have "], ["consumed", "frame"], [" enough."]],
  [["It's time to "], ["create", "frame"], ["."]],
];

const FONT = `var(--la-font,"Space Mono",ui-monospace,SFMono-Regular,Menlo,monospace)`;

const CSS = `
.la{--la-accent:#FF5000;--la-blue:#1F3BFF;--la-ink:#23262F;--la-tint:#FFEEE6;--la-track:320vh;position:relative;display:block;width:100%;background:var(--la-tint);color:var(--la-ink);font-family:${FONT};-webkit-font-smoothing:antialiased;font-variant-ligatures:none}
.la *,.la *::before,.la *::after{box-sizing:border-box}
.la-track{position:relative;height:var(--la-track)}
.la-stage{position:sticky;top:0;height:100vh;height:100svh;overflow:hidden}
.la-grid{position:absolute;inset:0;opacity:0;pointer-events:none;background-image:linear-gradient(to right,var(--la-g2) 1px,transparent 1px),linear-gradient(to bottom,var(--la-g2) 1px,transparent 1px),linear-gradient(to right,var(--la-g1) 1px,transparent 1px),linear-gradient(to bottom,var(--la-g1) 1px,transparent 1px);background-size:120px 120px,120px 120px,24px 24px,24px 24px}
.la-fig,.la-ui{position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none}
.la-top{position:absolute;left:0;right:0;top:0;display:flex;justify-content:flex-end;align-items:center;padding:22px 32px;z-index:5}
.la-auto,.la-auto .la-track,.la-auto .la-stage{height:100%;min-height:100vh;min-height:100svh}
.la-auto .la-stage{position:relative}
.la-auto .la-top,.la-auto .la-cue,.la-auto .la-replay{display:none !important}
.la-skip,.la-replay{background:none;border:0;padding:0;font:700 12px ${FONT};text-transform:uppercase;letter-spacing:.8px;color:#4A505C;cursor:pointer}
.la-skip:hover,.la-replay:hover{color:var(--la-ink)}
.la-msg{position:absolute;inset:0;z-index:4;display:flex;flex-direction:column;align-items:flex-start;justify-content:center;gap:36px;padding:0 clamp(20px,6vw,96px);padding:0 clamp(20px,6cqw,96px);pointer-events:none;container-type:inline-size}
.la-h{margin:0;display:flex;flex-direction:column;align-items:flex-start;gap:1em;font:700 clamp(13px,calc((100vw - 2 * clamp(20px,6vw,96px)) / 14),84px)/1.05 ${FONT};font-size:clamp(13px,calc((100cqw - 2 * clamp(20px,6cqw,96px)) / 14),84px);letter-spacing:-.045em;color:var(--la-ink)}
.la-row{display:block;white-space:nowrap}
.la-t{display:inline-block;white-space:pre;opacity:0}
.la-fr{position:relative;color:var(--la-blue);padding:.02em .16em .08em;margin:0 .12em;border:2px solid var(--la-blue);background:var(--la-bluet)}
.la-fr i{position:absolute;width:.17em;height:.17em;min-width:7px;min-height:7px;box-sizing:border-box;background:#fff;border:2px solid var(--la-blue);transform:translate(-50%,-50%)}
.la-cta{pointer-events:none;opacity:0;display:inline-flex;align-items:center;border:2px solid var(--la-ink);background:var(--la-accent);color:var(--la-ink);padding:14px 28px;font:700 17px ${FONT};text-transform:uppercase;letter-spacing:1.2px;cursor:pointer;transition:transform .08s,filter .08s}
.la-cta:hover{filter:brightness(1.08)}
.la-cta:active{transform:translateY(1px);filter:brightness(.94)}
.la-cta:focus-visible,.la-skip:focus-visible,.la-replay:focus-visible{outline:3px solid var(--la-ink);outline-offset:3px}
.la-cue{position:absolute;left:32px;bottom:26px;z-index:3;font:700 12px ${FONT};text-transform:uppercase;letter-spacing:1.4px}
.la-cue span{display:block;width:3px;height:30px;background:var(--la-ink);margin:10px 0 0 6px;animation:la-cue 1.4s steps(5) infinite}
@keyframes la-cue{0%{transform:scaleY(.2);transform-origin:top}60%{transform:scaleY(1);transform-origin:top}61%{transform-origin:bottom}100%{transform:scaleY(.1);transform-origin:bottom}}
.la-load{position:absolute;left:0;right:0;top:24px;z-index:6;text-align:center;display:none}
.la-load.on{display:block}
.la-load b{display:block;font:700 13px ${FONT};text-transform:uppercase;letter-spacing:1.2px;margin-bottom:10px}
.la-bar{display:flex;gap:5px;justify-content:center}
.la-bar i{width:18px;height:14px;background:var(--la-accent);opacity:.18}
.la-bar i.on{opacity:1}
.la-replay{display:none;margin-top:14px}
.la-load.done .la-replay{display:inline-block}
@media (max-width:640px){.la-top{padding:16px}.la-cue{left:16px}}
@media (prefers-reduced-motion:reduce){.la-cue span{animation:none}.la-cta{transition:none}}

/* ---- loader mode: a sheet over the page, not a section in it ---- */
.la-loader{position:fixed;inset:0;z-index:120;width:100%;height:100%;--la-track:100%}
.la-loader .la-track{height:100%}
.la-loader .la-stage{position:relative;height:100%}
.la-loader .la-top,.la-loader .la-cue,.la-loader .la-msg,.la-loader .la-replay{display:none !important}
.la-loader .la-load{top:auto;bottom:clamp(22px,5vh,46px);left:clamp(20px,5vw,56px);right:auto;text-align:left;display:block}
.la-loader .la-load{display:grid;gap:9px;justify-items:start}
.la-loader .la-load b{font-size:11px;letter-spacing:2.2px;margin:0;color:var(--la-ink)}
.la-pct{display:none}
.la-loader .la-pct{display:block;font:700 clamp(32px,4.4vw,52px)/.9 ${FONT};font-style:normal;letter-spacing:-.02em;font-variant-numeric:tabular-nums;color:var(--la-accent)}
.la-loader .la-pct::after{content:'%';font-size:.34em;letter-spacing:.14em;margin-left:5px;vertical-align:top;color:var(--la-ink);opacity:.55}
.la-loader .la-bar{justify-content:flex-start;gap:4px}
.la-loader .la-bar i{width:14px;height:8px;opacity:.16;transition:opacity .22s linear}
/* .la-bar i.on is declared above at the same weight as the rule over it,
   so in loader mode the later one won and the bar never lit. */
.la-loader .la-bar i.on{opacity:1}
.la-plate{position:absolute;inset:0;z-index:6;pointer-events:none;padding:clamp(20px,5vw,56px);display:flex;flex-direction:column;justify-content:space-between}
.la-plate p{margin:0}
.la-plate-title{font:700 11px ${FONT};letter-spacing:2.6px;text-transform:uppercase;color:var(--la-accent)}
.la-plate-foot{display:flex;flex-wrap:wrap;gap:4px 20px;align-self:flex-end;text-align:right;flex-direction:column;font:700 10px ${FONT};letter-spacing:1.8px;text-transform:uppercase;color:var(--la-ink);opacity:.5}
@media (max-width:640px){.la-plate-foot{display:none}}
`;

function ensureAssets(font?: string) {
  if (typeof document === "undefined") return;
  if (!document.getElementById("la-styles")) {
    const s = document.createElement("style"); s.id = "la-styles"; s.textContent = CSS; document.head.appendChild(s);
  }
  // A host that brings its own type gets no third-party request.
  if (font || document.getElementById("la-font")) return;
  const l = document.createElement("link"); l.id = "la-font"; l.rel = "stylesheet";
  l.href = "https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap"; document.head.appendChild(l);
}

const HANDLES: Array<[number, number]> = [[0, 0], [50, 0], [100, 0], [0, 50], [100, 50], [0, 100], [50, 100], [100, 100]];
const headRow = (items: ChipRow) =>
  `<span class="la-row" aria-hidden="true">${items.map(([t, k]) => k === "frame"
    ? `<span class="la-t la-fr">${esc(t)}${HANDLES.map(([x, y]) => `<i style="left:${x}%;top:${y}%"></i>`).join("")}</span>`
    : `<span class="la-t">${esc(t)}</span>`).join("")}</span>`;

type Phase = "scroll" | "assemble" | "load" | "done";

export function mountLoadingAnimation(root: HTMLElement, opts: LoadingAnimationOptions = {}): { destroy: () => void; replay: () => void; setReady: (v: boolean) => void } {
  ensureAssets(opts.font);
  /* Canvas cannot parse a CSS custom property in ctx.font, so the stylesheet
     gets the variable and every canvas string gets a resolved family. A host
     passing `font` must therefore pass real family names, not var(...). */
  const cFont = opts.font && !opts.font.includes("var(") ? opts.font : '"Space Mono", ui-monospace, monospace';
  opts = defined(opts);
  const col = { accent: "#FF5000", blue: "#1F3BFF", ink: "#23262F", tint: "#FFEEE6", ...defined(opts.colors || {}) };
  const rows = opts.rows && opts.rows.length ? opts.rows : DEFAULT_ROWS;
  const o = { name: "Asha Iyer", cta: "Create Now", loadingLabel: "Setting up your desk", readyLabel: "Desk ready", replayLabel: "Replay", scrollHeight: "320vh", size: 0.5, spread: 1, showReveal: true, autoplay: false, loader: false, minDuration: 4400, footer: [] as string[], title: "", ...opts };
  const size = clamp(o.size, 0.2, 1), spread = clamp(o.spread, 0.2, 2);
  const reduced = typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
  let ready = Boolean(o.ready);

  root.classList.add("la");
  if (o.autoplay) root.classList.add("la-auto");
  if (o.loader) root.classList.add("la-loader");
  if (o.font) root.style.setProperty("--la-font", o.font);
  root.style.setProperty("--la-accent", col.accent); root.style.setProperty("--la-blue", col.blue);
  root.style.setProperty("--la-ink", col.ink); root.style.setProperty("--la-tint", col.tint); root.style.setProperty("--la-bluet", rgba(col.blue, 0.08)); root.style.setProperty("--la-g1", rgba(col.accent, 0.09)); root.style.setProperty("--la-g2", rgba(col.accent, 0.2));
  root.style.setProperty("--la-track", o.loader ? "100%" : o.scrollHeight);
  root.innerHTML = `<div class="la-track"><div class="la-stage">
      <div class="la-grid" aria-hidden="true"></div>
      <canvas class="la-fig" aria-hidden="true"></canvas><canvas class="la-ui" aria-hidden="true"></canvas>
      <div class="la-top"><button class="la-skip" type="button">Skip ↓</button></div>
      <div class="la-cue">Scroll<span></span></div>
      <div class="la-msg"><h1 class="la-h" aria-label="${esc(rows.map((r) => r.map((c) => c[0]).join("")).join(" ").replace(/\s+/g, " ").trim())}">${rows.map(headRow).join("")}</h1>
        <button class="la-cta" type="button" tabindex="-1">${esc(o.cta)}</button></div>
      ${o.loader ? `<div class="la-plate" aria-hidden="true"><p class="la-plate-title">${esc(o.title || o.name)}</p><p class="la-plate-foot">${o.footer.map((f) => `<span>${esc(f)}</span>`).join("")}</p></div>` : ""}
      <div class="la-load" role="status"><em class="la-pct">0</em><b>${esc(o.loadingLabel)}</b><div class="la-bar">${"<i></i>".repeat(16)}</div><button class="la-replay" type="button">${esc(o.replayLabel)}</button></div>
    </div></div>`;

  const q = <T extends Element>(s: string) => root.querySelector(s) as T;
  const track = q<HTMLElement>(".la-track"), stage = q<HTMLElement>(".la-stage");
  const fig = q<HTMLCanvasElement>(".la-fig"), ui = q<HTMLCanvasElement>(".la-ui");
  const grid = q<HTMLElement>(".la-grid");
  const chips = [...root.querySelectorAll<HTMLElement>(".la-t")];
  const cta = q<HTMLButtonElement>(".la-cta"), cue = q<HTMLElement>(".la-cue"), load = q<HTMLElement>(".la-load");
  const loadLabel = q<HTMLElement>(".la-load b"), barBlocks = [...root.querySelectorAll<HTMLElement>(".la-bar i")];
  const pctEl = q<HTMLElement>(".la-pct");
  /** The count under the bar. Only ever goes up, and only reads 100 when it is. */
  const showPct = (v: number) => { const t = String(v); if (pctEl.textContent !== t) pctEl.textContent = t; };

  /* decode the packed frames (1 bit per cell), and find the box the figure ever occupies */
  const packed = opts.frames && opts.frames.length ? opts.frames : BUILTIN_FRAMES;
  if (!packed.length) { // see the note on BUILTIN_FRAMES at the foot of this file
    root.innerHTML = '';
    throw new Error('LoadingAnimation: pass `frames`, 66x53 one-bit base64 packed. There is no built-in set.');
  }
  const box = { x0: GW, y0: GH, x1: 0, y1: 0 };
  const frames: Uint8Array[] = packed.map((b64) => {
    const bin = atob(b64), bits = new Uint8Array(GW * GH);
    for (let i = 0; i < bits.length; i++) {
      const on = (bin.charCodeAt(i >> 3) >> (7 - (i & 7))) & 1; bits[i] = on;
      if (on) { const x = i % GW, y = (i / GW) | 0; if (x < box.x0) box.x0 = x; if (x > box.x1) box.x1 = x; if (y < box.y0) box.y0 = y; if (y > box.y1) box.y1 = y; }
    }
    return bits;
  });
  const n = frames.length;
  const colsC = box.x1 - box.x0 + 1, rowsC = box.y1 - box.y0 + 1;

  const st = { phase: "scroll" as Phase, p: 0, target: 0, loadStart: 0, f0: 0, raf: 0, alive: true, d: 1, frame: 0, autoStart: 0, doneAt: 0, reveal: 0 };
  const ptr = { mx: -999, my: -999, x: -999, y: -999, r: 0, tr: 0 };
  let uiCache: HTMLCanvasElement | null = null, uiScratch: HTMLCanvasElement | null = null;
  let lay = { W: 0, H: 0, cw: 0, ch: 0, ox: 0, oy: 0, fx0: 0, fx1: 0, fy0: 0, fy1: 0 };

  /* the figure sits at the centre of the stage; `size` is its height as a share of the stage */
  const geo = (W: number, H: number) => {
    let ch = (size * H) / rowsC, cw = ch / CELL_ASPECT;
    // A section shares the width with a headline; a loader has the whole
    // sheet to itself, and on a phone the figure is the only thing on it.
    const room = o.loader ? 0.86 : 0.7;
    if (colsC * cw > W * room) { cw = (W * room) / colsC; ch = cw * CELL_ASPECT; }
    return { cw, ch, ox: W / 2 - ((box.x0 + box.x1 + 1) / 2) * cw, oy: H / 2 - ((box.y0 + box.y1 + 1) / 2) * ch };
  };

  /* Figma-style rulers along the top and left edge */
  function rulers(x: CanvasRenderingContext2D, W: number, H: number) {
    const G = (a: number) => rgba(col.ink, a);
    const line = (x1: number, y1: number, x2: number, y2: number, stroke: string) => { x.strokeStyle = stroke; x.lineWidth = 1; x.beginPath(); x.moveTo(x1 + 0.5, y1 + 0.5); x.lineTo(x2 + 0.5, y2 + 0.5); x.stroke(); };
    const R = 18;
    x.fillStyle = rgba(col.tint, 0.82); x.fillRect(0, 0, W, R); x.fillRect(0, 0, R, H);
    line(0, R, W, R, G(0.35)); line(R, 0, R, H, G(0.35));
    x.fillStyle = G(0.7); x.font = `700 8px ${cFont}`; x.textBaseline = "top";
    for (let t = 0; t <= W; t += 10) { const len = t % 100 === 0 ? 12 : t % 50 === 0 ? 8 : 4; line(t, R - len, t, R, G(0.5)); if (t % 100 === 0 && t) x.fillText(String(t), t + 3, 2); }
    for (let t = 0; t <= H; t += 10) { const len = t % 100 === 0 ? 12 : t % 50 === 0 ? 8 : 4; line(R - len, t, R, t, G(0.5)); if (t % 100 === 0 && t) { x.save(); x.translate(2, t + 3); x.rotate(-Math.PI / 2); x.fillText(String(t), -x.measureText(String(t)).width, 0); x.restore(); } }
  }

  function buildUiCache() {
    const W = stage.clientWidth, H = stage.clientHeight, d = st.d, c = document.createElement("canvas");
    c.width = Math.round(W * d); c.height = Math.round(H * d);
    const x = c.getContext("2d")!; x.scale(d, d); x.lineWidth = 1;
    const O = (a: number) => rgba(col.accent, a), B = (a: number) => rgba(col.blue, a);
    const line = (x1: number, y1: number, x2: number, y2: number, stroke: string) => { x.strokeStyle = stroke; x.beginPath(); x.moveTo(x1 + 0.5, y1 + 0.5); x.lineTo(x2 + 0.5, y2 + 0.5); x.stroke(); };
    for (let gx = 0; gx <= W; gx += 24) line(gx, 0, gx, H, gx % 120 === 0 ? O(0.2) : O(0.09));
    for (let gy = 0; gy <= H; gy += 24) line(0, gy, W, gy, gy % 120 === 0 ? O(0.2) : O(0.09));
    rulers(x, W, H);
    const g = geo(W, H), pad = 10;
    const fx0 = g.ox + box.x0 * g.cw - pad, fx1 = g.ox + (box.x1 + 1) * g.cw + pad, fy0 = g.oy + box.y0 * g.ch - pad, fy1 = g.oy + (box.y1 + 1) * g.ch + pad;
    lay = { W, H, ...g, fx0, fx1, fy0, fy1 };
    line(fx0, 0, fx0, H, B(0.3)); line(fx1, 0, fx1, H, B(0.3)); line(0, fy0, W, fy0, B(0.3)); line(0, fy1, W, fy1, B(0.3)); line(W / 2, 0, W / 2, H, O(0.35));
    x.strokeStyle = B(0.9); x.strokeRect(fx0 + 0.5, fy0 + 0.5, fx1 - fx0, fy1 - fy0);
    const hs = 6;
    ([[fx0, fy0], [(fx0 + fx1) / 2, fy0], [fx1, fy0], [fx0, (fy0 + fy1) / 2], [fx1, (fy0 + fy1) / 2], [fx0, fy1], [(fx0 + fx1) / 2, fy1], [fx1, fy1]] as Array<[number, number]>).forEach(([hx, hy]) => {
      x.fillStyle = col.tint; x.strokeStyle = B(1); x.fillRect(hx - hs / 2 + 0.5, hy - hs / 2 + 0.5, hs, hs); x.strokeRect(hx - hs / 2 + 0.5, hy - hs / 2 + 0.5, hs, hs);
    });
    const pill = (txt: string, px: number, py: number, bg: string, fg: string) => {
      x.font = `700 9px ${cFont}`; const w = x.measureText(txt).width + 12;
      x.fillStyle = bg; x.fillRect(px, py, w, 15); x.fillStyle = fg; x.textBaseline = "middle"; x.fillText(txt, px + 6, py + 8); x.textBaseline = "top"; return w;
    };
    pill(o.name, fx0, fy0 - 20, B(1), col.tint);                                 // the frame is named after the person
    pill(`${Math.round(fx1 - fx0)} × ${Math.round(fy1 - fy0)}`, (fx0 + fx1) / 2 - 30, fy1 + 7, B(1), col.tint);
    uiCache = c; uiScratch = document.createElement("canvas"); uiScratch.width = c.width; uiScratch.height = c.height;
  }

  function fit() {
    const d = window.devicePixelRatio || 1; st.d = d;
    fig.width = ui.width = Math.round(stage.clientWidth * d); fig.height = ui.height = Math.round(stage.clientHeight * d);
    buildUiCache();
  }

  function drawFigure(frame: number) {
    const ctx = fig.getContext("2d")!, W = fig.width, H = fig.height;
    ctx.clearRect(0, 0, W, H);
    const { cw, ch, ox, oy } = geo(W, H);
    const k = frame % n, a = frames[k], b = frames[(k + 1) % n], mix = k >= n - 4 ? (k - (n - 4) + 1) / 4 : 0; // dissolve the last frames into the first so the turn loops cleanly
    const p = st.p, mn = Math.min(W, H);
    ctx.fillStyle = col.accent;
    for (let y = 0; y < GH; y++) for (let x = 0; x < GW; x++) {
      const i = y * GW + x;
      if (!(mix && hsh(x, y) < mix ? b[i] : a[i])) continue;
      if (y > box.y1 - FADE_ROWS && hsh(x * 7 + 3, y * 11 + 5) > (box.y1 - y + 1) / (FADE_ROWS + 1)) continue; // dithered fade at the cut-off edge
      let lp = 0;
      if (p > 0) { lp = clamp(p * 1.5 - hsh(x * 3 + 1, y * 5 + 2) * 0.5); lp = lp * lp * (3 - 2 * lp); }
      if (lp >= 0.995) continue;
      if (lp === 0) {
        const x0 = Math.round(ox + x * cw), y0 = Math.round(oy + y * ch);
        ctx.globalAlpha = 1; ctx.fillRect(x0, y0, Math.round(ox + (x + 1) * cw) - x0, Math.round(oy + (y + 1) * ch) - y0);
        continue;
      }
      const ang = hsh(x, y) * 6.2832, dist = lp * (0.04 + hsh(y + 7, x + 3) * 0.46) * mn * spread, sz = 1 - lp * 0.6;
      ctx.globalAlpha = 1 - lp * 0.92;
      ctx.fillRect(ox + x * cw + Math.cos(ang) * dist + lp * W * 0.02, oy + y * ch + Math.sin(ang) * dist - lp * lp * H * 0.1, cw * sz, ch * sz);
    }
    ctx.globalAlpha = 1;
  }

  /* everything below the cursor layer's base: panels and marks that fade in as you scroll further */
  function annotations(sx: CanvasRenderingContext2D, frame: number) {
    const { W, H, cw, ch, fx0, fx1, fy0, fy1 } = lay, R = 18;
    const O = (a: number) => rgba(col.accent, a), B = (a: number) => rgba(col.blue, a), G = (a: number) => rgba(col.ink, a);
    /* On the page the layer is earned by scrolling. On a loader there is no
       scrolling to do, so it is earned by waiting: `reveal` walks 0 to 1 over
       the hold and the same gates open in the same order. */
    const at = (t: number) => (reduced ? 0 : smooth(((o.loader ? st.reveal : st.p) - t) / 0.12));
    const ln = (x1: number, y1: number, x2: number, y2: number, stroke: string) => { sx.strokeStyle = stroke; sx.lineWidth = 1; sx.beginPath(); sx.moveTo(x1 + 0.5, y1 + 0.5); sx.lineTo(x2 + 0.5, y2 + 0.5); sx.stroke(); };
    const pill = (txt: string, px: number, py: number, bg: string, fg: string) => {
      sx.font = `700 9px ${cFont}`; const w = sx.measureText(txt).width + 12;
      sx.fillStyle = bg; sx.fillRect(px, py, w, 15); sx.fillStyle = fg; sx.textBaseline = "middle"; sx.fillText(txt, px + 6, py + 8); return w;
    };
    const panel = (px: number, py: number, w: number, title: string, items: Array<[string, string]>) => {
      px = Math.max(R + 6, Math.min(W - w - 6, px));
      const h = 20 + items.length * 15 + 6;
      sx.fillStyle = rgba(col.tint, 0.93); sx.fillRect(px, py, w, h); sx.strokeStyle = G(0.7); sx.lineWidth = 1; sx.strokeRect(px + 0.5, py + 0.5, w, h);
      sx.textBaseline = "middle"; sx.fillStyle = G(1); sx.font = `700 8px ${cFont}`; sx.fillText(title.toUpperCase(), px + 8, py + 10);
      ln(px, py + 19, px + w, py + 19, G(0.25));
      items.forEach(([k, v], i) => {
        const yy = py + 20 + i * 15 + 8; sx.font = `400 9px ${cFont}`; sx.fillStyle = G(0.55); sx.fillText(k, px + 8, yy);
        sx.font = `700 9px ${cFont}`; sx.fillStyle = G(1); sx.textAlign = "right"; sx.fillText(v, px + w - 8, yy); sx.textAlign = "left";
      });
    };
    const when = (t: number, fn: () => void) => { const k = at(t); if (k <= 0.01) return; sx.save(); sx.globalAlpha = k; fn(); sx.restore(); };
    const k = frame % n, rot = Math.round((k / n) * 360);
    /*
     * The side panels only exist if there is margin to stand them in. The
     * figure is centred and grows with the sheet, so on a narrow window there
     * is none, and `panel` would clamp them back inside the frame — a panel
     * of measurements sitting on the face it is measuring, which reads as a
     * box dropped on him rather than as a tool pointing at him. Better to
     * leave them out than to put them there.
     */
    const roomL = fx0 - (R + 6), roomR = W - fx1 - 6;
    /* 0.10  layers */
    if (roomR >= 138 + 14) when(0.1, () => panel(fx1 + 14, fy0, 138, "Layers", [["◉ Figure", ""], ["◉ Pixels", String(GW * GH)], ["◉ Background", ""]]));
    /* 0.25  properties, with a live rotation readout */
    /* Role is prose, and prose in a panel of measurements is the one line
       that has to be truncated to fit, which is how you can tell it does
       not belong there. */
    if (roomL >= 142 + 14) when(0.25, () => panel(fx0 - 14 - 142, fy0, 142, "Properties", [["X", `${Math.round(fx0)}`], ["Y", `${Math.round(fy0)}`], ["W × H", `${Math.round(fx1 - fx0)}×${Math.round(fy1 - fy0)}`], ["Rotate", `${rot}°`], ["Pixel", `${cw.toFixed(1)}×${ch.toFixed(1)}`], ["Frame", `${k + 1}/${n}`], ["Colour", "1-bit"]]));
    /* 0.40  measurements */
    when(0.4, () => {
      const my = (fy0 + fy1) / 2, mx = (fx0 + fx1) / 2;
      ln(R, my, fx0, my, O(0.9)); ln(R, my - 4, R, my + 4, O(0.9)); ln(fx0, my - 4, fx0, my + 4, O(0.9)); pill(String(Math.round(fx0 - R)), (R + fx0) / 2 - 12, my - 20, O(1), col.ink);
      ln(mx, R, mx, fy0, O(0.9)); ln(mx - 4, R, mx + 4, R, O(0.9)); ln(mx - 4, fy0, mx + 4, fy0, O(0.9)); pill(String(Math.round(fy0 - R)), mx + 8, (R + fy0) / 2 - 8, O(1), col.ink);
    });
    /*
     * 0.55 used to draw a pen path with anchors and handles over his head.
     * A bezier curve laid across a face reads as a defect in the face, not
     * as a tool inspecting it, and it was the one annotation that fought
     * the portrait instead of measuring it.
     */
    /* 0.70  tags */
    when(0.7, () => {
      if (roomR >= 110) { pill("Layer 1 · 66 × 53", fx1 + 14, fy1 - 80, col.tint, G(1)); pill("Pixel mask", fx1 + 14, fy1 - 58, col.tint, G(1)); }
      if (roomL >= 112) {
        pill("Opacity 100%", fx0 - 96, fy1 - 80, col.tint, G(1));
        pill(`Fill  ${col.accent.replace("#", "").toUpperCase()}`, fx0 - 108, fy1 - 58, col.tint, G(1));
        sx.fillStyle = col.accent; sx.fillRect(fx0 - 106, fy1 - 55, 9, 9);
      }
    });
    /* 0.85  swatches + export */
    when(0.85, () => {
      const sy = fy1 + 28 < H - 24 ? fy1 + 28 : fy0 - 44;
      sx.fillStyle = col.accent; sx.fillRect(fx0, sy, 14, 14); sx.strokeStyle = G(0.8); sx.strokeRect(fx0 + 0.5, sy + 0.5, 14, 14);
      sx.fillStyle = col.tint; sx.fillRect(fx0 + 20, sy, 14, 14); sx.strokeRect(fx0 + 20.5, sy + 0.5, 14, 14); ln(fx0 + 20, sy + 14, fx0 + 34, sy, G(0.8));
      pill("on #" + col.accent.replace("#", "").toUpperCase() + "  off none", fx0 + 42, sy - 1, col.tint, G(1)); pill("Export 1x", fx1 - 56, sy - 1, B(1), col.tint);
    });
  }

  /* the headline page: rulers, guides, name / size / position tags and spacing marks around the framed words */
  function drawHeadlineGuides(ctx: CanvasRenderingContext2D, hv: number) {
    const d = st.d, W = stage.clientWidth, H = stage.clientHeight, R = 18;
    ctx.setTransform(d, 0, 0, d, 0, 0); ctx.globalAlpha = hv; ctx.lineWidth = 1;
    const O = (a: number) => rgba(col.accent, a), B = (a: number) => rgba(col.blue, a);
    const ln = (x1: number, y1: number, x2: number, y2: number, stroke: string) => { ctx.strokeStyle = stroke; ctx.beginPath(); ctx.moveTo(x1 + 0.5, y1 + 0.5); ctx.lineTo(x2 + 0.5, y2 + 0.5); ctx.stroke(); };
    const pill = (txt: string, px: number, py: number, bg: string, fg: string) => {
      ctx.font = `700 9px ${cFont}`; const w = ctx.measureText(txt).width + 12;
      ctx.fillStyle = bg; ctx.fillRect(px, py, w, 15); ctx.fillStyle = fg; ctx.textBaseline = "middle"; ctx.fillText(txt, px + 6, py + 8); return w;
    };
    const small = W < 640;
    const fr = [...root.querySelectorAll<HTMLElement>(".la-fr")].map((e) => ({ x: e.offsetLeft, y: e.offsetTop, w: e.offsetWidth, h: e.offsetHeight }));
    rulers(ctx, W, H); // the same ruler bars as the cursor layer
    ctx.textBaseline = "top";
    fr.forEach((f, i) => {
      const x0 = f.x, x1 = f.x + f.w, y0 = f.y, y1 = f.y + f.h;
      ln(x0, R, x0, H, B(0.28)); ln(x1, R, x1, H, B(0.28)); ln(R, y0, W, y0, B(0.28)); ln(R, y1, W, y1, B(0.28));
      ctx.fillStyle = B(0.3); ctx.fillRect(x0 + 1, 0, f.w, R - 1); ctx.fillRect(0, y0 + 1, R - 1, f.h); // selection range lit up on both rulers
      ctx.fillStyle = B(1); ctx.font = `700 8px ${cFont}`; ctx.textBaseline = "top"; ctx.fillText(String(Math.round(x0)), x0 + 3, 2);
      if (small) return;
      pill(`Text ${i + 1}`, x0, y0 - 21, B(1), col.tint);
      const pos = `x ${Math.round(x0)}  y ${Math.round(y0)}`;
      ctx.font = `700 9px ${cFont}`;
      pill(pos, x1 - ctx.measureText(pos).width - 12, y0 - 21, col.ink, col.tint);
      pill(`${Math.round(f.w)} × ${Math.round(f.h)}`, (x0 + x1) / 2 - 30, y1 + 7, B(1), col.tint);
    });
    /* spacing marks in the accent colour, like measurements in a design tool */
    const h1 = q<HTMLElement>(".la-h");
    const gap = Math.round(cta.offsetTop - (h1.offsetTop + h1.offsetHeight)), cx = cta.offsetLeft + 16;
    if (gap > 6) {
      const ya = h1.offsetTop + h1.offsetHeight, yb = cta.offsetTop;
      ln(cx, ya, cx, yb, O(0.95)); ln(cx - 4, ya, cx + 4, ya, O(0.95)); ln(cx - 4, yb, cx + 4, yb, O(0.95));
      if (!small) pill(String(gap), cx + 8, (ya + yb) / 2 - 8, O(1), col.ink);
    }
    const lx = h1.offsetLeft, ym = h1.offsetTop - 18;
    if (!small && lx - R > 26) { ln(R, ym, lx, ym, O(0.95)); ln(R, ym - 4, R, ym + 4, O(0.95)); ln(lx, ym - 4, lx, ym + 4, O(0.95)); pill(String(Math.round(lx - R)), (R + lx) / 2 - 10, ym - 20, O(1), col.ink); }
    if (!small) { ctx.fillStyle = rgba(col.ink, 0.55); ctx.font = `700 9px ${cFont}`; ctx.textBaseline = "top"; ctx.fillText(`Landing  ${Math.round(W)} × ${Math.round(H)}`, R + 8, R + 8); }
    ctx.globalAlpha = 1;
  }

  function drawReveal(frame: number) {
    const ctx = ui.getContext("2d")!, d = st.d;
    ptr.x += (ptr.mx - ptr.x) * 0.35; ptr.y += (ptr.my - ptr.y) * 0.35; ptr.r += (ptr.tr - ptr.r) * 0.16;
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, ui.width, ui.height);
    // On a loader there is no headline page to guide, and the elements it
    // measures are display:none, so it would draw a pile of zeroes.
    const hv = o.loader ? 0 : reduced ? 1 : smooth((st.p - 0.4) / 0.15), vis = o.loader ? 1 : 1 - hv; // the cursor layer steps aside while the headline is up, and returns with the pixels
    if (o.showReveal && hv > 0.01) drawHeadlineGuides(ctx, hv);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    if (!o.showReveal || !uiCache || !uiScratch || ptr.r < 2 || vis < 0.01) return;
    const sx = uiScratch.getContext("2d")!, W = ui.width, H = ui.height;
    sx.setTransform(1, 0, 0, 1, 0, 0); sx.globalCompositeOperation = "source-over"; sx.clearRect(0, 0, W, H); sx.drawImage(uiCache, 0, 0);
    sx.setTransform(d, 0, 0, d, 0, 0); // from here on, CSS pixels
    annotations(sx, frame);
    const x = ptr.x, y = ptr.y, r = ptr.r * (1 + (o.loader ? st.reveal : st.p) * 0.9); // the circle widens as the layer is earned, so more of it shows
    sx.strokeStyle = rgba(col.blue, 0.7); sx.lineWidth = 1;
    sx.beginPath(); sx.moveTo(x, 0); sx.lineTo(x, H / d); sx.moveTo(0, y); sx.lineTo(W / d, y); sx.stroke();
    const label = `x ${Math.round(ptr.x)}   y ${Math.round(ptr.y)}`; sx.font = `700 9px ${cFont}`; sx.textBaseline = "middle";
    const lw = sx.measureText(label).width + 12; sx.fillStyle = col.ink; sx.fillRect(x + 12, y + 12, lw, 15); sx.fillStyle = col.tint; sx.fillText(label, x + 18, y + 20);
    sx.fillStyle = col.blue; sx.fillRect(x - 3, 0, 6, 18); sx.fillRect(0, y - 3, 18, 6);
    sx.globalCompositeOperation = "destination-in"; // reveal only under the cursor
    const gr = sx.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, "rgba(0,0,0,1)"); gr.addColorStop(0.7, "rgba(0,0,0,.85)"); gr.addColorStop(1, "rgba(0,0,0,0)");
    sx.fillStyle = gr; sx.fillRect(0, 0, W / d, H / d);
    ctx.globalAlpha = vis; ctx.drawImage(uiScratch, 0, 0); ctx.globalAlpha = 1;
  }

  function updateDom() {
    const p = st.p, b = reduced ? 1 : smooth((p - 0.9) / 0.08);
    if (o.loader) {
      // the grid comes up with the rest of the tool layer, not with the headline
      grid.style.opacity = o.showReveal ? String(st.reveal * 0.9) : "0";
      return;
    }
    chips.forEach((el, i) => { const t = reduced ? 1 : smooth((p - 0.4 - i * 0.022) / 0.2); el.style.opacity = String(t); el.style.transform = `translateY(${(1 - t) * 22}px) scale(${0.82 + 0.18 * t})`; });
    grid.style.opacity = o.showReveal ? String(reduced ? 1 : smooth((p - 0.4) / 0.15)) : "0"; // the grid lives on the headline page; on the figure it only shows under the cursor
    const live = st.phase === "scroll" && b > 0.5;
    cta.style.opacity = String(st.phase === "scroll" ? b : 0); cta.style.pointerEvents = live ? "auto" : "none"; cta.tabIndex = live ? 0 : -1;
    cue.style.opacity = st.phase === "scroll" ? String(1 - smooth(p / 0.12)) : "0";
  }

  function complete() {
    if (!o.loader) document.body.style.overflow = "";
    st.phase = "done"; if (!o.loader) { st.p = 0; st.target = 0; }
    loadLabel.textContent = o.readyLabel; barBlocks.forEach((i) => i.classList.add("on")); showPct(100); load.classList.add("on", "done");
    opts.onComplete?.();
    root.dispatchEvent(new CustomEvent("loadinganimation:complete", { bubbles: true }));
  }
  function begin() {
    if (st.phase !== "scroll") return;
    opts.onGetStarted?.();
    if (reduced) { complete(); return; }
    st.phase = "assemble"; st.target = 0; if (!o.autoplay) document.body.style.overflow = "hidden";
  }
  function resetUi() {
    load.classList.remove("on", "done"); loadLabel.textContent = o.loadingLabel; barBlocks.forEach((i) => i.classList.remove("on")); showPct(0);
  }
  function replay() {
    st.phase = "scroll"; st.p = 0; st.target = 0; st.autoStart = 0; st.reveal = 0; document.body.style.overflow = "";
    resetUi();
    if (!o.autoplay && !o.loader) track.scrollIntoView({ behavior: "auto", block: "start" });
  }

  /*
   * The loader's timeline. No scrolling, no button: the pixels fly in and
   * settle, the tool layer walks itself across the figure while the bar
   * fills, and the whole thing holds one block short of full until the page
   * behind it says it is built. Then the pixels blow apart and it is done.
   */
  function loaderStep(ts: number) {
    if (!st.autoStart) st.autoStart = ts;
    const e = ts - st.autoStart;
    const IN = 1150;                 // pixels fly in
    const hold = Math.max(0, e - IN);

    if (st.phase === "scroll") {
      st.p = reduced ? 0 : 1 - smooth(e / IN);
      st.reveal = reduced ? 0 : clamp(hold / 2100);
      const prog = clamp(e / Math.max(1, o.minDuration));
      const filled = Math.min(15, Math.floor(prog * 16));
      barBlocks.forEach((i, k) => i.classList.toggle("on", k < filled));
      // 99 is the honest ceiling while anything is still in flight: the bar
      // and the number are waiting on the same thing, so they stop together.
      showPct(Math.min(99, Math.round(prog * 99)));
      if (ready && e >= o.minDuration) {
        st.phase = "load"; st.loadStart = ts;
        loadLabel.textContent = o.readyLabel;
        barBlocks.forEach((i) => i.classList.add("on"));
        showPct(100);
        // said now, not when the pixels have finished going: whatever is
        // underneath should be arriving while this is still on its way out
        opts.onLeave?.();
        root.dispatchEvent(new CustomEvent("loadinganimation:leave", { bubbles: true }));
      }
      return;
    }

    if (st.phase === "load") {
      const k = (ts - st.loadStart) / 620;
      st.p = reduced ? 1 : smooth(k);
      st.reveal = Math.max(0, st.reveal - 0.05);
      if (k >= 1) complete();
    }
  }

  function loop(ts: number) {
    st.raf = 0;
    if (!st.alive) return;
    const rect = track.getBoundingClientRect();
    const onScreen = o.loader || (rect.bottom > 0 && rect.top < window.innerHeight);
    if (onScreen) {
      let frame = reduced ? Math.floor(n * 0.38) : Math.floor((ts / 1000) * 12) % n;

      if (o.loader) {
        loaderStep(ts);
        // the layer walks itself across the figure, since nobody is going to
        // move a cursor over a sheet that is about to disappear
        const W = stage.clientWidth, H = stage.clientHeight, s = (ts - st.autoStart) / 1000;
        ptr.mx = W / 2 + Math.sin(s * 0.85) * W * 0.27;
        ptr.my = H / 2 + Math.cos(s * 0.57) * H * 0.2;
        if (ptr.r < 2) { ptr.x = ptr.mx; ptr.y = ptr.my; }
        ptr.tr = st.reveal > 0.02 ? Math.min(W, H) * 0.42 : 0;
      } else {
        if (o.autoplay && st.phase === "scroll") { // a timeline stands in for the scroll: hold, disperse, show the headline, press the button
          if (!st.autoStart) st.autoStart = ts;
          const e = (ts - st.autoStart) / 1000;
          st.target = reduced ? 0 : e < 1.2 ? 0 : e < 4.4 ? smooth((e - 1.2) / 3.2) : 1;
          if (e > 6.6) begin();
        } else if (st.phase === "scroll") {
          const max = Math.max(1, track.offsetHeight - stage.clientHeight);
          st.target = reduced ? 0 : clamp(-rect.top / max);
        }
        if (o.autoplay && st.phase === "done") { // hold on "ready" for a moment, then go round again
          if (!st.doneAt) st.doneAt = ts;
          if (ts - st.doneAt > 1600) { st.phase = "scroll"; st.p = 0; st.target = 0; st.autoStart = ts; st.doneAt = 0; resetUi(); }
        }
        st.p += (st.target - st.p) * (st.phase === "assemble" ? 0.085 : 0.16);
        if (Math.abs(st.target - st.p) < 0.002) st.p = st.target;
        if (st.phase === "assemble" && st.p < 0.02) { // reassembled: now turn once, as the loading animation
          st.phase = "load"; st.loadStart = ts; st.f0 = frame; st.p = 0; load.classList.add("on");
        }
        if (st.phase === "load") {
          const f = Math.floor(((ts - st.loadStart) / 1000) * 24);
          if (f >= n) complete();
          else { frame = (st.f0 + f) % n; barBlocks.forEach((i, k) => i.classList.toggle("on", k < Math.round((f / n) * 16))); }
        }
      }

      st.frame = frame;
      drawFigure(frame); drawReveal(frame); updateDom();
    }
    st.raf = requestAnimationFrame(loop);
  }

  const onMove = (e: PointerEvent) => { if (o.loader) return; const r = stage.getBoundingClientRect(); ptr.mx = e.clientX - r.left; ptr.my = e.clientY - r.top; if (ptr.r < 2) { ptr.x = ptr.mx; ptr.y = ptr.my; } ptr.tr = 240; };
  const onLeave = () => { if (!o.loader) ptr.tr = 0; };
  stage.addEventListener("pointermove", onMove); stage.addEventListener("pointerleave", onLeave);
  cta.addEventListener("click", begin);
  q<HTMLElement>(".la-skip").addEventListener("click", () => window.scrollTo({ top: track.getBoundingClientRect().top + window.scrollY + Math.max(0, track.offsetHeight - stage.clientHeight), behavior: reduced ? "auto" : "smooth" }));
  q<HTMLElement>(".la-replay").addEventListener("click", replay);
  const ro = typeof ResizeObserver === "function" ? new ResizeObserver(() => fit()) : null;
  ro?.observe(stage);
  fit();
  if (o.loader) load.classList.add("on");
  st.raf = requestAnimationFrame(loop);

  return {
    replay,
    /** Loader mode: the page behind is built. The bar is waiting for this. */
    setReady(v: boolean) { ready = v; },
    destroy() {
      st.alive = false; cancelAnimationFrame(st.raf); ro?.disconnect();
      stage.removeEventListener("pointermove", onMove); stage.removeEventListener("pointerleave", onLeave);
      document.body.style.overflow = ""; root.innerHTML = ""; root.classList.remove("la", "la-auto", "la-loader");
    },
  };
}
// </engine>

export interface LoadingAnimationProps extends LoadingAnimationOptions {
  className?: string;
  style?: React.CSSProperties;
}

/** React wrapper. Renders a full-width block; give it a scrolling page to live in. */
export function LoadingAnimation({ className, style, onComplete, onGetStarted, onLeave, ready, ...rest }: LoadingAnimationProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const handle = React.useRef<ReturnType<typeof mountLoadingAnimation> | null>(null);
  const cb = React.useRef({ onComplete, onGetStarted, onLeave });
  // after render, not during it: the mount effect reads this through a ref so
  // a new callback identity never tears the animation down and rebuilds it
  React.useEffect(() => { cb.current = { onComplete, onGetStarted, onLeave }; });
  const key = JSON.stringify([rest.name, rest.cta, rest.loadingLabel, rest.readyLabel, rest.replayLabel, rest.scrollHeight, rest.size, rest.spread, rest.showReveal, rest.autoplay, rest.loader, rest.minDuration, rest.font, rest.footer, rest.title, rest.rows, rest.colors, rest.frames ? rest.frames.length : 0]);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const h = mountLoadingAnimation(el, { ...rest, ready, onComplete: () => cb.current.onComplete?.(), onGetStarted: () => cb.current.onGetStarted?.(), onLeave: () => cb.current.onLeave?.() });
    handle.current = h;
    return () => { handle.current = null; h.destroy(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  // `ready` arrives after the mount, so it is pushed in rather than remounting
  React.useEffect(() => { handle.current?.setReady(Boolean(ready)); }, [ready]);
  return <div ref={ref} className={className} style={style} />;
}

export default LoadingAnimation;

// <data>
/**
 * The component shipped with a built-in turn sampled from a third-party video
 * of real people, and said in its own header to replace it before publishing
 * publicly. This site is published publicly, so rather than carry strangers'
 * likenesses in the repository and hope nobody renders them, the built-in set
 * is empty and `frames` is required.
 *
 * This project's frames are in lib/portrait-frames.ts.
 */
const BUILTIN_FRAMES: string[] = [];
// </data>
