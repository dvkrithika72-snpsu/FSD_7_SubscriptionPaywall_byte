import React, { useState, useEffect } from 'react';
import TechIcon from './TechIcon';
import heroLaptopImg from '../assets/hero_laptop.jpg';
import { verifyCourseAccess } from '../services/api';
import { getQuizForCourse } from '../data/quizzesAndCertificates';
import QuizModal from './QuizModal';
import CertificateModal from './CertificateModal';

export default function CourseDetails({
  course,
  onBack,
  onOpenPricing,
  onStartLearning,
  onOpenPaywall,
  user,
}) {
  const [activeTab, setActiveTab] = useState('Overview');
  const [savedForLater, setSavedForLater] = useState(false);
  const [expandedModuleId, setExpandedModuleId] = useState(1);
  const [backendAccess, setBackendAccess] = useState({
    checked: false,
    accessible: !course?.isPro,
    reason: course?.isPro ? 'checking' : 'free_course',
  });

  // Modal states for quizzes and certificates
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [certModalData, setCertModalData] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function checkAccess() {
      if (!course) return;
      const res = await verifyCourseAccess(course.id);
      if (isMounted) {
        setBackendAccess({
          checked: true,
          accessible: res.accessible,
          reason: res.reason,
        });
      }
    }
    checkAccess();
    return () => { isMounted = false; };
  }, [course, user]);

  if (!course) return null;

  // Premium access strictly depends on backend authorization
  const isLocked = course.isPro && !backendAccess.accessible;
  const quiz = getQuizForCourse(course.id);

  const handleLaunchLearning = (mIdx = 0, lIdx = 0) => {
    if (isLocked) {
      if (onOpenPaywall) onOpenPaywall(course);
      else if (onOpenPricing) onOpenPricing();
    } else {
      if (onStartLearning) onStartLearning(course, mIdx, lIdx);
    }
  };

  const handleLaunchQuiz = () => {
    if (isLocked) {
      if (onOpenPaywall) onOpenPaywall(course);
      else if (onOpenPricing) onOpenPricing();
      return;
    }
    setIsQuizModalOpen(true);
  };

  const handleOpenCertificate = (certData) => {
    setCertModalData(certData);
    setIsCertModalOpen(true);
  };

  return (
    <section className="course-details-page">
      <div className="container">
        {/* Back Link */}
        <button
          className="back-btn"
          onClick={onBack}
          aria-label="Back to courses catalogue"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m15 18-6-6 6-6" />
          </svg>
          <span>Back to Courses</span>
        </button>

        {/* Hero Banner Grid */}
        <div className="course-hero-banner">
          <div className="hero-banner-content">
            {/* Meta Tags */}
            <div className="hero-meta-row">
              <span className="category-pill">{course.category}</span>
              <span className="category-pill">{course.level}</span>
              {course.isPro ? (
                <span className="badge-pro">★ Pro Subscription</span>
              ) : (
                <span className="badge-free">Free Course</span>
              )}
            </div>

            {/* Title */}
            <h1 className="course-hero-title">{course.title}</h1>

            {/* Description */}
            <p className="course-hero-desc">
              {course.fullDescription || course.shortDescription}
            </p>

            {/* Instructor & Rating row */}
            <div className="instructor-meta-row">
              <span className="instructor-name">Instructor: {course.instructor}</span>
              <span className="rating-pill">★ {course.rating || 4.9}</span>
              <span className="enrolled-pill">{course.enrolledCount} enrolled</span>
              <span className="updated-pill">Updated {course.updatedAt || 'October 2026'}</span>
            </div>

            {/* Primary Action Buttons */}
            <div className="hero-actions-row">
              {isLocked ? (
                <button
                  className="btn btn-gold"
                  onClick={() => {
                    if (onOpenPaywall) onOpenPaywall(course);
                    else onOpenPricing();
                  }}
                  id="course-unlock-pro-btn"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <span>Unlock with Pro (₹399/mo)</span>
                </button>
              ) : (
                <button
                  className="btn btn-gold"
                  onClick={() => handleLaunchLearning(0, 0)}
                  id="course-start-reading-btn"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
                    <path d="M6 6h10M6 10h10M6 14h6" />
                  </svg>
                  <span>Start Learning Course Notes ➔</span>
                </button>
              )}

              <button
                className="btn btn-secondary"
                onClick={handleLaunchQuiz}
                id="course-hero-quiz-btn"
              >
                <span>📝 Course Quiz</span>
              </button>

              <button
                className={`btn btn-secondary ${savedForLater ? 'active' : ''}`}
                onClick={() => setSavedForLater(!savedForLater)}
                aria-label="Save for later"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill={savedForLater ? 'var(--gold-primary)' : 'none'} stroke="currentColor" strokeWidth="2">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                </svg>
                <span>{savedForLater ? 'Saved' : 'Save for Later'}</span>
              </button>
            </div>
          </div>

          {/* Right Column: Interactive Study Material Card */}
          <div className="hero-banner-visual">
            <div className="study-guide-preview-card">
              <div className="study-guide-cover-wrap">
                <img
                  src={heroLaptopImg}
                  alt={course.title}
                  className="study-guide-cover-img"
                />
                <div className="study-guide-badge-overlay">
                  <TechIcon tech={course.tech} size={28} />
                  <span>Interactive Notes</span>
                </div>
              </div>

              <div className="study-guide-card-content">
                <div className="study-guide-header">
                  <span className="study-guide-tag">Course Curriculum</span>
                  <h3 className="study-guide-title">{course.title} Study Guide</h3>
                  <p className="study-guide-summary">
                    Includes detailed module notes, comparison tables, code playgrounds, interview Q&amp;A, and certification assessment.
                  </p>

                  <div className="study-guide-highlights">
                    <div className="highlight-item">
                      <span className="hl-icon">📝</span>
                      <span>{course.modulesCount || course.modules?.length} Modules of Study Notes</span>
                    </div>
                    <div className="highlight-item">
                      <span className="hl-icon">⚡</span>
                      <span>Real-time Code Playground &amp; Sandbox</span>
                    </div>
                    <div className="highlight-item">
                      <span className="hl-icon">🏆</span>
                      <span>Accredited Quiz &amp; Verified Certificate</span>
                    </div>
                  </div>
                </div>

                <div className="study-guide-footer">
                  <button
                    className="btn btn-gold btn-block"
                    onClick={() => handleLaunchLearning(0, 0)}
                    id="enter-notes-reader-btn"
                  >
                    <span>{isLocked ? '🔒 Unlock Course Notes' : 'Open Notes Reader ➔'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="details-tabs-bar">
          {['Overview', 'Modules & Syllabus', 'Course Quiz', 'Certifications & Badges'].map((tab) => (
            <button
              key={tab}
              className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
              id={`tab-${tab.toLowerCase().replace(/[^a-z]/g, '')}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'Overview' && (
          <div className="details-content-grid">
            {/* Left: What You'll Learn Checklist */}
            <div className="glass-card learn-checklist-card">
              <h3 className="checklist-title">What you'll learn</h3>
              <ul className="checklist-items">
                {course.whatYouWillLearn?.map((item, index) => (
                  <li key={index} className="checklist-item">
                    <svg className="check-icon-gold" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: Course Includes + Showcase Card */}
            <div>
              <div className="glass-card course-includes-card">
                <h3 className="includes-title">Course Includes</h3>
                <ul className="includes-list">
                  {course.courseIncludes?.map((item, idx) => (
                    <li key={idx} className="includes-item">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--gold-light)" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      <span>{item}</span>
                    </li>
                  ))}
                  <li className="includes-item">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--gold-light)" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span>Official Verified Certificate &amp; Digital Badge</span>
                  </li>
                </ul>
              </div>

              <div className="showcase-gold-card">
                <svg className="showcase-icon" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <div>
                  <h4 className="showcase-title">Accredited Verification</h4>
                  <p className="showcase-desc">
                    Score 80% or higher on the official course assessment to earn verified credentials to showcase on LinkedIn and resume.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Modules & Syllabus */}
        {activeTab === 'Modules & Syllabus' && (
          <div className="modules-accordion">
            {course.modules?.map((mod, mIdx) => (
              <div
                key={mod.id || mIdx}
                className="module-row"
                onClick={() => setExpandedModuleId(expandedModuleId === (mod.id || mIdx) ? null : (mod.id || mIdx))}
              >
                <div style={{ flex: 1 }}>
                  <div className="module-info">
                    <span style={{ color: 'var(--gold-light)', fontWeight: 700, fontSize: '0.9rem' }}>
                      #{mod.id || mIdx + 1}
                    </span>
                    <span className="module-title">{mod.title}</span>
                  </div>

                  {expandedModuleId === (mod.id || mIdx) && (
                    <div style={{ marginTop: '14px', paddingLeft: '28px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {(mod.lessons || Array.from({ length: mod.lessonsCount || 4 })).map((lesson, lIdx) => {
                        const lessonTitle = lesson?.title || `Lesson ${lIdx + 1}: ${mod.title}`;
                        const lessonDuration = lesson?.duration || '15:20';
                        return (
                          <div
                            key={lIdx}
                            className="interactive-lesson-launch-row"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLaunchLearning(mIdx, lIdx);
                            }}
                          >
                            <span className="lesson-launch-title">📖 {lessonTitle}</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                {lessonDuration.includes('read') ? lessonDuration : `${lessonDuration.split(':')[0] || '15'} min read`}
                              </span>
                              <span className="lesson-launch-action">
                                {isLocked ? '🔒 Unlock' : 'Read Notes ➔'}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="module-meta">
                  <span>{mod.duration || '1h 30m'}</span>
                  {isLocked && (
                    <span className="badge-pro" style={{ marginLeft: '12px' }}>
                      Pro Locked
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Course Quiz (Replaces Projects) */}
        {activeTab === 'Course Quiz' && (
          <div className="glass-card" style={{ padding: '36px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', marginBottom: '24px' }}>
              <div>
                <span className="badge-free" style={{ textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', display: 'inline-block' }}>
                  Official Course Exam
                </span>
                <h3 style={{ fontSize: '1.6rem', color: '#ffffff', margin: '4px 0' }}>
                  {quiz?.title || `${course.title} Certification Assessment`}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', maxWidth: '600px', lineHeight: 1.6 }}>
                  Evaluate your technical mastery across the full curriculum of {course.title}. Achieving a passing score of <strong style={{ color: 'var(--gold-light)' }}>{quiz?.passingScore || 80}%</strong> immediately confers verified certification and a digital specialist badge.
                </p>
              </div>

              <button
                className="btn btn-gold btn-lg"
                onClick={handleLaunchQuiz}
                id="launch-course-assessment-btn"
              >
                <span>Start Assessment (5 MCQs) ➔</span>
              </button>
            </div>

            {/* Assessment Format Highlights */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '16px',
              padding: '20px',
              background: 'rgba(255, 255, 255, 0.02)',
              borderRadius: '12px',
              border: '1px solid var(--border-subtle)',
              marginBottom: '28px'
            }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>QUESTION FORMAT</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', marginTop: '2px' }}>
                  {quiz?.questions.length || 5} Multiple Choice
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>PASSING THRESHOLD</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--gold-light)', marginTop: '2px' }}>
                  {quiz?.passingScore || 80}% (4 of 5 correct)
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>RETAKE POLICY</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#6ee7b7', marginTop: '2px' }}>
                  Unlimited Retakes
                </div>
              </div>
            </div>

            {/* Reward Preview Grid */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              padding: '20px 24px',
              background: 'linear-gradient(135deg, rgba(212, 160, 23, 0.1) 0%, rgba(10, 12, 17, 0.7) 100%)',
              border: '1px solid rgba(212, 160, 23, 0.3)',
              borderRadius: '12px',
            }}>
              <span style={{ fontSize: '2.5rem' }}>{quiz?.badge.icon || '🎓'}</span>
              <div>
                <h4 style={{ color: 'var(--gold-light)', fontSize: '1.1rem', margin: 0 }}>
                  Earn: {quiz?.badge.title || 'Course Specialist Badge'} &amp; Official Certificate
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
                  {quiz?.badge.description || 'Awarded upon passing the final assessment with verified distinction.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Certifications & Badges (Replaces Resources) */}
        {activeTab === 'Certifications & Badges' && (
          <div className="glass-card" style={{ padding: '36px' }}>
            <h3 style={{ fontSize: '1.4rem', color: '#ffffff', marginBottom: '8px' }}>
              Credentials &amp; Recognition for {course.title}
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '28px' }}>
              Upon mastering the study notes and passing the course quiz, you receive verified credentials issued directly by APTIVELLA.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
              {/* Certificate Card */}
              <div style={{
                background: 'linear-gradient(145deg, #0d1017 0%, #06070a 100%)',
                border: '2px solid rgba(212, 160, 23, 0.5)',
                borderRadius: '12px',
                padding: '28px',
                position: 'relative'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--gold-light)', letterSpacing: '1px' }}>
                    {quiz?.certificate.courseCode || 'APT-CERT'}
                  </span>
                  <span className="badge-pro" style={{ fontSize: '0.68rem' }}>
                    Official Credential
                  </span>
                </div>

                <h4 style={{ color: '#ffffff', fontSize: '1.25rem', marginBottom: '8px' }}>
                  {quiz?.certificate.title || 'Certified Course Architect'}
                </h4>

                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '20px' }}>
                  Official credential issued directly by APTIVELLA with permanent verification ID, online verification link, and PDF export.
                </p>

                <button
                  className="btn btn-gold btn-block btn-sm"
                  onClick={handleLaunchQuiz}
                >
                  Take Quiz to Earn Certificate ➔
                </button>
              </div>

              {/* Digital Badge Card */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-medium)',
                borderRadius: '12px',
                padding: '28px',
                textAlign: 'center'
              }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'rgba(212, 160, 23, 0.15)',
                  border: '2px solid var(--gold-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2.2rem',
                  margin: '0 auto 16px auto',
                  boxShadow: '0 0 20px rgba(212, 160, 23, 0.25)'
                }}>
                  {quiz?.badge.icon || '🏅'}
                </div>

                <h4 style={{ color: '#ffffff', fontSize: '1.15rem', marginBottom: '6px' }}>
                  {quiz?.badge.title || 'Course Specialist Badge'}
                </h4>

                <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', lineHeight: 1.5, marginBottom: '18px' }}>
                  {quiz?.badge.description || 'Awarded for demonstrating algorithmic and architectural excellence.'}
                </p>

                <div style={{ fontSize: '0.78rem', color: 'var(--gold-light)', fontWeight: 600 }}>
                  Criteria: Score ≥ {quiz?.passingScore || 80}% on Course Quiz
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Quiz Runner Modal */}
      <QuizModal
        isOpen={isQuizModalOpen}
        onClose={() => setIsQuizModalOpen(false)}
        course={course}
        user={user}
        onViewCertificate={(certData) => {
          handleOpenCertificate(certData);
        }}
      />

      {/* Official Verified Certificate Modal */}
      <CertificateModal
        isOpen={isCertModalOpen}
        onClose={() => setIsCertModalOpen(false)}
        certificateData={certModalData}
        userName={user?.name || 'Student'}
      />
    </section>
  );
}
