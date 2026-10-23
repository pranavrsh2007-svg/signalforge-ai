import React, { useState } from 'react';
import {
  AnomalyFinding,
  AIExplanation,
  RecommendedAction,
} from '../../types';
import { StatusBadge } from '../Common/StatusBadge';
import {
  Lightbulb,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ShieldAlert,
  Copy,
  Check,
  Download,
  RotateCw,
  Sliders,
} from 'lucide-react';

interface InsightsTabProps {
  findings: AnomalyFinding[];
  selectedFindingId?: string;
  onRequestAIExplanation: (finding: AnomalyFinding) => Promise<void>;
  onCreatePlan: (finding: AnomalyFinding, action: RecommendedAction) => void;
  onExportFindings: (format: 'json' | 'csv') => void;
}

export const InsightsTab: React.FC<InsightsTabProps> = ({
  findings,
  selectedFindingId,
  onRequestAIExplanation,
  onCreatePlan,
  onExportFindings,
}) => {
  const [expandedId, setExpandedId] = useState<string>(selectedFindingId || (findings[0]?.id ?? ''));
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopySummary = (finding: AnomalyFinding) => {
    const text = `SignalForge Finding: ${finding.title}\nMetric: ${finding.metric}\nObserved: ${finding.observedValue} | Baseline: ${finding.baselineValue} (${finding.delta})\nEvidence:\n${finding.evidence.map((e) => `• ${e.key}: ${e.value} - ${e.explanation}`).join('\n')}\n${finding.aiExplanation ? `\nAI Analysis (${finding.aiExplanation.providerLabel}):\n${finding.aiExplanation.summary}\nWhy it matters: ${finding.aiExplanation.whyItMatters}` : ''}`;

    navigator.clipboard.writeText(text);
    setCopiedId(finding.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px' }}>
      {/* Header and Controls */}
      <div
        className="card"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Lightbulb size={20} color="var(--color-bright-violet)" />
            <h1 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text-main)' }}>
              Explainable Signals & AI Recommendations
            </h1>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
            {findings.length} deterministic findings grounded in row-level statistical evidence. AI explains context and drafts operational plans.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button className="btn btn-secondary" onClick={() => onExportFindings('csv')}>
            <Download size={14} />
            <span>Export CSV</span>
          </button>
          <button className="btn btn-secondary" onClick={() => onExportFindings('json')}>
            <Download size={14} />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {findings.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-muted)' }}>
          No anomalies or signals detected in the active dataset.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {findings.map((finding) => {
            const isExpanded = expandedId === finding.id;
            const isLoadingAI = finding.aiStatus === 'loading';

            return (
              <div
                key={finding.id}
                className="card"
                style={{
                  borderLeft:
                    finding.severity === 'critical'
                      ? '4px solid var(--color-error)'
                      : finding.severity === 'warning'
                      ? '4px solid var(--color-warning)'
                      : '4px solid var(--color-bright-violet)',
                }}
              >
                {/* Header Row */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    gap: '16px',
                  }}
                  onClick={() => setExpandedId(isExpanded ? '' : finding.id)}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <div style={{ marginTop: '2px' }}>
                      <StatusBadge status={finding.type} />
                    </div>
                    <div>
                      <h2 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-main)' }}>
                        {finding.title}
                      </h2>
                      <div
                        style={{
                          fontSize: '12px',
                          color: 'var(--color-text-muted)',
                          marginTop: '4px',
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '16px',
                        }}
                      >
                        <span>
                          Observed:{' '}
                          <strong className="font-tabular" style={{ color: 'var(--color-text-main)' }}>
                            {finding.observedValue}
                          </strong>
                        </span>
                        <span>
                          Baseline:{' '}
                          <span className="font-tabular" style={{ color: 'var(--color-text-muted)' }}>
                            {finding.baselineValue}
                          </span>
                        </span>
                        <span>
                          Delta:{' '}
                          <strong
                            className="font-tabular"
                            style={{
                              color: finding.delta.startsWith('+')
                                ? 'var(--color-success)'
                                : 'var(--color-error)',
                            }}
                          >
                            {finding.delta}
                          </strong>
                        </span>
                        <span className="font-mono" style={{ color: 'var(--color-text-subtle)' }}>
                          Window: {finding.timeWindow}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {finding.aiExplanation && (
                      <span
                        className="badge badge-mint"
                        style={{ fontSize: '10px' }}
                        title={finding.aiExplanation.providerLabel}
                      >
                        {finding.aiExplanation.isFallback ? 'Deterministic Fallback' : 'Gemini AI Verified'}
                      </span>
                    )}

                    <button
                      className="btn btn-ghost"
                      style={{ padding: '4px' }}
                      aria-label={isExpanded ? 'Collapse card' : 'Expand card'}
                    >
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details Body */}
                {isExpanded && (
                  <div
                    style={{
                      marginTop: '20px',
                      paddingTop: '20px',
                      borderTop: '1px solid var(--color-border-subtle)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '20px',
                    }}
                  >
                    {/* Heuristic Description */}
                    <div style={{ fontSize: '13px', color: 'var(--color-text-main)', lineHeight: 1.6 }}>
                      {finding.description}
                    </div>

                    {/* Underlying Evidence Grid */}
                    <div>
                      <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.06em' }}>
                        Deterministic Evidence Trail
                      </div>
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                          gap: '10px',
                        }}
                      >
                        {finding.evidence.map((item, idx) => (
                          <div
                            key={idx}
                            style={{
                              padding: '12px',
                              borderRadius: 'var(--radius-md)',
                              backgroundColor: 'var(--color-surface-base)',
                              border: '1px solid var(--color-border-subtle)',
                            }}
                          >
                            <span style={{ fontSize: '11px', color: 'var(--color-text-subtle)' }}>{item.key}</span>
                            <div
                              className="font-tabular"
                              style={{
                                fontSize: '14px',
                                fontWeight: 700,
                                color: 'var(--color-bright-violet)',
                                margin: '2px 0 4px',
                              }}
                            >
                              {item.value}
                            </div>
                            <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                              {item.explanation}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* AI Explanation or Generation Button */}
                    <div
                      style={{
                        padding: '16px',
                        borderRadius: 'var(--radius-lg)',
                        backgroundColor: 'var(--color-surface-raised)',
                        border: '1px solid var(--color-border-strong)',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '12px',
                          flexWrap: 'wrap',
                          gap: '8px',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Sparkles size={16} color="var(--color-magenta-glow)" />
                          <h3 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text-main)' }}>
                            AI Context Analysis & Recommendations
                          </h3>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <button
                            className="btn btn-ghost"
                            style={{ fontSize: '11px', padding: '4px 8px' }}
                            onClick={() => handleCopySummary(finding)}
                          >
                            {copiedId === finding.id ? <Check size={12} color="var(--color-success)" /> : <Copy size={12} />}
                            <span>{copiedId === finding.id ? 'Copied' : 'Copy'}</span>
                          </button>

                          <button
                            className="btn btn-primary"
                            style={{ fontSize: '12px', padding: '6px 12px' }}
                            disabled={isLoadingAI}
                            onClick={() => onRequestAIExplanation(finding)}
                          >
                            {isLoadingAI ? (
                              <>
                                <RotateCw size={13} className="spin" />
                                <span>Querying Server...</span>
                              </>
                            ) : finding.aiExplanation ? (
                              <>
                                <RotateCw size={13} />
                                <span>Re-Explain with AI</span>
                              </>
                            ) : (
                              <>
                                <Sparkles size={13} />
                                <span>Explain with AI</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {finding.aiExplanation ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          <div style={{ fontSize: '13px', color: 'var(--color-text-main)', lineHeight: 1.6 }}>
                            {finding.aiExplanation.summary}
                          </div>

                          <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                            <strong style={{ color: 'var(--color-text-main)' }}>Why it matters: </strong>
                            {finding.aiExplanation.whyItMatters}
                          </div>

                          {/* Drivers */}
                          {finding.aiExplanation.underlyingDrivers.length > 0 && (
                            <div>
                              <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '4px' }}>
                                Underlying Empirical Drivers:
                              </div>
                              <ul style={{ paddingLeft: '18px', fontSize: '12px', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                                {finding.aiExplanation.underlyingDrivers.map((driver, i) => (
                                  <li key={i}>{driver}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Uncertainty / Safety Notice */}
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              fontSize: '11px',
                              color: 'var(--color-text-subtle)',
                              padding: '8px 10px',
                              borderRadius: 'var(--radius-sm)',
                              backgroundColor: 'var(--color-surface-base)',
                            }}
                          >
                            <ShieldAlert size={14} color="var(--color-bright-violet)" />
                            <span>
                              <strong>Model Uncertainty:</strong> {finding.aiExplanation.uncertaintyNotes}
                            </span>
                          </div>

                          {/* Action Plan Proposals */}
                          <div style={{ marginTop: '8px' }}>
                            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-main)', marginBottom: '8px' }}>
                              Recommended Operational Actions:
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                              {finding.aiExplanation.recommendedActions.map((rec) => (
                                <div
                                  key={rec.actionId}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '12px 14px',
                                    borderRadius: 'var(--radius-md)',
                                    backgroundColor: 'var(--color-surface-base)',
                                    border: '1px solid var(--color-border-subtle)',
                                    gap: '12px',
                                  }}
                                >
                                  <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                      <StatusBadge status={rec.actionType} />
                                      <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-main)' }}>
                                        {rec.title}
                                      </h4>
                                    </div>
                                    <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                                      {rec.description}
                                    </p>
                                    <div style={{ fontSize: '11px', color: 'var(--color-success)', marginTop: '2px' }}>
                                      Expected Impact: {rec.expectedImpact}
                                    </div>
                                  </div>

                                  <button
                                    className="btn btn-primary"
                                    style={{ fontSize: '12px', padding: '6px 12px', flexShrink: 0 }}
                                    onClick={() => onCreatePlan(finding, rec)}
                                  >
                                    <Sliders size={13} />
                                    <span>Create Action Plan</span>
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                          Click &quot;Explain with AI&quot; to securely request server-side Gemini analysis with grounded recommendations.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
