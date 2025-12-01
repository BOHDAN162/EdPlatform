import { getMaterialById } from "./libraryData";

export const archetypes = {
  founder: {
    title: "Будущий основатель бизнеса",
    description:
      "Ты хочешь запускать свои идеи, проверять их на практике и зарабатывать на созданном. Ты не боишься риска и ценишь свободу действий.",
    summary: [
      "Сильная инициатива и желание запускать проекты",
      "Учишься считать риски и деньги",
      "Важно держать ритм и доводить до результата",
    ],
    strengths: [
      "Смелость и готовность тестировать гипотезы",
      "Гибкость в решениях и быстрые итерации",
      "Умение заражать идеей и вести за собой",
      "Ориентация на результат и практику",
    ],
    comparison: [
      "Ты похож на ребят, которые запускают свои проекты и любят пробовать новое.",
      "Ты опережаешь многих по смелости и готовности действовать сразу.",
    ],
    avatarMood: "spark",
  },
  strategist: {
    title: "Исследователь и стратег",
    description:
      "Тебе нравится разбираться в цифрах, планах и системах. Ты видишь картину целиком и хочешь принимать решения на данных.",
    summary: [
      "Любишь аналитику и планирование",
      "Развиваешь финансовое мышление",
      "Ценишь порядок, расписания и чёткие чекпоинты",
    ],
    strengths: [
      "Сильное структурное мышление",
      "Умение считать риски и ресурсы",
      "Тяга к исследованиям и проверке идей",
      "Аккуратность в планах и дедлайнах",
    ],
    comparison: [
      "Ты похож на тех, кто видит систему там, где другие видят хаос.",
      "Ты опережаешь многих по вниманию к цифрам и дисциплине.",
    ],
    avatarMood: "focus",
  },
  leader: {
    title: "Командный игрок и коммуникатор",
    description:
      "Твоя сила — в людях: договариваться, вдохновлять, помогать команде. Ты хочешь уверенно вести переговоры и выступать.",
    summary: [
      "Сильные коммуникации и поддержка команды",
      "Хочешь лучше вести переговоры и выступать",
      "Важно прокачать эмоциональный интеллект и сервис",
    ],
    strengths: [
      "Эмпатия и чувство атмосферы",
      "Умение вдохновлять и удерживать команду",
      "Смелость в публичных выступлениях",
      "Способность решать конфликты мягко и быстро",
    ],
    comparison: [
      "Ты похож на тех, кто собирает вокруг себя людей и умеет зажигать.",
      "Ты опережаешь многих по навыкам переговоров и поддержке команды.",
    ],
    avatarMood: "friendly",
  },
  creator: {
    title: "Создатель проектов",
    description:
      "Ты любишь собирать рабочие прототипы и показывать результат. Тебе важно доводить задумки до готового продукта и учиться на практике.",
    summary: [
      "Фокус на сборке и тестировании решений",
      "Ценишь понятные чек-листы и дедлайны",
      "Хочешь быстрее переходить от идеи к демо",
    ],
    strengths: [
      "Практичность и умение быстро собирать решения",
      "Любовь к тестированию и улучшениям",
      "Внимание к инструментам и процессу",
      "Готовность учиться на реальных задачах",
    ],
    comparison: [
      "Ты похож на тех, кто предпочитает показывать, а не рассказывать.",
      "Ты опережаешь многих по скорости сборки прототипов.",
    ],
    avatarMood: "build",
  },
};

export const trackTemplates = {
  founder: [
    { materialType: "course", materialId: "course-entrepreneur-basic" },
    { materialType: "article", materialId: "article-entrepreneur-mind" },
    { materialType: "test", materialId: "test-entrepreneur-thinking" },
    { materialType: "course", materialId: "course-30-days" },
    { materialType: "article", materialId: "article-risk" },
    { materialType: "course", materialId: "course-sales" },
    { materialType: "article", materialId: "article-marketing" },
    { materialType: "test", materialId: "test-communication" },
    { materialType: "article", materialId: "article-service" },
    { materialType: "test", materialId: "test-brand" },
  ],
  strategist: [
    { materialType: "course", materialId: "course-finance" },
    { materialType: "test", materialId: "test-finance-basics" },
    { materialType: "article", materialId: "article-productivity" },
    { materialType: "article", materialId: "article-risk" },
    { materialType: "course", materialId: "course-mindset" },
    { materialType: "article", materialId: "article-entrepreneur-mind" },
    { materialType: "course", materialId: "course-soft-skills" },
    { materialType: "test", materialId: "test-creativity" },
    { materialType: "course", materialId: "course-business-games" },
    { materialType: "article", materialId: "article-service" },
  ],
  leader: [
    { materialType: "course", materialId: "course-leadership" },
    { materialType: "article", materialId: "article-team" },
    { materialType: "test", materialId: "test-leadership" },
    { materialType: "article", materialId: "article-ei" },
    { materialType: "course", materialId: "course-presentations" },
    { materialType: "test", materialId: "test-communication" },
    { materialType: "article", materialId: "article-networking" },
    { materialType: "course", materialId: "course-mindfulness" },
    { materialType: "test", materialId: "test-ethics" },
    { materialType: "article", materialId: "article-brand" },
  ],
  creator: [
    { materialType: "course", materialId: "course-entrepreneur-basic" },
    { materialType: "course", materialId: "course-soft-skills" },
    { materialType: "article", materialId: "article-productivity" },
    { materialType: "course", materialId: "course-business-games" },
    { materialType: "article", materialId: "article-psychology" },
    { materialType: "test", materialId: "test-habits" },
    { materialType: "course", materialId: "course-30-days" },
    { materialType: "article", materialId: "article-networking" },
    { materialType: "test", materialId: "test-discipline" },
    { materialType: "article", materialId: "article-brand" },
  ],
};

const trackStepMeta = [
  { title: "Старт и осознанность", description: "Фиксируем отправную точку и настраиваем фокус: что важно тебе, чего хочешь добиться и как измерить прогресс." },
  { title: "Мышление", description: "Разбираемся, как мыслить шире: привычки предпринимателя, работа с ошибками и гибкость решений." },
  { title: "Финансы", description: "Учимся считать деньги, понимать маржу и планировать бюджет, чтобы идеи окупались." },
  { title: "Коммуникации", description: "Тренируем переговоры и умение доносить ценность — без волнения и с чётким месседжем." },
  { title: "Проекты", description: "Собираем первые мини-проекты, ставим дедлайны и проверяем гипотезы на практике." },
  { title: "Самоорганизация", description: "Выстраиваем ритм, привычки и чек-листы, чтобы держать темп и не срываться." },
  { title: "Лидерство", description: "Прокачиваем умение вести за собой, давать обратную связь и принимать решения." },
  { title: "Команда", description: "Учимся распределять роли, поддерживать атмосферу и договариваться без конфликтов." },
  { title: "Эксперименты", description: "Добавляем смелые тесты, собираем обратную связь и быстро улучшаем продукт." },
  { title: "Рефлексия", description: "Подводим итоги, фиксируем инсайты и планируем следующий виток роста." },
];

export const buildProfileResult = (archetypeKey) => {
  const profile = archetypes[archetypeKey] || archetypes.founder;
  return {
    profileKey: archetypeKey,
    profileType: profile.title,
    summary: profile.description,
    strengths: profile.strengths || profile.summary,
    comparison: profile.comparison || [],
    avatarMood: profile.avatarMood || "spark",
  };
};

export const buildDevelopmentTrack = (archetypeKey, materials = []) => {
  const template = trackTemplates[archetypeKey] || trackTemplates.founder;
  const profileResult = buildProfileResult(archetypeKey);
  const materialIndex = Object.fromEntries((materials || []).map((m) => [m.id, m]));

  const steps = template.map((entry, idx) => {
    const material = materialIndex[entry.materialId] || getMaterialById(entry.materialId) || {};
    const meta = trackStepMeta[idx] || {};
    return {
      id: `${archetypeKey}-${idx + 1}`,
      order: idx + 1,
      orderIndex: idx + 1,
      materialId: entry.materialId,
      materialType: entry.materialType,
      title: meta.title || material.title || "Шаг трека",
      shortTitle: meta.title || material.title || "Шаг",
      description:
        meta.description ||
        "Что ты прокачаешь на этом этапе: чёткие навыки, практика и уверенность в реальных задачах.",
      materials: [entry.materialId],
      status: "not-started",
      materialTitle: material.title,
      estimatedTime: material.estimatedTime,
      theme: material.theme,
    };
  });

  return {
    profileKey: archetypeKey,
    profileType: profileResult.profileType,
    trackTitle: `Твой путь — ${profileResult.profileType}`,
    generatedTrack: steps,
    trackSteps: steps,
    completedStepIds: [],
    profileResult,
    updatedAt: new Date().toISOString(),
  };
};

export const buildPersonalTrack = (archetypeKey, materials = []) => {
  const template = trackTemplates[archetypeKey] || [];
  const materialIndex = Object.fromEntries((materials || []).map((m) => [m.id, m]));
  const steps = template.map((entry, idx) => {
    const material = materialIndex[entry.materialId] || getMaterialById(entry.materialId) || {};
    return {
      id: `${archetypeKey}-${idx + 1}`,
      order: idx + 1,
      materialId: entry.materialId,
      materialType: entry.materialType,
      title: material.title || "Материал",
      estimatedTime: material.estimatedTime,
    };
  });
  const profile = archetypes[archetypeKey] || archetypes.founder;
  return {
    profileKey: archetypeKey,
    profileType: profile.title,
    description: profile.description,
    summary: profile.summary,
    trackTitle: `Стартовый трек — ${profile.title}`,
    generatedTrack: steps,
    completedStepIds: [],
  };
};
