import React from "react";

const circumference = 2 * Math.PI * 45;

const clampValue = (value) => {
  if (typeof value !== "number" || Number.isNaN(value)) return 0;
  return Math.min(100, Math.max(0, Math.round(value)));
};

const ProgressRing = ({ value = 0, label, color = "#7c3aed", hint, onClick }) => {
  const displayValue = clampValue(value);
  const dash = displayValue / 100 * circumference;
  const Component = onClick ? "button" : "div";

  return (
    <Component className="progress-ring" onClick={onClick} aria-label={label} type={onClick ? "button" : undefined}>
      <svg viewBox="0 0 120 120" aria-hidden="true" focusable="false">
        <circle className="ring-bg" cx="60" cy="60" r="45" />
        <circle
          className="ring-value"
          cx="60"
          cy="60"
          r="45"
          stroke={color}
          strokeDasharray={`${dash} ${circumference}`}
        />
      </svg>
      <div className="ring-content">
        <div className="ring-value-label">{displayValue}%</div>
        <div className="ring-label">{label}</div>
        {hint && <div className="meta subtle">{hint}</div>}
      </div>
    </Component>
  );
};

export default ProgressRing;
