import React from 'react';
import { Logo } from '../Common/Logo';
import { Menu, BookOpen, RotateCcw, Sparkles } from 'lucide-react';
import { AIProviderStatus } from '../../lib/ai/client';

interface AppHeaderProps {
  onToggleMobileNav: () => void;
  isMobileDrawerOpen: boolean;
  onOpenMethodology: () => void;
  onResetDemo: () => void;
  onNavigateHome: () => void;
  providerStatus: AIProviderStatus;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  onToggleMobileNav,
  isMobileDrawerOpen,
  onOpenMethodology,
  onResetDemo,
  onNavigateHome,
  providerStatus,
}) => {
  return (
    <header className="app-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          className="btn btn-ghost mobile-menu-btn"
          onClick={onToggleMobileNav}
          aria-label={isMobileDrawerOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
          aria-expanded={isMobileDrawerOpen}
          title={isMobileDrawerOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
          style={{
            padding: '8px',
            color: isMobileDrawerOpen ? 'var(--color-magenta-glow)' : 'var(--color-text-main)',
            border: isMobileDrawerOpen ? '1px solid var(--color-border-strong)' : '1px solid transparent',
          }}
        >
          <Menu size={22} />
        </button>

        <Logo size={32} showText={true} onClick={onNavigateHome} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Provider Status Indicator */}
        <div
          title={providerStatus.message}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            borderRadius: '20px',
            backgroundColor: 'var(--color-surface-raised)',
            border: '1px solid var(--color-border)',
            fontSize: '11px',
            cursor: 'help',
          }}
        >
          <Sparkles
            size={12}
            color={providerStatus.configured ? '#45B558' : '#E34AFF'}
          />
          <span style={{ color: 'var(--color-text-muted)' }}>AI Provider:</span>
          <span
            style={{
              fontWeight: 600,
              color: providerStatus.configured ? '#45B558' : '#E34AFF',
            }}
          >
            {providerStatus.configured ? 'Gemini 2.5 Flash' : 'Fallback Engine (Active)'}
          </span>
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: providerStatus.configured ? '#45B558' : '#E34AFF',
              boxShadow: providerStatus.configured ? '0 0 6px #45B558' : '0 0 6px #E34AFF',
            }}
          />
        </div>

        {/* Methodology Button */}
        <button
          className="btn btn-secondary"
          onClick={onOpenMethodology}
          style={{ fontSize: '12px', padding: '6px 12px' }}
          title="Inspect calculation formulas, anomaly heuristics & security rules"
        >
          <BookOpen size={14} color="#E34AFF" />
          <span className="hide-on-mobile">Methodology</span>
        </button>

        {/* Quick Reset Demo Button */}
        <button
          className="btn btn-outline"
          onClick={onResetDemo}
          style={{ fontSize: '12px', padding: '6px 12px' }}
          title="Restore sample sales dataset and reset demo environment"
        >
          <RotateCcw size={14} />
          <span className="hide-on-mobile">Reset Demo</span>
        </button>
      </div>
    </header>
  );
};
