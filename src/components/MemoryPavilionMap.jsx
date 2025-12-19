import React from "react";
import { memoryLandmarks } from "../data/memoryLandmarks";

const categoryMeta = {
  бизнес: { color: "#2563eb", icon: "🏙️", label: "Бизнес" },
  финансы: { color: "#0f766e", icon: "💰", label: "Финансы" },
  мышление: { color: "#8b5cf6", icon: "🧠", label: "Мышление" },
  коммуникация: { color: "#e879f9", icon: "👥", label: "Коммуникация" },
  здоровье: { color: "#22c55e", icon: "🌿", label: "Баланс" },
  отношения: { color: "#f97316", icon: "🤝", label: "Отношения" },
  карьера: { color: "#0ea5e9", icon: "🎓", label: "Учёба" },
  другое: { color: "#f59e0b", icon: "💡", label: "Идеи" },
};

const goalPerPavilion = 20;

const getMeta = (category) => categoryMeta[category] || { color: "#6366f1", icon: "📍", label: category };

const MemoryPavilionMap = ({ entries, selectedId, highlighted = new Set(), onSelect, landmarks = memoryLandmarks }) => {
  const counts = entries.reduce((acc, entry) => {
    acc[entry.landmarkId] = (acc[entry.landmarkId] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="pavilion-map card">
      <div className="memory-map-header">
        <div>
          <div className="card-header">Карта-павильоны — Москва</div>
          <p className="meta">Наклони карту, выбери павильон и собирай записи как экспонаты музея.</p>
        </div>
        <div className="map-legend">
          <span className="legend-pill">
            <span className="legend-dot has-records" /> Записи есть
          </span>
          <span className="legend-pill">
            <span className="legend-dot" /> Пока пусто
          </span>
        </div>
      </div>

      <div className="pavilion-map-canvas" role="grid" aria-label="Карта павильонов памяти">
        <svg className="pavilion-grid" viewBox="0 0 100 60" aria-hidden>
          <defs>
            <linearGradient id="gridGradient" x1="0%" x2="100%" y1="0%" y2="100%">
              <stop offset="0%" stopColor="#1f2937" stopOpacity="0.04" />
              <stop offset="100%" stopColor="#111827" stopOpacity="0.08" />
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="100" height="60" fill="url(#gridGradient)" rx="6" />
        </svg>

        <div className="pavilion-grid-overlay">
          {landmarks.map((landmark) => {
            const meta = getMeta(landmark.category);
            const count = counts[landmark.id] || 0;
            const percent = Math.min(100, Math.round((count / goalPerPavilion) * 100));
            const highlightedCls = highlighted.has(landmark.id) ? "highlighted" : "";
            return (
              <button
                key={landmark.id}
                data-landmark-id={landmark.id}
                className={`pavilion-tile ${selectedId === landmark.id ? "selected" : ""} ${highlightedCls}`}
                style={{
                  background: `${meta.color}12`,
                  borderColor: `${meta.color}50`,
                  color: meta.color,
                }}
                onClick={() => onSelect(landmark.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelect(landmark.id);
                  }
                }}
                role="gridcell"
                aria-label={`Павильон ${landmark.name}. Записей: ${count}`}
                title={`Открыть павильон — ${count} заметок`}
              >
                <div className="pavilion-top">
                  <span className="pavilion-icon" aria-hidden>
                    {landmark.icon || meta.icon}
                  </span>
                  <div className="pavilion-name">{landmark.shortName || landmark.name}</div>
                </div>
                <div className="pavilion-meta-row">
                  <span className="pavilion-chip">{meta.label}</span>
                  <span className="pavilion-chip subtle">записей: {count} / {goalPerPavilion}</span>
                </div>
                <div className="pavilion-progress">
                  <svg viewBox="0 0 36 36" className="progress-ring" aria-hidden>
                    <path
                      className="ring-bg"
                      d="M18 2.0845
                         a 15.9155 15.9155 0 0 1 0 31.831
                         a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="ring-fill"
                      strokeDasharray={`${percent}, 100`}
                      d="M18 2.0845
                         a 15.9155 15.9155 0 0 1 0 31.831
                         a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <text x="18" y="20.35" className="ring-text">{count}</text>
                  </svg>
                  <div className="pavilion-progress-text">
                    <div className="progress-label">Записей</div>
                    <div className="progress-value">{count} / {goalPerPavilion}</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export { categoryMeta };
export default MemoryPavilionMap;
