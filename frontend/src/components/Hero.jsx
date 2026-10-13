import React from 'react';
import heroLaptopImg from '../assets/hero_laptop.jpg';

export default function Hero({ onStartLearning, onExploreCourses, onOpenPricing }) {
  return (
    <section className="hero-section" id="hero">
      <div className="container">
        <div className="hero-grid">
          {/* Left Content Column */}
          <div className="hero-content">
            <div className="hero-badge-pill">
              <span className="pill-badge pill-badge-gold">
                <span>✦</span>
                <span>PREMIUM LEARNING PLATFORM</span>
              </span>
            </div>

            <div className="hero-title-brand">APTIVELLA</div>

            <h1 className="hero-headline">
              Learn. Build. <span className="gold-gradient-text">Evolve.</span>
            </h1>

            <p className="hero-tagline">
              Learn skills. Pass quizzes. Earn verified certifications.
            </p>

            <p className="hero-description">
              A premium learning platform where aspiring developers gain practical skills, 
              complete course assessments, and earn accredited certifications and digital badges through a pro subscription.
            </p>

            <div className="hero-cta-group">
              <button
                className="btn btn-gold btn-lg"
                onClick={onStartLearning}
                id="hero-start-learning-btn"
              >
                <span>Start Learning</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>

              <button
                className="btn btn-glass btn-lg"
                onClick={onExploreCourses}
                id="hero-explore-courses-btn"
              >
                Explore Courses
              </button>
            </div>
          </div>

          {/* Right Visual Column (Laptop with Golden Orbit and Floating Badges) */}
          <div className="hero-visual-wrapper">
            <div className="hero-visual-container">
              <img
                src={heroLaptopImg}
                alt="Aptivella modern developer workspace with golden energy orbit"
                className="hero-laptop-image"
              />

              {/* Floating Interactive Badges matching Reference UI */}
              <div className="floating-badge badge-learn" onClick={onStartLearning} role="button" tabIndex={0}>
                <span style={{ fontSize: '1.1rem' }}>🎓</span>
                <span>Learn</span>
              </div>

              <div className="floating-badge badge-build" onClick={onExploreCourses} role="button" tabIndex={0}>
                <span style={{ fontSize: '1rem', color: 'var(--gold-light)' }}>&lt;/&gt;</span>
                <span>Build</span>
              </div>

              <div className="floating-badge badge-evolve" onClick={onOpenPricing} role="button" tabIndex={0}>
                <span style={{ fontSize: '1.1rem' }}>📈</span>
                <span>Evolve</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Feature Section Highlighting Core Pillars */}
        <div className="hero-features-bar">
          <div className="feature-pill-item">
            <div className="feature-pill-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>
            <div className="feature-pill-text">
              <span className="feature-pill-title">Structured Learning</span>
              <span className="feature-pill-desc">Step-by-step, beginner to advanced</span>
            </div>
          </div>

          <div className="feature-pill-item">
            <div className="feature-pill-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="8" r="6" />
                <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
              </svg>
            </div>
            <div className="feature-pill-text">
              <span className="feature-pill-title">Certifications &amp; Badges</span>
              <span className="feature-pill-desc">Earn accredited verified credentials</span>
            </div>
          </div>

          <div className="feature-pill-item">
            <div className="feature-pill-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
                <path d="M6 6h10M6 10h10M6 14h6" />
              </svg>
            </div>
            <div className="feature-pill-text">
              <span className="feature-pill-title">Expert Resources</span>
              <span className="feature-pill-desc">Notes, guides, and more</span>
            </div>
          </div>

          <div 
            className="feature-pill-item"
            style={{ cursor: 'pointer' }}
            onClick={onOpenPricing}
          >
            <div className="feature-pill-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
            <div className="feature-pill-text">
              <span className="feature-pill-title">Pro Subscription</span>
              <span className="feature-pill-desc">Unlock premium content & tools</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
