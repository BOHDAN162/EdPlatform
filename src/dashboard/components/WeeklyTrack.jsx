import React from "react";

const weekdays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

const WeeklyTrack = ({ week }) => {
  return (
    <section className="card weekly-track">
      <div className="section-head">
        <div>
          <p className="meta">Трек недели</p>
          <h3>Шаги по дням</h3>
          <p className="meta subtle">План + факт активности за последние 7 дней</p>
        </div>
      </div>
      <div className="week-grid">
        {week.map((day) => (
          <div key={day.date} className={`day-card status-${day.status}`}>
            <div className="day-top">
              <div className="pill subtle">{weekdays[day.weekday]}</div>
              <span className="meta subtle">{day.label}</span>
            </div>
            <div className="day-progress">
              <div className="progress-bar small">
                <div className="progress-fill" style={{ width: `${day.progress}%` }} />
              </div>
              <div className="meta subtle">{day.completed} / {day.planned} миссий</div>
            </div>
            <div className="day-actions">
              <span className="pill accent">{day.focus}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WeeklyTrack;
