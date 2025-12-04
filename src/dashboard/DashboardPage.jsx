import React, { useMemo, useState } from "react";
import DashboardHero from "./components/DashboardHero";
import ProgressRingsPanel from "./components/ProgressRingsPanel";
import TodayMissionCard from "./components/TodayMissionCard";
import WeeklyTrack from "./components/WeeklyTrack";
import RecommendationsPanel from "./components/RecommendationsPanel";
import AchievementsFeed from "./components/AchievementsFeed";
import CommunitySnapshot from "./components/CommunitySnapshot";
import MoodSelector from "./components/MoodSelector";
import WeeklyCalendar from "./components/WeeklyCalendar";
import WeeklyProgressSummary from "./components/WeeklyProgressSummary";
import { materials } from "../libraryData";
import { missions as missionCatalog } from "../data/missions";
import { getLevelFromPoints, progressToNextStatus } from "../gamification";
import { useNavigate } from "../routerShim";
import HabitDashboardWidget from "../habits/HabitDashboardWidget";

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
  completedThisWeek = 0,
}) => {
  const navigate = useNavigate();
  const [mood, setMood] = useState("ok");

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

  const weeklySummary = useMemo(() => {
    const graph = weeklyTrack.map((day) => Math.max(1, Math.round((day.completed / Math.max(1, day.planned)) * 8)));
    return {
      missions: missionCompletedCount,
      materials: completedMaterials,
      xp: gamification?.totalPoints || 0,
      streak: streakCount,
      graph,
    };
  }, [completedMaterials, gamification?.totalPoints, missionCompletedCount, streakCount, weeklyTrack]);

  const recommendedMaterials = useMemo(
    () =>
      materials
        .slice(0, 3)
        .map((material) => ({
          ...material,
          duration: material.estimatedTime ? `${material.estimatedTime} мин` : "коротко",
          typeLabel: material.type === "course" ? "Курс" : material.type === "article" ? "Статья" : "Тест",
        })),
    []
  );

  const recommendedGames = [
    { id: "logic", title: "MindGame: Фокус", description: "5 вопросов на внимание и скорость", best: "+320 XP", to: "/library" },
    { id: "finance", title: "MindGame: Финансы", description: "Практика решений с деньгами", best: "+280 XP", to: "/library" },
  ];

  const recommendedMaterial = recommendedMaterials[0];
  const recommendedGame = recommendedGames[0];

  const achievementTimeline = useMemo(() => {
    if (activityFeed?.length) return activityFeed;
    return [
      { id: "a1", title: "Завершил 2 миссии и прошёл MindGame «Фокус»", type: "Сегодня" },
      { id: "a2", title: "Добавлена новая запись в Память", type: "Вчера" },
      { id: "a3", title: "Ответ в сообществе отмечен как лучший", type: "Недавно" },
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
    ];
  }, [community]);

  const calendarEvents = useMemo(() => {
    const generated = trackData?.generatedTrack || [];
    const mapped = generated.slice(0, 4).map((item, idx) => {
      const date = new Date();
      date.setDate(date.getDate() + idx + 1);
      return {
        id: item.id || `event-${idx}`,
        day: date.getDate(),
        month: date.toLocaleDateString("ru-RU", { month: "short" }),
        title: item.title || "Шаг трека",
        description: item.description || "Задание из твоего трека",
        tag: "трек",
      };
    });
    if (mapped.length) return mapped;
    return [
      { id: "e1", day: "Сегодня", month: "", title: "Мини-квиз по финансам", description: "15 минут", tag: "тест" },
      { id: "e2", day: "Завтра", month: "", title: "MindGame спринт", description: "5 сценариев", tag: "mindgame" },
      { id: "e3", day: "Суббота", month: "", title: "Созвон клуба", description: "Комьюнити-ивент", tag: "сообщество" },
    ];
  }, [trackData]);

  const handleContinue = () => {
    if (todayMission?.link) {
      navigate(todayMission.link);
      return;
    }
    navigate("/missions");
  };

  return (
    <div className="dashboard-grid">
      <DashboardHero user={user} streak={streakInfo} mood={mood} onContinue={handleContinue} />
      <ProgressRingsPanel stats={stats} onNavigate={navigate} />
      <TodayMissionCard mission={todayMission} onStart={handleContinue} />
      <WeeklyProgressSummary summary={weeklySummary} />
      <HabitDashboardWidget />
      <RecommendationsPanel material={recommendedMaterial} game={recommendedGame} insightLink="/memory" />
      <WeeklyTrack week={weeklyTrack} />
      <AchievementsFeed feed={achievementTimeline} />
      <CommunitySnapshot items={communitySnapshot} />
      <MoodSelector onChange={setMood} />
      <WeeklyCalendar events={calendarEvents} />
    </div>
  );
};

export default DashboardPage;
