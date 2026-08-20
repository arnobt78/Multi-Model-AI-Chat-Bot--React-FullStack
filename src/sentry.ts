/**
 * Client Sentry bootstrap — call before React render.
 * Events go to same-origin /api/monitoring (tunnel) to bypass ad blockers.
 */
import * as Sentry from "@sentry/react";
import {
  getClientSentryDsn,
  getTracesSampleRate,
  SENTRY_IGNORE_ERRORS,
  SENTRY_TUNNEL_ROUTE,
  sentryBeforeSend,
} from "../shared/sentry";

const dsn = getClientSentryDsn();

Sentry.init({
  dsn,
  enabled: Boolean(dsn),
  tunnel: SENTRY_TUNNEL_ROUTE,
  tracesSampleRate: getTracesSampleRate(),
  ignoreErrors: SENTRY_IGNORE_ERRORS,
  beforeSend: sentryBeforeSend,
  environment: import.meta.env.MODE,
});

export { Sentry };
