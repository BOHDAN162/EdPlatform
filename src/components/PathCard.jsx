import React from "react";
import { Link } from "../routerShim";
import { themeLabels } from "../libraryData";

const ProgressBar = ({ value }) => (
  <div className="progress-shell">
    <div className="progress-fill" style={{ width: `${value}%` }} />
  </div>
);

const PathCard = ({ path, progress, onOpen }) => {
  const { completedCount, totalCount } = progress;
  const ratio = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;
  const theme = themeLabels[path.theme] || { accent: "#6b7280", title: "Тема" };

  const cta = completedCount === 0 ? "Начать путь" : completedCount < totalCount ? "Продолжить" : "Повторить";

  return (
    <div className="path-card">
      <div className="path-card-top">
        <div className="path-meta">
          <span className="path-theme" style={{ background: `${theme.accent}20`, color: theme.accent }}>
            {theme.title || "Тема"}
          </span>
          <span className="path-progress">{completedCount} из {totalCount} шагов</span>
        </div>
        <h3 className="path-title">{path.title}</h3>
        <p className="path-description">{path.description}</p>
      </div>
      <ProgressBar value={ratio} />
      <div className="path-actions">
        <button className="primary" onClick={onOpen}>{cta}</button>
        <Link className="ghost" to={`/library/paths/${path.slug}`}>Детали пути</Link>
      </div>
    </div>
  );
};

export default PathCard;
