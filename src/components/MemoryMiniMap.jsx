import React, { useMemo } from "react";
import LandmarkTile from "./LandmarkTile";

const MemoryMiniMap = ({ landmarks, selectedLandmarkId, entries, highlightedLandmarkIds = new Set(), onSelectLandmark }) => {
  const countsByLandmark = useMemo(
    () =>
      entries.reduce((acc, entry) => {
        acc[entry.landmarkId] = (acc[entry.landmarkId] || 0) + 1;
        return acc;
      }, {}),
    [entries]
  );

  const gridRows = useMemo(() => Math.max(...landmarks.map((item) => item.position.row), 4), [landmarks]);
  const gridCols = useMemo(() => Math.max(...landmarks.map((item) => item.position.col), 3), [landmarks]);

  return (
    <div className="memory-map card">
      <div className="memory-map-header">
        <div>
          <div className="card-header">Мини-карта памяти — Москва</div>
          <p className="meta">Кликай по объектам: каждая плитка — контейнер для записей и материалов.</p>
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

      <div className="mini-map-frame">
        <div
          className="mini-map-grid"
          style={{
            gridTemplateRows: `repeat(${gridRows}, minmax(72px, 1fr))`,
            gridTemplateColumns: `repeat(${gridCols}, minmax(82px, 1fr))`,
          }}
        >
          {landmarks.map((landmark) => (
            <LandmarkTile
              key={landmark.id}
              landmark={landmark}
              count={countsByLandmark[landmark.id] || 0}
              selected={selectedLandmarkId === landmark.id}
              highlighted={highlightedLandmarkIds.has(landmark.id)}
              onSelect={onSelectLandmark}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MemoryMiniMap;
