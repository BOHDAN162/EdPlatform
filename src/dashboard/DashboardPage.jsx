import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "../routerShim";
import { learningPaths, materials } from "../libraryData";
import { missions as missionCatalog } from "../data/missions";
import { getLevelFromPoints, progressToNextStatus } from "../gamification";
import { getPathProgress } from "../progress";
import GreetingHero from "./components/GreetingHero";
import { quotePool } from "./components/QuoteCard";
import WeeklyRoadmap from "./components/WeeklyRoadmap";
import FocusMission from "./components/FocusMission";
import MoodReflection from "./components/MoodReflection";
import ContentRail from "./components/ContentRail";
import CommunityPulse from "./components/CommunityPulse";
import AchievementsStream from "./components/AchievementsStream";
import ActivityCalendar from "../components/activity/ActivityCalendar";

const hasDayActivity = (day = {}) =>
  (day.completedMaterialsCount || 0) +
    (day.missionsCompletedCount || 0) +
    (day.memoryEntriesCount || 0) +
    (day.communityActionsCount || 0) +
    (day.sessionsCount || 0) +
    (day.totalXP || 0) >
  0;

const DashboardPage = ({
  user,
  gamification,
  missions = missionCatalog,
  missionProgress = {},
  getMissionProgress,
  trackData,
  progress = {},
  activityFeed = [],
  activityByDate = {},
  community = [],
  streakInfo,
}) => {
  const navigate = useNavigate();
  const [mood, setMood] = useState("happy");

  const missionStates = useMemo(
    () =>
      missions.map((mission) => ({
        ...mission,
        progress: getMissionProgress?.(mission.id) || missionProgress[mission.id] || { status: "new", currentValue: 0 },
      })),
    [missions, getMissionProgress, missionProgress]
  );

  const todayMission = useMemo(() => {
    const daily = missionStates.filter((mission) => mission.period?.includes("ежеднев"));
    const activeDaily = daily.find((mission) => mission.progress.status !== "completed");
    return activeDaily || missionStates[0];
  }, [missionStates]);

  const levelInfo = useMemo(
    () => getLevelFromPoints(gamification?.totalPoints || 0),
    [gamification?.totalPoints]
  );

  const completedMaterials = progress.completedMaterialIds?.length || 0;
  const missionCompletedCount = missionStates.filter((m) => m.progress.status === "completed").length;
  const streakCount = streakInfo?.current || streakInfo?.count || 0;

  const progressGoals = useMemo(
    () => [
      {
        id: "learning",
        label: "Обучение",
        percent: Math.min(100, Math.round((completedMaterials / 20) * 100)),
        targetLabel: `${completedMaterials} из 20 материалов`,
        progressLabel: `${completedMaterials} материалов`,
        reward: "+50 XP 💎",
        tips: ["Пройди 1 материал из библиотеки", "Закрепи тестом после статьи"],
        to: "/library",
      },
      {
        id: "actions",
        label: "Действия",
        percent: Math.min(100, Math.round((missionCompletedCount / Math.max(1, missions.length)) * 100)),
        targetLabel: `${missionCompletedCount} из ${missions.length} заданий`,
        progressLabel: `${missionCompletedCount} заданий`,
        reward: "+40 XP",
        tips: ["Выполни задание дня", "Закрой чек-лист трека"],
        to: "/missions",
      },
      {
        id: "awareness",
        label: "Осознанность",
        percent: Math.min(100, Math.round((streakCount / 7) * 100)),
        targetLabel: `Серия: ${streakCount} из 7 дней`,
        progressLabel: `${streakCount} дней серии`,
        reward: "+1 бейдж",
        tips: ["Отметь практику/рефлексию", "Удержи серию без пропусков"],
        to: "/memory",
      },
    ],
    [completedMaterials, missionCompletedCount, missions.length, streakCount]
  );

  const weeklyTrack = useMemo(() => {
    const now = new Date();
    const feedByDate = activityFeed.reduce((acc, item) => {
      if (!item?.createdAt) return acc;
      const created = new Date(item.createdAt);
      if (Number.isNaN(created.getTime())) return acc;
      const key = created.toISOString().slice(0, 10);
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    return Array.from({ length: 7 }).map((_, idx) => {
      const date = new Date();
      date.setDate(now.getDate() - (6 - idx));
      const key = date.toISOString().slice(0, 10);
      const eventsCount = feedByDate[key] || activityByDate[key]?.events?.length || activityByDate[key]?.length || 0;
      const planned = 3;
      const completed = Math.min(planned, eventsCount);
      const progressValue = Math.min(100, Math.round((completed / planned) * 100));
      const status = progressValue >= 80 ? "done" : progressValue > 0 ? "active" : "empty";
      return {
        date: key,
        weekday: date.getDay() === 0 ? 6 : date.getDay() - 1,
        label: date.toLocaleDateString("ru-RU", { day: "numeric", month: "short" }),
        planned,
        completed,
        progress: progressValue,
        status,
        focus: progressValue >= 80 ? "Отлично" : "Задания + рефлексия",
      };
    });
  }, [activityByDate, activityFeed]);

  const recommendedMaterials = useMemo(
    () =>
      materials
        .slice(0, 5)
        .map((material) => ({
          ...material,
          duration: material.estimatedTime ? `${material.estimatedTime} мин` : "коротко",
          typeLabel: material.type === "course" ? "Курс" : material.type === "article" ? "Статья" : "Тест",
          to: `/material/${material.id}`,
          badge: "Учёба",
        })),
    []
  );

  const recommendedGames = [
    { id: "logic", title: "MindGame: Фокус", description: "5 вопросов на внимание", duration: "7 мин", typeLabel: "MindGame", to: "/library", badge: "Игра" },
    { id: "finance", title: "MindGame: Финансы", description: "Практика решений", duration: "10 мин", typeLabel: "MindGame", to: "/library", badge: "Игра" },
  ];

  const [heroQuote, setHeroQuote] = useState(null);

  useEffect(() => {
    if (heroQuote || !quotePool || quotePool.length === 0) return;
    const index = Math.floor(Math.random() * quotePool.length);
    setHeroQuote(quotePool[index]);
  }, [heroQuote]);

  const communitySnapshot = useMemo(() => {
    if (community?.length) {
      return community.slice(0, 4).map((member) => ({
        id: member.id,
        name: member.name,
        action: member.status || "в движении",
        tag: member.level ? `lvl ${member.level}` : "участник",
      }));
    }
    return [
      { id: "c1", name: "Аня, 16", action: "Проходит задание про цели", tag: "задания" },
      { id: "c2", name: "Влад, 18", action: "Набрал 340 XP в MindGame", tag: "игра" },
      { id: "c3", name: "Соня, 15", action: "Делится заметкой в Памяти", tag: "память" },
      { id: "c4", name: "Марк, 17", action: "Запустил новый трек", tag: "трек" },
    ];
  }, [community]);

  const heroInsight = {
    title: "Заверши задание до 17:00 — мозг держит высокую энергию",
    context: "На основе твоих предыдущих сессий и времени входа",
    cta: "Перейти к заданиям",
    to: "/missions",
  };

  const achievements = [
    { id: "m1", title: "Серия 5 дней", subtitle: "Не пропускал активности", reward: "+120 XP", icon: "🔥", progress: 80 },
    { id: "m2", title: "MindGame Sprint", subtitle: "Сделал 3 игры подряд", reward: "+90 XP", icon: "🎮", progress: 60 },
    { id: "m3", title: "Память", subtitle: "2 заметки за неделю", reward: "+60 XP", icon: "🧠", progress: 50 },
    { id: "m4", title: "Бейдж 'Стабильность'", subtitle: "Закрыть 7 дней подряд", reward: "+1 бейдж", icon: "🛡️", locked: true, progress: 30 },
  ];

  const pathCards = useMemo(
    () =>
      learningPaths.slice(0, 4).map((path) => {
        const progressInfo = getPathProgress(path, progress?.completedMaterialIds || []);
        const ratio = progressInfo.totalCount ? Math.round((progressInfo.completedCount / progressInfo.totalCount) * 100) : 0;
        return { path, ratio, progressInfo };
      }),
    [progress?.completedMaterialIds]
  );

  const currentMonthActivity = useMemo(() => {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    return Object.entries(activityByDate || {}).reduce((acc, [key, value]) => {
      const date = new Date(key);
      if (date.getFullYear() === year && date.getMonth() === month) {
        acc[key] = value;
      }
      return acc;
    }, {});
  }, [activityByDate]);

  const activeDays = useMemo(
    () => Object.values(currentMonthActivity || {}).filter((day) => hasDayActivity(day)).length,
    [currentMonthActivity]
  );

  const quickStats = [
    { label: "Уровень", value: levelInfo.level, hint: `${levelInfo.toNext} XP до следующего`, icon: "🏆" },
    { label: "XP всего", value: gamification?.totalPoints || 0, hint: `${progressToNextStatus(gamification?.totalPoints || 0).current}`, icon: "💎", to: "/dashboard" },
    { label: "Серия", value: `${streakCount} дн.`, hint: `Лучший: ${streakInfo?.best || streakCount}`, icon: "🔥" },
    { label: "Материалы", value: completedMaterials, hint: "Закрыто", icon: "📚", to: "/library" },
    { label: "Задания", value: missionCompletedCount, hint: "Готово", icon: "✅", to: "/missions" },
    { label: "Тесты", value: gamification.completedTestsCount || 0, hint: "Пройдено", icon: "🧠", to: "/library#tests" },
  ];

  const snapshot = [
    { title: "XP за неделю", value: `${gamification.weeklyXp || 0} XP`, note: "оценка", delta: "+12%" },
    { title: "Новые материалы", value: `${materials?.slice(0, 3).length} рекомендовано`, note: "за неделю", delta: "+1" },
    { title: "Лучший стрик", value: `${streakInfo?.best || streakCount} дней`, note: "держи темп", delta: streakInfo?.best ? "= " : "новый" },
  ];

  const handleContinue = () => {
    if (todayMission?.link) {
      navigate(todayMission.link);
      return;
    }
    navigate("/missions");
  };

  return (
    <div className="space-y-6 pb-10">
      <GreetingHero
        user={user}
        streak={streakCount}
        level={getLevelFromPoints(gamification?.totalPoints || 0).level}
        xp={gamification?.totalPoints || 0}
        role={progressToNextStatus(gamification?.totalPoints || 0).current}
        mood={mood}
        goals={progressGoals}
        quote={heroQuote}
        insight={heroInsight}
      />

      <div className="space-y-4">
        <WeeklyRoadmap week={weeklyTrack} />
        <FocusMission mission={todayMission} onStart={handleContinue} />
        <ContentRail title="Рекомендованный контент" content={recommendedMaterials} />
        <ContentRail title="MindGames & практика" content={recommendedGames} />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:auto-rows-fr">
          <div className="h-full">
            <MoodReflection onChangeMood={setMood} />
          </div>
          <div className="h-full">
            <CommunityPulse members={communitySnapshot} />
          </div>
          <div className="h-full">
            <AchievementsStream items={achievements} />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="card lg:col-span-2">
            <div className="flex items-center justify-between gap-2">
              <div className="card-header">Панель развития</div>
              <span className="chip ghost">Динамика недели</span>
            </div>
            <p className="meta">Ключевые показатели и подсказки в одном месте.</p>
            <div className="mt-3 grid gap-3 md:grid-cols-3">
              {snapshot.map((item) => (
                <button
                  key={item.title}
                  className="flex flex-col gap-2 rounded-2xl border border-white/5 bg-white/5 p-4 text-left transition hover:border-[#8A3FFC]/60"
                  onClick={() => navigate(item.title.includes("материалы") ? "/library" : "/dashboard")}
                >
                  <div className="flex items-center justify-between">
                    <div className="meta subtle">{item.title}</div>
                    <span className="pill outline">{item.delta || "—"}</span>
                  </div>
                  <div className="text-2xl font-semibold">{item.value}</div>
                  <div className="meta subtle">{item.note}</div>
                  <div className="flex items-end gap-1">
                    {weeklyTrack.map((day) => (
                      <span
                        key={day.date}
                        className="h-2 w-full rounded-full bg-white/10"
                        style={{ maxWidth: "calc(100%/8)", height: `${Math.max(8, day.progress / 8)}px` }}
                      />
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>
          <div className="card">
            <div className="card-header">Уровень и XP</div>
            <p className="meta">До следующего уровня: {levelInfo.toNext} XP</p>
            <div className="progress-shell steady mt-2">
              <div className="progress-fill" style={{ width: `${Math.min(100, levelInfo.progress)}%` }} />
            </div>
            <div className="chip-row mt-3">
              <span className="chip">Уровень {levelInfo.level}</span>
              <span className="chip ghost">Серия {streakCount} дн.</span>
            </div>
          </div>
        </div>

          <div className="card">
            <div className="card-header">Твой прогресс</div>
            <p className="meta">XP, задания, материалы и серия дней.</p>
          <div className="grid gap-3 md:grid-cols-3">
            {quickStats.map((stat) => {
              const content = (
                <>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{stat.icon}</span>
                    <div className="meta subtle">{stat.label}</div>
                  </div>
                  <div className="text-xl font-semibold">{stat.value}</div>
                  <div className="meta subtle">{stat.hint}</div>
                </>
              );
              if (stat.to) {
                return (
                  <Link
                    key={stat.label}
                    to={stat.to}
                    className="group rounded-2xl border border-white/5 bg-white/5 p-4 transition hover:-translate-y-0.5 hover:border-[#8A3FFC]/60"
                  >
                    {content}
                  </Link>
                );
              }
              return (
                <div key={stat.label} className="group rounded-2xl border border-white/5 bg-white/5 p-4">
                  {content}
                </div>
              );
            })}
          </div>
        </div>

        <div className="card">
          <div className="card-header">Твои треки</div>
          <p className="meta">Выбери направление и продолжи маршрут.</p>
          <div className="grid gap-3 md:grid-cols-2">
            {pathCards.map(({ path, ratio }) => (
              <button
                key={path.id}
                className="rounded-2xl border border-white/5 bg-white/5 p-4 text-left transition hover:border-[#8A3FFC]/50"
                onClick={() => navigate(`/library/paths/${path.slug}`)}
              >
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <div className="meta subtle">{path.title}</div>
                    <div className="text-sm text-white/70">{path.description}</div>
                  </div>
                  <span className="pill outline">{ratio}%</span>
                </div>
                <div className="progress-shell steady mt-3">
                  <div className="progress-fill" style={{ width: `${ratio}%` }} />
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="section-head">
            <div>
              <h2>Календарь активности</h2>
              <p className="meta">Следи за днями с действиями, чтобы удерживать серию и задания месяца.</p>
            </div>
            <div className="chip-row">
              <span className="chip">Активные дни: {activeDays}</span>
              <span className="chip">Серия: {streakCount}</span>
              <span className="chip ghost">Лучший стрик: {streakInfo?.best || 0}</span>
            </div>
          </div>
          <ActivityCalendar activityByDate={activityByDate} streakInfo={streakInfo} compact />
        </div>

        <div className="card">
          <div className="card-header">Короткий обзор</div>
          <div className="grid gap-3 md:grid-cols-3">
            {snapshot.map((item) => (
              <div key={item.title} className="rounded-2xl border border-white/5 bg-white/5 p-4">
                <div className="meta subtle">{item.title}</div>
                <div className="text-xl font-semibold">{item.value}</div>
                <div className="meta subtle">{item.note}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
