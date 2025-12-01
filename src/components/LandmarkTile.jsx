import React from "react";

const LandmarkTile = ({ landmark, count = 0, selected, highlighted, onSelect }) => {
  const hasRecords = count > 0;

  return (
    <button
      type="button"
      className={`landmark-tile ${selected ? "selected" : ""} ${hasRecords ? "has-records" : ""} ${
        highlighted ? "highlighted" : ""
      }`}
      style={{ gridRow: landmark.position.row, gridColumn: landmark.position.col, "--tile-color": landmark.color || "#7c3aed" }}
      onClick={() => onSelect(landmark.id)}
      title={`${landmark.name} • ${landmark.category}`}
    >
      <div className="tile-base">
        <div className="tile-top" />
        <div className="tile-front">
          <div className="tile-icon">{landmark.icon || "📍"}</div>
          <div className="tile-labels">
            <div className="tile-name">{landmark.shortName || landmark.name}</div>
            <div className="tile-category">{landmark.category}</div>
          </div>
        </div>
        {count > 0 && <span className="tile-count">{count}</span>}
      </div>
      <div className="tile-tooltip">
        <div className="tooltip-name">{landmark.name}</div>
        <div className="tooltip-meta">{landmark.district ? `${landmark.district} • ` : ""}{landmark.category}</div>
      </div>
    </button>
  );
};

export default LandmarkTile;
