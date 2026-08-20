# Project Walkthrough — Multi-Model AI Chat Hub

Short agent/human map of this **Vite + Vercel Functions** repo (not Next.js).

---

## What it is
SPA chat hub for Gemini / Groq / OpenRouter / Hugging Face / OpenAI. History in **localStorage**. Optional **Business Insights** via Prisma + PostgreSQL. Live: https://multi-ai-chat-hub.vercel.app/

---

## Request flow
```text
UI → POST /api/chat → shared/ai/orchestrate → upstream APIs
UI → GET /api/chat-providers → availability only
UI → POST /api/events → Prisma (analytics)
UI → GET /api/dashboard (+ usage/insights/providers)
Browser Sentry → POST /api/monitoring → ingest (tunnel)
```

---

## Key folders
| Path | Role |
|------|------|
| `src/Components/` | ChatBotStart, ChatBotApp, BusinessInsights, Tooltip, TypingIndicator |
| `src/services/` | Thin client → `/api/chat`, `/api/chat-providers` |
| `src/hooks/useTypewriter.ts` | Typewriter effect |
| `shared/ai/` | Types, model registry, callers, orchestrate, Zod |
| `shared/sentry/` | DSN helpers, filters, server capture |
| `api/` | Serverless handlers + `_lib/prisma`, `_lib/rateLimit` |
| `prisma/schema.prisma` | Event, Session, ProviderStats |

---

## Env (see `.env.example`)
- **Chat:** `GEMINI_API_KEY`, `GROQ_API_KEY`, `OPENROUTER_API_KEY`, `HUGGINGFACE_API_KEY`, `OPENAI_API_KEY` (server-only)
- **Insights:** `DATABASE_URL`
- **Sentry optional:** `VITE_SENTRY_DSN`, `SENTRY_DSN`, `SENTRY_ORG`, `SENTRY_PROJECT`, `SENTRY_AUTH_TOKEN`
- UI alone needs no `.env`; chat needs keys + `vercel dev`

---

## Run
```bash
nvm use          # Node 24
npm install
cp .env.example .env
vercel dev       # full stack (Vite alone has no /api)
npm run lint && npm run build
```

---

## Done (C1)
A+B secure chat proxy + headers/robots · C free-tier model chains · Sentry tunnel · README/SECURITY/SEO

## Open
Vercel firewall Human-Action · optional Track D tests · fix `DATABASE_URL` “Needs Attention” if shown

---

## N/A here
densify / React Query / SSR cache / Redis / JWT cookies / SHA crypto theater / Python
