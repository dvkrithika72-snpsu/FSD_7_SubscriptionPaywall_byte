import React from 'react';

const FEATURES = [
  {
    id: 'roadmaps',
    title: 'Adaptive Skill Tracks',
    description: 'Structured curriculums in full-stack engineering, cloud architecture, and AI development with milestone assessments.',
    tag: 'Core Platform',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/>
        <path d="M6 6h10M6 10h10M6 14h6"/>
      </svg>
    ),
  },
  {
    id: 'mentorship',
    title: 'Expert Code Mentorship',
    description: 'Get deep feedback on course assessments and code implementations from senior engineers across top software ecosystems.',
    tag: 'Interactive',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    id: 'certifications',
    title: 'Verifiable Credentials',
    description: 'Earn cryptographic certificates and verified skill badges directly shareable with hiring partners.',
    tag: 'Credentialing',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="8" r="6"/>
        <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
      </svg>
    ),
  },
  {
    id: 'pro-tier',
    title: 'Pro Accelerator Tier',
    description: 'Unlock unlimited certification exams, digital badges, prioritized mentor sessions, and advanced enterprise study toolkits.',
    tag: 'Membership Ready',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ),
  },
];

export default function Features() {
  return (
    <section className="features-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Built for Accelerating Mastery</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
            APTIVELLA delivers the infrastructure and pedagogy ambitious developers need to level up.
          </p>
        </div>

        <div className="features-grid">
          {FEATURES.map((item) => (
            <article key={item.id} className="feature-card" id={`feature-${item.id}`}>
              <div className="feature-icon-wrapper">
                {item.icon}
              </div>
              <h3 className="feature-title">{item.title}</h3>
              <p className="feature-desc">{item.description}</p>
              <span className="feature-tag">{item.tag}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
