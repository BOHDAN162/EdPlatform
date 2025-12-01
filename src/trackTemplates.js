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
