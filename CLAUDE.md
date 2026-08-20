# CLAUDE.md

## Overview
Multi-Model AI Chat Hub (`ai-chat-hub` v0.2.1) — Vite CSR + Vercel `api/*`. Chat: localStorage. Insights: Prisma/Neon. Resume: `.agile-v/STATE.md`

**Status:** C1 done (A+B+C + Sentry + Lucide providers + UX + HF `:fastest` + SSE). Lint/build/audit 0. Gate-0001 A+B approved. Firewall = Human-Action.

---

## Stack
React 18.3 · TS 5.9 · Vite 7.3 · Node 24 · Prisma 6.19 · Zod 4 · ESLint 9 · optional Sentry

**Not in arch:** Next/SSR · densify/React Query · Redis · auth/JWT · SHA · Python

---

## Topology
- Views: `App.tsx` `start|chat|insights`
- AI: `POST /api/chat` JSON or `{stream:true}` SSE → `orchestrate` / `orchestrateChatStream`
- Models: Groq gpt-oss/qwen · Gemini flash(+lite) · OpenRouter `:free` · HF `:fastest` · OpenAI last
- Client: `aiService.streamChatResponse`; Thinking pulse until first delta; no stream caret
- UI: Lucide provider icons (Select AI Model); bubbles 85%; Thinking pulse; send ripple; chat-list ✕ muted
- Errors: `formatError.ts` (sanitize keys)
- ESM: `api/`/`shared/` relative imports use `.js`
- Sentry: `VITE_SENTRY_DSN` + `POST /api/monitoring`

---

## Rules
Extend shared/ai + Components. CSR only. Plan → approve → implement → validate → `.agile-v/`

## Validate
`npm run lint` · `npm run build` · `npm audit --omit=dev`

## Docs
`docs/PROJECT_WALKTHROUGH.md` · LLM_MODEL_SELECTION · Sentry guide §2B · VERCEL_PRODUCTION_GUARDRAILS
