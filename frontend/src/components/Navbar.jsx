import React, { useState } from 'react';
import BrandLogo from './BrandLogo';

export default function Navbar({
  activeView,
  onNavigate,
  isBackendOnline,
  latencyMs,
  onOpenHealthModal,
  onOpenPricing,
  user,
  onOpenAuth,
  onLogout,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (view) => {
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  const isPro = user?.subscription?.status === 'pro';

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        {/* Brand Logo */}
        <BrandLogo onClick={() => handleNavClick('landing')} />

        {/* Desktop Navigation Links */}
        <nav aria-label="Main Navigation">
          <ul className="nav-links">
            <li>
              <button
                className={`nav-item-btn ${activeView === 'landing' ? 'active' : ''}`}
                onClick={() => handleNavClick('landing')}
              >
                Home
              </button>
            </li>
            <li>
              <button
                className={`nav-item-btn ${activeView === 'courses' ? 'active' : ''}`}
                onClick={() => handleNavClick('courses')}
              >
                Courses
              </button>
            </li>
            <li>
              <button
                className={`nav-item-btn ${activeView === 'dashboard-quizzes' ? 'active' : ''}`}
                onClick={() => handleNavClick('dashboard-quizzes')}
              >
                Quizzes
              </button>
            </li>
            <li>
              <button
                className={`nav-item-btn ${activeView === 'dashboard-certificates' ? 'active' : ''}`}
                onClick={() => handleNavClick('dashboard-certificates')}
              >
                Certificates
              </button>
            </li>
            <li>
              <button
                className={`nav-item-btn ${activeView === 'pricing' ? 'active' : ''}`}
                onClick={() => handleNavClick('pricing')}
              >
                Pricing
              </button>
            </li>
          </ul>
        </nav>

        {/* Right Actions */}
        <div className="nav-actions">
          {/* Search Trigger */}
          <button
            className="nav-icon-btn"
            title="Search Courses"
            onClick={() => handleNavClick('courses')}
            aria-label="Search Courses"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>

          {/* Backend Status Live Badge (Phase 1 Integration Preserved) */}
          <button
            className={`backend-status-pill ${isBackendOnline ? 'online' : 'offline'}`}
            onClick={onOpenHealthModal}
            title={`Backend API: ${isBackendOnline ? 'Online' : 'Offline'} (${latencyMs || 0}ms). Click for Diagnostics.`}
          >
            <span className={`status-dot ${isBackendOnline ? 'online' : 'offline'}`}></span>
            <span>{isBackendOnline ? 'API 5000' : 'Offline'}</span>
          </button>

          {/* Authenticated User Profile Badge OR Sign In / Register Buttons */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                className="user-avatar-badge"
                onClick={() => handleNavClick('dashboard')}
                title="Open Student Dashboard"
                role="button"
                tabIndex={0}
              >
                <div style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(212, 160, 23, 0.25), rgba(255, 255, 255, 0.05))',
                  border: '1.5px solid var(--gold-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--gold-light)',
                  flexShrink: 0
                }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <div className="user-avatar-info">
                  <span className="user-avatar-name">{user.name}</span>
                  <span className="user-avatar-role">
                    {isPro ? 'Pro Member ★' : 'Free Plan'}
                  </span>
                </div>
              </div>

              {!isPro && (
                <button
                  className="btn btn-gold btn-sm"
                  onClick={onOpenPricing}
                  id="nav-upgrade-btn"
                >
                  Upgrade
                </button>
              )}

              <button
                className="btn btn-secondary btn-sm"
                onClick={onLogout}
                title="Sign out of account"
                id="nav-logout-btn"
              >
                Logout
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                className="btn btn-glass btn-sm"
                onClick={() => onOpenAuth('login')}
                id="nav-login-btn"
              >
                Log In
              </button>

              <button
                className="btn btn-gold btn-sm"
                onClick={() => onOpenAuth('register')}
                id="nav-get-started-btn"
              >
                Get Started
              </button>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileMenuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Drawer */}
      {mobileMenuOpen && (
        <div style={{
          background: 'rgba(10, 12, 17, 0.98)',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '16px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <button className="nav-item-btn" onClick={() => handleNavClick('landing')}>Home</button>
          <button className="nav-item-btn" onClick={() => handleNavClick('courses')}>Courses</button>
          <button className="nav-item-btn" onClick={() => handleNavClick('dashboard')}>Dashboard</button>
          <button className="nav-item-btn" onClick={() => handleNavClick('dashboard-quizzes')}>Quizzes</button>
          <button className="nav-item-btn" onClick={() => handleNavClick('dashboard-certificates')}>Certificates</button>
          <button className="nav-item-btn" onClick={() => handleNavClick('pricing')}>Pricing & Pro</button>
          
          <div style={{ display: 'flex', gap: '10px', marginTop: '8px', flexWrap: 'wrap' }}>
            {user ? (
              <>
                <button className="btn btn-gold btn-sm" style={{ flex: 1 }} onClick={onOpenPricing}>
                  {isPro ? 'Pro Active' : 'Upgrade to Pro'}
                </button>
                <button className="btn btn-secondary btn-sm" onClick={onLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <button className="btn btn-glass btn-sm" style={{ flex: 1 }} onClick={() => { setMobileMenuOpen(false); onOpenAuth('login'); }}>
                  Log In
                </button>
                <button className="btn btn-gold btn-sm" style={{ flex: 1 }} onClick={() => { setMobileMenuOpen(false); onOpenAuth('register'); }}>
                  Get Started
                </button>
              </>
            )}
            <button className="btn btn-secondary btn-sm" onClick={onOpenHealthModal}>
              API Status
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
