import React from 'react';
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
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { NavigationTab } from '../../types';

interface SidebarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  findingsCount: number;
  actionPlansCount: number;
  anomaliesCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isCollapsed,
  onToggleCollapse,
  findingsCount,
  actionPlansCount,
  anomaliesCount,
}) => {
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
    <aside
      className="desktop-nav"
      style={{
        width: isCollapsed ? '68px' : '230px',
        backgroundColor: 'var(--color-surface-base)',
        borderRight: '1px solid var(--color-border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'width 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        flexShrink: 0,
        zIndex: 20,
      }}
    >
      <div style={{ padding: '16px 8px' }}>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                title={isCollapsed ? item.label : undefined}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: isActive ? 'rgba(160, 32, 255, 0.16)' : 'transparent',
                  color: isActive ? '#FFFFFF' : 'var(--color-text-muted)',
                  border: 'none',
                  borderLeft: isActive ? '3px solid #E34AFF' : '3px solid transparent',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: '13px',
                  fontWeight: isActive ? 600 : 500,
                  transition: 'all 0.15s ease',
                  boxShadow: isActive ? '0 0 16px rgba(160, 32, 255, 0.2)' : 'none',
                }}
              >
                <Icon
                  size={17}
                  color={isActive ? '#E34AFF' : 'var(--color-text-muted)'}
                  style={{ flexShrink: 0 }}
                />
                {!isCollapsed && (
                  <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.label}
                  </span>
                )}
                {!isCollapsed && item.count !== undefined && item.count > 0 && (
                  <span
                    className={`badge ${isActive ? 'badge-violet' : 'badge-muted'}`}
                    style={{ fontSize: '10px', padding: '2px 6px' }}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Collapse Toggle Footer */}
      <div
        style={{
          padding: '12px 16px',
          borderTop: '1px solid var(--color-border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'flex-end',
        }}
      >
        <button
          className="btn btn-ghost"
          onClick={onToggleCollapse}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          style={{ padding: '6px' }}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
    </aside>
  );
};
