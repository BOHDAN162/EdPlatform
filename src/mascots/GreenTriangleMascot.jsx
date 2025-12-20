import React from "react";

const Eye = ({ cx, cy }) => (
  <g>
    <ellipse cx={cx} cy={cy} rx={17} ry={14} fill="#fff" opacity={0.95} />
    <circle cx={cx - 2} cy={cy - 1} r={6.5} fill="#0f172a" />
    <circle cx={cx - 5} cy={cy - 4} r={2.4} fill="#fff" />
  </g>
);

const GreenTriangleMascot = ({ size = 220, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 240 240"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
    className={className}
  >
    <defs>
      <linearGradient id="triangle-body" x1="20%" y1="0%" x2="70%" y2="90%">
        <stop offset="0%" stopColor="#86EFAC" stopOpacity="0.95" />
        <stop offset="60%" stopColor="#22C55E" stopOpacity="0.98" />
        <stop offset="100%" stopColor="#16A34A" stopOpacity="0.9" />
      </linearGradient>
      <linearGradient id="triangle-highlight" x1="10%" y1="0%" x2="60%" y2="40%">
        <stop offset="0%" stopColor="#D1FAE5" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#86EFAC" stopOpacity="0" />
      </linearGradient>
    </defs>

    <path
      d="M120 34c6 0 12 3 16 9l78 128c7 12-2 27-16 27H42c-14 0-23-15-16-27l78-128c4-6 10-9 16-9Z"
      fill="url(#triangle-body)"
      stroke="#DCFCE7"
      strokeWidth="2.2"
      strokeLinejoin="round"
    />

    <path
      d="M82 92c10-18 24-32 38-42"
      fill="none"
      stroke="url(#triangle-highlight)"
      strokeWidth="8"
      strokeLinecap="round"
      opacity="0.8"
    />

    <path
      d="M120 54 54 164c-2 4 1 9 6 9h120c5 0 8-5 6-9Z"
      fill="#fff"
      opacity="0.05"
    />

    <g transform="translate(0 14)">
      <Eye cx={108} cy={138} />
      <Eye cx={140} cy={138} />
    </g>

    <ellipse cx="120" cy="198" rx="54" ry="16" fill="#0f172a" opacity="0.08" />
    <ellipse cx="120" cy="194" rx="38" ry="10" fill="#fff" opacity="0.08" />
  </svg>
);

export default GreenTriangleMascot;
