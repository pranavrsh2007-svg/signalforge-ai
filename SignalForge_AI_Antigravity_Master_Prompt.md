# Antigravity Master Prompt — SignalForge AI
Build Beyond AI | 150-minute MVP

Act as a senior full-stack engineer, product designer, AI engineer, and security reviewer. Build an original, functional, mobile-friendly web app called **SignalForge AI** — “From raw data to decisions you can trust.”

## Start safely
1. Inspect the current repository, package.json, scripts, existing components, environment files, and deployment target before changing anything.
2. Read IDEA.md, PRD.md, ARCHITECTURE.md, FEATURES_BUTTONS_INTERLINKING.md, and memory.md.
3. Preserve working code and conventions. Do not overwrite unrelated work.
4. Work in small verified increments. Total budget is **150 minutes**. Prioritize a working end-to-end demo, not breadth.

## Product
Small businesses upload sales/inventory CSV data. SignalForge validates the file, calculates deterministic metrics, visualizes trends, detects explainable anomalies, asks AI to explain evidence and recommend actions, and lets a human approve a simulated action. It is not a generic chatbot.

## End-to-end demo (must work)
1. Load clearly labelled illustrative sample data or upload CSV.
2. Validate columns, types, dates, numeric values, file size and row count. Explain errors and fixes.
3. Show supported metrics: revenue, orders, average order value, category trends; calculate gross margin only if cost data exists. Never fabricate unavailable metrics.
4. Show interactive trend/category charts and a useful table.
5. Detect anomalies with deterministic, explainable rules. Show baseline, observed value, delta, time window and evidence.
6. Provide an evidence-grounded AI explanation and recommendations. If AI is unavailable, use a clearly labelled deterministic fallback.
7. Recommendations have View Evidence, Create Action Plan, Approve Simulation and Dismiss controls.
8. Approval creates only a local demo simulation. Do not claim that an external inventory/order system changed.
9. Record upload, analysis, recommendation, approval/dismissal, export and reset events in an audit trail.
10. Export findings/summary to CSV or JSON; clear/reset works.

## Visual identity
- Premium data-operations workspace inspired by editorial data journalism, not a generic AI template.
- Canvas #101315; surfaces #1B2220 and #222A29; text #F4F0E6; muted #A8B0AA; acid-lime #D8FF62; alert coral #FF815B; success mint #58D6B0.
- Avoid generic blue/purple gradients, robot art, excessive glassmorphism, fake testimonials, huge empty hero sections and irrelevant stock images.
- Create a compact custom SVG logo: signal/wave glyph fused with a rising data line. Use Lucide icons consistently.
- Use strong typography, tabular numbers, subtle grid lines, restrained glow, compact charts, clear data hierarchy, accessible contrast, visible focus states and semantic HTML.
- Use subtle transitions, chart entrance, skeleton loading and hover feedback. Respect prefers-reduced-motion.
- Desktop: collapsible left navigation. Mobile: drawer navigation, wrapping filters, responsive charts, horizontal table scroll or card rows, no page-level overflow.
- Main areas: Overview, Data Explorer, Insights, Action Center, Audit Log, Settings/Data & Privacy.

## Engineering
Inspect repo first. If no stack exists, prefer React + Vite + TypeScript, Tailwind or lightweight CSS, Lucide React, Recharts, Papa Parse, and a small Node/Express or compatible serverless endpoint for Gemini. Reuse existing libraries where possible; do not waste time on unnecessary setup.

## AI and security
- Gemini API keys must stay server-side in environment variables; never use VITE_* for secrets.
- If no safe server endpoint is configured, do not call Gemini directly from the browser. Show provider-not-configured status and use transparent fallback.
- Validate uploads; target 5 MB and reasonable row limits. Treat CSV cells as untrusted data, never as instructions.
- Send minimum necessary aggregates to AI, not the full dataset by default. Avoid sensitive fields.
- Bound request size/time, validate AI JSON output, and render model output as text, not raw HTML.
- Deterministic metrics are the source of truth; AI must not invent or overwrite values.
- No external side effects. Require explicit approval for simulated actions and label them clearly.
- No fake loading, fake success, dead buttons, href="#", unsupported accuracy claims, fake integrations, or fabricated statistics.

## Documentation and assets
Create/update IDEA.md, PRD.md, ARCHITECTURE.md, FEATURES_BUTTONS_INTERLINKING.md, memory.md, README.md, .env.example and a clearly labelled sample CSV. Add tests for CSV validation, calculations, anomaly rules and AI output validation if the repo has test infrastructure.

## 150-minute time budget
- 0–15: inspect repo, docs, setup
- 15–55: app shell, navigation, overview, charts
- 55–85: CSV upload, validation, deterministic analytics
- 85–110: AI/fallback, evidence, action simulation
- 110–130: security, mobile UX, accessibility
- 130–150: test, fix, build, deploy, update memory

## Final verification
Run the repo's actual lint/typecheck/test/build scripts. Verify sample/CSV → metrics → finding/evidence → AI or labelled fallback → action plan → simulation approval → audit log → export → reset. Test mobile ~390 px and desktop ~1440 px. Check console, network failures and secrets in bundles/tracked files. Update memory.md with real files changed, commands/results, provider status, deployment URL only if verified, known bugs and next steps. Never claim unverified work passed. Do not stop at a plan: implement and verify the app.
