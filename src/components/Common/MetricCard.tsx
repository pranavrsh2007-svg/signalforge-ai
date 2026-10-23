import React from 'react';
import { HelpCircle } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  formula: string;
  subtext?: string;
  badge?: {
    text: string;
    variant: 'lime' | 'coral' | 'mint' | 'muted';
  };
  isAvailable?: boolean;
  unavailableReason?: string;
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  formula,
  subtext,
  badge,
  isAvailable = true,
  unavailableReason,
  onClick,
}) => {
  return (
    <div
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: onClick ? 'pointer' : 'default',
        position: 'relative',
        opacity: isAvailable ? 1 : 0.65,
      }}
      onClick={onClick}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div>
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {label}
          </span>
          <div style={{ fontSize: '11px', color: 'var(--color-text-subtle)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span title={`Formula: ${formula}`} style={{ cursor: 'help', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
              <HelpCircle size={11} /> {formula}
            </span>
          </div>
        </div>

        {badge && (
          <span className={`badge badge-${badge.variant}`} style={{ fontSize: '10px' }}>
            {badge.text}
          </span>
        )}
      </div>

      <div>
        {isAvailable ? (
          <div className="font-tabular" style={{ fontSize: '28px', fontWeight: 700, color: 'var(--color-text-main)', letterSpacing: '-0.02em' }}>
            {value}
          </div>
        ) : (
          <div>
            <div className="font-mono" style={{ fontSize: '20px', fontWeight: 600, color: 'var(--color-text-muted)' }}>
              N/A (Omitted)
            </div>
            <div style={{ fontSize: '11px', color: 'var(--color-alert-coral)', marginTop: '4px' }}>
              {unavailableReason || 'Requires optional column in dataset'}
            </div>
          </div>
        )}

        {subtext && isAvailable && (
          <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '6px' }}>
            {subtext}
          </div>
        )}
      </div>
    </div>
  );
};
