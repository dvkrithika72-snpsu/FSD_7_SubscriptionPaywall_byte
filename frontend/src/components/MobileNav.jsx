import React from 'react';

export default function MobileNav({ activeView, onNavigate }) {
  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile Navigation">
      <button
        className={`mobile-nav-btn ${activeView === 'landing' ? 'active' : ''}`}
        onClick={() => onNavigate('landing')}
        id="mobile-nav-home"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
        <span>Home</span>
      </button>

      <button
        className={`mobile-nav-btn ${activeView === 'courses' ? 'active' : ''}`}
        onClick={() => onNavigate('courses')}
        id="mobile-nav-courses"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
          <path d="M6 6h10M6 10h10M6 14h6" />
        </svg>
        <span>Courses</span>
      </button>

      <button
        className={`mobile-nav-btn ${activeView === 'dashboard-quizzes' ? 'active' : ''}`}
        onClick={() => onNavigate('dashboard-quizzes')}
        id="mobile-nav-quizzes"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m9 11 3 3L22 4" />
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </svg>
        <span>Quizzes</span>
      </button>

      <button
        className={`mobile-nav-btn ${activeView === 'dashboard-certificates' ? 'active' : ''}`}
        onClick={() => onNavigate('dashboard-certificates')}
        id="mobile-nav-certificates"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="8" r="6" />
          <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
        </svg>
        <span>Certificates</span>
      </button>

      <button
        className={`mobile-nav-btn ${activeView === 'dashboard' ? 'active' : ''}`}
        onClick={() => onNavigate('dashboard')}
        id="mobile-nav-profile"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
        <span>Profile</span>
      </button>
    </nav>
  );
}
