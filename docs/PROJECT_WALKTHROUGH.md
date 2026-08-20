# Project Walkthrough — Multi-Model AI Chat Hub

Vite CSR + Vercel Functions (not Next.js). Live: https://multi-ai-chat-hub.vercel.app/

---

## Flow
```text
UI → POST /api/chat {stream:true} → SSE deltas → live bubble
UI → POST /api/chat (JSON) → full reply (compat)
UI → GET /api/chat-providers → availability
UI → POST /api/events → Prisma
UI → GET /api/dashboard
Sentry → POST /api/monitoring (tunnel)
```

---

## Key paths
| Path | Role |
|------|------|
| `src/Components/ConfirmDialog.*` | Delete confirm (icons, Deleting… spinner) |
| `src/Components/AppToast.*` | Success/error toast (title + subtitle) |
| `src/Components/ChatBotApp.*` | Chat UI; Lucide providers; Thinking; send ripple |
| `src/services/aiService.ts` | JSON + SSE client |
| `shared/ai/` | providers, callers, orchestrate, stream, formatError, Zod |
| `shared/sentry/` | client/server Sentry helpers |
| `api/` | chat, chat-providers, events, monitoring, analytics |

---

## Env
Server AI keys (no `VITE_`): GEMINI/GROQ/OPENROUTER/HUGGINGFACE/OPENAI. Insights: `DATABASE_URL` (Coolify VPS Postgres). Sentry optional: `VITE_SENTRY_DSN` + org/project/token.

---

## Providers (code truth)
| Provider | Chain notes |
|----------|-------------|
| Groq | gpt-oss-20b → gpt-oss-120b → qwen3.6-27b |
| Gemini | 2.5-flash → 2.5-flash-lite |
| OpenRouter | `:free` IDs only |
| HF | gemma / Qwen2.5 / gpt-oss / Llama-3.2 — all `:fastest` |
| OpenAI | gpt-4o-mini last |

---

## Done
A+B proxy · C models · Sentry · SSE · Thinking · Lucide · delete UX · Coolify Insights · Insights 3-tab polish · toast bottom-right · single-scroll shell · thin Y + scrollbar-gutter stable · bubble 85%

## Open
Firewall Human-Action · Track D tests · HF free credits flaky

## N/A
densify · Redis · auth · SHA · Python · SSR · React Query · Neon
