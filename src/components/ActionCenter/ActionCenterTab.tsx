import React, { useState } from 'react';
import { ActionPlan, NavigationTab } from '../../types';
import { StatusBadge } from '../Common/StatusBadge';
import { ConfirmationModal } from '../Common/ConfirmationModal';
import {
  PlayCircle,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  Edit3,
  ExternalLink,
} from 'lucide-react';

interface ActionCenterTabProps {
  plans: ActionPlan[];
  onApprovePlan: (plan: ActionPlan) => void;
  onDismissPlan: (plan: ActionPlan, reason?: string) => void;
  onCompletePlan: (plan: ActionPlan) => void;
  onUpdatePlan: (updatedPlan: ActionPlan) => void;
  onNavigateToFinding: (findingId: string) => void;
  onNavigate: (tab: NavigationTab) => void;
}

export const ActionCenterTab: React.FC<ActionCenterTabProps> = ({
  plans,
  onApprovePlan,
  onDismissPlan,
  onCompletePlan,
  onUpdatePlan,
  onNavigateToFinding,
  onNavigate,
}) => {
  const [selectedPlanToApprove, setSelectedPlanToApprove] = useState<ActionPlan | null>(null);
  const [selectedPlanToDismiss, setSelectedPlanToDismiss] = useState<ActionPlan | null>(null);
  const [dismissReason, setDismissReason] = useState('');
  const [editingPlan, setEditingPlan] = useState<ActionPlan | null>(null);

  const activeDrafts = plans.filter((p) => p.status === 'draft');
  const approvedSimulations = plans.filter((p) => p.status === 'approved_simulation' || p.status === 'completed_simulation');
  const dismissedPlans = plans.filter((p) => p.status === 'dismissed');

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
            <PlayCircle size={20} color="var(--color-bright-violet)" />
            <h1 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text-main)' }}>
              Action Center: Human-Approved Simulation Sandbox
            </h1>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
            Review, calibrate, and simulate proposed operational decisions. All actions operate strictly within an
            isolated local demo simulation.
          </p>
        </div>

        <button className="btn btn-secondary" onClick={() => onNavigate('insights')}>
          <span>Inspect More Signals</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* Safety Notice Banner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '12px 16px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--color-surface-base)',
          border: '1px solid var(--color-border-subtle)',
          fontSize: '12px',
          color: 'var(--color-text-muted)',
        }}
      >
        <ShieldCheck size={18} color="var(--color-bright-violet)" style={{ flexShrink: 0 }} />
        <span>
          <strong style={{ color: 'var(--color-text-main)' }}>Explicit Human Control Guarantee:</strong> No operational
          decision is enacted automatically. Approving creates a local projected outcome simulation only. External
          supplier APIs, inventory ERPs, and bank accounts are never modified.
        </span>
      </div>

      {plans.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px', color: 'var(--color-text-muted)' }}>
          <p style={{ fontSize: '14px', marginBottom: '12px' }}>No action plans created yet.</p>
          <button className="btn btn-primary" onClick={() => onNavigate('insights')}>
            Go to Insights to Generate Action Plans
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Section: Pending Review & Drafts */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Clock size={16} color="var(--color-bright-violet)" />
              <h2 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text-main)' }}>
                Pending Operator Review ({activeDrafts.length})
              </h2>
            </div>

            {activeDrafts.length === 0 ? (
              <div
                style={{
                  padding: '20px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-surface-base)',
                  color: 'var(--color-text-muted)',
                  fontSize: '12px',
                }}
              >
                No pending drafts requiring review.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {activeDrafts.map((plan) => (
                  <div
                    key={plan.id}
                    className="card"
                    style={{
                      borderLeft: '4px solid var(--color-bright-violet)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '14px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <StatusBadge status={plan.actionType} />
                          <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text-main)' }}>
                            {plan.title}
                          </h3>
                        </div>
                        <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{plan.description}</p>
                        <div style={{ fontSize: '11px', color: 'var(--color-text-subtle)', marginTop: '4px' }}>
                          Target Entity: <span className="font-mono" style={{ color: 'var(--color-text-main)' }}>{plan.targetEntity}</span> &bull;{' '}
                          Linked Finding:{' '}
                          <button
                            className="btn btn-ghost"
                            style={{ padding: '0 4px', fontSize: '11px', color: 'var(--color-bright-violet)' }}
                            onClick={() => onNavigateToFinding(plan.findingId)}
                          >
                            {plan.findingTitle} <ExternalLink size={10} />
                          </button>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                          className="btn btn-secondary"
                          style={{ fontSize: '12px', padding: '6px 12px' }}
                          onClick={() => setEditingPlan(plan)}
                        >
                          <Edit3 size={13} />
                          <span>Edit</span>
                        </button>
                        <button
                          className="btn btn-ghost"
                          style={{ fontSize: '12px', padding: '6px 12px', color: 'var(--color-error)' }}
                          onClick={() => setSelectedPlanToDismiss(plan)}
                        >
                          <XCircle size={13} />
                          <span>Dismiss</span>
                        </button>
                        <button
                          className="btn btn-primary"
                          style={{ fontSize: '12px', padding: '6px 14px' }}
                          onClick={() => setSelectedPlanToApprove(plan)}
                        >
                          <PlayCircle size={14} />
                          <span>Approve Simulation</span>
                        </button>
                      </div>
                    </div>

                    {/* Projected Impact Comparison Box */}
                    {plan.projectedMetrics && plan.projectedMetrics.length > 0 && (
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                          gap: '10px',
                          padding: '12px',
                          borderRadius: 'var(--radius-md)',
                          backgroundColor: 'var(--color-surface-base)',
                          border: '1px solid var(--color-border-subtle)',
                        }}
                      >
                        {plan.projectedMetrics.map((pm, idx) => (
                          <div key={idx}>
                            <span style={{ fontSize: '11px', color: 'var(--color-text-subtle)' }}>{pm.metric}</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', marginTop: '2px' }}>
                              <span style={{ color: 'var(--color-text-muted)' }}>{pm.before}</span>
                              <ArrowRight size={12} color="var(--color-bright-violet)" />
                              <strong style={{ color: 'var(--color-success)' }}>{pm.after}</strong>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section: Active Approved Simulations */}
          {approvedSimulations.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <CheckCircle2 size={16} color="var(--color-success)" />
                <h2 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text-main)' }}>
                  Active Simulated Scenarios ({approvedSimulations.length})
                </h2>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {approvedSimulations.map((plan) => (
                  <div
                    key={plan.id}
                    className="card"
                    style={{
                      borderLeft: '4px solid var(--color-success)',
                      backgroundColor: 'var(--color-surface-base)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <StatusBadge status={plan.status} variant="mint" />
                          <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text-main)' }}>
                            {plan.title}
                          </h3>
                        </div>
                        <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{plan.description}</p>
                        <div style={{ fontSize: '11px', color: 'var(--color-success)', marginTop: '4px' }}>
                          {plan.simulationNotes}
                        </div>
                        <div style={{ fontSize: '10px', color: 'var(--color-text-subtle)', marginTop: '2px' }}>
                          Approved at: <span className="font-mono">{plan.approvedAt}</span>
                        </div>
                      </div>

                      {plan.status === 'approved_simulation' && (
                        <button
                          className="btn btn-secondary"
                          style={{ fontSize: '11px', padding: '6px 12px' }}
                          onClick={() => onCompletePlan(plan)}
                        >
                          <CheckCircle2 size={13} color="var(--color-success)" />
                          <span>Mark Simulation Complete</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: Dismissed Plans */}
          {dismissedPlans.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <XCircle size={16} color="var(--color-text-subtle)" />
                <h2 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-muted)' }}>
                  Dismissed Proposals ({dismissedPlans.length})
                </h2>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {dismissedPlans.map((plan) => (
                  <div
                    key={plan.id}
                    style={{
                      padding: '12px 16px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--color-surface-base)',
                      border: '1px solid var(--color-border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      opacity: 0.65,
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-muted)' }}>
                        {plan.title}
                      </span>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-subtle)' }}>
                        Reason: {plan.dismissReason || 'Dismissed by operator'}
                      </div>
                    </div>
                    <StatusBadge status="DISMISSED" variant="muted" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Approve Simulation Confirmation Modal */}
      {selectedPlanToApprove && (
        <ConfirmationModal
          isOpen={true}
          variant="primary"
          title="Approve Local Sandbox Simulation?"
          message={`You are approving: "${selectedPlanToApprove.title}". This executes an in-memory decision simulation in SignalForge AI. No external inventory, purchase orders, or banking systems are modified.`}
          confirmLabel="Execute Simulation"
          onConfirm={() => {
            onApprovePlan(selectedPlanToApprove);
            setSelectedPlanToApprove(null);
          }}
          onCancel={() => setSelectedPlanToApprove(null)}
        />
      )}

      {/* Dismiss Plan Modal */}
      {selectedPlanToDismiss && (
        <div
          className="modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedPlanToDismiss(null);
          }}
        >
          <div className="modal-dialog">
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--color-border-subtle)' }}>
              <h2 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-main)' }}>
                Dismiss Action Proposal
              </h2>
            </div>
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
                Please provide an optional reason for rejecting &quot;{selectedPlanToDismiss.title}&quot;:
              </p>
              <input
                type="text"
                placeholder="e.g., Supplier lead time exceeds runway, alternate promo planned..."
                value={dismissReason}
                onChange={(e) => setDismissReason(e.target.value)}
                style={{
                  padding: '10px 14px',
                  backgroundColor: 'var(--color-surface-base)',
                  border: '1px solid var(--color-border-strong)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--color-text-main)',
                  fontSize: '13px',
                  outline: 'none',
                }}
              />
            </div>
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
              <button className="btn btn-secondary" onClick={() => setSelectedPlanToDismiss(null)}>
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={() => {
                  onDismissPlan(selectedPlanToDismiss, dismissReason);
                  setSelectedPlanToDismiss(null);
                  setDismissReason('');
                }}
              >
                Dismiss Proposal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Plan Modal */}
      {editingPlan && (
        <div
          className="modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setEditingPlan(null);
          }}
        >
          <div className="modal-dialog">
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--color-border-subtle)' }}>
              <h2 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-main)' }}>
                Calibrate Action Parameters
              </h2>
            </div>
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '11px', color: 'var(--color-text-muted)', display: 'block', marginBottom: '6px' }}>
                  Action Title
                </label>
                <input
                  type="text"
                  value={editingPlan.title}
                  onChange={(e) => setEditingPlan({ ...editingPlan, title: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    backgroundColor: 'var(--color-surface-base)',
                    border: '1px solid var(--color-border-strong)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--color-text-main)',
                    fontSize: '13px',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', color: 'var(--color-text-muted)', display: 'block', marginBottom: '6px' }}>
                  Execution Description
                </label>
                <textarea
                  rows={3}
                  value={editingPlan.description}
                  onChange={(e) => setEditingPlan({ ...editingPlan, description: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    backgroundColor: 'var(--color-surface-base)',
                    border: '1px solid var(--color-border-strong)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--color-text-main)',
                    fontSize: '13px',
                    resize: 'vertical',
                  }}
                />
              </div>
            </div>
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
              <button className="btn btn-secondary" onClick={() => setEditingPlan(null)}>
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  onUpdatePlan(editingPlan);
                  setEditingPlan(null);
                }}
              >
                Save Calibration
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
