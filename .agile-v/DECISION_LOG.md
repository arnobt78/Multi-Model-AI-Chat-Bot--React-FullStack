# DECISION_LOG.md

Append-only. Never rewrite prior entries.

---

## DEC-0001 — Bootstrap Agile V Cycle C1 from existing codebase
- **Timestamp:** 2026-08-20T12:02:03Z
- **Agent:** ORCH-C1 (Cursor / Agile V pipeline)
- **Decision:** Create `.agile-v/` and treat current React+Vite+Prisma app as baseline; do not invent Next.js architecture.
- **Rationale:** `.agile-v/` did not exist; protocol requires bootstrap + analysis before implementation; code is SPA (Vite), not App Router.
- **Linked REQs:** REQ-0001..REQ-0008 (baseline documentation)
- **Alternatives considered:** Defer Agile V until greenfield rewrite — rejected (repo already shipping features)

## DEC-0002 — Defer auth and server chat history from default C1
- **Timestamp:** 2026-08-20T12:02:03Z
- **Agent:** ORCH-C1
- **Decision:** Mark REQ-0016/REQ-0017 DEFERRED unless human explicitly expands Gate 1 scope.
- **Rationale:** Highest verified risks are secret exposure and open analytics/cost exposure; auth/sync are larger product changes.
- **Linked REQs:** REQ-0016, REQ-0017

## DEC-0003 — Treat portable docs as non-binding until adapted
- **Timestamp:** 2026-08-20T12:02:03Z
- **Agent:** ORCH-C1
- **Decision:** `docs/LLM_MODEL_SELECTION.md`, `docs/Redis_Sentry_PostHog_INTEGRATION_GUIDE.md`, and Next-specific sections of `docs/VERCEL_PRODUCTION_GUARDRAILS.md` are references only; implementation must adapt to Vite + Vercel Functions.
- **Rationale:** Docs reference Next.js, CodeBook, and other project artifacts not present here.
- **Linked REQs:** REQ-0011, REQ-0012, REQ-0014, REQ-0015

## DEC-0005 — Free-tier model chains (Track C)
- **Timestamp:** 2026-08-20T12:40:00Z
- **Agent:** Build
- **Decision:** Replace Groq `llama-3.1-8b-instant` with `openai/gpt-oss-20b` → `openai/gpt-oss-120b` → `qwen/qwen3.6-27b`; OpenRouter only `:free` IDs; Gemini flash + flash-lite; `ProviderMeta.models[]` + inner-loop fallback.
- **Rationale:** Groq Llama Instant shut down 2026-08-16; LLM_MODEL_SELECTION.md + Groq/OpenRouter docs.
- **Linked REQs:** REQ-0012

## DEC-0006 — Vite Sentry + /api/monitoring tunnel (REQ-0015)
- **Timestamp:** 2026-08-20T14:50:00Z
- **Agent:** Build
- **Decision:** Integrate `@sentry/react` + `@sentry/node` + `@sentry/vite-plugin`; same-origin tunnel `POST /api/monitoring` via `@sentry/core` `handleTunnelRequest`; client DSN = `VITE_SENTRY_DSN` (compat: `VITE_PUBLIC_SENTRY_DSN`); never `@sentry/nextjs` / `NEXT_PUBLIC_*`.
- **Rationale:** Ad blockers drop `*.ingest.sentry.io`; DSN was in env with zero code (RISK-0006).
- **Linked REQs:** REQ-0015

## DEC-0007 — HF Hub models with `:fastest` routing
- **Timestamp:** 2026-08-20T15:45:00Z
- **Agent:** Build
- **Decision:** Replace legacy HF IDs (Mistral/Zephyr-style) with documented Hub chat models + `:fastest` (`gemma-2-2b-it`, `Qwen2.5-7B-Instruct`, `gpt-oss-20b`, `Llama-3.2-3B-Instruct`). Keep HF late in `FALLBACK_ORDER`. Treat forced-HF empty credit / host miss as expected UX (friendly error), not a security defect.
- **Rationale:** Inference Providers free pool is tiny (~$0.10/mo); hosts rotate; `:fastest` picks a live upstream. Prefer Groq/Gemini/OpenRouter for daily use.
- **Linked REQs:** REQ-0012
