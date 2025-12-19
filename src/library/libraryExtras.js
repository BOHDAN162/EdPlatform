export const summaries = [
  {
    id: "summary-atomic",
    title: "Атомные привычки",
    description: "Как строить маленькие шаги и менять поведение навсегда.",
    author: "Джеймс Клир",
    to: "/library/article/article-habits",
  },
  {
    id: "summary-influence",
    title: "Психология влияния",
    description: "Триггеры доверия, авторитет и социальное доказательство.",
    author: "Р. Чалдини",
    to: "/library/article/article-communication",
  },
  {
    id: "summary-rework",
    title: "Rework",
    description: "Лаконичные принципы запуска продукта без лишнего шума.",
    author: "37signals",
    to: "/library/article/article-entrepreneur-mind",
  },
];

export const cases = [
  {
    id: "case-sales",
    title: "Кейс: рост продаж",
    description: "Как подростковый мерч вырос x3 за месяц",
    level: "средний",
    to: "/library/article/article-sales",
  },
  {
    id: "case-launch",
    title: "Кейс: запуск продукта",
    description: "Собрали MVP за неделю и получили первых юзеров.",
    level: "средний",
    to: "/library/article/article-entrepreneur-mind",
  },
];

export const testStats = {
  "test-finance-basics": {
    difficulty: "средний",
    rewardXp: 40,
    attemptsCount: 3,
    lastScore: { correct: 8, total: 10 },
  },
  "test-habits": {
    difficulty: "легкий",
    rewardXp: 20,
    attemptsCount: 5,
    lastScore: { correct: 7, total: 10 },
  },
  "test-entrepreneur-thinking": {
    difficulty: "сложный",
    rewardXp: 50,
    attemptsCount: 2,
    lastScore: { correct: 9, total: 10 },
  },
  "test-communication": {
    difficulty: "средний",
    rewardXp: 30,
    attemptsCount: 1,
    lastScore: { correct: 8, total: 10 },
  },
};

export const mindGameLeaders = {
  logic: [
    { id: "anya", name: "Аня", score: "9/10", city: "онлайн" },
    { id: "ilya", name: "Илья", score: "8/10", city: "СПб" },
    { id: "masha", name: "Маша", score: "7/10", city: "Мск" },
  ],
  finance: [
    { id: "pasha", name: "Паша", score: "95%", city: "Мск" },
    { id: "lera", name: "Лера", score: "90%", city: "онлайн" },
    { id: "tim", name: "Тим", score: "88%", city: "Казань" },
  ],
};

export const checklists = [
  {
    id: "discipline-week",
    title: "Дисциплина недели",
    topic: "продуктивность",
    time: "15 минут",
    link: "/missions",
    steps: [
      { id: "d1", title: "Поставь 1 цель на день", hint: "Запиши в заметку" },
      { id: "d2", title: "Отключи уведомления", hint: "60 минут тишины" },
      { id: "d3", title: "Спринт 20 минут", hint: "Поработай без отвлечений" },
      { id: "d4", title: "Мини-отдых", hint: "Размяться 5 минут" },
      { id: "d5", title: "Отметь результат", hint: "Заполни трекер" },
    ],
  },
  {
    id: "pitch-check",
    title: "Питч проекта",
    topic: "коммуникации",
    time: "12 минут",
    link: "/missions",
    steps: [
      { id: "p1", title: "Крючок", hint: "1 фраза про проблему" },
      { id: "p2", title: "Решение", hint: "Как ты закрываешь боль" },
      { id: "p3", title: "Доказательства", hint: "цифра/пример" },
      { id: "p4", title: "Призыв", hint: "Что попросишь у слушателя" },
      { id: "p5", title: "Тренировка", hint: "Запиши питч на видео" },
    ],
  },
];

export const programs = [
  {
    id: "deep-mindset",
    title: "Глубокое мышление создателя",
    description: "6 недель практики: эксперименты, разборы, поддержка наставника.",
    format: "6 недель · 6 модулей",
    topics: ["мышление", "эксперименты", "обратная связь"],
    details:
      "Подходит тем, кто хочет довести идею до первых пользователей. Внутри еженедельные спринты, групповые сессии и разборы кейсов.",
    slotsTotal: 20,
    slotsLeft: 7,
  },
  {
    id: "deep-communication",
    title: "Коммуникации и публичные выступления",
    description: "Практика сторителлинга, питчей и уверенного общения.",
    format: "4 недели · воркшопы",
    topics: ["коммуникации", "сторителлинг", "питч"],
    details: "Тренируемся на реальных сценариях: питч проекта, презентация, ответы на вопросы аудитории.",
    slotsTotal: 15,
    slotsLeft: 5,
  },
];
