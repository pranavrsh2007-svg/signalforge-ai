import React, { useState } from 'react';
import { AIProviderStatus } from '../../lib/ai/client';
import { ConfirmationModal } from '../Common/ConfirmationModal';
import {
  Settings,
  Shield,
  RotateCcw,
  Trash2,
  Cpu,
  Info,
  CheckCircle2,
} from 'lucide-react';

interface SettingsTabProps {
  providerStatus: AIProviderStatus;
  onClearDataset: () => void;
  onResetDemo: () => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  providerStatus,
  onClearDataset,
  onResetDemo,
}) => {
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px', maxWidth: '880px' }}>
      {/* Title */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Settings size={20} color="var(--color-bright-violet)" />
          <h1 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text-main)' }}>
            Settings, Data Privacy & AI Disclosures
          </h1>
        </div>
        <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
          Inspect runtime provider status, security posture, privacy guarantees, and control environment lifecycle.
        </p>
      </div>

      {/* AI Provider Status Card */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <Cpu size={18} color="var(--color-bright-violet)" />
          <h2 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text-main)' }}>
            Google Gemini Provider Status
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', backgroundColor: 'var(--color-surface-base)', borderRadius: '6px' }}>
            <span style={{ color: 'var(--color-text-muted)' }}>Provider Backend:</span>
            <strong style={{ color: 'var(--color-text-main)' }}>{providerStatus.provider}</strong>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', backgroundColor: 'var(--color-surface-base)', borderRadius: '6px' }}>
            <span style={{ color: 'var(--color-text-muted)' }}>Active Model:</span>
            <strong className="font-mono" style={{ color: 'var(--color-bright-violet)' }}>{providerStatus.model}</strong>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', backgroundColor: 'var(--color-surface-base)', borderRadius: '6px' }}>
            <span style={{ color: 'var(--color-text-muted)' }}>Configuration Status:</span>
            <span style={{ fontWeight: 600, color: providerStatus.configured ? 'var(--color-success)' : 'var(--color-error)' }}>
              {providerStatus.configured ? 'Configured & Verified' : 'Unconfigured (Deterministic Fallback Engaged)'}
            </span>
          </div>

          <div style={{ fontSize: '12px', color: 'var(--color-text-subtle)', marginTop: '4px' }}>
            {providerStatus.message}
          </div>
        </div>
      </div>

      {/* Data Handling & Privacy Safeguards */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <Shield size={18} color="var(--color-success)" />
          <h2 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text-main)' }}>
            Data Privacy & Security Safeguards
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px', color: 'var(--color-text-muted)' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <CheckCircle2 size={16} color="var(--color-success)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>
              <strong>Ephemeral In-Memory Processing:</strong> Uploaded CSV rows are parsed directly in the local browser
              session. Raw transactions are never persisted to a remote cloud database.
            </span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <CheckCircle2 size={16} color="var(--color-success)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>
              <strong>Zero Secret Exposure:</strong> Frontend code does NOT bundle or access API secrets. All AI
              queries pass through the backend proxy route with server-side environment isolation.
            </span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <CheckCircle2 size={16} color="var(--color-success)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>
              <strong>Cell Formula Sanitization:</strong> Injected formula characters (<code className="font-mono">=, +, -, @</code>)
              are neutralized during ingest to prevent CSV command injection vulnerabilities.
            </span>
          </div>
        </div>
      </div>

      {/* Environment Reset & Data Management */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <Info size={18} color="var(--color-warning)" />
          <h2 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text-main)' }}>
            Dataset & Demo Lifecycle Management
          </h2>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px' }}>
          <button
            className="btn btn-secondary"
            onClick={() => setShowResetConfirm(true)}
            style={{ padding: '10px 18px' }}
          >
            <RotateCcw size={16} />
            <span>Reset Demo to Clean Sample State</span>
          </button>

          <button
            className="btn btn-outline"
            style={{ color: 'var(--color-error)', borderColor: 'rgba(240, 59, 42, 0.4)', padding: '10px 18px' }}
            onClick={() => setShowClearConfirm(true)}
          >
            <Trash2 size={16} />
            <span>Purge Current Dataset</span>
          </button>
        </div>
      </div>

      {/* Confirmations */}
      <ConfirmationModal
        isOpen={showResetConfirm}
        variant="primary"
        title="Reset Demo Environment?"
        message="This will reload the verified public sales sample dataset, re-calculate all deterministic metrics, regenerate explainable anomaly signals, and initialize fresh demo draft proposals."
        confirmLabel="Reset Demo"
        onConfirm={() => {
          setShowResetConfirm(false);
          onResetDemo();
        }}
        onCancel={() => setShowResetConfirm(false)}
      />

      <ConfirmationModal
        isOpen={showClearConfirm}
        variant="danger"
        title="Purge Active Dataset?"
        message="This will wipe all active dataset records from memory. You will need to upload a CSV or reload sample data to use analytics."
        confirmLabel="Purge Dataset"
        onConfirm={() => {
          setShowClearConfirm(false);
          onClearDataset();
        }}
        onCancel={() => setShowClearConfirm(false)}
      />
    </div>
  );
};
