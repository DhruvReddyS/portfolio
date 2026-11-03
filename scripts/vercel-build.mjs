/**
 * Lay vinext's build out the way Vercel expects to find it.
 *
 * vinext builds for Cloudflare Workers: static files into `dist/client` and
 * one Web-standard `{ fetch }` module into `dist/server`. Vercel sees `next`
 * in the dependencies, runs its own Next.js builder, finds no `.next`, and
 * stops. That is the whole of the failure. The build itself was fine.
 *
 * So this writes the Build Output API's `.vercel/output` instead, which
 * Vercel takes as-is and does not try to interpret: the client directory
 * becomes the static root, and the server bundle becomes one function that
 * everything not on disk falls through to.
 *
 * The bundle imports `node:async_hooks`, `node:fs` and `node:path`, so it is
 * a Node function rather than an Edge one; at 3MB it would not have fitted
 * in an Edge bundle anyway.
 *
 * Run after `vinext build`. See `vercel.json`.
 */

import { cp, mkdir, rm, writeFile, access } from "node:fs/promises";
import { basename, join } from "node:path";

const root = process.cwd();
const dist = join(root, "dist");
const out = join(root, ".vercel", "output");
const fn = join(out, "functions", "index.func");

/** Node version to ask Vercel for, kept in step with package.json engines. */
const RUNTIME = "nodejs22.x";

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

/*
 * Node's req/res to the Web Request/Response the bundle speaks, and back.
 *
 * Vercel's Node launcher hands over an IncomingMessage and a ServerResponse.
 * Everything inside the bundle is written against the fetch API, because it
 * was built for a Worker, so the adapter is the whole of the port.
 */
const ADAPTER = `import { Readable } from "node:stream";
import worker from "./server/index.js";

/*
 * The bindings a Worker would have been given.
 *
 * ASSETS is absent on purpose: static files are served off the filesystem
 * before a request ever reaches this function, and the one place the bundle
 * asks for it (the image endpoint) already falls back to a plain fetch
 * against the deployment's own origin. DB is absent because nothing on this
 * site reads it.
 */
const env = {};

const ctx = {
  waitUntil() {},
  passThroughOnException() {},
};

function toRequest(req) {
  const host = req.headers["x-forwarded-host"] ?? req.headers.host ?? "localhost";
  /*
   * Vercel always sets the forwarded scheme, but the bundle refetches its
   * own assets through this URL, so getting it from the socket when the
   * header is absent is the difference between that working anywhere else
   * and failing the TLS handshake against a plain HTTP origin.
   */
  const proto =
    req.headers["x-forwarded-proto"] ?? (req.socket?.encrypted ? "https" : "http");
  const url = new URL(req.url ?? "/", \`\${proto}://\${host}\`);

  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (value === undefined) continue;
    if (Array.isArray(value)) for (const one of value) headers.append(key, one);
    else headers.set(key, value);
  }

  const method = req.method ?? "GET";
  const bodied = method !== "GET" && method !== "HEAD";

  return new Request(url, {
    method,
    headers,
    body: bodied ? Readable.toWeb(req) : undefined,
    // required by undici whenever a stream is the body
    duplex: bodied ? "half" : undefined,
    redirect: "manual",
  });
}

async function send(response, res) {
  const headers = {};
  response.headers.forEach((value, key) => {
    if (key.toLowerCase() !== "set-cookie") headers[key] = value;
  });

  // several Set-Cookie headers survive only as an array
  const cookies = response.headers.getSetCookie?.() ?? [];
  if (cookies.length) headers["set-cookie"] = cookies;

  res.writeHead(response.status, headers);

  if (!response.body) {
    res.end();
    return;
  }

  await new Promise((resolve, reject) => {
    const stream = Readable.fromWeb(response.body);
    stream.on("error", reject);
    res.on("close", resolve);
    res.on("error", reject);
    stream.pipe(res);
  });
}

export default async function handler(req, res) {
  try {
    const response = await worker.fetch(toRequest(req), env, ctx);
    await send(response, res);
  } catch (error) {
    console.error("[vercel] request failed:", error);
    if (!res.headersSent) res.writeHead(500, { "content-type": "text/plain" });
    res.end("Internal Server Error");
  }
}
`;

async function main() {
  if (!(await exists(dist))) {
    throw new Error("dist/ is missing. Run `vinext build` before this script.");
  }

  await rm(join(root, ".vercel", "output"), { recursive: true, force: true });
  await mkdir(fn, { recursive: true });

  /*
   * Everything that can be served off disk, served off disk, minus the
   * three things in there that only mean something to Cloudflare: its
   * headers file, its assets-ignore file, and Vite's build manifest, which
   * is a map of the bundle and no business of anyone fetching the site.
   */
  const CLOUDFLARE_ONLY = new Set(["_headers", ".assetsignore", ".vite"]);
  await cp(join(dist, "client"), join(out, "static"), {
    recursive: true,
    filter: (src) => !CLOUDFLARE_ONLY.has(basename(src)),
  });

  // and the one function the rest of it falls through to
  await cp(join(dist, "server"), join(fn, "server"), { recursive: true });
  await writeFile(join(fn, "index.mjs"), ADAPTER);
  await writeFile(join(fn, "package.json"), JSON.stringify({ type: "module" }, null, 2) + "\n");
  await writeFile(
    join(fn, ".vc-config.json"),
    JSON.stringify(
      {
        runtime: RUNTIME,
        handler: "index.mjs",
        launcherType: "Nodejs",
        shouldAddHelpers: false,
        supportsResponseStreaming: true,
      },
      null,
      2,
    ) + "\n",
  );

  await writeFile(
    join(out, "config.json"),
    JSON.stringify(
      {
        version: 3,
        routes: [
          // hashed build assets never change under their own name
          {
            src: "/assets/(.*)\\.(js|css|woff2?)$",
            headers: { "cache-control": "public, max-age=31536000, immutable" },
            continue: true,
          },
          { handle: "filesystem" },
          { src: "/(.*)", dest: "/index" },
        ],
      },
      null,
      2,
    ) + "\n",
  );

  console.log("[vercel] wrote .vercel/output (static + 1 node function)");
}

await main();
