import React from 'react';

interface StatusBadgeProps {
  status: string;
  variant?: 'lime' | 'coral' | 'mint' | 'muted' | 'violet';
  label?: string;
  icon?: React.ReactNode;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  variant,
  label,
  icon,
}) => {
  // Determine variant if not explicitly provided
  let computedVariant: 'lime' | 'coral' | 'mint' | 'muted' | 'violet' = variant || 'muted';

  const lower = (status || '').toLowerCase();
  if (!variant) {
    if (['critical', 'danger', 'error', 'failed', 'stockout_risk'].includes(lower)) {
      computedVariant = 'coral';
    } else if (['approved_simulation', 'completed_simulation', 'success', 'valid'].includes(lower)) {
      computedVariant = 'mint';
    } else if (['active', 'surge', 'configured', 'draft'].includes(lower)) {
      computedVariant = 'violet';
    } else {
      computedVariant = 'muted';
    }
  }

  const displayText = label || status.replace(/_/g, ' ');

  return (
    <span className={`badge badge-${computedVariant}`}>
      {icon && <span style={{ display: 'inline-flex' }}>{icon}</span>}
      {displayText}
    </span>
  );
};
