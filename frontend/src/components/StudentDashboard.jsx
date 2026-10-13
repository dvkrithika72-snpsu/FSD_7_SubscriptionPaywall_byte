import React, { useState, useEffect } from 'react';
import BrandLogo from './BrandLogo';
import TechIcon from './TechIcon';
import { COURSE_QUIZZES, ALL_BADGES, getQuizForCourse } from '../data/quizzesAndCertificates';
import { fetchUserAchievements } from '../services/api';
import QuizModal from './QuizModal';
import CertificateModal from './CertificateModal';

export default function StudentDashboard({
  courses,
  onSelectCourse,
  onStartLearning,
  onOpenPricing,
  onOpenPaywall,
  user,
  onOpenAuth,
  onNavigateLanding,
  initialTab = 'dashboard',
}) {
  const [activeSidebarTab, setActiveSidebarTab] = useState(
    initialTab === 'projects' ? 'quizzes' : initialTab === 'resources' ? 'certificates' : initialTab
  );
  const [searchDashboardQuery, setSearchDashboardQuery] = useState('');
  const [quizCategoryFilter, setQuizCategoryFilter] = useState('all');
  const [achievements, setAchievements] = useState([]);
  
  // Interactive Modals
  const [quizModalCourse, setQuizModalCourse] = useState(null);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [certificateModalData, setCertificateModalData] = useState(null);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);

  useEffect(() => {
    setActiveSidebarTab(
      initialTab === 'projects' ? 'quizzes' : initialTab === 'resources' ? 'certificates' : initialTab
    );
  }, [initialTab]);

  // Load user achievements from backend
  const loadAchievements = async () => {
    try {
      if (!user) {
        setAchievements([]);
        return;
      }
      const res = await fetchUserAchievements();
      if (res.ok && res.achievements) {
        setAchievements(res.achievements);
      } else {
        setAchievements([]);
      }
    } catch {
      setAchievements([]);
    }
  };

  useEffect(() => {
    loadAchievements();
  }, [user]);

  const enrolledCourses = courses.slice(0, 3);
  const isPro = user?.subscription?.status === 'pro';

  const earnedCertificatesCount = achievements.filter((a) => a.certificateEarned).length;
  const earnedBadgesCount = achievements.filter((a) => a.badgeEarned).length;

  const quizCategories = [
    { id: 'all', label: 'All Quizzes (13)' },
    { id: 'frontend', label: 'Frontend' },
    { id: 'backend', label: 'Backend' },
    { id: 'fullstack', label: 'Fullstack' },
    { id: 'devops', label: 'DevOps & Cloud' },
    { id: 'security', label: 'Security & Systems' },
    { id: 'ai', label: 'AI & Algorithms' },
  ];

  const filteredCoursesForQuizzes = courses.filter((course) => {
    const quiz = getQuizForCourse(course.id);
    if (!quiz) return false;
    const catLower = (course.category || '').toLowerCase();
    const titleLower = (course.title || '').toLowerCase();

    let matchesCategory = true;
    if (quizCategoryFilter === 'frontend') {
      matchesCategory = catLower.includes('frontend') || catLower.includes('web') || titleLower.includes('react');
    } else if (quizCategoryFilter === 'backend') {
      matchesCategory = catLower.includes('backend') || titleLower.includes('node') || titleLower.includes('python') || titleLower.includes('mongo');
    } else if (quizCategoryFilter === 'fullstack') {
      matchesCategory = catLower.includes('fullstack') || titleLower.includes('mern') || titleLower.includes('next');
    } else if (quizCategoryFilter === 'devops') {
      matchesCategory = catLower.includes('devops') || catLower.includes('cloud') || titleLower.includes('docker') || titleLower.includes('kubernetes');
    } else if (quizCategoryFilter === 'security') {
      matchesCategory = catLower.includes('security') || catLower.includes('system') || catLower.includes('architecture') || titleLower.includes('pentesting') || titleLower.includes('distributed');
    } else if (quizCategoryFilter === 'ai') {
      matchesCategory = catLower.includes('ai') || catLower.includes('data') || catLower.includes('algorithm') || titleLower.includes('langchain') || titleLower.includes('structures');
    }

    const query = searchDashboardQuery.trim().toLowerCase();
    let matchesSearch = true;
    if (query) {
      const skillsMatch = quiz.certificate?.skills && quiz.certificate.skills.some(s => s.toLowerCase().includes(query));
      matchesSearch =
        titleLower.includes(query) ||
        (quiz.title || '').toLowerCase().includes(query) ||
        catLower.includes(query) ||
        Boolean(skillsMatch);
    }

    return matchesCategory && matchesSearch;
  });

  const handleLaunchQuiz = (course) => {
    const isLocked = course.isPro && !isPro;
    if (isLocked) {
      if (onOpenPaywall) onOpenPaywall(course);
      else onOpenPricing();
      return;
    }
    setQuizModalCourse(course);
    setIsQuizModalOpen(true);
  };

  const handleOpenCertificate = (certData) => {
    setCertificateModalData(certData);
    setIsCertificateModalOpen(true);
  };

  const handleViewExistingCertificate = (courseId) => {
    const ach = achievements.find((a) => a.courseId === courseId);
    const quiz = getQuizForCourse(courseId);
    const course = courses.find((c) => c.id === courseId);

    if (quiz) {
      handleOpenCertificate({
        courseTitle: course ? course.title : quiz.courseTitle,
        certificateId: ach?.certificateId || `APT-2026-${courseId.toUpperCase().slice(0, 5)}-49120`,
        issuedAt: ach?.certificateIssuedAt
          ? new Date(ach.certificateIssuedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
          : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        skills: quiz.certificate.skills || [],
        courseCode: quiz.certificate.courseCode,
        badgeIcon: quiz.badge.icon,
        badgeTitle: quiz.badge.title,
        score: ach?.quizScore || 100,
      });
    }
  };

  return (
    <div className="dashboard-wrapper" id="student-dashboard">
      {/* Sidebar Navigation */}
      <aside className="dashboard-sidebar">
        <div style={{ marginBottom: '28px', paddingLeft: '8px' }}>
          <BrandLogo onClick={onNavigateLanding} />
        </div>

        <ul className="sidebar-nav-list">
          <li>
            <button
              className={`sidebar-nav-item ${activeSidebarTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveSidebarTab('dashboard')}
              id="sidebar-tab-dashboard"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
              </svg>
              <span>Dashboard</span>
            </button>
          </li>

          <li>
            <button
              className={`sidebar-nav-item ${activeSidebarTab === 'my-courses' ? 'active' : ''}`}
              onClick={() => setActiveSidebarTab('my-courses')}
              id="sidebar-tab-my-courses"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
                <path d="M6 6h10M6 10h10M6 14h6" />
              </svg>
              <span>My Courses</span>
            </button>
          </li>

          {/* Tab 3: Quizzes */}
          <li>
            <button
              className={`sidebar-nav-item ${activeSidebarTab === 'quizzes' ? 'active' : ''}`}
              onClick={() => setActiveSidebarTab('quizzes')}
              id="sidebar-tab-quizzes"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m9 11 3 3L22 4" />
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
              <span>Course Quizzes</span>
            </button>
          </li>

          {/* Tab 4: Certifications & Badges */}
          <li>
            <button
              className={`sidebar-nav-item ${activeSidebarTab === 'certificates' ? 'active' : ''}`}
              onClick={() => setActiveSidebarTab('certificates')}
              id="sidebar-tab-certificates"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="8" r="6" />
                <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
              </svg>
              <span>Certificates &amp; Badges</span>
            </button>
          </li>

          <li>
            <button
              className={`sidebar-nav-item ${activeSidebarTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveSidebarTab('profile')}
              id="sidebar-tab-profile"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span>Profile</span>
            </button>
          </li>

          <li>
            <button
              className={`sidebar-nav-item ${activeSidebarTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveSidebarTab('settings')}
              id="sidebar-tab-settings"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
              <span>Settings</span>
            </button>
          </li>
        </ul>

        {/* Real User Status Badge in Sidebar Footer */}
        <div style={{
          marginTop: 'auto',
          padding: '14px',
          background: 'rgba(255, 255, 255, 0.03)',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-subtle)',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
            Account Status
          </div>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: isPro ? '#6ee7b7' : 'var(--gold-light)' }}>
            {user ? (isPro ? 'Pro Member' : 'Free Tier') : 'Guest Session'}
          </div>
          {!user && (
            <button
              className="btn btn-gold btn-sm"
              style={{ width: '100%', marginTop: '8px', fontSize: '0.75rem' }}
              onClick={() => onOpenAuth('login')}
            >
              Sign In
            </button>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="dashboard-main-area">
        {/* Top Header Row with Welcome & Profile Snapshot */}
        <div className="dashboard-topbar">
          <div>
            <h1 className="dashboard-user-greeting">
              {user ? `Welcome back, ${user.name}! 👋` : 'Welcome to APTIVELLA! 👋'}
            </h1>
            <p className="dashboard-subtext">
              {user ? "Keep going. You're doing great!" : 'Explore courses, take quizzes, and earn verified credentials.'}
            </p>
          </div>

          <div className="topbar-actions">
            {/* Search courses */}
            <div className="dashboard-search-wrap">
              <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                className="dashboard-search-input"
                placeholder="Search courses, quizzes..."
                value={searchDashboardQuery}
                onChange={(e) => setSearchDashboardQuery(e.target.value)}
              />
              {searchDashboardQuery && (
                <button
                  type="button"
                  onClick={() => setSearchDashboardQuery('')}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    fontSize: '0.85rem'
                  }}
                  title="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Profile Avatar Pill OR Generic Log In / Sign Up */}
            {user ? (
              <div
                className="profile-pill-badge"
                onClick={() => setActiveSidebarTab('profile')}
                style={{ cursor: 'pointer' }}
                id="dashboard-user-profile-badge"
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(212, 160, 23, 0.25), rgba(255, 255, 255, 0.05))',
                  border: '1.5px solid var(--gold-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--gold-light)',
                  flexShrink: 0
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <div className="pill-user-meta">
                  <span className="pill-user-name">{user.name}</span>
                  <span className="pill-user-tier" style={{ color: isPro ? '#6ee7b7' : 'var(--gold-light)' }}>
                    {isPro ? 'Pro Member' : 'Free Plan'}
                  </span>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => onOpenAuth('login')}
                  id="dashboard-topbar-login-btn"
                >
                  Log In
                </button>
                <button
                  type="button"
                  className="btn btn-gold btn-sm"
                  onClick={() => onOpenAuth('register')}
                  id="dashboard-topbar-register-btn"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Tab 1: Primary Dashboard View */}
        {activeSidebarTab === 'dashboard' && (
          <>
            {/* Stats Metric Cards Grid */}
            <div className="dashboard-stats-grid">
              <div className="glass-card stat-metric-card">
                <div className="stat-number">{user ? enrolledCourses.length : 0}</div>
                <div className="stat-label-text">Enrolled Courses</div>
              </div>

              {/* Certificates & Badges Metric */}
              <div
                className="glass-card stat-metric-card"
                style={{ cursor: 'pointer' }}
                onClick={() => setActiveSidebarTab('certificates')}
                title="View your verified certificates & badges"
              >
                <div className="stat-number" style={{ color: 'var(--gold-light)' }}>
                  {user ? earnedCertificatesCount : 0}
                </div>
                <div className="stat-label-text">Certificates &amp; Badges</div>
              </div>

              <div className="glass-card stat-metric-card">
                <div className="stat-number">{user ? 12 : 0}</div>
                <div className="stat-label-text">Hours This Week</div>
              </div>

              <div className="glass-card glass-card-gold stat-metric-card">
                <div className="stat-number" style={{ color: 'var(--gold-light)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>{user ? (isPro ? 'Pro' : 'Free') : 'Guest'}</span>
                  {user && isPro && (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  )}
                </div>
                <div className="stat-label-text" style={{ color: 'var(--text-gold)' }}>
                  {user ? (isPro ? 'Pro Subscription Active' : 'Free Starter Tier') : 'Guest Session'}
                </div>
              </div>
            </div>

            {/* Split Content: Main Workspace (Left) + Activity & Status (Right) */}
            <div className="dashboard-content-layout">
              {/* Left Column: Continue Learning & Course Quizzes */}
              <div>
                {/* Continue Learning Card */}
                <div className="glass-card continue-card">
                  <div className="continue-header">
                    <span className="section-label">Continue Learning</span>
                  </div>

                  <div className="continue-course-body">
                    <div className="tech-icon-box">
                      <TechIcon tech="React" size={30} />
                    </div>

                    <div style={{ minWidth: '150px' }}>
                      <div style={{ fontWeight: 700, fontSize: '1rem', color: '#ffffff' }}>
                        React for Beginners
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Module 4 of 8 • Custom Hooks &amp; State
                      </div>
                    </div>

                    <div className="course-progress-column">
                      <div className="progress-label-row">
                        <span>Progress</span>
                        <span style={{ color: 'var(--gold-light)', fontWeight: 600 }}>60%</span>
                      </div>
                      <div className="progress-track">
                        <div className="progress-fill" style={{ width: '60%' }}></div>
                      </div>
                    </div>

                    <button
                      className="btn btn-gold btn-sm"
                      onClick={() => (onStartLearning ? onStartLearning(courses[0]) : onSelectCourse(courses[0]))}
                      id="dashboard-continue-btn"
                    >
                      Continue Learning ➔
                    </button>
                  </div>
                </div>

                {/* Course Quizzes & Certifications Preview */}
                <div style={{ marginTop: '32px' }}>
                  <div className="projects-header-row">
                    <h3 className="section-label">Course Quizzes &amp; Certifications</h3>
                    <button
                      className="view-all-link"
                      onClick={() => setActiveSidebarTab('quizzes')}
                    >
                      <span>View All Quizzes</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>

                  <div className="dashboard-projects-grid">
                    {courses.slice(0, 3).map((c) => {
                      const quiz = getQuizForCourse(c.id);
                      const ach = achievements.find((a) => a.courseId === c.id);
                      const hasPassed = Boolean(ach?.quizPassed);

                      return (
                        <div
                          key={c.id}
                          className="glass-card glass-card-hover dashboard-project-card"
                          onClick={() => handleLaunchQuiz(c)}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '1.4rem' }}>{quiz?.badge.icon || '📝'}</span>
                            <div>
                              <div className="project-card-title">{c.title}</div>
                              <div className="project-card-stack">{quiz ? `${quiz.questions.length} MCQs • ≥${quiz.passingScore}% Pass` : '5 Questions'}</div>
                            </div>
                          </div>

                          <span className={`project-status-tag ${hasPassed ? 'completed' : 'in-progress'}`}>
                            {hasPassed ? '✓ Certified' : 'Take Quiz'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right Column: Plan Upgrade Prompt & Recent Activity */}
              <div>
                {!isPro ? (
                  <div className="glass-card glass-card-gold plan-status-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <span style={{ fontSize: '1.2rem' }}>👑</span>
                      <span style={{ fontWeight: 700, color: 'var(--gold-light)', fontSize: '0.96rem' }}>
                        You're on the Free Plan
                      </span>
                    </div>

                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
                      Upgrade to Pro for unlimited access to all courses, certification exams, and accredited badges.
                    </p>

                    <button
                      className="btn btn-gold btn-sm"
                      style={{ width: '100%' }}
                      onClick={() => (onOpenPaywall ? onOpenPaywall() : onOpenPricing())}
                      id="dashboard-go-pro-btn"
                    >
                      Go Pro from ₹399/mo
                    </button>
                  </div>
                ) : (
                  <div className="glass-card plan-status-card" style={{ borderColor: 'rgba(16, 185, 129, 0.3)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <span style={{ fontSize: '1.2rem' }}>✨</span>
                      <span style={{ fontWeight: 700, color: '#6ee7b7', fontSize: '0.96rem' }}>
                        Pro Membership Active
                      </span>
                    </div>

                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      Full verified entitlement to all certification quizzes, digital badges, and official credentials.
                    </p>
                  </div>
                )}

                {/* Recent Activity Feed */}
                <div className="glass-card activity-feed-card">
                  <h4 className="activity-feed-title">Recent Achievements</h4>
                  {user ? (
                    achievements.length > 0 ? (
                      <ul className="activity-list">
                        {achievements.map((a, idx) => {
                          const c = courses.find((crs) => crs.id === a.courseId);
                          return (
                            <li key={idx} className="activity-feed-item">
                              <div className="activity-icon-bullet" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#6ee7b7' }}>
                                ★
                              </div>
                              <div className="activity-text-group">
                                <span className="activity-action">{a.certificateEarned ? 'Earned Verified Certificate' : 'Passed Quiz'}</span>
                                <span className="activity-meta">{c ? c.title : a.courseId} • Score: {a.quizScore || 100}%</span>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    ) : (
                      <div style={{ padding: '12px 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        No achievements yet. Take course quizzes to earn verified certificates and badges!
                      </div>
                    )
                  ) : (
                    <div style={{ padding: '12px 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      Sign in to track your course progress and view verified credentials.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Tab 2: My Courses Tab */}
        {activeSidebarTab === 'my-courses' && (
          <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '18px' }}>My Enrolled Courses</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
              {enrolledCourses.map((c) => (
                <div key={c.id} className="glass-card glass-card-hover" style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                    <TechIcon tech={c.tech} size={28} />
                    <div>
                      <h4 style={{ color: '#ffffff', fontSize: '1.05rem' }}>{c.title}</h4>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{c.duration} • {c.modulesCount} modules</span>
                    </div>
                  </div>
                  <div className="progress-track" style={{ marginBottom: '16px' }}>
                    <div className="progress-fill" style={{ width: c.id === 'react-for-beginners' ? '60%' : '20%' }}></div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      className="btn btn-gold btn-sm"
                      style={{ flex: 1 }}
                      onClick={() => (onStartLearning ? onStartLearning(c) : onSelectCourse(c))}
                    >
                      Resume Learning ➔
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleLaunchQuiz(c)}
                    >
                      Take Quiz
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Course Quizzes Tab (Replaces Projects) */}
        {activeSidebarTab === 'quizzes' && (
          <div style={{ width: '100%' }}>
            {/* Header Banner */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(212, 160, 23, 0.1) 0%, rgba(10, 13, 20, 0.95) 100%)',
              border: '1px solid rgba(212, 160, 23, 0.25)',
              borderRadius: '16px',
              padding: '28px 32px',
              marginBottom: '26px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '20px'
            }}>
              <div>
                <span className="badge-pro" style={{ marginBottom: '8px', display: 'inline-block' }}>
                  ★ Proctored Technical Assessments
                </span>
                <h2 style={{ fontSize: '1.8rem', color: '#ffffff', margin: '4px 0 8px 0' }}>
                  Course Quizzes &amp; Assessments
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', maxWidth: '640px', lineHeight: 1.6, margin: 0 }}>
                  Take official skill certification assessments for every engineering track. Score <strong style={{ color: 'var(--gold-light)' }}>80% or higher</strong> to instantly unlock your verified Aptivella credential and digital badge.
                </p>
              </div>

              {/* Progress Counters */}
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ textAlign: 'center', background: 'rgba(0, 0, 0, 0.45)', padding: '12px 20px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--gold-light)' }}>
                    {achievements.filter(a => a.quizPassed).length} / {courses.length}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Quizzes Passed
                  </div>
                </div>
                <div style={{ textAlign: 'center', background: 'rgba(0, 0, 0, 0.45)', padding: '12px 20px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#10b981' }}>
                    80%
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Passing Benchmark
                  </div>
                </div>
              </div>
            </div>

            {/* Category Filter Pills & Search Status */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {quizCategories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setQuizCategoryFilter(cat.id)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '20px',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      border: quizCategoryFilter === cat.id
                        ? '1px solid var(--gold-primary)'
                        : '1px solid rgba(255, 255, 255, 0.08)',
                      background: quizCategoryFilter === cat.id
                        ? 'rgba(212, 160, 23, 0.16)'
                        : 'rgba(255, 255, 255, 0.03)',
                      color: quizCategoryFilter === cat.id ? '#ffffff' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                Showing <strong style={{ color: '#ffffff' }}>{filteredCoursesForQuizzes.length}</strong> assessments
              </div>
            </div>

            {/* Quizzes Cards Grid */}
            {filteredCoursesForQuizzes.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '12px', border: '1px dashed var(--border-subtle)' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🔍</div>
                <h3 style={{ color: '#ffffff', marginBottom: '6px' }}>No Quizzes Found</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>No assessments match your active filter.</p>
                <button className="btn btn-secondary btn-sm" onClick={() => { setSearchDashboardQuery(''); setQuizCategoryFilter('all'); }}>
                  Reset Filters
                </button>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
                gap: '24px',
                width: '100%',
              }}>
                {filteredCoursesForQuizzes.map((course) => {
                  const quiz = getQuizForCourse(course.id);
                  const ach = achievements.find((a) => a.courseId === course.id);
                  const isPassed = ach?.quizPassed;
                  const score = ach?.quizScore;

                  if (!quiz) return null;

                  return (
                    <div
                      key={course.id}
                      className="glass-card glass-card-hover"
                      style={{
                        padding: '24px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        border: isPassed
                          ? '1px solid rgba(16, 185, 129, 0.45)'
                          : '1px solid rgba(255, 255, 255, 0.09)',
                        background: isPassed
                          ? 'linear-gradient(150deg, rgba(16, 185, 129, 0.06) 0%, #0d111a 100%)'
                          : 'linear-gradient(150deg, rgba(255, 255, 255, 0.02) 0%, #0c0f17 100%)',
                        borderRadius: '14px',
                        position: 'relative',
                        boxShadow: isPassed ? '0 8px 30px rgba(16, 185, 129, 0.1)' : undefined,
                      }}
                    >
                      <div>
                        {/* Header Tag Row */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <TechIcon tech={course.tech} size={22} />
                            <span style={{
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              color: 'var(--gold-light)',
                              textTransform: 'uppercase',
                              letterSpacing: '0.8px',
                              background: 'rgba(212, 160, 23, 0.1)',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              border: '1px solid rgba(212, 160, 23, 0.2)'
                            }}>
                              {course.category}
                            </span>
                          </div>

                          {isPassed ? (
                            <span style={{
                              background: 'rgba(16, 185, 129, 0.18)',
                              color: '#6ee7b7',
                              border: '1px solid rgba(16, 185, 129, 0.4)',
                              padding: '3px 10px',
                              borderRadius: '12px',
                              fontSize: '0.74rem',
                              fontWeight: 700
                            }}>
                              ✓ Passed • {score}%
                            </span>
                          ) : score !== undefined ? (
                            <span style={{
                              background: 'rgba(239, 68, 68, 0.15)',
                              color: '#f87171',
                              border: '1px solid rgba(239, 68, 68, 0.3)',
                              padding: '3px 10px',
                              borderRadius: '12px',
                              fontSize: '0.74rem',
                              fontWeight: 700
                            }}>
                              Score: {score}% (Retake)
                            </span>
                          ) : (
                            <span style={{
                              background: 'rgba(255, 255, 255, 0.05)',
                              color: 'var(--text-muted)',
                              border: '1px solid rgba(255, 255, 255, 0.08)',
                              padding: '3px 10px',
                              borderRadius: '12px',
                              fontSize: '0.72rem',
                              fontWeight: 600
                            }}>
                              5 MCQs • ~10 mins
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '8px', lineHeight: 1.35, fontWeight: 700 }}>
                          {quiz.title}
                        </h3>

                        {/* Curriculum Reference */}
                        <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '14px', lineHeight: 1.5 }}>
                          Curriculum: <strong style={{ color: 'var(--gold-light)' }}>{course.title}</strong>
                        </div>

                        {/* Tested Skills Tags */}
                        {quiz.certificate?.skills && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                            {quiz.certificate.skills.slice(0, 3).map((skill, sIdx) => (
                              <span key={sIdx} style={{
                                fontSize: '0.68rem',
                                color: 'var(--text-muted)',
                                background: 'rgba(255, 255, 255, 0.03)',
                                border: '1px solid rgba(255, 255, 255, 0.06)',
                                borderRadius: '4px',
                                padding: '2px 7px'
                              }}>
                                • {skill}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Reward Preview Pill */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '12px 14px',
                          background: 'rgba(0, 0, 0, 0.35)',
                          borderRadius: '10px',
                          border: '1px solid rgba(212, 160, 23, 0.18)',
                          marginBottom: '20px',
                        }}>
                          <span style={{ fontSize: '1.4rem' }}>{quiz.badge.icon}</span>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.82rem' }}>
                              Badge: {quiz.badge.title}
                            </div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginTop: '2px' }}>
                              Official Aptivella Credential upon passing (≥80%)
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                          className="btn btn-gold btn-sm"
                          style={{ flex: 1, padding: '10px 14px', fontSize: '0.85rem' }}
                          onClick={() => handleLaunchQuiz(course)}
                          id={`take-quiz-btn-${course.id}`}
                        >
                          {isPassed ? '🔄 Retake Assessment' : 'Start Assessment ➔'}
                        </button>

                        {isPassed && (
                          <button
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '10px 14px', fontSize: '0.85rem' }}
                            onClick={() => handleViewExistingCertificate(course.id)}
                            id={`view-cert-btn-${course.id}`}
                          >
                            🎓 Certificate
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Certifications & Badges Tab (Replaces Resources) */}
        {activeSidebarTab === 'certificates' && (
          <div style={{ width: '100%' }}>
            {/* Header Banner */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(212, 160, 23, 0.12) 0%, rgba(10, 12, 17, 0.95) 100%)',
              border: '1px solid rgba(212, 160, 23, 0.3)',
              borderRadius: '16px',
              padding: '28px 32px',
              marginBottom: '32px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '20px'
            }}>
              <div>
                <span className="badge-pro" style={{ marginBottom: '8px', display: 'inline-block' }}>
                  ★ Verified Student Credentials &bull; Public Registry
                </span>
                <h2 style={{ fontSize: '1.8rem', color: '#ffffff', margin: '4px 0 8px 0' }}>
                  Certifications &amp; Digital Badges
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', maxWidth: '620px', lineHeight: 1.6, margin: 0 }}>
                  Every course on Aptivella offers an official verifiable certificate and cryptographic skill badge upon passing its final assessment with score &ge;80%.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ textAlign: 'center', background: 'rgba(0, 0, 0, 0.45)', padding: '12px 20px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--gold-light)' }}>
                    {earnedCertificatesCount > 0 ? earnedCertificatesCount : (user ? 1 : 0)} / {courses.length}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Certificates Earned
                  </div>
                </div>

                <div style={{ textAlign: 'center', background: 'rgba(0, 0, 0, 0.45)', padding: '12px 20px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#6ee7b7' }}>
                    {earnedBadgesCount > 0 ? earnedBadgesCount : (user ? 1 : 0)} / {ALL_BADGES.length}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Badges Unlocked
                  </div>
                </div>
              </div>
            </div>

            {/* Section 1: Issued Certificates */}
            <div style={{ marginBottom: '44px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <h3 style={{ fontSize: '1.35rem', color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span>📜</span>
                  <span>Official Verified Certificates</span>
                </h3>
                <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                  {user ? `${earnedCertificatesCount} Verified Credentials Active` : 'Log in to view active credentials'}
                </span>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
                gap: '24px',
                width: '100%',
              }}>
                {courses.map((course) => {
                  const quiz = getQuizForCourse(course.id);
                  const ach = achievements.find((a) => a.courseId === course.id);
                  const isEarned = Boolean(ach?.certificateEarned);

                  if (!quiz) return null;

                  return (
                    <div
                      key={course.id}
                      className="glass-card"
                      style={{
                        padding: '24px',
                        border: isEarned
                          ? '1.5px solid var(--gold-primary)'
                          : '1px dashed rgba(255, 255, 255, 0.12)',
                        background: isEarned
                          ? 'linear-gradient(150deg, rgba(212, 160, 23, 0.08) 0%, #0d111a 100%)'
                          : 'rgba(255, 255, 255, 0.01)',
                        borderRadius: '14px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        boxShadow: isEarned ? '0 10px 30px rgba(212, 160, 23, 0.12)' : undefined,
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                          <span style={{
                            fontSize: '0.74rem',
                            fontWeight: 700,
                            color: isEarned ? 'var(--gold-light)' : 'var(--text-muted)',
                            textTransform: 'uppercase',
                            letterSpacing: '1px'
                          }}>
                            {quiz.certificate.courseCode}
                          </span>
                          <span className={isEarned ? 'badge-pro' : 'badge-free'} style={{ fontSize: '0.72rem' }}>
                            {isEarned ? '● Verified Credential' : '🔒 Assessment Required'}
                          </span>
                        </div>

                        <h4 style={{ fontSize: '1.2rem', color: isEarned ? '#ffffff' : 'var(--text-muted)', marginBottom: '8px', lineHeight: 1.35, fontWeight: 700 }}>
                          {quiz.certificate.title}
                        </h4>

                        <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                          Curriculum: <strong style={{ color: isEarned ? 'var(--gold-light)' : 'inherit' }}>{course.title}</strong>
                        </div>

                        {/* Competencies Tags */}
                        {quiz.certificate.skills && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                            {quiz.certificate.skills.slice(0, 3).map((sk, skIdx) => (
                              <span key={skIdx} style={{
                                fontSize: '0.68rem',
                                color: isEarned ? '#f1f5f9' : 'var(--text-muted)',
                                background: isEarned ? 'rgba(212, 160, 23, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                                border: isEarned ? '1px solid rgba(212, 160, 23, 0.25)' : '1px solid rgba(255, 255, 255, 0.05)',
                                borderRadius: '4px',
                                padding: '2px 8px'
                              }}>
                                ✓ {sk}
                              </span>
                            ))}
                          </div>
                        )}

                        {isEarned && (
                          <div style={{
                            padding: '10px 14px',
                            background: 'rgba(0, 0, 0, 0.35)',
                            borderRadius: '8px',
                            border: '1px solid rgba(212, 160, 23, 0.2)',
                            fontSize: '0.78rem',
                            marginBottom: '18px',
                            color: 'var(--text-muted)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}>
                            <span>Recipient: <strong style={{ color: '#ffffff' }}>{user?.name || 'Student'}</strong></span>
                            <span>Score: <strong style={{ color: '#10b981' }}>{ach?.quizScore || 100}%</strong></span>
                          </div>
                        )}
                      </div>

                      <div>
                        {isEarned ? (
                          <button
                            className="btn btn-gold btn-block btn-sm"
                            style={{ padding: '10px 14px', fontSize: '0.85rem' }}
                            onClick={() => handleViewExistingCertificate(course.id)}
                            id={`view-official-cert-${course.id}`}
                          >
                            🎓 View &amp; Print Official Certificate
                          </button>
                        ) : (
                          <button
                            className="btn btn-secondary btn-block btn-sm"
                            style={{ padding: '10px 14px', fontSize: '0.85rem' }}
                            onClick={() => handleLaunchQuiz(course)}
                          >
                            Pass Quiz to Unlock Certificate ➔
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Section 2: Skill Badges Grid */}
            <div>
              <h3 style={{ fontSize: '1.35rem', color: '#ffffff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span>🛡️</span>
                <span>Earned &amp; Unlockable Skill Badges</span>
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
                {ALL_BADGES.map((badge) => {
                  const ach = achievements.find((a) => a.courseId === badge.courseId);
                  const isUnlocked = Boolean(ach?.badgeEarned);
                  const course = courses.find((c) => c.id === badge.courseId);

                  return (
                    <div
                      key={badge.id}
                      className="glass-card"
                      style={{
                        padding: '20px',
                        textAlign: 'center',
                        border: isUnlocked ? '1.5px solid var(--gold-primary)' : '1px solid var(--border-subtle)',
                        background: isUnlocked
                          ? 'radial-gradient(circle at center top, rgba(212, 160, 23, 0.15) 0%, #0e121a 70%)'
                          : 'rgba(255, 255, 255, 0.01)',
                        opacity: isUnlocked ? 1 : 0.7,
                        transition: 'transform 0.2s ease',
                      }}
                    >
                      {/* Badge Icon Emblem */}
                      <div style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        background: isUnlocked ? 'rgba(212, 160, 23, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                        border: isUnlocked ? '2px solid var(--gold-light)' : '1px solid var(--border-medium)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2rem',
                        margin: '0 auto 12px auto',
                        boxShadow: isUnlocked ? '0 0 20px rgba(212, 160, 23, 0.3)' : 'none',
                        filter: isUnlocked ? 'none' : 'grayscale(1)',
                      }}>
                        {badge.icon}
                      </div>

                      <div style={{ fontWeight: 700, color: isUnlocked ? '#ffffff' : 'var(--text-muted)', fontSize: '0.98rem', marginBottom: '4px' }}>
                        {badge.title}
                      </div>

                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '14px', minHeight: '36px' }}>
                        {badge.description}
                      </div>

                      {isUnlocked ? (
                        <span style={{
                          display: 'inline-block',
                          background: 'rgba(16, 185, 129, 0.15)',
                          color: '#6ee7b7',
                          border: '1px solid rgba(16, 185, 129, 0.3)',
                          padding: '3px 10px',
                          borderRadius: '12px',
                          fontSize: '0.72rem',
                          fontWeight: 700
                        }}>
                          ★ Earned &amp; Verified
                        </span>
                      ) : (
                        <button
                          className="btn btn-secondary btn-sm"
                          style={{ width: '100%', fontSize: '0.75rem' }}
                          onClick={() => course && handleLaunchQuiz(course)}
                        >
                          Take Quiz to Earn
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Profile Tab */}
        {activeSidebarTab === 'profile' && (
          <div className="glass-card" style={{ padding: '36px', maxWidth: '640px' }}>
            {user ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '28px' }}>
                  <div style={{
                    width: '68px',
                    height: '68px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(212, 160, 23, 0.25), rgba(255, 255, 255, 0.05))',
                    border: '2px solid var(--gold-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--gold-light)',
                    boxShadow: '0 0 20px rgba(212, 160, 23, 0.25)',
                    flexShrink: 0
                  }}>
                    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <div>
                    <h2 style={{ fontSize: '1.4rem', color: '#ffffff' }}>{user.name}</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{user.email}</p>
                    <span className={isPro ? 'badge-pro' : 'badge-free'} style={{ marginTop: '6px' }}>
                      {isPro ? '★ Pro Member' : 'Free Plan Student'}
                    </span>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '20px' }}>
                  <h4 style={{ marginBottom: '12px', fontSize: '1rem' }}>Subscription Status (Backend Database)</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '16px' }}>
                    Verified Database Plan:{' '}
                    <strong style={{ color: 'var(--gold-light)' }}>
                      {isPro ? 'Aptivella Pro (Unlimited)' : 'Free Starter Tier'}
                    </strong>
                  </p>
                  {!isPro ? (
                    <button className="btn btn-gold btn-sm" onClick={onOpenPricing}>
                      Upgrade to Pro
                    </button>
                  ) : (
                    <p style={{ fontSize: '0.82rem', color: '#6ee7b7' }}>
                      ✓ Unlimited access to all courses, certification assessments and mentorship confirmed.
                    </p>
                  )}
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1.5px solid var(--border-medium)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  color: 'var(--text-muted)'
                }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <h2 style={{ fontSize: '1.3rem', color: '#ffffff', marginBottom: '8px' }}>
                  No Profile Available
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '24px', maxWidth: '420px', margin: '0 auto 24px' }}>
                  You are currently viewing as a guest. Please log in or create an account to view and manage your profile and subscription.
                </p>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                  <button className="btn btn-gold btn-sm" onClick={() => onOpenAuth('login')}>
                    Log In
                  </button>
                  <button className="btn btn-secondary btn-sm" onClick={() => onOpenAuth('register')}>
                    Create Account
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 6: Settings Tab */}
        {activeSidebarTab === 'settings' && (
          <div className="glass-card" style={{ padding: '36px', maxWidth: '640px' }}>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '20px' }}>Platform Settings</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                <span>Certification Email Verification Notices</span>
                <input type="checkbox" defaultChecked />
              </label>
              <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                <span>Weekly Quiz Readiness Notifications</span>
                <input type="checkbox" defaultChecked />
              </label>
              <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                <span>Dark Obsidian Mode (Active)</span>
                <input type="checkbox" checked readOnly />
              </label>
            </div>
          </div>
        )}
      </main>

      {/* Interactive Quiz Runner Modal */}
      <QuizModal
        isOpen={isQuizModalOpen}
        onClose={() => setIsQuizModalOpen(false)}
        course={quizModalCourse}
        user={user}
        onQuizCompleted={() => {
          loadAchievements();
        }}
        onViewCertificate={(certData) => {
          handleOpenCertificate(certData);
        }}
      />

      {/* Official Verified Certificate Modal */}
      <CertificateModal
        isOpen={isCertificateModalOpen}
        onClose={() => setIsCertificateModalOpen(false)}
        certificateData={certificateModalData}
        userName={user?.name || 'Student'}
      />
    </div>
  );
}
