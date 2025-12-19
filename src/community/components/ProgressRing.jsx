import React from "react";

const ProgressRing = ({ value = 0, target = 1, size = 120, stroke = 10, color = "#8A3FFC" }) => {
  const safeTarget = target > 0 ? target : 1;
  const progress = Math.min(Math.max(value / safeTarget, 0), 1);
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - progress * circumference;

  return (
    <div className="progress-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle
          className="progress-ring-bg"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={stroke}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className="progress-ring-value"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="progress-ring-center">
        <div className="progress-numbers">{Math.round(progress * 100)}%</div>
        <div className="progress-caption">
          {value}/{safeTarget}
        </div>
      </div>
    </div>
  );
};

export default ProgressRing;
