import React, { useMemo } from "react";
import { Link, useNavigate } from "./routerShim";
import useUserProfile from "./useUserProfile";
import { getLevelFromPoints, getStatusByPoints, progressToNextStatus } from "./gamification";
import { getMaterialById, learningPaths, materials, themeLabels } from "./libraryData";
import { getPathProgress } from "./progress";

const ProgressLine = ({ value }) => (
  <div className="progress-shell">
    <div className="progress-fill" style={{ width: `${Math.min(100, value)}%` }} />
  </div>
);

const StatChip = ({ label, value }) => (
  <div className="stat-chip">
    <div className="stat-value">{value}</div>
    <div className="stat-label">{label}</div>
  </div>
);

const GoalBar = ({ title, description, progress, current, target }) => (
  <div className="goal-item">
    <div className="goal-top">
      <div>
        <div className="goal-title">{title}</div>
        <p className="meta">{description}</p>
      </div>
      <span className="goal-value">{current}/{target}</span>
    </div>
    <ProgressLine value={progress} />
  </div>
);

const ActivityItem = ({ title, createdAt, type }) => {
  const date = new Date(createdAt);
  const formatter = new Intl.DateTimeFormat("ru", { day: "numeric", month: "long" });
  const label = formatter.format(date);
  return (
    <div className="activity-item">
      <div className="activity-dot" />
      <div>
        <div className="activity-title">{title}</div>
        <div className="meta">{label} · {type}</div>
      </div>
    </div>
  );
};

const PathPreviewCard = ({ path, progress, onOpen }) => {
  const theme = themeLabels[path.theme] || { accent: "#7c3aed", title: path.theme };
  const ratio = progress.totalCount ? Math.round((progress.completedCount / progress.totalCount) * 100) : 0;
  const status =
    progress.completedCount === 0
      ? "Не начат"
      : progress.completedCount === progress.totalCount
      ? "Завершён"
      : "В процессе";
  return (
    <div className="mini-path" style={{ borderColor: `${theme.accent}40` }}>
      <div className="mini-path-head">
        <div className="pill" style={{ background: `${theme.accent}20`, color: theme.accent }}>
          {theme.title}
        </div>
        <span className="meta">{status}</span>
      </div>
      <div className="mini-path-title">{path.title}</div>
      <p className="meta">{path.description}</p>
      <ProgressLine value={ratio} />
      <div className="mini-path-footer">
        <span className="meta">{progress.completedCount} / {progress.totalCount} шагов</span>
        <button className="ghost" onClick={onOpen}>{progress.completedCount ? "Продолжить" : "Начать"}</button>
      </div>
    </div>
  );
};

const LeagueSnippet = ({ community, currentUserName }) => {
  const sorted = useMemo(() => [...community].sort((a, b) => b.points - a.points), [community]);
  const top = sorted.slice(0, 5);
  const myIndex = sorted.findIndex((u) => u.name === currentUserName);
  return (
    <div className="card">
      <div className="card-header">Твоя лига</div>
      <p className="meta">Кто сейчас в топе по активности.</p>
      <div className="league-list">
        {top.map((u, idx) => (
          <div key={u.id || u.name} className="league-row">
            <span className="league-place">{idx + 1}</span>
            <div className="avatar small">{u.name[0]}</div>
            <div className="league-meta">
              <div className="league-name">{u.name}</div>
              <div className="meta">{u.points} XP · {u.status}</div>
            </div>
          </div>
        ))}
      </div>
      {myIndex >= 0 && (
        <div className="league-foot">
          <div>
            Ты на {myIndex + 1}-м месте в своей лиге.
          </div>
          <Link to="/community" className="ghost">Открыть рейтинг</Link>
        </div>
      )}
    </div>
  );
};

const NextStepCard = ({ material, onStart, fallback }) => (
  <div className="card next-step">
    <div className="card-header">Твой следующий шаг</div>
    <p className="meta">Мы подобрали действие, которое лучше всего продолжить сегодня.</p>
    {material ? (
      <div className="next-step-body">
        <div>
          <div className="pill outline">Шаг вперёд</div>
          <h3>{material.title}</h3>
          <p className="meta">{material.description || "Материал из твоего трека"}</p>
        </div>
        <button className="primary" onClick={() => onStart(material)}>Перейти к шагу</button>
      </div>
    ) : (
      <div className="next-step-body">
        <div>
          <h3>Собери личный трек</h3>
          <p className="meta">Пройди опрос, чтобы мы подготовили маршрут и рекомендовали шаги.</p>
        </div>
        <button className="primary" onClick={fallback}>Пройти опрос</button>
      </div>
    )}
  </div>
);

const MainTrackCard = ({ steps, completedSet, onOpenMaterial }) => {
  const doneCount = steps.filter((s) => completedSet.has(s.materialId)).length;
  const ratio = steps.length ? Math.round((doneCount / steps.length) * 100) : 0;
  return (
    <div className="card main-track">
      <div className="card-header">Основной трек</div>
      {steps.length ? (
        <>
          <p className="meta">Прогресс: {doneCount} из {steps.length} · {ratio}%</p>
          <div className="track-line">
            {steps.map((step, idx) => {
              const done = completedSet.has(step.materialId);
              const active = !done && idx === doneCount;
              return (
                <button
                  key={step.id}
                  className={`track-node ${done ? "done" : ""} ${active ? "active" : ""}`}
                  onClick={() => onOpenMaterial(step.materialId, step.materialType)}
                >
                  <span className="track-index">{done ? "✓" : idx + 1}</span>
                  <span className="track-title">{step.title}</span>
                </button>
              );
            })}
          </div>
        </>
      ) : (
        <div className="empty">Пока нет трека. Создай его в разделе «Трек».</div>
      )}
    </div>
  );
};

const QuickLinksCard = ({ navigate }) => (
  <div className="card quick-links">
    <div className="card-header">Быстрые переходы</div>
    <p className="meta">Переключайся между разделами без лишних кликов.</p>
    <div className="quick-buttons">
      <button className="ghost" onClick={() => navigate("/")}>Главная</button>
      <button className="ghost" onClick={() => navigate("/library")}>Библиотека</button>
      <button className="ghost" onClick={() => navigate("/community")}>Сообщество</button>
      <button className="ghost" onClick={() => navigate("/track")}>Трек</button>
      <button className="ghost" onClick={() => navigate("/login")}>Настройки</button>
    </div>
  </div>
);

const XPCard = ({ gamification }) => {
  const levelInfo = getLevelFromPoints(gamification.totalPoints);
  const status = getStatusByPoints(gamification.totalPoints);
  const { next, progress } = progressToNextStatus(gamification.totalPoints);
  return (
    <div className="card xp-card">
      <div className="card-header">Уровень и XP</div>
      <div className="xp-level">Уровень {levelInfo.level}</div>
      <p className="meta">Статус: {status}</p>
      <ProgressLine value={levelInfo.progress} />
      <p className="meta">{gamification.totalPoints} XP · до следующего уровня {levelInfo.toNext} XP</p>
      {next && <p className="meta">До статуса «{next}» осталось {100 - progress}%</p>}
      <div className="badges">
        {gamification.achievements.length === 0 && <span className="tag">Наград пока нет</span>}
        {gamification.achievements.map((id) => (
          <span key={id} className="tag">{id}</span>
        ))}
      </div>
    </div>
  );
};

const ProfileDashboard = ({ user, gamification, progress, streak, trackData, activityLog = [], community = [] }) => {
  const navigate = useNavigate();
  const profile = useUserProfile(user, trackData);
  const completedSet = useMemo(() => new Set(progress?.completedMaterialIds || []), [progress?.completedMaterialIds]);

  const mainTrackSteps = trackData?.generatedTrack || [];
  const doneMainSteps = mainTrackSteps.filter((s) => completedSet.has(s.materialId)).length;
  const nextStep = useMemo(() => mainTrackSteps.find((s) => !completedSet.has(s.materialId)), [mainTrackSteps, completedSet]);

  const fallbackMaterial = useMemo(() => {
    const firstPath = learningPaths.find((p) => p.materials.length > 0);
    if (!firstPath) return null;
    const next = firstPath.materials.find((id) => !completedSet.has(id)) || firstPath.materials[0];
    return getMaterialById(next);
  }, [completedSet]);

  const nextMaterial = nextStep ? getMaterialById(nextStep.materialId) : fallbackMaterial;

  const openMaterial = (materialId, materialType) => {
    const material = getMaterialById(materialId) || materials.find((m) => m.id === materialId);
    if (!material) return;
    const type = materialType || material.type;
    navigate(type === "test" ? `/tests/${material.id}` : `/library/${type}/${material.id}`);
  };

  const goals = [
    {
      title: "Закрыть основной трек",
      description: "Заверши все шаги твоего главного маршрута.",
      current: doneMainSteps,
      target: Math.max(mainTrackSteps.length, 4),
    },
    {
      title: "Набрать 500 XP",
      description: "Собери очки за материалы, тесты и челленджи.",
      current: gamification.totalPoints,
      target: 500,
    },
    {
      title: "3 материала этой недели",
      description: "Выбери три любых материала и отметь их завершёнными.",
      current: Math.min(progress?.completedMaterialIds?.length || 0, 3),
      target: 3,
    },
  ];

  const enrichedGoals = goals.map((goal) => ({
    ...goal,
    progress: Math.min(100, Math.round(((goal.current || 0) / goal.target) * 100)),
  }));

  if (!user) {
    return (
      <div className="page">
        <div className="card">
          <div className="card-header">Профиль доступен после входа</div>
          <p className="meta">Авторизуйся, чтобы увидеть свой прогресс, XP и достижения.</p>
          <Link to="/login" className="primary">Перейти к авторизации</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page profile-dashboard">
      <div className="card profile-hero">
        <div className="hero-left">
          <div className="avatar huge">{profile.avatar}</div>
          <div>
            <div className="hero-name">{profile.name}</div>
            <div className="meta">{profile.role}</div>
            <div className="meta">Серия {streak?.count || 0} дней</div>
          </div>
        </div>
        <div className="hero-right">
          <StatChip label="Материалы" value={progress?.completedMaterialIds?.length || 0} />
          <StatChip label="Достижения" value={gamification.achievements.length} />
          <StatChip label="XP" value={gamification.totalPoints} />
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-main">
          <NextStepCard
            material={nextMaterial}
            onStart={(m) => openMaterial(m.id, m.type)}
            fallback={() => navigate("/track")}
          />
          <MainTrackCard steps={mainTrackSteps} completedSet={completedSet} onOpenMaterial={openMaterial} />
          <div className="card">
            <div className="card-header">Твои треки</div>
            <p className="meta">Смотри прогресс по направлениям и продолжай там, где остановился.</p>
            <div className="path-grid compact">
              {learningPaths.slice(0, 4).map((path) => (
                <PathPreviewCard
                  key={path.id}
                  path={path}
                  progress={getPathProgress(path, progress?.completedMaterialIds)}
                  onOpen={() => navigate(`/library/paths/${path.slug}`)}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="dashboard-side">
          <QuickLinksCard navigate={navigate} />
          <XPCard gamification={gamification} />
          <div className="card">
            <div className="card-header">Цели</div>
            <div className="goal-list">
              {enrichedGoals.map((goal) => (
                <GoalBar
                  key={goal.title}
                  title={goal.title}
                  description={goal.description}
                  current={goal.current}
                  target={goal.target}
                  progress={goal.progress}
                />
              ))}
            </div>
          </div>
          <div className="card">
            <div className="card-header">Активность</div>
            {activityLog.length === 0 && <p className="meta">Пока нет событий — открой материалы или тесты.</p>}
            <div className="activity-list">
              {activityLog.slice(0, 8).map((item) => (
                <ActivityItem key={item.id} title={item.title} createdAt={item.createdAt} type={item.type || "действие"} />
              ))}
            </div>
          </div>
          <LeagueSnippet community={community} currentUserName={profile.name} />
        </div>
      </div>
    </div>
  );
};

export default ProfileDashboard;
