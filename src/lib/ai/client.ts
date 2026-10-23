import { AnomalyFinding, AIExplanation } from '../../types';
import { validateAIExplanation } from './schema';
import { generateDeterministicFallbackExplanation } from '../analytics/anomalies';

export interface AIProviderStatus {
  configured: boolean;
  provider: string;
  model: string;
  message: string;
}

export async function checkProviderStatus(): Promise<AIProviderStatus> {
  try {
    const res = await fetch('/api/insights/status', {
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(3000),
    });
    if (res.ok) {
      const data = await res.json();
      return {
        configured: Boolean(data.configured),
        provider: data.provider || 'Google Gemini',
        model: data.model || 'gemini-2.5-flash',
        message: data.message || (data.configured ? 'Configured and active' : 'API Key not provided in server environment'),
      };
    }
  } catch {
    // Dev server or endpoint not responding
  }
  return {
    configured: false,
    provider: 'Google Gemini',
    model: 'gemini-2.5-flash',
    message: 'Server endpoint unconfigured — using transparent deterministic fallback',
  };
}

export async function requestAIExplanation(finding: AnomalyFinding): Promise<{
  explanation: AIExplanation;
  source: 'gemini' | 'deterministic-fallback';
  status: 'success' | 'fallback';
  errorDetails?: string;
}> {
  // Aggregate payload: minimal bounded context only, NEVER raw rows
  const payload = {
    findingId: finding.id,
    title: finding.title,
    type: finding.type,
    metric: finding.metric,
    observedValue: finding.observedValue,
    baselineValue: finding.baselineValue,
    delta: finding.delta,
    timeWindow: finding.timeWindow,
    description: finding.description,
    evidence: finding.evidence.map((e) => ({
      key: e.key,
      value: e.value,
      explanation: e.explanation,
    })),
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

    const res = await fetch('/api/insights', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const json = await res.json();
      if (json && json.data) {
        const validated = validateAIExplanation(json.data, finding.id);
        if (validated) {
          return {
            explanation: validated,
            source: 'gemini',
            status: 'success',
          };
        }
      }
      // If server returned a fallback message
      if (json && json.fallback) {
        const fallback = generateDeterministicFallbackExplanation(finding);
        return {
          explanation: fallback,
          source: 'deterministic-fallback',
          status: 'fallback',
          errorDetails: json.message || 'Server indicated provider unconfigured.',
        };
      }
    } else {
      const errText = await res.text();
      console.warn('API error from /api/insights:', res.status, errText);
    }
  } catch (err: any) {
    const isTimeout = err.name === 'AbortError' || err.name === 'TimeoutError';
    console.warn(`AI request failed (${isTimeout ? 'Timeout' : 'Network/Server'}):`, err.message);
  }

  // Graceful deterministic fallback
  const fallback = generateDeterministicFallbackExplanation(finding);
  return {
    explanation: fallback,
    source: 'deterministic-fallback',
    status: 'fallback',
    errorDetails: 'Gemini server endpoint unconfigured or unreachable. Using deterministic fallback.',
  };
}
