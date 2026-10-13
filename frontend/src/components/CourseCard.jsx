import React from 'react';
import TechIcon from './TechIcon';

export default function CourseCard({ course, onSelectCourse, isUserPro }) {
  const { id, title, level, tech, modulesCount, duration, isPro, shortDescription, rating, enrolledCount } = course;

  const levelClass = level.toLowerCase();
  const unlocked = !isPro || isUserPro;

  return (
    <article
      className={`glass-card glass-card-hover course-card ${isPro ? 'pro-themed-card' : ''}`}
      id={`course-card-${id}`}
      onClick={() => onSelectCourse(course)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') onSelectCourse(course); }}
    >
      {/* Top Banner for Pro vs Free */}
      <div className="course-card-top">
        <div className="tech-icon-box" title={tech}>
          <TechIcon tech={tech} size={28} />
        </div>

        <div className="course-badges-group">
          <span className={`badge-level ${levelClass}`}>
            {level}
          </span>

          {isPro ? (
            <span className="badge-pro glow-pulse-subtle" title="Requires Pro Subscription">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l2.4 7.4h7.6l-6.2 4.5 2.4 7.4-6.2-4.5-6.2 4.5 2.4-7.4-6.2-4.5h7.6z"/>
              </svg>
              <span>Pro • from ₹399/mo</span>
            </span>
          ) : (
            <span className="badge-free" title="Free Access">
              ✨ Free
            </span>
          )}
        </div>
      </div>

      <h3 className="course-title">{title}</h3>
      <p className="course-description">{shortDescription}</p>

      {/* Ratings and Stats row */}
      <div className="course-stats-mini-row">
        <span className="course-rating">
          ★ {rating || 4.9}
        </span>
        <span className="course-enrolled-txt">
          {enrolledCount || '12,500'} learners
        </span>
      </div>

      <div className="course-footer">
        <div className="course-meta">
          <span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="4" y="4" width="16" height="16" rx="2" />
              <line x1="9" y1="9" x2="15" y2="9" />
              <line x1="9" y1="13" x2="15" y2="13" />
            </svg>
            {modulesCount} modules
          </span>
          <span>•</span>
          <span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            {duration}
          </span>
        </div>

        <button
          className={`course-action-cta-btn ${unlocked ? 'btn-cta-learn' : 'btn-cta-unlock'}`}
          aria-label={unlocked ? `Start Learning ${title}` : `Unlock ${title} with Pro`}
          onClick={(e) => {
            e.stopPropagation();
            onSelectCourse(course);
          }}
        >
          {unlocked ? (
            <span>Start Learning ➔</span>
          ) : (
            <span>Unlock Pro 🔒</span>
          )}
        </button>
      </div>
    </article>
  );
}
