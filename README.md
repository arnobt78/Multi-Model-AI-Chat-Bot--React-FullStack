# Multi-Model AI Chat Hub - React, Vite, TypeScript, Prisma, PostgreSQL Full-Stack Project (including Insights & Performance Dashboard)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.3.1-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.3.6-blue)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-24.x-green)](https://nodejs.org/)
[![Prisma ORM](https://img.shields.io/badge/Prisma_ORM-6.19-blue)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-blue)](https://www.postgresql.org/)
[![Vercel](https://img.shields.io/badge/Vercel_Serverless-Functions-black)](https://vercel.com/)
[![Zod](https://img.shields.io/badge/Zod-4.x-blue)](https://zod.dev/)
[![Sentry](https://img.shields.io/badge/Sentry-optional-purple)](https://sentry.io/)
[![launch with diploi badge](https://diploi.com/launch.svg)](https://diploi.com/launch/arnobt78/OpenAI-ChatBot--ReactVite)

A modern, responsive AI chat bot application supporting multiple AI providers including Google Gemini, Groq, OpenRouter, Hugging Face, and OpenAI and enable to store the chat history. Built with React, TypeScript, and Vite including business-insights analytics and performance dashboard, typewriter effect, and animated icons for the best user experience.

- **Live-Demo:** [https://multi-ai-chat-hub.vercel.app/](https://multi-ai-chat-hub.vercel.app/)
- **Security:** Private reports → [SECURITY.md](./SECURITY.md) · [contact@arnobmahmud.com](mailto:contact@arnobmahmud.com)
- **Author:** [Arnob Mahmud](https://www.arnobmahmud.com/) | **LinkedIn:** [https://www.linkedin.com/in/arnob-mahmud-05839655/](https://www.linkedin.com/in/arnob-mahmud-05839655/) | **GitHub:** [https://github.com/arnobt78](https://github.com/arnobt78)

![Screenshot 2025-10-26 at 12 23 05](https://github.com/user-attachments/assets/3455c420-1ef0-4386-8ee1-6af569c30a52)
![Screenshot 2025-10-26 at 12 23 53](https://github.com/user-attachments/assets/62de71c5-3c32-4a87-a82c-8e46baa817d8)
![Screenshot 2025-10-26 at 12 24 13](https://github.com/user-attachments/assets/cfc05f0f-2754-453c-be8b-83f502c3b9f2)
![Screenshot 2025-10-26 at 12 24 33](https://github.com/user-attachments/assets/6be72f08-b00b-412e-a15a-983bcc5bfc23)
![Screenshot 2025-10-26 at 12 24 50](https://github.com/user-attachments/assets/4b3a429c-0666-40b1-b69e-b075d13835d5)
![Screenshot 2025-10-26 at 12 24 57](https://github.com/user-attachments/assets/ccc4a310-ac52-4fcd-a648-186088c968a0)
![Screenshot 2025-10-26 at 12 25 09](https://github.com/user-attachments/assets/5d95c8fc-bff5-4af9-8c37-eab9422542a7)
![Screenshot 2025-10-26 at 12 25 20](https://github.com/user-attachments/assets/ef3b9bc0-60cf-457e-94f9-30cbc4ff7d2f)
![Screenshot 2025-10-26 at 12 25 33](https://github.com/user-attachments/assets/c6be8309-63aa-44eb-ba12-c72dc7438885)
![Screenshot 2025-10-26 at 12 25 36](https://github.com/user-attachments/assets/d91bef44-463d-4b9d-868f-277ef3eb81e2)

---

## Table of Contents

- [Overview](#overview)
- [Keywords](#keywords)
- [Features](#features)
- [How the App Works (Beginner Walkthrough)](#how-the-app-works-beginner-walkthrough)
- [Technologies & Libraries](#technologies--libraries)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Variables (`.env`)](#environment-variables-env)
- [How to Run](#how-to-run)
- [Usage Guide](#usage-guide)
- [Frontend Components & Hooks](#frontend-components--hooks)
- [Shared AI Layer](#shared-ai-layer)
- [Backend API Endpoints](#backend-api-endpoints)
- [Database (Prisma + PostgreSQL)](#database-prisma--postgresql)
- [Sentry (Optional Observability)](#sentry-optional-observability)
- [Reusing Code in Other Projects](#reusing-code-in-other-projects)
- [Deployment (Vercel)](#deployment-vercel)
- [Scripts Reference](#scripts-reference)
- [Further Reading](#further-reading)
- [Conclusion](#conclusion)
- [License](#license)
- [Happy Coding!](#happy-coding-)

---

## Overview

**AI Chat Hub** (package name `ai-chat-hub`) is a **Vite client-rendered SPA** (not Next.js) with **Vercel Serverless Functions** under `api/`.

You can:

1. Chat with several AI providers from one UI.
2. Let the server **auto-fallback** across providers and models when one fails or rate-limits.
3. Keep **chat history in the browser** (`localStorage`) — no login required for chatting.
4. Open a **Business Insights** dashboard backed by **Prisma + PostgreSQL** (anonymous analytics).

**Important architecture idea for learners:** AI API keys stay on the **server** (`GEMINI_API_KEY`, etc.). The browser only calls `POST /api/chat`. That way secrets never appear in the Vite JavaScript bundle.

---

## Keywords

`AI Chat Hub` · `multi-provider chatbot` · `Gemini` · `Groq` · `OpenRouter` · `Hugging Face` · `OpenAI` · `React 18` · `Vite` · `TypeScript` · `Prisma` · `PostgreSQL` · `Neon` · `Vercel Serverless` · `Zod` · `Sentry tunnel` · `localStorage` · `auto fallback` · `Business Insights` · `OpenAI-compatible API`

---

## Features

### Core chat

- **Multi-provider support** — Gemini, Groq, OpenRouter, Hugging Face, OpenAI
- **Auto fallback** — provider order: Groq → Gemini → OpenRouter → Hugging Face → OpenAI
- **Within-provider model chains** — try the next free-tier model on retriable errors; skip remaining models on HTTP 429
- **Provider dropdown** — availability comes from `GET /api/chat-providers` (no secrets)
- **Chat history** — multiple threads stored in `localStorage`
- **Typing indicator** — visual feedback while waiting for the AI
- **Emoji picker** — `@emoji-mart/react`
- **Typewriter titles** — `useTypewriter` hook
- **Collapsible sidebar** + **tooltips**
- **Dark theme** UI with gradient accents

### Analytics & ops

- **Business Insights dashboard** — usage charts (Recharts), provider stats
- **Anonymous session tracking** — no user accounts
- **Soft IP rate limits** on chat / events / Sentry tunnel
- **Optional Sentry** with same-origin tunnel `POST /api/monitoring` (ad-blocker friendly)
- **Security headers + robots.txt** via `vercel.json` / `public/robots.txt`

---

## How the App Works (Beginner Walkthrough)

Think of three layers:

```text
Browser (React + Vite)
   │  POST /api/chat  { message, provider? }
   ▼
Vercel Function (api/chat.ts)
   │  reads server env keys → shared/ai/orchestrate.ts
   ▼
Upstream AI APIs (Groq / Gemini / OpenRouter / HF / OpenAI)
```

1. **`App.tsx`** is a tiny **view state machine**: `"start"` | `"chat"` | `"insights"` (no React Router).
2. **`ChatBotStart`** is the landing screen; “Get Started” switches to chat.
3. **`ChatBotApp`** manages messages, sidebar chats, provider selection, and calls `aiService.getChatResponse()`.
4. **`aiService.ts`** only talks to **`/api/chat`** — it never holds API keys.
5. **`shared/ai/orchestrate.ts`** tries providers/models, returns `{ content, provider, success }`.
6. Analytics POSTs go to **`/api/events`**; the Insights UI reads **`/api/dashboard`** (and related routes).

**Local tip:** Plain `npm run dev` (Vite alone) does **not** serve `/api/*`. Prefer **`vercel dev`** so chat and analytics work like production.

---

## Technologies & Libraries

| Technology | Version (approx.) | What it is / why we use it |
|------------|-------------------|----------------------------|
| **React** | 18.3 | UI components and hooks |
| **TypeScript** | 5.9 | Static types — fewer runtime surprises |
| **Vite** | 7.3 | Fast dev server + production bundler for SPAs |
| **Node.js** | 24.x | Runtime pinned in `package.json` `engines` + `.nvmrc` |
| **Prisma** | 6.19 | Type-safe ORM for PostgreSQL analytics |
| **PostgreSQL (Neon)** | — | Serverless DB for Insights |
| **Zod** | 4.x | Runtime validation of API request bodies |
| **Vercel Functions** | `api/*.ts` | Backend without a separate Express server |
| **Recharts** | 2.x | Charts on the Insights dashboard |
| **Lucide React** | — | Icons |
| **Emoji Mart** | — | Emoji picker |
| **uuid** | 11 | Chat / session IDs |
| **Sentry** | optional | Error monitoring + tunnel |
| **ESLint 9** | flat config | `npm run lint` |

**Example — thin client chat call:**

```typescript
// src/services/aiService.ts (concept)
const response = await fetch("/api/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ message, provider }),
});
```

**Example — reusable typewriter hook:**

```typescript
const { displayText } = useTypewriter({
  text: "Welcome to AI Chat Hub",
  speed: 50,
  delay: 300,
});
```

---

## Project Structure

```text
multi-ai-chatbot/
├── api/                         # Vercel serverless functions (backend)
│   ├── _lib/
│   │   ├── prisma.ts            # Prisma client singleton
│   │   └── rateLimit.ts         # Soft in-memory IP rate limit
│   ├── chat.ts                  # POST /api/chat — AI proxy
│   ├── chat-providers.ts        # GET /api/chat-providers — availability
│   ├── events.ts                # POST /api/events — analytics write
│   ├── usage.ts                 # GET /api/usage
│   ├── insights.ts              # GET /api/insights
│   ├── providers.ts             # GET /api/providers
│   ├── dashboard.ts             # GET /api/dashboard
│   └── monitoring.ts            # POST /api/monitoring — Sentry tunnel
├── shared/
│   ├── ai/                      # Types, registry, callers, orchestrate, Zod
│   └── sentry/                  # Env helpers, filters, server capture
├── prisma/
│   └── schema.prisma            # Event, Session, ProviderStats
├── public/
│   ├── ai.svg
│   ├── chatbot.svg
│   ├── favicon.ico
│   └── robots.txt
├── src/
│   ├── App.tsx                  # start | chat | insights
│   ├── main.tsx                 # React root + Sentry ErrorBoundary
│   ├── sentry.ts                # Client Sentry.init (tunnel)
│   ├── Components/              # UI + CSS
│   ├── hooks/useTypewriter.ts
│   └── services/                # Thin client wrappers
├── docs/                        # Portable guides (LLM, Sentry, Vercel, Agile V)
├── .env.example                 # Env template (copy → .env)
├── vercel.json                  # Security + cache headers
├── vite.config.ts
├── eslint.config.js
├── package.json
├── SECURITY.md
└── README.md
```

---

## Installation

### Prerequisites

- **Node.js 24.x** (see `.nvmrc`)
- **npm** (comes with Node)
- Optional: **Vercel CLI** (`npm i -g vercel`) for `vercel dev`
- Optional: free accounts for AI providers + Neon (Insights) + Sentry

```bash
# Clone
git clone https://github.com/arnobt78/OpenAI-ChatBot--ReactVite.git
cd OpenAI-ChatBot--ReactVite

# Use Node 24 if you use nvm
nvm use

# Install dependencies
npm install

# Copy env template
cp .env.example .env
# Then edit .env — see next section
```

---

## Environment Variables (`.env`)

Copy [`.env.example`](./.env.example) to `.env`. **Never commit `.env`** (it is gitignored).

### Do you need a `.env` to run anything?

| Goal | Need `.env`? |
|------|----------------|
| UI only (`npm run dev`) — landing / layout | **No** — app boots without keys |
| Real AI chat locally | **Yes** — at least one AI key + use `vercel dev` |
| Business Insights charts | **Yes** — `DATABASE_URL` + Prisma push |
| Sentry errors | **Optional** — leave DSN empty to disable |

You can start with an empty `.env` for UI exploration; add keys as you enable features.

### Required for chat (server-only — **no `VITE_` prefix**)

| Variable | Purpose | Where to get it |
|----------|---------|-----------------|
| `GEMINI_API_KEY` | Google Gemini | [Google AI Studio](https://aistudio.google.com/apikey) |
| `GROQ_API_KEY` | Groq | [Groq Console](https://console.groq.com/) |
| `OPENROUTER_API_KEY` | OpenRouter free models | [OpenRouter Keys](https://openrouter.ai/keys) |
| `HUGGINGFACE_API_KEY` | HF Inference Providers | [HF Tokens](https://huggingface.co/settings/tokens) — allow Inference Providers |
| `OPENAI_API_KEY` | OpenAI (paid last resort) | [OpenAI API Keys](https://platform.openai.com/api-keys) |

You need **at least one** of the above for chat. More keys = better fallback coverage.

```env
GEMINI_API_KEY=
GROQ_API_KEY=
OPENROUTER_API_KEY=
HUGGINGFACE_API_KEY=
OPENAI_API_KEY=
APP_URL=https://multi-ai-chat-hub.vercel.app
```

> **Security lesson:** Never put AI secrets in `VITE_*` variables. Vite embeds `VITE_*` into the public JS bundle — anyone could steal them.

### Required for Business Insights

| Variable | Purpose | Where to get it |
|----------|---------|-----------------|
| `DATABASE_URL` | PostgreSQL connection string | [Neon Console](https://console.neon.tech/) → project → connection string |

```bash
npx prisma generate
npx prisma db push
```

### Optional — Sentry (Vite names)

| Variable | Purpose | Where to get it |
|----------|---------|-----------------|
| `VITE_SENTRY_DSN` | Client SDK (build-time) | Sentry → Project → Client Keys (DSN) |
| `SENTRY_DSN` | Server + tunnel allowlist | Same DSN (optional) |
| `SENTRY_ORG` | Source map upload | Organization **slug** |
| `SENTRY_PROJECT` | Source map upload | Project **slug** (not org name) |
| `SENTRY_AUTH_TOKEN` | CI upload | Auth Tokens (`project:releases`, `org:read`) |

Use **`VITE_SENTRY_DSN`**, not `NEXT_PUBLIC_SENTRY_DSN` (that is Next.js-only). On Vercel, set `VITE_SENTRY_DSN` for Production **build**.

Full comments live in [`.env.example`](./.env.example). Deeper Sentry steps: [docs/Redis_Sentry_PostHog_INTEGRATION_GUIDE.md](./docs/Redis_Sentry_PostHog_INTEGRATION_GUIDE.md) (§2B Vite).

---

## How to Run

### Option A — UI only (no API)

```bash
npm run dev
```

Opens the Vite app. Chat/API calls will fail until serverless routes are available.

### Option B — Full local stack (recommended)

```bash
# Terminal: serves Vite + /api/* together
vercel dev
```

Then open the URL Vercel prints (often `http://localhost:3000`).

### Lint & production build

```bash
npm run lint
npm run build
npm run preview   # preview the dist/ folder only (still no /api unless proxied)
```

---

## Usage Guide

1. Open the app → **Start** screen with typewriter title.
2. Click **Get Started** → chat view.
3. Type a message (optional emoji) → send.
4. Pick a provider from the dropdown, or leave auto/fallback behavior.
5. Create / switch / delete chats in the sidebar (persisted in `localStorage`).
6. Open **Business Insights** for anonymous analytics (needs `DATABASE_URL`).

---

## Frontend Components & Hooks

| File | Role | Reuse tip |
|------|------|-----------|
| `ChatBotStart.tsx` | Welcome / CTA | Drop into any landing; wire `onStart` |
| `ChatBotApp.tsx` | Main chat shell | Expects chat list props or lift state like `App.tsx` |
| `BusinessInsights.tsx` | Analytics dashboard | Point `fetch` URLs at your `/api/dashboard` |
| `TypingIndicator.tsx` | Animated “AI is typing” | Pure UI — no API |
| `Tooltip.tsx` | Hover help | Wrap any trigger element |
| `useTypewriter.ts` | Character-by-character text | Any headline / onboarding copy |

Each component has a matching `.css` file — keep them together when copying.

**View switching (`App.tsx` concept):**

```tsx
const [currentView, setCurrentView] = useState<"start" | "chat" | "insights">("start");
// render ChatBotStart | ChatBotApp | BusinessInsights
```

---

## Shared AI Layer

Located in `shared/ai/` so **browser types** and **server orchestration** share one contract.

| Module | Purpose |
|--------|---------|
| `types.ts` | `AIProvider`, `ChatRequest`, `ChatResponse`, `ProviderMeta` |
| `providers.ts` | `PROVIDER_META` model chains + `FALLBACK_ORDER` |
| `callers.ts` | HTTP calls to each upstream API |
| `orchestrate.ts` | Outer provider loop + inner model loop + 429 skip |
| `schemas.ts` | Zod schemas for request validation |

**Current free-tier model chains** (see `shared/ai/providers.ts`):

1. **Groq** — `openai/gpt-oss-20b` → `openai/gpt-oss-120b` → `qwen/qwen3.6-27b`
2. **Gemini** — `gemini-2.5-flash` → `gemini-2.5-flash-lite`
3. **OpenRouter** — `openai/gpt-oss-20b:free` → `openai/gpt-oss-120b:free`
4. **Hugging Face** — Hub chat IDs + `:fastest` (gemma / Qwen2.5 / gpt-oss / Llama-3.2); free credits tiny — may fail when forced
5. **OpenAI** — `gpt-4o-mini` (last resort)

Portable free-tier reference: [docs/LLM_MODEL_SELECTION.md](./docs/LLM_MODEL_SELECTION.md).

---

## Backend API Endpoints

All handlers live in `api/` and use `@vercel/node` request/response shapes.

| Method | Path | Purpose |
|--------|------|---------|
| `POST` | `/api/chat` | Chat proxy (Zod + rate limit + orchestrate) |
| `GET` | `/api/chat-providers` | Which providers have keys configured |
| `POST` | `/api/events` | Write anonymous analytics events |
| `GET` | `/api/usage` | Usage aggregates |
| `GET` | `/api/insights` | Provider insight data |
| `GET` | `/api/providers` | Provider detail stats |
| `GET` | `/api/dashboard` | Combined dashboard payload |
| `POST` | `/api/monitoring` | Sentry envelope tunnel (ad-blocker bypass) |

**Example chat body:**

```json
{ "message": "Explain React hooks in one paragraph", "provider": "groq" }
```

Omit `provider` (or use auto) to walk the fallback order.

There is **no React Router** — “routes” are view states in `App.tsx`, plus these HTTP APIs.

---

## Database (Prisma + PostgreSQL)

Schema: `prisma/schema.prisma`

- **`Session`** — anonymous browser session
- **`Event`** — `api_call`, `chat_created`, `provider_selected`, etc.
- **`ProviderStats`** — aggregated provider metrics

Chats themselves are **not** stored in Postgres by default — only analytics. Chat threads use **`localStorage`**.

---

## Sentry (Optional Observability)

- Client: `src/sentry.ts` → `tunnel: "/api/monitoring"`
- Server: `captureApiException` in `api/chat.ts` / `api/events.ts`
- Quiet builds: `@sentry/vite-plugin` with `silent: true` when org/project/token are set

Disabled automatically when DSN is empty.

---

## Reusing Code in Other Projects

1. **Copy `shared/ai/`** into another Node/Vite/Next backend and call `orchestrateChat` from your route.
2. **Copy `useTypewriter` + `TypingIndicator` / `Tooltip`** as standalone UI pieces.
3. **Copy `api/_lib/rateLimit.ts`** for soft serverless rate limiting.
4. **Copy Sentry §2B** from the integration guide for another Vite app.
5. Keep **AI keys server-side**; expose only a thin `/api/chat`-style proxy.

When teaching others: stress the **registry (`providers.ts`) + callers + orchestrator** pattern so model deprecations become a one-line registry edit.

---

## Deployment (Vercel)

1. Import the GitHub repo into [Vercel](https://vercel.com/).
2. Set env vars (same names as `.env.example`) — especially **non-`VITE_` AI keys** and `DATABASE_URL`.
3. For Sentry client events, set **`VITE_SENTRY_DSN`** on Production (build-time).
4. Deploy. Live demo pattern: [https://multi-ai-chat-hub.vercel.app/](https://multi-ai-chat-hub.vercel.app/)
5. Dashboard Human-Action (recommended): Bot Protection = Challenge, AI Bots = Deny.

Production guardrails playbook: [docs/VERCEL_PRODUCTION_GUARDRAILS.md](./docs/VERCEL_PRODUCTION_GUARDRAILS.md).

---

## Scripts Reference

| Script | Command | Purpose |
|--------|---------|---------|
| Dev (UI) | `npm run dev` | Vite only |
| Lint | `npm run lint` | ESLint (max warnings = 0) |
| Build | `npm run build` | `prisma generate` + `tsc` + `vite build` |
| Preview | `npm run preview` | Serve `dist/` |
| Prisma | `npm run prisma:generate` / `prisma:push` / `prisma:studio` | DB tooling |

---

## Further Reading

- [docs/LLM_MODEL_SELECTION.md](./docs/LLM_MODEL_SELECTION.md) — free-tier models & fallback strategy
- [docs/Redis_Sentry_PostHog_INTEGRATION_GUIDE.md](./docs/Redis_Sentry_PostHog_INTEGRATION_GUIDE.md) — Next **and** Vite Sentry
- [docs/VERCEL_PRODUCTION_GUARDRAILS.md](./docs/VERCEL_PRODUCTION_GUARDRAILS.md) — headers, AI proxy, Node 24
- [docs/AGILE_V_PROTOCOL.md](./docs/AGILE_V_PROTOCOL.md) — agent workflow used on this repo
- [SECURITY.md](./SECURITY.md) — private vulnerability reporting

---

## Conclusion

This project is a practical classroom for **multi-provider AI apps on Vite + Vercel**: keep secrets on the server, validate with Zod, fall back across models, store chat locally, and optionally measure usage with Prisma. Clone it, add one free API key, run `vercel dev`, and you will see the full loop from UI → `/api/chat` → upstream model → response.

Extend it by adding providers to `shared/ai/providers.ts`, reusing UI components, or plugging the shared orchestrator into another backend.

---

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT). Feel free to use, modify, and distribute the code as per the terms of the license.

---

## Happy Coding! 🎉

This is an **open-source project** - feel free to use, enhance, and extend this project further!

If you have any questions or want to share your work, reach out via GitHub or my portfolio at [https://www.arnobmahmud.com/](https://www.arnobmahmud.com/).
