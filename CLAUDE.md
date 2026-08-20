# CLAUDE.md

## Overview
Multi-Model AI Chat Hub (`ai-chat-hub` v0.2.1) — Vite CSR + Vercel `api/*`. Chat: localStorage. Insights: Prisma/Neon. Resume: `.agile-v/STATE.md`

**Status:** C1 A+B+C + Sentry + chat UX polish done. Lint/build 0. Gate-0001 A+B approved. Firewall = Human-Action.

---

## Stack
React 18.3 · TS 5.9 · Vite 7.3 · Node 24 · Prisma 6.19 · Zod 4 · ESLint 9 · optional Sentry tunnel

**Not in arch:** Next/SSR · densify/React Query · Redis · auth/JWT · SHA · Python

---

## Topology
- Views: `App.tsx` `start|chat|insights`
- AI: `POST /api/chat` → `shared/ai/orchestrate` (server keys only)
- Models: `shared/ai/providers.ts` — Groq gpt-oss/qwen · Gemini flash(+lite) · OpenRouter `:free` · HF short chain · OpenAI last
- Errors: `shared/ai/formatError.ts` (sanitize keys; friendly HF/OpenAI copy)
- Chat UI: meta under bubbles (time + copy); title cursor hides when done; scroll inside `.chat`
- ESM: relative imports in `api/`/`shared/` use `.js` extensions (Vercel Node)
- Sentry: `VITE_SENTRY_DSN` + `POST /api/monitoring`

---

## Rules
Extend existing shared/ai + Components. CSR only. Plan → approve → implement → validate → `.agile-v/`

## Validate
`npm run lint` · `npm run build`

## Docs
`docs/PROJECT_WALKTHROUGH.md` · LLM_MODEL_SELECTION · Sentry guide §2A/§2B · VERCEL_PRODUCTION_GUARDRAILS
