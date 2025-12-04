import React from "react";
import { Link } from "../../routerShim";

const RecommendationsPanel = ({ material, game, insightLink = "/memory" }) => {
  const materialCard = material || {
    title: "Материал дня",
    description: "Выбери любую статью или курс, чтобы сделать шаг вперёд.",
    to: "/library",
    typeLabel: "Библиотека",
  };

  const gameCard = game || {
    title: "MindGame дня",
    description: "5 быстрых сценариев для фокуса и реакции.",
    to: "/library",
    typeLabel: "MindGame",
  };

  const insightCard = {
    title: "Добавь инсайт",
    description: "Запиши мысль или вывод в Память, чтобы сохранить прогресс.",
    to: insightLink,
    typeLabel: "Память",
  };

  const cards = [materialCard, gameCard, insightCard];

  return (
    <section className="card recommendations">
      <div className="section-head">
        <div>
          <p className="meta">Рекомендации дня</p>
          <h3>Выбери следующий шаг</h3>
        </div>
        <div className="section-actions">
          <Link to="/library" className="ghost">
            Вся библиотека
          </Link>
        </div>
      </div>
      <div className="recommendation-grid stable">
        {cards.map((item, idx) => (
          <Link key={`${item.title}-${idx}`} to={item.to} className="rec-card stable-card">
            <div className="pill subtle">{item.typeLabel}</div>
            <h4>{item.title}</h4>
            <p className="meta subtle">{item.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default RecommendationsPanel;
