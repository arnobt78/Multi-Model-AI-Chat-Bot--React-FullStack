/**
 * Client AI service — proxies chat to POST /api/chat (secrets never leave the server).
 * Supports classic JSON replies and SSE live-token streaming (ChatGPT-style).
 * Local: use `vercel dev` so /api/* is available; plain `vite` alone cannot reach serverless routes.
 */
import type {
  AIProvider,
  ChatRequest,
  ChatResponse,
} from "../../shared/ai/types.js";
import type { ChatStreamEvent } from "../../shared/ai/stream.js";

export type AIChatRequest = ChatRequest;
export type AIChatResponse = ChatResponse;
export type { ChatStreamEvent };

export type StreamChatHandlers = {
  onEvent: (event: ChatStreamEvent) => void;
};

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

  /**
   * Live token stream — appends deltas via onEvent until done/error.
   * Falls back to JSON + synthetic deltas if the server returns non-SSE.
   */
  async streamChatResponse(
    request: AIChatRequest,
    handlers: StreamChatHandlers
  ): Promise<{ success: boolean; provider: string; content: string; error?: string }> {
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/event-stream",
        },
        body: JSON.stringify({
          message: request.message,
          provider: request.provider,
          stream: true,
        }),
      });

      const contentType = response.headers.get("content-type") || "";

      // Non-SSE fallback (older deploy / proxy) — still animate via one delta
      if (!contentType.includes("text/event-stream")) {
        const data = (await response.json().catch(() => null)) as
          | AIChatResponse
          | null;
        if (!data?.success) {
          const err =
            data?.error ||
            `Chat API error: ${response.status} ${response.statusText}`;
          handlers.onEvent({
            type: "error",
            provider: data?.provider || "None",
            error: err,
          });
          return {
            success: false,
            provider: data?.provider || "None",
            content: "",
            error: err,
          };
        }
        handlers.onEvent({ type: "start", provider: data.provider });
        handlers.onEvent({ type: "delta", text: data.content });
        handlers.onEvent({ type: "done", provider: data.provider });
        return {
          success: true,
          provider: data.provider,
          content: data.content,
        };
      }

      if (!response.ok || !response.body) {
        const err = `Chat stream error: ${response.status}`;
        handlers.onEvent({ type: "error", provider: "None", error: err });
        return { success: false, provider: "None", content: "", error: err };
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let provider = "None";
      let content = "";
      let success = false;
      let lastError: string | undefined;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const rawLine of lines) {
          const line = rawLine.trim();
          if (!line.startsWith("data:")) continue;
          const payload = line.slice(5).trim();
          if (!payload || payload === "[DONE]") continue;

          let event: ChatStreamEvent;
          try {
            event = JSON.parse(payload) as ChatStreamEvent;
          } catch {
            continue;
          }

          handlers.onEvent(event);

          if (event.type === "start" || event.type === "done") {
            provider = event.provider;
          }
          if (event.type === "delta") {
            content += event.text;
          }
          if (event.type === "done") {
            success = true;
          }
          if (event.type === "error") {
            provider = event.provider;
            lastError = event.error;
            success = false;
          }
        }
      }

      return { success, provider, content, error: lastError };
    } catch {
      const err =
        "Unable to reach the chat API. Use `vercel dev` locally or deploy to Vercel so /api/chat is available.";
      handlers.onEvent({ type: "error", provider: "None", error: err });
      return { success: false, provider: "None", content: "", error: err };
    }
  }
}

export const aiService = new AIService();
export type { AIProvider };
