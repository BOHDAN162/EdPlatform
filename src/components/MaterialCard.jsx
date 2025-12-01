import React, { useMemo } from "react";
import { useNavigate } from "../routerShim";
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
  completed: "Пройдено",
};

const statusClass = {
  new: "status-new",
  inProgress: "status-progress",
  completed: "status-done",
};

const deriveXpReward = (material) => {
  if (material.xpReward) return material.xpReward;
  const numbers = (material.estimatedTime || "").match(/\d+/g)?.map((n) => parseInt(n, 10)) || [];
  const maxMinutes = numbers.length ? Math.max(...numbers) : 0;
  if (maxMinutes <= 8) return 12;
  if (maxMinutes <= 20) return 20;
  if (maxMinutes <= 40) return 32;
  return 40;
};

const MaterialCard = ({ material, status = "new", onOpen }) => {
  const navigate = useNavigate();
  const theme = themeLabels[material.theme] || { accent: "#6b7280", title: "Тема" };
  const xpReward = useMemo(() => deriveXpReward(material), [material]);
  const cta = status === "completed" ? "Повторить" : status === "inProgress" ? "Продолжить" : "Открыть";

  const handleOpen = () => {
    if (onOpen) {
      onOpen();
      return;
    }
    navigate(`/material/${material.id}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleOpen();
    }
  };

  return (
    <div
      className={`material-card modern ${statusClass[status] || ""}`}
      onClick={handleOpen}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div className="material-card-top">
        <div className="badge-row">
          <span className="pill badge-type">{typeLabels[material.type] || "Материал"}</span>
          <span className="pill badge-theme" style={{ background: `${theme.accent}16`, color: theme.accent }}>
            {theme.title || "Тема"}
          </span>
        </div>
        <div className="badge-row align-right">
          <span className={`status-badge ${statusClass[status] || ""}`}>{statusLabels[status] || "Новое"}</span>
          <span className="pill xp-pill">+{xpReward} XP</span>
        </div>
      </div>

      <div className="material-card-body">
        <h4 className="material-card-title">{material.title}</h4>
        <p className="material-card-description">{material.description}</p>
      </div>

      <div className="material-card-meta">
        <span className="meta-chip">{material.estimatedTime || "10–15 минут"}</span>
        <span className="meta-chip">Уровень: {material.level || "базовый"}</span>
        <span className="meta-chip subtle">{typeLabels[material.type] || "Материал"}</span>
      </div>

      <div className="material-card-footer">
        <div className="meta-small">{status === "completed" ? "Можно повторить или выбрать новое" : "Кликни, чтобы открыть"}</div>
        <button
          className="primary ghost"
          onClick={(e) => {
            e.stopPropagation();
            handleOpen();
          }}
        >
          {cta}
        </button>
      </div>
    </div>
  );
};

export default MaterialCard;
