import { ActionPlan, AnomalyFinding, RecommendedAction } from '../../types';

export function createPlanFromRecommendation(
  finding: AnomalyFinding,
  recommendation: RecommendedAction
): ActionPlan {
  const projectedMetrics = [];

  if (recommendation.actionType === 'restock') {
    projectedMetrics.push({
      metric: 'Depletion Runway',
      before: String(finding.observedValue),
      after: '28.0 days (Projected after delivery)',
    });
    projectedMetrics.push({
      metric: 'Stockout Probability',
      before: 'High (within 7 days)',
      after: 'Low (< 5% risk)',
    });
  } else if (recommendation.actionType === 'price_adjust') {
    projectedMetrics.push({
      metric: 'Gross Margin Spread',
      before: String(finding.observedValue),
      after: '+3.5% Projected Uplift',
    });
    projectedMetrics.push({
      metric: 'Expected Volume Impact',
      before: 'Baseline',
      after: '-2% volume elasticity buffer',
    });
  } else if (recommendation.actionType === 'promotion') {
    projectedMetrics.push({
      metric: 'Daily Order Velocity',
      before: String(finding.observedValue),
      after: '+12% Incremental Sales Run-Rate',
    });
  } else {
    projectedMetrics.push({
      metric: 'Operational Risk',
      before: 'Unverified variance',
      after: 'Resolved / Documented root cause',
    });
  }

  return {
    id: `PLAN-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`,
    findingId: finding.id,
    findingTitle: finding.title,
    title: recommendation.title,
    description: recommendation.description,
    status: 'draft',
    actionType: recommendation.actionType,
    targetEntity: recommendation.targetEntity,
    expectedImpact: recommendation.expectedImpact,
    simulationNotes: 'Simulated draft. Requires explicit human confirmation before simulation execution.',
    createdAt: new Date().toISOString(),
    projectedMetrics,
  };
}

export function approveActionPlan(plan: ActionPlan): ActionPlan {
  return {
    ...plan,
    status: 'approved_simulation',
    approvedAt: new Date().toISOString(),
    simulationNotes:
      'LOCAL DEMO SIMULATION APPROVED. Note: This creates a sandbox simulation only. No external ERP, Shopify, or inventory systems are altered.',
  };
}

export function dismissActionPlan(plan: ActionPlan, reason?: string): ActionPlan {
  return {
    ...plan,
    status: 'dismissed',
    dismissedAt: new Date().toISOString(),
    dismissReason: reason || 'Dismissed by operator after evidence review.',
  };
}

export function completeActionPlan(plan: ActionPlan): ActionPlan {
  return {
    ...plan,
    status: 'completed_simulation',
    simulationNotes: 'Simulation run cycle marked complete in local test environment.',
  };
}
