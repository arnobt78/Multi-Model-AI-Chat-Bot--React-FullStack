# RISKS.md — Cycle C1

| ID | Severity | Status | Description | Linked REQs | Mitigation (proposed) |
|----|----------|--------|-------------|-------------|------------------------|
| RISK-0001 | **Critical** | Mitigated | AI keys were in `VITE_*` browser bundle; now server-only via `/api/chat` | REQ-0009 | Server proxy (done) |
| RISK-0002 | **High** | Open | Unauthenticated analytics write/read APIs → spam DB, inflate Neon/Vercel costs, data pollution | REQ-0010 | Rate limits, payload caps, protect dashboard reads |
| RISK-0003 | **High** | Open | Public deploy without robots/cache/security headers / bot protection → free-tier overage (see guardrails doc incident pattern) | REQ-0011 | Vite-adapted guardrails + dashboard Bot Protection |
| RISK-0004 | **Medium** | Mitigated | Model IDs refreshed to free-tier chains (Groq gpt-oss; OpenRouter `:free`) | REQ-0012 | Registry `models[]` + periodic doc re-verify |
| RISK-0005 | **Medium** | Open | No automated tests → regressions in fallback/rate-limit/analytics go unnoticed | REQ-0013 | Minimal Vitest suite + validation scripts |
| RISK-0006 | **Low** | Mitigated | Vite Sentry + `/api/monitoring` tunnel wired; disabled when DSN empty | REQ-0015 | Keep DSN/tunnel documented in `.env.example` |
| RISK-0007 | **Low** | Open | Chat history only in `localStorage` → lost on clear/device switch; not a security issue but durability gap | REQ-0016 | Deferred unless product requires |
| RISK-0008 | **Medium** | Open | New PrismaClient per serverless invoke in each `api/*.ts` → connection pressure on Neon | REQ-0010 (related) | Shared singleton / `@prisma/client` pattern for serverless |
| RISK-0009 | **Info** | Open | Portable docs (`LLM_MODEL_SELECTION`, Redis/Sentry guide) describe other stacks → agent confusion | REQ-0014 | Mark portable vs binding in STATE/CLAUDE |

No CAPA opened yet (analysis-only cycle stage).
