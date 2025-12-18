import React from "react";

const badgeSets = {
  hero: [
    { label: "XP +120", accent: "success" },
    { label: "Новый уровень", accent: "primary" },
    { label: "Твой трек", accent: "muted" },
  ],
  missions: [
  { label: "Задания 7 дней", accent: "primary" },
    { label: "Серия +5", accent: "success" },
    { label: "+240 XP", accent: "muted" },
  ],
  library: [
    { label: "12 материалов", accent: "primary" },
    { label: "Фокус: мышление", accent: "muted" },
    { label: "Прогресс 64%", accent: "success" },
  ],
  memory: [
    { label: "Новый инсайт", accent: "primary" },
    { label: "Карточки памяти", accent: "muted" },
    { label: "Город растёт", accent: "success" },
  ],
  community: [
    { label: "Лига XP", accent: "primary" },
    { label: "Команда 5", accent: "muted" },
    { label: "+80 за день", accent: "success" },
  ],
  final: [
    { label: "Старт сейчас", accent: "primary" },
    { label: "Маршрут готов", accent: "success" },
  ],
};

const NoesisMascotScene = ({ variant = "hero" }) => {
  const badges = badgeSets[variant] || badgeSets.hero;

  return (
    <div className={`mascot-scene ${variant}`}>
      <div className="scene-glow" />
      <div className="scene-orbit orbit-1" />
      <div className="scene-orbit orbit-2" />
      <div className="scene-orbit orbit-3" />
      <div className="scene-character">
        <div className="scene-head">
          <div className="scene-eyes">
            <span className="eye" />
            <span className="eye" />
          </div>
          <div className="scene-mouth" />
        </div>
        <div className="scene-body">
          <div className="scene-symbol">✦</div>
          <div className="scene-arm left" />
          <div className="scene-arm right" />
        </div>
        <div className="scene-legs">
          <span />
          <span />
        </div>
      </div>
      <div className="scene-badges" aria-hidden>
        {badges.map((badge, idx) => (
          <div key={badge.label} className={`floating-badge ${badge.accent}`} style={{ animationDelay: `${idx * 0.35}s` }}>
            <span className="badge-dot" />
            <span>{badge.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NoesisMascotScene;
