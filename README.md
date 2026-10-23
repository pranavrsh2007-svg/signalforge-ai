# SignalForge AI — “From raw data to decisions you can trust.”

SignalForge AI is an enterprise-grade business intelligence and operational decision support platform. It transforms raw business CSV data into verifiable metrics, visualizes performance trends, detects statistical anomalies, generates evidence-grounded AI explanations with transparent fallbacks, and executes human-approved local simulated actions with an audit trail.

---

## Visual Identity & Design System — Royal Violet / Cosmic Data Operations

- **Palette**:
  - Main Background Canvas: `#050407`
  - Secondary Background: `#0B0910`
  - Card Glass Surface: `#100D18` & `rgba(25, 17, 38, 0.78)`
  - Primary Violet: `#9312FF` | Bright Violet: `#A020FF` | Deep Violet: `#7A1CF8`
  - Magenta Accent Glow: `#E34AFF`
  - Success Green: `#45B558` | Warning Amber: `#FFBF69` | Error Red: `#F03B2A`
- **Typography**: Inter for interface elements; Plus Jakarta Sans for bold display headlines; JetBrains Mono for tabular metrics and formulas.
- **Original Logo**: Custom SVG waveform intersecting an apex violet spark (`#E34AFF`), signifying raw data forged into actionable intelligence.
- **Cosmic Motion**: Subtle procedural stars, luminous planetary arc, smooth glass card elevation, and `@media (prefers-reduced-motion)` accessibility support.

---

## Complete 10-Page Application Architecture

1. **Home / Landing (`/`)**:
   - Cosmic hero with planetary arc, glowing violet gradients, and inline video fallback.
   - Live rising analytics dashboard preview computing real metrics from active data.
   - 4-step interactive data workflow pipeline (Upload → Calculate → Detect → Act).
   - Enterprise security and transparency section.
   - Functional navigation footer.
2. **Dashboard (`/dashboard`)**:
   - Full analytics workspace with dataset status banner and date/category filters.
   - Tabular KPI cards (Total Revenue, Orders Analyzed, AOV, Gross Margin).
   - Recharts Daily Revenue Velocity (AreaChart with violet gradient fill).
   - Recharts Category Revenue Distribution (BarChart with violet fill).
   - Quick action shortcuts (Upload CSV, Explore Anomalies, Export Report).
3. **Data Explorer (`/data`)**:
   - Drag-and-drop CSV upload zone (enforces 5 MB file size limit and up to 10,000 rows).
   - Column schema profiling chips (inferred types, valid count, invalid count).
   - Real-time text search, category filtering, and sorting.
   - Filtered row export to CSV and memory purge control.
4. **AI Insights (`/insights`)**:
   - Statistical anomaly detector flags: Demand Velocity Surges, Stockout Risks, Velocity Contractions, Margin Leakage.
   - Evidence deep-dive drawer detailing baselines, observed values, delta ratios, and underlying rows.
   - Server-side Gemini 2.5 Flash query with automatic, honest fallback to the deterministic rule engine when unconfigured or offline.
   - Copy finding summary to clipboard and JSON/CSV export.
5. **Anomaly Detection (`/anomalies`)**:
   - Dedicated anomaly workspace with severity filters (Critical, Warning, Info) and review status filters (Unreviewed, Reviewed, Dismissed).
   - Transparent mathematical derivation cards explaining threshold rules.
   - "Mark Reviewed" and "Dismiss" operator controls with audit trail logging.
6. **Reports (`/reports`)**:
   - Executive Brief generator with KPI overview and anomaly ledger.
   - `@media print` clean executive stylesheet for `window.print()` PDF generation.
   - Structured CSV summary export and JSON audit package export.
7. **Action Center (`/actions`)**:
   - Operators review and calibrate proposed action parameters (restock quantities, price adjustments, promotions).
   - Explicit confirmation modal guaranteeing that approving creates only a local sandbox simulation with zero external ERP side-effects.
   - Tracks draft, approved, and dismissed states with before-and-after projected metric comparisons.
8. **Operational Audit Trail (`/activity`)**:
   - Chronological event logging for dataset loads, validation errors, AI queries, simulation approvals, and demo resets.
   - Filter by category and search by keyword.
   - Export audit metadata to CSV or JSON; session purge control.
9. **Operator Profile (`/profile`)**:
   - Local demo operator profile with live initials avatar.
   - Editable display name, email, and organizational role.
   - Reduced-motion toggle (respects system preferences and toggles animations).
   - Automatic audit export toggle with browser storage persistence.
10. **Settings, Data Privacy & Methodology (`/settings`)**:
    - Real-time Gemini provider status check (`/api/insights/status`).
    - Detailed methodology modal documenting exact mathematical formulas and safety bounds.
    - Instant "Reset Demo" button to restore clean sample state.

---

## Security & Privacy Safeguards

- **Zero Client-Side Secrets**: `GEMINI_API_KEY` is strictly managed server-side. No `VITE_*` environment variables contain secrets.
- **CSV Cell Formula Neutralization**: Cells starting with `=`, `+`, `-`, or `@` are sanitized with prefix neutralization to prevent formula injection attacks.
- **Bounded Ingestion**: 5 MB file size limit, 10,000 row cap, and 50 KB server payload limits.
- **Minimal Necessary AI Aggregates**: Only statistical summaries (averages, deltas, finding IDs) are passed to AI; raw customer lists and full CSV rows are never transmitted.
- **Honest Fallback**: When `GEMINI_API_KEY` is not provided, the app clearly labels the fallback as the "Rule-Based Deterministic Engine (Offline Fallback)".

---

## Quickstart & Verification Commands

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Unit Tests (18 passing tests)
```bash
npm run test
```
Tests cover CSV validation, formula sanitization, deterministic metrics, anomaly detection rules, and AI JSON schema validation.

### 3. Run Production Build
```bash
npm run build
```
Compiles TypeScript and bundles via Vite into `dist/` with 0 errors.

### 4. Start Local Development Server
```bash
npm run dev
```
Serves the frontend application and backend API middleware on `http://localhost:5174/`.

---

## Environment Variables (.env)
Copy `.env.example` to `.env` if configuring a live Gemini API key:
```ini
GEMINI_API_KEY=your_gemini_api_key_here
AI_REQUEST_TIMEOUT_MS=15000
MAX_UPLOAD_MB=5
```
*(If left blank, the application automatically uses the transparent deterministic fallback without breaking).*
