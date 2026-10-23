import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Cpu,
  BarChart3,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  PlayCircle,
  Database,
  Layers,
  FileCheck,
} from 'lucide-react';
import { MetricSummary, NavigationTab } from '../../types';
import {
  AreaChart,
  Area,
  ResponsiveContainer,
} from 'recharts';

interface HomeTabProps {
  metrics: MetricSummary;
  onNavigate: (tab: NavigationTab) => void;
  onLoadSampleData: () => void;
}

const PREVIEW_CHART_DATA = [
  { date: 'Sep 01', revenue: 90 },
  { date: 'Sep 03', revenue: 145 },
  { date: 'Sep 05', revenue: 180 },
  { date: 'Sep 07', revenue: 160 },
  { date: 'Sep 09', revenue: 210 },
  { date: 'Sep 11', revenue: 290 },
  { date: 'Sep 13', revenue: 340 },
  { date: 'Sep 15', revenue: 395 },
];

export const HomeTab: React.FC<HomeTabProps> = ({
  metrics,
  onNavigate,
  onLoadSampleData,
}) => {
  const [videoError, setVideoError] = useState(false);

  const scrollToHowItWorks = () => {
    const el = document.getElementById('how-it-works-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', overflowX: 'hidden' }}>
      {/* 1. COSMIC HERO SECTION */}
      <section
        style={{
          position: 'relative',
          minHeight: '88vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          padding: '60px 24px 80px',
          overflow: 'hidden',
        }}
        className="bg-cosmic-stars"
      >
        {/* Background Glowing Planetary Arc / Video */}
        {!videoError ? (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              overflow: 'hidden',
              zIndex: 0,
              pointerEvents: 'none',
              opacity: 0.45,
            }}
          >
            <video
              className="cosmic-hero-video"
              autoPlay
              muted
              loop
              playsInline
              onError={() => setVideoError(true)}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'hue-rotate(260deg) contrast(1.2)',
              }}
            >
              <source
                src="https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/e859f229-8ebd-43fb-a5a0-58006ba75327.mp4"
                type="video/mp4"
              />
            </video>
          </div>
        ) : null}

        {/* CSS Atmospheric Planetary Arc Fallback */}
        <div className="planetary-arc" />
        <div className="planetary-rim-line" />

        {/* Content Container */}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            maxWidth: '920px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px',
            marginTop: '20px',
          }}
        >
          {/* Eyebrow Pill */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              borderRadius: '30px',
              backgroundColor: 'rgba(160, 32, 255, 0.16)',
              border: '1px solid rgba(160, 32, 255, 0.4)',
              boxShadow: '0 0 16px rgba(160, 32, 255, 0.25)',
            }}
          >
            <Sparkles size={14} color="#E34AFF" />
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.12em',
                color: '#E34AFF',
                textTransform: 'uppercase',
              }}
            >
              INTELLIGENCE FOR YOUR BUSINESS DATA
            </span>
          </div>

          {/* Bold Hero Headline */}
          <h1
            className="font-display"
            style={{
              fontSize: 'clamp(32px, 5.5vw, 62px)',
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              color: '#F7F7F8',
            }}
          >
            Turn raw data into <br />
            <span className="text-gradient-violet">decisions that move you forward.</span>
          </h1>

          {/* Description */}
          <p
            style={{
              fontSize: 'clamp(14px, 1.8vw, 17px)',
              lineHeight: 1.6,
              color: 'var(--color-text-muted)',
              maxWidth: '680px',
            }}
          >
            Upload your business data, uncover hidden patterns, investigate anomalies, and turn complex numbers into
            clear, evidence-backed next steps with human-approved simulations.
          </p>

          {/* CTA Buttons */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '14px',
              marginTop: '10px',
            }}
          >
            <button
              className="btn btn-primary"
              style={{ padding: '12px 28px', fontSize: '15px' }}
              onClick={() => onNavigate('dashboard')}
            >
              <span>Explore Dashboard</span>
              <ArrowRight size={16} />
            </button>

            <button
              className="btn btn-secondary"
              style={{ padding: '12px 24px', fontSize: '15px' }}
              onClick={scrollToHowItWorks}
            >
              <span>See How It Works</span>
            </button>
          </div>

          {/* Supporting Trust Indicators */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '24px',
              marginTop: '16px',
              fontSize: '12px',
              color: 'var(--color-text-muted)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={15} color="#45B558" />
              <span>Evidence-backed insights</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={15} color="#45B558" />
              <span>Transparent calculations</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={15} color="#45B558" />
              <span>Human-approved actions</span>
            </div>
          </div>
        </div>

        {/* 2. RISING HERO DASHBOARD PREVIEW */}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            width: '100%',
            maxWidth: '1060px',
            marginTop: '50px',
          }}
        >
          <div
            className="glass-panel"
            style={{
              padding: '24px',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid rgba(160, 32, 255, 0.35)',
              boxShadow: '0 24px 60px rgba(5, 4, 7, 0.9), 0 0 40px rgba(160, 32, 255, 0.2)',
            }}
          >
            {/* Header strip */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '16px',
                borderBottom: '1px solid var(--color-border-subtle)',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: '#45B558',
                    boxShadow: '0 0 8px #45B558',
                  }}
                />
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#F7F7F8' }}>
                  Live SignalForge Analytics Engine
                </span>
                <span className="badge badge-violet" style={{ fontSize: '10px' }}>
                  Demo Mode: Active
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  className="btn btn-secondary"
                  style={{ fontSize: '11px', padding: '5px 12px' }}
                  onClick={onLoadSampleData}
                >
                  <Database size={12} />
                  <span>Reload Sample Data</span>
                </button>
                <button
                  className="btn btn-primary"
                  style={{ fontSize: '11px', padding: '5px 12px' }}
                  onClick={() => onNavigate('dashboard')}
                >
                  <span>Open Full View</span>
                  <ArrowRight size={12} />
                </button>
              </div>
            </div>

            {/* Preview KPI row */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                margin: '20px 0',
              }}
            >
              <div style={{ padding: '14px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-surface-base)' }}>
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                  Total Revenue
                </span>
                <div className="font-tabular" style={{ fontSize: '24px', fontWeight: 800, color: '#F7F7F8', marginTop: '4px' }}>
                  ${metrics.totalRevenue > 0 ? metrics.totalRevenue.toLocaleString() : '1,061.00'}
                </div>
                <span style={{ fontSize: '10px', color: '#45B558' }}>Deterministic SUM(qty * price)</span>
              </div>

              <div style={{ padding: '14px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-surface-base)' }}>
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                  Orders Analyzed
                </span>
                <div className="font-tabular" style={{ fontSize: '24px', fontWeight: 800, color: '#F7F7F8', marginTop: '4px' }}>
                  {metrics.totalOrders > 0 ? metrics.totalOrders : '26'}
                </div>
                <span style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>Distinct order transactions</span>
              </div>

              <div style={{ padding: '14px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-surface-base)' }}>
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                  Average Order Value
                </span>
                <div className="font-tabular" style={{ fontSize: '24px', fontWeight: 800, color: '#F7F7F8', marginTop: '4px' }}>
                  ${metrics.averageOrderValue > 0 ? metrics.averageOrderValue.toFixed(2) : '40.81'}
                </div>
                <span style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>Standard transaction basket</span>
              </div>

              <div style={{ padding: '14px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-surface-base)' }}>
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                  Store Gross Margin
                </span>
                <div className="font-tabular" style={{ fontSize: '24px', fontWeight: 800, color: '#E34AFF', marginTop: '4px' }}>
                  {metrics.grossMarginPercent !== null && metrics.grossMarginPercent !== undefined
                    ? `${metrics.grossMarginPercent.toFixed(1)}%`
                    : '53.6%'}
                </div>
                <span style={{ fontSize: '10px', color: '#E34AFF' }}>Cost tracking active</span>
              </div>
            </div>

            {/* Mini Trend Chart & Anomaly Callout */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '16px',
              }}
            >
              <div
                style={{
                  height: '180px',
                  backgroundColor: 'var(--color-surface-base)',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#F7F7F8' }}>
                    Revenue Velocity Trend
                  </span>
                  <span style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>Observation Window</span>
                </div>
                <ResponsiveContainer width="100%" height={130}>
                  <AreaChart data={PREVIEW_CHART_DATA}>
                    <defs>
                      <linearGradient id="violetPreviewGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#A020FF" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#A020FF" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="revenue" stroke="#E34AFF" strokeWidth={2} fill="url(#violetPreviewGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-surface-base)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AlertTriangle size={15} color="#FFBF69" />
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#FFBF69' }}>
                      Impending Stockout Risk Flagged
                    </span>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '6px', lineHeight: 1.5 }}>
                    Desk Lamp and Water Bottle inventory runways have compressed below 7 safe business days under active
                    sales velocity.
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px' }}>
                  <span style={{ fontSize: '11px', color: '#E34AFF' }}>Gemini Recommendation Ready</span>
                  <button
                    className="btn btn-secondary"
                    style={{ fontSize: '11px', padding: '4px 10px' }}
                    onClick={() => onNavigate('anomalies')}
                  >
                    Inspect Signal
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS (4-STEP WORKFLOW) */}
      <section
        id="how-it-works-section"
        style={{
          padding: '80px 24px',
          backgroundColor: 'var(--color-surface-base)',
          borderTop: '1px solid var(--color-border-subtle)',
          borderBottom: '1px solid var(--color-border-subtle)',
        }}
      >
        <div style={{ maxWidth: '1060px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.12em',
                color: '#E34AFF',
                textTransform: 'uppercase',
              }}
            >
              TRANSPARENT 4-STEP PIPELINE
            </span>
            <h2
              className="font-display"
              style={{ fontSize: '32px', fontWeight: 800, color: '#F7F7F8', marginTop: '8px' }}
            >
              How SignalForge AI Operates
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginTop: '8px', maxWidth: '560px', margin: '8px auto 0' }}>
              From untrusted raw CSV files to verifiable business decisions, every step is mathematically deterministic
              and guarded by human review.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
              gap: '20px',
            }}
          >
            {/* Step 1 */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(160, 32, 255, 0.16)',
                  color: '#E34AFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                }}
              >
                1
              </div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#F7F7F8' }}>Ingest & Sanitize</h3>
              <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                Enforces 5 MB and 10,000-row bounds. Neutralizes spreadsheet formula injection threats (<code className="font-mono">=, +, -, @</code>)
                before processing.
              </p>
            </div>

            {/* Step 2 */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(160, 32, 255, 0.16)',
                  color: '#E34AFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                }}
              >
                2
              </div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#F7F7F8' }}>Deterministic KPIs</h3>
              <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                Calculates Revenue, Order volume, AOV, and Gross Margin with strict arithmetic formulas. Zero AI
                hallucination of numeric values.
              </p>
            </div>

            {/* Step 3 */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(160, 32, 255, 0.16)',
                  color: '#E34AFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                }}
              >
                3
              </div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#F7F7F8' }}>Detect Anomaly Signals</h3>
              <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                Detects stockout depletion runways, sales velocity surges, and margin spread anomalies grounded in
                underlying row baselines.
              </p>
            </div>

            {/* Step 4 */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(160, 32, 255, 0.16)',
                  color: '#E34AFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                }}
              >
                4
              </div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#F7F7F8' }}>AI Context & Simulation</h3>
              <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                Gemini explains causes and suggests actions. Approvals execute solely within a safe local simulation sandbox
                with zero external side effects.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CORE FEATURES SECTION */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: '1060px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.12em',
                color: '#E34AFF',
                textTransform: 'uppercase',
              }}
            >
              PROFESSIONAL DATA PLATFORM
            </span>
            <h2
              className="font-display"
              style={{ fontSize: '32px', fontWeight: 800, color: '#F7F7F8', marginTop: '8px' }}
            >
              Engineered for Confident Operations
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '24px',
            }}
          >
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <Cpu size={20} color="#E34AFF" />
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#F7F7F8' }}>
                  Server-Side Gemini Intelligence
                </h3>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                Gemini 2.5 Flash runs via a secure backend API endpoint. Secrets are never bundled in the frontend. Only
                minimal necessary aggregates are transmitted, avoiding data leaks.
              </p>
            </div>

            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <TrendingUp size={20} color="#45B558" />
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#F7F7F8' }}>
                  Interactive Trend Visualizations
                </h3>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                Responsive Area and Bar charts render dynamic daily velocity, order frequency, and category revenue
                splits. Filterable on the fly with instantaneous re-computation.
              </p>
            </div>

            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <PlayCircle size={20} color="#FFBF69" />
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#F7F7F8' }}>
                  Guarded Action Sandbox
                </h3>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                Review restock requisitions and margin calibrations before simulating outcomes. Every decision requires
                human approval and writes to an immutable chronological audit trail.
              </p>
            </div>

            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <ShieldCheck size={20} color="#E34AFF" />
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#F7F7F8' }}>
                  Transparent Fallback Guarantee
                </h3>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                If the Gemini API key is unconfigured or a network timeout occurs, SignalForge automatically activates
                its deterministic heuristic rule engine—truthful, honest, and uncompromised.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FINAL CTA BANNER */}
      <section
        style={{
          padding: '80px 24px',
          backgroundColor: 'var(--color-surface-base)',
          textAlign: 'center',
          borderTop: '1px solid var(--color-border-subtle)',
          position: 'relative',
        }}
      >
        <div style={{ maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '18px', alignItems: 'center' }}>
          <h2 className="font-display" style={{ fontSize: '30px', fontWeight: 800, color: '#F7F7F8' }}>
            Ready to turn complex data into decisions you trust?
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
            Launch the SignalForge AI analytics workspace now. Load the verified sample dataset or drag and drop your
            sales CSV in seconds.
          </p>
          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <button
              className="btn btn-primary"
              style={{ padding: '12px 28px', fontSize: '15px' }}
              onClick={() => onNavigate('dashboard')}
            >
              <span>Launch Analytics Workspace</span>
              <ArrowRight size={16} />
            </button>
            <button
              className="btn btn-secondary"
              style={{ padding: '12px 20px', fontSize: '15px' }}
              onClick={() => onNavigate('data-explorer')}
            >
              <span>Upload CSV File</span>
            </button>
          </div>
        </div>
      </section>

      {/* 6. COMPREHENSIVE FOOTER */}
      <footer
        style={{
          padding: '40px 24px',
          backgroundColor: 'var(--color-canvas)',
          borderTop: '1px solid var(--color-border-subtle)',
          fontSize: '12px',
          color: 'var(--color-text-subtle)',
        }}
      >
        <div
          style={{
            maxWidth: '1060px',
            margin: '0 auto',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '20px',
          }}
        >
          <div>
            <span style={{ fontWeight: 700, color: '#F7F7F8' }}>SignalForge AI</span> &bull; Cosmic Data Operations
            <div style={{ marginTop: '4px' }}>
              Built with React, Vite, TypeScript, Recharts, and Google Gemini 2.5 Flash.
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
            <button className="btn btn-ghost" style={{ padding: 0 }} onClick={() => onNavigate('dashboard')}>
              Dashboard
            </button>
            <button className="btn btn-ghost" style={{ padding: 0 }} onClick={() => onNavigate('data-explorer')}>
              Data Explorer
            </button>
            <button className="btn btn-ghost" style={{ padding: 0 }} onClick={() => onNavigate('insights')}>
              AI Insights
            </button>
            <button className="btn btn-ghost" style={{ padding: 0 }} onClick={() => onNavigate('anomalies')}>
              Anomalies
            </button>
            <button className="btn btn-ghost" style={{ padding: 0 }} onClick={() => onNavigate('reports')}>
              Reports
            </button>
            <button className="btn btn-ghost" style={{ padding: 0 }} onClick={() => onNavigate('action-center')}>
              Action Center
            </button>
            <button className="btn btn-ghost" style={{ padding: 0 }} onClick={() => onNavigate('profile')}>
              Profile
            </button>
            <button className="btn btn-ghost" style={{ padding: 0 }} onClick={() => onNavigate('settings')}>
              Settings
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
