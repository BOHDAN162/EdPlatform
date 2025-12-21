import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "../routerShim";
import { getMaterialById } from "../libraryData";
import PersonaScene from "./PersonaScene";

const themeMeta = {
  mindset: { icon: "🧠", label: "Mindset", color: "#22c55e" },
  productivity: { icon: "⚡", label: "Productivity", color: "#0ea5e9" },
  communication: { icon: "💬", label: "Communication", color: "#2563eb" },
  entrepreneurship: { icon: "🚀", label: "Entrepreneurship", color: "#8b5cf6" },
  growth: { icon: "📈", label: "Growth", color: "#f97316" },
};

const rewardMeta = { xp: "⭐", badge: "🏅", reward: "🎯" };

const statusLabel = (step, completedSet, activeId) => {
  if (completedSet.has(step.id)) return "Готово";
  if (activeId === step.id) return "В процессе";
  return "Не начато";
};

const DevelopmentTrackCard = React.forwardRef(
  ({ step, index, completedSet, activeId, onSelect }, ref) => {
    const status = statusLabel(step, completedSet, activeId);
    const theme = themeMeta[step.theme] || themeMeta[step.tag] || themeMeta.growth;
    const rewardIcon = rewardMeta[step.rewardType] || rewardMeta.xp;
    const statusTone = status === "Готово" ? "done" : status === "В процессе" ? "active" : "idle";
    const rewardLabel = step.xpReward ? `+${step.xpReward} XP` : "Микронаграда";

    return (
      <button
        type="button"
        ref={ref}
        className={`development-track-card ${statusTone}`}
        onClick={() => onSelect?.()}
      >
        <div className="development-track-card__header">
          <span className="development-track-card__index">{index + 1}</span>
          <span className={`development-track-card__status ${statusTone}`}>{status}</span>
        </div>
        <div className="development-track-card__body">
          <h4 className="development-track-card__heading" title={step.shortTitle || step.title}>
            {step.shortTitle || step.title}
          </h4>
          <p className="development-track-card__category" title={step.themeLabel || theme.label}>
            {step.themeLabel || theme.label || "Рост"}
          </p>
          <p className="development-track-card__description" title={step.description}>
            {step.description || "Короткий шаг из трека"}
          </p>
        </div>
        <div className="development-track-card__footer">
          <span className="development-track-card__reward" title={rewardLabel}>
            {rewardIcon} {rewardLabel}
          </span>
        </div>
      </button>
    );
  }
);

const TrackStepModal = ({ step, material, onClose, onNavigate }) => {
  const closeButtonRef = useRef(null);

  useEffect(() => {
    const handleKeydown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeydown);
    requestAnimationFrame(() => closeButtonRef.current?.focus());

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeydown);
    };
  }, [onClose]);

  const modalContent = (
    <div
      className="development-track-modal"
      role="dialog"
      aria-modal="true"
      aria-label={`Шаг ${step?.order}`}
      onClick={onClose}
    >
      <div className="development-track-modal__panel" onClick={(e) => e.stopPropagation()}>
        <div className="development-track-modal__head">
          <div>
            <p className="pill outline">Шаг {step?.order}</p>
            <h3>{step?.title}</h3>
            <p className="meta">{step?.description}</p>
          </div>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Закрыть" ref={closeButtonRef}>
            ✕
          </button>
        </div>
        {material && (
          <div className="development-track-modal__material">
            <span className="pill">{material.typeLabel || material.type}</span>
            <div>
              <p className="detail-title">{material.title}</p>
              <p className="meta subtle">{material.estimatedTime || "15–30 мин"}</p>
            </div>
          </div>
        )}
        <div className="development-track-modal__actions">
          <button type="button" className="ghost" onClick={onClose}>
            Закрыть
          </button>
          <button type="button" className="primary" onClick={onNavigate}>
            Перейти к этапу
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

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
  const lastFocusedRef = useRef(null);

  const materialIndex = useMemo(() => {
    const entries = (steps || []).map((step) => getMaterialById(step.materialId)).filter(Boolean);
    return Object.fromEntries(entries.map((m) => [m.id, m]));
  }, [steps]);

  const handleNavigate = (step) => {
    const material = materialIndex[step.materialId];
    const targetType = step.materialType || material?.type || "course";
    const path = material ? `/library/${targetType}/${material.id}` : "/library";
    navigate(path);
    setSelectedStep(null);
  };

  const handleOpenStep = (step, target) => {
    lastFocusedRef.current = target;
    setSelectedStep(step);
  };

  const handleClose = () => {
    setSelectedStep(null);
    if (lastFocusedRef.current) {
      lastFocusedRef.current.focus();
    }
  };

  const visibleSteps = useMemo(() => steps.slice(0, 10), [steps]);

  const personaVariant = variantByProfile[track?.profileKey] || "start";

  return (
    <section className="missions-track">
      <div className="missions-track-head">
        <div>
          <p className="landing-kicker">Твой трек развития</p>
          <h2>{hasTrack ? track?.trackTitle || "10 шагов роста" : "Сначала собери свой маршрут"}</h2>
          <p className="meta">
            {hasTrack
              ? "Два уровня по пять шагов. Нажми на карточку, чтобы открыть детали и перейти к материалу."
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
        <div className="development-track-grid">
          {visibleSteps.map((step, absoluteIndex) => {
            const cardRef = React.createRef();
            return (
              <DevelopmentTrackCard
                key={step.id}
                ref={cardRef}
                step={step}
                index={absoluteIndex}
                completedSet={completedSet}
                activeId={activeStepId}
                onSelect={() => handleOpenStep(step, cardRef.current)}
              />
            );
          })}
        </div>
      ) : (
        <div className="empty-track">Тут появится твой персональный маршрут после опроса.</div>
      )}

      {selectedStep && (
        <TrackStepModal
          step={selectedStep}
          material={materialIndex[selectedStep.materialId]}
          onClose={handleClose}
          onNavigate={() => handleNavigate(selectedStep)}
        />
      )}
    </section>
  );
};

export default TrackRoadmap;
