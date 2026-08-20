/**
 * SSE helpers for OpenAI-compatible chat streaming (Groq / OpenRouter / HF / OpenAI).
 * Yields text deltas only — callers handle auth errors and empty streams.
 */
export type ChatStreamEvent =
  | { type: "start"; provider: string }
  | { type: "delta"; text: string }
  | { type: "done"; provider: string }
  | { type: "error"; provider: string; error: string };

/** Parse `data: {...}` lines from an OpenAI-style chat.completion.chunk SSE body. */
export async function* readOpenAiCompatSse(
  response: Response
): AsyncGenerator<string> {
  if (!response.body) {
    throw new Error("Upstream stream has no body");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
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

        try {
          const json = JSON.parse(payload) as {
            choices?: { delta?: { content?: string | null } }[];
          };
          const piece = json.choices?.[0]?.delta?.content;
          if (typeof piece === "string" && piece.length > 0) {
            yield piece;
          }
        } catch {
          // Skip malformed SSE chunks
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}

/** Gemini streamGenerateContent?alt=sse — yields text parts. */
export async function* readGeminiSse(
  response: Response
): AsyncGenerator<string> {
  if (!response.body) {
    throw new Error("Gemini stream has no body");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
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
        if (!payload) continue;

        try {
          const json = JSON.parse(payload) as {
            candidates?: { content?: { parts?: { text?: string }[] } }[];
          };
          const piece = json.candidates?.[0]?.content?.parts?.[0]?.text;
          if (typeof piece === "string" && piece.length > 0) {
            yield piece;
          }
        } catch {
          // Skip malformed SSE chunks
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}
