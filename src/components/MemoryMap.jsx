import React, { useMemo } from "react";

const MemoryMap = ({ landmarks, selectedId, entries, highlightedLandmarkIds = new Set(), onSelect }) => {
  const countsByLandmark = useMemo(() => {
    return entries.reduce((acc, entry) => {
      acc[entry.landmarkId] = (acc[entry.landmarkId] || 0) + 1;
      return acc;
    }, {});
  }, [entries]);

  return (
    <div className="memory-map card">
      <div className="memory-map-header">
        <div>
          <div className="card-header">Карта памяти — Москва</div>
          <p className="meta">Нажми на объект, чтобы открыть записи. Фиолетовый подсветит выделенный район.</p>
        </div>
        <div className="map-legend">
          <span className="legend-dot has-records" /> записи есть
          <span className="legend-dot" /> пока пусто
        </div>
      </div>
      <div className="memory-grid">
        {landmarks.map((landmark) => {
          const count = countsByLandmark[landmark.id] || 0;
          const selected = selectedId === landmark.id;
          const highlighted = highlightedLandmarkIds.has(landmark.id);
          return (
            <button
              key={landmark.id}
              type="button"
              className={`memory-tile ${selected ? "selected" : ""} ${count ? "filled" : ""} ${highlighted ? "highlighted" : ""}`}
              style={{ left: `${landmark.position.x}%`, top: `${landmark.position.y}%` }}
              onClick={() => onSelect(landmark.id)}
              title={`${landmark.name} • ${landmark.category}`}
            >
              <div className="tile-shadow" />
              <div className="tile-body" style={{ borderColor: landmark.color }}>
                <div className="tile-icon">{landmark.icon || "📍"}</div>
                <div className="tile-label">{landmark.shortName || landmark.name}</div>
                <div className="tile-meta">{landmark.category}</div>
                {count > 0 && <span className="tile-badge">{count}</span>}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MemoryMap;
