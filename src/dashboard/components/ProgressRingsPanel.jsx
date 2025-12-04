import React from "react";
import ProgressRing from "./ProgressRing";

const ProgressRingsPanel = ({ stats, onNavigate }) => {
  const { levelLabel, xpLabel, streakLabel, rings } = stats;
  return (
    <section className="card progress-rings">
      <div className="section-head">
        <div>
          <p className="meta">Твоя динамика</p>
          <h3>Уровень роста</h3>
          <p className="meta subtle">{xpLabel}</p>
          <div className="meta subtle">{levelLabel} · {streakLabel}</div>
        </div>
        <div className="section-actions">
          <button className="ghost" onClick={() => onNavigate("/profile")}>Подробно</button>
        </div>
      </div>
      <div className="ring-grid">
        {rings.map((ring) => (
          <ProgressRing
            key={ring.label}
            value={ring.value}
            label={ring.label}
            hint={ring.hint}
            color={ring.color}
            onClick={() => ring.to && onNavigate(ring.to)}
          />
        ))}
      </div>
    </section>
  );
};

export default ProgressRingsPanel;
