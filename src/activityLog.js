const baseKey = "ep_activity_";
const resolveKey = (userId) => `${baseKey}${userId || "guest"}`;

const ensureArray = (value) => (Array.isArray(value) ? value : []);

export const loadActivity = (userId) => {
  try {
    const raw = localStorage.getItem(resolveKey(userId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return ensureArray(parsed);
  } catch (e) {
    console.error("load activity", e);
    return [];
  }
};

const saveActivity = (userId, items) => {
  localStorage.setItem(resolveKey(userId), JSON.stringify(items));
  return items;
};

export const addActivityEntry = (userId, entry, currentLog) => {
  const baseLog = ensureArray(currentLog) || loadActivity(userId);
  const payload = [
    {
      id: crypto.randomUUID(),
      createdAt: entry.createdAt || new Date().toISOString(),
      ...entry,
    },
    ...baseLog,
  ].slice(0, 25);
  return saveActivity(userId, payload);
};

export const clearActivity = (userId) => {
  localStorage.removeItem(resolveKey(userId));
};
