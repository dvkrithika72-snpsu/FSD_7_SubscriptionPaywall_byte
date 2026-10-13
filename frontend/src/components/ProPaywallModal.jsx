import React, { useState } from 'react';
import { PRICING_PLANS } from '../data/coursesData';

export default function ProPaywallModal({
  isOpen,
  onClose,
  course,
  user,
  onOpenPricing,
  onOpenAuth,
}) {
  const [selectedPlanId, setSelectedPlanId] = useState('quarterly');

  if (!isOpen) return null;

  const currentCourseTitle = course?.title || 'This Elite Pro Masterclass';

  const handleSelectAndUpgrade = (planId) => {
    setSelectedPlanId(planId);
    if (!user) {
      if (onOpenAuth) onOpenAuth('login');
      return;
    }
    if (onOpenPricing) {
      onOpenPricing(planId);
    }
  };

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        zIndex: 1100,
        backgroundColor: 'rgba(5, 7, 10, 0.88)',
        backdropFilter: 'blur(12px)',
      }}
      role="dialog"
      aria-modal="true"
      id="pro-paywall-modal"
    >
      <div
        className="pro-paywall-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '820px',
          width: '100%',
          position: 'relative',
        }}
      >
        {/* Close Button */}
        <button
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close paywall notification"
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            zIndex: 10,
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Shimmering Ambient Glow Background */}
        <div className="paywall-ambient-glow" />

        {/* Header Section */}
        <div className="paywall-header text-center">
          <div className="paywall-badge-crown">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l2.4 7.4h7.6l-6.2 4.5 2.4 7.4-6.2-4.5-6.2 4.5 2.4-7.4-6.2-4.5h7.6z" />
            </svg>
            <span>APTIVELLA PRO EXCLUSIVE</span>
          </div>

          <h2 className="paywall-title">
            Unlock Full Access to <span className="gold-shimmer-text">{currentCourseTitle}</span>
          </h2>
          <p className="paywall-subtitle">
            This masterclass is part of our verified Pro Curriculum. Upgrade today to start streaming HD video lessons, run code in live playgrounds, and claim your verified certificate.
          </p>
        </div>

        {/* Pricing Cards Showcase */}
        <div className="paywall-plans-grid">
          {PRICING_PLANS.map((plan) => {
            const isSelected = selectedPlanId === plan.id;
            return (
              <div
                key={plan.id}
                className={`paywall-plan-box ${isSelected ? 'active-plan' : ''} ${plan.highlight ? 'popular-plan' : ''}`}
                onClick={() => setSelectedPlanId(plan.id)}
              >
                {plan.badge && (
                  <span className="paywall-plan-tag">
                    {plan.badge}
                  </span>
                )}

                <div className="paywall-plan-name">{plan.name}</div>
                <div className="paywall-plan-price-row">
                  <span className="currency">₹</span>
                  <span className="amount">{plan.priceINR}</span>
                  <span className="period">{plan.periodText}</span>
                </div>
                <div className="paywall-plan-billed">{plan.billedText}</div>

                <ul className="paywall-plan-features">
                  {plan.features.slice(0, 3).map((feat, idx) => (
                    <li key={idx}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--gold-light)" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`btn ${isSelected ? 'btn-gold' : 'btn-secondary'} btn-sm paywall-plan-select-btn`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectAndUpgrade(plan.id);
                  }}
                >
                  {isSelected ? `Get ${plan.name} (₹${plan.priceINR})` : 'Select Plan'}
                </button>
              </div>
            );
          })}
        </div>

        {/* Superpowers Value Proposition */}
        <div className="paywall-perks-row">
          <div className="perk-item">
            <span className="perk-icon">🔓</span>
            <div>
              <strong>All 13+ Courses</strong>
              <p>Frontend, Backend, AI, Cloud & Security</p>
            </div>
          </div>
          <div className="perk-item">
            <span className="perk-icon">💻</span>
            <div>
              <strong>Live Code Playgrounds</strong>
              <p>In-browser runners with instant feedback</p>
            </div>
          </div>
          <div className="perk-item">
            <span className="perk-icon">📜</span>
            <div>
              <strong>Verified Certificates</strong>
              <p>Shareable resume credentials</p>
            </div>
          </div>
          <div className="perk-item">
            <span className="perk-icon">👥</span>
            <div>
              <strong>Mentor Office Hours</strong>
              <p>Weekly 1-on-1 architect reviews</p>
            </div>
          </div>
        </div>

        {/* Bottom CTA Action Bar */}
        <div className="paywall-footer-action">
          {!user ? (
            <div className="paywall-auth-prompt">
              <span>Have an account? </span>
              <button
                className="link-btn-gold"
                onClick={() => {
                  onClose();
                  if (onOpenAuth) onOpenAuth('login');
                }}
              >
                Sign In to Unlock with Pro
              </button>
            </div>
          ) : (
            <div className="paywall-user-status">
              <span>Logged in as <strong>{user.name}</strong> • Test Mode Enabled</span>
            </div>
          )}

          <div className="paywall-cta-group">
            <button
              className="btn btn-secondary btn-md"
              onClick={onClose}
            >
              Maybe Later
            </button>

            <button
              className="btn btn-gold btn-lg paywall-main-upgrade-btn"
              onClick={() => handleSelectAndUpgrade(selectedPlanId)}
              id="paywall-instant-upgrade-btn"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l2.4 7.4h7.6l-6.2 4.5 2.4 7.4-6.2-4.5-6.2 4.5 2.4-7.4-6.2-4.5h7.6z" />
              </svg>
              <span>
                Upgrade to Pro (₹{PRICING_PLANS.find((p) => p.id === selectedPlanId)?.priceINR || '999'})
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
