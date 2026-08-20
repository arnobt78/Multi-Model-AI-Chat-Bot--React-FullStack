/**
 * Lazy Node Sentry init for Vercel serverless handlers.
 * No-op when SENTRY_DSN / VITE_SENTRY_DSN is unset.
 */
import * as Sentry from "@sentry/node";
import { getServerSentryDsn, getTracesSampleRate } from "./env";
import { SENTRY_IGNORE_ERRORS, sentryBeforeSend } from "./filters";

let initialized = false;

export function initServerSentry(): void {
  if (initialized) return;
  initialized = true;

  const dsn = getServerSentryDsn();
  Sentry.init({
    dsn,
    enabled: Boolean(dsn),
    tracesSampleRate: getTracesSampleRate(),
    ignoreErrors: SENTRY_IGNORE_ERRORS,
    beforeSend: sentryBeforeSend,
  });
}

/** Capture API failures without changing the HTTP response shape. */
export function captureApiException(
  error: unknown,
  tags?: Record<string, string>
): void {
  initServerSentry();
  if (!getServerSentryDsn()) return;
  Sentry.captureException(error, tags ? { tags } : undefined);
}
