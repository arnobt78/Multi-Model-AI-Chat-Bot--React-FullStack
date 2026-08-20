/**
 * Zod schemas for chat + analytics API request bodies (server validation).
 */
import { z } from "zod";

export const chatRequestSchema = z.object({
  message: z.string().trim().min(1).max(8000),
  provider: z
    .enum(["openai", "gemini", "groq", "huggingface", "openrouter"])
    .optional(),
});

export const chatResponseSchema = z.object({
  content: z.string(),
  provider: z.string(),
  success: z.boolean(),
  error: z.string().optional(),
});

export const eventBodySchema = z.object({
  sessionId: z.string().trim().min(1).max(128),
  eventType: z.string().trim().min(1).max(64),
  provider: z.string().trim().max(64).nullable().optional(),
  success: z.boolean().optional(),
  duration: z.number().int().nonnegative().max(600_000).nullable().optional(),
  // Cap metadata to reduce abuse / DB bloat
  metadata: z.string().max(2000).optional().nullable(),
});

export type ChatRequestInput = z.infer<typeof chatRequestSchema>;
export type EventBodyInput = z.infer<typeof eventBodySchema>;
