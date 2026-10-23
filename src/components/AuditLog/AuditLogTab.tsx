import React, { useState, useMemo } from 'react';
import { AuditLogEvent } from '../../types';
import { StatusBadge } from '../Common/StatusBadge';
import { ConfirmationModal } from '../Common/ConfirmationModal';
import {
  ScrollText,
  Search,
  Filter,
  Download,
  Trash2,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import {
  exportAuditLogToCsv,
  exportAuditLogToJson,
} from '../../lib/audit/auditLog';

interface AuditLogTabProps {
  events: AuditLogEvent[];
  onClearLog: () => void;
}

export const AuditLogTab: React.FC<AuditLogTabProps> = ({ events, onClearLog }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const categories = ['ALL', 'dataset', 'analytics', 'ai', 'action_simulation', 'export', 'reset'];

  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      if (categoryFilter !== 'ALL' && e.category !== categoryFilter) return false;
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        e.action.toLowerCase().includes(q) ||
        e.details.toLowerCase().includes(q) ||
        e.actor.toLowerCase().includes(q) ||
        e.id.toLowerCase().includes(q)
      );
    });
  }, [events, categoryFilter, searchQuery]);

  const handleDownloadCsv = () => {
    const csv = exportAuditLogToCsv(filteredEvents);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `signalforge_audit_log_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadJson = () => {
    const json = exportAuditLogToJson(filteredEvents);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `signalforge_audit_log_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px' }}>
      {/* Header */}
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
            <ScrollText size={20} color="var(--color-bright-violet)" />
            <h1 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text-main)' }}>
              Operational Audit Trail
            </h1>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
            Immutable chronological record of dataset changes, algorithmic anomaly flags, AI queries, and simulated decisions.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button className="btn btn-secondary" onClick={handleDownloadCsv}>
            <Download size={14} />
            <span>Export CSV</span>
          </button>
          <button className="btn btn-secondary" onClick={handleDownloadJson}>
            <Download size={14} />
            <span>Export JSON</span>
          </button>
          <button
            className="btn btn-outline"
            style={{ color: 'var(--color-error)', borderColor: 'rgba(240, 59, 42, 0.4)' }}
            onClick={() => setShowClearConfirm(true)}
          >
            <Trash2 size={14} />
            <span>Clear Log</span>
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
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 12px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-surface-base)',
              border: '1px solid var(--color-border-strong)',
              minWidth: '240px',
            }}
          >
            <Search size={14} color="var(--color-text-muted)" />
            <input
              type="text"
              placeholder="Search action, details, actor..."
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Filter size={14} color="var(--color-text-muted)" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              style={{
                backgroundColor: 'var(--color-surface-base)',
                color: 'var(--color-text-main)',
                border: '1px solid var(--color-border-strong)',
                borderRadius: 'var(--radius-md)',
                padding: '6px 10px',
                fontSize: '12px',
                outline: 'none',
              }}
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  Category: {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
          Showing <strong className="font-tabular" style={{ color: 'var(--color-text-main)' }}>{filteredEvents.length}</strong> of{' '}
          {events.length} events
        </span>
      </div>

      {/* Events List */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto', maxHeight: '560px' }}>
          <table className="editorial-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Category</th>
                <th>Action</th>
                <th>Actor</th>
                <th>Event Metadata & Operational Summary</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '32px', color: 'var(--color-text-muted)' }}>
                    No audit records matching query.
                  </td>
                </tr>
              ) : (
                filteredEvents.map((evt) => (
                  <tr key={evt.id}>
                    <td className="font-mono" style={{ whiteSpace: 'nowrap', fontSize: '11px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={12} color="var(--color-text-subtle)" />
                        {new Date(evt.timestamp).toLocaleString()}
                      </div>
                    </td>
                    <td>
                      <StatusBadge status={evt.category} />
                    </td>
                    <td style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>{evt.action}</td>
                    <td className="font-mono" style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                      {evt.actor}
                    </td>
                    <td style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                      {evt.details}
                      {evt.metadata && (
                        <span className="font-mono" style={{ marginLeft: '6px', color: 'var(--color-text-subtle)', fontSize: '10px' }}>
                          [{Object.keys(evt.metadata).join(', ')}]
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Clear Confirmation Modal */}
      <ConfirmationModal
        isOpen={showClearConfirm}
        variant="danger"
        title="Clear Local Audit Trail?"
        message="This will delete the local session audit log history stored in your browser storage. This action cannot be reversed."
        confirmLabel="Clear Audit Log"
        onConfirm={() => {
          setShowClearConfirm(false);
          onClearLog();
        }}
        onCancel={() => setShowClearConfirm(false)}
      />
    </div>
  );
};
