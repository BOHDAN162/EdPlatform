import React, { useMemo, useState } from "react";
import { useNavigate } from "../routerShim";
import { getMaterialById } from "../libraryData";
import PersonaScene from "./PersonaScene";

const statusLabel = (step, completedSet, activeId) => {
  if (completedSet.has(step.id)) return "Готово";
  if (activeId === step.id) return "В процессе";
  return "Не начато";
};

const TrackStepCard = ({ step, index, completedSet, activeId, onClick }) => {
  const status = statusLabel(step, completedSet, activeId);
  return (
    <div
      className={`track-step-card ${status === "Готово" ? "done" : status === "В процессе" ? "active" : "idle"}`}
      onClick={onClick}
    >
      <div className="track-step-head">
        <span className="pill outline">Шаг {index + 1}</span>
        <span className={`status-dot ${status === "Готово" ? "success" : status === "В процессе" ? "active" : "muted"}`}>
          {status}
        </span>
      </div>
      <h4>{step.shortTitle || step.title}</h4>
      <p className="meta subtle">{step.theme || "Рост"}</p>
      <div className="mini-progress">
        <div
          className="mini-progress-fill"
          style={{ width: completedSet.has(step.id) ? "100%" : status === "В процессе" ? "45%" : "8%" }}
        />
      </div>
    </div>
  );
};

const TrackStepDetail = ({ step, onClose, onNavigate, material }) => (
  <div className="track-detail">
    <div className="track-detail-head">
      <div>
        <p className="pill outline">Шаг {step.order}</p>
        <h3>{step.title}</h3>
        <p className="meta">{step.description}</p>
      </div>
      <button className="ghost" onClick={onClose}>
        Закрыть
      </button>
    </div>
    {material && (
      <div className="track-detail-material">
        <span className="pill">{material.typeLabel || material.type}</span>
        <div>
          <p className="detail-title">{material.title}</p>
          <p className="meta subtle">{material.estimatedTime || "15–30 мин"}</p>
        </div>
      </div>
    )}
    <button className="primary" onClick={onNavigate}>
      Перейти к этапу
    </button>
  </div>
);

const variantByProfile = {
  founder: "start",
  strategist: "library",
  leader: "community",
  creator: "gamification",
};

const TrackRoadmap = ({ track, onStart, onEdit }) => {
  const navigate = useNavigate();
  const [selectedStep, setSelectedStep] = useState(null);
  const steps = track?.generatedTrack || track?.trackSteps || [];
  const hasTrack = steps.length > 0;
  const completedSet = useMemo(() => new Set(track?.completedStepIds || []), [track?.completedStepIds]);
  const activeStepId = useMemo(() => {
    const firstActive = steps.find((step) => !completedSet.has(step.id));
    return firstActive?.id || steps[0]?.id;
  }, [completedSet, steps]);

  const openStep = (step) => {
    setSelectedStep(step);
  };

  const materialIndex = useMemo(() => {
    const entries = (steps || []).map((step) => getMaterialById(step.materialId)).filter(Boolean);
    return Object.fromEntries(entries.map((m) => [m.id, m]));
  }, [steps]);

  const handleNavigate = (step) => {
    const material = materialIndex[step.materialId];
    const targetType = step.materialType || material?.type || "course";
    const path = material ? `/library/${targetType}/${material.id}` : "/library";
    navigate(path);
  };

  const topRow = steps.slice(0, 5);
  const bottomRow = steps.slice(5, 10);
  const personaVariant = variantByProfile[track?.profileKey] || "start";

  return (
    <section className="missions-track">
      <div className="missions-track-head">
        <div>
          <p className="landing-kicker">Твой трек развития</p>
          <h2>{hasTrack ? track?.trackTitle || "10 шагов роста" : "Сначала собери свой маршрут"}</h2>
          <p className="meta">
            {hasTrack
              ? "Два уровня по пять шагов. Начни с первого блока, кликай по карточке, чтобы открыть детали и перейти к материалу."
              : "Ответь на 10 вопросов, чтобы получить персональный путь. Его всегда можно пересобрать."}
          </p>
          {hasTrack ? (
            <div className="chip-row">
              <span className="chip ghost">Профиль: {track?.profileResult?.profileType || track?.profileType}</span>
              <button className="ghost" onClick={onEdit}>
                Редактировать трек
              </button>
            </div>
          ) : (
            <button className="primary" onClick={onStart}>
              Начать опрос
            </button>
          )}
        </div>
        <div className="missions-track-visual" aria-hidden>
          <PersonaScene variant={personaVariant} />
        </div>
      </div>

      {hasTrack ? (
        <div className="track-grid-wrapper">
          <div className="track-grid-row">
            {topRow.map((step, idx) => (
              <TrackStepCard
                key={step.id}
                step={step}
                index={idx}
                completedSet={completedSet}
                activeId={activeStepId}
                onClick={() => openStep(step)}
              />
            ))}
          </div>
          <div className="track-grid-row">
            {bottomRow.map((step, idx) => (
              <TrackStepCard
                key={step.id}
                step={step}
                index={idx + 5}
                completedSet={completedSet}
                activeId={activeStepId}
                onClick={() => openStep(step)}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="empty-track">Тут появится твой персональный маршрут после опроса.</div>
      )}

      {selectedStep && (
        <TrackStepDetail
          step={selectedStep}
          material={materialIndex[selectedStep.materialId]}
          onClose={() => setSelectedStep(null)}
          onNavigate={() => handleNavigate(selectedStep)}
        />
      )}
    </section>
  );
};

export default TrackRoadmap;
