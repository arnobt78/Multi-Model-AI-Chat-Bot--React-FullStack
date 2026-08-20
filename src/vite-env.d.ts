/// <reference types="vite/client" />

/** Client env — AI secrets intentionally omitted (server-only via /api/chat). */
interface ImportMetaEnv {
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly MODE: string;
  /** Public Sentry DSN (optional). Prefer over NEXT_PUBLIC_* — this is a Vite app. */
  readonly VITE_SENTRY_DSN?: string;
  /** Deprecated alias — prefer VITE_SENTRY_DSN */
  readonly VITE_PUBLIC_SENTRY_DSN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
