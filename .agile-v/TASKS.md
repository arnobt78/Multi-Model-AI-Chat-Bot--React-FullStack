# TASKS.md — Prioritized C1 Plan

Gate: Human Gate 1 — **APPROVED** (Track A+B); Track C completed post-gate  
Rule: Implement only tasks marked APPROVED after gate.

Priority bands: **P0** must · **P1** should · **P2** nice · **P3** later

---

## Recommended Track Order (for approval)

### Track A — Security (P0)

| ID | Task | REQs | Depends |
|----|------|------|---------|
| TASK-0001 | Design server-side `/api/chat` (or per-provider proxy) so AI keys stay server-only; keep typed client contract | REQ-0009 | — |
| TASK-0002 | Migrate `aiService` client to call proxy; remove secret `VITE_*` provider keys from production client bundle; update env docs | REQ-0009 | TASK-0001 |
| TASK-0003 | Harden `api/*`: validate payloads, rate-limit event writes, protect insights reads (admin secret or equivalent) | REQ-0010 | — (can parallel with A after design) |

### Track B — Production cost / crawl (P1)

| ID | Task | REQs | Depends |
|----|------|------|---------|
| TASK-0004 | Add Vite-adapted `vercel.json` headers + `public/robots.txt`; checklist for Vercel Bot Protection (dashboard Human-Action) | REQ-0011 | — |

### Track C — Provider hygiene (P1) — DONE

| ID | Task | REQs | Depends | Status |
|----|------|------|---------|--------|
| TASK-0005 | Audit & update model IDs / fallback order against current free-tier docs; reduce duplication between registry and service | REQ-0012 | Prefer after TASK-0001 if proxy lands | DONE |

### Track D — Quality & truth (P1–P2)

| ID | Task | REQs | Depends |
|----|------|------|---------|
| TASK-0006 | Add Vitest (or equivalent) + CI-friendly scripts; smoke-test fallback skip / API validation | REQ-0013 | After first behavior change |
| TASK-0007 | Doc truth: SECURITY.md or fix README link; `.env.example`; clarify CSR + which docs are portable — **DONE** | REQ-0014 | — |
| TASK-0008 | Decide Sentry: integrate (Vite-adapted) or explicitly defer and document unused env — **DONE** (Vite + `/api/monitoring` tunnel) | REQ-0015 | — |

### Explicitly out of C1 unless approved

| ID | Task | REQs |
|----|------|------|
| TASK-0009 | Server-persisted chat history + sync | REQ-0016 |
| TASK-0010 | End-user authentication | REQ-0017 |
| TASK-0011 | Redis / PostHog integration | REQ-0015-adjacent |

---

## Suggested approval options

Reply with one of:

1. **Approve Track A+B+C+D (full C1 hardening)** — implement in wave order A → B/C parallel → D  
2. **Approve Track A only (security)** — proxy + API harden first  
3. **Approve Track B+D docs/guardrails only** — no proxy migration yet  
4. **Custom** — list TASK-IDs to approve / defer  

After approval, Stage 3 starts with the first approved TASK only.
