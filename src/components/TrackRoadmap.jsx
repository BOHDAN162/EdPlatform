import React, { useMemo, useState } from "react";
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

const TrackStepCard = ({ step, index, completedSet, activeId, onClick }) => {
  const status = statusLabel(step, completedSet, activeId);
  const theme = themeMeta[step.theme] || themeMeta[step.tag] || themeMeta.growth;
  const rewardIcon = rewardMeta[step.rewardType] || rewardMeta.xp;
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
      <div className="track-step-body">
        <div className="track-step-icon" style={{ color: theme.color }}>
          <span aria-hidden>{theme.icon}</span>
          <div>
            <p className="mini-label">{theme.label}</p>
            <h4 title={step.shortTitle || step.title}>{step.shortTitle || step.title}</h4>
          </div>
        </div>
        <p className="meta subtle" title={step.description}>
          {step.themeLabel || step.theme || "Рост"}
        </p>
      </div>
      <div className="mini-progress">
        <div
          className="mini-progress-fill"
          style={{ width: completedSet.has(step.id) ? "100%" : status === "В процессе" ? "45%" : "10%" }}
        />
      </div>
      <div className="track-step-footer">
        <span className="reward-chip" aria-label="Награда">
          {rewardIcon} {step.xpReward ? `+${step.xpReward} XP` : "Микронаграда"}
        </span>
        <span className="track-step-direction" style={{ color: theme.color }}>
          →
        </span>
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

const StepConnector = () => (
  <div className="step-connector" aria-hidden>
    <span className="connector-line" />
    <span className="connector-node" />
    <span className="connector-line" />
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
            {topRow.flatMap((step, idx) => (
              [
                <TrackStepCard
                  key={step.id}
                  step={step}
                  index={idx}
                  completedSet={completedSet}
                  activeId={activeStepId}
                  onClick={() => openStep(step)}
                />,
                idx < topRow.length - 1 ? <StepConnector key={`conn-top-${step.id}`} /> : null,
              ].filter(Boolean)
            ))}
          </div>
          <div className="track-grid-row">
            {bottomRow.flatMap((step, idx) => (
              [
                <TrackStepCard
                  key={step.id}
                  step={step}
                  index={idx + 5}
                  completedSet={completedSet}
                  activeId={activeStepId}
                  onClick={() => openStep(step)}
                />,
                idx < bottomRow.length - 1 ? <StepConnector key={`conn-bottom-${step.id}`} /> : null,
              ].filter(Boolean)
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
