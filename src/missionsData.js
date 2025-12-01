import { getMaterialById } from "./libraryData";

export const missions = [
  {
    id: "mission-focus-week",
    title: "Фокус-неделя",
    description: "Собери короткую серию шагов: теория + практика + мини-рефлексия, чтобы не сбиться с курса.",
    type: "short",
    theme: "mindset",
    difficulty: "Лёгкая",
    estimatedTime: "30–60 минут",
    xpReward: 60,
    steps: [
      { id: "step-material-focus", title: "Пройди материал о фокусе", description: "Перечитай ключевые идеи и отметь конспект.", materialId: "article-productivity" },
      { id: "step-reflection", title: "Запиши 3 отвлечения", description: "Выпиши, что чаще всего сбивает тебя с режима, и придумай страховку." },
      { id: "step-action", title: "Сделай один блок работы", description: "Выбери задачу на 25 минут и доведи до конца." },
    ],
  },
  {
    id: "mission-finance-start",
    title: "Финансовый старт",
    description: "Разобраться с базовыми понятиями и посчитать простейший личный бюджет.",
    type: "short",
    theme: "finance",
    difficulty: "Средняя",
    estimatedTime: "50–70 минут",
    xpReward: 80,
    steps: [
      { id: "step-material-finance", title: "Открой урок про финансы", description: "Посмотри базовые принципы учёта.", materialId: "article-finance" },
      { id: "step-calc", title: "Посчитай расходы", description: "Составь список регулярных трат и сравни с доходами." },
      { id: "step-test", title: "Ответь на мини-квиз", description: "Убедись, что понял ключевые идеи." },
    ],
  },
  {
    id: "mission-mini-project",
    title: "Мини-проект за 2 недели",
    description: "Выбери идею и доведи её до первых отзывов.",
    type: "project",
    theme: "entrepreneur_skills",
    difficulty: "Сложная",
    estimatedTime: "1–2 недели",
    xpReward: 180,
    steps: [
      { id: "step-idea", title: "Выбери идею", description: "Оценка пользы и простоты запуска." },
      { id: "step-material-sales", title: "Пройди урок по продажам", description: "Собери базу, как говорить с людьми.", materialId: "course-sales" },
      { id: "step-prototype", title: "Сделай прототип", description: "Собери простую версию и покажи 3 людям." },
      { id: "step-feedback", title: "Собери фидбек", description: "Запиши 5 наблюдений и выбери следующее действие." },
    ],
  },
  {
    id: "mission-public-speaking",
    title: "Презентация без страха",
    description: "Подготовь короткое выступление и прогон с другом.",
    type: "short",
    theme: "communication",
    difficulty: "Средняя",
    estimatedTime: "40–60 минут",
    xpReward: 70,
    steps: [
      { id: "step-material-present", title: "Пройди урок по презентациям", description: "Основа структуры и сторителлинга.", materialId: "course-presentations" },
      { id: "step-script", title: "Собери скрипт", description: "5–7 слайдов, где есть проблема, решение, выгода." },
      { id: "step-rehearsal", title: "Прогон с другом", description: "Получить 2–3 честных комментария." },
    ],
  },
  {
    id: "mission-career-map",
    title: "Карта целей",
    description: "Нарисуй, куда хочешь прийти за 6 месяцев, и выбери микро-цели.",
    type: "project",
    theme: "mindset",
    difficulty: "Средняя",
    estimatedTime: "1 неделя",
    xpReward: 120,
    steps: [
      { id: "step-vision", title: "Определи точку Б", description: "Что хочешь уметь и иметь через полгода?" },
      { id: "step-material-mindset", title: "Перечитай про мышление", description: "Запомни 3 принципа, которые будешь держать в голове.", materialId: "course-mindset" },
      { id: "step-roadmap", title: "Собери дорожку", description: "3–5 шагов с материалами и практиками." },
    ],
  },
  {
    id: "mission-network",
    title: "Нетворкинг челлендж",
    description: "Познакомься с новыми людьми и расскажи про свой проект.",
    type: "short",
    theme: "communication",
    difficulty: "Лёгкая",
    estimatedTime: "45–60 минут",
    xpReward: 65,
    steps: [
      { id: "step-material-networking", title: "Освежи теорию", description: "Быстро перечитай про нетворкинг.", materialId: "article-networking" },
      { id: "step-outreach", title: "Два контакта", description: "Напиши двум людям с конкретным вопросом." },
      { id: "step-share", title: "Поделись выводами", description: "Запости короткий вывод в сообществе или заметке." },
    ],
  },
];

const baseState = { missions: {}, notes: {} };

const resolveKey = (userId) => `ep_missions_${userId || "guest"}`;

export const loadMissionsState = (userId) => {
  try {
    const raw = localStorage.getItem(resolveKey(userId));
    if (!raw) return { ...baseState };
    const parsed = JSON.parse(raw);
    return { ...baseState, ...parsed, missions: parsed.missions || {} };
  } catch (e) {
    console.error("load missions", e);
    return { ...baseState };
  }
};

export const saveMissionsState = (userId, state) => {
  localStorage.setItem(resolveKey(userId), JSON.stringify(state));
  return state;
};

const ensureMissionEntry = (state, missionId) => {
  const existing = state.missions[missionId];
  if (existing) return state;
  return {
    ...state,
    missions: {
      ...state.missions,
      [missionId]: { status: "not_started", steps: [], startedAt: null, completedAt: null },
    },
  };
};

export const setMissionStatus = (state, missionId, status) => {
  const base = ensureMissionEntry(state, missionId);
  const missionState = base.missions[missionId];
  return {
    ...base,
    missions: {
      ...base.missions,
      [missionId]: {
        ...missionState,
        status,
        startedAt: status === "in_progress" && !missionState.startedAt ? new Date().toISOString() : missionState.startedAt,
        completedAt: status === "completed" ? new Date().toISOString() : missionState.completedAt,
      },
    },
  };
};

export const toggleMissionStep = (state, missionId, stepId) => {
  const base = ensureMissionEntry(state, missionId);
  const missionState = base.missions[missionId];
  const set = new Set(missionState.steps || []);
  if (set.has(stepId)) {
    set.delete(stepId);
  } else {
    set.add(stepId);
  }
  return {
    ...base,
    missions: {
      ...base.missions,
      [missionId]: { ...missionState, steps: Array.from(set) },
    },
  };
};

export const setMissionNotes = (state, missionId, text) => ({
  ...ensureMissionEntry(state, missionId),
  notes: { ...state.notes, [missionId]: text },
});

export const getMissionProgress = (mission, missionState) => {
  const state = missionState?.missions?.[mission.id] || { status: "not_started", steps: [] };
  const total = mission.steps?.length || 0;
  const done = state.steps?.length || 0;
  return {
    status: state.status || "not_started",
    totalSteps: total,
    completedSteps: done,
    steps: state.steps || [],
    startedAt: state.startedAt,
    completedAt: state.completedAt,
  };
};

export const getMissionById = (missionId) => missions.find((m) => m.id === missionId);

export const missionThemeLabel = (theme) => ({
  mindset: "Мышление",
  finance: "Финансы",
  communication: "Коммуникация",
  entrepreneur_skills: "Навыки",
}[theme] || "Развитие");

export const linkToMaterial = (materialId) => {
  const material = getMaterialById(materialId);
  if (!material) return null;
  return {
    id: material.id,
    title: material.title,
    type: material.type,
    time: material.estimatedTime,
  };
};

