import React from "react";

const moodEmoji = {
  spark: "🚀",
  focus: "🧠",
  friendly: "🤝",
  build: "🛠️",
};

const CongratsScreen = ({ profileResult, onBuild, onRestart }) => {
  if (!profileResult) return null;
  const avatar = moodEmoji[profileResult.avatarMood] || "✨";
  const tagline = profileResult.strengths?.[0] || profileResult.summary;

  return (
    <div className="congrats-card">
      <div className="congrats-glow" aria-hidden />
      <p className="pill outline">Диагностика завершена</p>
      <h1>Поздравляем!</h1>
      <p className="meta">Ты — {profileResult.profileType}. Маршрут уже ждёт тебя.</p>

      <div className="congrats-body">
        <div className="congrats-avatar">
          <span role="img" aria-label="avatar mood">{avatar}</span>
        </div>
        <div className="congrats-info">
          <p className="meta subtle">Твой тип</p>
          <h2>Твой тип: {profileResult.profileType}</h2>
          <p className="meta description">{tagline}</p>
          <p className="meta">{profileResult.summary}</p>
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
        </div>
      </div>
    </div>
  );
};

export default CongratsScreen;
