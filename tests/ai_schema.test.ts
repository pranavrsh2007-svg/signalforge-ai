import { describe, it, expect } from 'vitest';
import { validateAIExplanation } from '../src/lib/ai/schema';

describe('AI Output Validation & Safety Sanitization', () => {
  it('accepts and structures a valid Gemini response conforming to the JSON schema', () => {
    const validRaw = {
      findingId: 'ANOM-123',
      summary: 'Notebook sales spiked due to seasonal back-to-school buying patterns.',
      whyItMatters: 'Top revenue driver representing 45% of monthly gross margin.',
      underlyingDrivers: ['Bulk purchases by local organizations', 'Competitive pricing'],
      uncertaintyNotes: 'Sample window is 15 days; seasonality cannot be verified without prior year data.',
      recommendedActions: [
        {
          actionId: 'ACT-1',
          title: 'Reorder 100 units from distributor',
          description: 'Submit purchase requisition before lead time expires.',
          expectedImpact: 'Extends runway by 30 days',
          actionType: 'restock',
          targetEntity: 'Notebook Set',
        },
      ],
    };

    const validated = validateAIExplanation(validRaw, 'FALLBACK-ID');

    expect(validated).not.toBeNull();
    expect(validated?.findingId).toBe('ANOM-123');
    expect(validated?.summary).toBe(validRaw.summary);
    expect(validated?.recommendedActions.length).toBe(1);
    expect(validated?.recommendedActions[0].actionType).toBe('restock');
    expect(validated?.providerLabel).toContain('Google Gemini 2.5 Flash');
    expect(validated?.isFallback).toBe(false);
  });

  it('rejects invalid or non-object payloads', () => {
    expect(validateAIExplanation(null, 'ID')).toBeNull();
    expect(validateAIExplanation('string response', 'ID')).toBeNull();
    expect(validateAIExplanation({}, 'ID')).toBeNull(); // Missing summary
  });

  it('bounds and truncates overly long strings to prevent DOM abuse', () => {
    const hugeSummary = 'A'.repeat(1000);
    const raw = {
      findingId: 'ANOM-LONG',
      summary: hugeSummary,
      whyItMatters: 'Short why',
      recommendedActions: [],
    };

    const validated = validateAIExplanation(raw, 'ID');
    expect(validated).not.toBeNull();
    expect(validated?.summary.length).toBeLessThanOrEqual(500);
  });

  it('normalizes unrecognized action types to safe investigation enum', () => {
    const raw = {
      findingId: 'ANOM-TEST',
      summary: 'Test summary',
      whyItMatters: 'Test why',
      recommendedActions: [
        {
          actionId: 'ACT-99',
          title: 'Dangerous external action',
          description: 'Try unknown type',
          actionType: 'malicious_eval',
          targetEntity: 'Target',
        },
      ],
    };

    const validated = validateAIExplanation(raw, 'ID');
    expect(validated?.recommendedActions[0].actionType).toBe('investigation');
  });
});
