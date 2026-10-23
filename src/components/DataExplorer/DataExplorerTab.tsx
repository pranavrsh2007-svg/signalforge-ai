import React, { useState, useMemo, useEffect } from 'react';
import {
  DataRow,
  ValidationResult,
} from '../../types';
import {
  Upload,
  Database,
  Search,
  Filter,
  Download,
  Trash2,
  AlertCircle,
  CheckCircle2,
  RotateCw,
  X,
  FileText,
} from 'lucide-react';
import { StatusBadge } from '../Common/StatusBadge';
import { ConfirmationModal } from '../Common/ConfirmationModal';

interface DataExplorerTabProps {
  rows: DataRow[];
  validation: ValidationResult;
  onFileUpload: (file: File) => void;
  onLoadSample: () => Promise<{ success: boolean; rowCount: number; error?: string }>;
  onClearData: () => void;
  onExportCsv: (rowsToExport: DataRow[]) => void;
}

export const DataExplorerTab: React.FC<DataExplorerTabProps> = ({
  rows,
  validation,
  onFileUpload,
  onLoadSample,
  onClearData,
  onExportCsv,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [isDragOver, setIsDragOver] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [isLoadingSample, setIsLoadingSample] = useState(false);
  const [sampleNotification, setSampleNotification] = useState<{
    type: 'success' | 'error';
    message: string;
    rowCount?: number;
  } | null>(null);

  // Extract distinct categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    rows.forEach((r) => set.add(r.category));
    return ['ALL', ...Array.from(set).sort()];
  }, [rows]);

  // Reset category filter if it no longer exists in newly loaded dataset
  useEffect(() => {
    if (categoryFilter !== 'ALL' && !categories.includes(categoryFilter)) {
      setCategoryFilter('ALL');
    }
  }, [categories, categoryFilter]);

  // Click-to-data handler for loading verified sample
  const handleLoadSampleClick = async () => {
    setIsLoadingSample(true);
    setSampleNotification(null);
    try {
      const res = await onLoadSample();
      if (res && res.success) {
        setSearchQuery('');
        setCategoryFilter('ALL');
        setSampleNotification({
          type: 'success',
          message: `Successfully loaded and validated ${res.rowCount} rows & ${validation.columnCount || 8} columns from verified sample sales data.`,
          rowCount: res.rowCount,
        });
      } else {
        setSampleNotification({
          type: 'error',
          message: (res && res.error) || 'Failed to load sample dataset. File missing or malformed.',
        });
      }
    } catch (err: any) {
      setSampleNotification({
        type: 'error',
        message: err.message || 'An unexpected error occurred while loading sample data.',
      });
    } finally {
      setIsLoadingSample(false);
    }
  };

  // Filter rows
  const filteredRows = useMemo(() => {
    return rows.filter((r) => {
      if (categoryFilter !== 'ALL' && r.category !== categoryFilter) return false;
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        r.order_id.toLowerCase().includes(q) ||
        r.product.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        r.date.includes(q)
      );
    });
  }, [rows, categoryFilter, searchQuery]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px' }}>
      {/* Upload & Onboarding Dropzone */}
      <div
        className="card"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          border: isDragOver ? '2px dashed #E34AFF' : '2px dashed var(--color-border-strong)',
          backgroundColor: isDragOver ? 'var(--color-surface-hover)' : 'var(--color-surface-base)',
          textAlign: 'center',
          padding: '28px',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
        }}
        onClick={() => document.getElementById('csv-file-input')?.click()}
      >
        <input
          id="csv-file-input"
          type="file"
          accept=".csv,text/csv"
          style={{ display: 'none' }}
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              onFileUpload(e.target.files[0]);
            }
          }}
        />

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              padding: '12px',
              borderRadius: '50%',
              backgroundColor: 'rgba(160, 32, 255, 0.16)',
              color: '#E34AFF',
            }}
          >
            <Upload size={24} />
          </div>

          <h2 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-main)' }}>
            Drop Sales or Inventory CSV Here, or Click to Browse
          </h2>
          <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', maxWidth: '540px' }}>
            Supports standard sales CSVs (max 5 MB, up to 10,000 rows). Required columns:{' '}
            <code className="font-mono" style={{ color: '#E34AFF' }}>
              date, order_id, category, product, quantity, unit_price
            </code>
            . Optional:{' '}
            <code className="font-mono" style={{ color: '#45B558' }}>
              unit_cost, stock_on_hand
            </code>
            .
          </p>

          <div style={{ display: 'flex', gap: '12px', marginTop: '6px' }} onClick={(e) => e.stopPropagation()}>
            <button
              className="btn btn-secondary"
              onClick={handleLoadSampleClick}
              disabled={isLoadingSample}
              title="Load 26 verified rows of illustrative sample business data"
            >
              {isLoadingSample ? <RotateCw size={14} className="spin" /> : <Database size={14} />}
              <span>{isLoadingSample ? 'Loading Verified Sample...' : 'Load Verified Sample CSV'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sample Loading Feedback Banner */}
      {sampleNotification && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            backgroundColor:
              sampleNotification.type === 'success' ? 'var(--color-surface-raised)' : 'var(--color-error-dim)',
            border:
              sampleNotification.type === 'success'
                ? '1px solid var(--color-border-strong)'
                : '1px solid rgba(240, 59, 42, 0.4)',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {sampleNotification.type === 'success' ? (
              <CheckCircle2 size={18} color="var(--color-success)" style={{ flexShrink: 0 }} />
            ) : (
              <AlertCircle size={18} color="var(--color-error)" style={{ flexShrink: 0 }} />
            )}
            <span
              style={{
                fontSize: '12px',
                color: sampleNotification.type === 'success' ? 'var(--color-text-main)' : 'var(--color-error)',
                fontWeight: 500,
              }}
            >
              {sampleNotification.message}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {sampleNotification.type === 'error' && (
              <button
                className="btn btn-secondary"
                style={{ fontSize: '11px', padding: '4px 10px' }}
                onClick={handleLoadSampleClick}
                disabled={isLoadingSample}
              >
                <RotateCw size={12} className={isLoadingSample ? 'spin' : ''} />
                <span>Retry</span>
              </button>
            )}
            <button
              className="btn btn-ghost"
              style={{ padding: '4px' }}
              onClick={() => setSampleNotification(null)}
              aria-label="Dismiss notification"
            >
              <X size={14} color="var(--color-text-muted)" />
            </button>
          </div>
        </div>
      )}

      {/* Validation Status & Column Profiling Bar */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {validation.isValid ? (
              <CheckCircle2 size={18} color="var(--color-success)" />
            ) : (
              <AlertCircle size={18} color="var(--color-error)" />
            )}
            <h2 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text-main)' }}>
              Dataset Validation & Column Profiling
            </h2>
          </div>
          <span className="font-tabular" style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
            {validation.rowCount.toLocaleString()} valid rows / {validation.columnCount} recognized columns
          </span>
        </div>

        {/* Validation Errors or Warnings */}
        {validation.errors.length > 0 && (
          <div
            style={{
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-error-dim)',
              border: '1px solid rgba(240, 59, 42, 0.4)',
              color: 'var(--color-error)',
              fontSize: '12px',
              marginBottom: '16px',
            }}
          >
            <strong>CSV Schema Invalidation Detected:</strong>
            <ul style={{ paddingLeft: '18px', marginTop: '6px' }}>
              {validation.errors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        {validation.warnings.length > 0 && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(160, 32, 255, 0.12)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-main)',
              fontSize: '12px',
              marginBottom: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <StatusBadge status="INFO" variant="violet" />
              <span>{validation.warnings.join(' ')}</span>
            </div>
          </div>
        )}

        {/* Column profiles chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {validation.columns.map((col) => (
            <div
              key={col.name}
              style={{
                padding: '6px 10px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--color-surface-raised)',
                border: '1px solid var(--color-border-subtle)',
                fontSize: '11px',
              }}
            >
              <span className="font-mono" style={{ color: '#E34AFF' }}>
                {col.name}
              </span>{' '}
              <span style={{ color: 'var(--color-text-subtle)' }}>({col.inferredType})</span>
              <span style={{ marginLeft: '6px', color: 'var(--color-text-muted)' }}>
                {col.validCount} valid
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Explorer Table Controls */}
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
          {/* Search Box */}
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
              placeholder="Search product, order, date..."
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

          {/* Category Filter */}
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

          <span style={{ fontSize: '11px', color: 'var(--color-text-subtle)' }}>
            Showing <strong className="font-tabular" style={{ color: 'var(--color-text-main)' }}>{filteredRows.length}</strong> of{' '}
            {rows.length} rows
          </span>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            className="btn btn-secondary"
            onClick={() => onExportCsv(filteredRows)}
            title="Download visible filtered rows as CSV"
          >
            <Download size={14} />
            <span>Export CSV ({filteredRows.length})</span>
          </button>

          <button
            className="btn btn-outline"
            style={{ color: 'var(--color-error)', borderColor: 'rgba(240, 59, 42, 0.4)' }}
            onClick={() => setShowClearConfirm(true)}
            title="Clear active dataset from memory"
          >
            <Trash2 size={14} />
            <span>Clear Dataset</span>
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto', maxHeight: '520px' }}>
          <table className="editorial-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Order ID</th>
                <th>Category</th>
                <th>Product</th>
                <th style={{ textAlign: 'right' }}>Qty</th>
                <th style={{ textAlign: 'right' }}>Unit Price</th>
                <th style={{ textAlign: 'right' }}>Unit Cost</th>
                <th style={{ textAlign: 'right' }}>Stock on Hand</th>
                <th style={{ textAlign: 'right' }}>Calculated Revenue</th>
                <th style={{ textAlign: 'right' }}>Gross Profit</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={10} style={{ textAlign: 'center', padding: '32px', color: 'var(--color-text-muted)' }}>
                    No rows match active search/filter criteria.
                  </td>
                </tr>
              ) : (
                filteredRows.map((row, idx) => (
                  <tr key={`${row.order_id}-${row.product}-${idx}`}>
                    <td className="font-mono" style={{ whiteSpace: 'nowrap' }}>
                      {row.date}
                    </td>
                    <td className="font-mono" style={{ color: 'var(--color-bright-violet)' }}>
                      {row.order_id}
                    </td>
                    <td>
                      <span className="badge badge-muted">{row.category}</span>
                    </td>
                    <td style={{ fontWeight: 600 }}>{row.product}</td>
                    <td className="font-tabular" style={{ textAlign: 'right' }}>
                      {row.quantity}
                    </td>
                    <td className="font-tabular" style={{ textAlign: 'right' }}>
                      ${row.unit_price.toFixed(2)}
                    </td>
                    <td className="font-tabular" style={{ textAlign: 'right', color: 'var(--color-text-muted)' }}>
                      {row.unit_cost !== null && row.unit_cost !== undefined ? `$${row.unit_cost.toFixed(2)}` : '—'}
                    </td>
                    <td className="font-tabular" style={{ textAlign: 'right' }}>
                      {row.stock_on_hand !== null && row.stock_on_hand !== undefined ? (
                        <span style={{ color: row.stock_on_hand <= 25 ? 'var(--color-alert-coral)' : 'inherit' }}>
                          {row.stock_on_hand}
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="font-tabular" style={{ textAlign: 'right', fontWeight: 600, color: '#E34AFF' }}>
                      ${row.revenue.toFixed(2)}
                    </td>
                    <td className="font-tabular" style={{ textAlign: 'right', color: '#45B558' }}>
                      {row.profit !== null && row.profit !== undefined ? `$${row.profit.toFixed(2)}` : '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Clear Dataset Confirmation Modal */}
      <ConfirmationModal
        isOpen={showClearConfirm}
        variant="danger"
        title="Clear Current Dataset?"
        message="This will purge all loaded sales rows, derived metrics, active anomaly signals, and draft plans from memory. You can reload the sample dataset at any time."
        confirmLabel="Purge Dataset"
        onConfirm={() => {
          setShowClearConfirm(false);
          onClearData();
        }}
        onCancel={() => setShowClearConfirm(false)}
      />
    </div>
  );
};
