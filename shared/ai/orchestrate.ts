/**
 * Server-side multi-provider orchestration:
 * outer loop = providers (FALLBACK_ORDER); inner loop = models[] per provider.
 * On HTTP 429, skip remaining models for that provider and advance.
 * Keys from process.env only — never shipped to the browser.
 */
import {
  callGeminiAPI,
  callGroqAPI,
  callHuggingFaceAPI,
  callOpenAIAPI,
  callOpenRouterAPI,
} from "./callers.js";
import { formatUserFacingError } from "./formatError.js";
import { FALLBACK_ORDER, getProviderMeta, PROVIDER_META } from "./providers.js";
import type { AIProvider, ChatRequest, ChatResponse } from "./types.js";
import { ProviderRateLimitError } from "./types.js";

const RATE_LIMIT_COOLDOWN_MS = 5 * 60 * 1000;
const rateLimitedProviders = new Map<string, number>();

function isRateLimited(provider: string): boolean {
  const last = rateLimitedProviders.get(provider);
  if (!last) return false;
  if (Date.now() - last > RATE_LIMIT_COOLDOWN_MS) {
    rateLimitedProviders.delete(provider);
    return false;
  }
  return true;
}

function markRateLimited(provider: string): void {
  rateLimitedProviders.set(provider, Date.now());
}

/** Resolve non-VITE server secret for a provider (empty string if unset). */
export function getServerApiKey(provider: AIProvider): string {
  const envKey = PROVIDER_META[provider].envKey;
  return (process.env[envKey] || "").trim();
}

export function isProviderConfigured(provider: AIProvider): boolean {
  return Boolean(getServerApiKey(provider));
}

function isRetriableError(error: unknown): boolean {
  if (error instanceof ProviderRateLimitError) return false; // handled separately
  const msg = error instanceof Error ? error.message : String(error);
  return (
    msg.includes("429") ||
    msg.includes("408") ||
    msg.includes("500") ||
    msg.includes("502") ||
    msg.includes("503") ||
    msg.includes("504") ||
    msg.includes("empty response") ||
    msg.includes("unavailable") ||
    msg.includes("rate limit") ||
    msg.includes("API error")
  );
}

/**
 * Try each model in the provider chain until one succeeds.
 * On ProviderRateLimitError, mark provider and abort remaining models.
 */
async function callProviderWithModelChain(
  provider: AIProvider,
  message: string,
  apiKey: string
): Promise<string> {
  const meta = getProviderMeta(provider);
  const referer =
    process.env.APP_URL || "https://multi-ai-chat-hub.vercel.app";
  let lastError: unknown;

  for (const model of meta.models) {
    try {
      switch (provider) {
        case "gemini":
          return await callGeminiAPI(
            message,
            apiKey,
            model,
            markRateLimited
          );
        case "groq":
          return await callGroqAPI(message, apiKey, model);
        case "openrouter":
          return await callOpenRouterAPI(message, apiKey, model, referer);
        case "huggingface":
          return await callHuggingFaceAPI(message, apiKey, model);
        case "openai":
          return await callOpenAIAPI(message, apiKey, model);
        default:
          throw new Error(`Unknown provider: ${provider}`);
      }
    } catch (error) {
      lastError = error;
      if (error instanceof ProviderRateLimitError) {
        markRateLimited(provider);
        throw error;
      }
      // Try next model in chain on retriable upstream failures
      if (!isRetriableError(error)) {
        throw error;
      }
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error(`${meta.displayName}: all models in chain failed`);
}

export async function orchestrateChat(
  request: ChatRequest
): Promise<ChatResponse> {
  const { message, provider } = request;

  if (provider) {
    const meta = getProviderMeta(provider);
    const apiKey = getServerApiKey(provider);
    if (!apiKey) {
      return {
        content: "",
        provider: meta.displayName,
        success: false,
        error: `${meta.displayName} is not available`,
      };
    }

    if (isRateLimited(provider)) {
      const timeRemaining = Math.ceil(
        (RATE_LIMIT_COOLDOWN_MS -
          (Date.now() - (rateLimitedProviders.get(provider) || 0))) /
          1000 /
          60
      );
      return {
        content: "",
        provider: meta.displayName,
        success: false,
        error: `${meta.displayName} is currently rate-limited. Please try again in ${timeRemaining} minute(s), or select another provider (Groq, OpenRouter, etc.) from the dropdown.`,
      };
    }

    try {
      const content = await callProviderWithModelChain(
        provider,
        message,
        apiKey
      );
      return { content, provider: meta.displayName, success: true };
    } catch (error) {
      const raw =
        error instanceof Error ? error.message : "Unknown error";
      return {
        content: "",
        provider: meta.displayName,
        success: false,
        error: formatUserFacingError(meta.displayName, raw),
      };
    }
  }

  for (const providerName of FALLBACK_ORDER) {
    const meta = getProviderMeta(providerName);
    const apiKey = getServerApiKey(providerName);
    if (!apiKey) continue;
    if (isRateLimited(providerName)) continue;

    try {
      const content = await callProviderWithModelChain(
        providerName,
        message,
        apiKey
      );
      return { content, provider: meta.displayName, success: true };
    } catch (error) {
      if (error instanceof ProviderRateLimitError) {
        markRateLimited(providerName);
        continue;
      }
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      if (
        errorMessage.includes("rate limit") ||
        errorMessage.includes("429")
      ) {
        markRateLimited(providerName);
      }
      // Continue to next provider on retriable failure
    }
  }

  return {
    content: "",
    provider: "None",
    success: false,
    error: formatUserFacingError(
      "AI providers",
      "All AI providers failed or are unavailable. Please check your API keys."
    ),
  };
}
