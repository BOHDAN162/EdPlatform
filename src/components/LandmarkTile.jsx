import React from "react";

const LandmarkTile = ({ landmark, count = 0, selected, highlighted, onSelect }) => {
  const hasRecords = count > 0;

  return (
    <button
      type="button"
      className={`landmark-tile ${selected ? "selected" : ""} ${hasRecords ? "has-records" : ""} ${
        highlighted ? "highlighted" : ""
      }`}
      style={{ "--tile-color": landmark.color || "#7c3aed" }}
      onClick={() => onSelect(landmark.id)}
      aria-label={`${landmark.name} — ${landmark.category}`}
      data-landmark-id={landmark.id}
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
    </button>
  );
};

export default LandmarkTile;
