const baseKey = "ep_gamification_";

const levelThresholds = [0, 100, 250, 450, 700, 1000, 1350, 1750];
const extraLevelStep = 250;

const XP_REWARDS = {
  materialCompleted: 20,
  testCompleted: 30,
  inlineQuiz: 25,
  missionCompleted: 80,
  communityAnswer: 10,
  communityBestAnswer: 50,
  dailyGoal: 40,
  weeklyGoal: 100,
};

const todayISO = () => new Date().toISOString().slice(0, 10);
const yesterdayISO = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
};

const getWeekId = () => {
  const d = new Date();
  const firstDay = new Date(d.getFullYear(), 0, 1);
  const pastDays = Math.floor((d - firstDay) / 86400000);
  const week = Math.ceil((pastDays + firstDay.getDay() + 1) / 7);
  return `${d.getFullYear()}-W${week}`;
};

const getGoalPeriodId = (type) => (type === "weekly" ? getWeekId() : todayISO());

const baseGoals = () => [
  {
    id: "daily-material",
    title: "Пройти 1 материал",
    description: "Закрой любой материал из твоего трека сегодня.",
    type: "daily",
    metric: "materials",
    target: 1,
    progress: 0,
    reward: XP_REWARDS.dailyGoal,
    periodId: getGoalPeriodId("daily"),
    completed: false,
  },
  {
    id: "daily-action",
    title: "Сделать 1 действие",
    description: "Зайди в профиль и продвинься хотя бы на шаг.",
    type: "daily",
    metric: "actions",
    target: 1,
    progress: 0,
    reward: XP_REWARDS.dailyGoal,
    periodId: getGoalPeriodId("daily"),
    completed: false,
  },
  {
    id: "weekly-xp",
    title: "Набрать 300 XP",
    description: "Собери очки за материалы, тесты и активность за неделю.",
    type: "weekly",
    metric: "xp",
    target: 300,
    progress: 0,
    reward: XP_REWARDS.weeklyGoal,
    periodId: getGoalPeriodId("weekly"),
    completed: false,
  },
  {
    id: "weekly-materials",
    title: "3 материала за неделю",
    description: "Выбери три материала из библиотеки и заверши их.",
    type: "weekly",
    metric: "materials",
    target: 3,
    progress: 0,
    reward: XP_REWARDS.weeklyGoal,
    periodId: getGoalPeriodId("weekly"),
    completed: false,
  },
];

export const defaultGamification = {
  totalPoints: 0,
  xp: 0,
  level: 1,
  streakCount: 0,
  lastActivityDate: null,
  completedTestsCount: 0,
  completedMaterialsCount: 0,
  achievements: [],
  communityPosts: 0,
  communityAnswers: 0,
  communityBestAnswers: 0,
  communityMessages: 0,
  goals: baseGoals(),
};

const save = (userId, data) => {
  if (!userId) return;
  localStorage.setItem(`${baseKey}${userId}`, JSON.stringify(data));
};

const resolveLevelThreshold = (level) => {
  if (level - 1 < levelThresholds.length) return levelThresholds[level - 1];
  const extraLevel = level - levelThresholds.length;
  return levelThresholds[levelThresholds.length - 1] + extraLevel * extraLevelStep;
};

export const getLevelFromXP = (xp = 0) => {
  let level = 1;
  for (let i = levelThresholds.length - 1; i >= 0; i -= 1) {
    if (xp >= levelThresholds[i]) {
      level = i + 1;
      break;
    }
  }
  if (xp >= levelThresholds[levelThresholds.length - 1]) {
    const extra = Math.max(0, xp - levelThresholds[levelThresholds.length - 1]);
    level = levelThresholds.length + Math.floor(extra / extraLevelStep);
  }
  const currentBase = resolveLevelThreshold(level);
  const nextBase = resolveLevelThreshold(level + 1);
  const progress = Math.min(100, Math.round(((xp - currentBase) / (nextBase - currentBase)) * 100));
  return { level, currentBase, nextBase, progress, toNext: Math.max(0, nextBase - xp) };
};

export const getLevelFromPoints = (points = 0) => getLevelFromXP(points);

export const getRoleFromLevel = (level = 1) => {
  if (level >= 7) return "Ментор";
  if (level >= 4) return "Создатель";
  return "Новичок";
};

export const getStatusByPoints = (points = 0) => getRoleFromLevel(getLevelFromXP(points).level);

export const progressToNextStatus = (points = 0) => {
  const currentLevel = getLevelFromXP(points).level;
  const currentRole = getRoleFromLevel(currentLevel);
  const nextRole = getRoleFromLevel(currentLevel + 1);
  const nextRoleLevel = nextRole === currentRole ? currentLevel + 1 : currentLevel + 1;
  const currentBase = resolveLevelThreshold(currentLevel);
  const nextBase = resolveLevelThreshold(nextRoleLevel);
  const gained = points - currentBase;
  const range = nextBase - currentBase;
  const progress = Math.min(100, Math.round((gained / range) * 100));
  return { current: currentRole, next: nextRole, progress };
};

const ensureGoals = (storedGoals = []) => {
  const defaults = baseGoals();
  return defaults.map((goal) => {
    const existing = storedGoals.find((g) => g.id === goal.id && g.type === goal.type);
    if (!existing) return goal;
    const expectedPeriod = getGoalPeriodId(goal.type);
    const resetNeeded = existing.periodId !== expectedPeriod;
    return {
      ...goal,
      ...existing,
      progress: resetNeeded ? 0 : existing.progress || 0,
      completed: resetNeeded ? false : Boolean(existing.completed),
      periodId: resetNeeded ? expectedPeriod : existing.periodId || expectedPeriod,
    };
  });
};

const registerActivityDay = (gamification) => {
  const base = gamification || {};
  const today = todayISO();
  if (base.lastActivityDate === today) return base;
  const updatedCount = base.lastActivityDate === yesterdayISO() ? (base.streakCount || 0) + 1 : 1;
  return { ...base, streakCount: updatedCount, lastActivityDate: today };
};

const achievementsList = [
  { id: "first-test", title: "Первый тест", check: (g) => g.completedTestsCount >= 1 },
  { id: "tests-3", title: "3 теста подряд", check: (g) => g.completedTestsCount >= 3 },
  { id: "materials-5", title: "5 материалов", check: (g) => g.completedMaterialsCount >= 5 },
  { id: "points-100", title: "100 очков", check: (g) => g.totalPoints >= 100 },
  { id: "points-300", title: "300 очков", check: (g) => g.totalPoints >= 300 },
  { id: "community-first-post", title: "Первый пост в сообществе", check: (g) => g.communityPosts >= 1 },
  { id: "community-5-answers", title: "5 ответов в сообществе", check: (g) => g.communityAnswers >= 5 },
  { id: "community-3-best", title: "3 лучших ответа", check: (g) => g.communityBestAnswers >= 3 },
  { id: "community-10-messages", title: "10 сообщений в чатах", check: (g) => g.communityMessages >= 10 },
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

const hydrate = (gamification) => {
  const base = { ...defaultGamification, ...(gamification || {}) };
  const withGoals = { ...base, goals: ensureGoals(base.goals) };
  const aligned = {
    ...withGoals,
    streakCount: withGoals.streakCount || withGoals.streak || 0,
    xp: withGoals.xp ?? withGoals.totalPoints ?? 0,
    totalPoints: withGoals.totalPoints ?? withGoals.xp ?? 0,
  };
  const levelInfo = getLevelFromXP(aligned.totalPoints);
  return { ...aligned, level: levelInfo.level };
};

export const loadGamification = (userId) => {
  if (!userId) return hydrate();
  try {
    const raw = localStorage.getItem(`${baseKey}${userId}`);
    if (!raw) return hydrate();
    return hydrate(JSON.parse(raw));
  } catch (e) {
    console.error("load gamification", e);
    return hydrate();
  }
};

const saveAndReturn = (userId, payload) => {
  save(userId, payload);
  return payload;
};

const applyGoalProgress = (goals, progress = {}) => {
  const hydrated = ensureGoals(goals);
  const updates = [];
  const updatedGoals = hydrated.map((goal) => {
    const periodId = getGoalPeriodId(goal.type);
    const resetNeeded = goal.periodId !== periodId;
    const baseProgress = resetNeeded ? 0 : goal.progress || 0;
    let delta = 0;
    switch (goal.metric) {
      case "materials":
        delta = progress.materialsCompleted || 0;
        break;
      case "tests":
        delta = progress.testsCompleted || 0;
        break;
      case "xp":
        delta = progress.xpDelta || 0;
        break;
      case "actions":
        delta = progress.actions || 0;
        break;
      default:
        delta = 0;
    }
    const newProgress = Math.min(goal.target, baseProgress + delta);
    const wasCompleted = resetNeeded ? false : goal.completed;
    const becameCompleted = !wasCompleted && newProgress >= goal.target;
    if (becameCompleted) {
      updates.push({ ...goal, progress: newProgress, periodId, reward: goal.reward });
    }
    return {
      ...goal,
      progress: newProgress,
      completed: wasCompleted || newProgress >= goal.target,
      periodId,
    };
  });
  return { goals: updatedGoals, completed: updates };
};

const applyDefaults = (gamification) => hydrate(gamification);

const baseMessages = {
  material_completed: `+${XP_REWARDS.materialCompleted} XP за материал`,
  test_completed: `+${XP_REWARDS.testCompleted} XP за тест`,
  inline_quiz: `+${XP_REWARDS.inlineQuiz} XP за проверку себя`,
  mission_completed: `+${XP_REWARDS.missionCompleted} XP за задание`,
  community_answer: `+${XP_REWARDS.communityAnswer} XP за помощь в сообществе`,
  community_best: `+${XP_REWARDS.communityBestAnswer} XP за лучший ответ`,
  mindgame_logic: "+XP за логическую игру",
  mindgame_finance: "+XP за финансовую игру",
};

export const applyGamificationEvent = (userId, current, event = {}) => {
  const base = applyDefaults(current);
  const { type, amount = 0, progress = {}, label } = event;
  const goalResult = applyGoalProgress(base.goals, { ...progress, xpDelta: amount });
  const baseXp = amount + goalResult.completed.reduce((sum, g) => sum + (g.reward || 0), 0);
  const updated = registerActivityDay({
    ...base,
    totalPoints: base.totalPoints + baseXp,
    xp: base.totalPoints + baseXp,
    completedMaterialsCount: base.completedMaterialsCount + (progress.materialsCompleted || 0),
    completedTestsCount: base.completedTestsCount + (progress.testsCompleted || 0),
    communityAnswers: base.communityAnswers + (progress.answers || 0),
    communityBestAnswers: base.communityBestAnswers + (progress.bestAnswers || 0),
    goals: goalResult.goals,
  });

  const { achievements, newly } = evaluateAchievements(updated);
  const levelInfo = getLevelFromXP(updated.totalPoints);
  const result = saveAndReturn(userId, {
    ...updated,
    achievements,
    level: levelInfo.level,
  });

  const messages = [label || baseMessages[type] || `+${amount} XP`];
  if (goalResult.completed.length) {
    goalResult.completed.forEach((g) => {
      messages.push(`Цель «${g.title}» выполнена: +${g.reward} XP`);
    });
  }
  newly.forEach((n) => messages.push(`Новая награда: "${n}"`));

  return { gamification: result, messages, goalCompletions: goalResult.completed };
};

export const awardForMaterial = (userId, current) =>
  applyGamificationEvent(userId, current, {
    type: "material_completed",
    amount: XP_REWARDS.materialCompleted,
    progress: { materialsCompleted: 1, actions: 1 },
  });

export const awardForTest = (userId, current) =>
  applyGamificationEvent(userId, current, {
    type: "test_completed",
    amount: XP_REWARDS.testCompleted,
    progress: { testsCompleted: 1, actions: 1 },
  });

export const awardForCommunityAction = (userId, current, action = {}) => {
  if (action.type === "best-answer") {
    return applyGamificationEvent(userId, current, {
      type: "community_best",
      amount: XP_REWARDS.communityBestAnswer,
      progress: { bestAnswers: 1, actions: 1 },
    });
  }
  return applyGamificationEvent(userId, current, {
    type: "community_answer",
    amount: action.type === "answer" ? XP_REWARDS.communityAnswer : XP_REWARDS.communityAnswer,
    progress: { answers: 1, actions: 1 },
  });
};

export const awardForInlineQuiz = (userId, current, amount = XP_REWARDS.inlineQuiz) =>
  applyGamificationEvent(userId, current, {
    type: "inline_quiz",
    amount,
    progress: { actions: 1 },
  });

export const awardForMission = (userId, current, amount = XP_REWARDS.missionCompleted) =>
  applyGamificationEvent(userId, current, {
    type: "mission_completed",
    amount,
    progress: { actions: 1 },
  });

export const awardForMindGame = (userId, current, amount = 0, meta = {}) =>
  applyGamificationEvent(userId, current, {
    type: meta.gameId === "finance" ? "mindgame_finance" : "mindgame_logic",
    amount,
    progress: { actions: 1 },
    label: meta.label,
  });

export const getXPRewards = () => XP_REWARDS;

export const getXPConfig = () => XP_REWARDS;
