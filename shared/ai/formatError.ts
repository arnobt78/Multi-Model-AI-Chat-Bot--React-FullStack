/**
 * Sanitize and map upstream AI errors to short, user-safe copy (no API key leaks).
 * Used by server orchestrate and optionally the client as a last line of defense.
 */

/** Strip sk-/hf_ tokens and similar secrets from any error string. */
export function sanitizeErrorText(raw: string): string {
  return raw
    .replace(/\bsk-[a-zA-Z0-9_-]{8,}/gi, "[redacted]")
    .replace(/\bhf_[a-zA-Z0-9]{8,}/gi, "[redacted]")
    .replace(/\bBearer\s+[a-zA-Z0-9._-]+/gi, "Bearer [redacted]")
    .replace(/Incorrect API key provided:[^\n.]*/gi, "Incorrect API key provided")
    .trim();
}

/**
 * Map provider/status/raw message → actionable UI text without upstream dumps.
 */
export function formatUserFacingError(
  providerLabel: string,
  raw: string,
  options?: { status?: number }
): string {
  const text = sanitizeErrorText(raw);
  const lower = text.toLowerCase();
  const status = options?.status;
  const name = providerLabel || "This provider";

  if (
    status === 401 ||
    status === 403 ||
    lower.includes("invalid api key") ||
    lower.includes("incorrect api key") ||
    lower.includes("expired") ||
    lower.includes("authentication")
  ) {
    if (lower.includes("openai") || name.toLowerCase().includes("openai")) {
      return "OpenAI API key is missing, expired, or invalid. Renew it at https://platform.openai.com/api-keys, or choose Gemini, Groq, or OpenRouter from the dropdown.";
    }
    return `${name} authentication failed. Check the server API key, or select another provider from the dropdown.`;
  }

  if (
    status === 429 ||
    lower.includes("rate limit") ||
    lower.includes("quota exceeded")
  ) {
    return `${name} is rate-limited or over quota. Try again later, or select another provider from the dropdown.`;
  }

  if (
    lower.includes("hugging face") ||
    name.toLowerCase().includes("hugging")
  ) {
    if (
      status === 400 ||
      lower.includes("unavailable") ||
      lower.includes("400")
    ) {
      return "Hugging Face could not serve a free model right now. Try again, or select Gemini, Groq, or OpenRouter from the dropdown.";
    }
  }

  if (lower.includes("all models in chain failed")) {
    return `${name} has no working models available right now. Select another provider from the dropdown.`;
  }

  // Fallback: sanitized short message (cap length for chat bubbles)
  const cleaned = text.replace(/\s+/g, " ");
  if (cleaned.length > 220) {
    return `${cleaned.slice(0, 217)}…`;
  }
  return cleaned || `${name} failed. Please try another provider.`;
}
