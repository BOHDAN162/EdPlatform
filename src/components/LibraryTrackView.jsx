import React, { useMemo, useState } from "react";
import { useNavigate } from "../routerShim";
import TrackEditPanel from "./TrackEditPanel";
import LibraryCard from "./LibraryCard";

const TrackStepCard = ({ step, index, isDone, isActive, onSelect }) => {
  const materialCount = step.materials?.length || (step.materialId ? 1 : 0);

  return (
    <LibraryCard
      className={`track-step-card ${isDone ? "done" : ""}`}
      compact
      onClick={onSelect}
      active={isActive}
      badges={[
        <span key="step" className="pill outline">Шаг {index}</span>,
        isDone ? (
          <span key="done" className="pill success">
            Готово
          </span>
        ) : null,
      ].filter(Boolean)}
      title={step.title}
      description={step.description}
      footer={
        <div className="track-step-footer">
          <span className="pill subtle">Материалов: {materialCount || 1}</span>
          <span className="link-text">Открыть</span>
        </div>
      }
    />
  );
};

const LibraryTrackView = ({ track, materials = [], completedMaterialIds = [], onUpdateSteps, onRetake }) => {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState(null);
  const [editing, setEditing] = useState(false);

  if (!track?.trackSteps?.length) return null;

  const materialIndex = useMemo(() => Object.fromEntries(materials.map((m) => [m.id, m])), [materials]);
  const steps = track.trackSteps.slice(0, 10);
  const completedSet = new Set(completedMaterialIds || []);
  const selectedStep = steps.find((s) => s.id === selectedId) || steps[0];

  const topRow = steps.slice(0, 5);
  const bottomRow = steps.slice(5, 10);

  const handleGoToStep = (step) => {
    const targetId = step?.materials?.[0] || step?.materialId;
    if (!targetId) return;
    navigate(`/material/${targetId}`);
  };

  const handleSaveEdits = (nextSteps) => {
    onUpdateSteps?.(nextSteps);
    setEditing(false);
  };

  const renderRow = (row, offset = 0) => (
    <div className="track-row">
      {row.map((step, idx) => {
        const done = completedSet.has(step.materialId || step.materials?.[0]);
        const active = step.id === selectedStep?.id;
        const stepIndex = idx + 1 + offset;

        return (
          <div className="track-cell" key={step.id}>
            <TrackStepCard
              step={step}
              index={stepIndex}
              isDone={done}
              isActive={active}
              onSelect={() => setSelectedId(step.id)}
            />
            {idx < row.length - 1 && <div className="track-arrow">→</div>}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="library-track card">
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

      <div className="track-map">
        {renderRow(topRow, 0)}
        {bottomRow.length > 0 && (
          <div className="track-bridge" aria-hidden>
            <div className="track-bridge-line" />
            <div className="track-down-arrow">↓</div>
          </div>
        )}
        {bottomRow.length > 0 && renderRow(bottomRow, 5)}
      </div>

      {selectedStep && (
        <div className="track-step-detail card">
          <div className="panel-header">
            <div>
              <p className="section-kicker">Детали шага</p>
              <h3>{selectedStep.title}</h3>
            </div>
            <button className="ghost" onClick={() => setSelectedId(null)}>
              Свернуть
            </button>
          </div>
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
              Закрыть
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
