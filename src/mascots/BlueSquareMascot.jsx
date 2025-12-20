import React from "react";

const Eye = ({ cx, cy }) => (
  <g>
    <ellipse cx={cx} cy={cy} rx={17} ry={14} fill="#fff" opacity={0.95} />
    <circle cx={cx - 2} cy={cy - 1} r={6.5} fill="#0f172a" />
    <circle cx={cx - 5} cy={cy - 4} r={2.4} fill="#fff" />
  </g>
);

const BlueSquareMascot = ({ size = 240, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 240 240"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
    className={className}
  >
    <defs>
      <linearGradient id="square-body" x1="30%" y1="15%" x2="80%" y2="90%">
        <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.95" />
        <stop offset="60%" stopColor="#3B82F6" stopOpacity="0.98" />
        <stop offset="100%" stopColor="#1D4ED8" stopOpacity="0.92" />
      </linearGradient>
      <linearGradient id="square-highlight" x1="0%" y1="0%" x2="80%" y2="40%">
        <stop offset="0%" stopColor="#BFDBFE" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#60A5FA" stopOpacity="0" />
      </linearGradient>
    </defs>

    <rect
      x="38"
      y="38"
      width="164"
      height="164"
      rx="34"
      fill="url(#square-body)"
      stroke="#DCEAFE"
      strokeWidth="2.2"
      opacity="0.98"
    />

    <path
      d="M56 70c18-12 44-20 74-20 18 0 35 3 48 8"
      fill="none"
      stroke="url(#square-highlight)"
      strokeWidth="8"
      strokeLinecap="round"
      opacity="0.8"
    />

    <rect
      x="52"
      y="60"
      width="136"
      height="132"
      rx="30"
      fill="#ffffff"
      opacity="0.06"
    />

    <g transform="translate(0 6)">
      <Eye cx={104} cy={124} />
      <Eye cx={144} cy={124} />
    </g>

    <ellipse cx="120" cy="186" rx="52" ry="18" fill="#0f172a" opacity="0.08" />
    <ellipse cx="120" cy="182" rx="40" ry="12" fill="#fff" opacity="0.08" />
  </svg>
);

export default BlueSquareMascot;
