import React from 'react';
import { API_BASE_URL } from '../services/api';

export default function HealthCheckCard({ healthState, onRefresh }) {
  const { loading, ok, data, error, latencyMs, lastChecked } = healthState;

  return (
    <div className="glass-card" style={{ padding: '24px' }} id="health-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff' }}>API Health Diagnostics</h2>
          <div
            id="health-badge"
            className={`backend-status-pill ${loading ? 'loading' : ok ? 'online' : 'offline'}`}
          >
            <span className={`status-dot ${loading ? 'loading' : ok ? 'online' : 'offline'}`}></span>
            <span>
              {loading ? 'Testing...' : ok ? 'API Online' : 'API Offline'}
            </span>
          </div>
        </div>

        <button
          id="refresh-health-btn"
          className="btn btn-secondary btn-sm"
          onClick={onRefresh}
          disabled={loading}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
          </svg>
          <span>{loading ? 'Pinging...' : 'Ping Server'}</span>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '14px', marginBottom: '16px' }}>
        <div style={{ padding: '12px 14px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Target Endpoint</div>
          <div style={{ fontSize: '0.9rem', color: 'var(--gold-light)', fontWeight: 600, marginTop: '2px' }}>
            /api/health
          </div>
        </div>

        <div style={{ padding: '12px 14px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Roundtrip Latency</div>
          <div style={{ fontSize: '0.95rem', color: ok ? '#6ee7b7' : 'var(--text-muted)', fontWeight: 700, marginTop: '2px' }} id="stat-latency">
            {latencyMs !== null ? `${latencyMs} ms` : '—'}
          </div>
        </div>

        <div style={{ padding: '12px 14px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Server Uptime</div>
          <div style={{ fontSize: '0.95rem', color: '#ffffff', fontWeight: 600, marginTop: '2px' }} id="stat-uptime">
            {data?.uptime !== undefined ? `${data.uptime}s` : '—'}
          </div>
        </div>

        <div style={{ padding: '12px 14px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Environment</div>
          <div style={{ fontSize: '0.95rem', color: '#ffffff', fontWeight: 600, marginTop: '2px' }} id="stat-env">
            {data?.environment || '—'}
          </div>
        </div>
      </div>

      {error && (
        <div style={{
          padding: '12px 16px',
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: 'var(--radius-sm)',
          color: '#fca5a5',
          fontSize: '0.84rem',
          marginBottom: '14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px'
        }}>
          <strong style={{ color: '#ef4444' }}>Backend Connection Note:</strong>
          <span>{error}</span>
          <small style={{ color: 'var(--text-secondary)' }}>
            Start the Express backend on port 5000 using <code>npm run dev:backend</code> or <code>cd backend && npm run dev</code>.
          </small>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
        <span>API Base URL: <code>{API_BASE_URL}</code></span>
        <span>Last checked: {lastChecked ? lastChecked.toLocaleTimeString() : 'Never'}</span>
      </div>
    </div>
  );
}
