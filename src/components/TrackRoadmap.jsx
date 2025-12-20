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

const DevelopmentTrackArrow = () => (
  <div className="development-track-arrow" aria-hidden>
    <svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 10h10" />
      <path d="M11 6l4 4-4 4" />
    </svg>
  </div>
);

const DevelopmentTrackCard = React.forwardRef(
  ({ step, index, completedSet, activeId, onSelect }, ref) => {
    const status = statusLabel(step, completedSet, activeId);
    const theme = themeMeta[step.theme] || themeMeta[step.tag] || themeMeta.growth;
    const rewardIcon = rewardMeta[step.rewardType] || rewardMeta.xp;
    const progressValue = completedSet.has(step.id)
      ? 100
      : status === "В процессе"
      ? 55
      : 12;

    return (
      <button
        type="button"
        ref={ref}
        className={`development-track-card ${status === "Готово" ? "done" : status === "В процессе" ? "active" : "idle"}`}
        onClick={() => onSelect?.()}
      >
        <div className="development-track-card__head">
          <span className="pill subtle development-track-card__step">{index + 1}</span>
          <span className={`status-dot ${status === "Готово" ? "success" : status === "В процессе" ? "active" : "muted"}`}>
            {status}
          </span>
        </div>
        <div className="development-track-card__content">
          <div className="development-track-card__title" style={{ color: theme.color }}>
            <span className="development-track-card__emoji" aria-hidden>
              {theme.icon}
            </span>
            <div className="development-track-card__text">
              <p className="mini-label development-track-card__category" title={theme.label}>
                {theme.label}
              </p>
              <h4 className="development-track-card__heading" title={step.shortTitle || step.title}>
                {step.shortTitle || step.title}
              </h4>
            </div>
          </div>
          <p className="meta subtle development-track-card__meta" title={step.themeLabel || step.description}>
            {step.themeLabel || theme.label || "Рост"}
          </p>
        </div>
        <div className="development-track-card__progress" aria-hidden>
          <span className="development-track-card__progress-bar">
            <span style={{ width: `${progressValue}%` }} />
          </span>
          <span className="development-track-card__reward" title={step.xpReward ? `+${step.xpReward} XP` : "Микронаграда"}>
            {rewardIcon} {step.xpReward ? `+${step.xpReward} XP` : "Микронаграда"}
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

  const chunkedRows = useMemo(() => {
    const slices = [];
    for (let i = 0; i < steps.length; i += 5) {
      slices.push(steps.slice(i, i + 5));
    }
    return slices.slice(0, 2);
  }, [steps]);

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
        <div className="development-track">
          {chunkedRows.map((row, rowIndex) => (
            <div className="development-track-row" key={`row-${rowIndex}`}>
              {row.map((step, stepIndex) => {
                const cardRef = React.createRef();
                const absoluteIndex = rowIndex * 5 + stepIndex;
                return (
                  <React.Fragment key={step.id}>
                    <DevelopmentTrackCard
                      ref={cardRef}
                      step={step}
                      index={absoluteIndex}
                      completedSet={completedSet}
                      activeId={activeStepId}
                      onSelect={() => handleOpenStep(step, cardRef.current)}
                    />
                    {stepIndex < row.length - 1 && <DevelopmentTrackArrow />}
                  </React.Fragment>
                );
              })}
            </div>
          ))}
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
