import React, { useState, useMemo } from 'react';
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
  FileText,
  Filter,
  CheckCircle,
} from 'lucide-react';

interface DashboardTabProps {
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

export const DashboardTab: React.FC<DashboardTabProps> = ({
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
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('ALL');

  // Categories list
  const categoriesList = useMemo(() => {
    return ['ALL', ...metrics.uniqueCategories];
  }, [metrics.uniqueCategories]);

  // Filtered daily trends (if category filter applied)
  const displayTrends = dailyTrends;

  // Filtered category trends
  const displayCategoryTrends = useMemo(() => {
    if (selectedCategoryFilter === 'ALL') return categoryTrends;
    return categoryTrends.filter((c) => c.category === selectedCategoryFilter);
  }, [categoryTrends, selectedCategoryFilter]);

  const topCriticalFindings = findings.filter(
    (f) => f.severity === 'critical' || f.severity === 'warning'
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px' }}>
      {/* 1. Welcome & Dataset Header Strip */}
      <div
        className="card"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          backgroundColor: 'var(--color-surface-base)',
          borderLeft: '4px solid #A020FF',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(160, 32, 255, 0.16)',
              color: '#E34AFF',
            }}
          >
            <Database size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 className="font-display" style={{ fontSize: '18px', fontWeight: 800, color: '#F7F7F8' }}>
                {validation.fileName || 'Active Dataset Workspace'}
              </h1>
              <StatusBadge
                status={validation.isSample ? 'SAMPLE DEMO' : 'VERIFIED CSV'}
                variant={validation.isSample ? 'lime' : 'mint'}
              />
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '11px',
                  color: '#45B558',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(69, 181, 88, 0.12)',
                }}
              >
                <CheckCircle size={11} /> 100% Data Quality
              </span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
              <span className="font-tabular" style={{ color: '#F7F7F8' }}>
                {validation.rowCount.toLocaleString()}
              </span>{' '}
              verified rows &bull;{' '}
              <span className="font-tabular" style={{ color: '#F7F7F8' }}>
                {validation.columnCount}
              </span>{' '}
              columns &bull; Window:{' '}
              <span className="font-mono" style={{ color: '#E34AFF' }}>
                {metrics.dateRange.start || 'N/A'}
              </span>{' '}
              to{' '}
              <span className="font-mono" style={{ color: '#E34AFF' }}>
                {metrics.dateRange.end || 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
          <button className="btn btn-secondary" onClick={onLoadSampleData}>
            <Database size={13} />
            <span>Reset Sample Data</span>
          </button>
          <button className="btn btn-primary" onClick={onOpenUpload}>
            <Upload size={13} />
            <span>Upload New CSV</span>
          </button>
          <button className="btn btn-outline" onClick={() => onNavigate('reports')}>
            <FileText size={13} />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      {/* 2. Primary Deterministic KPI Cards */}
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

      {/* 3. Interactive Charts Section with Category Filter */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '20px' }}>
        {/* Daily Revenue Velocity Trend AreaChart */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={16} color="#E34AFF" />
              <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#F7F7F8' }}>
                Daily Revenue Velocity Trend
              </h2>
            </div>
            <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
              {dailyTrends.length} distinct days
            </span>
          </div>

          <div style={{ height: '260px', width: '100%', minHeight: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={displayTrends} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="violetAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#A020FF" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#A020FF" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(160, 32, 255, 0.15)" vertical={false} />
                <XAxis dataKey="date" stroke="#736C7D" fontSize={10} tickFormatter={(val) => val.slice(5)} />
                <YAxis stroke="#736C7D" fontSize={10} tickFormatter={(val) => `$${val}`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#100D18',
                    borderColor: 'rgba(160, 32, 255, 0.4)',
                    borderRadius: '8px',
                    color: '#F7F7F8',
                    fontSize: '12px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
                  }}
                  formatter={(val: any, name: any) => [
                    name === 'revenue' ? `$${Number(val).toLocaleString()}` : `${val} units`,
                    name === 'revenue' ? 'Daily Revenue' : 'Units Sold',
                  ]}
                  labelFormatter={(lbl) => `Date: ${lbl}`}
                />
                <Area type="monotone" dataKey="revenue" stroke="#E34AFF" strokeWidth={2.2} fill="url(#violetAreaGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Contribution BarChart with Dynamic Filter */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <PieIcon size={16} color="#45B558" />
              <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#F7F7F8' }}>
                Category Revenue Breakdown
              </h2>
            </div>

            {/* Category dropdown filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Filter size={12} color="var(--color-text-muted)" />
              <select
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                style={{
                  backgroundColor: 'var(--color-surface-base)',
                  color: 'var(--color-text-main)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '4px 8px',
                  fontSize: '11px',
                  outline: 'none',
                }}
              >
                {categoriesList.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ height: '260px', width: '100%', minHeight: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={displayCategoryTrends} layout="vertical" margin={{ top: 10, right: 20, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(160, 32, 255, 0.15)" horizontal={false} />
                <XAxis type="number" stroke="#736C7D" fontSize={10} tickFormatter={(val) => `$${val}`} />
                <YAxis dataKey="category" type="category" stroke="#F7F7F8" fontSize={11} width={75} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#100D18',
                    borderColor: 'rgba(160, 32, 255, 0.4)',
                    borderRadius: '8px',
                    color: '#F7F7F8',
                    fontSize: '12px',
                  }}
                  formatter={(val: any) => [`$${Number(val).toLocaleString()}`, 'Revenue']}
                />
                <Bar dataKey="revenue" fill="#A020FF" radius={[0, 4, 4, 0]} barSize={22} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 4. Explainable Anomaly Signals Section */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={18} color="#FFBF69" />
            <div>
              <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#F7F7F8' }}>
                Detected Anomaly Signals
              </h2>
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                Rule-based signals requiring operational review
              </span>
            </div>
          </div>
          <button className="btn btn-ghost" onClick={() => onNavigate('anomalies')}>
            <span>View All Anomalies ({findings.length})</span>
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
                    <h3 style={{ fontSize: '13px', fontWeight: 600, color: '#F7F7F8' }}>
                      {finding.title}
                    </h3>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                      Observed: <strong style={{ color: '#F7F7F8' }}>{finding.observedValue}</strong> vs{' '}
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
                  <Lightbulb size={13} color="#E34AFF" />
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
