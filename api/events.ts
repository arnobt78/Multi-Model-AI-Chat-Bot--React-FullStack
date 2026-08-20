/**
 * POST /api/events — anonymous analytics write (Zod + soft IP rate limit).
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { eventBodySchema } from "../shared/ai/schemas.js";
import { captureApiException } from "../shared/sentry/server.js";
import { prisma } from "./_lib/prisma.js";
import { allowRequest, clientIp } from "./_lib/rateLimit.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const ip = clientIp(req);
  if (!allowRequest(`events:${ip}`, 60, 60_000)) {
    return res.status(429).json({ error: "Too many requests" });
  }

  const parsed = eventBodySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Missing or invalid fields" });
  }

  const { sessionId, eventType, provider, success, duration, metadata } =
    parsed.data;

  try {
    await prisma.session.upsert({
      where: { sessionId },
      update: { lastSeen: new Date() },
      create: {
        sessionId,
        userAgent: (req.headers["user-agent"] as string) || null,
        platform: "web",
        startedAt: new Date(),
        lastSeen: new Date(),
      },
    });

    const event = await prisma.event.create({
      data: {
        sessionId,
        eventType,
        provider: provider || null,
        success: success !== undefined ? success : true,
        duration: duration ?? null,
        metadata: metadata ? String(metadata) : null,
      },
    });

    return res.status(200).json({ success: true, id: event.id });
  } catch (error) {
    captureApiException(error, { api_route: "/api/events" });
    return res.status(500).json({ error: "Internal server error" });
  }
}
