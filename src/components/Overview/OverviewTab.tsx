import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import {
  MetricSummary,
  DailyTrend,
  CategoryTrend,
  AnomalyFinding,
  ValidationResult,
  NavigationTab,
} from '../../types';
import { MetricCard } from '../Common/MetricCard';
import { StatusBadge } from '../Common/StatusBadge';
import {
  Upload,
  Database,
  ArrowRight,
  TrendingUp,
  PieChart as PieIcon,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';

interface OverviewTabProps {
  metrics: MetricSummary;
  dailyTrends: DailyTrend[];
  categoryTrends: CategoryTrend[];
  findings: AnomalyFinding[];
  validation: ValidationResult;
  onNavigate: (tab: NavigationTab) => void;
  onSelectFinding: (finding: AnomalyFinding) => void;
  onLoadSampleData: () => void;
  onOpenUpload: () => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  metrics,
  dailyTrends,
  categoryTrends,
  findings,
  validation,
  onNavigate,
  onSelectFinding,
  onLoadSampleData,
  onOpenUpload,
}) => {
  const topCriticalFindings = findings.filter((f) => f.severity === 'critical' || f.severity === 'warning');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px' }}>
      {/* Top Banner / Dataset Status */}
      <div
        className="card"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          backgroundColor: 'var(--color-surface-base)',
          borderLeft: '4px solid var(--color-bright-violet)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              padding: '10px',
              borderRadius: '8px',
              backgroundColor: 'var(--color-surface-raised)',
              color: 'var(--color-bright-violet)',
            }}
          >
            <Database size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-main)' }}>
                {validation.fileName || 'Active Dataset'}
              </h1>
              <StatusBadge
                status={validation.isSample ? 'ILLUSTRATIVE SAMPLE' : 'VALIDATED CSV'}
                variant={validation.isSample ? 'lime' : 'mint'}
              />
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
              <span className="font-tabular">{validation.rowCount.toLocaleString()}</span> verified rows &bull;{' '}
              <span className="font-tabular">{validation.columnCount}</span> columns &bull;{' '}
              Window: <span className="font-mono">{metrics.dateRange.start || 'N/A'}</span> to{' '}
              <span className="font-mono">{metrics.dateRange.end || 'N/A'}</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button className="btn btn-secondary" onClick={onLoadSampleData}>
            <Database size={14} />
            <span>Use Sample CSV</span>
          </button>
          <button className="btn btn-primary" onClick={onOpenUpload}>
            <Upload size={14} />
            <span>Upload New CSV</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <MetricCard
          label="Total Gross Revenue"
          value={`$${metrics.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
          formula="SUM(quantity * unit_price)"
          subtext={`Across ${metrics.totalUnitsSold.toLocaleString()} total units sold`}
          badge={{ text: 'Deterministic', variant: 'lime' }}
        />

        <MetricCard
          label="Total Orders"
          value={metrics.totalOrders.toLocaleString()}
          formula="COUNT(DISTINCT order_id)"
          subtext={`Average ${(metrics.totalUnitsSold / Math.max(1, metrics.totalOrders)).toFixed(1)} units / order`}
          badge={{ text: 'Exact Count', variant: 'mint' }}
        />

        <MetricCard
          label="Average Order Value"
          value={`$${metrics.averageOrderValue.toFixed(2)}`}
          formula="Total Revenue / Total Orders"
          subtext="Standard transaction basket benchmark"
        />

        <MetricCard
          label="Store Gross Margin"
          value={
            metrics.grossMarginPercent !== null && metrics.grossMarginPercent !== undefined
              ? `${metrics.grossMarginPercent.toFixed(1)}%`
              : ''
          }
          formula="(Revenue - Cost) / Revenue * 100"
          subtext={
            metrics.totalGrossProfit !== null && metrics.totalGrossProfit !== undefined
              ? `$${metrics.totalGrossProfit.toLocaleString()} gross profit`
              : undefined
          }
          isAvailable={metrics.hasGrossMargin}
          unavailableReason="Omitted: 'unit_cost' column not provided"
          badge={metrics.hasGrossMargin ? { text: 'Cost Tracked', variant: 'mint' } : undefined}
        />
      </div>

      {/* Interactive Charts Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '20px' }}>
        {/* Daily Revenue & Demand Chart */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={16} color="var(--color-bright-violet)" />
              <h2 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text-main)' }}>
                Daily Revenue Velocity
              </h2>
            </div>
            <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
              {dailyTrends.length} distinct days
            </span>
          </div>

          <div style={{ height: '260px', width: '100%', minHeight: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyTrends} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="limeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D8FF62" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#D8FF62" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#25302E" vertical={false} />
                <XAxis
                  dataKey="date"
                  stroke="#6E7973"
                  fontSize={10}
                  tickFormatter={(val) => val.slice(5)} // MM-DD
                />
                <YAxis stroke="#6E7973" fontSize={10} tickFormatter={(val) => `$${val}`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#161B1A',
                    borderColor: '#364543',
                    borderRadius: '8px',
                    color: '#F4F0E6',
                    fontSize: '12px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                  }}
                  formatter={(val: any, name: any) => [
                    name === 'revenue' ? `$${Number(val).toLocaleString()}` : `${val} units`,
                    name === 'revenue' ? 'Daily Revenue' : 'Units Sold',
                  ]}
                  labelFormatter={(lbl) => `Date: ${lbl}`}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#D8FF62"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#limeGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Contribution Chart */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <PieIcon size={16} color="var(--color-success-mint)" />
              <h2 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text-main)' }}>
                Category Revenue Distribution
              </h2>
            </div>
            <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
              {categoryTrends.length} categories
            </span>
          </div>

          <div style={{ height: '260px', width: '100%', minHeight: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryTrends} layout="vertical" margin={{ top: 10, right: 20, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#25302E" horizontal={false} />
                <XAxis type="number" stroke="#6E7973" fontSize={10} tickFormatter={(val) => `$${val}`} />
                <YAxis dataKey="category" type="category" stroke="#F4F0E6" fontSize={11} width={70} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#161B1A',
                    borderColor: '#364543',
                    borderRadius: '8px',
                    color: '#F4F0E6',
                    fontSize: '12px',
                  }}
                  formatter={(val: any) => [`$${Number(val).toLocaleString()}`, 'Revenue']}
                />
                <Bar dataKey="revenue" fill="#58D6B0" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Explainable Signals & Anomaly Preview */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={18} color="var(--color-alert-coral)" />
            <div>
              <h2 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-main)' }}>
                Detected Anomaly Signals
              </h2>
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                Deterministic rule engine signals requiring operational review
              </span>
            </div>
          </div>
          <button className="btn btn-ghost" onClick={() => onNavigate('insights')}>
            <span>View All ({findings.length})</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {topCriticalFindings.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            No critical anomalies detected in the current window.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {topCriticalFindings.slice(0, 3).map((finding) => (
              <div
                key={finding.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 16px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-surface-base)',
                  border: '1px solid var(--color-border-subtle)',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease',
                }}
                onClick={() => {
                  onSelectFinding(finding);
                  onNavigate('insights');
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <StatusBadge status={finding.type} />
                  <div>
                    <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-main)' }}>
                      {finding.title}
                    </h3>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                      Observed: <strong style={{ color: 'var(--color-text-main)' }}>{finding.observedValue}</strong> vs{' '}
                      Baseline: {finding.baselineValue} ({finding.delta})
                    </div>
                  </div>
                </div>

                <button
                  className="btn btn-secondary"
                  style={{ fontSize: '12px', padding: '6px 12px' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectFinding(finding);
                    onNavigate('insights');
                  }}
                >
                  <Lightbulb size={13} color="var(--color-bright-violet)" />
                  <span>Inspect & Explain</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
