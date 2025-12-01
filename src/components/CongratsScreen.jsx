import React from "react";
import { Link } from "../routerShim";

const moodEmoji = {
  spark: "🚀",
  focus: "🧠",
  friendly: "🤝",
  build: "🛠️",
};

const CongratsScreen = ({ profileResult, onBuild, onRestart }) => {
  if (!profileResult) return null;
  const avatar = moodEmoji[profileResult.avatarMood] || "✨";

  return (
    <div className="congrats-card">
      <div className="congrats-glow" aria-hidden />
      <p className="pill outline">Диагностика завершена</p>
      <h1>Поздравляем! Твой профиль готов</h1>
      <p className="meta">Мы собрали твой трек развития на основе твоих ответов.</p>

      <div className="congrats-body">
        <div className="congrats-avatar">{avatar}</div>
        <div className="congrats-info">
          <p className="meta subtle">Ты —</p>
          <h2>{profileResult.profileType}</h2>
          <p className="meta description">{profileResult.summary}</p>
          <div className="congrats-columns">
            <div>
              <p className="card-header">Сильные стороны</p>
              <ul className="bullet-list tight">
                {(profileResult.strengths || []).map((item) => (
                  <li key={item} className="bullet-row">
                    <span className="check-dot">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="card-header">Сравнение с группой</p>
              <ul className="bullet-list tight">
                {(profileResult.comparison || []).map((item) => (
                  <li key={item} className="bullet-row">
                    <span className="check-dot">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="quiz-actions congrats-actions">
        <button className="primary large" onClick={onBuild}>
          Построить мой путь развития
        </button>
        <div className="link-row">
          <button className="ghost" onClick={onRestart}>
            Пройти опрос заново
          </button>
          <Link className="ghost" to="/library">
            Перейти в библиотеку
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CongratsScreen;
