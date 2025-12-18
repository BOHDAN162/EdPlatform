import React, { useMemo } from "react";
import Mascot from "./Mascot";

const getTimeLabel = () => {
  const hours = new Date().getHours();
  if (hours < 12) return "Давай зададим тон дню.";
  if (hours < 18) return "Продолжим твой трек.";
  return "Время подвести итоги и сделать маленький шаг вперёд.";
};

const DashboardHero = ({ user, streak, mood = "happy", onContinue }) => {
  const timeLabel = useMemo(getTimeLabel, []);
  const name = user?.name || "Гость";
  const streakCount = streak?.current || streak?.count || 0;
  const mascotMood = mood === "fired"
    ? "celebrate"
    : mood === "tired" || mood === "low"
    ? "tired"
    : streakCount >= 3
    ? "celebrate"
    : "happy";

  return (
    <section className="dashboard-hero card">
      <div className="hero-copy">
        <p className="meta">Добро пожаловать</p>
        <h1>
          Привет, <span className="accent">{name}</span>
        </h1>
        <p className="meta large">{timeLabel}</p>
        <div className="hero-actions">
          <button className="primary" onClick={onContinue}>
            Продолжить трек
          </button>
        </div>
        <div className="hero-metrics">
          <div className="metric">
            <span className="metric-label">Серия</span>
            <span className="metric-value">{streakCount} дней</span>
          </div>
          <div className="metric">
            <span className="metric-label">Фокус сегодня</span>
            <span className="metric-value">Задания и MindGames</span>
          </div>
        </div>
      </div>
      <div className="hero-visual">
        <Mascot mood={mascotMood} />
        <div className="bubble">{streakCount >= 3 ? "Серия держится — круто!" : "Вперёд к новому уровню!"}</div>
      </div>
    </section>
  );
};

export default DashboardHero;
