import React, { useEffect } from "react";
import { useNavigate } from "./routerShim";
import { getMaterialById, learningPaths, themeLabels, materials } from "./libraryData";
import { getPathProgress } from "./progress";
import { getRecentEvents, countTodayByType } from "./activity";
import { getStatusByPoints } from "./gamification";

const getLevelFromXP = (xp = 0) => Math.floor(xp / 200) + 1;
const levelProgress = (xp = 0) => {
  const level = getLevelFromXP(xp);
  const currentLevelStart = (level - 1) * 200;
  const nextLevelStart = level * 200;
  const gained = xp - currentLevelStart;
  const span = nextLevelStart - currentLevelStart;
  return Math.min(100, Math.round((gained / span) * 100));
};
const xpToNextLevel = (xp = 0) => {
  const remainder = xp % 200;
  return remainder === 0 ? 200 : 200 - remainder;
};

const UserHeroCard = ({ user, gamification, activity, progress, trackData }) => {
  const level = getLevelFromXP(gamification.totalPoints);
  const progressPct = levelProgress(gamification.totalPoints);
  const completed = progress.completedMaterialIds?.length || 0;
  const achievementsCount = gamification.achievements?.length || 0;
  const role = trackData?.profileType || "Без профиля";

  return (
    <div className="card user-hero">
      <div className="hero-avatar">
        <div className="avatar-lg">{user?.name?.[0] || "?"}</div>
        <div className="hero-role">{role}</div>
      </div>
      <div className="hero-info">
        <div className="hero-top">
          <div>
            <div className="hero-name">{user?.name || "Гость"}</div>
            <div className="hero-status">Уровень {level} • {getStatusByPoints(gamification.totalPoints)}</div>
          </div>
          <div className="hero-streak">
            <span className="flame">🔥</span>
            <div>
              <div className="small-label">Серия</div>
              <div className="streak-number">{activity?.streak || 0} дней</div>
            </div>
          </div>
        </div>
        <div className="progress-shell large">
          <div className="progress-fill" style={{ width: `${progressPct}%` }} />
        </div>
        <div className="progress-label">{gamification.totalPoints} XP · {xpToNextLevel(gamification.totalPoints)} XP до следующего уровня</div>
        <div className="hero-stats">
          <div>
            <div className="small-label">Материалы</div>
            <div className="stat-number">{completed}</div>
          </div>
          <div>
            <div className="small-label">Достижения</div>
            <div className="stat-number">{achievementsCount}</div>
          </div>
          <div>
            <div className="small-label">Серия</div>
            <div className="stat-number">{activity?.streak || 0}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const NextStepCard = ({ trackData, completedMaterialIds = [], navigate }) => {
  const completedSet = new Set(completedMaterialIds);
  let title = "Пройти стартовый опрос";
  let description = "Собери личный трек развития и получи первый набор шагов.";
  let action = () => navigate("/track");
  let cta = "Собрать трек";

  if (trackData?.generatedTrack?.length) {
    const nextStep = trackData.generatedTrack.find(
      (step) => !completedSet.has(step.materialId) && !(trackData.completedStepIds || []).includes(step.id)
    );
    if (nextStep) {
      const material = getMaterialById(nextStep.materialId);
      title = `Шаг ${nextStep.order}: ${material?.title || nextStep.title}`;
      description = material?.description || "Продолжай движение по своему маршруту.";
      cta = "Перейти к шагу";
      action = () => navigate(material?.type === "test" ? `/tests/${material.id}` : `/library/${material?.type}/${material?.id}`);
    } else {
      title = "Трек пройден!";
      description = "Отличная работа. Выбери новую тему или повтори понравившиеся материалы.";
      cta = "Открыть библиотеку";
      action = () => navigate("/library");
    }
  }

  return (
    <div className="card next-step-card">
      <div>
        <div className="card-header">Твой следующий шаг</div>
        <p className="meta">Мы подобрали действие, которое лучше всего продолжить сегодня.</p>
        <div className="next-main">{title}</div>
        <p className="meta">{description}</p>
      </div>
      <button className="primary" onClick={action}>{cta}</button>
    </div>
  );
};

const MainTrackWidget = ({ trackData, completedMaterialIds = [], navigate }) => {
  if (!trackData?.generatedTrack?.length) return (
    <div className="card">
      <div className="card-header">Основной трек</div>
      <p className="meta">Ты ещё не собрал личный маршрут. Ответь на вопросы, чтобы получить свой трек.</p>
      <button className="primary outline" onClick={() => navigate("/track")}>Собрать трек</button>
    </div>
  );

  const completedSet = new Set(completedMaterialIds);
  const total = trackData.generatedTrack.length;
  const done = trackData.generatedTrack.filter(
    (step) => completedSet.has(step.materialId) || (trackData.completedStepIds || []).includes(step.id)
  ).length;
  const ratio = Math.round((done / total) * 100);

  return (
    <div className="card track-widget">
      <div className="card-header">Основной трек</div>
      <div className="meta">Прогресс: {done} из {total} • {ratio}%</div>
      <div className="track-line">
        {trackData.generatedTrack.map((step) => {
          const material = getMaterialById(step.materialId);
          const doneStep = completedSet.has(step.materialId) || (trackData.completedStepIds || []).includes(step.id);
          return (
            <div key={step.id} className={`track-node ${doneStep ? "done" : ""}`} onClick={() => navigate(material?.type === "test" ? `/tests/${material.id}` : `/library/${material?.type}/${material?.id}`)}>
              <div className="node-circle">{doneStep ? "✓" : step.order}</div>
              <div className="node-label">{material?.title || step.title}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const PathMiniCard = ({ path, progress, onOpen }) => {
  const ratio = progress.totalCount ? Math.round((progress.completedCount / progress.totalCount) * 100) : 0;
  const status = progress.completedCount === 0 ? "Не начат" : progress.completedCount === progress.totalCount ? "Завершён" : "В процессе";
  const theme = themeLabels[path.theme] || { accent: "#6b21a8", title: "Тема" };
  return (
    <div className="mini-path" onClick={onOpen}>
      <div className="path-top">
        <span className="path-theme" style={{ background: `${theme.accent}20`, color: theme.accent }}>{theme.title}</span>
        <span className="path-progress">{progress.completedCount} / {progress.totalCount}</span>
      </div>
      <div className="path-title">{path.title}</div>
      <p className="meta">{path.description}</p>
      <div className="progress-shell small">
        <div className="progress-fill" style={{ width: `${ratio}%` }} />
      </div>
      <button className="ghost">{status === "Не начат" ? "Начать" : status === "Завершён" ? "Повторить" : "Продолжить"}</button>
    </div>
  );
};

const PathsWidget = ({ completedMaterialIds = [], navigate }) => {
  return (
    <div className="card">
      <div className="card-header">Твои дорожки</div>
      <div className="path-grid compact">
        {learningPaths.map((path) => (
          <PathMiniCard
            key={path.id}
            path={path}
            progress={getPathProgress(path, completedMaterialIds)}
            onOpen={() => navigate(`/library/paths/${path.slug}`)}
          />
        ))}
      </div>
    </div>
  );
};

const GamificationWidget = ({ gamification }) => {
  const level = getLevelFromXP(gamification.totalPoints);
  const progressPct = levelProgress(gamification.totalPoints);
  return (
    <div className="card">
      <div className="card-header">Уровень и XP</div>
      <div className="big-number">Уровень {level}</div>
      <div className="progress-shell large">
        <div className="progress-fill" style={{ width: `${progressPct}%` }} />
      </div>
      <p className="meta">{gamification.totalPoints} XP • до следующего уровня {xpToNextLevel(gamification.totalPoints)} XP</p>
      <div className="badges">
        {gamification.achievements.length === 0 && <span className="tag">Пока без наград</span>}
        {gamification.achievements.map((a) => (
          <span key={a} className="tag">{a}</span>
        ))}
      </div>
    </div>
  );
};

const buildQuests = ({ activity, gamification }) => {
  return [
    {
      id: "material-today",
      title: "Закрой 1 материал сегодня",
      reward: "+50 XP",
      completed: countTodayByType(activity, "material") > 0,
    },
    {
      id: "test-today",
      title: "Пройди один тест",
      reward: "+80 XP",
      completed: countTodayByType(activity, "test") > 0,
    },
    {
      id: "streak",
      title: "Держи серию 3 дня",
      reward: "+100 XP",
      completed: (activity?.streak || 0) >= 3,
    },
    {
      id: "xp-200",
      title: "Собери 200 XP",
      reward: "+достижение",
      completed: (gamification?.totalPoints || 0) >= 200,
    },
  ];
};

const QuestsWidget = ({ activity, gamification }) => {
  const quests = buildQuests({ activity, gamification });
  return (
    <div className="card">
      <div className="card-header">Задания дня</div>
      <p className="meta">Выполняй квесты, чтобы получать очки и держать серию.</p>
      <div className="quest-list">
        {quests.map((q) => (
          <div key={q.id} className={`quest ${q.completed ? "done" : ""}`}>
            <div>
              <div className="quest-title">{q.title}</div>
              <div className="meta">Награда: {q.reward}</div>
            </div>
            <div className="quest-status">{q.completed ? "Готово" : "В процессе"}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const CommunityWidget = ({ community }) => {
  const sorted = [...community].sort((a, b) => b.points - a.points);
  const meIndex = sorted.findIndex((p) => p.id === "me");
  const league = meIndex >= 0 && meIndex < 5 ? "Лига создателей" : "Лига новичков";
  return (
    <div className="card">
      <div className="card-header">Твоя лига</div>
      <p className="meta">{league} • ты на {meIndex >= 0 ? meIndex + 1 : "—"}-м месте</p>
      <div className="leaderboard">
        {sorted.slice(0, 5).map((p, idx) => (
          <div key={p.id} className={`leader-row ${p.id === "me" ? "me" : ""}`}>
            <div className="rank">#{idx + 1}</div>
            <div className="leader-info">
              <div className="leader-name">{p.name}</div>
              <div className="meta">{p.status}</div>
            </div>
            <div className="leader-points">{p.points} XP</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const GoalsWidget = ({ trackData, completedMaterialIds = [], gamification }) => {
  const completedSet = new Set(completedMaterialIds);
  const trackTotal = trackData?.generatedTrack?.length || 0;
  const trackDone = trackData?.generatedTrack?.filter((s) => completedSet.has(s.materialId)).length || 0;
  const level = getLevelFromXP(gamification.totalPoints);
  const financeCompleted = completedMaterialIds.filter((id) => materials.find((m) => m.id === id && m.theme === "finance")).length;

  const goals = [
    {
      id: "track",
      title: "Закрыть основной трек",
      description: "Пройди все шаги, которые мы подобрали по твоему профилю.",
      current: trackDone,
      target: trackTotal || 8,
      unit: "шагов",
    },
    {
      id: "level",
      title: "Дойти до уровня 5",
      description: "Копи очки, выполняя материалы и тесты.",
      current: level,
      target: 5,
      unit: "уровень",
    },
    {
      id: "finance",
      title: "5 материалов по финансам",
      description: "Прокачай финансовое мышление и уверенность в деньгах.",
      current: financeCompleted,
      target: 5,
      unit: "материалов",
    },
  ];

  return (
    <div className="card">
      <div className="card-header">Цели и прогресс</div>
      <div className="goal-list">
        {goals.map((g) => {
          const ratio = Math.min(100, Math.round((g.current / g.target) * 100));
          return (
            <div key={g.id} className="goal-item">
              <div className="goal-top">
                <div>
                  <div className="goal-title">{g.title}</div>
                  <div className="meta">{g.description}</div>
                </div>
                <div className="goal-count">{g.current} / {g.target} {g.unit}</div>
              </div>
              <div className="progress-shell small">
                <div className="progress-fill" style={{ width: `${ratio}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ActivityFeed = ({ activity }) => {
  const events = getRecentEvents(activity, 6);
  const formatTime = (ts) => {
    const date = new Date(ts);
    const today = new Date();
    const diff = today.getDate() === date.getDate() && today.getMonth() === date.getMonth() && today.getFullYear() === date.getFullYear();
    if (diff) return "Сегодня";
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const isYesterday =
      yesterday.getDate() === date.getDate() &&
      yesterday.getMonth() === date.getMonth() &&
      yesterday.getFullYear() === date.getFullYear();
    if (isYesterday) return "Вчера";
    return date.toLocaleDateString();
  };

  if (!events.length) {
    return (
      <div className="card">
        <div className="card-header">Активность</div>
        <p className="meta">Скоро здесь появятся твои действия.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">Активность</div>
      <div className="activity-feed">
        {events.map((ev, idx) => (
          <div key={idx} className="activity-item">
            <div className="activity-icon">{ev.type === "test" ? "🧠" : ev.type === "material" ? "📚" : "✨"}</div>
            <div className="activity-body">
              <div className="activity-title">{ev.text}</div>
              <div className="meta">{formatTime(ev.timestamp)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Dashboard = ({ user, trackData, progress, gamification, community, activity, onVisit }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (user && onVisit) {
      onVisit({ type: "visit", text: "Зашёл на дашборд" });
    }
  }, [user]);

  const completedMaterialIds = progress.completedMaterialIds || [];

  return (
    <div className="page dashboard">
      <UserHeroCard user={user} gamification={gamification} activity={activity} progress={progress} trackData={trackData} />
      <div className="dashboard-grid">
        <div className="dashboard-main">
          <NextStepCard trackData={trackData} completedMaterialIds={completedMaterialIds} navigate={navigate} />
          <MainTrackWidget trackData={trackData} completedMaterialIds={completedMaterialIds} navigate={navigate} />
          <PathsWidget completedMaterialIds={completedMaterialIds} navigate={navigate} />
          <GoalsWidget trackData={trackData} completedMaterialIds={completedMaterialIds} gamification={gamification} />
          <ActivityFeed activity={activity} />
        </div>
        <div className="dashboard-side">
          <GamificationWidget gamification={gamification} />
          <QuestsWidget activity={activity} gamification={gamification} />
          <CommunityWidget community={community} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
