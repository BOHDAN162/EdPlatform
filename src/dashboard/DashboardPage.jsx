import React, { useMemo, useState } from "react";
import { useNavigate } from "../routerShim";
import { materials } from "../libraryData";
import { missions as missionCatalog } from "../data/missions";
import { getLevelFromPoints, progressToNextStatus } from "../gamification";
import GreetingHero from "./components/GreetingHero";
import QuoteCard from "./components/QuoteCard";
import ProgressPanel from "./components/ProgressPanel";
import WeeklyRoadmap from "./components/WeeklyRoadmap";
import FocusMission from "./components/FocusMission";
import HabitPreview from "./components/HabitPreview";
import MoodReflection from "./components/MoodReflection";
import ContentRail from "./components/ContentRail";
import ActivityHistory from "./components/ActivityHistory";
import CommunityPulse from "./components/CommunityPulse";
import InsightCard from "./components/InsightCard";
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
  const [morningMode, setMorningMode] = useState(true);

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

  const completedMaterials = progress.completedMaterialIds?.length || 0;
  const missionCompletedCount = missionStates.filter((m) => m.progress.status === "completed").length;
  const streakCount = streakInfo?.current || streakInfo?.count || 0;

  const stats = useMemo(() => {
    const levelInfo = getLevelFromPoints(gamification?.totalPoints || 0);
    const statusProgress = progressToNextStatus(gamification?.totalPoints || 0);
    return {
      levelLabel: `Уровень ${levelInfo.level} — ${statusProgress.current}`,
      xpLabel: `XP: ${gamification?.totalPoints || 0} · прогресс роли: ${statusProgress.progress}%`,
      streakLabel: `Серия: ${streakCount} дней`,
      rings: [
        {
          label: "Обучение",
          value: Math.min(100, Math.round((completedMaterials / 20) * 100)),
          hint: `${completedMaterials} материалов закрыто`,
          color: "#8b5cf6",
          to: "/library",
        },
        {
          label: "Действия",
          value: Math.min(100, Math.round((missionCompletedCount / Math.max(1, missions.length)) * 100)),
          hint: `${missionCompletedCount} из ${missions.length} миссий`,
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
    };
  }, [gamification?.totalPoints, streakCount, completedMaterials, missionCompletedCount, missions.length]);

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
        focus: progressValue >= 80 ? "Отлично" : "Миссии + рефлексия",
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

  const achievementTimeline = useMemo(() => {
    if (activityFeed?.length) return activityFeed;
    return [
      { id: "a1", title: "Завершил 2 миссии и прошёл MindGame «Фокус»", type: "Сегодня", points: "+220 XP" },
      { id: "a2", title: "Добавлена новая запись в Память", type: "Вчера", points: "+60 XP" },
      { id: "a3", title: "Ответ в сообществе отмечен как лучший", type: "Недавно", points: "+80 XP" },
    ];
  }, [activityFeed]);

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
      { id: "c1", name: "Аня, 16", action: "Проходит миссию про цели", tag: "миссии" },
      { id: "c2", name: "Влад, 18", action: "Набрал 340 XP в MindGame", tag: "игра" },
      { id: "c3", name: "Соня, 15", action: "Делится заметкой в Памяти", tag: "память" },
      { id: "c4", name: "Марк, 17", action: "Запустил новый трек", tag: "трек" },
    ];
  }, [community]);

  const insight = {
    title: "Заверши миссию до 17:00 — мозг держит высокую энергию",
    context: "На основе твоих предыдущих сессий и времени входа",
    action: "Поставь 20 минут фокуса и отметь привычку. Я добавлю +5% к XP",
    tags: ["фокус", "дисциплина", "мягкий дедлайн"],
  };

  const achievements = [
    { id: "m1", title: "Серия 5 дней", subtitle: "Не пропускал активности", reward: "+120 XP", icon: "🔥" },
    { id: "m2", title: "MindGame Sprint", subtitle: "Сделал 3 игры подряд", reward: "+90 XP", icon: "🎮" },
    { id: "m3", title: "Память", subtitle: "2 заметки за неделю", reward: "+60 XP", icon: "🧠" },
    { id: "m4", title: "Миссии", subtitle: "3/4 закрытых", reward: "+110 XP", icon: "🎯" },
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
        morningMode={morningMode}
        onToggleMode={() => setMorningMode((prev) => !prev)}
        mood={mood}
        onMoodChange={setMood}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          <ProgressPanel xp={gamification?.totalPoints || 0} levelLabel={stats.levelLabel} streakLabel={stats.streakLabel} rings={stats.rings} />
          <WeeklyRoadmap week={weeklyTrack} />
          <FocusMission mission={todayMission} onStart={handleContinue} />
          <HabitPreview />
          <ContentRail title="Рекомендованный контент" content={recommendedMaterials} />
          <ContentRail title="MindGames & практика" content={recommendedGames} />
          <ActivityHistory feed={achievementTimeline} />
        </div>
        <div className="space-y-4">
          <QuoteCard seed={gamification?.totalPoints || 0} />
          <MoodReflection onChangeMood={setMood} onReflect={handleReflect} />
          <InsightCard insight={insight} />
          <CommunityPulse members={communitySnapshot} />
          <AchievementsStream items={achievements} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
