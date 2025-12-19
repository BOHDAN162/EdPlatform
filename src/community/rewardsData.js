export const avatarRewards = [
  {
    id: "avatar-mentor",
    title: "Ментор",
    description: "10 полезных ответов",
    icon: "🧠",
    unlocked: true,
    requirement: "10 полезных ответов",
  },
  {
    id: "avatar-creator",
    title: "Создатель",
    description: "10000 XP в сообществе",
    icon: "🎨",
    unlocked: false,
    requirement: "10 000 XP",
  },
  {
    id: "avatar-speedrunner",
    title: "Спринтер",
    description: "Streak 7 дней",
    icon: "⚡",
    unlocked: false,
    requirement: "7 дней подряд",
  },
];

export const skinRewards = [
  {
    id: "skin-neon",
    title: "Неон",
    description: "Закрой 8 материалов за неделю",
    icon: "🌌",
    unlocked: true,
    requirement: "8 материалов за неделю",
  },
  {
    id: "skin-mint",
    title: "Mint",
    description: "50 полезных голосов",
    icon: "🍃",
    unlocked: false,
    requirement: "50 лайков за ответы",
  },
  {
    id: "skin-gold",
    title: "Gold",
    description: "Лидер недели",
    icon: "🥇",
    unlocked: false,
    requirement: "Топ-1 недели",
  },
];

export const statusRewards = [
  {
    id: "status-helper",
    title: "Помогатор",
    description: "+10 XP за полезный ответ",
    icon: "🤝",
    unlocked: true,
    requirement: "5 лучших ответов",
  },
  {
    id: "status-mentor",
    title: "Ментор",
    description: "Куратор ветки вопросов",
    icon: "🛡️",
    unlocked: false,
    requirement: "20 полезных ответов",
  },
  {
    id: "status-creator",
    title: "Создатель",
    description: "Делится гайдами",
    icon: "🚀",
    unlocked: true,
    requirement: "3 гида за месяц",
  },
];

export const medalRewards = [
  {
    id: "medal-week",
    title: "Лидер недели",
    description: "+120 XP за топ-3",
    icon: "🏅",
    unlocked: true,
    period: "неделя",
    requirement: "Топ-3 недели",
  },
  {
    id: "medal-month",
    title: "Награда месяца",
    description: "Лучший студент",
    icon: "🌟",
    unlocked: false,
    period: "месяц",
    requirement: "15 закрытых материалов",
  },
  {
    id: "medal-answer",
    title: "Гуру ответов",
    description: "за лучшие ответы",
    icon: "💬",
    unlocked: true,
    period: "сезон",
    requirement: "10 лучших ответов",
  },
  {
    id: "medal-streak",
    title: "Серия",
    description: "Streak 30 дней",
    icon: "🔥",
    unlocked: false,
    period: "сезон",
    requirement: "30 дней активности",
  },
];
