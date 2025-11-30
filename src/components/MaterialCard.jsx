import React from "react";
import { Link } from "../routerShim";
import { themeLabels } from "../libraryData";

const typeLabels = {
  course: "Курс",
  article: "Статья",
  test: "Тест",
};

const MaterialCard = ({ material, completed }) => {
  const theme = themeLabels[material.theme] || { accent: "#6b7280", title: "Тема" };
  const badge = completed ? "Завершено" : typeLabels[material.type] || "Материал";
  const cta = completed ? "Повторить" : material.type === "article" ? "Читать" : "Открыть";
  const target = material.type === "test" ? `/tests/${material.id}` : `/library/${material.type}/${material.id}`;

  return (
    <div className={`material-card ${completed ? "completed" : ""}`}>
      <div className="material-top">
        <div className="material-badges">
          <span className="material-badge" style={{ background: `${theme.accent}20`, color: theme.accent }}>
            {theme.title || "Тема"}
          </span>
          <span className="material-badge outline">{badge}</span>
        </div>
        <h4 className="material-title">{material.title}</h4>
        <p className="material-description">{material.description}</p>
      </div>
      <div className="material-meta-row">
        <span>{material.estimatedTime || "15 минут"}</span>
        <span>Уровень: {material.level || "начальный"}</span>
        <span>{typeLabels[material.type]}</span>
      </div>
      <Link className="primary full" to={target}>
        {cta}
      </Link>
    </div>
  );
};

export default MaterialCard;
