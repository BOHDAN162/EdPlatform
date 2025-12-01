import React from "react";
import { Link } from "../routerShim";
import { themeLabels } from "../libraryData";

const typeLabels = {
  course: "Курс",
  article: "Лонгрид",
  test: "Тест",
  game: "Игра",
};

const statusLabels = {
  new: "Новое",
  inProgress: "В процессе",
  completed: "Завершено",
};

const statusTone = {
  new: { bg: "#f3e8ff", text: "#7c3aed" },
  inProgress: { bg: "#e0f2fe", text: "#2563eb" },
  completed: { bg: "#e5f9e7", text: "#16a34a" },
};

const MaterialCard = ({ material, status = "new", progress = 0 }) => {
  const theme = themeLabels[material.theme] || { accent: "#6b7280", title: "Тема" };
  const target = `/material/${material.id}`;
  const tone = statusTone[status] || statusTone.new;

  return (
    <Link className={`material-card ${status}`} to={target}>
      <div className="material-card-top">
        <div className="material-pill-row">
          <span className="pill solid" style={{ background: `${theme.accent}20`, color: theme.accent }}>
            {theme.title || "Тема"}
          </span>
          <span className="pill outline">{typeLabels[material.type] || "Материал"}</span>
          <span className="pill status" style={{ background: tone.bg, color: tone.text }}>
            {statusLabels[status]}
          </span>
        </div>
        <h4 className="material-title">{material.title}</h4>
        <p className="material-description">{material.description}</p>
      </div>

      <div className="material-meta-row">
        <span>{material.estimatedTime || "15 минут"}</span>
        <span>Уровень: {material.level || "начальный"}</span>
        <span>{typeLabels[material.type]}</span>
      </div>

      <div className="material-progress">
        <div className="progress-shell subtle">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <span className="meta subtle">{statusLabels[status]}</span>
      </div>

      <div className="material-card-footer">
        <span>Открыть</span>
        <span aria-hidden>→</span>
      </div>
    </Link>
  );
};

export default MaterialCard;
