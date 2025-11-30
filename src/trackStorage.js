const baseKey = "ep_track_";

const resolveKey = (userId) => `${baseKey}${userId || "guest"}`;

export const loadTrack = (userId) => {
  try {
    const raw = localStorage.getItem(resolveKey(userId));
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.error("load track", e);
    return null;
  }
};

export const saveTrack = (userId, data) => {
  const payload = { ...data, completedStepIds: data.completedStepIds || [] };
  localStorage.setItem(resolveKey(userId), JSON.stringify(payload));
  return payload;
};

export const clearTrack = (userId) => {
  localStorage.removeItem(resolveKey(userId));
};

export const markStepCompleted = (userId, stepId) => {
  const current = loadTrack(userId);
  if (!current) return null;
  const completed = new Set(current.completedStepIds || []);
  completed.add(stepId);
  const updated = { ...current, completedStepIds: Array.from(completed) };
  localStorage.setItem(resolveKey(userId), JSON.stringify(updated));
  return updated;
};
