import React, { useEffect, useState } from "react";

const circumference = 2 * Math.PI * 45;

const ProgressRing = ({ value = 0, label, color = "#7c3aed", hint, onClick }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => setDisplayValue(value), 120);
    return () => clearTimeout(timeout);
  }, [value]);

  const dash = Math.min(100, Math.max(0, displayValue)) / 100 * circumference;

  return (
    <button className="progress-ring" onClick={onClick} aria-label={label}>
      <svg viewBox="0 0 120 120">
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
        <div className="ring-value-label">{Math.round(displayValue)}%</div>
        <div className="ring-label">{label}</div>
        {hint && <div className="meta subtle">{hint}</div>}
      </div>
    </button>
  );
};

export default ProgressRing;
