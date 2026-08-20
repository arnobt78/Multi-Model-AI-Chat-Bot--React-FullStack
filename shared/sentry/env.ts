/**
 * Sentry DSN / sample-rate helpers for this Vite + Vercel Functions app.
 * Client must use VITE_SENTRY_DSN (NEXT_PUBLIC_* is Next-only and unused here).
 */

/** Browser / Vite build-time DSN (public by design). */
export function getClientSentryDsn(): string | undefined {
  // Vite replaces import.meta.env.* when bundling src/
  try {
    const env = import.meta.env as ImportMetaEnv & {
      VITE_PUBLIC_SENTRY_DSN?: string;
    };
    const fromVite =
      env?.VITE_SENTRY_DSN?.trim() ||
      // Compat alias if someone used VITE_PUBLIC_* (prefer VITE_SENTRY_DSN)
      env?.VITE_PUBLIC_SENTRY_DSN?.trim();
    if (fromVite) return fromVite;
  } catch {
    // Node / api context: import.meta.env may be unavailable
  }
  const fromProcess =
    process.env.VITE_SENTRY_DSN?.trim() ||
    process.env.VITE_PUBLIC_SENTRY_DSN?.trim();
  return fromProcess || undefined;
}

/** Server SDK + tunnel allowlist — prefer SENTRY_DSN, fall back to Vite client DSN. */
export function getServerSentryDsn(): string | undefined {
  const dsn =
    process.env.SENTRY_DSN?.trim() ||
    process.env.VITE_SENTRY_DSN?.trim() ||
    process.env.VITE_PUBLIC_SENTRY_DSN?.trim() ||
    undefined;
  return dsn || undefined;
}

/** DSNs the tunnel is allowed to forward (SSRF protection). */
export function getAllowedSentryDsns(): string[] {
  const list = [
    process.env.SENTRY_DSN?.trim(),
    process.env.VITE_SENTRY_DSN?.trim(),
    process.env.VITE_PUBLIC_SENTRY_DSN?.trim(),
  ].filter((v): v is string => Boolean(v));
  return [...new Set(list)];
}

export function getTracesSampleRate(): number {
  try {
    if (import.meta.env?.PROD) return 0.1;
  } catch {
    // Node api context
  }
  if (typeof process !== "undefined" && process.env.NODE_ENV === "production") {
    return 0.1;
  }
  return 1.0;
}
