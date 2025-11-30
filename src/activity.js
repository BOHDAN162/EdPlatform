const baseKey = "ep_activity_";

const resolveKey = (userId) => `${baseKey}${userId || "guest"}`;

const defaultState = {
  lastActive: null,
  streak: 0,
  events: [],
};

const save = (userId, data) => {
  localStorage.setItem(resolveKey(userId), JSON.stringify(data));
  return data;
};

export const loadActivity = (userId) => {
  try {
    const raw = localStorage.getItem(resolveKey(userId));
    if (!raw) return { ...defaultState };
    return { ...defaultState, ...JSON.parse(raw), events: JSON.parse(raw).events || [] };
  } catch (e) {
    console.error("load activity", e);
    return { ...defaultState };
  }
};

const diffInDays = (a, b) => {
  const dayA = new Date(a);
  const dayB = new Date(b);
  const ms = 1000 * 60 * 60 * 24;
  const startOfA = Date.UTC(dayA.getFullYear(), dayA.getMonth(), dayA.getDate());
  const startOfB = Date.UTC(dayB.getFullYear(), dayB.getMonth(), dayB.getDate());
  return Math.floor((startOfA - startOfB) / ms);
};

export const registerActivity = (userId, event) => {
  const now = event.timestamp || Date.now();
  const state = loadActivity(userId);
  const last = state.lastActive ? new Date(state.lastActive) : null;
  let streak = state.streak || 0;

  if (!last) {
    streak = 1;
  } else {
    const diff = diffInDays(now, last);
    if (diff === 0) {
      streak = state.streak || 1;
    } else if (diff === 1) {
      streak = (state.streak || 0) + 1;
    } else if (diff > 1) {
      streak = 1;
    }
  }

  const next = {
    ...state,
    streak,
    lastActive: now,
    events: [{ ...event, timestamp: now }, ...(state.events || [])].slice(0, 40),
  };
  return save(userId, next);
};

export const getRecentEvents = (activityState, limit = 8) => {
  return (activityState?.events || []).slice(0, limit);
};

export const countTodayByType = (activityState, type) => {
  const today = new Date();
  return (activityState?.events || []).filter((ev) => {
    const evDate = new Date(ev.timestamp);
    return (
      ev.type === type &&
      evDate.getFullYear() === today.getFullYear() &&
      evDate.getMonth() === today.getMonth() &&
      evDate.getDate() === today.getDate()
    );
  }).length;
};

export const getDaysBetween = (ts) => {
  if (!ts) return Infinity;
  const now = new Date();
  const date = new Date(ts);
  return diffInDays(now, date);
};

