/**
 * POST /api/chat — server-side multi-provider AI proxy (secrets stay on the server).
 * Requires Vercel Functions (vercel dev / production). Plain `vite` alone cannot serve this.
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { orchestrateChat } from "../shared/ai/orchestrate.js";
import { chatRequestSchema } from "../shared/ai/schemas.js";
import { captureApiException } from "../shared/sentry/server.js";
import { allowRequest, clientIp } from "./_lib/rateLimit.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const ip = clientIp(req);
  // Soft cap abusive chat spam without delaying legitimate users
  if (!allowRequest(`chat:${ip}`, 30, 60_000)) {
    return res.status(429).json({
      content: "",
      provider: "None",
      success: false,
      error: "Too many chat requests. Please try again shortly.",
    });
  }

  const parsed = chatRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      content: "",
      provider: "None",
      success: false,
      error: "Invalid chat request",
    });
  }

  try {
    const result = await orchestrateChat(parsed.data);
    return res.status(200).json(result);
  } catch (error) {
    captureApiException(error, { api_route: "/api/chat" });
    return res.status(500).json({
      content: "",
      provider: "None",
      success: false,
      error: "Internal server error",
    });
  }
}
