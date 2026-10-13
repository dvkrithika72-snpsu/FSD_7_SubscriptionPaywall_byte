import React from 'react';
import BrandLogo from './BrandLogo';

export default function Footer({ onNavigate, isBackendOnline, latencyMs, onOpenHealthModal }) {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <BrandLogo onClick={() => onNavigate('landing')} />
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            • Master Modern Skills &amp; Build Real Projects
          </span>
        </div>

        <ul className="footer-links">
          <li>
            <button className="footer-link-item" onClick={() => onNavigate('courses')}>
              Courses
            </button>
          </li>
          <li>
            <button className="footer-link-item" onClick={() => onNavigate('dashboard-quizzes')}>
              Quizzes
            </button>
          </li>
          <li>
            <button className="footer-link-item" onClick={() => onNavigate('dashboard-certificates')}>
              Certifications &amp; Badges
            </button>
          </li>
          <li>
            <button className="footer-link-item" onClick={() => onNavigate('pricing')}>
              Pricing &amp; Pro
            </button>
          </li>
          <li>
            <button
              className="footer-link-item"
              onClick={onOpenHealthModal}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <span className={`status-dot ${isBackendOnline ? 'online' : 'offline'}`}></span>
              <span>API Status ({latencyMs !== null ? `${latencyMs}ms` : '—'})</span>
            </button>
          </li>
        </ul>

        <div className="footer-copy">
          © {new Date().getFullYear()} APTIVELLA. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
