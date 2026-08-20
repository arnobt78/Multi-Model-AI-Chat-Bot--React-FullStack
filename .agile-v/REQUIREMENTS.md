# REQUIREMENTS.md — Cycle C1

Status legend: `BASELINE` = already implemented (document for traceability) · `PROPOSED` = candidate for C1 · `DEFERRED` = out of current gate unless approved

---

## Baseline Product Requirements (verified in code)

### REQ-0001 — Multi-provider AI chat
**Status:** BASELINE  
User can send prompts and receive AI responses via Gemini, Groq, OpenRouter, Hugging Face, or OpenAI.  
**Evidence:** `src/services/aiService.ts`, `src/services/aiProviders.ts`, `src/Components/ChatBotApp.tsx`

### REQ-0002 — Automatic provider fallback
**Status:** BASELINE  
When no provider is selected, service tries providers in order with rate-limit skip/cooldown.  
**Order (code):** Groq → Gemini → OpenRouter → Hugging Face → OpenAI  
**Evidence:** `aiService.chat()` auto-fallback loop

### REQ-0003 — Manual provider selection
**Status:** BASELINE  
UI dropdown lists available providers (those with API keys).  
**Evidence:** `ChatBotApp.tsx` + `getAvailableProviders()`

### REQ-0004 — Chat history in browser storage
**Status:** BASELINE  
Chats and messages persist in `localStorage`; delete chat removes related keys.  
**Evidence:** `App.tsx`, `ChatBotApp.tsx`

### REQ-0005 — Welcome → chat → insights views
**Status:** BASELINE  
View state machine in `App.tsx` (`start` | `chat` | `insights`); no React Router.  
**Evidence:** `App.tsx`

### REQ-0006 — Anonymous analytics events
**Status:** BASELINE  
Client posts events to `POST /api/events` with anonymous `sessionId`.  
**Evidence:** `ChatBotApp.tsx` `trackEvent`, `api/events.ts`, Prisma `Event`/`Session`

### REQ-0007 — Business Insights dashboard
**Status:** BASELINE  
Dashboard loads aggregated metrics from `GET /api/dashboard` (and related endpoints).  
**Evidence:** `BusinessInsights.tsx`, `api/dashboard.ts`, `api/usage.ts`, `api/insights.ts`, `api/providers.ts`

### REQ-0008 — UX polish
**Status:** BASELINE  
Typing indicator, typewriter title, emoji picker, collapsible sidebar, tooltips, dark theme CSS.  
**Evidence:** Components under `src/Components/`, `useTypewriter.ts`

---

## Proposed C1 Requirements (need Gate 1 approval)

### REQ-0009 — Stop exposing AI API keys in the browser bundle
**Status:** DONE · Priority **P0** · Risk **RISK-0001**  
All provider keys use server env (`GEMINI_API_KEY`, etc.) via `POST /api/chat`. Client has no `VITE_*` AI keys.  
**Evidence:** `api/chat.ts`, `shared/ai/orchestrate.ts`, thin `src/services/aiService.ts`

### REQ-0010 — Harden analytics APIs
**Status:** DONE (light) · Priority **P0** · Risk **RISK-0002**  
Zod on events; soft IP rate limits on analytics + chat; Prisma singleton. Insights remain public for demo.  
**Evidence:** `api/events.ts`, `api/_lib/*`, other `api/*.ts`

### REQ-0011 — Production crawl / cost guardrails (Vite-adapted)
**Status:** DONE (code) · Priority **P1** · Risk **RISK-0003**  
`vercel.json` security + `/assets` immutable cache; `public/robots.txt`. Dashboard Bot Protection still Human-Action.  
**Evidence:** `vercel.json`, `public/robots.txt`

### REQ-0012 — Provider/model registry hygiene
**Status:** DONE · Priority **P1** · Risk **RISK-0004**  
`shared/ai/providers.ts` uses free-tier `models[]` chains (Groq gpt-oss/qwen; Gemini 2.5 flash(+lite); OpenRouter `:free`). Within-provider fallback in orchestrate.  
**Evidence:** `shared/ai/providers.ts`, `shared/ai/callers.ts`, `shared/ai/orchestrate.ts`, `docs/LLM_MODEL_SELECTION.md` (verified 2026-08-20)

### REQ-0013 — Minimal automated validation
**Status:** PROPOSED · Priority **P1** · Risk **RISK-0005**  
Add at least: typecheck script, lint green, and smoke tests for AI service fallback selection + API request validation (no live paid API calls in CI).  
**Affected:** `package.json` scripts, new test harness (Vitest recommended for Vite)

### REQ-0014 — Project documentation truthfulness
**Status:** DONE · Priority **P2**  
README educational rewrite; `.env.example`; `SECURITY.md`; `docs/PROJECT_WALKTHROUGH.md`; portable Sentry guide §2A/§2B.  
**Evidence:** `README.md`, `SECURITY.md`, `.env.example`, `docs/PROJECT_WALKTHROUGH.md`

### REQ-0015 — Observability (Sentry) — optional
**Status:** DONE · Priority **P2** · Risk **RISK-0006**  
Vite `@sentry/react` + same-origin tunnel `POST /api/monitoring`; server capture via `@sentry/node`; source maps via `@sentry/vite-plugin` when token set. Use `VITE_SENTRY_DSN` (not `NEXT_PUBLIC_*`).  
**Evidence:** `shared/sentry/`, `src/sentry.ts`, `api/monitoring.ts`, `.env.example`, README Sentry section

### REQ-0016 — Chat durability beyond localStorage — deferred
**Status:** DEFERRED · Priority **P3**  
Server-side chat history / sync would require auth and schema expansion. Out of C1 unless explicitly approved.

### REQ-0017 — User authentication — deferred
**Status:** DEFERRED · Priority **P3**  
README roadmap mentions auth. Not required for C1 hardening.

---

## Open Questions (human input needed)

1. Is C1 scope **security-first** (REQ-0009/0010) or **docs/guardrails-only** for this cycle?
2. Should Business Insights remain **public** or become **admin-secret** protected?
3. Preferred inference proxy: Vercel serverless per provider, or single `/api/chat` with server-side fallback?
4. Keep free-tier multi-key client demo behavior for local DIY, while production uses server keys?
5. Approve Redis/PostHog now, later, or never for this Vite app?

---

## Traceability Index

| REQ | Tasks | Risks | Decisions |
|-----|-------|-------|-----------|
| REQ-0001..0008 | — (baseline) | — | DEC-0001 |
| REQ-0009 | TASK-0001, TASK-0002 | RISK-0001 | — |
| REQ-0010 | TASK-0003 | RISK-0002 | — |
| REQ-0011 | TASK-0004 | RISK-0003 | — |
| REQ-0012 | TASK-0005 | RISK-0004 | — |
| REQ-0013 | TASK-0006 | RISK-0005 | — |
| REQ-0014 | TASK-0007 | — | — |
| REQ-0015 | TASK-0008 | RISK-0006 | — |
| REQ-0016..0017 | — | — | DEC-0002 |
