const baseKey = "ep_gamification_";

export const defaultGamification = {
  totalPoints: 0,
  completedTestsCount: 0,
  completedMaterialsCount: 0,
  achievements: [],
};

export const STATUSES = [
  { min: 700, title: "Лидер" },
  { min: 300, title: "Создатель" },
  { min: 100, title: "Исследователь" },
  { min: 0, title: "Новичок" },
];

const LEVEL_STEP = 120;

export const getStatusByPoints = (points = 0) => {
  const found = STATUSES.find((s) => points >= s.min);
  return found ? found.title : "Новичок";
};

export const getLevelFromPoints = (points = 0) => {
  const level = Math.max(1, Math.floor(points / LEVEL_STEP) + 1);
  const currentLevelBase = (level - 1) * LEVEL_STEP;
  const nextLevelBase = level * LEVEL_STEP;
  const progress = Math.min(100, Math.round(((points - currentLevelBase) / (nextLevelBase - currentLevelBase)) * 100));
  return {
    level,
    currentLevelBase,
    nextLevelBase,
    progress,
    toNext: Math.max(0, nextLevelBase - points),
  };
};

const save = (userId, data) => {
  if (!userId) return;
  localStorage.setItem(`${baseKey}${userId}`, JSON.stringify(data));
};

export const loadGamification = (userId) => {
  if (!userId) return { ...defaultGamification };
  try {
    const raw = localStorage.getItem(`${baseKey}${userId}`);
    if (!raw) return { ...defaultGamification };
    return { ...defaultGamification, ...JSON.parse(raw) };
  } catch (e) {
    console.error("load gamification", e);
    return { ...defaultGamification };
  }
};

const achievementsList = [
  { id: "first-test", title: "Первый тест", check: (g) => g.completedTestsCount >= 1 },
  { id: "tests-3", title: "3 теста подряд", check: (g) => g.completedTestsCount >= 3 },
  { id: "materials-5", title: "5 материалов", check: (g) => g.completedMaterialsCount >= 5 },
  { id: "points-100", title: "100 очков", check: (g) => g.totalPoints >= 100 },
  { id: "points-300", title: "300 очков", check: (g) => g.totalPoints >= 300 },
];

const evaluateAchievements = (gamification) => {
  const unlocked = new Set(gamification.achievements);
  const newly = [];
  achievementsList.forEach((ach) => {
    if (ach.check(gamification) && !unlocked.has(ach.id)) {
      unlocked.add(ach.id);
      newly.push(ach.title);
    }
  });
  return { achievements: Array.from(unlocked), newly };
};

export const awardForTest = (userId, current) => {
  const updated = {
    ...current,
    totalPoints: current.totalPoints + 50,
    completedTestsCount: current.completedTestsCount + 1,
  };
  const { achievements, newly } = evaluateAchievements(updated);
  const result = { ...updated, achievements };
  save(userId, result);
  return { gamification: result, messages: ["+50 очков за прохождение теста", ...newly.map((n) => `Новая награда: "${n}"`)] };
};

export const awardForMaterial = (userId, current) => {
  const updated = {
    ...current,
    totalPoints: current.totalPoints + 30,
    completedMaterialsCount: current.completedMaterialsCount + 1,
  };
  const { achievements, newly } = evaluateAchievements(updated);
  const result = { ...updated, achievements };
  save(userId, result);
  return {
    gamification: result,
    messages: ["+30 очков за материал", ...newly.map((n) => `Новая награда: "${n}"`)],
  };
};

export const progressToNextStatus = (points = 0) => {
  const current = STATUSES.find((s) => points >= s.min) || STATUSES[STATUSES.length - 1];
  const currentIndex = STATUSES.indexOf(current);
  const next = STATUSES[currentIndex - 1];
  if (!next) return { current: current.title, next: null, progress: 100 };
  const range = next.min - current.min;
  const gained = points - current.min;
  const progress = Math.min(100, Math.round((gained / range) * 100));
  return { current: current.title, next: next.title, progress };
};
