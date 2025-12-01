import React, { useMemo, useState } from "react";
import { useNavigate } from "./routerShim";
import { missions, getMissionProgress, missionThemeLabel, linkToMaterial } from "./missionsData";
import { getMaterialById, themeLabels } from "./libraryData";
import { getLevelFromXP, getRoleFromLevel } from "./gamification";
import { relativeTime } from "./communityState";

const ProgressLine = ({ value }) => (
  <div className="progress-shell">
    <div className="progress-fill" style={{ width: `${Math.min(100, value)}%` }} />
  </div>
);

const NextStepCard = ({ material, onStart, doneCount, totalSteps }) => {
  if (!material) return null;
  const remaining = Math.max((totalSteps || 0) - doneCount, 0);
  return (
    <div className="card focus next-step">
      <div className="card-header">Твой следующий шаг</div>
      <p className="meta">
        Мы подготовили шаг, который лучше всего двигает твой трек. Открой его прямо сейчас.
      </p>
      <div className="next-step-body">
        <div>
          <div className="pill filled">{material.type === "test" ? "Тест" : material.type === "article" ? "Лонгрид" : "Урок"}</div>
          <h3>{material.title}</h3>
          <p className="meta">{material.description || "Материал из твоего трека"}</p>
          <div className="meta subtle">~ {material.estimatedTime || "15 минут"} · {material.level || "базовый"}</div>
        </div>
        <div className="next-actions">
          <button className="primary large" onClick={() => onStart(material)}>Перейти к шагу</button>
          <span className="meta subtle">До финиша: {remaining} шагов · всего {totalSteps}</span>
        </div>
      </div>
    </div>
  );
};

const MainTrackCard = ({ steps, completedSet, onOpenMaterial }) => {
  const doneCount = steps.filter((s) => completedSet.has(s.materialId)).length;
  const ratio = steps.length ? Math.round((doneCount / steps.length) * 100) : 0;
  return (
    <div className="card main-track path-card">
      <div className="card-header">Основной трек</div>
      {steps.length ? (
        <>
          <p className="meta">Прогресс: {doneCount} из {steps.length} · {ratio}%</p>
          <div className="track-path">
            {steps.map((step, idx) => {
              const done = completedSet.has(step.materialId);
              const active = !done && idx === doneCount;
              return (
                <button
                  key={step.id}
                  className={`path-node ${done ? "done" : ""} ${active ? "active" : ""}`}
                  onClick={() => onOpenMaterial(step.materialId)}
                >
                  <span className="path-index">{done ? "✓" : idx + 1}</span>
                  <span className="path-title">{step.title}</span>
                </button>
              );
            })}
          </div>
        </>
      ) : (
        <div className="empty">Пока нет трека. Собери его через опрос.</div>
      )}
    </div>
  );
};

const MissionCard = ({ mission, progress, onSelect }) => {
  const theme = themeLabels[mission.theme] || { accent: "#7c3aed", title: "Тема" };
  const ratio = progress.totalSteps ? Math.round((progress.completedSteps / progress.totalSteps) * 100) : 0;
  const statusLabel = progress.status === "completed" ? "Завершена" : progress.status === "in_progress" ? "В процессе" : "Не начата";
  return (
    <button className={`mission-card ${progress.status}`} onClick={onSelect}>
      <div className="mission-top">
        <span className="material-badge" style={{ background: `${theme.accent}20`, color: theme.accent }}>
          {missionThemeLabel(mission.theme)}
        </span>
        <span className={`pill outline ${progress.status}`}>{statusLabel}</span>
      </div>
      <h3>{mission.title}</h3>
      <p className="meta">{mission.description}</p>
      <div className="mission-meta">
        <span>{mission.estimatedTime}</span>
        <span>XP: +{mission.xpReward}</span>
      </div>
      <ProgressLine value={ratio} />
      <div className="meta subtle">Шаги: {progress.completedSteps}/{progress.totalSteps}</div>
    </button>
  );
};

const MissionDetail = ({
  mission,
  progress,
  notes,
  onToggleStep,
  onStart,
  onComplete,
  onNoteChange,
  onOpenMaterial,
  relatedPosts = [],
  onOpenCommunity,
}) => {
  if (!mission) return null;
  const theme = themeLabels[mission.theme] || { accent: "#7c3aed", title: "Тема" };
  const allDone = mission.steps.every((s) => progress.steps.includes(s.id));
  return (
    <div className="card mission-detail">
      <div className="mission-detail-header">
        <div>
          <div className="pill outline">{mission.type === "project" ? "Проект" : "Миссия"}</div>
          <h2>{mission.title}</h2>
          <p className="meta">{mission.description}</p>
          <div className="mission-tags">
            <span className="material-badge" style={{ background: `${theme.accent}20`, color: theme.accent }}>
              {missionThemeLabel(mission.theme)}
            </span>
            <span className="material-badge outline">{mission.difficulty}</span>
            <span className="material-badge outline">{mission.estimatedTime}</span>
            <span className="material-badge outline">+{mission.xpReward} XP</span>
          </div>
        </div>
        <div className="mission-actions">
          <button className="ghost" onClick={onStart}>Начать</button>
          <button className="primary" disabled={!allDone} onClick={onComplete}>Отметить завершение</button>
        </div>
      </div>
      <div className="mission-steps">
        {mission.steps.map((step) => {
          const materialLink = step.materialId ? linkToMaterial(step.materialId) : null;
          const done = progress.steps.includes(step.id);
          return (
            <label key={step.id} className={`mission-step ${done ? "done" : ""}`}>
              <input
                type="checkbox"
                checked={done}
                onChange={() => onToggleStep(step.id)}
              />
              <div>
                <div className="mission-step-title">{step.title}</div>
                <p className="meta">{step.description}</p>
                {materialLink && (
                  <button className="ghost" onClick={() => onOpenMaterial(materialLink.id)}>
                    Открыть урок: {materialLink.title}
                  </button>
                )}
              </div>
            </label>
          );
        })}
      </div>
      <div className="mission-notes">
        <div className="card-header">Заметки по миссии</div>
        <textarea value={notes || ""} onChange={(e) => onNoteChange(e.target.value)} placeholder="Фиксируй находки, вопросы и инсайты" />
      </div>
      <div className="mission-community-block">
        <div className="card-header">Обсуждение этой миссии</div>
        {relatedPosts.length ? (
          <div className="mission-posts">
            {relatedPosts.map((post) => (
              <div key={post.id} className="mission-post-row">
                <div>
                  <div className="mission-post-title">{post.title}</div>
                  <p className="meta">{post.content}</p>
                  <p className="meta subtle">{post.relativeTime || "Недавно"}</p>
                </div>
                <span className="pill outline">{post.type === "question" ? "Вопрос" : "Миссия"}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="meta">Постов пока нет. Поделись своим результатом первым.</p>
        )}
        <button className="ghost" onClick={onOpenCommunity}>Посмотреть в сообществе</button>
      </div>
    </div>
  );
};

const GoalsCard = ({ goals = [] }) => {
  const daily = goals.filter((g) => g.type === "daily");
  const weekly = goals.filter((g) => g.type === "weekly");
  const renderGoal = (goal) => {
    const progress = Math.min(100, Math.round(((goal.progress || 0) / goal.target) * 100));
    return (
      <div key={goal.id} className={`goal-item ${goal.completed ? "done" : ""}`}>
        <div className="goal-top">
          <div>
            <div className="goal-title">{goal.title}</div>
            <p className="meta">{goal.description}</p>
          </div>
          <span className="goal-value">{goal.progress || 0}/{goal.target}</span>
        </div>
        <ProgressLine value={progress} />
        {goal.completed && <div className="meta success">Выполнено · +{goal.reward} XP</div>}
      </div>
    );
  };
  return (
    <div className="card goals-card">
      <div className="card-header">Цели</div>
      <div className="goal-columns">
        <div>
          <div className="goal-label">На сегодня</div>
          <div className="goal-list">{daily.map(renderGoal)}</div>
        </div>
        <div>
          <div className="goal-label">На неделю</div>
          <div className="goal-list">{weekly.map(renderGoal)}</div>
        </div>
      </div>
    </div>
  );
};

const MissionsPage = ({
  user,
  gamification,
  progress,
  missionsState,
  onUpdateMissionState,
  onMissionCompleted,
  trackData,
  communityPosts = [],
  onMissionShare,
}) => {
  const navigate = useNavigate();
  const completedSet = useMemo(() => new Set(progress?.completedMaterialIds || []), [progress?.completedMaterialIds]);
  const steps = trackData?.generatedTrack || [];
  const doneMainSteps = steps.filter((s) => completedSet.has(s.materialId)).length;
  const nextStep = useMemo(() => steps.find((s) => !completedSet.has(s.materialId)), [steps, completedSet]);
  const nextMaterial = nextStep ? getMaterialById(nextStep.materialId) : null;

  const [selectedTab, setSelectedTab] = useState("missions");
  const [selectedMissionId, setSelectedMissionId] = useState(missions[0]?.id);
  const selectedMission = missions.find((m) => m.id === selectedMissionId);
  const selectedMissionProgress = selectedMission ? getMissionProgress(selectedMission, missionsState) : null;
  const selectedMissionNotes = missionsState?.notes?.[selectedMissionId];
  const [shareMission, setShareMission] = useState(null);
  const [shareComment, setShareComment] = useState("");

  const levelInfo = getLevelFromXP(gamification.totalPoints);
  const roleLabel = getRoleFromLevel(levelInfo.level);

  const relatedPosts = useMemo(
    () =>
      (communityPosts || [])
        .filter((post) => post.relatedMissionId === selectedMissionId)
        .slice(0, 3)
        .map((post) => ({ ...post, relativeTime: post.relativeTime || relativeTime(post.createdAt) })),
    [communityPosts, selectedMissionId]
  );

  const missionHighlight = useMemo(() => {
    const preferred = trackData?.recommendedMissionId ? getMissionById(trackData.recommendedMissionId) : null;
    const preferredProgress = preferred ? getMissionProgress(preferred, missionsState) : null;
    if (preferred && preferredProgress?.status !== "completed") return { mission: preferred, progress: preferredProgress };

    const nextAvailable = missions.find((mission) => getMissionProgress(mission, missionsState).status !== "completed");
    return nextAvailable ? { mission: nextAvailable, progress: getMissionProgress(nextAvailable, missionsState) } : null;
  }, [missionsState, trackData]);

  const primaryMaterial = nextMaterial || (trackData?.firstMaterialId ? getMaterialById(trackData.firstMaterialId) : null);
  const missionStatusLabel =
    missionHighlight?.progress?.status === "completed"
      ? "Завершена"
      : missionHighlight?.progress?.status === "in_progress"
      ? "В процессе"
      : "Не начата";

  const handleOpenMaterial = (materialId) => {
    navigate(`/material/${materialId}`);
  };

  const changeMissionState = (nextState) => {
    if (onUpdateMissionState) onUpdateMissionState(nextState);
  };

  const openMissionFromHighlight = (mission) => {
    if (!mission) return;
    setSelectedMissionId(mission.id);
    const status = getMissionProgress(mission, missionsState).status;
    if (status === "not_started") {
      changeMissionState({ type: "status", missionId: mission.id, status: "in_progress" });
    }
  };

  const startMission = () => {
    changeMissionState({ type: "status", missionId: selectedMissionId, status: "in_progress" });
  };

  const toggleStep = (stepId) => changeMissionState({ type: "toggleStep", missionId: selectedMissionId, stepId });

  const completeMission = () => {
    if (!selectedMission) return;
    changeMissionState({ type: "status", missionId: selectedMissionId, status: "completed", reward: selectedMission.xpReward });
    if (onMissionCompleted) onMissionCompleted(selectedMission);
    setShareMission(selectedMission);
    setShareComment("");
  };

  const updateNotes = (text) => changeMissionState({ type: "notes", missionId: selectedMissionId, text });

  const missionsForTab = missions.filter((m) => (selectedTab === "missions" ? m.type === "short" : m.type === "project"));

  const summary = useMemo(() => {
    const statuses = missions.map((mission) => getMissionProgress(mission, missionsState));
    return {
      completed: statuses.filter((s) => s.status === "completed").length,
      active: statuses.filter((s) => s.status === "in_progress").length,
    };
  }, [missionsState]);

  return (
    <div className="page missions-page">
      <div className="page-header">
        <div>
          <p className="meta subtle">Миссии и проекты</p>
          <h1>Центр действий</h1>
          <p className="meta">Собирай XP, закрывай шаги трека и продвигайся по миссиям.</p>
        </div>
        <button className="primary" onClick={() => navigate("/material/" + (nextMaterial?.id || "course-entrepreneur-basic"))}>
          Открыть урок
        </button>
      </div>

      <div className="card focus next-step">
        <div className="card-header">Твой ближайший шаг</div>
        {missionHighlight ? (
          <div className="next-step-body">
            <div>
              <div className="pill filled">Миссия</div>
              <h3>{missionHighlight.mission.title}</h3>
              <p className="meta">{missionHighlight.mission.description}</p>
              <div className="meta subtle">{missionHighlight.mission.estimatedTime} · +{missionHighlight.mission.xpReward} XP</div>
            </div>
            <div className="next-actions">
              <button className="primary large" onClick={() => openMissionFromHighlight(missionHighlight.mission)}>
                {missionHighlight.progress?.status === "in_progress" ? "Продолжить миссию" : "Начать миссию"}
              </button>
              <span className="meta subtle">Статус: {missionStatusLabel}</span>
            </div>
          </div>
        ) : primaryMaterial ? (
          <NextStepCard
            material={primaryMaterial}
            onStart={(m) => handleOpenMaterial(m.id)}
            doneCount={doneMainSteps}
            totalSteps={steps.length}
          />
        ) : (
          <p className="meta">Собери трек через опрос, чтобы получить первый шаг.</p>
        )}
      </div>

      <div className="missions-hero">
        <div className="card hero-card">
          <div className="card-header">Активность</div>
          <div className="hero-grid">
            <div>
              <div className="meta subtle">Уровень</div>
              <div className="big-number">{levelInfo.level}</div>
              <div className="meta">Роль: {roleLabel}</div>
            </div>
            <div>
              <div className="meta subtle">Миссии</div>
              <div className="big-number">{summary.completed}/{missions.length}</div>
              <div className="meta">Активных: {summary.active}</div>
            </div>
            <div>
              <div className="meta subtle">Серия</div>
              <div className="big-number">{gamification.streakCount || 0}</div>
              <div className="meta">дней подряд</div>
            </div>
          </div>
          {nextMaterial && (
            <NextStepCard material={nextMaterial} onStart={(m) => handleOpenMaterial(m.id)} doneCount={doneMainSteps} totalSteps={steps.length} />
          )}
        </div>

        <GoalsCard goals={gamification.goals} />
      </div>

      <div className="card tab-card">
        <div className="tab-row">
          <button className={`tab ${selectedTab === "missions" ? "active" : ""}`} onClick={() => setSelectedTab("missions")}>Миссии</button>
          <button className={`tab ${selectedTab === "projects" ? "active" : ""}`} onClick={() => setSelectedTab("projects")}>Проекты</button>
        </div>
        <div className="missions-grid">
          {missionsForTab.map((mission) => (
            <MissionCard
              key={mission.id}
              mission={mission}
              progress={getMissionProgress(mission, missionsState)}
              onSelect={() => setSelectedMissionId(mission.id)}
            />
          ))}
        </div>
      </div>

      {selectedMission && selectedMissionProgress && (
          <MissionDetail
            mission={selectedMission}
            progress={selectedMissionProgress}
            notes={selectedMissionNotes}
            onToggleStep={toggleStep}
            onStart={startMission}
            onComplete={completeMission}
            onNoteChange={updateNotes}
            onOpenMaterial={handleOpenMaterial}
            relatedPosts={relatedPosts}
            onOpenCommunity={() => navigate("/community")}
          />
        )}
      {shareMission && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="card-header">Миссия выполнена!</div>
            <p className="meta">
              Ты закрыл(а) миссию “{shareMission.title}” и получил(а) +{shareMission.xpReward} XP.
            </p>
            <label className="modal-field">
              <span>Хочешь поделиться результатом с сообществом?</span>
              <textarea
                value={shareComment}
                onChange={(e) => setShareComment(e.target.value.slice(0, 280))}
                placeholder="Короткий комментарий, что получилось или что удивило."
              />
            </label>
            <div className="modal-actions">
              <button
                className="primary"
                onClick={() => {
                  if (onMissionShare) onMissionShare(shareMission, shareComment);
                  setShareMission(null);
                  setShareComment("");
                  navigate("/community");
                }}
              >
                Поделиться в сообществе
              </button>
              <button className="ghost" onClick={() => setShareMission(null)}>
                Пропустить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MissionsPage;
