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

## Providers (code truth)
| Provider | Chain notes |
|----------|-------------|
| Groq | gpt-oss-20b → gpt-oss-120b → qwen3.6-27b |
| Gemini | 2.5-flash → 2.5-flash-lite |
| OpenRouter | `:free` IDs only |
| HF | gemma-2-2b-it / Qwen2.5-7B / gpt-oss-20b / Llama-3.2-3B — all `:fastest` |
| OpenAI | gpt-4o-mini last |

Forced HF may still return friendly “could not serve…” (HTTP 200). Prefer Auto/Groq/Gemini/OpenRouter.

---

## Done
A+B proxy · C model chains · Sentry tunnel · ESM `.js` · UX polish · HF `:fastest` · README/SECURITY

## Open
Firewall Human-Action · Track D tests · HF free credits tiny/flaky

## N/A
densify · Redis · auth · SHA · Python · SSR
