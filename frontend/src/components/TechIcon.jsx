import React from 'react';

export default function TechIcon({ tech, size = 26 }) {
  switch (tech) {
    case 'React':
      return (
        <svg width={size} height={size} viewBox="-11.5 -10.23174 23 20.46348" fill="none">
          <circle cx="0" cy="0" r="2.05" fill="#00d8ff" />
          <g stroke="#00d8ff" strokeWidth="1" fill="none">
            <ellipse rx="11" ry="4.2" />
            <ellipse rx="11" ry="4.2" transform="rotate(60)" />
            <ellipse rx="11" ry="4.2" transform="rotate(120)" />
          </g>
        </svg>
      );

    case 'Node.js':
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
          <path d="M16 2L28 8.9V22.9L16 29.8L4 22.9V8.9L16 2Z" stroke="#22c55e" strokeWidth="2" fill="rgba(34, 197, 94, 0.12)" />
          <path d="M11 20V12L16 15V23L11 20Z" fill="#22c55e" />
          <path d="M16 15L21 12V20L16 23V15Z" fill="#16a34a" />
        </svg>
      );

    case 'Python':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path d="M11.9 2C8.7 2 6.8 3.4 6.8 5.7V8.5H12V9.9H4.8C2.5 9.9 1 11.8 1 15C1 18.2 2.9 20 5.2 20H7.1V17.2C7.1 14.9 9 13.5 12.2 13.5H17.4V12.1H12.2V10.7H19.5C21.8 10.7 23.3 8.8 23.3 5.6C23.3 2.4 21.4 0.6 19.1 0.6H17.2V3.4C17.2 5.7 15.3 7.1 12.1 7.1H6.9V8.5H11.9V2Z" fill="url(#pythonGrad)" />
          <defs>
            <linearGradient id="pythonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="50%" stopColor="#38bdf8" />
              <stop offset="51%" stopColor="#facc15" />
              <stop offset="100%" stopColor="#facc15" />
            </linearGradient>
          </defs>
          <circle cx="8.5" cy="5.5" r="1" fill="#ffffff" />
          <circle cx="15.5" cy="18.5" r="1" fill="#0f172a" />
        </svg>
      );

    case 'MongoDB':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path d="M12 2C12 2 6.5 8 6.5 14C6.5 17.5 9 20.5 12 22C15 20.5 17.5 17.5 17.5 14C17.5 8 12 2 12 2Z" fill="rgba(16, 185, 129, 0.15)" stroke="#10b981" strokeWidth="1.8" />
          <path d="M12 2V22" stroke="#10b981" strokeWidth="1.5" />
        </svg>
      );

    case 'TypeScript':
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
          <rect width="32" height="32" rx="6" fill="#3178c6" />
          <path d="M15 11H8V14H10V23H13V14H15V11Z" fill="#ffffff" />
          <path d="M24 13.5C23.5 12.5 22.2 12 20.8 12C18.8 12 17.5 13 17.5 14.5C17.5 16 18.5 16.8 20.5 17.2L21.3 17.4C22.6 17.7 23.2 18.3 23.2 19.3C23.2 20.7 21.8 21.6 19.8 21.6C18 21.6 16.8 20.7 16.2 19.5L18.4 18.2C18.8 19 19.3 19.4 20 19.4C20.7 19.4 21.2 19 21.2 18.4C21.2 17.8 20.7 17.4 19.5 17.1L18.7 16.9C16.8 16.5 15.6 15.5 15.6 13.8C15.6 12 17.1 10.8 19.5 10.8C21.2 10.8 22.5 11.5 23.2 12.5L21.2 13.8L24 13.5Z" fill="#ffffff" />
        </svg>
      );

    case 'Next.js':
      return (
        <svg width={size} height={size} viewBox="0 0 180 180" fill="none">
          <circle cx="90" cy="90" r="90" fill="#000000" stroke="rgba(255,255,255,0.2)" strokeWidth="4" />
          <path d="M149.508 157.086L69.8324 54H54V125.97H66.2713V69.5855L139.957 164.55C143.255 162.247 146.444 159.752 149.508 157.086Z" fill="url(#nextGrad)" />
          <rect x="115" y="54" width="12" height="72" fill="url(#nextGrad2)" />
          <defs>
            <linearGradient id="nextGrad" x1="109" y1="116.5" x2="144.5" y2="160.5" gradientUnits="userSpaceOnUse">
              <stop stopColor="white" />
              <stop offset="1" stopColor="white" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="nextGrad2" x1="121" y1="54" x2="121" y2="126" gradientUnits="userSpaceOnUse">
              <stop stopColor="white" />
              <stop offset="1" stopColor="white" stopOpacity="0.4" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'Docker':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path d="M2.5 13.5C2.5 13.5 3.5 11 7 11C8 11 11.5 11 13 14C15 14 19 14 21 11.5C22 13 22 16.5 19 18.5C15.5 21 8.5 20.5 4 17.5C2.8 16.5 2.5 14.5 2.5 13.5Z" stroke="#38bdf8" strokeWidth="1.8" fill="rgba(56, 189, 248, 0.15)" />
          <rect x="5" y="8" width="2" height="2" fill="#38bdf8" rx="0.5" />
          <rect x="8" y="8" width="2" height="2" fill="#38bdf8" rx="0.5" />
          <rect x="11" y="8" width="2" height="2" fill="#38bdf8" rx="0.5" />
          <rect x="8" y="5" width="2" height="2" fill="#38bdf8" rx="0.5" />
          <rect x="11" y="5" width="2" height="2" fill="#38bdf8" rx="0.5" />
          <circle cx="17.5" cy="14" r="0.8" fill="#38bdf8" />
        </svg>
      );

    case 'AI / ML':
    case 'AI':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path d="M12 2L14.5 8.5L21 11L14.5 13.5L12 20L9.5 13.5L3 11L9.5 8.5L12 2Z" fill="url(#aiGrad)" />
          <circle cx="19" cy="5" r="2" fill="#fde29b" />
          <circle cx="5" cy="19" r="1.5" fill="#fde29b" />
          <defs>
            <linearGradient id="aiGrad" x1="3" y1="2" x2="21" y2="20" gradientUnits="userSpaceOnUse">
              <stop stopColor="#fde29b" />
              <stop offset="50%" stopColor="#e5b85a" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'System Design':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#ec4899" strokeWidth="2">
          <rect x="2" y="3" width="6" height="6" rx="1.5" fill="rgba(236, 72, 153, 0.15)" />
          <rect x="16" y="3" width="6" height="6" rx="1.5" fill="rgba(236, 72, 153, 0.15)" />
          <rect x="9" y="15" width="6" height="6" rx="1.5" fill="rgba(236, 72, 153, 0.15)" />
          <path d="M5 9v3a2 2 0 0 0 2 2h5M19 9v3a2 2 0 0 1-2 2h-5" />
        </svg>
      );

    case 'Flutter':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path d="M14.3 2.5L4.5 12.3L7.7 15.5L20.7 2.5H14.3Z" fill="#54c5f8" />
          <path d="M14.3 12.5L9.3 17.5L12.5 20.7L17.5 15.7L20.7 12.5H14.3Z" fill="#29b6f6" />
          <path d="M12.5 20.7L14.3 22.5H20.7L17.5 19.3L12.5 20.7Z" fill="#01579b" />
        </svg>
      );

    case 'Cybersecurity':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="rgba(16, 185, 129, 0.15)" />
          <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case 'DSA':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2">
          <circle cx="12" cy="5" r="3" fill="rgba(99, 102, 241, 0.2)" />
          <circle cx="6" cy="18" r="3" fill="rgba(99, 102, 241, 0.2)" />
          <circle cx="18" cy="18" r="3" fill="rgba(99, 102, 241, 0.2)" />
          <path d="M10 7.5L7.5 15.5M14 7.5L16.5 15.5" strokeLinecap="round" />
        </svg>
      );

    case 'Full Stack':
    default:
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
      );
  }
}
