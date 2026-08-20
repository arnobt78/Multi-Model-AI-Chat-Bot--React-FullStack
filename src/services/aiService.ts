/**
 * Client AI service — proxies chat to POST /api/chat (secrets never leave the server).
 * Local: use `vercel dev` so /api/* is available; plain `vite` alone cannot reach serverless routes.
 */
import type { AIProvider, ChatRequest, ChatResponse } from "../../shared/ai/types.js";

export type AIChatRequest = ChatRequest;
export type AIChatResponse = ChatResponse;

class AIService {
  async getChatResponse(request: AIChatRequest): Promise<AIChatResponse> {
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: request.message,
          provider: request.provider,
        }),
      });

      const data = (await response.json().catch(() => null)) as
        | AIChatResponse
        | null;

      if (!response.ok || !data) {
        return {
          content: "",
          provider: "None",
          success: false,
          error:
            data?.error ||
            `Chat API error: ${response.status} ${response.statusText}`,
        };
      }

      return data;
    } catch {
      return {
        content: "",
        provider: "None",
        success: false,
        error:
          "Unable to reach the chat API. Use `vercel dev` locally or deploy to Vercel so /api/chat is available.",
      };
    }
  }
}

export const aiService = new AIService();
export type { AIProvider };
