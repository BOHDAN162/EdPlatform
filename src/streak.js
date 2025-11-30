const baseKey = "ep_streak_";
const resolveKey = (userId) => `${baseKey}${userId || "guest"}`;

const defaultState = { count: 0, lastDate: null };

const todayISO = () => new Date().toISOString().slice(0, 10);
const yesterdayISO = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
};

const saveStreak = (userId, data) => {
  localStorage.setItem(resolveKey(userId), JSON.stringify(data));
  return data;
};

export const loadStreak = (userId) => {
  try {
    const raw = localStorage.getItem(resolveKey(userId));
    if (!raw) return { ...defaultState };
    const parsed = JSON.parse(raw);
    return { ...defaultState, ...parsed };
  } catch (e) {
    console.error("load streak", e);
    return { ...defaultState };
  }
};

export const updateStreakOnActivity = (userId, current) => {
  const base = current || loadStreak(userId);
  const today = todayISO();
  if (base.lastDate === today) return base;
  const updatedCount = base.lastDate === yesterdayISO() ? (base.count || 0) + 1 : 1;
  const updated = { count: updatedCount, lastDate: today };
  return saveStreak(userId, updated);
};

export const resetStreak = (userId) => saveStreak(userId, { ...defaultState });
