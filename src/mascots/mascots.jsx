import React, { useId } from "react";

const BaseMascot = ({ palette, accent, core, rings, size = 220 }) => {
  const bodyId = useId();
  const glowId = useId();
  const accentId = useId();

  const view = 260;
  const eyes = [
    { cx: 110, cy: 125 },
    { cx: 150, cy: 125 },
  ];

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${view} ${view}`}
      role="img"
      aria-hidden
      className="drop-shadow-xl"
    >
      <defs>
        <linearGradient id={`${bodyId}-body`} x1="30%" y1="10%" x2="90%" y2="90%">
          <stop offset="0%" stopColor={palette.primary} stopOpacity={0.95} />
          <stop offset="55%" stopColor={palette.secondary} stopOpacity={0.98} />
          <stop offset="100%" stopColor={palette.primary} stopOpacity={0.92} />
        </linearGradient>
        <radialGradient id={`${glowId}-glow`} cx="50%" cy="45%" r="70%">
          <stop offset="0%" stopColor={palette.glow} stopOpacity={0.9} />
          <stop offset="65%" stopColor={palette.glow} stopOpacity={0.35} />
          <stop offset="100%" stopColor={palette.glow} stopOpacity={0} />
        </radialGradient>
        <linearGradient id={`${accentId}-accent`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={accent.from} />
          <stop offset="100%" stopColor={accent.to} />
        </linearGradient>
      </defs>

      <circle cx="130" cy="130" r="108" fill={`url(#${glowId}-glow)`} />
      <rect
        x="50"
        y="44"
        width="160"
        height="180"
        rx="70"
        fill={`url(#${bodyId}-body)`}
        stroke={palette.highlight}
        strokeWidth="2.4"
      />

      <path
        d="M70 118c4-22 14-40 34-50 34-17 84-9 102 34 7 18 6 39 2 58-3 15-15 28-29 35-22 11-65 18-93-7-17-16-26-44-16-70Z"
        fill="white"
        opacity="0.06"
      />

      <circle cx="130" cy="80" r="28" fill={`url(#${accentId}-accent)`} opacity="0.9" />
      <circle cx="190" cy="102" r="18" fill={core} opacity="0.3" />

      <g opacity="0.38" stroke={palette.highlight} strokeWidth="3">
        <circle cx="130" cy="134" r="96" fill="none" strokeDasharray="12 16" />
        <circle cx="130" cy="134" r="112" fill="none" strokeDasharray="8 22" />
      </g>

      {rings && <circle cx="74" cy="82" r="10" fill={palette.highlight} opacity="0.52" />}

      <g>
        {eyes.map((eye) => (
          <g key={`${eye.cx}-${eye.cy}`}>
            <circle cx={eye.cx} cy={eye.cy} r="18" fill="white" opacity="0.9" />
            <circle cx={eye.cx} cy={eye.cy} r="9" fill="#0f172a" />
            <circle cx={eye.cx - 3} cy={eye.cy - 4} r="3" fill="white" />
          </g>
        ))}
      </g>

      <ellipse cx="130" cy="182" rx="58" ry="26" fill="#0f172a" opacity="0.08" />
      <ellipse cx="130" cy="176" rx="42" ry="16" fill="white" opacity="0.06" />
    </svg>
  );
};

const VioletCore = (props) => (
  <BaseMascot
    {...props}
    palette={{ primary: "#8A3FFC", secondary: "#C084FC", glow: "#A855F7", highlight: "#F5F3FF" }}
    accent={{ from: "#C084FC", to: "#8A3FFC" }}
    core="#312e81"
    rings
  />
);

const CyanMind = (props) => (
  <BaseMascot
    {...props}
    palette={{ primary: "#0ea5e9", secondary: "#22d3ee", glow: "#67e8f9", highlight: "#e0f2fe" }}
    accent={{ from: "#22d3ee", to: "#0ea5e9" }}
    core="#0f172a"
  />
);

const LimeEnergy = (props) => (
  <BaseMascot
    {...props}
    palette={{ primary: "#4ade80", secondary: "#84cc16", glow: "#bef264", highlight: "#f7fee7" }}
    accent={{ from: "#a3e635", to: "#22c55e" }}
    core="#14532d"
    rings
  />
);

const SunsetOrange = (props) => (
  <BaseMascot
    {...props}
    palette={{ primary: "#fb7185", secondary: "#f97316", glow: "#f9a8d4", highlight: "#fff7ed" }}
    accent={{ from: "#fb7185", to: "#f97316" }}
    core="#7c2d12"
  />
);

export const MASCOTS = [
  { id: "violet", name: "Кристалл", palette: { primary: "#8A3FFC", glow: "#A855F7" }, Component: VioletCore },
  { id: "cyan", name: "Орбита", palette: { primary: "#22d3ee", glow: "#67e8f9" }, Component: CyanMind },
  { id: "lime", name: "Искра", palette: { primary: "#84cc16", glow: "#bef264" }, Component: LimeEnergy },
  { id: "sunset", name: "Капсула", palette: { primary: "#f97316", glow: "#f9a8d4" }, Component: SunsetOrange },
];

export const getMascotById = (id) => MASCOTS.find((item) => item.id === id) || MASCOTS[0];
