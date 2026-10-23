import React, { useEffect } from 'react';
import { X, ShieldCheck, Database, Cpu, CheckCircle2, AlertTriangle } from 'lucide-react';

interface MethodologyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MethodologyModal: React.FC<MethodologyModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className="modal-dialog" style={{ maxWidth: '780px' }}>
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--color-border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--color-surface-base)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldCheck size={20} color="#E34AFF" />
            <div>
              <h2 className="font-display" style={{ fontSize: '16px', fontWeight: 800, color: '#F7F7F8' }}>
                SignalForge Methodology & Transparency Disclosures
              </h2>
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                Deterministic Calculation Formulas, Anomaly Rules & AI Boundaries
              </span>
            </div>
          </div>
          <button className="btn btn-ghost" style={{ padding: '6px' }} onClick={onClose} aria-label="Close dialog">
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div
          style={{
            padding: '24px',
            overflowY: 'auto',
            maxHeight: 'calc(80vh - 120px)',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
          }}
        >
          {/* Section 1: Deterministic Metrics */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <Database size={16} color="#E34AFF" />
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#F7F7F8' }}>
                1. Deterministic Metrics (Source of Truth)
              </h3>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '12px' }}>
              All core KPIs are computed using strict mathematical formulas directly in the browser runtime. AI models
              are never permitted to invent, alter, or interpolate business metrics.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
              <div style={{ padding: '12px', background: 'var(--color-surface-base)', borderRadius: '6px' }}>
                <span className="font-mono" style={{ fontSize: '12px', color: '#E34AFF' }}>
                  Total Revenue
                </span>
                <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                  Sum of <code className="font-mono">quantity * unit_price</code> across all valid rows.
                </p>
              </div>
              <div style={{ padding: '12px', background: 'var(--color-surface-base)', borderRadius: '6px' }}>
                <span className="font-mono" style={{ fontSize: '12px', color: '#E34AFF' }}>
                  Order Count & AOV
                </span>
                <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                  Distinct <code className="font-mono">order_id</code> set. AOV = <code className="font-mono">Total Revenue / Distinct Orders</code>.
                </p>
              </div>
              <div style={{ padding: '12px', background: 'var(--color-surface-base)', borderRadius: '6px' }}>
                <span className="font-mono" style={{ fontSize: '12px', color: '#E34AFF' }}>
                  Gross Margin Policy
                </span>
                <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                  Calculated ONLY if <code className="font-mono">unit_cost</code> exists. Omitted otherwise; never fabricated.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Explainable Anomaly Detection */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <AlertTriangle size={16} color="#FFBF69" />
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#F7F7F8' }}>
                2. Explainable Anomaly Signals (Not Proof of Causation)
              </h3>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '10px' }}>
              Anomalies are detected via documented statistical heuristics. Every finding references explicit
              underlying rows, baselines, and delta ratios.
            </p>
            <ul style={{ paddingLeft: '18px', fontSize: '12px', color: 'var(--color-text-muted)', lineHeight: 1.8 }}>
              <li>
                <strong style={{ color: '#F7F7F8' }}>Demand Velocity Surge:</strong> Triggered when a product&apos;s
                recent half-window sales volume exceeds the first half by &gt; 40% with minimum 15 units sold.
              </li>
              <li>
                <strong style={{ color: '#F7F7F8' }}>Stockout Risk:</strong> Triggered when physical{' '}
                <code className="font-mono">stock_on_hand / daily_velocity &le; 7 days</code>, signaling rapid depletion.
              </li>
              <li>
                <strong style={{ color: '#F7F7F8' }}>Velocity Contraction:</strong> Flagged when second-half
                sales drop below 60% of baseline velocity for high-volume SKUs.
              </li>
              <li>
                <strong style={{ color: '#F7F7F8' }}>Sub-Benchmark Margin Spread:</strong> Flags categories whose
                gross margin trails the portfolio baseline by more than 8 percentage points.
              </li>
            </ul>
          </div>

          {/* Section 3: AI Security & Fallback Architecture */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <Cpu size={16} color="#E34AFF" />
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#F7F7F8' }}>
                3. Secure Server-Side AI & Honest Fallback
              </h3>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '10px' }}>
              SignalForge protects API secrets and small business data through architectural safeguards:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                <CheckCircle2 size={16} color="#45B558" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>
                  <strong>Server-Side Only Secrets:</strong> The <code className="font-mono">GEMINI_API_KEY</code> resides exclusively
                  in backend environment variables and is never exposed in client bundles.
                </span>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                <CheckCircle2 size={16} color="#45B558" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>
                  <strong>Minimal Necessary Aggregates:</strong> Only bounded statistical summaries (averages, deltas)
                  are sent to Gemini. Raw CSV rows, personal customer info, and order lists are never sent.
                </span>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                <CheckCircle2 size={16} color="#45B558" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>
                  <strong>Transparent Fallback:</strong> If Gemini is unconfigured, unreachable, or times out, the app
                  transparently activates the deterministic rule engine and labels it honestly.
                </span>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                <CheckCircle2 size={16} color="#45B558" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>
                  <strong>Sandbox Simulation Only:</strong> Approving an action plan creates an isolated in-memory
                  simulation. It does NOT claim to alter external inventory, orders, or bank accounts.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid var(--color-border-subtle)',
            display: 'flex',
            justifyContent: 'flex-end',
            backgroundColor: 'var(--color-surface-base)',
          }}
        >
          <button className="btn btn-primary" onClick={onClose}>
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
