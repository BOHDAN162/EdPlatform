import { useEffect, useMemo, useState } from "react";
import { getMaterialById, materials } from "../libraryData";

const resolveLastVisitKey = (userId) => `noesis_last_visit_${userId || "guest"}`;

const isToday = (isoDate) => {
  if (!isoDate) return false;
  const today = new Date().toISOString().slice(0, 10);
  return isoDate.slice(0, 10) === today;
};

const daysBetween = (from) => {
  if (!from) return 0;
  const diff = Date.now() - from.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
};

const findNextTrackStep = (trackData, completedIds = []) => {
  if (!trackData?.generatedTrack?.length) return null;
  const completed = new Set(completedIds);
  const next = trackData.generatedTrack.find((step) => {
    const key = step.materialId || step.id;
    return key ? !completed.has(key) : false;
  });
  if (!next) return null;
  const material = getMaterialById(next.materialId);
  return {
    step: next,
    material,
  };
};

const getMissionRemaining = (mission, progress) => {
  if (!mission) return Infinity;
  if (!progress) return mission.targetValue || 0;
  if (mission.targetType === "streak") return Math.max(0, mission.targetValue - (progress.streakCount || 0));
  return Math.max(0, mission.targetValue - (progress.currentValue || 0));
};

const sortByPriority = (list) => [...list].sort((a, b) => (b.priority || 0) - (a.priority || 0));

export function useSmartCommands({
  currentRoute,
  trackData,
  progress,
  missions,
  missionProgress,
  gamification,
  activityLog,
  memoryEntries,
  lastVisit,
}) {
  const [inactiveDays, setInactiveDays] = useState(() => daysBetween(lastVisit));

  useEffect(() => {
    setInactiveDays(daysBetween(lastVisit));
  }, [lastVisit]);

  return useMemo(() => {
    const commands = [];
    const streakCount = gamification?.streakCount || 0;
    const hasActivityToday = isToday(gamification?.lastActivityDate);
    const completedMaterialIds = progress?.completedMaterialIds || [];

    // 1. Track continuation
    const nextStep = findNextTrackStep(trackData, trackData?.completedStepIds || completedMaterialIds);
    if (nextStep) {
      commands.push({
        id: "smart-track-continue",
        title: "Продолжить твой трек развития",
        description: nextStep.material
          ? `Следующий шаг: ${nextStep.material.title}`
          : "Вернуться к следующему шагу в плане",
        category: "Рекомендации",
        priority: 100,
        action: { type: "navigate", to: `/library/${nextStep.step.materialType || "material"}/${nextStep.step.materialId}` },
      });
    }

    // 2. Inactive user nudges
    if (inactiveDays >= 3) {
      commands.push({
        id: "smart-warmup-mission",
        title: "Вернуться в строй: начнём с лёгкого задания",
        description: "Открой раздел заданий и выбери простой шаг",
        category: "Рекомендации",
        priority: 90,
        action: { type: "navigate", to: "/missions" },
      });
      commands.push({
        id: "smart-warmup-material",
        title: "Разогреемся: пройди один короткий материал",
        description: "Мы подберём лёгкий урок для старта",
        category: "Библиотека",
        priority: 85,
        action: { type: "navigate", to: "/library" },
      });
    }

    // 3. Missions almost done
    missions
      .filter((mission) => missionProgress?.[mission.id]?.status === "inProgress")
      .forEach((mission) => {
        const remaining = getMissionRemaining(mission, missionProgress[mission.id]);
        if (remaining <= 1) {
          commands.push({
            id: `smart-mission-${mission.id}`,
            title: `Закончить задание “${mission.title}” — осталось ${remaining} действие`,
            description: "Открыть задания и закрыть задачу",
            category: "Задания",
            priority: 80,
            action: { type: "navigate", to: "/missions", meta: { focusMissionId: mission.id } },
          });
        }
      });

    // 4. Streak protection
    if (streakCount > 0 && !hasActivityToday) {
      commands.push({
        id: "smart-streak-protect",
        title: "Не потеряй серию: сделай сегодня 1 действие",
        description: "Быстрый способ сохранить streak через игру или запись",
        category: "Рекомендации",
        priority: 75,
        action: { type: "navigate", to: "/library" },
      });
      commands.push({
        id: "smart-streak-memory",
        title: "Зафиксируй мысль в Памяти и сохрани streak",
        description: "Добавь короткую запись в раздел Память",
        category: "Память",
        priority: 70,
        action: { type: "navigate", to: "/memory" },
      });
    }

    // 5. Library context
    if (currentRoute?.startsWith("/library")) {
      const unfinishedTrack = trackData?.generatedTrack?.filter((step) => {
        const key = step.materialId;
        return key && !completedMaterialIds.includes(key);
      });
      if (unfinishedTrack?.length) {
        const material = getMaterialById(unfinishedTrack[0].materialId);
        if (material) {
          commands.push({
            id: `smart-library-continue-${material.id}`,
            title: `Продолжить материал “${material.title}”`,
            description: "Ты остановился в библиотеке — догоняем трек",
            category: "Библиотека",
            priority: 65,
            action: { type: "navigate", to: `/library/${unfinishedTrack[0].materialType}/${material.id}` },
          });
        }
      }
    }

    // 6. Memory low entries
    if (currentRoute?.startsWith("/memory") && (memoryEntries?.length || 0) < 3) {
      commands.push({
        id: "smart-memory-add",
        title: "Добавить запись в Память",
        description: "Закрепи идею или связку с материалом",
        category: "Память",
        priority: 60,
        action: { type: "navigate", to: "/memory" },
      });
    }

    // 7. Mission heavy, library light
    const missionActions = activityLog?.filter((item) => ["задание", "missionCompleted"].includes(item.type))?.length || 0;
    const libraryActions = activityLog?.filter((item) => ["материал", "materialCompleted"].includes(item.type))?.length || 0;
    if (missionActions > 2 && libraryActions < 2) {
      commands.push({
        id: "smart-library-pick",
        title: "Подобрать короткий материал под задания",
        description: "Выберем лёгкий урок, чтобы ускорить задания",
        category: "Библиотека",
        priority: 55,
        action: { type: "navigate", to: "/library" },
      });
    }

    // 8. Community frequent visitor
    const communityVisits = activityLog?.filter((item) => ["сообщество", "communityAction"].includes(item.type))?.length || 0;
    if (communityVisits >= 3) {
      commands.push({
        id: "smart-community-answer",
        title: "Ответить на вопрос в Сообществе",
        description: "Прокачай XP за поддержку других",
        category: "Сообщество",
        priority: 50,
        action: { type: "navigate", to: "/community" },
      });
      commands.push({
        id: "smart-community-share",
        title: "Поделиться маленькой победой",
        description: "Напиши пост — получи обратную связь",
        category: "Сообщество",
        priority: 48,
        action: { type: "navigate", to: "/community" },
      });
    }

    // General gentle nudge if nothing else
    if (!commands.length && materials.length) {
      commands.push({
        id: "smart-general-library",
        title: "Выбрать быстрый материал",
        description: "Подберём что-то на 10 минут для разогрева",
        category: "Библиотека",
        priority: 20,
        action: { type: "navigate", to: "/library" },
      });
    }

    return sortByPriority(commands).slice(0, 8);
  }, [
    activityLog,
    currentRoute,
    gamification?.lastActivityDate,
    gamification?.streakCount,
    inactiveDays,
    lastVisit,
    memoryEntries,
    missionProgress,
    missions,
    progress?.completedMaterialIds,
    trackData,
  ]);
}

export function useLastVisit(userId) {
  const [lastVisit, setLastVisit] = useState(null);

  useEffect(() => {
    const key = resolveLastVisitKey(userId);
    const stored = localStorage.getItem(key);
    setLastVisit(stored ? new Date(stored) : null);
    localStorage.setItem(key, new Date().toISOString());
  }, [userId]);

  return lastVisit;
}
