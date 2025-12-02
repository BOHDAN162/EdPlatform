import React from "react";

const variants = {
  indigo: {
    primary: "linear-gradient(135deg, #7c3aed, #4338ca)",
    accent: "#a855f7",
  },
  teal: {
    primary: "linear-gradient(135deg, #14b8a6, #0ea5e9)",
    accent: "#2dd4bf",
  },
  pink: {
    primary: "linear-gradient(135deg, #ec4899, #8b5cf6)",
    accent: "#fb7185",
  },
  blue: {
    primary: "linear-gradient(135deg, #2563eb, #22d3ee)",
    accent: "#60a5fa",
  },
};

const FloatingCard = ({ delay = 0, width = 120, height = 70, label, accent }) => (
  <div
    className="floating-card"
    style={{ animationDelay: `${delay}s`, width, height, borderColor: accent }}
  >
    <div className="floating-card-label">{label}</div>
    <div className="floating-card-bar" />
    <div className="floating-card-bar short" />
  </div>
);

const MascotIllustration = ({ mood = "happy", variant = "indigo", floatingCards = ["XP", "Трек", "Комьюнити"] }) => {
  const colors = variants[variant] || variants.indigo;

  return (
    <div className="mascot-wrapper">
      <div className="mascot-glow" style={{ background: colors.primary }} />
      <div className="mascot" style={{ background: colors.primary }}>
        <div className="mascot-face">
          <span className="mascot-eye" />
          <span className="mascot-eye" />
          <span className={`mascot-mouth ${mood}`} />
        </div>
        <div className="mascot-body" style={{ background: colors.accent }}>
          <span className="mascot-badge">☆</span>
        </div>
      </div>
      <div className="floating-elements">
        {floatingCards.map((label, idx) => (
          <FloatingCard
            key={label}
            delay={idx * 0.65}
            width={120 + idx * 8}
            height={64 + idx * 6}
            label={label}
            accent={colors.accent}
          />
        ))}
      </div>
    </div>
  );
};

export default MascotIllustration;
