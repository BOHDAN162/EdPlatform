import React, { useMemo } from "react";
import { Link } from "../routerShim";
import { materialIndex } from "../libraryData";

const categoryRecommendations = {
  бизнес: ["communication-advanced", "startup-kit", "negotiations-pro"],
  мышление: ["mindset-mini", "deep-work", "design-thinking"],
  финансы: ["finance-basics", "budget-quick", "invest-mini"],
  коммуникация: ["storytelling", "public-speaking", "writing-clear"],
  здоровье: ["energy-habits", "focus-wellbeing", "balance-walk"],
  отношения: ["empathy", "team-feedback", "soft-skills"],
  карьера: ["career-steps", "mentors", "skills-map"],
  другое: ["creative-warmup", "note-taking", "learn-fast"],
};

const MemoryRelatedMaterials = ({ entries }) => {
  const hasEntries = entries.length > 0;
  const latest = entries.slice(0, 3);
  const categories = new Set(latest.map((entry) => entry.category || entry.type));

  const recommendedIds = useMemo(() => {
    const ids = [];
    categories.forEach((cat) => {
      const bucket = categoryRecommendations[cat];
      if (bucket) ids.push(...bucket);
    });
    return ids.slice(0, 6).filter((id) => materialIndex[id]);
  }, [categories]);

  if (!hasEntries) {
    return (
      <div className="card related-materials-card">
        <div className="card-header">Связанные материалы</div>
        <p className="meta">Добавь заметку — и мы предложим материалы по теме.</p>
      </div>
    );
  }

  return (
    <div className="card related-materials-card">
      <div className="card-header">Связанные материалы</div>
      <div className="related-grid">
        {recommendedIds.map((id) => {
          const material = materialIndex[id];
          if (!material) return null;
          return (
            <div key={id} className="related-card">
              <div className="related-top">
                <span className="material-badge outline">{material.type === "course" ? "Курс" : material.type === "article" ? "Лонгрид" : "Материал"}</span>
                <span className="material-badge">{material.estimatedTime}</span>
              </div>
              <div className="related-title">{material.title}</div>
              <p className="meta">{material.description}</p>
              <Link to={`/material/${material.id}`} className="primary outline small">
                Открыть
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MemoryRelatedMaterials;
