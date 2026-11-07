import { createServer } from "http";
import { existsSync, readFileSync, statSync } from "fs";
import { dirname, resolve, sep } from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { listModels } from "./models.js";
import { runChat } from "./openrouter.js";
import { sendVerificationEmail } from "./email.js";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "../../..");
for (const envPath of [resolve(repoRoot, ".env"), resolve(here, "../.env")]) {
  if (existsSync(envPath)) dotenv.config({ path: envPath, override: false });
}

const PORT = Number(process.env.PORT || 8787);
const CODE_TTL_MS = 10 * 60 * 1000;
const codes = new Map();
const staticRoot = resolve(repoRoot, "packages/web/dist");
const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

function serveStatic(res, pathname) {
  if (!existsSync(staticRoot)) return false;
  const relative = pathname === "/" ? "index.html" : decodeURIComponent(pathname).replace(/^\/+/, "");
  const candidate = resolve(staticRoot, relative);
  const safePrefix = staticRoot.endsWith(sep) ? staticRoot : `${staticRoot}${sep}`;
  const filePath = candidate.startsWith(safePrefix) ? candidate : resolve(staticRoot, "index.html");
  const finalPath = existsSync(filePath) && statSync(filePath).isFile() ? filePath : resolve(staticRoot, "index.html");
  if (!existsSync(finalPath)) return false;
  const extension = finalPath.slice(finalPath.lastIndexOf(".")).toLowerCase();
  const payload = readFileSync(finalPath);
  res.writeHead(200, { "Content-Type": contentTypes[extension] || "application/octet-stream", "Content-Length": payload.length });
  res.end(payload);
  return true;
}

function generateCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function sendJson(res, status, body) {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Content-Length": Buffer.byteLength(payload),
  });
  res.end(payload);
}

function readBody(req) {
  return new Promise((resolveBody, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8");
      if (!raw) return resolveBody({});
      try {
        resolveBody(JSON.parse(raw));
      } catch (err) {
        reject(new Error("Invalid JSON body"));
      }
    });
    req.on("error", reject);
  });
}

function writeSse(res, event) {
  res.write(`data: ${JSON.stringify(event)}\n\n`);
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);

  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    res.end();
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/health") {
    sendJson(res, 200, {
      ok: true,
      mode: process.env.OPENROUTER_API_KEY?.trim() ? "openrouter" : "free",
    });
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/models") {
    sendJson(res, 200, { models: listModels() });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/auth/send-code") {
    let body;
    try {
      body = await readBody(req);
    } catch (err) {
      sendJson(res, 400, { error: err.message });
      return;
    }
    const email = String(body.email || "").trim().toLowerCase();
    if (!email || !email.includes("@")) {
      sendJson(res, 400, { error: "Invalid email" });
      return;
    }
    const code = generateCode();
    const expiresAt = Date.now() + CODE_TTL_MS;
    codes.set(email, { code, expiresAt, attempts: 0 });
    try {
      const developmentMode = !process.env.SMTP_HOST;
      if (!developmentMode) {
        await sendVerificationEmail({ to: email, code });
      }
      sendJson(res, 200, {
        ok: true,
        delivery: developmentMode ? "development" : "email",
        // A code can only be returned in local development; production must use SMTP.
        ...(developmentMode && process.env.NODE_ENV !== "production" ? { developmentCode: code } : {}),
      });
    } catch (err) {
      codes.delete(email);
      sendJson(res, 500, { error: err.message || "Failed to send email" });
    }
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/auth/verify-code") {
    let body;
    try {
      body = await readBody(req);
    } catch (err) {
      sendJson(res, 400, { error: err.message });
      return;
    }
    const email = String(body.email || "").trim().toLowerCase();
    const code = String(body.code || "").trim();
    if (!email || !code) {
      sendJson(res, 400, { error: "Email and code required" });
      return;
    }
    const entry = codes.get(email);
    if (!entry) {
      sendJson(res, 400, { error: "Code not found or expired" });
      return;
    }
    if (Date.now() > entry.expiresAt) {
      codes.delete(email);
      sendJson(res, 400, { error: "Code expired" });
      return;
    }
    if (entry.attempts >= 5) {
      codes.delete(email);
      sendJson(res, 400, { error: "Too many attempts" });
      return;
    }
    if (entry.code !== code) {
      entry.attempts += 1;
      sendJson(res, 400, { error: "Invalid code" });
      return;
    }
    codes.delete(email);
    sendJson(res, 200, { ok: true });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/chat") {
    let body;
    try {
      body = await readBody(req);
    } catch (err) {
      sendJson(res, 400, { error: err.message });
      return;
    }

    res.writeHead(200, {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
    });

    try {
      await runChat({
        messages: body.messages || [],
        model: body.model,
        systemPrompt:
          body.systemPrompt ||
          "You are Dawood AI, a helpful assistant.",
        onEvent: (event) => writeSse(res, event),
      });
      writeSse(res, { type: "done" });
    } catch (err) {
      writeSse(res, { type: "error", error: err.message || "Chat failed" });
    }
    res.end();
    return;
  }

  if (req.method === "GET" && serveStatic(res, url.pathname)) return;
  sendJson(res, 404, { error: "Not found" });
});

server.listen(PORT, "0.0.0.0", () => {
  const mode = process.env.OPENROUTER_API_KEY?.trim() ? "OpenRouter key loaded" : "free mode, no API key needed";
  const emailMode = process.env.SMTP_HOST ? "SMTP email delivery enabled" : "development verification codes enabled";
  console.log(`Dawood AI server http://localhost:${PORT} (${mode}; ${emailMode})`);
});
