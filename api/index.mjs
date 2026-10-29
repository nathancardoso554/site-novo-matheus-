import app from "../server/index.mjs";
import { readFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(process.cwd(), "client");
const types = {
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2"
};

async function assetFetch(request) {
  const url = new URL(request.url);
  let pathname = decodeURIComponent(url.pathname);
  if (pathname === "/" || pathname.includes("..")) {
    return new Response("Not found", { status: 404 });
  }
  const file = path.resolve(root, "." + pathname);
  if (!file.startsWith(root + path.sep)) return new Response("Not found", { status: 404 });
  try {
    const body = await readFile(file);
    const ext = path.extname(file).toLowerCase();
    return new Response(body, { status: 200, headers: { "content-type": types[ext] || "application/octet-stream", "cache-control": ext === ".html" ? "no-cache" : "public, max-age=31536000, immutable" } });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}

export default async function handler(req, res) {
  try {
    const url = new URL(req.url || "/", `https://${req.headers.host || "localhost"}`);
    // Serve real files in /client directly before SSR. This avoids image/chunk
    // requests falling through to the application router on serverless deploys.
    if ((req.method || "GET") === "GET" || (req.method || "GET") === "HEAD") {
      const pathname = decodeURIComponent(url.pathname);
      if (pathname !== "/" && !pathname.includes("..")) {
        const candidate = path.resolve(root, "." + pathname);
        if (candidate.startsWith(root + path.sep)) {
          try {
            const body = await readFile(candidate);
            const ext = path.extname(candidate).toLowerCase();
            const contentType = types[ext] || "application/octet-stream";
            res.statusCode = 200;
            res.setHeader("content-type", contentType);
            res.setHeader("x-content-type-options", "nosniff");
            res.setHeader("cache-control", ext === ".jpg" || ext === ".jpeg" || ext === ".webp"
              ? "public, max-age=86400"
              : "public, max-age=31536000, immutable");
            if ((req.method || "GET") === "HEAD") return res.end();
            return res.end(body);
          } catch {
            // Not a static file; continue to the SSR application.
          }
        }
      }
    }
    const request = new Request(url, { method: req.method || "GET", headers: req.headers });
    const env = { ASSETS: { fetch: assetFetch } };
    const response = await app.fetch(request, env, { waitUntil() {} }, url);
    res.statusCode = response.status;
    const contentType = response.headers.get("content-type") || "";
    const shouldRepairHtml = response.status === 200 && (req.method || "GET") === "GET" && contentType.includes("text/html");

    if (shouldRepairHtml) {
      let html = await response.text();

      // The old client depended on React hydration for every form click. If hydration
      // fails on a browser, the server-rendered buttons look alive but do nothing.
      // Replace just the form section with a native controller, and do not load the
      // React entrypoint on this page. The static SSR site and stylesheet stay intact.
      html = html.replace(
        /(<section\b(?=[^>]*\bid="pre-selecao")[^>]*>).*?(<\/section>)/is,
        (_match, opening, closing) => {
          const cleanOpening = opening.replace(/\bid="pre-selecao"/, 'id="formulario-pre-selecao"');
          return `${cleanOpening}<div id="native-form-root" class="mx-auto max-w-3xl px-5 lg:px-10 py-20 lg:py-28"></div>${closing}`;
        }
      );

      // Internal links scroll without adding a fragment to the URL.
      html = html.replace(/href="#([^"]+)"/g, (_match, target) => `href="/" data-scroll-target="${target}"`);

      // Remove the React module entry that previously attached the broken controls.
      html = html.replace(/\s*<script\b(?=[^>]*\bsrc=["']\/assets\/index-[^"']+\.js["'])[^>]*>\s*<\/script>/gi, "");
      html = html.replace(/<link\b(?=[^>]*\brel=["']modulepreload["'])(?=[^>]*\bhref=["']\/assets\/(?:index|routes)-[^"']+\.js["'])[^>]*>/gi, "");

      // Clear a fragment before the browser performs native anchor scrolling.
      const clearFragment = `<script>(function(){try{if(location.hash){history.replaceState(history.state,"",location.pathname+location.search)}}catch(e){}})();</script>`;
      html = html.replace(/<head\b[^>]*>/i, (head) => `${head}${clearFragment}`);
      html = html.replace(/<\/body>/i, '<script src="/form-controller-v2.js"></script></body>');

      response.headers.forEach((value, key) => {
        if (["content-length", "content-encoding", "transfer-encoding", "etag", "last-modified"].includes(key.toLowerCase())) return;
        res.setHeader(key, value);
      });
      res.setHeader("content-type", "text/html; charset=utf-8");
      res.setHeader("cache-control", "no-store, max-age=0");
      return res.end(html);
    }

    response.headers.forEach((value, key) => res.setHeader(key, value));
    const body = Buffer.from(await response.arrayBuffer());
    res.end(body);
  } catch (error) {
    console.error("Site handler error:", error);
    res.statusCode = 500;
    res.end("Internal Server Error");
  }
}
