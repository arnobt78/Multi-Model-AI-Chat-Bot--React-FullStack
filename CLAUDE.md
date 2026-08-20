# CLAUDE.md

## Overview
Multi-Model AI Chat Hub (`ai-chat-hub` v0.2.1) — Vite CSR SPA + Vercel `api/*`. Chat: localStorage. Insights: Prisma/Neon. Resume: `.agile-v/STATE.md`

**Status:** C1 A+B+C + Sentry tunnel + README/SEO done. Lint/build/audit 0. Gate-0001 A+B approved. Firewall = Human-Action.

---

## Stack
React 18.3 · TS 5.9 · Vite 7.3 · Node 24.x · Prisma 6.19 · Zod 4 · ESLint 9 · optional Sentry (`@sentry/react` + tunnel)

**Not in arch:** Next/SSR · React Query/densify · Redis · auth/JWT/cookies · SHA · Python

---

## Topology
- Views: `App.tsx` `start|chat|insights` (no router)
- AI: browser → `POST /api/chat` → `shared/ai/orchestrate` (keys server-only, never `VITE_*` AI)
- Models: `shared/ai/providers.ts` `models[]` — Groq gpt-oss/qwen · Gemini flash(+lite) · OpenRouter `:free` · HF short · OpenAI last
- Fallback providers: Groq → Gemini → OpenRouter → HF → OpenAI; 429 skips rest of provider
- Analytics: `POST /api/events` · dashboard `GET /api/dashboard`
- Sentry: `VITE_SENTRY_DSN` + `POST /api/monitoring` tunnel; off if DSN empty

---

## Rules
- Prefer extend existing (`shared/ai`, `api/_lib`, Components/hooks)
- CSR only — no Next patterns unless approved
- Plan → wait approval → implement → validate → update `.agile-v/`
- Docs match code; update only affected files

---

## Validate
`npm run lint` · `npm run build` · record `.agile-v/VALIDATION_SUMMARY.md`

---

## Portable docs
`docs/LLM_MODEL_SELECTION.md` · `docs/Redis_Sentry_PostHog_INTEGRATION_GUIDE.md` (§2A Next / §2B Vite) · `docs/VERCEL_PRODUCTION_GUARDRAILS.md` · `docs/PROJECT_WALKTHROUGH.md`
