import React from "react";

const Eye = ({ cx, cy }) => (
  <g>
    <ellipse cx={cx} cy={cy} rx={17} ry={14} fill="#fff" opacity={0.95} />
    <circle cx={cx - 2} cy={cy - 1} r={6.5} fill="#0f172a" />
    <circle cx={cx - 5} cy={cy - 4} r={2.4} fill="#fff" />
  </g>
);

const RedCircleMascot = ({ size = 230, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 240 240"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
    className={className}
  >
    <defs>
      <linearGradient id="circle-body" x1="20%" y1="0%" x2="70%" y2="90%">
        <stop offset="0%" stopColor="#FCA5A5" stopOpacity="0.95" />
        <stop offset="60%" stopColor="#EF4444" stopOpacity="0.98" />
        <stop offset="100%" stopColor="#B91C1C" stopOpacity="0.9" />
      </linearGradient>
      <linearGradient id="circle-highlight" x1="0%" y1="0%" x2="60%" y2="35%">
        <stop offset="0%" stopColor="#FECACA" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#FCA5A5" stopOpacity="0" />
      </linearGradient>
    </defs>

    <circle cx="120" cy="120" r="92" fill="url(#circle-body)" stroke="#FFE4E6" strokeWidth="2.2" />

    <path
      d="M64 94c12-24 40-42 70-42 18 0 34 5 46 12"
      fill="none"
      stroke="url(#circle-highlight)"
      strokeWidth="10"
      strokeLinecap="round"
      opacity="0.8"
    />

    <circle cx="120" cy="120" r="74" fill="#fff" opacity="0.05" />

    <g transform="translate(0 4)">
      <Eye cx={104} cy={122} />
      <Eye cx={136} cy={122} />
    </g>

    <ellipse cx="120" cy="190" rx="50" ry="16" fill="#0f172a" opacity="0.08" />
    <ellipse cx="120" cy="186" rx="36" ry="10" fill="#fff" opacity="0.08" />
  </svg>
);

export default RedCircleMascot;
