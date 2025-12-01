const baseKey = "ep_track_";

const resolveKey = (userId) => `${baseKey}${userId || "guest"}`;

const normalizeTrack = (data) => {
  if (!data) return null;
  const steps = data.trackSteps || data.generatedTrack || [];
  const profileResult =
    data.profileResult ||
    (data.profileType
      ? {
          profileKey: data.profileKey,
          profileType: data.profileType,
          summary: data.description,
          strengths: data.summary,
          comparison: data.comparison || [],
        }
      : null);
  return {
    ...data,
    profileResult,
    generatedTrack: steps,
    trackSteps: steps,
    completedStepIds: data.completedStepIds || [],
  };
};

export const loadTrack = (userId) => {
  try {
    const raw = localStorage.getItem(resolveKey(userId));
    if (!raw) return null;
    return normalizeTrack(JSON.parse(raw));
  } catch (e) {
    console.error("load track", e);
    return null;
  }
};

export const saveTrack = (userId, data) => {
  const payload = normalizeTrack({ ...data, completedStepIds: data.completedStepIds || [] });
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
  const updated = normalizeTrack({ ...current, completedStepIds: Array.from(completed) });
  localStorage.setItem(resolveKey(userId), JSON.stringify(updated));
  return updated;
};
