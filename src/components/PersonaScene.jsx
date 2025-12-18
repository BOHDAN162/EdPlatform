import React from "react";

const variants = {
  start: {
    label: "Стартовый маршрут",
    gradient: "linear-gradient(135deg, #6d28d9, #2563eb)",
    accent: "#a855f7",
    floaters: ["Компас", "Карта", "Фонарик"],
  },
  gamification: {
    label: "Геймификация и уровни",
    gradient: "linear-gradient(135deg, #22c55e, #06b6d4)",
    accent: "#10b981",
    floaters: ["Трофей", "+120 XP", "Уровень"],
  },
  library: {
    label: "Библиотека и знания",
    gradient: "linear-gradient(135deg, #0ea5e9, #9333ea)",
    accent: "#38bdf8",
    floaters: ["Курс", "Новая заметка", "MindGame"],
  },
  community: {
    label: "Сообщество и задания",
    gradient: "linear-gradient(135deg, #f59e0b, #ef4444)",
    accent: "#f97316",
    floaters: ["Команда", "Чат", "Флажок"],
  },
};

const PersonaScene = ({ variant = "start", size = "md" }) => {
  const meta = variants[variant] || variants.start;
  return (
    <div className={`persona-scene ${size}`} style={{ backgroundImage: meta.gradient }}>
      <div className="persona-glow" />
      <div className="persona-character">
        <div className="persona-head" style={{ background: meta.accent }}>
          <div className="persona-eyes">
            <span className="eye" />
            <span className="eye" />
          </div>
          <div className="persona-mouth" />
        </div>
        <div className="persona-body">
          <div className="persona-backpack" />
          <div className="persona-symbol">✦</div>
          <div className="persona-arm left" />
          <div className="persona-arm right" />
          <div className="persona-leg left" />
          <div className="persona-leg right" />
        </div>
      </div>
      <div className="persona-badges" aria-hidden>
        {meta.floaters.map((label, idx) => (
          <div key={label} className="persona-floating" style={{ animationDelay: `${idx * 0.4}s` }}>
            <span className="persona-dot" style={{ background: meta.accent }} />
            <span>{label}</span>
          </div>
        ))}
      </div>
      <div className="persona-label">{meta.label}</div>
    </div>
  );
};

export default PersonaScene;
