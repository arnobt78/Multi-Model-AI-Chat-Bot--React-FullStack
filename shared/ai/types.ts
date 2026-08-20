/**
 * Shared AI contracts — used by Vercel `/api/chat*` (server) and Vite client.
 * Never put API keys in this module.
 */

export type AIProvider =
  | "openai"
  | "gemini"
  | "groq"
  | "huggingface"
  | "openrouter";

export interface ProviderMeta {
  name: AIProvider;
  displayName: string;
  /** Ordered within-provider free-tier model chain (try next on retriable failure). */
  models: string[];
  /** Lucide icon id for clients (UI maps key → component; not an emoji). */
  icon: string;
  /** Server env var name that holds the secret (never VITE_*). */
  envKey: string;
}

export interface ChatRequest {
  message: string;
  provider?: AIProvider;
  /** Request SSE token stream from /api/chat when true. */
  stream?: boolean;
}

export interface ChatResponse {
  content: string;
  provider: string;
  success: boolean;
  error?: string;
}

/** Public dropdown row — availability only, never secrets. */
export interface ProviderAvailability {
  name: AIProvider;
  displayName: string;
  icon: string;
  available: boolean;
}

/** Thrown by callers so orchestrator can skip remaining models on provider-wide 429. */
export class ProviderRateLimitError extends Error {
  readonly provider: string;
  constructor(provider: string, message: string) {
    super(message);
    this.name = "ProviderRateLimitError";
    this.provider = provider;
  }
}
