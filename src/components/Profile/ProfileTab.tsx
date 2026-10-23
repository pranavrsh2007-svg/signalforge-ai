import React, { useState, useEffect } from 'react';
import { UserProfile, NavigationTab } from '../../types';
import {
  User,
  Shield,
  Palette,
  Eye,
  Save,
  RotateCcw,
  CheckCircle2,
  Info,
} from 'lucide-react';

interface ProfileTabProps {
  userProfile: UserProfile;
  onSaveProfile: (updatedProfile: UserProfile) => void;
  onResetProfile: () => void;
  onNavigate: (tab: NavigationTab) => void;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({
  userProfile,
  onSaveProfile,
  onResetProfile,
  onNavigate,
}) => {
  const [formData, setFormData] = useState<UserProfile>(userProfile);
  const [showSavedFeedback, setShowSavedFeedback] = useState(false);

  useEffect(() => {
    setFormData(userProfile);
  }, [userProfile]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formData);
    setShowSavedFeedback(true);
    setTimeout(() => setShowSavedFeedback(false), 2500);
  };

  const handleCancel = () => {
    setFormData(userProfile);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px', maxWidth: '860px' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <User size={20} color="#E34AFF" />
          <h1 className="font-display" style={{ fontSize: '18px', fontWeight: 800, color: '#F7F7F8' }}>
            Operator Profile & Local Preferences
          </h1>
        </div>
        <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
          Manage your operator identity, display settings, and local session preferences.
        </p>
      </div>

      {/* Honest Local Demo Notice */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '12px 16px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--color-surface-base)',
          border: '1px solid var(--color-border)',
          fontSize: '12px',
          color: 'var(--color-text-muted)',
        }}
      >
        <Info size={16} color="#E34AFF" style={{ flexShrink: 0 }} />
        <span>
          <strong style={{ color: '#F7F7F8' }}>Local Demo Profile:</strong> This environment operates in local
          demonstration mode. Preferences are stored safely in browser local storage and are never uploaded to a remote
          user registry or cloud CRM.
        </span>
      </div>

      {showSavedFeedback && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'rgba(69, 181, 88, 0.15)',
            border: '1px solid rgba(69, 181, 88, 0.4)',
            color: '#45B558',
            fontSize: '13px',
          }}
        >
          <CheckCircle2 size={16} />
          <span>Profile and display preferences successfully saved to local storage!</span>
        </div>
      )}

      {/* Profile Form Card */}
      <form onSubmit={handleSave} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Avatar & Display Name Banner */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px', paddingBottom: '20px', borderBottom: '1px solid var(--color-border-subtle)' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #A020FF 0%, #7A1CF8 100%)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px',
              fontWeight: 800,
              boxShadow: '0 0 20px rgba(160, 32, 255, 0.4)',
            }}
          >
            {formData.avatarInitials}
          </div>

          <div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: '#F7F7F8' }}>{formData.displayName}</div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{formData.role} &bull; {formData.email}</div>
            <span className="badge badge-violet" style={{ fontSize: '10px', marginTop: '6px' }}>
              Local Operator Session
            </span>
          </div>
        </div>

        {/* Identity Inputs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '11px', color: 'var(--color-text-muted)', display: 'block', marginBottom: '6px' }}>
              Display Name
            </label>
            <input
              type="text"
              value={formData.displayName}
              onChange={(e) => {
                const name = e.target.value;
                const initials = name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2) || 'OP';
                setFormData({ ...formData, displayName: name, avatarInitials: initials });
              }}
              style={{
                width: '100%',
                padding: '8px 12px',
                backgroundColor: 'var(--color-surface-base)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--color-text-main)',
                fontSize: '13px',
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '11px', color: 'var(--color-text-muted)', display: 'block', marginBottom: '6px' }}>
              Operator Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              style={{
                width: '100%',
                padding: '8px 12px',
                backgroundColor: 'var(--color-surface-base)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--color-text-main)',
                fontSize: '13px',
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '11px', color: 'var(--color-text-muted)', display: 'block', marginBottom: '6px' }}>
              Operator Role
            </label>
            <input
              type="text"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              style={{
                width: '100%',
                padding: '8px 12px',
                backgroundColor: 'var(--color-surface-base)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--color-text-main)',
                fontSize: '13px',
              }}
            />
          </div>
        </div>

        {/* Workspace & Motion Preferences */}
        <div style={{ paddingTop: '16px', borderTop: '1px solid var(--color-border-subtle)' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#F7F7F8', marginBottom: '14px' }}>
            Workspace & Accessibility Preferences
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Reduced motion toggle */}
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
              <div>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#F7F7F8' }}>Respect Reduced Motion</span>
                <p style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                  Disables background planetary video and smooth animations for accessibility.
                </p>
              </div>
              <input
                type="checkbox"
                checked={formData.preferences.reducedMotion}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    preferences: { ...formData.preferences, reducedMotion: e.target.checked },
                  })
                }
                style={{ width: '18px', height: '18px', accentColor: '#A020FF' }}
              />
            </label>

            {/* Auto audit logging toggle */}
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
              <div>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#F7F7F8' }}>Automatic Audit Trail Logging</span>
                <p style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                  Appends every upload, AI generation, and simulation approval to browser audit log.
                </p>
              </div>
              <input
                type="checkbox"
                checked={formData.preferences.autoAuditLogging}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    preferences: { ...formData.preferences, autoAuditLogging: e.target.checked },
                  })
                }
                style={{ width: '18px', height: '18px', accentColor: '#A020FF' }}
              />
            </label>
          </div>
        </div>

        {/* Buttons */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '16px',
            borderTop: '1px solid var(--color-border-subtle)',
            gap: '12px',
          }}
        >
          <button type="button" className="btn btn-ghost" onClick={onResetProfile}>
            <RotateCcw size={13} />
            <span>Reset Demo Profile</span>
          </button>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="button" className="btn btn-secondary" onClick={handleCancel}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Save size={13} />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
