/**
 * POST /api/chat — server-side multi-provider AI proxy (secrets stay on the server).
 * JSON mode (default) or SSE stream when body.stream === true (ChatGPT-style live tokens).
 * Requires Vercel Functions (vercel dev / production). Plain `vite` alone cannot serve this.
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  orchestrateChat,
  orchestrateChatStream,
} from "../shared/ai/orchestrate.js";
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

  // --- Live SSE token stream (ChatGPT-style) ---
  if (parsed.data.stream) {
    res.writeHead(200, {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    });

    try {
      for await (const event of orchestrateChatStream({
        message: parsed.data.message,
        provider: parsed.data.provider,
      })) {
        res.write(`data: ${JSON.stringify(event)}\n\n`);
      }
      res.write("data: [DONE]\n\n");
      return res.end();
    } catch (error) {
      captureApiException(error, { api_route: "/api/chat", stream: "true" });
      res.write(
        `data: ${JSON.stringify({
          type: "error",
          provider: "None",
          error: "Internal server error",
        })}\n\n`
      );
      return res.end();
    }
  }

  // --- Classic single JSON response ---
  try {
    const result = await orchestrateChat({
      message: parsed.data.message,
      provider: parsed.data.provider,
    });
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
