import { articles, courses, tests } from "./data";

const themeMap = {
  entrepreneurship: "mindset",
  finance: "finance",
  communication: "communication",
  leadership: "entrepreneur_skills",
  efficiency: "productivity",
};

export const themeLabels = {
  mindset: { title: "Майндсет предпринимателя", accent: "#7c3aed" },
  finance: { title: "Финансовое мышление", accent: "#0ea5e9" },
  entrepreneur_skills: { title: "Навыки предпринимателя", accent: "#22c55e" },
  communication: { title: "Коммуникации и продажи", accent: "#a855f7" },
  productivity: { title: "Продуктивность и устойчивость", accent: "#f97316" },
};

export const materialThemes = [
  {
    id: "mindset",
    title: "Майндсет предпринимателя",
    description: "Мышление создателя: видеть возможности, работать с риском и ошибками.",
  },
  {
    id: "finance",
    title: "Финансовое мышление",
    description: "Понимать деньги, считать прибыль и управлять личными финансами.",
  },
  {
    id: "entrepreneur_skills",
    title: "Навыки предпринимателя",
    description: "Продажи, переговоры, команда и сервис в одном наборе навыков.",
  },
  {
    id: "communication",
    title: "Коммуникации и продвижение",
    description: "Публичные выступления, бренд и умение договариваться.",
  },
  {
    id: "productivity",
    title: "Личная эффективность",
    description: "Энергия, дисциплина и устойчивость к стрессу.",
  },
];

const baseEstimatedTime = (type) => {
  if (type === "course") return "40–60 минут";
  if (type === "article") return "10–15 минут";
  return "7–10 минут";
};

export const materials = [
  ...courses.map((course) => ({
    ...course,
    type: "course",
    theme: themeMap[course.theme] || "mindset",
    estimatedTime: course.duration || baseEstimatedTime("course"),
    level: course.difficulty || "средний",
  })),
  ...articles.map((article) => ({
    ...article,
    type: "article",
    theme: themeMap[article.theme] || "mindset",
    estimatedTime: baseEstimatedTime("article"),
    level: "начальный",
  })),
  ...tests.map((test) => ({
    ...test,
    type: "test",
    theme: themeMap[test.theme] || "mindset",
    estimatedTime: baseEstimatedTime("test"),
    level: "базовый",
  })),
];

export const materialIndex = Object.fromEntries(materials.map((m) => [m.id, m]));

export const learningPaths = [
  {
    id: "path-mindset",
    title: "Майндсет предпринимателя",
    slug: "mindset",
    description: "Учимся видеть возможности, ставить смелые цели и идти через эксперименты.",
    theme: "mindset",
    recommendedProfileTypes: ["Будущий основатель бизнеса"],
    materials: [
      "course-entrepreneur-basic",
      "article-entrepreneur-mind",
      "test-entrepreneur-thinking",
      "course-30-days",
      "article-risk",
      "course-mindset",
      "test-creativity",
      "article-marketing",
    ],
  },
  {
    id: "path-finance",
    title: "Финансовое мышление",
    slug: "finance",
    description: "Считаем деньги проекта и личные финансы, чтобы принимать осознанные решения.",
    theme: "finance",
    recommendedProfileTypes: ["Исследователь и стратег"],
    materials: [
      "course-finance",
      "article-finance",
      "test-finance-basics",
      "article-productivity",
      "course-entrepreneur-basic",
      "article-psychology",
      "test-habits",
    ],
  },
  {
    id: "path-skills",
    title: "Навыки предпринимателя",
    slug: "skills",
    description: "Продажи, переговоры, команда и сервис — то, что двигает любой проект.",
    theme: "entrepreneur_skills",
    recommendedProfileTypes: ["Будущий основатель бизнеса", "Лидер команды и коммуникатор"],
    materials: [
      "course-sales",
      "article-sales",
      "test-communication",
      "course-presentations",
      "article-networking",
      "article-service",
      "course-business-games",
      "test-brand",
    ],
  },
  {
    id: "path-communication",
    title: "Коммуникации и бренд",
    slug: "communication",
    description: "Учимся выступать, строить личный бренд и доносить ценность продукта.",
    theme: "communication",
    recommendedProfileTypes: ["Лидер команды и коммуникатор"],
    materials: [
      "course-presentations",
      "article-brand",
      "test-brand",
      "article-service",
      "article-networking",
      "course-sales",
    ],
  },
  {
    id: "path-productivity",
    title: "Личная эффективность",
    slug: "productivity",
    description: "Фокус, энергия и устойчивость — чтобы не сгореть на длинной дистанции.",
    theme: "productivity",
    recommendedProfileTypes: ["Исследователь и стратег"],
    materials: [
      "course-mindfulness",
      "article-psychology",
      "test-discipline",
      "article-productivity",
      "test-habits",
    ],
  },
];

export const getMaterialById = (id) => materialIndex[id];

