import { createReadStream, existsSync, statSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import http from "node:http";
import https from "node:https";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workspaceRoot = path.resolve(__dirname, "..");
const consumerDistRoot = path.join(workspaceRoot, "dist");
const providerDistRoot = path.resolve(workspaceRoot, "..", "-Pet-Health-OS-Provider", "dist");

const PROXY_PORT = Number(process.env.PROXY_PORT || 8080);
const CONSUMER_API_ORIGIN = process.env.CONSUMER_API_ORIGIN || "http://127.0.0.1:8010";
const PROVIDER_API_ORIGIN = process.env.PROVIDER_API_ORIGIN || "http://127.0.0.1:8011";
const MOBILE_API_ORIGIN = process.env.MOBILE_API_ORIGIN || "http://127.0.0.1:8090";

const MIME_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ttf": "font/ttf",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

function log(message) {
  console.log(`[external-proxy] ${message}`);
}

function normalizePathname(pathname) {
  const decoded = decodeURIComponent(pathname);
  const normalized = path.posix.normalize(decoded);
  return normalized.startsWith("/") ? normalized : `/${normalized}`;
}

function safeResolve(root, pathname) {
  const normalized = normalizePathname(pathname);
  const absoluteRoot = path.resolve(root);
  const resolved = path.resolve(root, `.${normalized}`);

  if (!resolved.startsWith(absoluteRoot)) {
    return null;
  }

  return resolved;
}

function fileExists(filePath) {
  return Boolean(filePath) && existsSync(filePath) && statSync(filePath).isFile();
}

function pickAssetFile(pathname) {
  const providerFirst = pathname.startsWith("/assets/provider/");
  const roots = providerFirst
    ? [providerDistRoot, consumerDistRoot]
    : [consumerDistRoot, providerDistRoot];

  for (const root of roots) {
    const candidate = safeResolve(root, pathname);
    if (fileExists(candidate)) {
      return candidate;
    }
  }

  return null;
}

function sendFile(res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || "application/octet-stream";

  res.writeHead(200, {
    "Content-Type": contentType,
    "Cache-Control": filePath.includes(`${path.sep}assets${path.sep}`)
      ? "public, max-age=31536000, immutable"
      : "no-cache",
  });

  createReadStream(filePath).pipe(res);
}

function sendHtml(res, filePath) {
  res.writeHead(200, {
    "Content-Type": "text/html; charset=utf-8",
    "Cache-Control": "no-cache",
  });

  createReadStream(filePath).pipe(res);
}

function proxyRequest(req, res, targetOrigin, options = {}) {
  const target = new URL(targetOrigin);
  const incomingUrl = new URL(req.url || "/", "http://localhost");
  const stripPrefix = options.stripPrefix || "";
  const upstreamPath = stripPrefix && incomingUrl.pathname.startsWith(stripPrefix)
    ? `${incomingUrl.pathname.slice(stripPrefix.length) || "/"}${incomingUrl.search}`
    : `${incomingUrl.pathname}${incomingUrl.search}`;

  const headers = {
    ...req.headers,
    host: target.host,
    connection: "close",
    "x-forwarded-host": req.headers.host || "",
    "x-forwarded-proto": req.socket.encrypted ? "https" : "http",
    "x-forwarded-for": req.socket.remoteAddress || "",
  };

  const requestOptions = {
    protocol: target.protocol,
    hostname: target.hostname,
    port: target.port,
    method: req.method,
    path: upstreamPath,
    headers,
  };

  const transport = target.protocol === "https:" ? https : http;
  const proxyReq = transport.request(requestOptions, (proxyRes) => {
    res.writeHead(proxyRes.statusCode || 502, proxyRes.headers);
    proxyRes.pipe(res);
  });

  proxyReq.on("error", (error) => {
    res.writeHead(502, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({
      success: false,
      message: "Upstream request failed",
      upstream: targetOrigin,
      error: error.message,
    }));
  });

  req.pipe(proxyReq);
}

function handleStaticRequest(req, res) {
  const incomingUrl = new URL(req.url || "/", "http://localhost");
  const pathname = normalizePathname(incomingUrl.pathname);
  const consumerIndex = path.join(consumerDistRoot, "index.html");
  const providerIndex = path.join(providerDistRoot, "provider", "index.html");

  if (pathname.startsWith("/assets/")) {
    const assetFile = pickAssetFile(pathname);
    if (assetFile) {
      sendFile(res, assetFile);
      return true;
    }
    return false;
  }

  if (pathname === "/provider" || pathname === "/provider/") {
    sendHtml(res, providerIndex);
    return true;
  }

  if (pathname.startsWith("/provider/")) {
    const exactProviderFile = safeResolve(providerDistRoot, pathname);
    if (fileExists(exactProviderFile)) {
      sendFile(res, exactProviderFile);
      return true;
    }

    sendHtml(res, providerIndex);
    return true;
  }

  const exactConsumerFile = safeResolve(consumerDistRoot, pathname);
  if (fileExists(exactConsumerFile)) {
    sendFile(res, exactConsumerFile);
    return true;
  }

  sendHtml(res, consumerIndex);
  return true;
}

async function ensureBuildArtifacts() {
  const expectedFiles = [
    path.join(consumerDistRoot, "index.html"),
    path.join(providerDistRoot, "provider", "index.html"),
  ];

  const missing = expectedFiles.filter((filePath) => !fileExists(filePath));
  if (missing.length === 0) {
    return;
  }

  throw new Error(`Missing build artifacts: ${missing.join(", ")}`);
}

async function main() {
  await mkdir(path.join(workspaceRoot, "scripts"), { recursive: true });
  await ensureBuildArtifacts();

  const server = http.createServer((req, res) => {
    const incomingUrl = new URL(req.url || "/", "http://localhost");
    const pathname = normalizePathname(incomingUrl.pathname);

    if (pathname === "/healthz") {
      res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
      res.end(JSON.stringify({
        ok: true,
        consumerApi: CONSUMER_API_ORIGIN,
        providerApi: PROVIDER_API_ORIGIN,
        mobileApi: MOBILE_API_ORIGIN,
        consumerDist: consumerDistRoot,
        providerDist: providerDistRoot,
      }));
      return;
    }

    if (pathname === "/sanctum/csrf-cookie" || pathname.startsWith("/api/") || pathname === "/api") {
      proxyRequest(req, res, CONSUMER_API_ORIGIN);
      return;
    }

    if (pathname.startsWith("/provider-api/") || pathname === "/provider-api") {
      proxyRequest(req, res, PROVIDER_API_ORIGIN, { stripPrefix: "/provider-api" });
      return;
    }

    if (pathname.startsWith("/mobile-api/") || pathname === "/mobile-api") {
      proxyRequest(req, res, MOBILE_API_ORIGIN, { stripPrefix: "/mobile-api" });
      return;
    }

    if (!handleStaticRequest(req, res)) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not found");
    }
  });

  server.listen(PROXY_PORT, "127.0.0.1", () => {
    log(`listening on http://127.0.0.1:${PROXY_PORT}`);
    log(`consumer UI -> /`);
    log(`provider UI -> /provider`);
    log(`consumer API -> /api/*`);
    log(`provider API -> /provider-api/api/v1/*`);
    log(`mobile API -> /mobile-api/api/mobile/v1/*`);
  });
}

main().catch((error) => {
  console.error("[external-proxy] failed to start");
  console.error(error);
  process.exitCode = 1;
});
