# Security Policy

## Supported Versions

This repository tracks the latest `main` branch of **Multi-Model AI Chat Hub** (`ai-chat-hub`). Please report issues against the current deployed / default branch.

## Reporting a Vulnerability

Please **do not** open a public GitHub issue for security vulnerabilities.

Report privately to:

- **Email:** [contact@arnobmahmud.com](mailto:contact@arnobmahmud.com)
- **Portfolio / contact:** [https://www.arnobmahmud.com/](https://www.arnobmahmud.com/)

Include as much detail as you can:

- Description of the issue and potential impact
- Steps to reproduce (PoC if available)
- Affected URL / endpoint / commit if known

You should receive an acknowledgement within a few business days. Please give us reasonable time to investigate and fix before any public disclosure.

## Scope Notes

- AI provider API keys must remain **server-side** (never `VITE_*` in production).
- This demo uses **anonymous** analytics and **localStorage** chat history — treat production deployments accordingly.
- Same-origin Sentry tunnel (`/api/monitoring`) is intentional; abuse reports related to open proxying are welcome.

Thank you for helping keep users safe.
