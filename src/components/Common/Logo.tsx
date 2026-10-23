import React from 'react';

interface LogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
  onClick?: () => void;
}

export const Logo: React.FC<LogoProps> = ({ size = 32, showText = true, className = '', onClick }) => {
  return (
    <div
      className={`logo-container ${className}`}
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '10px',
        cursor: onClick ? 'pointer' : 'default',
        userSelect: 'none',
      }}
    >
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.25s ease',
        }}
        className="logo-icon-wrapper"
      >
        <svg
          width={size}
          height={size}
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ flexShrink: 0, filter: 'drop-shadow(0 0 8px rgba(160, 32, 255, 0.45))' }}
        >
          {/* Cosmic Dark rounded diamond / hex surface */}
          <rect
            width="36"
            height="36"
            rx="9"
            fill="#100D18"
            stroke="rgba(160, 32, 255, 0.35)"
            strokeWidth="1.5"
          />

          {/* Subdued data grid coordinates */}
          <line x1="6" y1="28" x2="30" y2="28" stroke="rgba(160, 32, 255, 0.2)" strokeWidth="1" strokeDasharray="2 2" />
          <line x1="6" y1="18" x2="30" y2="18" stroke="rgba(160, 32, 255, 0.2)" strokeWidth="1" strokeDasharray="2 2" />

          {/* Oscillating data wave glyph in deep violet */}
          <path
            d="M7 22C9.5 22 10.5 13 13 13C15.5 13 16.5 24 19 24C21.5 24 22.5 15 25 15"
            stroke="#9312FF"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.85"
          />

          {/* Ascending intelligence vector fused with wave */}
          <path
            d="M11 25L17 18L22 20L28 9"
            stroke="#E34AFF"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Violet / Magenta Spark Beacon at apex */}
          <circle cx="28" cy="9" r="3" fill="#E34AFF" />
          <circle cx="28" cy="9" r="5.5" stroke="#A020FF" strokeWidth="1.2" strokeOpacity="0.6" />
        </svg>
      </div>

      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span
            style={{
              fontSize: '16px',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: '#F7F7F8',
              lineHeight: 1.1,
              fontFamily: 'var(--font-display)',
            }}
          >
            Signal<span className="text-gradient-bright">Forge</span>
          </span>
          <span
            style={{
              fontSize: '9px',
              fontWeight: 700,
              letterSpacing: '0.12em',
              color: 'var(--color-text-muted)',
              textTransform: 'uppercase',
            }}
          >
            Cosmic Data Ops
          </span>
        </div>
      )}
    </div>
  );
};
