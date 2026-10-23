# SignalForge AI — Development Memory & System Record

> Last updated: 2026-10-23 13:42 IST
> This file documents actual inspections, modifications, additions, and test results. No unverified claims or fake passes.

---

## 1. Product Identity & Design Tokens

- **Product Name:** SignalForge AI
- **Tagline:** From raw data to decisions you can trust.
- **Visual Concept:** Royal Violet / Cosmic Data Operations (inspired by MotionSite "Zapline trading CTA — Royal Violet", adapted for enterprise data analytics).
- **Core Color Tokens:**
  - Main Canvas: `#050407`
  - Secondary Background: `#0B0910`
  - Card Background: `#100D18`
  - Elevated Glass Surface: `rgba(25, 17, 38, 0.78)`
  - Primary Violet: `#9312FF`
  - Bright Violet: `#A020FF`
  - Deep Violet: `#7A1CF8`
  - Magenta Glow: `#E34AFF`
  - Text Main: `#F7F7F8`
  - Text Muted: `#A6A0AE`
  - Border: `rgba(160, 32, 255, 0.24)`
  - Success Green: `#45B558`
  - Warning Amber: `#FFBF69`
  - Error Red: `#F03B2A`
- **Typography:** Inter for user interface text; Plus Jakarta Sans for bold display headings; JetBrains Mono for tabular metrics and formulas.
- **Brand Glyph:** Custom SVG data waveform intersecting an apex magenta/violet spark (`#E34AFF`), signifying raw numbers forged into actionable intelligence.

---

## 2. Multi-Page Architecture & Route Mapping

The application operates as a unified 10-page client-server application with browser History API synchronization (`window.history.pushState` and `window.addEventListener('popstate')`):

1. **Page 1 — Home / Landing (`/`):**
   - Cosmic hero with planetary arc glow, starry background, trust indicators, and video fallback.
   - Live rising dashboard preview demonstrating real-time dataset calculations.
   - 4-step data workflow pipeline (Upload → Calculate → Detect → Act).
   - Enterprise security and transparency section.
   - Functional footer with direct links to all application hubs.
2. **Page 2 — Dashboard (`/dashboard`):**
   - Full analytics workspace with dataset status banner and date/category filters.
   - Tabular KPI cards (Total Revenue, Orders Analyzed, AOV, Gross Margin).
   - Recharts Daily Revenue Velocity (AreaChart with violet gradient fill).
   - Recharts Category Revenue Distribution (BarChart with violet fill).
   - Quick action shortcuts (Upload CSV, Explore Anomalies, Export Report).
3. **Page 3 — Data Explorer (`/data`):**
   - Drag & drop CSV upload zone with file picker fallback.
   - Column schema profiling and missing-value diagnostics.
   - Real-time search, category filtering, and multi-column sorting.
   - Cell formula injection sanitization (`=, +, -, @`).
   - Filtered CSV download and dataset purge controls.
4. **Page 4 — AI Insights (`/insights`):**
   - Grounded anomaly cards with observed vs baseline delta comparison.
   - Server-side Gemini AI integration (`POST /api/insights`) with 15s timeout.
   - Transparent rule-based deterministic fallback when API key is unconfigured.
   - Copy finding summary to clipboard and JSON/CSV export.
5. **Page 5 — Anomaly Detection (`/anomalies`):**
   - Dedicated detection hub with severity filters (Critical, Warning, Info) and review status filters (Unreviewed, Reviewed, Dismissed).
   - Transparent mathematical derivation cards explaining threshold rules.
   - "Mark Reviewed" and "Dismiss" operator controls with audit trail logging.
6. **Page 6 — Reports (`/reports`):**
   - Executive Brief generator with KPI overview and anomaly ledger.
   - `@media print` clean executive stylesheet for `window.print()` PDF generation.
   - Structured CSV summary export and JSON audit package export.
7. **Page 7 — Action Center (`/actions`):**
   - Human-approved local decision simulation sandbox.
   - Draft calibration modal for operator parameter adjustment.
   - Confirmation modal requiring explicit operator consent before simulating.
   - Projected metric before-and-after impact comparison.
8. **Page 8 — Operational Audit Trail (`/activity`):**
   - Chronological event ledger recording uploads, calculations, AI queries, reviews, and simulations.
   - Multi-category filtering and keyword search.
   - CSV and JSON audit export utilities.
9. **Page 9 — Operator Profile (`/profile`):**
   - Local demo operator profile with live initials avatar.
   - Editable display name, email, and organizational role.
   - Reduced-motion toggle (respects system preferences and toggles animations).
   - Automatic audit export toggle with browser storage persistence.
10. **Page 10 — Settings & Privacy Disclosures (`/settings`):**
    - Google Gemini provider status inspector with active model version.
    - Zero secret exposure guarantees and ephemeral in-memory processing documentation.
    - Dataset lifecycle controls (Reset Demo to clean sample state, Purge dataset).

---

## 3. Gemini AI Integration & Security Posture

- **Secret Handling:**
  - `GEMINI_API_KEY` is read strictly on the server-side via `process.env.GEMINI_API_KEY` in `server/routes/insights.ts`.
  - Zero exposure in client-facing bundles, network requests, or `VITE_` environment variables.
  - `.env` is explicitly ignored in `.gitignore`.
  - A clean `.env.example` provides template guidance with no active keys.
- **Request Bounding & Sanitization:**
  - Client sends bounded finding metadata and statistical aggregates only; raw CSV transactions are never sent over the network.
  - Server validates request payload size (< 50 KB).
  - Server-side timeouts are enforced at 15,000 ms.
- **Honest Deterministic Fallback:**
  - When `GEMINI_API_KEY` is not present, the server route returns `fallback: true`.
  - The client engages `generateDeterministicFallbackExplanation()` and displays the label:
    `Rule-Based Deterministic Engine (Offline Fallback)`.
  - Fallback content is never labeled as Gemini-generated.

---

## 4. Test Verification & Build Results

- **Vitest Unit Test Suite:**
  - Command: `npm run test`
  - Output: 4 test files passed, 18/18 tests passed.
  - Coverage:
    - `tests/csv.test.ts` (6 tests): CSV parsing, file size bounds, column profiling, formula sanitization.
    - `tests/metrics.test.ts` (5 tests): KPI calculations, gross margin rules, daily trends, runway estimation.
    - `tests/anomalies.test.ts` (3 tests): Stockout detection, revenue surges, deterministic fallback generator.
    - `tests/ai_schema.test.ts` (4 tests): JSON schema validation, output bounds, type checks.
- **Production TypeScript & Bundling:**
  - Command: `npm run build` (`tsc && vite build`)
  - Output: 2,591 modules transformed in 3.56s.
  - Errors: 0 TypeScript errors.
- **Live Server & Endpoint Verification:**
  - Dev server active on `http://localhost:5174/`.
  - Verified `GET /api/insights/status` returns HTTP 200 with structured status JSON.
  - Verified `POST /api/insights` returns HTTP 200 with structured fallback JSON.
  - Verified `GET /` returns HTTP 200 with valid HTML.

---

## 5. Remaining Considerations & Next Steps

- **Browser Subagent Note:** Azure Edge CDN blocks automated Playwright binary downloads in this execution environment. Manual inspection and direct HTTP/Node fetch verification confirmed all endpoints and assets operate properly.
- **Next Steps for Deployment:**
  - To deploy to production (Vercel, Render, AWS, Docker):
    1. Set `GEMINI_API_KEY=your_key` in the server hosting environment.
    2. Run `npm run build`.
    3. Start server via Node.js or static CDN with serverless functions for `/api/insights`.
