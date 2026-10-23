import React, { useState, useMemo } from 'react';
import {
  AnomalyFinding,
  NavigationTab,
  AnomalyReviewStatus,
} from '../../types';
import { StatusBadge } from '../Common/StatusBadge';
import {
  AlertTriangle,
  Filter,
  Search,
  CheckCircle2,
  XCircle,
  Eye,
  Sliders,
  ChevronDown,
  ChevronUp,
  FileSearch,
  Info,
} from 'lucide-react';

interface AnomaliesTabProps {
  findings: AnomalyFinding[];
  onSelectFinding: (finding: AnomalyFinding) => void;
  onUpdateFindingStatus: (findingId: string, status: AnomalyReviewStatus) => void;
  onNavigate: (tab: NavigationTab) => void;
}

export const AnomaliesTab: React.FC<AnomaliesTabProps> = ({
  findings,
  onSelectFinding,
  onUpdateFindingStatus,
  onNavigate,
}) => {
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedId, setExpandedId] = useState<string>(findings[0]?.id || '');

  const filteredFindings = useMemo(() => {
    return findings.filter((f) => {
      if (severityFilter !== 'ALL' && f.severity !== severityFilter) return false;
      const currentReviewStatus = f.reviewStatus || 'unreviewed';
      if (statusFilter !== 'ALL' && currentReviewStatus !== statusFilter) return false;
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        f.title.toLowerCase().includes(q) ||
        f.metric.toLowerCase().includes(q) ||
        f.description.toLowerCase().includes(q) ||
        f.id.toLowerCase().includes(q)
      );
    });
  }, [findings, severityFilter, statusFilter, searchQuery]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px' }}>
      {/* Header Banner */}
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
            <AlertTriangle size={20} color="#FFBF69" />
            <h1 className="font-display" style={{ fontSize: '18px', fontWeight: 800, color: '#F7F7F8' }}>
              Anomaly Detection & Statistical Variance Center
            </h1>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
            Deterministic heuristics monitor linear runout runway, demand acceleration, and margin spreads. Statistical
            signals indicate notable empirical deviations, not proof of causation or wrongdoing.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button className="btn btn-secondary" onClick={() => onNavigate('data-explorer')}>
            <FileSearch size={14} />
            <span>Open Data Explorer</span>
          </button>
          <button className="btn btn-primary" onClick={() => onNavigate('insights')}>
            <Sliders size={14} />
            <span>Generate AI Insights</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="card"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          padding: '16px 20px',
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px', flex: 1 }}>
          {/* Search box */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 12px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-surface-base)',
              border: '1px solid var(--color-border)',
              minWidth: '220px',
            }}
          >
            <Search size={14} color="var(--color-text-muted)" />
            <input
              type="text"
              placeholder="Filter by metric, SKU, title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--color-text-main)',
                fontSize: '12px',
                width: '100%',
                outline: 'none',
              }}
            />
          </div>

          {/* Severity filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Filter size={13} color="var(--color-text-muted)" />
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              style={{
                backgroundColor: 'var(--color-surface-base)',
                color: 'var(--color-text-main)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: '6px 10px',
                fontSize: '12px',
                outline: 'none',
              }}
            >
              <option value="ALL">Severity: All</option>
              <option value="critical">Critical</option>
              <option value="warning">Warning</option>
              <option value="info">Informational</option>
            </select>
          </div>

          {/* Review status filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                backgroundColor: 'var(--color-surface-base)',
                color: 'var(--color-text-main)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: '6px 10px',
                fontSize: '12px',
                outline: 'none',
              }}
            >
              <option value="ALL">Status: All</option>
              <option value="unreviewed">Unreviewed</option>
              <option value="reviewed">Reviewed</option>
              <option value="dismissed">Dismissed</option>
            </select>
          </div>
        </div>

        <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
          Showing <strong className="font-tabular" style={{ color: '#F7F7F8' }}>{filteredFindings.length}</strong> of{' '}
          {findings.length} signals
        </span>
      </div>

      {/* Anomalies List */}
      {filteredFindings.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px', color: 'var(--color-text-muted)' }}>
          No anomaly signals match your selected filters.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filteredFindings.map((finding) => {
            const isExpanded = expandedId === finding.id;
            const reviewStatus = finding.reviewStatus || 'unreviewed';

            return (
              <div
                key={finding.id}
                className="card"
                style={{
                  borderLeft:
                    finding.severity === 'critical'
                      ? '4px solid #F03B2A'
                      : finding.severity === 'warning'
                      ? '4px solid #FFBF69'
                      : '4px solid #A020FF',
                  opacity: reviewStatus === 'dismissed' ? 0.6 : 1,
                }}
              >
                {/* Header row */}
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#F7F7F8' }}>
                          {finding.title}
                        </h2>
                        {reviewStatus !== 'unreviewed' && (
                          <span
                            className={`badge ${reviewStatus === 'reviewed' ? 'badge-mint' : 'badge-muted'}`}
                            style={{ fontSize: '10px' }}
                          >
                            {reviewStatus}
                          </span>
                        )}
                      </div>

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
                          <strong className="font-tabular" style={{ color: '#F7F7F8' }}>
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
                              color: finding.delta.startsWith('+') ? '#45B558' : '#F03B2A',
                            }}
                          >
                            {finding.delta}
                          </strong>
                        </span>
                        <span className="font-mono" style={{ color: 'var(--color-text-subtle)' }}>
                          Timeframe: {finding.timeWindow}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      className="btn btn-ghost"
                      style={{ padding: '6px' }}
                      aria-label={isExpanded ? 'Collapse card' : 'Expand card'}
                    >
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                  </div>
                </div>

                {/* Expanded details */}
                {isExpanded && (
                  <div
                    style={{
                      marginTop: '16px',
                      paddingTop: '16px',
                      borderTop: '1px solid var(--color-border-subtle)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '16px',
                    }}
                  >
                    <p style={{ fontSize: '13px', color: '#F7F7F8', lineHeight: 1.6 }}>
                      {finding.description}
                    </p>

                    {/* Underlying Evidence Calculation Grid */}
                    <div>
                      <div
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          color: 'var(--color-text-muted)',
                          textTransform: 'uppercase',
                          marginBottom: '8px',
                          letterSpacing: '0.06em',
                        }}
                      >
                        Mathematical Derivation & Baseline Evidence
                      </div>

                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                          gap: '10px',
                        }}
                      >
                        {finding.evidence.map((ev, idx) => (
                          <div
                            key={idx}
                            style={{
                              padding: '12px',
                              borderRadius: 'var(--radius-md)',
                              backgroundColor: 'var(--color-surface-base)',
                              border: '1px solid var(--color-border-subtle)',
                            }}
                          >
                            <span style={{ fontSize: '11px', color: 'var(--color-text-subtle)' }}>{ev.key}</span>
                            <div
                              className="font-tabular"
                              style={{
                                fontSize: '14px',
                                fontWeight: 700,
                                color: '#E34AFF',
                                margin: '2px 0 4px',
                              }}
                            >
                              {ev.value}
                            </div>
                            <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                              {ev.explanation}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Review & Action Controls */}
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingTop: '12px',
                        borderTop: '1px solid var(--color-border-subtle)',
                        gap: '12px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {reviewStatus !== 'reviewed' && (
                          <button
                            className="btn btn-secondary"
                            style={{ fontSize: '12px', padding: '6px 12px' }}
                            onClick={() => onUpdateFindingStatus(finding.id, 'reviewed')}
                          >
                            <CheckCircle2 size={13} color="#45B558" />
                            <span>Mark Reviewed</span>
                          </button>
                        )}

                        {reviewStatus !== 'dismissed' && (
                          <button
                            className="btn btn-ghost"
                            style={{ fontSize: '12px', padding: '6px 12px', color: 'var(--color-error)' }}
                            onClick={() => onUpdateFindingStatus(finding.id, 'dismissed')}
                          >
                            <XCircle size={13} />
                            <span>Dismiss Alert</span>
                          </button>
                        )}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <button
                          className="btn btn-primary"
                          style={{ fontSize: '12px', padding: '6px 14px' }}
                          onClick={() => {
                            onSelectFinding(finding);
                            onNavigate('insights');
                          }}
                        >
                          <Eye size={13} />
                          <span>Explain with Gemini AI</span>
                        </button>
                      </div>
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
