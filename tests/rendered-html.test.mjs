import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import test from "node:test";

const projectRoot = new URL("../", import.meta.url);
const clientRoot = new URL("../dist/client/", import.meta.url);

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`https://portfolio.test${path}`, {
      headers: {
        accept: "text/html",
        host: "portfolio.test",
        "x-forwarded-host": "portfolio.test",
        "x-forwarded-proto": "https",
      },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the build log", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();

  assert.match(html, /<title>The Build Log · S. Dhruv Reddy<\/title>/i);
  // The hero sets the name one letter at a time, so the readable name lives
  // in a visually hidden span beside it.
  assert.match(html, /S\. Dhruv Reddy/);
  // the roles live in the rotator, listed once for screen readers
  assert.match(html, /full-stack developer/);
  assert.match(html, /AI builder/);
  assert.match(html, /freelancer/);
  // and the socials
  assert.match(html, /github\.com\/DhruvReddyS/);
  assert.match(html, /linkedin\.com\/in\/sripathi-dhruv-reddy/);
  assert.match(html, /SRIPATHI/);
  assert.match(html, /DHRUV REDDY/);
  assert.match(html, /9\.34 \/ 10/);

  // every section head is present
  for (const head of [
    "Where it happened",
    "What got built",
    "A dual degree, run in parallel",
    "Thirty-one things I build with",
    "What it won",
    "And a studio he runs",
    "How to start one",
  ]) {
    assert.match(html, new RegExp(head), `renders "${head}"`);
  }

  assert.doesNotMatch(html, /Your site is taking shape|Building your site/);
});

test("renders all five log entries with what each one was", async () => {
  const html = await (await render()).text();

  for (const company of [
    "SimpleHire.ai",
    "Axon Development",
    "Paper Foundation India",
    "Sai Enterprises",
    "Osmania Technology Business Incubator",
  ]) {
    assert.match(html, new RegExp(company.replace(/\./g, "\\.")), `renders ${company}`);
  }

  // the card carries when, who and the brief; the full account is behind it
  assert.match(html, /Oct 2026 to now/);
  assert.match(html, /Full Stack Developer Intern/);
  assert.match(html, /AI-powered recruitment and candidate screening/);
  assert.match(html, /Read the entry/);

  // every entry is on the grid, marked with its monogram
  for (const monogram of ["SH", "AX", "PF", "SE", "OT"]) {
    assert.match(html, new RegExp(`>${monogram}</span>`), `grid carries ${monogram}`);
  }
});

test("renders the index: six case files, both side quests and the margin note", async () => {
  const html = await (await render()).text();

  for (const project of [
    "Corpusil",
    "CodeSync",
    "TRINETRA",
    "Ascend",
    "HMS",
    "QuizMaster",
  ]) {
    assert.match(html, new RegExp(project), `renders ${project}`);
  }

  // the side quests are rows in the same index, not a list under it
  assert.match(html, /Side quest/i);
  assert.match(html, /ReconAI/);
  assert.match(html, /SnapFix/);

  // the note in the margin
  assert.match(html, /Margin note/i);
  assert.match(html, /A case file proves it holds/);

  // every row is filed under a figure off the project, or what kind of
  // build it was when it has no figure
  assert.match(html, /49,684 indexed passages/);
  assert.match(html, /IIT Madras BS, Data Science/);

  // a row's name opens the case file; an outbound link is a separate thing
  assert.match(html, /case file/i);
  assert.match(html, /<a[^>]+target="_blank"/);
});

test("renders all four wins", async () => {
  const html = await (await render()).text();

  assert.match(html, /Data Dynamo 2\.0/);
  assert.match(html, /ASTRA Tech Club/);
  assert.match(html, /DEVloop/);
  assert.match(html, /Project Expo 2026/);
});

test("renders both degrees with their figures", async () => {
  const html = await (await render()).text();

  assert.match(html, /MVSR Engineering College/);
  assert.match(html, /Indian Institute of Technology Madras/);
  assert.match(html, /9\.34/);
  assert.match(html, /Computer Science &amp; Information Technology/);
  assert.match(html, /Data Science &amp; Applications/);
  assert.match(html, /iitm-foundation-certificate\.pdf/);
});

test("the toolkit wall lists its shelves", async () => {
  const html = await (await render()).text();

  for (const shelf of ["Interface", "Server", "Applied AI", "Data", "Delivery"]) {
    assert.match(html, new RegExp(shelf), `has the ${shelf} shelf`);
  }
  assert.match(html, /PostgreSQL/);
  assert.match(html, /LangGraph/);
});

test("every section anchor the nav points at exists", async () => {
  const html = await (await render()).text();
  for (const id of ["top", "log", "work", "stack", "wins", "contact"]) {
    assert.match(html, new RegExp(`id="${id}"`), `has #${id}`);
  }
});

test("the rendered page contains no em dashes", async () => {
  // The design brief bans them; this keeps them from creeping back into copy.
  const html = await (await render()).text();
  assert.doesNotMatch(html, /—/);
});

test("serves the colophon with its privacy and terms sections", async () => {
  const response = await render("/colophon");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /Colophon/);
  assert.match(html, /Privacy/);
  assert.match(html, /Terms/);
  assert.match(html, /There is no analytics on this site/);
  assert.match(html, /buildlog-lamp/);
  assert.match(html, /no cookies|sets no cookies/i);
});

test("build emits the client module and the referenced assets", async () => {
  const html = await (await render()).text();
  const moduleMatch = html.match(/href="(\/assets\/portfolio-experience-[^"]+\.js)"/);

  assert.ok(moduleMatch, "portfolio client module preload is present");
  await access(new URL(`.${moduleMatch[1]}`, clientRoot));

  const requiredAssets = [
    "dhruv-hero.png",
    "healthcare-3d.png",
    "rag-3d.png",
    "ml-groundwater-3d.png",
    "data-dynamo-win.png",
    "byusforu-logo.png",
    "dhruv-reddy-resume.pdf",
    "iitm-foundation-certificate.pdf",
    "iitm-programming-certificate.pdf",
  ];
  const emittedAssets = await readdir(new URL("assets/", clientRoot));
  for (const asset of requiredAssets) {
    assert.ok(emittedAssets.includes(asset), `emits ${asset}`);
  }

  // the social card sits at the public root rather than under assets/
  await access(new URL("og.png", clientRoot));
});

test("the avatar is kept out of the server bundle", async () => {
  // The avatar package compiles a JSON schema with `new Function`, which the
  // Workers runtime refuses, so it must only ever load in the browser.
  const grok = await readFile(new URL("components/buildlog/grok.tsx", projectRoot), "utf8");
  assert.match(grok, /dynamic\(\(\) => import\("\.\/grok-avatar"\)/);
  assert.match(grok, /ssr:\s*false/);

  const page = await readFile(
    new URL("app/portfolio-experience.tsx", projectRoot),
    "utf8",
  );
  assert.doesNotMatch(page, /@bible-strong/);
});

test("the source avoids the icon library and keeps the hand-drawn marks", async () => {
  const files = [
    "components/buildlog/sections.tsx",
    "components/buildlog/nav.tsx",
    "components/buildlog/grok.tsx",
    "components/buildlog/toolkit.tsx",
    "components/buildlog/education.tsx",
    "components/buildlog/work-index.tsx",
    "components/buildlog/smooth.tsx",
  ];

  for (const file of files) {
    const source = await readFile(new URL(file, projectRoot), "utf8");
    assert.doesNotMatch(source, /lucide-react/, `${file} uses no icon library`);
    assert.doesNotMatch(source, /—/, `${file} has no em dashes`);
  }

  const marks = await readFile(
    new URL("components/buildlog/marks.tsx", projectRoot),
    "utf8",
  );
  assert.match(marks, /export function MarkArrow/);
  assert.match(marks, /export function MarkLamp/);
});
