import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import test from "node:test";

const projectRoot = new URL("../", import.meta.url);
const clientRoot = new URL("../dist/client/", import.meta.url);

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("https://portfolio.test/", {
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

test("server-renders the complete portfolio experience", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(
    html,
    /<title>Dhruv Reddy — Full-stack &amp; AI Engineer · Dhruv Reddy<\/title>/i,
  );
  assert.match(html, /Ready to take a look\?/);
  assert.match(html, /A flight through what I’ve[\s\S]{0,160}built\./);
  assert.match(html, /Open details for CodeSync/);
  assert.match(html, /AI Research Intern &amp; Team Lead/);
  assert.match(html, /THE CAREER SIGNAL/);
  assert.match(html, /View chapter/);
  assert.match(html, /DR \/ SIGNAL/);
  assert.match(html, /OBJECT FIELD \/ 07/);
  assert.match(html, /TOOLKIT \/ VERIFIED/);
  assert.match(html, /TYPICALLY REPLIES WITHIN 24 HOURS/);
  assert.match(html, /00H[\s\S]*24H/);
  assert.match(html, /LEARNING IN MOTION/);
  assert.match(
    html,
    /Correct tools\.[\s\S]{0,200}Correct colors\.[\s\S]{0,200}Zero filler\./,
  );
  assert.match(html, /Meet Pixel, Dhruv’s portfolio guide/);
  assert.match(html, /pixel-mascot\.png/);
  assert.match(html, /LET’S/);
  assert.match(html, /BUILD/);
  assert.doesNotMatch(html, /Your site is taking shape|Building your site/);
});

test("build emits the portfolio client module and required public assets", async () => {
  const response = await render();
  const html = await response.text();
  const moduleMatch = html.match(
    /href="(\/assets\/portfolio-experience-[^"]+\.js)"/,
  );

  assert.ok(moduleMatch, "portfolio client module preload is present");
  await access(new URL(`.${moduleMatch[1]}`, clientRoot));
  await access(new URL("og.png", clientRoot));

  const requiredAssets = [
    "dhruv-hero.png",
    "pixel-mascot.png",
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

  const source = await readFile(
    new URL("app/portfolio-experience.tsx", projectRoot),
    "utf8",
  );
  assert.match(source, /setActiveProject\(project\)/);
  assert.match(source, /role="dialog"/);
  assert.match(source, /aria-label=\{`Open details for \$\{project\.name\}`\}/);
  assert.match(source, /id="orbit"/);
  assert.match(source, /id="skills"/);
  assert.match(source, /id="contact"/);
  assert.match(source, /id="footer"/);
  assert.match(source, /const journeySections/);

  const pixel = await readFile(
    new URL("components/portfolio-pet.tsx", projectRoot),
    "utf8",
  );
  assert.match(pixel, /Hi, I’m/);
  assert.match(pixel, /8 SIGNALS LOADED/);
  assert.match(pixel, /Meet your portfolio guide/);
  assert.match(pixel, /setTimeout\(enterChat, 3200\)/);

  const keyboard = await readFile(
    new URL("components/ui/typing-keyboard.tsx", projectRoot),
    "utf8",
  );
  assert.match(keyboard, /loop = false/);
  assert.match(keyboard, /full-stcak/);
  assert.match(keyboard, /backspace/);
  assert.match(keyboard, /Press Enter to enter the portfolio/);
});
