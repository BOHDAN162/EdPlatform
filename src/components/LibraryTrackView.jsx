import React, { useMemo, useState } from "react";
import { useNavigate } from "../routerShim";
import TrackEditPanel from "./TrackEditPanel";

const arrowLabels = ["→", "→", "→", "→"];

const LibraryTrackView = ({ track, materials = [], completedMaterialIds = [], onUpdateSteps, onRetake }) => {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState(null);
  const [editing, setEditing] = useState(false);

  if (!track?.trackSteps?.length) return null;

  const materialIndex = useMemo(() => Object.fromEntries(materials.map((m) => [m.id, m])), [materials]);
  const steps = track.trackSteps;
  const completedSet = new Set(completedMaterialIds || []);
  const selectedStep = steps.find((s) => s.id === selectedId) || steps[0];

  const mid = Math.ceil(steps.length / 2);
  const topRow = steps.slice(0, mid);
  const bottomRow = steps.slice(mid);

  const handleGoToStep = (step) => {
    const targetId = step?.materials?.[0] || step?.materialId;
    if (!targetId) return;
    navigate(`/material/${targetId}`);
  };

  const handleSaveEdits = (nextSteps) => {
    onUpdateSteps?.(nextSteps);
    setEditing(false);
  };

  const renderNode = (step, idx) => {
    const done = completedSet.has(step.materialId || step.materials?.[0]);
    const active = step.id === selectedStep?.id;
    return (
      <button
        key={step.id}
        className={`track-node ${done ? "done" : ""} ${active ? "active" : ""}`}
        onClick={() => setSelectedId(step.id)}
      >
        <div className="node-circle">{done ? "✓" : step.orderIndex || idx + 1}</div>
        <div className="node-title">{step.title}</div>
      </button>
    );
  };

  const renderRow = (row, isBottom) => (
    <div className={`track-row ${isBottom ? "bottom" : "top"}`}>
      {row.map((step, idx) => (
        <React.Fragment key={step.id}>
          {renderNode(step, idx)}
          {idx < row.length - 1 && <div className="track-arrow">{arrowLabels[idx] || "→"}</div>}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div className="library-track">
      <div className="library-track-head">
        <div>
          <p className="pill outline">Твой путь развития</p>
          <h2>{track.trackTitle || "Путь из 10 шагов"}</h2>
          <p className="meta">10 шагов, которые помогут тебе вырасти быстрее.</p>
        </div>
        <div className="chip-row">
          <button className="ghost" onClick={() => setEditing(true)}>
            Редактировать трек
          </button>
          <button className="ghost" onClick={onRetake}>
            Пройти опрос заново и перестроить трек
          </button>
        </div>
      </div>

      <div className="track-canvas">
        {renderRow(topRow, false)}
        {bottomRow.length > 0 && <div className="track-connector" aria-hidden />}
        {bottomRow.length > 0 && renderRow(bottomRow, true)}
      </div>

      {selectedStep && (
        <div className="track-step-detail card">
          <div className="card-header">{selectedStep.title}</div>
          <p className="meta">{selectedStep.description}</p>
          <ul className="material-links">
            {(selectedStep.materials || [selectedStep.materialId]).map((id) => {
              const material = materialIndex[id];
              if (!material) return null;
              return (
                <li key={id}>
                  <span className="pill outline">{material.type === "course" ? "Курс" : material.type === "article" ? "Статья" : "Тест"}</span>
                  <span className="material-title">{material.title}</span>
                </li>
              );
            })}
          </ul>
          <div className="chip-row">
            <button className="primary" onClick={() => handleGoToStep(selectedStep)}>
              Перейти к цели
            </button>
            <button className="ghost" onClick={() => setSelectedId(null)}>
              Свернуть
            </button>
          </div>
        </div>
      )}

      {editing && (
        <TrackEditPanel steps={steps} onSave={handleSaveEdits} onCancel={() => setEditing(false)} />
      )}
    </div>
  );
};

export default LibraryTrackView;
