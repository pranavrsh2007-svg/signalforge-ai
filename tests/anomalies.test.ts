import { describe, it, expect } from 'vitest';
import {
  detectAnomalies,
  generateDeterministicFallbackExplanation,
} from '../src/lib/analytics/anomalies';
import { calculateMetrics } from '../src/lib/analytics/metrics';
import { DataRow } from '../src/types';

describe('Explainable Anomaly Detection Rules', () => {
  // Test dataset with a demand surge and stockout risk
  const rows: DataRow[] = [
    { date: '2026-09-01', order_id: 'O-1', category: 'Office', product: 'Notebook', quantity: 2, unit_price: 10, unit_cost: 4, stock_on_hand: 100, revenue: 20, cost: 8, profit: 12, margin: 60 },
    { date: '2026-09-02', order_id: 'O-2', category: 'Office', product: 'Notebook', quantity: 3, unit_price: 10, unit_cost: 4, stock_on_hand: 97, revenue: 30, cost: 12, profit: 18, margin: 60 },
    { date: '2026-09-03', order_id: 'O-3', category: 'Home', product: 'Lamp', quantity: 5, unit_price: 20, unit_cost: 10, stock_on_hand: 12, revenue: 100, cost: 50, profit: 50, margin: 50 },
    { date: '2026-09-04', order_id: 'O-4', category: 'Office', product: 'Notebook', quantity: 15, unit_price: 10, unit_cost: 4, stock_on_hand: 82, revenue: 150, cost: 60, profit: 90, margin: 60 },
    { date: '2026-09-05', order_id: 'O-5', category: 'Office', product: 'Notebook', quantity: 20, unit_price: 10, unit_cost: 4, stock_on_hand: 62, revenue: 200, cost: 80, profit: 120, margin: 60 },
    { date: '2026-09-06', order_id: 'O-6', category: 'Home', product: 'Lamp', quantity: 5, unit_price: 20, unit_cost: 10, stock_on_hand: 7, revenue: 100, cost: 50, profit: 50, margin: 50 },
  ];

  it('detects inventory stockout risk when days runway is critical', () => {
    const summary = calculateMetrics(rows, true);
    const findings = detectAnomalies(rows, summary, true, true);

    const stockoutFinding = findings.find((f) => f.type === 'stockout_risk');
    expect(stockoutFinding).toBeDefined();
    expect(stockoutFinding?.severity).toBe('critical');
    expect(stockoutFinding?.evidence.length).toBeGreaterThan(0);
    expect(stockoutFinding?.evidence.some((e) => e.key === 'Depletion Runway')).toBe(true);
  });

  it('detects product sales surge between time periods', () => {
    const summary = calculateMetrics(rows, true);
    const findings = detectAnomalies(rows, summary, true, true);

    const surgeFinding = findings.find((f) => f.type === 'surge');
    expect(surgeFinding).toBeDefined();
    expect(surgeFinding?.observedValue).toContain('units');
    expect(surgeFinding?.delta).toContain('+');
  });

  it('generates transparent deterministic fallback explanation when AI is unconfigured', () => {
    const summary = calculateMetrics(rows, true);
    const findings = detectAnomalies(rows, summary, true, true);
    const finding = findings[0];

    const fallback = generateDeterministicFallbackExplanation(finding);
    expect(fallback.isFallback).toBe(true);
    expect(fallback.providerLabel).toContain('Deterministic Rule Engine');
    expect(fallback.recommendedActions.length).toBeGreaterThan(0);
    expect(fallback.recommendedActions[0].actionType).toBeDefined();
  });
});
