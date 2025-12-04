import React from "react";
import { Link } from "../../routerShim";

const RecommendationsPanel = ({ materials = [], games = [] }) => {
  return (
    <section className="card recommendations">
      <div className="section-head">
        <div>
          <p className="meta">Тебе подойдёт сегодня</p>
          <h3>Контент + MindGames</h3>
        </div>
        <Link to="/library" className="ghost">
          Вся библиотека
        </Link>
      </div>
      <div className="recommendation-grid">
        {materials.map((item) => (
          <Link key={item.id} to={`/library/${item.type}/${item.id}`} className="rec-card">
            <div className="pill subtle">{item.typeLabel}</div>
            <h4>{item.title}</h4>
            <p className="meta subtle">{item.description}</p>
            <div className="meta subtle">{item.duration}</div>
          </Link>
        ))}
        {games.map((game) => (
          <Link key={game.id} to={game.to} className="rec-card game">
            <div className="pill accent">MindGame</div>
            <h4>{game.title}</h4>
            <p className="meta subtle">{game.description}</p>
            <div className="meta subtle">Лучший результат: {game.best}</div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default RecommendationsPanel;
