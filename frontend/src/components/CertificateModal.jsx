import React, { useState } from 'react';

/**
 * Modern SVG QR Code Pattern generator for verified credentials
 */
function CredentialQRCode({ value, size = 72 }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '6px',
        background: '#ffffff',
        borderRadius: '6px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
      }}
      title={`Verify at ${value}`}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="#0b0f17"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block' }}
      >
        {/* Top-Left Finder Square */}
        <rect x="6" y="6" width="28" height="28" fill="#0b0f17" rx="2" />
        <rect x="11" y="11" width="18" height="18" fill="#ffffff" rx="1" />
        <rect x="15" y="15" width="10" height="10" fill="#0b0f17" rx="1" />

        {/* Top-Right Finder Square */}
        <rect x="66" y="6" width="28" height="28" fill="#0b0f17" rx="2" />
        <rect x="71" y="11" width="18" height="18" fill="#ffffff" rx="1" />
        <rect x="75" y="15" width="10" height="10" fill="#0b0f17" rx="1" />

        {/* Bottom-Left Finder Square */}
        <rect x="6" y="66" width="28" height="28" fill="#0b0f17" rx="2" />
        <rect x="11" y="71" width="18" height="18" fill="#ffffff" rx="1" />
        <rect x="15" y="75" width="10" height="10" fill="#0b0f17" rx="1" />

        {/* Alignment & Timing Patterns */}
        <rect x="42" y="8" width="5" height="5" />
        <rect x="52" y="8" width="5" height="5" />
        <rect x="8" y="42" width="5" height="5" />
        <rect x="8" y="52" width="5" height="5" />

        {/* Data Matrix Dots */}
        <rect x="40" y="20" width="6" height="6" />
        <rect x="50" y="24" width="6" height="6" />
        <rect x="44" y="36" width="6" height="6" />
        <rect x="54" y="40" width="6" height="6" />
        <rect x="22" y="44" width="6" height="6" />
        <rect x="32" y="44" width="6" height="6" />
        <rect x="64" y="44" width="6" height="6" />
        <rect x="74" y="40" width="6" height="6" />
        <rect x="84" y="46" width="6" height="6" />

        <rect x="40" y="52" width="6" height="6" />
        <rect x="52" y="56" width="6" height="6" />
        <rect x="62" y="56" width="6" height="6" />
        <rect x="74" y="56" width="6" height="6" />
        <rect x="84" y="64" width="6" height="6" />

        <rect x="42" y="68" width="6" height="6" />
        <rect x="52" y="72" width="6" height="6" />
        <rect x="64" y="72" width="6" height="6" />
        <rect x="44" y="82" width="6" height="6" />
        <rect x="54" y="86" width="6" height="6" />
        <rect x="68" y="84" width="6" height="6" />
        <rect x="80" y="80" width="6" height="6" />
        <rect x="84" y="88" width="6" height="6" />

        {/* Center Tech Logo Stamp */}
        <circle cx="50" cy="50" r="11" fill="#ffffff" />
        <polygon points="50,42 58,56 42,56" fill="#d4a017" />
      </svg>
      <span style={{ fontSize: '0.45rem', fontWeight: 800, color: '#0b0f17', letterSpacing: '0.5px', marginTop: '2px', textTransform: 'uppercase' }}>
        SCAN TO VERIFY
      </span>
    </div>
  );
}

export default function CertificateModal({
  isOpen,
  onClose,
  certificateData,
  userName = 'Student',
}) {
  const [toastMsg, setToastMsg] = useState('');

  if (!isOpen || !certificateData) return null;

  const {
    courseTitle = 'React for Beginners',
    certificateId = 'APT-2026-REACT-49120',
    issuedAt = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    badgeIcon = '⚛️',
    badgeTitle = 'Verified Specialist',
    score = 100,
    skills = [
      'Component Architecture',
      'Hooks & Reactive State',
      'Virtual DOM & Lifecycle',
      'Modern JSX & Reconciliation'
    ],
  } = certificateData;

  const verificationUrl = `https://aptivella.io/verify/${certificateId}`;

  // Direct LinkedIn Certification Integration URL
  const now = new Date();
  const linkedInAddUrl = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(
    badgeTitle || courseTitle
  )}&organizationName=Aptivella&issueYear=${now.getFullYear()}&issueMonth=${
    now.getMonth() + 1
  }&certId=${encodeURIComponent(certificateId)}&certUrl=${encodeURIComponent(
    verificationUrl
  )}`;

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleCopyId = () => {
    navigator.clipboard?.writeText(certificateId);
    showToast('Credential ID copied to clipboard!');
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(verificationUrl);
    showToast('Verification URL copied to clipboard!');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 1100 }}>
      <div
        className="certificate-modal-container"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '920px',
          width: '95%',
          maxHeight: '94vh',
          overflowY: 'auto',
          background: '#090b10',
          border: '1px solid rgba(212, 160, 23, 0.45)',
          borderRadius: '16px',
          boxShadow: '0 30px 80px rgba(0, 0, 0, 0.95), 0 0 40px rgba(212, 160, 23, 0.25)',
          padding: '18px 22px',
          position: 'relative',
        }}
      >
        {/* Toast Feedback */}
        {toastMsg && (
          <div
            style={{
              position: 'fixed',
              top: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: '#10b981',
              color: '#ffffff',
              padding: '10px 20px',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.88rem',
              zIndex: 1200,
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span>✓</span>
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Top Header Actions (Hidden in Print) */}
        <div
          className="cert-no-print"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '14px',
            paddingBottom: '12px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            flexWrap: 'wrap',
            gap: '10px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.25rem' }}>🏆</span>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#ffffff', fontWeight: 700 }}>
                APTIVELLA Verified Credential
              </h3>
              <p style={{ margin: 0, fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                Credential ID: <span style={{ color: 'var(--gold-light)', fontFamily: 'monospace' }}>{certificateId}</span>
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Add to LinkedIn Profile Button */}
            <a
              href={linkedInAddUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-sm"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                borderColor: '#0a66c2',
                color: '#60a5fa',
                padding: '6px 12px',
                fontSize: '0.8rem'
              }}
              title="Add this verified credential directly to your LinkedIn profile"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
              <span>Add to LinkedIn</span>
            </a>

            <button
              className="btn btn-secondary btn-sm"
              onClick={handleCopyLink}
              title="Copy Public Verification Link"
              style={{ padding: '6px 12px', fontSize: '0.8rem' }}
            >
              🔗 Share Link
            </button>
            <button
              className="btn btn-secondary btn-sm"
              onClick={handleCopyId}
              title="Copy Credential ID"
              style={{ padding: '6px 12px', fontSize: '0.8rem' }}
            >
              📋 Copy ID
            </button>
            <button
              className="btn btn-gold btn-sm"
              onClick={handlePrint}
              id="print-certificate-btn"
              style={{ padding: '6px 14px', fontSize: '0.8rem' }}
            >
              🖨️ Print / Save PDF
            </button>
            <button
              className="modal-close-btn"
              onClick={onClose}
              aria-label="Close Certificate"
              style={{ position: 'static' }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Printable Authentic Tech Certificate Frame */}
        <div
          id="printable-certificate"
          className="certificate-frame"
          style={{
            background: 'linear-gradient(155deg, #0d111a 0%, #06080d 50%, #0d111a 100%)',
            border: '2px solid rgba(212, 160, 23, 0.65)',
            borderRadius: '12px',
            padding: '28px 36px',
            position: 'relative',
            color: '#f8fafc',
            textAlign: 'center',
            boxShadow: 'inset 0 0 50px rgba(212, 160, 23, 0.08)',
          }}
        >
          {/* Outer Decorative Security Border Inset */}
          <div
            style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              right: '10px',
              bottom: '10px',
              border: '1px solid rgba(212, 160, 23, 0.25)',
              borderRadius: '8px',
              pointerEvents: 'none',
            }}
          />

          {/* Corner Security Accents */}
          <div style={{ position: 'absolute', top: '14px', left: '14px', color: 'var(--gold-light)', fontSize: '0.9rem', opacity: 0.7, pointerEvents: 'none' }}>✦</div>
          <div style={{ position: 'absolute', top: '14px', right: '14px', color: 'var(--gold-light)', fontSize: '0.9rem', opacity: 0.7, pointerEvents: 'none' }}>✦</div>
          <div style={{ position: 'absolute', bottom: '14px', left: '14px', color: 'var(--gold-light)', fontSize: '0.9rem', opacity: 0.7, pointerEvents: 'none' }}>✦</div>
          <div style={{ position: 'absolute', bottom: '14px', right: '14px', color: 'var(--gold-light)', fontSize: '0.9rem', opacity: 0.7, pointerEvents: 'none' }}>✦</div>

          {/* Authentic Platform Branding */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
            <span style={{ fontSize: '1.4rem', color: 'var(--gold-light)', filter: 'drop-shadow(0 0 6px rgba(212,160,23,0.5))' }}>
              ▲
            </span>
            <span
              style={{
                fontSize: '1.6rem',
                fontWeight: 900,
                letterSpacing: '4px',
                color: '#ffffff',
                textTransform: 'uppercase',
              }}
            >
              APTIVELLA
            </span>
          </div>

          <div
            style={{
              fontSize: '0.7rem',
              letterSpacing: '2.5px',
              textTransform: 'uppercase',
              color: 'var(--gold-light)',
              marginBottom: '16px',
              fontWeight: 700,
            }}
          >
            Verified Developer Skill Credential &bull; Assessment Registry
          </div>

          {/* Certificate Headline */}
          <h1
            style={{
              fontSize: '1.55rem',
              fontWeight: 800,
              color: '#ffffff',
              letterSpacing: '2px',
              margin: '0 0 6px 0',
              textTransform: 'uppercase',
            }}
          >
            Certificate of Achievement
          </h1>

          <p
            style={{
              fontSize: '0.78rem',
              color: 'var(--text-secondary)',
              letterSpacing: '1px',
              marginBottom: '8px',
              textTransform: 'uppercase',
              fontWeight: 500,
            }}
          >
            This official credential confirms that
          </p>

          {/* Student Recipient Name */}
          <div
            style={{
              fontSize: '1.95rem',
              fontWeight: 700,
              color: 'var(--gold-light)',
              padding: '2px 24px',
              borderBottom: '2px solid rgba(212, 160, 23, 0.65)',
              display: 'inline-block',
              marginBottom: '10px',
              minWidth: '280px',
              letterSpacing: '0.5px',
              textShadow: '0 0 20px rgba(212, 160, 23, 0.25)',
            }}
          >
            {userName}
          </div>

          {/* Achievement Description */}
          <p
            style={{
              fontSize: '0.86rem',
              color: 'var(--text-secondary)',
              maxWidth: '680px',
              margin: '0 auto 10px auto',
              lineHeight: 1.5,
            }}
          >
            has demonstrated validated technical competency in the curriculum and passed the proctored knowledge assessment with an evaluation score of{' '}
            <strong style={{ color: '#10b981', fontWeight: 800 }}>{score}%</strong>, earning verified developer certification in:
          </p>

          {/* Course / Certification Title */}
          <div
            style={{
              fontSize: '1.38rem',
              fontWeight: 800,
              color: '#ffffff',
              letterSpacing: '0.5px',
              marginBottom: '12px',
              textTransform: 'uppercase',
            }}
          >
            {courseTitle}
          </div>

          {/* Verified Engineering Competencies Strip */}
          {skills && skills.length > 0 && (
            <div style={{ marginBottom: '18px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                  gap: '6px',
                  maxWidth: '700px',
                  margin: '0 auto',
                }}
              >
                {skills.map((skill, idx) => (
                  <span
                    key={idx}
                    style={{
                      background: 'rgba(212, 160, 23, 0.08)',
                      border: '1px solid rgba(212, 160, 23, 0.3)',
                      borderRadius: '5px',
                      padding: '3px 10px',
                      fontSize: '0.72rem',
                      color: '#f8fafc',
                      fontWeight: 600,
                    }}
                  >
                    ✓ {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Certificate Credential & Verification Footer */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr auto 1.2fr',
              alignItems: 'center',
              gap: '18px',
              paddingTop: '16px',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            {/* Left Column: Official Issuing Authority */}
            <div style={{ textAlign: 'left', paddingLeft: '6px' }}>
              <div
                style={{
                  fontSize: '0.68rem',
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.8px',
                }}
              >
                Issuing Organization
              </div>
              <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#ffffff', marginTop: '2px' }}>
                APTIVELLA Platform
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Issue Date: <strong style={{ color: '#ffffff' }}>{issuedAt}</strong>
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Standard: <span style={{ color: 'var(--gold-light)' }}>Proctored Technical Benchmark (80%+)</span>
              </div>
            </div>

            {/* Center Column: Security Seal Medallion */}
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                border: '2px solid var(--gold-primary)',
                background: 'radial-gradient(circle, rgba(212, 160, 23, 0.22) 0%, rgba(10, 12, 17, 0.98) 80%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 20px rgba(212, 160, 23, 0.3)',
                margin: '0 auto',
                flexShrink: 0,
              }}
            >
              <span style={{ fontSize: '1.3rem', lineHeight: 1 }}>{badgeIcon}</span>
              <span
                style={{
                  fontSize: '0.52rem',
                  fontWeight: 800,
                  color: 'var(--gold-light)',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  marginTop: '2px',
                }}
              >
                VERIFIED
              </span>
              <span style={{ fontSize: '0.45rem', color: '#94a3b8', letterSpacing: '0.5px' }}>
                APTIVELLA
              </span>
            </div>

            {/* Right Column: Scannable QR Code & Cryptographic Verification ID */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: '14px',
                paddingRight: '6px',
              }}
            >
              <div style={{ textAlign: 'right' }}>
                <div
                  style={{
                    fontSize: '0.68rem',
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.8px',
                  }}
                >
                  Credential ID
                </div>
                <div
                  style={{
                    fontSize: '0.86rem',
                    fontWeight: 700,
                    color: 'var(--gold-light)',
                    fontFamily: 'monospace',
                    marginTop: '2px',
                  }}
                >
                  {certificateId}
                </div>
                <div
                  style={{
                    fontSize: '0.72rem',
                    color: '#10b981',
                    marginTop: '2px',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    gap: '4px',
                  }}
                >
                  <span>●</span>
                  <span>Active in Public Registry</span>
                </div>
              </div>

              {/* QR Code */}
              <CredentialQRCode value={verificationUrl} size={50} />
            </div>
          </div>

          {/* Direct Public Verification URL Bar */}
          <div
            style={{
              marginTop: '14px',
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
              borderTop: '1px dashed rgba(255, 255, 255, 0.08)',
              paddingTop: '10px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '6px',
            }}
          >
            <div>
              Verify credential online at:{' '}
              <a
                href={verificationUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--gold-light)', fontFamily: 'monospace', textDecoration: 'underline' }}
              >
                {verificationUrl}
              </a>
            </div>
            <div>
              Designation: <strong style={{ color: '#ffffff' }}>{badgeTitle}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
