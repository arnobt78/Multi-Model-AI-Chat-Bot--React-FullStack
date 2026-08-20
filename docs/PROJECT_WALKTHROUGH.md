# Project Walkthrough — Multi-Model AI Chat Hub

Vite CSR + Vercel Functions (not Next.js). Live: https://multi-ai-chat-hub.vercel.app/

---

## Flow
```text
UI → POST /api/chat → shared/ai/orchestrate → upstream
UI → GET /api/chat-providers → availability
UI → POST /api/events → Prisma
UI → GET /api/dashboard
Sentry → POST /api/monitoring (tunnel)
```

---

## Key paths
| Path | Role |
|------|------|
| `src/Components/ChatBotApp.*` | Chat + message-meta (time/copy) |
| `shared/ai/` | providers, callers, orchestrate, formatError, Zod |
| `shared/sentry/` | client/server Sentry helpers |
| `api/` | chat, chat-providers, events, monitoring, analytics |

---

## Env
Server AI keys (no `VITE_`): GEMINI/GROQ/OPENROUTER/HUGGINGFACE/OPENAI. Insights: `DATABASE_URL`. Sentry optional: `VITE_SENTRY_DSN` + org/project/token.

---

## Done
A+B proxy · C model chains · Sentry tunnel · ESM `.js` fix · UX polish (errors/meta/scroll) · README/SECURITY

## Open
Firewall Human-Action · Track D tests · HF free router still flaky (Auto falls through)

## N/A
densify · Redis · auth · SHA · Python · SSR
