import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "../routerShim";
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

  const progressRings = useMemo(
    () => [
      {
        label: "Обучение",
        value: Math.min(100, Math.round((completedMaterials / 20) * 100)),
        hint: `${completedMaterials} материалов`,
        color: "#8b5cf6",
        to: "/library",
      },
      {
        label: "Действия",
        value: Math.min(100, Math.round((missionCompletedCount / Math.max(1, missions.length)) * 100)),
        hint: `${missionCompletedCount} из ${missions.length} заданий`,
        color: "#22c55e",
        to: "/missions",
      },
      {
        label: "Осознанность",
        value: Math.min(100, Math.round((streakCount / 7) * 100)),
        hint: `Серия ${streakCount} дней`,
        color: "#0ea5e9",
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
    { id: "m1", title: "Серия 5 дней", subtitle: "Не пропускал активности", reward: "+120 XP", icon: "🔥" },
    { id: "m2", title: "MindGame Sprint", subtitle: "Сделал 3 игры подряд", reward: "+90 XP", icon: "🎮" },
    { id: "m3", title: "Память", subtitle: "2 заметки за неделю", reward: "+60 XP", icon: "🧠" },
    { id: "m4", title: "Задания", subtitle: "3/4 закрытых", reward: "+110 XP", icon: "🎯" },
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

  const recentActivityGrid = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 35 }).map((_, idx) => {
      const date = new Date();
      date.setDate(now.getDate() - (34 - idx));
      const key = date.toISOString().slice(0, 10);
      const dayActivity = activityByDate?.[key];
      const count = Array.isArray(dayActivity) ? dayActivity.length : dayActivity?.events?.length || 0;
      return { key, label: date.getDate(), active: count > 0 };
    });
  }, [activityByDate]);

  const quickStats = [
    { label: "Уровень", value: levelInfo.level, hint: `${levelInfo.toNext} XP до следующего` },
    { label: "XP всего", value: gamification?.totalPoints || 0, hint: `${progressToNextStatus(gamification?.totalPoints || 0).current}` },
    { label: "Серия", value: `${streakCount} дн.`, hint: `Лучший: ${streakInfo?.best || streakCount}` },
    { label: "Материалы", value: completedMaterials, hint: "Закрыто" },
    { label: "Задания", value: missionCompletedCount, hint: "Готово" },
    { label: "Тесты", value: gamification.completedTestsCount || 0, hint: "Пройдено" },
  ];

  const snapshot = [
    { title: "XP за неделю", value: `${gamification.weeklyXp || 0} XP`, note: "с учётом MindGames" },
    { title: "Новые материалы", value: `${materials?.slice(0, 3).length} рекомендовано`, note: "смотри Библиотеку" },
    { title: "Лучший стрик", value: `${streakInfo?.best || streakCount} дней`, note: "держи темп" },
  ];

  const handleContinue = () => {
    if (todayMission?.link) {
      navigate(todayMission.link);
      return;
    }
    navigate("/missions");
  };

  const handleReflect = (entry) => {
    console.log("Reflection saved", entry);
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
        rings={progressRings}
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
            <MoodReflection onChangeMood={setMood} onReflect={handleReflect} />
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
            <div className="card-header">Панель развития</div>
            <p className="meta">Ключевые показатели и подсказки в одном месте.</p>
            <div className="mt-3 grid gap-3 md:grid-cols-3">
              {snapshot.map((item) => (
                <div key={item.title} className="rounded-2xl border border-white/5 bg-white/5 p-4">
                  <div className="meta subtle">{item.title}</div>
                  <div className="text-2xl font-semibold">{item.value}</div>
                  <div className="meta subtle">{item.note}</div>
                </div>
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
            {quickStats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-white/5 bg-white/5 p-4">
                <div className="meta subtle">{stat.label}</div>
                <div className="text-xl font-semibold">{stat.value}</div>
                <div className="meta subtle">{stat.hint}</div>
              </div>
            ))}
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

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="card md:col-span-2">
            <div className="card-header">Активные дни</div>
            <p className="meta">Подсветка последних 5 недель и серии.</p>
            <div className="grid grid-cols-7 gap-1 rounded-2xl border border-white/5 bg-white/5 p-3">
              {recentActivityGrid.map((day) => (
                <div
                  key={day.key}
                  className={`h-8 rounded-md ${day.active ? "bg-[#8A3FFC]" : "bg-white/10"}`}
                  title={`${day.key} · ${day.active ? "Активный" : "Без действий"}`}
                />
              ))}
            </div>
            <div className="chip-row mt-3">
              <span className="chip">Серия: {streakCount} дн.</span>
              <span className="chip ghost">Лучший стрик: {streakInfo?.best || streakCount}</span>
            </div>
          </div>
          <div className="card">
            <div className="card-header">Задания и материалы</div>
            <div className="grid gap-3">
              <div className="rounded-xl border border-white/5 bg-white/5 p-3">
                <div className="meta subtle">Задания</div>
                <div className="text-2xl font-semibold">{missionCompletedCount}</div>
                <div className="meta subtle">Выполнено за всё время</div>
              </div>
              <div className="rounded-xl border border-white/5 bg-white/5 p-3">
                <div className="meta subtle">Материалы</div>
                <div className="text-2xl font-semibold">{completedMaterials}</div>
                <div className="meta subtle">Закрытые уроки</div>
              </div>
            </div>
          </div>
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
