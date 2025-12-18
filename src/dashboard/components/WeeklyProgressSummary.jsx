import React from "react";

const WeeklyProgressSummary = ({ summary }) => {
  const safeSummary = summary || {};
  const stats = [
    { label: "Заданий", value: safeSummary.missions ?? 0 },
    { label: "Материалов", value: safeSummary.materials ?? 0 },
    { label: "XP", value: safeSummary.xp ?? 0 },
    { label: "Streak", value: safeSummary.streak ?? 0 },
  ];

  const graph = Array.isArray(safeSummary.graph) && safeSummary.graph.length
    ? safeSummary.graph
    : [4, 6, 5, 7, 6, 5, 4];

  return (
    <section className="card weekly-progress">
      <div className="section-head">
        <div>
          <p className="meta">За последнюю неделю</p>
          <h3>Прогресс недели</h3>
        </div>
        <div className="meta subtle">Данные обновляются ежедневно</div>
      </div>
      <div className="weekly-progress-grid">
        <div className="weekly-stats">
          {stats.map((item) => (
            <div key={item.label} className="weekly-stat">
              <div className="stat-value">{item.value}</div>
              <div className="meta">{item.label}</div>
            </div>
          ))}
        </div>
        <div className="weekly-chart" aria-hidden="true">
          {graph.map((value, idx) => (
            <div key={idx} className="chart-bar">
              <div className="chart-fill" style={{ height: `${value * 8}px` }} />
              <span className="meta subtle">д{idx + 1}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WeeklyProgressSummary;
