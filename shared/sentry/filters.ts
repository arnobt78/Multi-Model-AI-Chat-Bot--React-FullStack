/**
 * Shared noise filters for client + server Sentry.init (extension / chunk noise).
 */
import type { ErrorEvent } from "@sentry/core";

export const SENTRY_IGNORE_ERRORS: Array<string | RegExp> = [
  "ResizeObserver loop limit exceeded",
  "ResizeObserver loop completed with undelivered notifications.",
  "Non-Error promise rejection captured",
  "Script error.",
  /Loading chunk [\d]+ failed/,
  "top.GLOBALS",
  "AbortError",
];

const THIRD_PARTY_PATTERNS = [
  /chrome-extension:\/\//i,
  /moz-extension:\/\//i,
  /safari-extension:\/\//i,
  /grammarly/i,
  /googletranslate/i,
];

function isThirdPartyNoise(text: string): boolean {
  return THIRD_PARTY_PATTERNS.some((p) => p.test(text));
}

/** Drop browser-extension / translator noise; keep everything else. */
export function sentryBeforeSend(event: ErrorEvent): ErrorEvent | null {
  const text = JSON.stringify(event.exception ?? event.message ?? "");
  if (isThirdPartyNoise(text)) return null;
  return event;
}
