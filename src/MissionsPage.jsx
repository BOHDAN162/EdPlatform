import React, { useMemo, useState } from "react";
import { useNavigate } from "./routerShim";
import TrackRoadmap from "./components/TrackRoadmap";
import {
  badgePalette,
  durationFilters,
  missionCategories,
  missions as missionList,
  periodLabels,
  difficultyFilters,
  typeFilters,
} from "./data/missions";
import { getLevelFromXP, getRoleFromLevel } from "./gamification";
import GroupChallengeCard from "./components/activity/GroupChallengeCard";
import { avatarRewards, medalRewards, skinRewards, statusRewards } from "./community/rewardsData";

const ProgressBar = ({ value }) => (
  <div className="mission-progress-line">
    <div className="mission-progress-fill" style={{ width: `${Math.min(100, value)}%` }} />
  </div>
);

const hasDayActivity = (day) => {
  if (!day) return false;
  return (
    (day.completedMaterialsCount || 0) +
      (day.missionsCompletedCount || 0) +
      (day.memoryEntriesCount || 0) +
      (day.communityActionsCount || 0) +
      (day.sessionsCount || 0) +
      (day.totalXP || 0) >
    0
  );
};

const CalendarMissionCard = ({ title, description, current = 0, target = 0 }) => {
  const percent = target ? Math.min(100, Math.round((current / target) * 100)) : 0;
  return (
    <div className="mission-card-v2 calendar-mini-card">
      <div className="mission-card-title-row">
        <h3>{title}</h3>
        <span className="status-pill">{current}/{target}</span>
      </div>
      <p className="mission-card-desc">{description}</p>
      <ProgressBar value={percent} />
      <div className="mission-card-meta">Прогресс: {percent}%</div>
    </div>
  );
};

const Badge = ({ label, color, outline = false }) => (
  <span
    className={`mission-badge ${outline ? "outline" : ""}`}
    style={{ backgroundColor: outline ? "transparent" : `${color}1a`, color: color }}
  >
    {label}
  </span>
);

const MissionCard = ({ mission, progress, onSelect, onPrimary }) => {
  const category = missionCategories[mission.category] || missionCategories["геймификация"];
  const badge = badgePalette[progress?.badgeTier || 0] || badgePalette[0];
  const ratio = mission.targetValue ? Math.min(100, Math.round(((progress?.currentValue || 0) / mission.targetValue) * 100)) : 0;
  const statusLabel =
    progress?.status === "completed" ? "Завершено" : progress?.status === "inProgress" ? "В процессе" : "Новое";

  const progressLabel = mission.targetType === "streak"
    ? `Серия: ${progress?.streakCount || 0}/${mission.targetValue}`
    : mission.targetType === "boolean"
    ? progress?.status === "completed" ? "Выполнено" : "Не выполнено"
    : `${progress?.currentValue || 0} / ${mission.targetValue}`;

  return (
    <div className="mission-card-v2" onClick={onSelect} data-mission-id={mission.id}>
      <div className="mission-card-top">
        <Badge label={category.label} color={category.color} />
        <div className="mission-card-badges">
          <Badge label={periodLabels[mission.period] || mission.period} color={category.color} outline />
          <Badge label={mission.difficulty} color="#475569" outline />
        </div>
      </div>
      <div className="mission-card-title-row">
        <h3>{mission.title}</h3>
        <span className="status-pill">{statusLabel}</span>
      </div>
      <p className="mission-card-desc">{mission.description}</p>
      <div className="mission-card-progress">
        <ProgressBar value={progress?.status === "completed" ? 100 : ratio} />
        <div className="mission-card-meta">
          <span>{progressLabel}</span>
          <span className="reward">+{mission.xpRewardBase} XP</span>
        </div>
      </div>
      <div className="mission-card-footer">
        <div className="badge-tier" style={{ color: badge.color }}>
          {badge.label} бейдж
        </div>
        <button
          type="button"
          className={`primary ghost ${progress?.status === "completed" ? "disabled" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            onPrimary();
          }}
        >
          {progress?.status === "completed" ? "Завершено" : progress?.status === "inProgress" ? "Продолжить" : "Начать"}
        </button>
      </div>
    </div>
  );
};

const MissionDetail = ({ mission, progress, onNavigate, onStart, onComplete }) => {
  const category = missionCategories[mission.category] || missionCategories["геймификация"];
  const badge = badgePalette[progress?.badgeTier || 0] || badgePalette[0];

  const progressLabel = mission.targetType === "streak"
    ? `Серия: ${progress?.streakCount || 0}/${mission.targetValue}`
    : mission.targetType === "boolean"
    ? progress?.status === "completed" ? "Выполнено" : "Не выполнено"
    : `${progress?.currentValue || 0} / ${mission.targetValue}`;

  const progressValue = mission.targetValue
    ? Math.min(100, ((progress?.currentValue || 0) / mission.targetValue) * 100)
    : progress?.status === "completed"
    ? 100
    : 0;

  return (
    <div className="mission-detail-card">
      <div className="mission-detail-header">
        <div>
          <Badge label={category.label} color={category.color} />
          <h2>{mission.title}</h2>
          <p className="mission-card-desc">{mission.description}</p>
          <div className="mission-chip-row">
            <Badge label={periodLabels[mission.period] || mission.period} color={category.color} outline />
            <Badge label={mission.difficulty} color="#475569" outline />
            <Badge label={`+${mission.xpRewardBase} XP`} color="#14b8a6" outline />
          </div>
        </div>
        <div className="mission-detail-actions">
          <button className="ghost" onClick={onStart}>
            {progress?.status === "inProgress" ? "Продолжить" : "Начать"}
          </button>
          <button className="primary" disabled={progress?.status === "completed"} onClick={onComplete}>
            {progress?.status === "completed" ? "Завершено" : "Отметить выполнение"}
          </button>
        </div>
      </div>
      <div className="mission-detail-stats">
        <div className="stat-block">
          <div className="stat-label">Прогресс</div>
          <div className="stat-value">{progressLabel}</div>
          <ProgressBar value={progress?.status === "completed" ? 100 : progressValue} />
        </div>
        <div className="stat-block">
          <div className="stat-label">Бейдж</div>
          <div className="stat-value" style={{ color: badge.color }}>
            {badge.label}
          </div>
          <p className="meta">Повышай прогресс, чтобы улучшать уровень бейджа.</p>
        </div>
      </div>
      <div className="mission-detail-footer">
        <div>
          <div className="stat-label">Куда идти</div>
          <p className="meta">{mission.category === "библиотека" ? "Открой материалы или MindGames в библиотеке." : mission.category === "память" ? "Создавай заметки и карточки в разделе Память." : mission.category === "сообщество" ? "Отвечай и помогай ребятам в сообществе." : mission.category === "трек" ? "Проходи шаги своего трека развития." : "Закрывай ежедневные задания и удерживай серию."}</p>
        </div>
        <button className="ghost" onClick={onNavigate}>Перейти в раздел</button>
      </div>
    </div>
  );
};

const MissionOverview = ({ gamification, streakCount, completedWeek }) => {
  const levelInfo = getLevelFromXP(gamification.totalPoints || 0);
  const roleLabel = getRoleFromLevel(levelInfo.level);

  return (
    <div className="mission-overview">
      <div>
        <p className="meta subtle">Задания</p>
        <h1>Задания и квесты</h1>
        <p className="meta">
          Задания и квесты, которые прокачивают твой уровень, привычки и статус в комьюнити.
        </p>
      </div>
      <div className="overview-grid">
        <div className="overview-card">
          <div className="label">Уровень</div>
          <div className="value">Уровень {levelInfo.level} — {roleLabel}</div>
          <ProgressBar value={levelInfo.progress} />
          <div className="meta subtle">{gamification.totalPoints} XP · {levelInfo.toNext} XP до следующего уровня</div>
        </div>
        <div className="overview-card">
          <div className="label">Серия</div>
          <div className="value">{streakCount} дней подряд</div>
          <p className="meta subtle">Поддерживай темп, чтобы не потерять streak.</p>
        </div>
        <div className="overview-card">
          <div className="label">Выполнено за неделю</div>
          <div className="value">{completedWeek}</div>
          <p className="meta subtle">Заданий закрыто за последние 7 дней.</p>
        </div>
      </div>
    </div>
  );
};

const statusLabel = (progress) =>
  progress?.status === "completed" ? "Готово" : progress?.status === "inProgress" ? "В процессе" : "Не начато";

const statusAccent = (progress) =>
  progress?.status === "completed"
    ? "success"
    : progress?.status === "inProgress"
    ? "active"
    : "muted";

const InlineMissionCard = ({ mission, progress, onPrimary, onNavigate }) => {
  const category = missionCategories[mission.category] || missionCategories["геймификация"];
  const ratio = mission.targetValue
    ? Math.min(100, Math.round(((progress?.currentValue || 0) / mission.targetValue) * 100))
    : progress?.status === "completed"
    ? 100
    : 0;
  const progressLabel = mission.targetType === "streak"
    ? `Серия ${progress?.streakCount || 0}/${mission.targetValue}`
    : mission.targetType === "boolean"
    ? progress?.status === "completed" ? "Выполнено" : "Не выполнено"
    : `${progress?.currentValue || 0} / ${mission.targetValue}`;

  return (
    <div className="inline-mission-card">
      <div className="inline-mission-head">
        <div className="inline-left">
          <div className="pill-row">
            <Badge label={category.label} color={category.color} />
            <Badge label={mission.difficulty} color="#475569" outline />
            <Badge label={periodLabels[mission.period] || mission.period} color={category.color} outline />
          </div>
          <h3>{mission.title}</h3>
          <p className="meta">{mission.description}</p>
          <div className="inline-progress">
            <ProgressBar value={progress?.status === "completed" ? 100 : ratio} />
            <div className="inline-progress-meta">
              <span>{progressLabel}</span>
              <span className="reward">+{mission.xpRewardBase} XP</span>
            </div>
          </div>
        </div>
        <div className="inline-actions">
          <span className={`status-dot ${statusAccent(progress)}`}>{statusLabel(progress)}</span>
          <div className="action-stack">
            <button className="ghost" onClick={onNavigate}>Перейти</button>
            <button
              className={`primary ${progress?.status === "completed" ? "disabled" : ""}`}
              onClick={onPrimary}
            >
              {progress?.status === "completed" ? "Завершено" : "Выполнено"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AchievementLegend = () => (
  <div className="achievement-legend">
    <div>
      <p className="meta subtle">Как это работает</p>
      <h3>XP, уровни, streak и ачивки</h3>
      <p className="meta">
        За каждое задание ты получаешь XP и продвигаешься по уровням. Серии усиливают награды, а бейджи растут от серого до
        изумруда.
      </p>
    </div>
    <div className="badge-row">
      {badgePalette.map((badge) => (
        <div key={badge.key} className="legend-pill" style={{ color: badge.color }}>
          <span className="legend-dot" style={{ background: `${badge.color}33`, borderColor: `${badge.color}88` }} />
          {badge.label}
        </div>
      ))}
    </div>
  </div>
);

const rewardTabs = [
  { id: "avatars", label: "Аватары", data: avatarRewards },
  { id: "skins", label: "Оформление", data: skinRewards },
  { id: "statuses", label: "Статусы", data: statusRewards },
  { id: "medals", label: "Медали", data: medalRewards },
];

const MissionsPage = ({
  gamification,
  missions = missionList,
  getMissionProgress,
  setMissionStatus,
  updateProgressByKey,
  completedThisWeek = 0,
  activityByDate = {},
  streakInfo,
  getActivityForMonth,
  trackData,
  onStartTrack,
  onEditTrack,
}) => {
  const navigate = useNavigate();
  const [duration, setDuration] = useState("all");
  const [difficulty, setDifficulty] = useState("all");
  const [category, setCategory] = useState("all");
  const [rewardTab, setRewardTab] = useState("avatars");
  const [selectedId, setSelectedId] = useState(missions[0]?.id);

  const selectedMission = missions.find((m) => m.id === selectedId) || missions[0];
  const selectedProgress = selectedMission ? getMissionProgress?.(selectedMission.id) || { status: "new", currentValue: 0 } : null;

  const filteredMissions = useMemo(
    () =>
      missions.filter((mission) => {
        const matchesDuration =
          duration === "all" ||
          (duration === "today" && (mission.period === "ежедневная" || mission.period === "ежечасная")) ||
          (duration === "3days" && mission.period === "3-дневная") ||
          (duration === "week" && mission.period === "недельная") ||
          (duration === "month" && mission.period === "месячная");
        const matchesDifficulty = difficulty === "all" || mission.difficulty === difficulty;
        const matchesCategory = category === "all" || mission.category === category;
        return matchesDuration && matchesDifficulty && matchesCategory;
      }),
    [duration, difficulty, category, missions]
  );

  const dailyMissions = missions.filter((mission) => mission.period === "ежедневная").slice(0, 5);
  const weeklyMissions = missions.filter((mission) => mission.period === "недельная").slice(0, 6);
  const longQuests = missions.filter((mission) => mission.period === "месячная");

  const todayCompleted = dailyMissions.filter((mission) => (getMissionProgress?.(mission.id)?.status || "new") === "completed").length;
  const weekCompleted = weeklyMissions.filter(
    (mission) => (getMissionProgress?.(mission.id)?.status || "new") === "completed"
  ).length;

  const handleNavigate = (mission) => {
    if (mission.link) {
      navigate(mission.link);
    }
  };

  const handleStartTrack = () => {
    onStartTrack?.();
    navigate("/track-quiz");
  };

  const handleEditTrack = () => {
    onEditTrack?.();
    navigate("/track-quiz");
  };

  const handleStart = (missionId) => {
    if (setMissionStatus) setMissionStatus(missionId, "inProgress");
  };

  const handleComplete = (missionId) => {
    if (setMissionStatus) setMissionStatus(missionId, "completed");
    updateProgressByKey?.("missions_completed_day", 1);
    updateProgressByKey?.("missions_completed_week", 1);
  };

  const monthRef = useMemo(() => new Date(), []);
  const monthActivity = useMemo(
    () => (getActivityForMonth ? getActivityForMonth(monthRef.getFullYear(), monthRef.getMonth() + 1) : activityByDate),
    [activityByDate, getActivityForMonth, monthRef]
  );

  const activeDays = useMemo(() => Object.values(monthActivity || {}).filter((day) => hasDayActivity(day)).length, [monthActivity]);

  const lastSixtyDaysActive = useMemo(() => {
    const now = new Date();
    const msDay = 1000 * 60 * 60 * 24;
    return Object.entries(activityByDate || {}).filter(([dateKey, day]) => {
      const diff = (now - new Date(dateKey)) / msDay;
      return diff >= 0 && diff <= 60 && hasDayActivity(day);
    }).length;
  }, [activityByDate]);

  const groupChallenges = useMemo(
    () => [
      {
        id: "volgograd",
        title: "Клуб Волгоград",
        description: "10 000 XP за неделю на всех участниках",
        deadline: "до пятницы",
        progress: 6200,
        target: 10000,
        teamName: "Команда региона",
        accent: "#7c3aed",
      },
      {
        id: "finance-sprint",
        title: "Финансовый спринт",
        description: "5 материалов по финансам за 7 дней",
        deadline: "осталось 3 дня",
        progress: 3,
        target: 5,
        teamName: "Сквад Финансы",
        accent: "#22c55e",
      },
    ],
    []
  );

  const renderRewards = rewardTabs.find((tab) => tab.id === rewardTab)?.data || [];

  return (
    <div className="page missions-page-v3">
      <div className="missions-hero-v3">
        <div>
          <p className="meta subtle">Задания</p>
          <h1>Задания</h1>
          <p className="meta">
            Ежедневные, недельные и большие квесты, которые прокачивают твой уровень, XP и streak
          </p>
        </div>
      </div>

      <TrackRoadmap track={trackData} onStart={handleStartTrack} onEdit={handleEditTrack} />

      <MissionOverview
        gamification={gamification}
        streakCount={streakInfo?.current || gamification.streakCount || 0}
        completedWeek={completedThisWeek}
      />

      <section className="mission-section">
        <div className="section-head">
          <div>
            <h2>Задания по дням</h2>
            <p className="meta">Удерживай активные дни и серии — данные из ActivityLog.</p>
          </div>
        </div>
        <div className="mission-grid quest-grid">
          <CalendarMissionCard
            title="15 активных дней в месяц"
            description="Календарь месяца в духе Apple Fitness"
            current={activeDays}
            target={15}
          />
          <CalendarMissionCard
            title="7 активных дней подряд"
            description="Серия без пропусков"
            current={streakInfo?.current || 0}
            target={7}
          />
          <CalendarMissionCard
            title="30 активных дней за 2 месяца"
            description="Длинный вызов — минимум день через день"
            current={lastSixtyDaysActive}
            target={30}
          />
        </div>
      </section>

      <section className="mission-section">
        <div className="section-head">
          <div>
            <h2>Сегодня</h2>
            <p className="meta">Закрой 3–5 быстрых действий, чтобы удержать серию.</p>
          </div>
          <div className="section-progress">
            <span>Сегодня выполнено {todayCompleted} из {dailyMissions.length}</span>
            <ProgressBar value={dailyMissions.length ? (todayCompleted / dailyMissions.length) * 100 : 0} />
          </div>
        </div>
        <div className="mission-rail">
          {dailyMissions.map((mission) => (
            <InlineMissionCard
              key={mission.id}
              mission={mission}
              progress={getMissionProgress?.(mission.id) || { status: "new", currentValue: 0 }}
              onNavigate={() => handleNavigate(mission)}
              onPrimary={() => handleComplete(mission.id)}
            />
          ))}
        </div>
      </section>

      <section className="mission-section">
        <div className="section-head">
          <div>
            <h2>На этой неделе</h2>
            <p className="meta">Средние задания, чтобы закрепить навыки и собрать XP.</p>
          </div>
          <div className="section-progress">
            <span>Закрыто {weekCompleted} из {weeklyMissions.length}</span>
            <ProgressBar value={weeklyMissions.length ? (weekCompleted / weeklyMissions.length) * 100 : 0} />
          </div>
        </div>
        <div className="mission-rail">
          {weeklyMissions.map((mission) => (
            <InlineMissionCard
              key={mission.id}
              mission={mission}
              progress={getMissionProgress?.(mission.id) || { status: "new", currentValue: 0 }}
              onNavigate={() => handleNavigate(mission)}
              onPrimary={() => handleComplete(mission.id)}
            />
          ))}
        </div>
      </section>

      <section className="mission-section">
        <div className="section-head">
          <div>
            <h2>Долгие квесты</h2>
            <p className="meta">30-дневные цели и большие шаги, которые двигают весь трек.</p>
          </div>
        </div>
        <div className="mission-grid quest-grid">
          {longQuests.map((mission) => (
            <MissionCard
              key={mission.id}
              mission={mission}
              progress={getMissionProgress?.(mission.id) || { status: "new", currentValue: 0 }}
              onSelect={() => setSelectedId(mission.id)}
              onPrimary={() => {
                handleStart(mission.id);
                handleNavigate(mission);
              }}
            />
          ))}
        </div>
      </section>

      <section className="mission-section">
        <div className="section-head">
          <div>
            <h2>Групповые челленджи</h2>
            <p className="meta">Общий прогресс по клубам и сквадам — как в Nike Run Club.</p>
          </div>
        </div>
        <div className="mission-grid quest-grid">
          {groupChallenges.map((challenge) => (
            <GroupChallengeCard key={challenge.id} {...challenge} />
          ))}
        </div>
      </section>

      <section className="mission-section">
        <div className="section-head">
          <div>
            <h2>Награды</h2>
            <p className="meta">Зарабатывай аватары, статусы и медали за активность.</p>
          </div>
          <div className="chip-row">
            {rewardTabs.map((tab) => (
              <button
                key={tab.id}
                className={`pill ${rewardTab === tab.id ? "active" : "outline"}`}
                onClick={() => setRewardTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        <div className="rewards-grid">
          {renderRewards.map((reward) => (
            <div key={reward.id} className={`reward-card ${reward.unlocked ? "" : "locked"}`} title={reward.requirement}>
              <div className="reward-icon">{reward.icon}</div>
              <div className="reward-title">{reward.title}</div>
              <p className="meta">{reward.description}</p>
              <div className="reward-footer">
                <span className="pill subtle">{reward.requirement}</span>
                {!reward.unlocked && <span className="lock">🔒</span>}
                {reward.unlocked && <button className="ghost small">Активировать</button>}
              </div>
            </div>
          ))}
        </div>
      </section>

      <AchievementLegend />

      <section className="mission-catalog">
        <div className="section-head">
          <div>
            <h2>Каталог заданий</h2>
            <p className="meta">Отфильтруй нужные задания или изучи детали выбранной задачи.</p>
          </div>
        </div>
        <div className="mission-filter-card">
          <div className="chip-row">
            {durationFilters.map((item) => (
              <button
                key={item.id}
                className={`chip ${duration === item.id ? "active" : ""}`}
                onClick={() => setDuration(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="chip-row spaced">
            <div className="chip-group">
              {difficultyFilters.map((item) => (
                <button
                  key={item.id}
                  className={`chip ${difficulty === item.id ? "active" : ""}`}
                  onClick={() => setDifficulty(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div className="chip-group">
              {typeFilters.map((item) => (
                <button
                  key={item.id}
                  className={`chip ${category === item.id ? "active" : ""}`}
                  onClick={() => setCategory(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mission-layout">
          <div className="mission-grid">
            {filteredMissions.map((mission) => (
              <MissionCard
                key={mission.id}
                mission={mission}
                progress={getMissionProgress?.(mission.id) || { status: "new", currentValue: 0 }}
                onSelect={() => setSelectedId(mission.id)}
                onPrimary={() => {
                  handleStart(mission.id);
                  handleNavigate(mission);
                }}
              />
            ))}
          </div>

          {selectedMission && selectedProgress && (
            <MissionDetail
              mission={selectedMission}
              progress={selectedProgress}
              onNavigate={() => handleNavigate(selectedMission)}
              onStart={() => handleStart(selectedMission.id)}
              onComplete={() => handleComplete(selectedMission.id)}
            />
          )}
        </div>
      </section>
    </div>
  );
};

export default MissionsPage;
