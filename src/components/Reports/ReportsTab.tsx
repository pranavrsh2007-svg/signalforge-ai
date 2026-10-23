import React, { useState } from 'react';
import {
  MetricSummary,
  AnomalyFinding,
  ActionPlan,
  ValidationResult,
  NavigationTab,
} from '../../types';
import { StatusBadge } from '../Common/StatusBadge';
import {
  FileText,
  Printer,
  Download,
  Calendar,
  Database,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
} from 'lucide-react';

interface ReportsTabProps {
  metrics: MetricSummary;
  findings: AnomalyFinding[];
  plans: ActionPlan[];
  validation: ValidationResult;
  onNavigate: (tab: NavigationTab) => void;
}

export const ReportsTab: React.FC<ReportsTabProps> = ({
  metrics,
  findings,
  plans,
  validation,
  onNavigate,
}) => {
  const [reportDate] = useState<string>(new Date().toLocaleString());

  const handlePrint = () => {
    window.print();
  };

  const handleExportCsvReport = () => {
    const lines = [
      '# SIGNALFORGE AI - COMPREHENSIVE BUSINESS INTELLIGENCE REPORT',
      `Generated At,"${reportDate}"`,
      `Active Dataset,"${validation.fileName}"`,
      `Date Range,"${metrics.dateRange.start} to ${metrics.dateRange.end}"`,
      '',
      '# 1. CORE DETERMINISTIC METRICS',
      'Metric,Calculated Value,Formula',
      `Total Gross Revenue,$${metrics.totalRevenue.toFixed(2)},"SUM(quantity * unit_price)"`,
      `Total Orders,${metrics.totalOrders},"COUNT(DISTINCT order_id)"`,
      `Average Order Value,$${metrics.averageOrderValue.toFixed(2)},"Total Revenue / Total Orders"`,
      `Total Units Sold,${metrics.totalUnitsSold},"SUM(quantity)"`,
      `Gross Margin,${metrics.grossMarginPercent !== null && metrics.grossMarginPercent !== undefined ? `${metrics.grossMarginPercent.toFixed(1)}%` : 'Omitted (No unit_cost column)'},"(Revenue - Cost) / Revenue * 100"`,
      '',
      '# 2. DETECTED STATISTICAL ANOMALY FINDINGS',
      'ID,Title,Type,Severity,Observed Value,Baseline Value,Delta,Timeframe',
      ...findings.map(
        (f) =>
          `"${f.id}","${f.title.replace(/"/g, '""')}","${f.type}","${f.severity}","${String(f.observedValue).replace(/"/g, '""')}","${String(f.baselineValue).replace(/"/g, '""')}","${f.delta}","${f.timeWindow}"`
      ),
      '',
      '# 3. PROPOSED OPERATIONAL ACTIONS & SIMULATIONS',
      'Plan ID,Action Title,Target Entity,Status,Expected Impact',
      ...plans.map(
        (p) =>
          `"${p.id}","${p.title.replace(/"/g, '""')}","${p.targetEntity}","${p.status}","${p.expectedImpact.replace(/"/g, '""')}"`
      ),
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `signalforge_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportJsonReport = () => {
    const reportData = {
      reportTitle: 'SignalForge AI Executive Business Intelligence Report',
      generatedAt: reportDate,
      dataset: {
        fileName: validation.fileName,
        rowCount: validation.rowCount,
        columnCount: validation.columnCount,
        hasCost: validation.hasCost,
        hasStock: validation.hasStock,
      },
      metrics,
      detectedFindings: findings,
      operationalPlans: plans,
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `signalforge_report_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
            <FileText size={20} color="#E34AFF" />
            <h1 className="font-display" style={{ fontSize: '18px', fontWeight: 800, color: '#F7F7F8' }}>
              Executive Reports & Decision Briefs
            </h1>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
            Publication-ready summary synthesizing deterministic metrics, detected anomaly signals, grounded AI
            explanations, and approved simulations.
          </p>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
          <button className="btn btn-secondary" onClick={handlePrint} title="Print or Save as PDF">
            <Printer size={14} />
            <span>Print / PDF</span>
          </button>
          <button className="btn btn-secondary" onClick={handleExportCsvReport}>
            <Download size={14} />
            <span>Export CSV Report</span>
          </button>
          <button className="btn btn-primary" onClick={handleExportJsonReport}>
            <Download size={14} />
            <span>Export JSON Report</span>
          </button>
        </div>
      </div>

      {/* Printable Report Canvas */}
      <div
        className="glass-panel"
        style={{
          padding: '32px',
          backgroundColor: 'var(--color-surface-card)',
          borderRadius: 'var(--radius-xl)',
          display: 'flex',
          flexDirection: 'column',
          gap: '28px',
        }}
      >
        {/* Report Metadata Header */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--color-border)',
            paddingBottom: '20px',
            gap: '16px',
          }}
        >
          <div>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.12em',
                color: '#E34AFF',
                textTransform: 'uppercase',
              }}
            >
              SIGNALFORGE AI EXECUTIVE BRIEF
            </span>
            <h2 className="font-display" style={{ fontSize: '24px', fontWeight: 800, color: '#F7F7F8', marginTop: '4px' }}>
              Business Intelligence & Operations Review
            </h2>
          </div>

          <div style={{ textAlign: 'right', fontSize: '12px', color: 'var(--color-text-muted)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end' }}>
              <Calendar size={13} color="#E34AFF" />
              <span>Generated: {reportDate}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end', marginTop: '2px' }}>
              <Database size={13} color="#45B558" />
              <span>Dataset: {validation.fileName} ({validation.rowCount.toLocaleString()} rows)</span>
            </div>
          </div>
        </div>

        {/* Executive Metrics Grid */}
        <div>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#F7F7F8', marginBottom: '12px' }}>
            1. Core Deterministic Metrics
          </h3>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '12px',
            }}
          >
            <div style={{ padding: '14px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-surface-base)' }}>
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Total Gross Revenue</span>
              <div className="font-tabular" style={{ fontSize: '22px', fontWeight: 800, color: '#F7F7F8', marginTop: '4px' }}>
                ${metrics.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
              <span style={{ fontSize: '10px', color: '#45B558' }}>Mathematical SUM(qty * price)</span>
            </div>

            <div style={{ padding: '14px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-surface-base)' }}>
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Analyzed Orders</span>
              <div className="font-tabular" style={{ fontSize: '22px', fontWeight: 800, color: '#F7F7F8', marginTop: '4px' }}>
                {metrics.totalOrders.toLocaleString()}
              </div>
              <span style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>Distinct order count</span>
            </div>

            <div style={{ padding: '14px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-surface-base)' }}>
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Average Order Value</span>
              <div className="font-tabular" style={{ fontSize: '22px', fontWeight: 800, color: '#F7F7F8', marginTop: '4px' }}>
                ${metrics.averageOrderValue.toFixed(2)}
              </div>
              <span style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>Per order transaction average</span>
            </div>

            <div style={{ padding: '14px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-surface-base)' }}>
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Gross Margin</span>
              <div className="font-tabular" style={{ fontSize: '22px', fontWeight: 800, color: '#E34AFF', marginTop: '4px' }}>
                {metrics.grossMarginPercent !== null && metrics.grossMarginPercent !== undefined
                  ? `${metrics.grossMarginPercent.toFixed(1)}%`
                  : 'N/A'}
              </div>
              <span style={{ fontSize: '10px', color: metrics.hasGrossMargin ? '#45B558' : 'var(--color-warning)' }}>
                {metrics.hasGrossMargin ? 'Cost data tracked' : 'Omitted: no unit_cost'}
              </span>
            </div>
          </div>
        </div>

        {/* Anomaly Signals Summary */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#F7F7F8' }}>
              2. Key Anomaly Findings ({findings.length})
            </h3>
            <button className="btn btn-ghost" style={{ fontSize: '11px' }} onClick={() => onNavigate('anomalies')}>
              <span>Manage in Anomalies Tab</span>
              <ArrowRight size={12} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {findings.map((finding) => (
              <div
                key={finding.id}
                style={{
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-surface-base)',
                  border: '1px solid var(--color-border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <StatusBadge status={finding.type} />
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#F7F7F8' }}>{finding.title}</span>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                    {finding.description}
                  </p>
                </div>

                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div className="font-tabular" style={{ fontSize: '13px', fontWeight: 700, color: '#E34AFF' }}>
                    Observed: {finding.observedValue}
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-subtle)' }}>
                    Baseline: {finding.baselineValue} ({finding.delta})
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Operational Plans Summary */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#F7F7F8' }}>
              3. Operational Action Plans & Simulations ({plans.length})
            </h3>
            <button className="btn btn-ghost" style={{ fontSize: '11px' }} onClick={() => onNavigate('action-center')}>
              <span>Open Action Center</span>
              <ArrowRight size={12} />
            </button>
          </div>

          {plans.length === 0 ? (
            <div style={{ padding: '20px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-surface-base)', color: 'var(--color-text-muted)', fontSize: '12px' }}>
              No action plans created yet. Inspect findings in Insights to propose operational decisions.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  style={{
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--color-surface-base)',
                    border: '1px solid var(--color-border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <StatusBadge status={plan.status} />
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#F7F7F8' }}>{plan.title}</span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                      Target: <strong style={{ color: '#F7F7F8' }}>{plan.targetEntity}</strong> &bull; Impact: {plan.expectedImpact}
                    </div>
                  </div>

                  <span className="font-mono" style={{ fontSize: '11px', color: 'var(--color-text-subtle)' }}>
                    {plan.approvedAt ? `Approved ${plan.approvedAt.slice(0, 10)}` : 'Draft Mode'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
