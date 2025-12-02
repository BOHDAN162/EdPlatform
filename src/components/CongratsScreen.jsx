import React from "react";
import { Link } from "../routerShim";
import PersonaScene from "./PersonaScene";

const moodEmoji = {
  spark: "🚀",
  focus: "🧠",
  friendly: "🤝",
  build: "🛠️",
};

const archetypeToVariant = {
  founder: "start",
  strategist: "library",
  leader: "community",
  creator: "gamification",
};

const CongratsScreen = ({ profileResult, onBuild, onRestart }) => {
  if (!profileResult) return null;
  const avatar = moodEmoji[profileResult.avatarMood] || "✨";
  const personaVariant = archetypeToVariant[profileResult.profileKey] || "start";

  return (
    <div className="congrats-card">
      <div className="congrats-glow" aria-hidden />
      <p className="pill outline">Диагностика завершена</p>
      <h1>Поздравляем!</h1>
      <p className="meta">Ты — {profileResult.profileType}. Маршрут уже ждёт тебя.</p>

      <div className="congrats-body">
        <div className="congrats-avatar rich">
          <PersonaScene variant={personaVariant} />
          <div className="avatar-emoji">{avatar}</div>
        </div>
        <div className="congrats-info">
          <p className="meta subtle">Ты —</p>
          <h2>{profileResult.profileType}</h2>
          <p className="meta description">{profileResult.summary}</p>
          <p className="meta">Ты похож на ребят, которые уже в игре и идут своим путём — теперь маршрут подстроен под тебя.</p>
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
          <Link className="ghost" to="/missions">
            Перейти к миссиям
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CongratsScreen;
