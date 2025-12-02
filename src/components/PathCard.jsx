import React from "react";
import { Link } from "../routerShim";
import { themeLabels } from "../libraryData";
import LibraryCard from "./LibraryCard";

const PathCard = ({ path, progress, onOpen }) => {
  const { completedCount, totalCount } = progress;
  const ratio = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;
  const theme = themeLabels[path.theme] || { accent: "#6b7280", title: "Тема" };

  const cta = completedCount === 0 ? "Начать путь" : completedCount < totalCount ? "Продолжить" : "Повторить";

  return (
    <LibraryCard
      className="path-card"
      badges={[
        <span
          key="theme"
          className="path-theme"
          style={{ background: `${theme.accent}20`, color: theme.accent }}
        >
          {theme.title || "Тема"}
        </span>,
        <span key="progress" className="pill subtle">
          {completedCount} из {totalCount} шагов
        </span>,
      ]}
      title={path.title}
      description={path.description}
      progress={ratio}
      footer={
        <div className="path-actions">
          <button className="primary" onClick={onOpen}>{cta}</button>
          <Link className="ghost" to={`/library/paths/${path.slug}`}>
            Детали пути
          </Link>
        </div>
      }
    />
  );
};

export default PathCard;
