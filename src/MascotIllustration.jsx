import React from "react";

const FloatingCard = ({ delay = 0, width = 120, height = 70, label }) => (
  <div
    className="floating-card"
    style={{ animationDelay: `${delay}s`, width, height }}
  >
    <div className="floating-card-label">{label}</div>
    <div className="floating-card-bar" />
    <div className="floating-card-bar short" />
  </div>
);

const MascotIllustration = ({ mood = "happy" }) => {
  return (
    <div className="mascot-wrapper">
      <div className="mascot-glow" />
      <div className="mascot">
        <div className="mascot-face">
          <span className="mascot-eye" />
          <span className="mascot-eye" />
          <span className={`mascot-mouth ${mood}`} />
        </div>
        <div className="mascot-body">
          <span className="mascot-badge">☆</span>
        </div>
      </div>
      <div className="floating-elements">
        <FloatingCard delay={0} width={140} height={78} label="Твой трек" />
        <FloatingCard delay={1.2} width={110} height={64} label="Награды" />
        <FloatingCard delay={0.6} width={126} height={70} label="Прогресс" />
      </div>
    </div>
  );
};

export default MascotIllustration;
