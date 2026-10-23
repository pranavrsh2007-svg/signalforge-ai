# IDEA.md — SignalForge AI

## Idea
SignalForge AI converts small-business sales/inventory CSV data into explainable insights, evidence-backed recommendations and human-approved simulated actions.

## Problem
Small businesses may have spreadsheets but lack the time or expertise to detect product performance changes, revenue trends or stock risks. Generic chat answers are not reliably tied to the source data.

## Solution
Validate CSV input, calculate metrics deterministically, detect anomalies with transparent rules, visualize trends, and ask AI to explain computed findings. Users inspect evidence, create an action plan, approve a simulation and review the audit trail.

## Target users
Small-business owners, shop managers and student analysts.

## Differentiators
- Real CSV ingestion and validation.
- Deterministic metrics with explicit formulas.
- Explainable anomaly signals with baseline and delta.
- AI explains known evidence rather than inventing metrics.
- Human approval and simulated actions.
- Audit trail and honest provider/fallback status.

## Demo journey
Sample/CSV → validation → dashboard → anomaly/evidence → AI or transparent fallback → action plan → approved simulation → audit log/export.

## MVP success
A judge completes the flow in under 3 minutes; invalid CSV gets actionable feedback; metrics are reproducible; AI output references findings; no external action happens; mobile and desktop are usable.

## Scope limits
No real purchasing/inventory changes, custom model training, multi-agent framework, paid data warehouse provisioning, or unsupported accuracy claims. Demo data is illustrative and must be labelled. Disclose Google technologies actually used; never claim Gemini/Firebase/Vertex AI/BigQuery integration unless verified.
