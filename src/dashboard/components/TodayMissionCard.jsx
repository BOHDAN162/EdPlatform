import React from "react";
import { Link } from "../../routerShim";

const TodayMissionCard = ({ mission, onStart }) => {
  const progress = mission?.progress || { currentValue: 0, status: "new", badgeTier: 0 };
  const percent = mission?.targetValue
    ? Math.min(100, Math.round((progress.currentValue / mission.targetValue) * 100))
    : 0;
  const isCompleted = progress.status === "completed" || percent >= 100;

  return (
    <section className="card today-mission">
      <div className="section-head">
        <div>
          <p className="meta">Твоя миссия сегодня</p>
          <h3>{mission?.title || "Выбери миссию"}</h3>
          <p className="meta subtle">{mission?.description || "Когда появится миссия, она будет здесь."}</p>
        </div>
        <div className="pill accent">{mission?.period || "ежедневная"}</div>
      </div>
      {mission ? (
        <>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${percent}%` }} />
          </div>
          <div className="mission-footer">
            <div className="meta subtle">{percent}% · цель: {mission.targetValue}</div>
            {!isCompleted ? (
              <button className="primary" onClick={() => onStart(mission)}>
                {percent > 0 ? "Продолжить" : "Начать"}
              </button>
            ) : (
              <div className="success">Миссия завершена! Хочешь бонус-челлендж?</div>
            )}
          </div>
        </>
      ) : (
        <div className="empty">Пока миссий нет — открой раздел миссий и выбери цель.</div>
      )}
      <div className="meta subtle">
        <Link to="/missions">Все миссии</Link>
      </div>
    </section>
  );
};

export default TodayMissionCard;
