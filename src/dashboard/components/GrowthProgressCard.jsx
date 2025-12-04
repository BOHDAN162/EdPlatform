import React, { useMemo } from "react";

const RADIUS = 36;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const clampPercent = (value) => {
  if (typeof value !== "number" || Number.isNaN(value)) return 0;
  return Math.min(100, Math.max(0, Math.round(value)));
};

const GrowthRing = ({ label, value = 0, hint, color = "#8b5cf6" }) => {
  const percent = clampPercent(value);
  const dashOffset = CIRCUMFERENCE - (percent / 100) * CIRCUMFERENCE;

  return (
    <div className="growth-ring">
      <div className="growth-ring-chart" aria-hidden="true">
        <svg viewBox="0 0 100 100">
          <circle className="growth-ring-track" cx="50" cy="50" r={RADIUS} />
          <circle
            className="growth-ring-fill"
            cx="50"
            cy="50"
            r={RADIUS}
            stroke={color}
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
          />
        </svg>
        <div className="growth-ring-value">{percent}%</div>
      </div>
      <div className="growth-ring-meta">
        <div className="growth-ring-label">{label}</div>
        <div className="meta subtle">{hint || "Данные появятся позже"}</div>
      </div>
    </div>
  );
};

const fallbackRings = [
  { label: "Обучение", value: 0, hint: "Материалы скоро будут" },
  { label: "Действия", value: 0, hint: "Ждём активности" },
  { label: "Осознанность", value: 0, hint: "Серия начнётся позже" },
];

const GrowthProgressCard = ({ stats = {} }) => {
  const { levelLabel, xpLabel, streakLabel, rings = [] } = stats;
  const ringItems = useMemo(() => {
    if (Array.isArray(rings) && rings.length) return rings;
    return fallbackRings;
  }, [rings]);

  const statusLine = useMemo(() => {
    return [xpLabel || "XP появятся после первых действий", levelLabel || "Роль уточняется", streakLabel]
      .filter(Boolean)
      .join(" • ");
  }, [xpLabel, levelLabel, streakLabel]);

  return (
    <section className="card growth-progress-card">
      <div className="growth-progress-head">
        <div>
          <p className="meta">Уровень роста</p>
          <h3>Твоя динамика</h3>
        </div>
        <div className="meta subtle">{streakLabel || "Серия появится после первых шагов"}</div>
      </div>

      <div className="growth-progress-status">{statusLine}</div>

      <div className="growth-progress-rings">
        {ringItems.map((ring) => (
          <GrowthRing key={ring.label} {...ring} />
        ))}
      </div>
    </section>
  );
};

export default GrowthProgressCard;
