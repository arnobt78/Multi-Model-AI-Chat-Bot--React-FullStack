/**
 * GET /api/chat-providers — which AI providers have server env keys configured.
 * Returns booleans + UI metadata only (never API keys).
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { FALLBACK_ORDER, PROVIDER_META } from "../shared/ai/providers.js";
import { isProviderConfigured } from "../shared/ai/orchestrate.js";
import type { ProviderAvailability } from "../shared/ai/types.js";
import { allowRequest, clientIp } from "./_lib/rateLimit.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // #region agent log
  console.log(
    JSON.stringify({
      sessionId: "d6348e",
      hypothesisId: "A",
      location: "api/chat-providers.ts:handler",
      message: "chat-providers handler entered (ESM resolve OK)",
      data: { method: req.method },
      timestamp: Date.now(),
      runId: "post-fix",
    })
  );
  // #endregion
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const ip = clientIp(req);
  if (!allowRequest(`chat-providers:${ip}`, 60, 60_000)) {
    return res.status(429).json({ error: "Too many requests" });
  }

  const providers: ProviderAvailability[] = FALLBACK_ORDER.map((name) => {
    const meta = PROVIDER_META[name];
    return {
      name: meta.name,
      displayName: meta.displayName,
      icon: meta.icon,
      available: isProviderConfigured(name),
    };
  });

  return res.status(200).json({ providers });
}
