import React, { useState } from 'react';
import { registerUser, loginUser } from '../services/api';
import BrandLogo from './BrandLogo';

export default function AuthModal({ isOpen, onClose, initialMode = 'login', onAuthSuccess, promptReason }) {
  const [mode, setMode] = useState(initialMode); // 'login' or 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    // Client-side quick validation before submission
    if (!email.trim() || !password) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (mode === 'register') {
      if (!name.trim() || name.trim().length < 2) {
        setErrorMessage('Full name must be at least 2 characters long.');
        return;
      }
      if (password.length < 6) {
        setErrorMessage('Password must be at least 6 characters long.');
        return;
      }
    }

    setLoading(true);

    try {
      let result;
      if (mode === 'register') {
        result = await registerUser({
          name: name.trim(),
          email: email.trim(),
          password,
        });
      } else {
        result = await loginUser({
          email: email.trim(),
          password,
        });
      }

      if (result.ok && result.user) {
        onAuthSuccess(result.user);
        onClose();
        // Clear form
        setName('');
        setEmail('');
        setPassword('');
        setErrorMessage(null);
      } else {
        setErrorMessage(result.error || 'Authentication request failed.');
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setErrorMessage(null);
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="glass-card auth-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close authentication modal"
          id="close-auth-modal-btn"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Brand Header */}
        <div className="auth-header-wrapper">
          <div style={{ display: 'inline-block', marginBottom: '12px' }}>
            <BrandLogo />
          </div>
          <h2 className="auth-title">
            {mode === 'login' ? 'Welcome Back' : 'Create Your Account'}
          </h2>
          <p className="auth-subtitle">
            {mode === 'login'
              ? 'Sign in to access your roadmaps, projects, and learning stats'
              : 'Join Aptivella and accelerate your software engineering journey'}
          </p>
        </div>

        {/* Prompt Reason Banner (e.g. Please login first then start learning) */}
        {promptReason && (
          <div className="auth-reason-banner" id="auth-reason-banner">
            <span className="auth-reason-icon">🔒</span>
            <span>{promptReason}</span>
          </div>
        )}

        {/* Tab Switcher */}
        <div className="auth-tabs-group">
          <button
            type="button"
            className={`auth-tab-pill ${mode === 'login' ? 'active' : ''}`}
            onClick={() => switchMode('login')}
            id="tab-switch-login"
          >
            Sign In
          </button>
          <button
            type="button"
            className={`auth-tab-pill ${mode === 'register' ? 'active' : ''}`}
            onClick={() => switchMode('register')}
            id="tab-switch-register"
          >
            Register
          </button>
        </div>

        {/* Error Alert Display */}
        {errorMessage && (
          <div className="auth-alert-danger" id="auth-error-alert">
            <span style={{ color: '#ef4444', fontWeight: 700 }}>⚠</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Authentication Form */}
        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div className="form-group">
              <label htmlFor="auth-name-input" className="form-label">
                Full Name
              </label>
              <input
                id="auth-name-input"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="form-input"
                autoComplete="name"
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="auth-email-input" className="form-label">
              Email Address
            </label>
            <input
              id="auth-email-input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input"
              autoComplete="email"
            />
          </div>

          <div className="form-group" style={{ marginBottom: '22px' }}>
            <label htmlFor="auth-password-input" className="form-label">
              Password
            </label>
            <input
              id="auth-password-input"
              type="password"
              placeholder={mode === 'register' ? 'At least 6 characters' : 'Enter your password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
              autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
            />
          </div>

          <button
            type="submit"
            className="btn btn-gold btn-lg"
            style={{ width: '100%', marginBottom: '14px' }}
            disabled={loading}
            id="auth-submit-btn"
          >
            {loading ? (
              <span>Processing...</span>
            ) : mode === 'login' ? (
              <span>Sign In to APTIVELLA</span>
            ) : (
              <span>Create Free Account</span>
            )}
          </button>
        </form>

        {/* Footer Info */}
        <div className="auth-footer-prompt">
          {mode === 'login' ? (
            <span>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => switchMode('register')}
                className="auth-switch-link"
              >
                Sign Up
              </button>
            </span>
          ) : (
            <span>
              Already registered?{' '}
              <button
                type="button"
                onClick={() => switchMode('login')}
                className="auth-switch-link"
              >
                Sign In
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
