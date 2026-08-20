/**
 * Same-origin Sentry tunnel path — browser SDK POSTs here instead of *.ingest.sentry.io
 * so ad blockers / privacy extensions do not drop events in normal or incognito windows.
 */
export const SENTRY_TUNNEL_ROUTE = "/api/monitoring";
