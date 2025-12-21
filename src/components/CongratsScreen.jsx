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
  const strengths = (profileResult.strengths || []).slice(0, 3);

  return (
    <div className="congrats-card compact">
      <div className="congrats-glow" aria-hidden />
      <div className="congrats-head">
        <p className="pill outline">Диагностика завершена</p>
        <h1>Твой тип: {profileResult.profileType}</h1>
        <p className="meta description">{tagline}</p>
      </div>

      <div className="congrats-brief">
        <div className="congrats-brief__item">
          <p className="meta subtle">Коротко</p>
          <p className="congrats-brief__text">{profileResult.summary}</p>
        </div>
        <div className="congrats-brief__item">
          <p className="meta subtle">Сильные стороны</p>
          <div className="congrats-tags">
            {strengths.map((item) => (
              <span key={item} className="pill subtle">{item}</span>
            ))}
            {!strengths.length && <span className="pill subtle">Твой фокус — {profileResult.profileType}</span>}
          </div>
        </div>
        <div className="congrats-brief__item">
          <p className="meta subtle">Настроение трека</p>
          <div className="congrats-avatar compact">
            <span role="img" aria-label="avatar mood">{avatar}</span>
          </div>
        </div>
      </div>

      <div className="quiz-actions congrats-actions">
        <button className="primary" onClick={onBuild}>
          Построить мой путь развития
        </button>
        <button className="ghost" onClick={onRestart}>
          Пройти опрос заново
        </button>
      </div>
    </div>
  );
};

export default CongratsScreen;
