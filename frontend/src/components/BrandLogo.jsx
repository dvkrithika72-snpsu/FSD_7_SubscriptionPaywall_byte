import React from 'react';

export default function BrandLogo({ onClick, showBadge = false, className = '' }) {
  return (
    <div 
      className={`brand-link ${className}`} 
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') onClick?.(); }}
    >
      <div className="brand-logo-mark" aria-hidden="true">
        <svg width="26" height="26" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="goldMarkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fde29b" />
              <stop offset="45%" stopColor="#e5b85a" />
              <stop offset="100%" stopColor="#b6882b" />
            </linearGradient>
            <linearGradient id="goldMarkDark" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#e5b85a" />
              <stop offset="100%" stopColor="#8d661b" />
            </linearGradient>
          </defs>
          {/* Stylized sharp geometric delta / chevron matching Aptivella reference */}
          <path d="M16 2L3 28L9.5 28L16 14L22.5 28L29 28L16 2Z" fill="url(#goldMarkGrad)" />
          <path d="M16 2L29 28L22.5 28L16 14Z" fill="url(#goldMarkDark)" opacity="0.85" />
          <polygon points="12,23 16,14 20,23" fill="#08090d" />
        </svg>
      </div>
      <span className="brand-text">APTIVELLA</span>
      {showBadge && <span className="pill-badge pill-badge-gold" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>Pro</span>}
    </div>
  );
}
