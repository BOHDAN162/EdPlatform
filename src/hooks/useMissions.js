import { useCallback, useEffect, useMemo, useState } from "react";
import { badgePalette, missions } from "../data/missions";

const resolveKey = (userId) => `noesis_missions_${userId || "guest"}`;

const baseProgress = (mission) => ({
  currentValue: 0,
  status: "new",
  badgeTier: 0,
  streakCount: 0,
  lastUpdated: null,
  lastReset: null,
  completedAt: null,
});

const getPeriodMarker = (interval) => {
  const now = new Date();
  if (interval === "hour") return `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}-${now.getHours()}`;
  if (interval === "day") return now.toISOString().slice(0, 10);
  if (interval === "3-days") return `${now.getFullYear()}-${now.getMonth()}-${Math.floor(now.getDate() / 3)}`;
  if (interval === "week") {
    const firstDay = new Date(now.getFullYear(), 0, 1);
    const pastDays = Math.floor((now - firstDay) / 86400000);
    const week = Math.ceil((pastDays + firstDay.getDay() + 1) / 7);
    return `${now.getFullYear()}-W${week}`;
  }
  if (interval === "month") return `${now.getFullYear()}-${now.getMonth() + 1}`;
  return "none";
};

const loadProgress = (userId) => {
  try {
    const raw = localStorage.getItem(resolveKey(userId));
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (err) {
    console.warn("Не удалось загрузить прогресс заданий", err);
    return {};
  }
};

const saveProgress = (userId, progress) => {
  localStorage.setItem(resolveKey(userId), JSON.stringify(progress));
};

const computeBadgeTier = (mission, value) => {
  let tier = 0;
  mission.badgeLevels.forEach((threshold, idx) => {
    if (value >= threshold) tier = idx + 1;
  });
  return Math.min(tier, badgePalette.length - 1);
};

const evaluateStatus = (mission, value, streak = 0) => {
  if (mission.targetType === "boolean") return value >= mission.targetValue ? "completed" : value > 0 ? "inProgress" : "new";
  if (mission.targetType === "streak") return streak >= mission.targetValue ? "completed" : streak > 0 ? "inProgress" : "new";
  return value >= mission.targetValue ? "completed" : value > 0 ? "inProgress" : "new";
};

const withReset = (mission, progress) => {
  if (!mission.resetInterval || mission.resetInterval === "none") return progress;
  const marker = getPeriodMarker(mission.resetInterval);
  if (progress.lastReset === marker) return progress;
  return {
    ...baseProgress(mission),
    lastReset: marker,
  };
};

export function useMissions(userId, { onMissionCompleted } = {}) {
  const [progress, setProgress] = useState(() => loadProgress(userId));

  useEffect(() => {
    setProgress(loadProgress(userId));
  }, [userId]);

  useEffect(() => {
    saveProgress(userId, progress);
  }, [progress, userId]);

  const resetPeriodicalMissionsIfNeeded = useCallback(() => {
    setProgress((prev) => {
      const next = { ...prev };
      missions.forEach((mission) => {
        const current = prev[mission.id] || baseProgress(mission);
        next[mission.id] = withReset(mission, current);
      });
      return next;
    });
  }, []);

  useEffect(() => {
    resetPeriodicalMissionsIfNeeded();
  }, [resetPeriodicalMissionsIfNeeded]);

  const updateProgressByKey = useCallback(
    (progressKey, delta = 1) => {
      const affected = missions.filter((mission) => mission.progressKey === progressKey);
      if (!affected.length) return [];
      const completedNow = [];
      setProgress((prev) => {
        const next = { ...prev };
        const now = new Date().toISOString();
        affected.forEach((mission) => {
          const base = withReset(mission, prev[mission.id] || baseProgress(mission));
          let currentValue = base.currentValue || 0;
          let streakCount = base.streakCount || 0;

          if (mission.targetType === "count") {
            currentValue = Math.min(mission.targetValue, currentValue + delta);
          } else if (mission.targetType === "boolean") {
            currentValue = delta ? mission.targetValue : currentValue;
          } else if (mission.targetType === "streak") {
            streakCount = Math.min(mission.targetValue, streakCount + delta);
            currentValue = streakCount;
          }

          const status = evaluateStatus(mission, currentValue, streakCount);
          const badgeTier = computeBadgeTier(mission, currentValue);

          const updated = {
            ...base,
            currentValue,
            streakCount,
            badgeTier,
            status,
            lastUpdated: now,
            completedAt: status === "completed" && base.status !== "completed" ? now : base.completedAt,
            lastReset: base.lastReset || getPeriodMarker(mission.resetInterval),
          };

          if (status === "completed" && base.status !== "completed") {
            completedNow.push(mission);
          }

          next[mission.id] = updated;
        });
        return next;
      });

      if (completedNow.length && onMissionCompleted) {
        completedNow.forEach((mission) => onMissionCompleted(mission));
      }
      return completedNow;
    },
    [onMissionCompleted]
  );

  const setMissionStatus = useCallback(
    (missionId, status) => {
      const mission = missions.find((m) => m.id === missionId);
      if (!mission) return;
      setProgress((prev) => {
        const base = withReset(mission, prev[mission.id] || baseProgress(mission));
        const now = new Date().toISOString();
        const nextStatus = status === "completed" ? "completed" : status === "inProgress" ? "inProgress" : "new";
        const nextValue = nextStatus === "new" ? 0 : base.currentValue || (mission.targetType === "boolean" ? 1 : 0);
        const updated = {
          ...base,
          status: nextStatus,
          currentValue: nextValue,
          badgeTier: computeBadgeTier(mission, nextValue),
          lastUpdated: now,
          completedAt: nextStatus === "completed" ? now : null,
          lastReset: base.lastReset || getPeriodMarker(mission.resetInterval),
        };
        if (nextStatus === "completed" && base.status !== "completed" && onMissionCompleted) {
          onMissionCompleted(mission);
        }
        return { ...prev, [missionId]: updated };
      });
    },
    [onMissionCompleted]
  );

  const getMissionProgress = useCallback(
    (missionId) => {
      const mission = missions.find((m) => m.id === missionId);
      const state = mission ? withReset(mission, progress[missionId] || baseProgress(mission)) : baseProgress({});
      return state;
    },
    [progress]
  );

  const getMissions = useCallback(
    ({ duration = "all", difficulty = "all", category = "all" } = {}) =>
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
    []
  );

  const completedThisWeek = useMemo(() => {
    const now = new Date();
    const msInDay = 86400000;
    return Object.values(progress).filter((p) => {
      if (!p.completedAt) return false;
      const diff = now - new Date(p.completedAt);
      return diff <= msInDay * 7;
    }).length;
  }, [progress]);

  return {
    missions,
    progress,
    getMissions,
    getMissionProgress,
    updateProgressByKey,
    setMissionStatus,
    resetPeriodicalMissionsIfNeeded,
    completedThisWeek,
  };
}

export const missionBadge = (mission, value = 0) => {
  const tier = computeBadgeTier(mission, value);
  return badgePalette[tier] || badgePalette[0];
};
