import React, { useId } from "react";

const CubeMascot = ({ size = 220, floating = false }) => {
  const frontId = useId();
  const topId = useId();
  const sideId = useId();
  const glowId = useId();
  const highlightId = useId();

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 220 220"
      role="img"
      aria-hidden
      className={`drop-shadow-xl ${floating ? "animate-[float_6s_ease-in-out_infinite]" : ""}`}
    >
      <defs>
        <linearGradient id={`${frontId}-front`} x1="20%" y1="15%" x2="90%" y2="90%">
          <stop offset="0%" stopColor="#7DD3FC" />
          <stop offset="55%" stopColor="#60A5FA" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
        <linearGradient id={`${topId}-top`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E0F2FE" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#93C5FD" stopOpacity="0.85" />
        </linearGradient>
        <linearGradient id={`${sideId}-side`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.92" />
          <stop offset="100%" stopColor="#2563EB" stopOpacity="0.9" />
        </linearGradient>
        <radialGradient id={`${glowId}-glow`} cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="#A5F3FC" stopOpacity="0.9" />
          <stop offset="65%" stopColor="#7DD3FC" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#7DD3FC" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${highlightId}-core`} cx="50%" cy="50%" r="35%">
          <stop offset="0%" stopColor="#E0F2FE" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#A5F3FC" stopOpacity="0.25" />
        </radialGradient>
        <filter id="cubeShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#1F2937" floodOpacity="0.22" />
        </filter>
        <style>{"@keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-4px); } }"}</style>
      </defs>

      <g filter="url(#cubeShadow)">
        <circle cx="110" cy="116" r="90" fill={`url(#${glowId}-glow)`} opacity="0.7" />

        <path
          d="M75 52c5-6 14-10 23-12l46-10c6-1 12 0 18 3l26 14c5 3 8 9 8 15v44c0 5-2 10-6 13l-28 24c-5 4-11 6-17 6H107c-6 0-13-2-18-5L64 128c-5-3-8-9-8-15V70c0-7 3-13 9-18Z"
          fill={`url(#${topId}-top)`}
          opacity="0.96"
        />

        <path
          d="M64 76c0-7 3-13 9-16l52-28c6-3 14-3 20 0l48 24c6 3 10 9 10 16v56c0 6-3 12-8 15l-52 32c-6 4-14 4-20 1l-52-28c-7-4-11-10-11-18V76Z"
          fill={`url(#${sideId}-side)`}
          opacity="0.9"
        />

        <rect
          x="60"
          y="70"
          width="110"
          height="110"
          rx="26"
          fill={`url(#${frontId}-front)`}
          stroke="#E0F2FE"
          strokeWidth="2.2"
        />

        <path d="M60 108c4-16 16-32 36-36" fill="none" stroke="#E0F2FE" strokeWidth="6" strokeLinecap="round" opacity="0.12" />
        <path d="M152 66c12 4 22 16 24 30" fill="none" stroke="#E0F2FE" strokeWidth="5" strokeLinecap="round" opacity="0.14" />

        <rect x="86" y="96" width="58" height="52" rx="16" fill={`url(#${highlightId}-core)`} opacity="0.78" />
        <circle cx="115" cy="122" r="6" fill="#0B1220" opacity="0.85" />

        <g opacity="0.96">
          <circle cx="98" cy="116" r="8" fill="white" opacity="0.9" />
          <circle cx="98" cy="116" r="4" fill="#0B1220" />
          <circle cx="136" cy="116" r="8" fill="white" opacity="0.9" />
          <circle cx="136" cy="116" r="4" fill="#0B1220" />
        </g>

        <path
          d="M76 162c18 12 52 14 78 6"
          fill="none"
          stroke="#0B1220"
          strokeOpacity="0.06"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <ellipse cx="110" cy="174" rx="44" ry="12" fill="#0B1220" opacity="0.08" />
        <ellipse cx="110" cy="170" rx="32" ry="10" fill="#E0F2FE" opacity="0.12" />
      </g>
    </svg>
  );
};

export default CubeMascot;
