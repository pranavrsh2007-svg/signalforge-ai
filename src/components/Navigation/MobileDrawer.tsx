import React, { useEffect } from 'react';
import {
  Home,
  LayoutDashboard,
  Table,
  Lightbulb,
  AlertTriangle,
  FileText,
  PlayCircle,
  ScrollText,
  User,
  Settings,
  X,
} from 'lucide-react';
import { NavigationTab } from '../../types';
import { Logo } from '../Common/Logo';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  findingsCount: number;
  actionPlansCount: number;
  anomaliesCount: number;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  currentTab,
  onSelectTab,
  findingsCount,
  actionPlansCount,
  anomaliesCount,
}) => {
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

  const navItems = [
    { id: 'home' as NavigationTab, label: 'Home', icon: Home },
    { id: 'dashboard' as NavigationTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'data-explorer' as NavigationTab, label: 'Data Explorer', icon: Table },
    { id: 'insights' as NavigationTab, label: 'AI Insights', icon: Lightbulb, count: findingsCount },
    { id: 'anomalies' as NavigationTab, label: 'Anomalies', icon: AlertTriangle, count: anomaliesCount },
    { id: 'reports' as NavigationTab, label: 'Reports', icon: FileText },
    { id: 'action-center' as NavigationTab, label: 'Action Center', icon: PlayCircle, count: actionPlansCount },
    { id: 'audit-log' as NavigationTab, label: 'Activity', icon: ScrollText },
    { id: 'profile' as NavigationTab, label: 'Profile', icon: User },
    { id: 'settings' as NavigationTab, label: 'Settings', icon: Settings },
  ];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 4, 7, 0.82)',
        backdropFilter: 'blur(8px)',
        zIndex: 100,
        display: 'flex',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: '290px',
          maxWidth: '85%',
          backgroundColor: 'var(--color-surface-base)',
          borderRight: '1px solid var(--color-border)',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-glass), var(--glow-violet)',
          padding: '20px 16px',
          overflowY: 'auto',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <Logo
            size={28}
            showText={true}
            onClick={() => {
              onSelectTab('home');
              onClose();
            }}
          />
          <button className="btn btn-ghost" onClick={onClose} style={{ padding: '6px' }} aria-label="Close menu">
            <X size={18} />
          </button>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  onClose();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: isActive ? 'rgba(160, 32, 255, 0.16)' : 'transparent',
                  color: isActive ? '#FFFFFF' : 'var(--color-text-muted)',
                  border: 'none',
                  borderLeft: isActive ? '3px solid #E34AFF' : '3px solid transparent',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: '14px',
                  fontWeight: isActive ? 600 : 500,
                }}
              >
                <Icon
                  size={18}
                  color={isActive ? '#E34AFF' : 'var(--color-text-muted)'}
                />
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.count !== undefined && item.count > 0 && (
                  <span
                    className={`badge ${isActive ? 'badge-violet' : 'badge-muted'}`}
                    style={{ fontSize: '10px' }}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
