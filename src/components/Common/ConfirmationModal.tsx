import React, { useEffect } from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'lime' | 'primary';
  isPending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm Action',
  cancelLabel = 'Cancel',
  variant = 'primary',
  isPending = false,
  onConfirm,
  onCancel,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isPending) {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isPending, onCancel]);

  if (!isOpen) return null;

  const btnClass = variant === 'danger' ? 'btn-coral' : variant === 'lime' ? 'btn-primary' : 'btn-primary';

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isPending) onCancel();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className="modal-dialog">
        {/* Modal Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--color-border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {variant === 'danger' && <AlertTriangle size={18} color="var(--color-alert-coral)" />}
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text-main)' }}>{title}</h2>
          </div>
          <button
            className="btn btn-ghost"
            style={{ padding: '6px', minWidth: 'auto' }}
            onClick={onCancel}
            disabled={isPending}
            aria-label="Close dialog"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px', color: 'var(--color-text-muted)', fontSize: '13px', lineHeight: 1.6 }}>
          {message}
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid var(--color-border-subtle)',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
            backgroundColor: 'var(--color-surface-base)',
          }}
        >
          <button className="btn btn-secondary" onClick={onCancel} disabled={isPending}>
            {cancelLabel}
          </button>
          <button className={`btn ${btnClass}`} onClick={onConfirm} disabled={isPending}>
            {isPending ? 'Processing...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
