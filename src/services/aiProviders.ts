/**
 * Client provider metadata + availability from GET /api/chat-providers (no API keys).
 */
import { PROVIDER_META, FALLBACK_ORDER } from "../../shared/ai/providers.js";
import type {
  AIProvider,
  ProviderAvailability,
} from "../../shared/ai/types.js";

export type { AIProvider, ProviderAvailability };

/** Static UI metadata (labels + lucide key; render via getProviderIcon). */
export interface ProviderConfig {
  name: AIProvider;
  displayName: string;
  /** Lucide icon id from PROVIDER_META (UI uses getProviderIcon(name)). */
  icon: string;
  available: boolean;
}

export const AI_PROVIDERS: Record<AIProvider, ProviderConfig> = {
  gemini: {
    name: "gemini",
    displayName: PROVIDER_META.gemini.displayName,
    icon: PROVIDER_META.gemini.icon,
    available: false,
  },
  groq: {
    name: "groq",
    displayName: PROVIDER_META.groq.displayName,
    icon: PROVIDER_META.groq.icon,
    available: false,
  },
  openrouter: {
    name: "openrouter",
    displayName: PROVIDER_META.openrouter.displayName,
    icon: PROVIDER_META.openrouter.icon,
    available: false,
  },
  huggingface: {
    name: "huggingface",
    displayName: PROVIDER_META.huggingface.displayName,
    icon: PROVIDER_META.huggingface.icon,
    available: false,
  },
  openai: {
    name: "openai",
    displayName: PROVIDER_META.openai.displayName,
    icon: PROVIDER_META.openai.icon,
    available: false,
  },
};

/** Fetch which providers have server-side keys configured. */
export async function fetchAvailableProviders(): Promise<ProviderConfig[]> {
  try {
    const res = await fetch("/api/chat-providers");
    if (!res.ok) return [];
    const data = (await res.json()) as { providers?: ProviderAvailability[] };
    const list = data.providers || [];
    return list
      .filter((p) => p.available)
      .map((p) => ({
        name: p.name,
        displayName: p.displayName,
        icon: p.icon,
        available: true,
      }));
  } catch {
    return [];
  }
}

/** Sync helper for initial empty state; prefer fetchAvailableProviders for live data. */
export const getAvailableProviders = (): ProviderConfig[] =>
  FALLBACK_ORDER.map((name) => AI_PROVIDERS[name]).filter((p) => p.available);

export const getProvider = (name: AIProvider): ProviderConfig =>
  AI_PROVIDERS[name];
