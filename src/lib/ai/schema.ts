import { AIExplanation, RecommendedAction } from '../../types';

export function validateAIExplanation(data: unknown, fallbackFindingId: string): AIExplanation | null {
  if (!data || typeof data !== 'object') {
    return null;
  }

  const obj = data as Record<string, unknown>;

  // Basic string sanitization and field extraction
  const findingId = typeof obj.findingId === 'string' && obj.findingId.trim() ? obj.findingId.trim() : fallbackFindingId;
  const summary = typeof obj.summary === 'string' ? obj.summary.trim() : '';
  const whyItMatters = typeof obj.whyItMatters === 'string' ? obj.whyItMatters.trim() : '';
  const uncertaintyNotes = typeof obj.uncertaintyNotes === 'string' ? obj.uncertaintyNotes.trim() : 'Confidence bounded by available sample data.';

  if (!summary) {
    return null;
  }

  const underlyingDrivers: string[] = [];
  if (Array.isArray(obj.underlyingDrivers)) {
    for (const d of obj.underlyingDrivers) {
      if (typeof d === 'string' && d.trim()) {
        underlyingDrivers.push(d.trim().slice(0, 300));
      }
    }
  }

  const recommendedActions: RecommendedAction[] = [];
  if (Array.isArray(obj.recommendedActions)) {
    for (const act of obj.recommendedActions) {
      if (act && typeof act === 'object') {
        const a = act as Record<string, unknown>;
        const title = typeof a.title === 'string' ? a.title.trim().slice(0, 150) : '';
        const description = typeof a.description === 'string' ? a.description.trim().slice(0, 400) : '';
        const expectedImpact = typeof a.expectedImpact === 'string' ? a.expectedImpact.trim().slice(0, 200) : '';
        const targetEntity = typeof a.targetEntity === 'string' ? a.targetEntity.trim().slice(0, 100) : 'Active Dataset';

        let actionType: 'restock' | 'price_adjust' | 'promotion' | 'investigation' = 'investigation';
        if (typeof a.actionType === 'string') {
          const typeStr = a.actionType.toLowerCase();
          if (['restock', 'price_adjust', 'promotion', 'investigation'].includes(typeStr)) {
            actionType = typeStr as any;
          }
        }

        if (title && description) {
          recommendedActions.push({
            actionId: typeof a.actionId === 'string' && a.actionId ? a.actionId : `ACT-${Math.random().toString(36).slice(2, 7)}`,
            title,
            description,
            expectedImpact: expectedImpact || 'Improves business visibility and mitigates variance.',
            actionType,
            targetEntity,
          });
        }
      }
    }
  }

  return {
    findingId,
    summary: summary.slice(0, 500),
    whyItMatters: whyItMatters.slice(0, 500),
    underlyingDrivers: underlyingDrivers.length > 0 ? underlyingDrivers : ['Observed empirical data shift.'],
    uncertaintyNotes: uncertaintyNotes.slice(0, 300),
    recommendedActions,
    generatedAt: new Date().toISOString(),
    providerLabel: 'Google Gemini 2.5 Flash (Server-Side Verified)',
    isFallback: false,
  };
}
