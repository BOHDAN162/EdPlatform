const baseKey = "ep_progress_";

const resolveKey = (userId) => `${baseKey}${userId || "guest"}`;

const defaultState = { completedMaterialIds: [], startedMaterialIds: [] };

export const loadProgress = (userId) => {
  try {
    const raw = localStorage.getItem(resolveKey(userId));
    if (!raw) return { ...defaultState };
    const parsed = JSON.parse(raw);
    return {
      ...defaultState,
      ...parsed,
      completedMaterialIds: parsed.completedMaterialIds || [],
      startedMaterialIds: parsed.startedMaterialIds || [],
    };
  } catch (e) {
    console.error("load progress", e);
    return { ...defaultState };
  }
};

const saveProgress = (userId, data) => {
  localStorage.setItem(resolveKey(userId), JSON.stringify(data));
  return data;
};

export const isMaterialCompleted = (materialId, progress) => {
  const state = progress || defaultState;
  return (state.completedMaterialIds || []).includes(materialId);
};

export const markMaterialCompleted = (userId, materialId, progress) => {
  const current = progress || loadProgress(userId);
  const set = new Set(current.completedMaterialIds || []);
  set.add(materialId);
  const started = new Set(current.startedMaterialIds || []);
  started.add(materialId);
  const updated = { ...current, completedMaterialIds: Array.from(set), startedMaterialIds: Array.from(started) };
  return saveProgress(userId, updated);
};

export const markMaterialStarted = (userId, materialId, progress) => {
  const current = progress || loadProgress(userId);
  const started = new Set(current.startedMaterialIds || []);
  started.add(materialId);
  const updated = { ...current, startedMaterialIds: Array.from(started) };
  return saveProgress(userId, updated);
};

export const clearProgress = (userId) => {
  localStorage.removeItem(resolveKey(userId));
};

export const getPathProgress = (path, completedMaterialIds = []) => {
  const completed = new Set(completedMaterialIds);
  const completedCount = path.materials.filter((m) => completed.has(m)).length;
  return { completedCount, totalCount: path.materials.length };
};

export const getMaterialStatus = (materialId, progress) => {
  const state = progress || defaultState;
  if ((state.completedMaterialIds || []).includes(materialId)) return "completed";
  if ((state.startedMaterialIds || []).includes(materialId)) return "inProgress";
  return "new";
};

