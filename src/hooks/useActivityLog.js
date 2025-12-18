import { useCallback, useEffect, useMemo, useState } from "react";

const STORAGE_PREFIX = "noesis_activity_";
const resolveKey = (userId) => `${STORAGE_PREFIX}${userId || "guest"}`;

const defaultDay = (date) => ({
  date,
  completedMaterialsCount: 0,
  missionsCompletedCount: 0,
  memoryEntriesCount: 0,
  communityActionsCount: 0,
  sessionsCount: 0,
  totalXP: 0,
});

const ensureStore = (data = {}) => ({
  days: data.days || {},
  events: data.events || [],
  bestStreak: data.bestStreak || 0,
  lastActiveDate: data.lastActiveDate || null,
});

const isDateString = (value) => typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);

const todayISO = () => new Date().toISOString().slice(0, 10);

const hasActivity = (day) => {
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

const loadStore = (userId) => {
  try {
    const raw = localStorage.getItem(resolveKey(userId));
    if (!raw) return ensureStore();
    const parsed = JSON.parse(raw);
    return ensureStore(parsed);
  } catch (err) {
    console.warn("Не удалось загрузить лог активности", err);
    return ensureStore();
  }
};

export const clearActivityLog = (userId) => localStorage.removeItem(resolveKey(userId));

const saveStore = (userId, store) => {
  localStorage.setItem(resolveKey(userId), JSON.stringify(store));
  return store;
};

export const computeIntensity = (day) => {
  if (!day) return 0;
  const baseScore =
    (day.completedMaterialsCount || 0) * 30 +
    (day.missionsCompletedCount || 0) * 25 +
    (day.memoryEntriesCount || 0) * 10 +
    (day.communityActionsCount || 0) * 8 +
    (day.sessionsCount || 0) * 5 +
    (day.totalXP || 0) * 0.5;
  if (baseScore >= 180) return 3;
  if (baseScore >= 90) return 2;
  if (baseScore >= 30) return 1;
  return 0;
};

const computeStreakFromDays = (daysMap) => {
  const activeDates = Object.values(daysMap || {})
    .filter((day) => hasActivity(day))
    .map((day) => day.date)
    .filter(isDateString)
    .sort();

  if (!activeDates.length) return { current: 0, best: 0, lastActiveDate: null, streakDates: new Set() };

  const dateSet = new Set(activeDates);
  const today = todayISO();
  const streakDates = new Set();

  let current = 0;
  let best = 0;
  let pointer = activeDates[activeDates.length - 1];

  // вычисляем текущую серию (до сегодняшнего дня или последнего активного дня)
  let cursor = pointer;
  const dayMs = 24 * 60 * 60 * 1000;
  while (cursor && dateSet.has(cursor)) {
    streakDates.add(cursor);
    current += 1;
    const prev = new Date(cursor);
    prev.setTime(prev.getTime() - dayMs);
    cursor = prev.toISOString().slice(0, 10);
  }

  // вычисляем лучшую серию
  let tempStreak = 0;
  for (let i = 0; i < activeDates.length; i += 1) {
    const date = new Date(activeDates[i]);
    if (i === 0) {
      tempStreak = 1;
    } else {
      const prevDate = new Date(activeDates[i - 1]);
      const diff = (date - prevDate) / dayMs;
      tempStreak = diff === 1 ? tempStreak + 1 : 1;
    }
    best = Math.max(best, tempStreak);
  }

  const isCurrentValid = (() => {
    const lastDate = activeDates[activeDates.length - 1];
    const diffFromToday = Math.floor((new Date(today) - new Date(lastDate)) / dayMs);
    return diffFromToday <= 1;
  })();

  return {
    current: isCurrentValid ? current : 0,
    best,
    lastActiveDate: pointer,
    streakDates,
  };
};

const appendEvent = (events, event) => [{ ...event, id: crypto.randomUUID ? crypto.randomUUID() : String(Math.random()) }, ...events].slice(0, 60);

export const logActivityEvent = (userId, eventType, payload = {}, prevStore) => {
  const store = ensureStore(prevStore || loadStore(userId));
  const dateKey = payload.date || todayISO();
  const prevDay = store.days[dateKey] ? { ...store.days[dateKey] } : defaultDay(dateKey);
  const wasActive = hasActivity(prevDay);

  const nextDay = { ...prevDay };
  const xpDelta = Number(payload.xp || payload.totalXP || 0) || 0;

  switch (eventType) {
    case "materialCompleted":
    case "testCompleted":
    case "inlineQuizCompleted":
    case "mindgameCompleted":
      nextDay.completedMaterialsCount = (nextDay.completedMaterialsCount || 0) + 1;
      break;
    case "missionCompleted":
      nextDay.missionsCompletedCount = (nextDay.missionsCompletedCount || 0) + 1;
      break;
    case "memoryEntryCreated":
      nextDay.memoryEntriesCount = (nextDay.memoryEntriesCount || 0) + 1;
      break;
    case "communityAction":
      nextDay.communityActionsCount = (nextDay.communityActionsCount || 0) + 1;
      break;
    case "sessionStarted":
      nextDay.sessionsCount = (nextDay.sessionsCount || 0) + 1;
      break;
    default:
      break;
  }

  if (xpDelta) {
    nextDay.totalXP = Math.max(0, (nextDay.totalXP || 0) + xpDelta);
  }

  const updatedStore = {
    ...store,
    days: { ...store.days, [dateKey]: nextDay },
  };

  const titleFallback =
    payload.title ||
    (eventType === "sessionStarted"
      ? "Вход в платформу"
      : eventType === "missionCompleted"
      ? "Задание выполнено"
      : eventType === "materialCompleted"
      ? "Материал завершён"
      : "Активность");

  const newEvent = {
    type: eventType,
    title: titleFallback,
    createdAt: payload.createdAt || new Date().toISOString(),
    meta: payload.meta,
  };

  updatedStore.events = appendEvent(store.events, newEvent);

  const streakInfo = computeStreakFromDays(updatedStore.days);
  updatedStore.bestStreak = Math.max(store.bestStreak || 0, streakInfo.best || 0);
  updatedStore.lastActiveDate = streakInfo.lastActiveDate;

  saveStore(userId, updatedStore);

  return {
    store: updatedStore,
    dayKey: dateKey,
    day: nextDay,
    streak: { ...streakInfo, best: updatedStore.bestStreak },
    isFirstActive: !wasActive && hasActivity(nextDay),
  };
};

export const getActivityForMonth = (userId, year, month, baseStore) => {
  const store = ensureStore(baseStore || loadStore(userId));
  const days = store.days || {};
  const result = {};
  const monthIndex = month - 1;
  Object.keys(days).forEach((dateKey) => {
    const [y, m] = dateKey.split("-").map((n) => Number(n));
    if (y === year && m === monthIndex + 1) {
      result[dateKey] = days[dateKey];
    }
  });
  return result;
};

export const getStreakInfo = (userId, baseStore) => {
  const store = ensureStore(baseStore || loadStore(userId));
  const streakInfo = computeStreakFromDays(store.days);
  return { ...streakInfo, best: Math.max(store.bestStreak || 0, streakInfo.best || 0) };
};

export const getActiveDaysForMonth = (userId, year, month, baseStore) => {
  const monthActivity = getActivityForMonth(userId, year, month, baseStore);
  return Object.values(monthActivity).filter((day) => hasActivity(day)).length;
};

export function useActivityLog(userId) {
  const [store, setStore] = useState(() => loadStore(userId));

  useEffect(() => {
    setStore(loadStore(userId));
  }, [userId]);

  const logActivity = useCallback(
    (eventType, payload = {}) => {
      let result = null;
      setStore((prev) => {
        result = logActivityEvent(userId, eventType, payload, prev);
        return result.store;
      });
      return result;
    },
    [userId]
  );

  const monthActivity = useCallback((year, month) => getActivityForMonth(userId, year, month, store), [store, userId]);

  const streakInfo = useMemo(() => getStreakInfo(userId, store), [store, userId]);

  const activeDaysThisMonth = useMemo(() => {
    const now = new Date();
    return getActiveDaysForMonth(userId, now.getFullYear(), now.getMonth() + 1, store);
  }, [store, userId]);

  return {
    store,
    activityByDate: store.days,
    activityFeed: store.events,
    streakInfo,
    logActivity,
    getActivityForMonth: monthActivity,
    activeDaysThisMonth,
  };
}
