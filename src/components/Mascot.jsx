import React from "react";

const variantStyles = {
  guide: {
    label: "Гид рядом",
    start: "#9f84ff",
    end: "#42e9ff",
    glow: "rgba(159, 132, 255, 0.28)",
  },
  explorer: {
    label: "Исследователь",
    start: "#7dd3fc",
    end: "#9f84ff",
    glow: "rgba(125, 211, 252, 0.26)",
  },
  planner: {
    label: "Стратег",
    start: "#8b5cf6",
    end: "#34d399",
    glow: "rgba(52, 211, 153, 0.24)",
  },
  geek: {
    label: "Гик по знаниям",
    start: "#f472b6",
    end: "#8b5cf6",
    glow: "rgba(244, 114, 182, 0.26)",
  },
  gamer: {
    label: "Готов к челленджу",
    start: "#22d3ee",
    end: "#8b5cf6",
    glow: "rgba(34, 211, 238, 0.26)",
  },
  community: {
    label: "Команда",
    start: "#c084fc",
    end: "#34d399",
    glow: "rgba(192, 132, 252, 0.26)",
  },
};

const sizeMap = {
  sm: 52,
  md: 68,
  lg: 86,
};

const Mascot = ({ variant = "guide", size = "md", label, className = "" }) => {
  const config = variantStyles[variant] || variantStyles.guide;
  const dimension = sizeMap[size] || sizeMap.md;

  return (
    <div
      className={`mascot-wrapper ${className}`.trim()}
      style={{
        "--mascot-start": config.start,
        "--mascot-end": config.end,
        "--mascot-glow": config.glow,
      }}
    >
      <div className="mascot-core floating" style={{ width: dimension, height: dimension }}>
        <div className="mascot-shape">
          <div className="mascot-face">
            <span className="eye left" />
            <span className="eye right" />
            <span className="smile" />
          </div>
          <span className="sparkle top" />
          <span className="sparkle bottom" />
        </div>
      </div>
      <p className="mascot-caption">{label || config.label}</p>
    </div>
  );
};

export default Mascot;
