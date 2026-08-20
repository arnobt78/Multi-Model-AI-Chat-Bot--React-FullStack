/**
 * Client-only Lucide icons for Select AI Model (button + dropdown).
 * Shared PROVIDER_META.icon stores lucide key strings; this map is the render source of truth.
 */
import type { LucideIcon } from "lucide-react";
import {
  BotMessageSquare,
  Boxes,
  BrainCircuit,
  Sparkles,
  Waypoints,
  Zap,
} from "lucide-react";
import type { AIProvider } from "../../shared/ai/types";

/** Auto (no forced provider) uses the same bot mark as the start screen. */
export const AUTO_PROVIDER_ICON: LucideIcon = BotMessageSquare;

const PROVIDER_LUCIDE: Record<AIProvider, LucideIcon> = {
  gemini: Sparkles,
  groq: Zap,
  openrouter: Waypoints,
  huggingface: Boxes,
  openai: BrainCircuit,
};

/** Resolve Lucide component for a configured provider. */
export function getProviderIcon(name: AIProvider): LucideIcon {
  return PROVIDER_LUCIDE[name];
}
