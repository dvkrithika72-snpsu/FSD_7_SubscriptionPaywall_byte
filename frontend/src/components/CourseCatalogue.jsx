import React, { useState, useMemo } from 'react';
import CourseCard from './CourseCard';

export default function CourseCatalogue({ courses, onSelectCourse, onOpenPricing, isPro }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Popular');

  const filteredCourses = useMemo(() => {
    return courses
      .filter((course) => {
        const matchesQuery =
          course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.tech.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.category.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesLevel =
          selectedLevel === 'All' || course.level.toLowerCase() === selectedLevel.toLowerCase();

        const matchesCategory =
          selectedCategory === 'All' || course.category.toLowerCase() === selectedCategory.toLowerCase();

        return matchesQuery && matchesLevel && matchesCategory;
      })
      .sort((a, b) => {
        if (sortBy === 'Duration') {
          return parseInt(b.duration) - parseInt(a.duration);
        }
        if (sortBy === 'Title') {
          return a.title.localeCompare(b.title);
        }
        // Default Popular / Rating
        return b.rating - a.rating;
      });
  }, [courses, searchQuery, selectedLevel, selectedCategory, sortBy]);

  return (
    <section className="catalogue-section" id="courses-catalogue">
      <div className="container">
        {/* Header Row with Go Pro Banner */}
        <div className="catalogue-header-row">
          <div>
            <h1 className="catalogue-title">Explore Courses</h1>
            <p className="catalogue-subtitle">
              Build in-demand skills with structured, hands-on courses.
            </p>
          </div>

          {/* Go Pro Banner Card matching Reference UI */}
          {!isPro && (
            <div className="go-pro-banner-card">
              <div className="go-pro-content">
                <div className="go-pro-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l2.4 7.4h7.6l-6.2 4.5 2.4 7.4-6.2-4.5-6.2 4.5 2.4-7.4-6.2-4.5h7.6z"/>
                  </svg>
                </div>
                <div>
                  <div className="go-pro-title">Go Pro</div>
                  <div className="go-pro-desc">
                    Get unlimited access to all courses, projects, and premium resources.
                  </div>
                </div>
              </div>

              <button
                className="btn btn-gold btn-sm"
                onClick={onOpenPricing}
                style={{ flexShrink: 0 }}
                id="catalogue-upgrade-now-btn"
              >
                Upgrade Now
              </button>
            </div>
          )}
        </div>

        {/* Search & Filter Bar */}
        <div className="catalogue-filters-bar">
          <div className="search-input-wrapper">
            <svg
              className="search-input-icon"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>

            <input
              type="text"
              className="search-input"
              placeholder="Search for courses, technologies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              id="course-search-input"
            />
          </div>

          <div className="filter-selects-group">
            <select
              className="custom-select"
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              id="filter-level-select"
            >
              <option value="All">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>

            <select
              className="custom-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              id="filter-category-select"
            >
              <option value="All">All Categories</option>
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="Full Stack">Full Stack</option>
              <option value="AI & Machine Learning">AI & Machine Learning</option>
              <option value="DevOps">DevOps & Cloud</option>
              <option value="Architecture">Architecture & System Design</option>
              <option value="Mobile">Mobile Development</option>
              <option value="Security">Cybersecurity</option>
              <option value="Computer Science">Computer Science / DSA</option>
              <option value="Database">Database</option>
              <option value="Languages">Languages</option>
            </select>

            <select
              className="custom-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              id="filter-sort-select"
            >
              <option value="Popular">Popular</option>
              <option value="Duration">Longest Duration</option>
              <option value="Title">Alphabetical</option>
            </select>
          </div>
        </div>

        {/* Course Cards Grid */}
        {filteredCourses.length > 0 ? (
          <div className="courses-grid" id="courses-grid">
            {filteredCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onSelectCourse={onSelectCourse}
                isUserPro={isPro}
              />
            ))}
          </div>
        ) : (
          <div
            className="glass-card"
            style={{ padding: '60px 24px', textAlign: 'center', marginTop: '20px' }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🔍</div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>No matching courses found</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Try searching with different keywords or clearing your active filters.
            </p>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => {
                setSearchQuery('');
                setSelectedLevel('All');
                setSelectedCategory('All');
              }}
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
