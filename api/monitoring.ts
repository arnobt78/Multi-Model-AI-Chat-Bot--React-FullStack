/**
 * POST /api/monitoring — same-origin Sentry envelope tunnel.
 * Forwards validated envelopes to ingest.sentry.io so browser ad blockers
 * that block *.sentry.io do not drop client events (normal + incognito).
 *
 * Requires Vercel Functions (`vercel dev` / production). Plain `vite` cannot serve this.
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { handleTunnelRequest } from "@sentry/core";
import { getAllowedSentryDsns } from "../shared/sentry/env.js";
import { allowRequest, clientIp } from "./_lib/rateLimit.js";

/** Normalize Vercel body to envelope string (SDK sends text/plain or raw bytes). */
function envelopeFromBody(body: unknown): string | null {
  if (typeof body === "string" && body.length > 0) return body;
  if (Buffer.isBuffer(body) && body.length > 0) return body.toString("utf8");
  if (body instanceof Uint8Array && body.length > 0) {
    return Buffer.from(body).toString("utf8");
  }
  return null;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const allowedDsns = getAllowedSentryDsns();
  if (allowedDsns.length === 0) {
    // Sentry not configured — soft no-op (avoid 500 noise in local vite-less setups)
    return res.status(204).end();
  }

  const ip = clientIp(req);
  // Soft cap abuse of the open tunnel proxy
  if (!allowRequest(`sentry-tunnel:${ip}`, 120, 60_000)) {
    return res.status(429).json({ error: "Too many requests" });
  }

  const envelope = envelopeFromBody(req.body);
  if (!envelope) {
    return res.status(400).json({ error: "Empty envelope" });
  }

  try {
    const upstream = await handleTunnelRequest({
      request: new Request("http://localhost/api/monitoring", {
        method: "POST",
        headers: {
          "content-type":
            (req.headers["content-type"] as string) ||
            "application/x-sentry-envelope",
        },
        body: envelope,
      }),
      allowedDsns,
    });

    const text = await upstream.text();
    res.status(upstream.status);
    const contentType = upstream.headers.get("content-type");
    if (contentType) res.setHeader("Content-Type", contentType);
    return res.send(text);
  } catch {
    return res.status(502).json({ error: "Tunnel forward failed" });
  }
}
