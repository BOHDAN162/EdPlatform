import React from "react";
import ProgressRing from "./ProgressRing";
import Mascot from "./Mascot";

const fallbackRings = [
  { label: "Обучение", value: 0, hint: "Данные загружаются", color: "#8b5cf6", to: "/library" },
  { label: "Действия", value: 0, hint: "Ждём прогресса", color: "#22c55e", to: "/missions" },
  { label: "Осознанность", value: 0, hint: "Серия появится позже", color: "#0ea5e9", to: "/memory" },
];

const ProgressRingsPanel = ({ stats = {}, onNavigate }) => {
  const { levelLabel, xpLabel, streakLabel, rings } = stats;
  const ringItems = Array.isArray(rings) && rings.length ? rings : fallbackRings;

  return (
    <section className="card progress-rings">
      <div className="section-head">
        <div>
          <p className="meta">Твоя динамика</p>
          <h3>Уровень роста</h3>
          <p className="meta subtle">{xpLabel || "XP появятся после первых действий"}</p>
          <div className="meta subtle">{levelLabel || "Уровень уточняется"} · {streakLabel || "Серия пока не началась"}</div>
        </div>
        <div className="section-actions">
          <button className="ghost" onClick={() => onNavigate("/profile")}>Подробно</button>
        </div>
      </div>
      <div className="rings-row">
        <div className="ring-grid">
          {ringItems.map((ring) => (
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
        <div className="rings-side">
          <button className="ghost" onClick={() => onNavigate("/memory")}>История развития</button>
          <Mascot mood="neutral" size={140} subtle />
        </div>
      </div>
    </section>
  );
};

export default ProgressRingsPanel;
