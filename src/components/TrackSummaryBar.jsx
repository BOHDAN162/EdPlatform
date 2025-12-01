import React from "react";
import { useNavigate } from "../routerShim";

const TrackSummaryBar = ({ track, completedMaterialIds = [] }) => {
  const navigate = useNavigate();
  if (!track?.generatedTrack?.length) return null;

  const completedSet = new Set(completedMaterialIds);
  const doneCount = track.generatedTrack.filter((step) => completedSet.has(step.materialId)).length;
  const total = track.generatedTrack.length;

  const goToMaterial = (step) => {
    if (!step) return;
    const type = step.materialType || "article";
    navigate(type === "test" ? `/tests/${step.materialId}` : `/library/${type}/${step.materialId}`);
  };

  return (
    <div className="track-summary-bar card">
      <div className="track-summary-head">
        <div>
          <p className="pill outline">Твой трек развития</p>
          <h3>{track.trackTitle || track.profileType || "Личный маршрут"}</h3>
          <p className="meta">Прогресс: {doneCount} из {total} шагов</p>
        </div>
        <button className="ghost" onClick={() => navigate("/track")}>Обновить опрос</button>
      </div>
      <div className="track-summary-line">
        {track.generatedTrack.map((step, idx) => {
          const done = completedSet.has(step.materialId);
          const active = !done && idx === doneCount;
          return (
            <button
              key={step.id}
              className={`track-summary-node ${done ? "done" : ""} ${active ? "active" : ""}`}
              onClick={() => goToMaterial(step)}
            >
              <span className="track-summary-index">{done ? "✓" : idx + 1}</span>
              <span className="track-summary-title">{step.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TrackSummaryBar;
