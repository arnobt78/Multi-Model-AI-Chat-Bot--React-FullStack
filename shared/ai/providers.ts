/**
 * Provider registry (metadata + free-tier model chains) — no secrets.
 * Model IDs aligned with docs/LLM_MODEL_SELECTION.md (verified 2026-08-20).
 */
import type { AIProvider, ProviderMeta } from "./types.js";

export const PROVIDER_META: Record<AIProvider, ProviderMeta> = {
  // Google Gemini — free AI Studio Flash family
  gemini: {
    name: "gemini",
    displayName: "Google Gemini",
    models: ["gemini-2.5-flash", "gemini-2.5-flash-lite"],
    icon: "🤖",
    envKey: "GEMINI_API_KEY",
  },
  // Groq — llama-3.1-8b-instant shut down 2026-08-16; use gpt-oss / qwen chain
  groq: {
    name: "groq",
    displayName: "Groq",
    models: [
      "openai/gpt-oss-20b",
      "openai/gpt-oss-120b",
      "qwen/qwen3.6-27b",
    ],
    icon: "⚡",
    envKey: "GROQ_API_KEY",
  },
  // OpenRouter — free tier requires `:free` model ID suffix
  openrouter: {
    name: "openrouter",
    displayName: "OpenRouter",
    models: ["openai/gpt-oss-20b:free", "openai/gpt-oss-120b:free"],
    icon: "💬",
    envKey: "OPENROUTER_API_KEY",
  },
  // Hugging Face Inference Providers router — router-friendly IDs (no known-dead Phi rung)
  huggingface: {
    name: "huggingface",
    displayName: "Hugging Face",
    models: [
      "mistralai/Mistral-7B-Instruct-v0.3",
      "Qwen/Qwen2.5-7B-Instruct",
      "google/gemma-2-2b-it",
      "HuggingFaceH4/zephyr-7b-beta",
    ],
    icon: "🔍",
    envKey: "HUGGINGFACE_API_KEY",
  },
  // OpenAI — paid last-resort rung
  openai: {
    name: "openai",
    displayName: "OpenAI GPT",
    models: ["gpt-4o-mini"],
    icon: "🧠",
    envKey: "OPENAI_API_KEY",
  },
};

/** Auto-fallback order across providers (fastest free tiers first). */
export const FALLBACK_ORDER: AIProvider[] = [
  "groq",
  "gemini",
  "openrouter",
  "huggingface",
  "openai",
];

export const getProviderMeta = (name: AIProvider): ProviderMeta =>
  PROVIDER_META[name];
