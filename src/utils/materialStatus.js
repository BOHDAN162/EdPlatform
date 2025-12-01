export const statusFromProgress = (materialId, completedSet, activeMaterialId) => {
  if (completedSet.has(materialId)) return "completed";
  if (materialId === activeMaterialId) return "inProgress";
  return "new";
};

export const statusProgressValue = {
  new: 8,
  inProgress: 55,
  completed: 100,
};
