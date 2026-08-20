# CHANGELOG.md — Agile V project memory

## 2026-08-20 — Delete UX polish
- Confirm icons + Deleting… spinner + AppToast (DEC-0012); VAL-0013 PASS

## 2026-08-20 — Delete confirm + Coolify docs
- ConfirmDialog with dynamic chat `displayId` (DEC-0011); VAL-0012 PASS
- Docs: Insights DB = Coolify VPS Postgres (not Neon)

## 2026-08-20 — Lucide Select AI Model icons
- `providerIcons.ts` + PROVIDER_META lucide keys (DEC-0010); VAL-0011 PASS

## 2026-08-20 — Chat UX microfixes
- Thinking pulse + dots until first delta; no stream caret (DEC-0009)
- Provider icon/label centered; send ripple; VAL-0010 PASS

## 2026-08-20 — SSE stream + chat UI polish
- Live `/api/chat` SSE (`stream:true`); client delta append (DEC-0008)
- Bubble row 85%; chat-list ✕ muted/centered
- VAL-0009 PASS; densify/Redis/SSR/auth N/A

## 2026-08-20 — HF `:fastest` + agent doc sync
- `providers.ts`: Hub chat IDs + `:fastest` (DEC-0007)
- Docs: CLAUDE · walkthrough · STATE · VAL-0008 · checkpoint
- Validated: lint/build/audit 0; keys still server-only

## 2026-08-20 — C1 bootstrap
- Created `.agile-v/` workspace (did not previously exist)
- Documented baseline REQs 0001–0008 from code
- Proposed hardening REQs 0009–0015; deferred 0016–0017
- Opened Human Gate 1 (PENDING)
- Synced `CLAUDE.md` stack/status from repository truth
- No application source changes
