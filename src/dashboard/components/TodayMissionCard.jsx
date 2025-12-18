import React from "react";
import { Link } from "../../routerShim";

const TodayMissionCard = ({ mission, onStart }) => {
  const progress = mission?.progress || { currentValue: 0, status: "new", badgeTier: 0 };
  const target = mission?.targetValue || 1;
  const percent = Math.min(100, Math.round((progress.currentValue / target) * 100));
  const isCompleted = progress.status === "completed" || percent >= 100;

  return (
    <section className="card today-mission daily-focus">
      <div className="section-head">
        <div>
          <p className="meta">Сегодня твой фокус</p>
          <h3>{mission?.title || "Задание загрузится"}</h3>
          <p className="meta subtle">{mission?.description || "Когда данные появятся, здесь будет главная цель дня."}</p>
        </div>
        <div className="pill accent">{mission?.period || "ежедневно"}</div>
      </div>
      <div className="focus-grid">
        <div className="focus-main">
          <div className="progress-bar steady">
            <div className="progress-fill" style={{ width: `${percent}%` }} />
          </div>
          <div className="focus-details">
            <div>
              <p className="meta subtle">Прогресс задания</p>
              <div className="focus-figure">{percent}%</div>
              <div className="meta subtle">Цель: {target}</div>
            </div>
            <div className="focus-mini">
              <p className="meta">Мини-задача</p>
              <div className="focus-mini-title">Пройди 1 MindGame</div>
              <p className="meta subtle">+XP за быструю попытку</p>
              <Link to="/library" className="ghost">
                Запустить MindGame
              </Link>
            </div>
          </div>
        </div>
        <div className="focus-actions">
          <p className="meta">Статус</p>
          <div className="focus-status">{isCompleted ? "Выполнено" : "В процессе"}</div>
          {!isCompleted && (
            <button className="primary" onClick={() => onStart?.(mission)}>
              Продолжить
            </button>
          )}
          {isCompleted && <div className="meta subtle">Можно взять бонус-челлендж</div>}
          <Link to="/missions" className="ghost">
            Все задания
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TodayMissionCard;
