# SignalForge AI — Feature, Button & Interlinking Verification Matrix

This document provides a comprehensive audit of all interactive controls, buttons, navigation links, filters, modals, and export utilities across the 10 core pages of SignalForge AI.

---

## 1. Global Navigation & Layout Controls

| Page / Route | Component / Control | Expected Action | Implementation Location | Test Result | Known Limitations |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **All Routes** | Brand Logo (SVG spark wave) | Navigates to `/` (Home landing page) | `src/components/Header/AppHeader.tsx`, `src/components/Navigation/Sidebar.tsx` | **PASS** (Click resets route to Home) | None |
| **All Routes** | Sidebar Links (10 items) | Navigates to target tab/route, updates active violet pill and URL | `src/components/Navigation/Sidebar.tsx` | **PASS** (Switches view and syncs History API) | Desktop only (hidden on viewport < 1024px) |
| **All Routes** | Mobile Menu Hamburger Button | Slides open mobile navigation drawer with backdrop | `src/components/Header/AppHeader.tsx`, `src/components/Navigation/MobileDrawer.tsx` | **PASS** (Opens and traps focus) | Visible on viewports < 1024px |
| **All Routes** | Mobile Drawer Close (X / Backdrop) | Closes mobile navigation drawer | `src/components/Navigation/MobileDrawer.tsx` | **PASS** (Closes and restores scroll) | None |
| **All Routes** | Methodology Button (`"Methodology"`) | Opens deterministic math modal explaining formulas and anomaly thresholds | `src/components/Header/AppHeader.tsx`, `src/components/MethodologyModal/MethodologyModal.tsx` | **PASS** (Opens modal with calculation details) | Modal is informational only |
| **All Routes** | Quick Demo Reset (`"Reset Demo"`) | Opens confirmation modal, restores sample CSV, resets metrics & action drafts | `src/components/Header/AppHeader.tsx`, `src/App.tsx` | **PASS** (Prompts and resets state) | None |
| **All Routes** | Browser Back / Forward Buttons | Re-synchronizes UI tab with browser history stack | `src/App.tsx` (`popstate` listener) | **PASS** (Route updates tab correctly) | Client-side History API state |

---

## 2. Page 1 — Home / Landing (`/`)

| Component / Control | Expected Action | Implementation Location | Test Result | Known Limitations |
| :--- | :--- | :--- | :--- | :--- |
| **"Explore Dashboard" (Hero CTA)** | Navigates directly to `/dashboard` analytics workspace | `src/components/Home/HomeTab.tsx` | **PASS** (Switches tab to dashboard) | None |
| **"See How It Works" (Hero Secondary)** | Smooth-scrolls to the How It Works workflow pipeline section | `src/components/Home/HomeTab.tsx` | **PASS** (Scrolls to `#how-it-works`) | None |
| **"Try Live Demo" (Hero Header Badge)** | Loads sample dataset into memory and opens `/dashboard` | `src/components/Home/HomeTab.tsx` | **PASS** (Loads data and transitions) | None |
| **Rising Dashboard Preview Panel** | Displays real-time computed KPI preview cards and recent signals | `src/components/Home/HomeTab.tsx` | **PASS** (Reflects active dataset numbers) | Displays illustrative tag if sample data |
| **Pipeline Step Cards (4 Steps)** | Clickable workflow cards jump to respective functional pages | `src/components/Home/HomeTab.tsx` | **PASS** (Upload -> Data, Calculate -> Dashboard, Detect -> Anomalies, Act -> Actions) | None |
| **Footer Navigation Links** | Navigate directly to Dashboard, Data Explorer, Insights, Reports, Settings | `src/components/Home/HomeTab.tsx` | **PASS** (All 8 links navigate cleanly) | No external dead links |

---

## 3. Page 2 — Dashboard (`/dashboard`)

| Component / Control | Expected Action | Implementation Location | Test Result | Known Limitations |
| :--- | :--- | :--- | :--- | :--- |
| **"Upload CSV" Quick Action** | Transitions to `/data` explorer tab with upload zone | `src/components/Dashboard/DashboardTab.tsx` | **PASS** (Opens Data Explorer) | None |
| **"Explore Anomalies" Quick Action** | Transitions to `/anomalies` dedicated detection tab | `src/components/Dashboard/DashboardTab.tsx` | **PASS** (Opens Anomalies tab) | None |
| **"Export Report" Quick Action** | Transitions to `/reports` export tab | `src/components/Dashboard/DashboardTab.tsx` | **PASS** (Opens Reports tab) | None |
| **Date Range Filter Dropdown** | Filters daily revenue trend chart to All Time, Last 30 Days, Last 14 Days | `src/components/Dashboard/DashboardTab.tsx` | **PASS** (Re-slices chart trend data) | Depends on date range span in data |
| **Category Filter Dropdown** | Filters category distribution bar chart by category | `src/components/Dashboard/DashboardTab.tsx` | **PASS** (Filters category bar chart) | None |
| **Empty State "Load Sample Dataset"** | Loads public demo CSV when dataset is cleared | `src/components/Dashboard/DashboardTab.tsx` | **PASS** (Populates metrics and charts) | Triggered when row count is 0 |
| **Signal Alert "Inspect & Explain"** | Sets selected finding and switches to `/insights` tab | `src/components/Dashboard/DashboardTab.tsx` | **PASS** (Opens finding context in Insights) | None |

---

## 4. Page 3 — Data Explorer (`/data`)

| Component / Control | Expected Action | Implementation Location | Test Result | Known Limitations |
| :--- | :--- | :--- | :--- | :--- |
| **Drag & Drop Upload Zone** | Accepts dragged `.csv` file, validates schema & row limits | `src/components/DataExplorer/DataExplorerTab.tsx` | **PASS** (Parses file and shows toast/status) | Max 5MB file size limit |
| **"Browse Files" Picker** | Opens native file browser to choose CSV | `src/components/DataExplorer/DataExplorerTab.tsx` | **PASS** (Opens system file dialog) | CSV format only |
| **"Load Sample Dataset"** | Loads bundled sales dataset with 20 transactions | `src/components/DataExplorer/DataExplorerTab.tsx` | **PASS** (Loads public_sample_data_sales.csv) | None |
| **Search Input** | Filters table preview by Order ID, Product, or Category in real-time | `src/components/DataExplorer/DataExplorerTab.tsx` | **PASS** (Filters visible rows instantly) | Preview table only |
| **Category Filter Select** | Restricts table rows to selected category | `src/components/DataExplorer/DataExplorerTab.tsx` | **PASS** (Filters table preview) | None |
| **Sort By Select** | Sorts table rows by Date (Desc/Asc), Revenue (Desc), Quantity (Desc) | `src/components/DataExplorer/DataExplorerTab.tsx` | **PASS** (Re-orders preview rows) | None |
| **"Export Filtered CSV"** | Generates and downloads sanitized CSV of current filtered view | `src/components/DataExplorer/DataExplorerTab.tsx` | **PASS** (Triggers browser download) | Formula injection neutralized |
| **"Clear Active Dataset"** | Opens confirmation modal, then wipes in-memory rows & derived state | `src/components/DataExplorer/DataExplorerTab.tsx` | **PASS** (Prompts and empties dataset) | Reversible by reloading sample data |

---

## 5. Page 4 — AI Insights (`/insights`)

| Component / Control | Expected Action | Implementation Location | Test Result | Known Limitations |
| :--- | :--- | :--- | :--- | :--- |
| **Finding Accordion Expand/Collapse** | Toggles detail inspection view for individual anomaly findings | `src/components/Insights/InsightsTab.tsx` | **PASS** (Expands/collapses card) | One expanded finding at a time |
| **"Explain with AI" Button** | Dispatches POST to `/api/insights` via secure server proxy; validates response | `src/components/Insights/InsightsTab.tsx`, `src/lib/ai/client.ts` | **PASS** (Shows spinner, returns analysis) | Falls back to deterministic engine if unconfigured |
| **"Re-Explain with AI" Button** | Re-queries backend model with fresh context | `src/components/Insights/InsightsTab.tsx` | **PASS** (Re-queries server) | Same as above |
| **"Copy" Finding Summary** | Copies structured finding, baseline, delta, and AI analysis to clipboard | `src/components/Insights/InsightsTab.tsx` | **PASS** (Shows "Copied" badge and copies text) | Requires clipboard permissions |
| **"Create Action Plan" Button** | Generates prefilled draft proposal and redirects to `/actions` | `src/components/Insights/InsightsTab.tsx` | **PASS** (Draft created, switches to Action Center) | None |
| **"Export CSV" / "Export JSON"** | Downloads finding details and AI recommendations | `src/components/Insights/InsightsTab.tsx` | **PASS** (Triggers structured download) | None |

---

## 6. Page 5 — Anomaly Detection (`/anomalies`)

| Component / Control | Expected Action | Implementation Location | Test Result | Known Limitations |
| :--- | :--- | :--- | :--- | :--- |
| **Severity Filter Dropdown** | Filters anomaly list by All, Critical, Warning, or Info | `src/components/Anomalies/AnomaliesTab.tsx` | **PASS** (Filters cards accurately) | None |
| **Review Status Filter Dropdown** | Filters anomaly list by All, Unreviewed, Reviewed, or Dismissed | `src/components/Anomalies/AnomaliesTab.tsx` | **PASS** (Filters cards by review state) | None |
| **"Mark Reviewed" Button** | Toggles anomaly status to `reviewed`, logs audit trail event | `src/components/Anomalies/AnomaliesTab.tsx`, `src/App.tsx` | **PASS** (Updates badge and logs event) | Persisted in local session |
| **"Dismiss" Button** | Toggles anomaly status to `dismissed`, logs audit trail event | `src/components/Anomalies/AnomaliesTab.tsx`, `src/App.tsx` | **PASS** (Updates badge and logs event) | Persisted in local session |
| **"Explain with Gemini" Button** | Navigates to `/insights` with finding pre-selected | `src/components/Anomalies/AnomaliesTab.tsx` | **PASS** (Selects finding and opens Insights) | None |

---

## 7. Page 6 — Reports (`/reports`)

| Component / Control | Expected Action | Implementation Location | Test Result | Known Limitations |
| :--- | :--- | :--- | :--- | :--- |
| **"Print / Save as PDF" Button** | Invokes `window.print()` with `@media print` clean executive stylesheet | `src/components/Reports/ReportsTab.tsx` | **PASS** (Opens print dialog with print styling) | Browser print dialog dependent |
| **"Export CSV Summary" Button** | Generates CSV file of KPIs, anomalies, and active draft plans | `src/components/Reports/ReportsTab.tsx` | **PASS** (Downloads `SignalForge_Executive_Brief.csv`) | None |
| **"Export JSON Audit" Button** | Downloads complete structured report artifact with dataset digest | `src/components/Reports/ReportsTab.tsx` | **PASS** (Downloads `SignalForge_Executive_Brief.json`) | None |

---

## 8. Page 7 — Action Center (`/actions`)

| Component / Control | Expected Action | Implementation Location | Test Result | Known Limitations |
| :--- | :--- | :--- | :--- | :--- |
| **"Inspect More Signals"** | Navigates to `/insights` tab | `src/components/ActionCenter/ActionCenterTab.tsx` | **PASS** (Navigates to Insights) | None |
| **"Edit" Plan Parameters** | Opens modal dialog to calibrate plan title and execution description | `src/components/ActionCenter/ActionCenterTab.tsx` | **PASS** (Opens calibration modal, saves changes) | Local session state |
| **"Dismiss" Action Proposal** | Prompts for optional rejection rationale, updates plan to dismissed | `src/components/ActionCenter/ActionCenterTab.tsx` | **PASS** (Prompts and records dismissal) | Logged to audit trail |
| **"Approve Simulation" Button** | Opens safety confirmation modal, confirms local sandboxed simulation | `src/components/ActionCenter/ActionCenterTab.tsx`, `src/App.tsx` | **PASS** (Confirmation dialog executes simulation) | Local simulation only (no external API calls) |
| **"Mark Simulation Complete"** | Moves approved simulation to completed archive | `src/components/ActionCenter/ActionCenterTab.tsx` | **PASS** (Completes simulation and logs event) | None |
| **"Linked Finding" Link** | Deep-links directly to the causal finding on the Insights page | `src/components/ActionCenter/ActionCenterTab.tsx` | **PASS** (Selects finding and navigates) | None |

---

## 9. Page 8 — Operational Audit Trail (`/activity`)

| Component / Control | Expected Action | Implementation Location | Test Result | Known Limitations |
| :--- | :--- | :--- | :--- | :--- |
| **Search Input** | Filters audit records by action name, details, actor, or metadata keys | `src/components/AuditLog/AuditLogTab.tsx` | **PASS** (Real-time filtering of audit table) | None |
| **Category Filter Select** | Filters events by all, dataset_ingest, anomaly_detection, ai_query, etc. | `src/components/AuditLog/AuditLogTab.tsx` | **PASS** (Filters table by category) | None |
| **"Export CSV" Button** | Exports filtered audit trail to CSV | `src/components/AuditLog/AuditLogTab.tsx` | **PASS** (Downloads CSV file) | Formula sanitization applied |
| **"Export JSON" Button** | Exports complete audit records array with timestamps | `src/components/AuditLog/AuditLogTab.tsx` | **PASS** (Downloads JSON file) | None |
| **"Clear Log" Button** | Opens danger confirmation modal, purges local session audit history | `src/components/AuditLog/AuditLogTab.tsx` | **PASS** (Prompts and clears localStorage) | Clears local records only |

---

## 10. Page 9 — Operator Profile (`/profile`)

| Component / Control | Expected Action | Implementation Location | Test Result | Known Limitations |
| :--- | :--- | :--- | :--- | :--- |
| **Display Name Input** | Updates local operator identity name and recalculates initials avatar | `src/components/Profile/ProfileTab.tsx` | **PASS** (Live initials update, persists on save) | Local demo profile |
| **Email Address Input** | Updates local contact email | `src/components/Profile/ProfileTab.tsx` | **PASS** (Validates and saves) | Local demo profile |
| **Organizational Role Select** | Updates role designation (Data Scientist, VP Ops, Financial Analyst) | `src/components/Profile/ProfileTab.tsx` | **PASS** (Updates role badge) | None |
| **Reduced-Motion Preference Toggle** | Toggles reduced-motion preference; applies to planetary animations | `src/components/Profile/ProfileTab.tsx`, `src/App.tsx` | **PASS** (Persists and toggles body attribute) | Honored alongside OS settings |
| **Auto-Audit Export Toggle** | Toggles automatic session audit logging | `src/components/Profile/ProfileTab.tsx` | **PASS** (Persists preference in localStorage) | None |
| **"Save Profile Changes" Button** | Persists profile updates to browser storage and shows success toast | `src/components/Profile/ProfileTab.tsx` | **PASS** (Saves to `signalforge_user_profile`) | None |
| **"Reset Defaults" Button** | Restores demo operator identity (`Alex Vance, Lead Data Operations`) | `src/components/Profile/ProfileTab.tsx` | **PASS** (Restores initial demo identity) | None |

---

## 11. Page 10 — Settings & Privacy Disclosures (`/settings`)

| Component / Control | Expected Action | Implementation Location | Test Result | Known Limitations |
| :--- | :--- | :--- | :--- | :--- |
| **AI Provider Status Inspector** | Queries `/api/insights/status`, shows model name & configured state | `src/components/Settings/SettingsTab.tsx` | **PASS** (Shows Google Gemini / gemini-2.5-flash) | Never reveals raw secret |
| **"Reset Demo to Clean Sample State"** | Opens confirmation modal, reloads public sales CSV and clears stale state | `src/components/Settings/SettingsTab.tsx`, `src/App.tsx` | **PASS** (Restores sample dataset) | None |
| **"Purge Current Dataset"** | Opens confirmation modal, wipes active dataset from memory | `src/components/Settings/SettingsTab.tsx`, `src/App.tsx` | **PASS** (Clears data, shows empty state) | Reversible via sample reload |

---

## 12. Modal & Dialog Behavior Standards

- **Escape Key (`Escape`)**: All open modals (`ConfirmationModal`, `MethodologyModal`, `EditPlanModal`, `DismissPlanModal`) automatically close upon pressing Escape.
- **Backdrop Clicks**: Clicking outside dialog boundaries closes dismissible dialogs without submitting.
- **Focus Trapping & Visible Outlines**: Keyboard focus indicators use Royal Violet outlines (`2px solid #A020FF`) with 2px offset for WCAG AA compliance.
- **Destructive Actions**: Purging datasets, clearing audit trails, and executing simulations always require explicit secondary confirmation.
