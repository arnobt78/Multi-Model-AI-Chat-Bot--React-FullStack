# PLAYBOOK.md — Resume this repo

1. Read `docs/AGILE_V_PROTOCOL.md`
2. Read `CLAUDE.md` then `.agile-v/STATE.md`
3. If `CHECKPOINTS.md` has PENDING, stop for HITL unless `APPROVALS.md` has matching `resume_token`
4. Code is source of truth over portable docs in `docs/`
5. This app is **Vite CSR + Vercel serverless**, not Next.js App Router — do not apply Next-only patterns without an approved architecture change
6. Never commit or paste `.env` secrets
7. After approval: implement one TASK at a time; validate; update STATE + VALIDATION_SUMMARY
