# ARCHITECTURE.md — SignalForge AI

## 1. Architectural Principles
- **Deterministic Metrics as Source of Truth**: Revenue, orders, AOV, and margins are calculated using reproducible TypeScript algorithms. The AI model is never allowed to invent or alter deterministic calculations.
- **Evidence-Grounded AI Explanations**: Only high-level statistical findings and row-level evidence keys are dispatched to the backend AI model. Raw CSV datasets and customer records are never transmitted.
- **Zero Client Secret Exposure**: `GEMINI_API_KEY` is isolated to the Node.js server route (`server/routes/insights.ts`). No secrets are bundled in the frontend or exposed in `VITE_` variables.
- **Human-in-the-Loop Simulation**: Operational decisions require explicit human confirmation and operate strictly within a local sandboxed simulation (no external ERP or bank APIs are mutated).
- **Graceful Deterministic Fallback**: If Gemini is unconfigured or offline, the platform automatically engages a rule-based deterministic engine and clearly labels the output.

---

## 2. Logical Architecture

```text
React 18 Client Application (Royal Violet Theme & History API Routing)
 ├─ Pages: Home (/) | Dashboard (/dashboard) | Data (/data) | Insights (/insights)
 │         Anomalies (/anomalies) | Reports (/reports) | Actions (/actions)
 │         Activity (/activity) | Profile (/profile) | Settings (/settings)
 ├─ CSV Parser & Ingest Guard (5 MB / 10,000 row limits, Formula Sanitization)
 ├─ Deterministic Analytics Engine (KPIs, Daily Trends, Category Distribution)
 ├─ Explainable Anomaly Detection Rules (Runway, Velocity Surges, Drops, Margins)
 ├─ AI Client Adapter (POST /api/insights with 15s timeout & fallback)
 ├─ Local Action Sandbox & Calibration Modals
 ├─ Chronological Audit Log (Session & LocalStorage)
 └─ Report Generator (window.print() PDF stylesheet, CSV & JSON exporters)
       │
       ▼ (Bounded finding payload < 50 KB)
Vite Server Middleware (server/routes/insights.ts)
 ├─ GET /api/insights/status -> Checks GEMINI_API_KEY presence
 └─ POST /api/insights -> Invokes Google Gemini 2.5 Flash via Server Secret
```

---

## 3. Directory & Module Structure

- `src/types/index.ts`: Shared domain interfaces (`NavigationTab`, `AnomalyFinding`, `ActionPlan`, `UserProfile`, `GeneratedReport`).
- `src/styles/index.css`: Royal Violet tokens (`#050407`, `#A020FF`, `#E34AFF`), glass cards, procedural stars, `@media print` rules.
- `src/lib/csv/parseCsv.ts`: Ingestion bounds, schema checking, formula injection sanitization.
- `src/lib/analytics/metrics.ts`: Deterministic KPI calculations, daily velocity series, category aggregates.
- `src/lib/analytics/anomalies.ts`: Statistical heuristic detector & offline deterministic explanation generator.
- `src/lib/ai/schema.ts`: JSON schema sanitizer validating structured AI responses.
- `src/lib/ai/client.ts`: Frontend AI adapter with abort timeouts and fallback detection.
- `server/routes/insights.ts`: Secure server-side route handling Gemini SDK calls.
- `src/lib/actions/simulateAction.ts`: Human-in-the-loop sandbox decision simulator.
- `src/lib/audit/auditLog.ts`: Session and local persistent audit logger.
- `src/components/`: Modular React components across all 10 pages and shared UI primitives.
- `tests/`: Vitest test suites (18 unit tests covering analytics, CSV sanitization, anomaly math, schema safety).

---

## 4. Security & Safety Architecture

1. **Formula Injection Neutralization**: Any cell beginning with `=`, `+`, `-`, or `@` is prepended with `'` during parsing to safeguard Excel and CSV consumers.
2. **Untrusted Data Boundaries**: Model outputs are validated against a strict schema and rendered as structured React components or text, never as executable HTML or script tags.
3. **Audit Immutability**: All key actions (dataset uploads, anomaly reviews, AI queries, simulation approvals) append timestamped records with actor metadata.
