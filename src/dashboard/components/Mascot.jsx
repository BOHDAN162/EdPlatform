import React from "react";

const moodPresets = {
  happy: { gradient: "linear-gradient(135deg, #7c3aed, #a855f7)", accent: "#c084fc", eye: "#0b0b0b" },
  neutral: { gradient: "linear-gradient(135deg, #6366f1, #7c3aed)", accent: "#a5b4fc", eye: "#0b0b0b" },
  tired: { gradient: "linear-gradient(135deg, #312e81, #4c1d95)", accent: "#7c3aed", eye: "#0b0b0b" },
  supportive: { gradient: "linear-gradient(135deg, #22c55e, #16a34a)", accent: "#a7f3d0", eye: "#064e3b" },
  celebrate: { gradient: "linear-gradient(135deg, #f97316, #f59e0b)", accent: "#ffedd5", eye: "#0b0b0b" },
};

const Mascot = ({ mood = "happy", size = 160, subtle = false }) => {
  const preset = moodPresets[mood] || moodPresets.happy;
  const eyeSize = Math.max(8, Math.floor(size / 12));
  const blushSize = Math.max(10, Math.floor(size / 9));
  return (
    <div
      className={`mascot ${subtle ? "subtle" : ""}`}
      style={{
        width: size,
        height: size,
        background: preset.gradient,
        boxShadow: subtle ? "none" : "0 18px 42px rgba(124, 58, 237, 0.35)",
      }}
    >
      <div className="mascot-face">
        <span className="mascot-eye" style={{ width: eyeSize, height: eyeSize, background: preset.eye }} />
        <span className="mascot-eye" style={{ width: eyeSize, height: eyeSize, background: preset.eye }} />
      </div>
      <div className="mascot-mouth" />
      <div className="mascot-blush" style={{ width: blushSize, height: blushSize, background: preset.accent }} />
      <div className="mascot-blush" style={{ width: blushSize, height: blushSize, background: preset.accent }} />
    </div>
  );
};

export default Mascot;
