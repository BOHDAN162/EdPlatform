export const themes = [
  { id: "entrepreneurship", title: "Предпринимательское мышление" },
  { id: "finance", title: "Финансы и деньги" },
  { id: "communication", title: "Коммуникации и продажи" },
  { id: "leadership", title: "Лидерство и команда" },
  { id: "efficiency", title: "Личная эффективность и осознанность" },
];

export const courses = [
  {
    id: "course-entrepreneur-basic",
    title: "Базовый курс предпринимателя 13–17",
    description: "Первые шаги в запуске проектов: идеи, команда, первые продажи.",
    age: "13–17",
    focus: "бизнес",
    duration: "4 недели",
    difficulty: "начальный",
    theme: "entrepreneurship",
    testId: "test-entrepreneur-thinking",
  },
  {
    id: "course-soft-skills",
    title: "Навыки XXI века для подростка",
    description: "Критическое мышление, коммуникации, работа в команде и ответственность.",
    age: "13–17",
    focus: "мышление",
    duration: "6 модулей",
    difficulty: "начальный",
    theme: "efficiency",
    testId: "test-habits",
  },
  {
    id: "course-finance",
    title: "Финансовый старт для молодых",
    description: "Как вести бюджет, копить, инвестировать и считать прибыль проекта.",
    age: "16–20",
    focus: "финансовая грамотность",
    duration: "5 недель",
    difficulty: "начальный",
    theme: "finance",
    testId: "test-finance-basics",
  },
  {
    id: "course-mindset",
    title: "Мышление создателя проектов",
    description: "Риски, гипотезы, эксперименты и навык доводить до результата.",
    age: "16–20",
    focus: "мышление",
    duration: "6 модулей",
    difficulty: "продвинутый",
    theme: "entrepreneurship",
    testId: "test-creativity",
  },
  {
    id: "course-leadership",
    title: "Лидерство и команда",
    description: "Как вдохновлять людей, ставить цели и держать атмосферу.",
    age: "16–20",
    focus: "комьюнити",
    duration: "4 недели",
    difficulty: "начальный",
    theme: "leadership",
    testId: "test-leadership",
  },
  {
    id: "course-sales",
    title: "Продажи и переговоры для новичка",
    description: "Как слушать клиента, вести диалог и закрывать сделки.",
    age: "16–20",
    focus: "бизнес",
    duration: "5 модулей",
    difficulty: "начальный",
    theme: "communication",
    testId: "test-communication",
  },
  {
    id: "course-30-days",
    title: "Проект за 30 дней",
    description: "Пошаговый план от идеи до первых пользователей за месяц.",
    age: "16–20",
    focus: "бизнес",
    duration: "30 дней",
    difficulty: "продвинутый",
    theme: "entrepreneurship",
    testId: "test-brand",
  },
  {
    id: "course-presentations",
    title: "Презентации и публичные выступления",
    description: "Структура, сторителлинг, визуал и уверенность на сцене.",
    age: "13–20",
    focus: "soft skills",
    duration: "4 недели",
    difficulty: "начальный",
    theme: "communication",
    testId: "test-brand",
  },
  {
    id: "course-mindfulness",
    title: "Осознанность и анти-выгорание",
    description: "Режим, отдых, работа со стрессом и привычки восстановления.",
    age: "16–20",
    focus: "психология",
    duration: "3 недели",
    difficulty: "начальный",
    theme: "efficiency",
    testId: "test-discipline",
  },
  {
    id: "course-business-games",
    title: "Бизнес-игры: учимся через практику",
    description: "Короткие симуляции, чтобы потренировать решения в безопасной среде.",
    age: "13–20",
    focus: "бизнес",
    duration: "6 встреч",
    difficulty: "начальный",
    theme: "leadership",
    testId: "test-ethics",
  },
];

export const tests = [
  {
    id: "test-entrepreneur-thinking",
    title: "Тест: предпринимательское мышление",
    description: "Проверяем, как ты работаешь с идеями, риском и обратной связью.",
    theme: "entrepreneurship",
    questions: [
      {
        text: "Что помогает быстрее провериь идею?",
        options: ["Большое исследование", "Мини-эксперимент", "Длинный брейншторм"],
        answer: 1,
      },
      {
        text: "Как лучше реагировать на провал?",
        options: ["Игнорировать", "Разобрать, что пошло не так", "Бросить идею навсегда"],
        answer: 1,
      },
      {
        text: "Что такое гипотеза?",
        options: ["Готовая истина", "Предположение, которое проверяют", "План продаж"],
        answer: 1,
      },
    ],
  },
  {
    id: "test-finance-basics",
    title: "Финансовая грамотность",
    description: "Бюджет, подушка безопасности и первые инвестиции.",
    theme: "finance",
    questions: [
      { text: "Для чего нужна подушка безопасности?", options: ["Для покупок", "Для рисков", "Для развлечений"], answer: 1 },
      { text: "Что такое доход?", options: ["Все деньги", "То, что остаётся после расходов", "Поступления за период"], answer: 2 },
      { text: "Как избежать импульсивных трат?", options: ["Списком покупок", "Кредитами", "Игнорировать цели"], answer: 0 },
    ],
  },
  {
    id: "test-leadership",
    title: "Лидерство и команда",
    description: "Как мотивировать, слушать и распределять роли.",
    theme: "leadership",
    questions: [
      { text: "Что делает лидер?", options: ["Всё сам", "Делегирует и поддерживает", "Избегает сложных задач"], answer: 1 },
      { text: "Как дать обратную связь?", options: ["Сразу обвинить", "Через факт и предложение", "Молчать"], answer: 1 },
      { text: "Что помогает команде?", options: ["Неясные цели", "Прозрачные договорённости", "Случайные задачи"], answer: 1 },
    ],
  },
  {
    id: "test-communication",
    title: "Коммуникации и переговоры",
    description: "Слушаем, задаём вопросы и ищем win-win.",
    theme: "communication",
    questions: [
      { text: "Как понять потребность собеседника?", options: ["Прерывать", "Задавать открытые вопросы", "Говорить только о себе"], answer: 1 },
      { text: "Что такое win-win?", options: ["Выигрыш одной стороны", "Удобный компромисс", "Польза для всех"], answer: 2 },
      { text: "Как вести переговоры?", options: ["Жёстко давить", "Слушать и предлагать варианты", "Уходить"], answer: 1 },
    ],
  },
  {
    id: "test-creativity",
    title: "Креативность",
    description: "Генерируем идеи и оцениваем их ценность.",
    theme: "entrepreneurship",
    questions: [
      { text: "Что помогает идеям?", options: ["Разнообразный опыт", "Только вдохновение", "Случайность"], answer: 0 },
      { text: "Как отбирать идеи?", options: ["Думать о ценности", "Брать первую попавшуюся", "Ждать трендов"], answer: 0 },
      { text: "Что такое прототип?", options: ["Готовый продукт", "Мини-версия для проверки", "Теория"], answer: 1 },
    ],
  },
  {
    id: "test-discipline",
    title: "Дисциплина и привычки",
    description: "Как держать фокус и не срываться.",
    theme: "efficiency",
    questions: [
      { text: "Как укрепить привычку?", options: ["Напоминания и ритуалы", "Только сила воли", "Игнорировать планы"], answer: 0 },
      { text: "Что делать при срыве?", options: ["Сдаться", "Проанализировать и вернуться", "Скрыть"], answer: 1 },
      { text: "Что такое трекер привычек?", options: ["Случайный список", "Инструмент для контроля прогресса", "Соцсеть"], answer: 1 },
    ],
  },
  {
    id: "test-networking",
    title: "Нетворкинг",
    description: "Учимся знакомиться и поддерживать контакты.",
    theme: "communication",
    questions: [
      { text: "Что спросить на знакомстве?", options: ["Ничего", "Чем человек сейчас занят", "Только о себе"], answer: 1 },
      { text: "Как запомнить людей?", options: ["Вести заметки", "Надеяться на память", "Не знакомиться"], answer: 0 },
      { text: "Что главное в нетворкинге?", options: ["Польза обеим сторонам", "Только выгода", "Случайность"], answer: 0 },
    ],
  },
  {
    id: "test-brand",
    title: "Личный бренд",
    description: "Про видимость, ценность и честность.",
    theme: "communication",
    questions: [
      { text: "Что строит бренд?", options: ["Регулярность и ценность", "Случайные посты", "Реклама без смысла"], answer: 0 },
      { text: "Как делиться результатами?", options: ["Придумывать", "Показывать процесс", "Молчать"], answer: 1 },
      { text: "Что важно в соцсетях?", options: ["Быть полезным", "Только лайки", "Копировать всех"], answer: 0 },
    ],
  },
  {
    id: "test-ethics",
    title: "Ответственность и этика",
    description: "Выборы, последствия и доверие.",
    theme: "leadership",
    questions: [
      { text: "Что делать с ошибкой?", options: ["Скрыть", "Признать и исправить", "Всё равно"], answer: 1 },
      { text: "Почему важна прозрачность?", options: ["Строит доверие", "Ускоряет хаос", "Не нужна"], answer: 0 },
      { text: "Как принимать решения?", options: ["Без данных", "С учётом людей и фактов", "Случайно"], answer: 1 },
    ],
  },
  {
    id: "test-habits",
    title: "Ежедневные привычки предпринимателя",
    description: "Режим, энергия и маленькие шаги.",
    theme: "efficiency",
    questions: [
      { text: "Что помогает энергии?", options: ["Сон и спорт", "Только кофе", "Ничего"], answer: 0 },
      { text: "Зачем план на день?", options: ["Чтобы не забыть главное", "Просто традиция", "Не нужен"], answer: 0 },
      { text: "Как вернуть мотивацию?", options: ["Напомнить цель", "Сдаться", "Обижаться"], answer: 0 },
    ],
  },
];

export const articles = [
  {
    id: "article-entrepreneur-mind",
    title: "Как мыслит предприниматель",
    description: "500+ слов о том, как инициативность и ответственность превращают идеи в проекты.",
    content:
      "Предпринимательское мышление — это привычка тестировать идеи малыми шагами и разбирать ошибки как точки роста. Начни с маленького эксперимента, фиксируй выводы и ии обратную связь.",
    theme: "entrepreneurship",
    testId: "test-entrepreneur-thinking",
  },
  {
    id: "article-finance",
    title: "Финансовая база подростка",
    description: "Бюджет, доходы, расходы, безопасность и первые инвестиции.",
    content:
      "Управление деньгами начинается с простого: записывай доходы и расходы, собирай подушку и учись отличать желания от целей. Это даст свободу пробовать проекты без страха.",
    theme: "finance",
    testId: "test-finance-basics",
  },
  {
    id: "article-psychology",
    title: "Психология устойчивости",
    description: "Как сохранять мотивацию, работать со стрессом и не выгорать на старте.",
    content:
      "Замечай эмоции, договаривайся с собой и используй ритуалы восстановления. Осознанность и поддержка помогают держать курс даже при провалах.",
    theme: "efficiency",
    testId: "test-discipline",
  },
  {
    id: "article-ei",
    title: "Эмоциональный интеллект",
    description: "Как замечать эмоции и договариваться с людьми без конфликтов.",
    content:
      "Слушай, задавай уточняющие вопросы, называй чувства и ищи общую цель. Эмоциональный интеллект делает переговоры спокойнее и результативнее.",
    theme: "leadership",
    testId: "test-ethics",
  },
  {
    id: "article-sales",
    title: "Основы продаж и переговоров",
    description: "Простые шаги, чтобы быть полезным клиенту и закрывать сделки.",
    content:
      "Продажи — это диалог о проблемах клиента. Узнай, что болит, предложи решение и договорись о следующем шаге. Честность и внимание важнее агрессии.",
    theme: "communication",
    testId: "test-communication",
  },
  {
    id: "article-productivity",
    title: "Личная продуктивность",
    description: "Как делать главное и не терять энергию.",
    content:
      "Ставь 3 главные задачи на день, закрывай их в первую очередь и оставляй буфер на неожиданности. Ритм важнее спринтов.",
    theme: "efficiency",
    testId: "test-habits",
  },
  {
    id: "article-risk",
    title: "Работа с риском",
    description: "Учимся просчитывать сценарии и готовить план Б.",
    content:
      "Любой риск можно разложить: вероятность, влияние и шаги снижения. Так неопределённость превращается в понятный план действий.",
    theme: "entrepreneurship",
    testId: "test-creativity",
  },
  {
    id: "article-service",
    title: "Клиентский сервис",
    description: "Делаем опыт пользователя понятным и тёплым.",
    content:
      "Сервис — это впечатление. Отвечай быстро, признавай ошибки и исправляй их. Внимание к деталям создаёт доверие и рекомендации.",
    theme: "communication",
    testId: "test-communication",
  },
  {
    id: "article-team",
    title: "Командная работа",
    description: "Как договариваться о ролях и поддерживать друг друга.",
    content:
      "Прозрачные договорённости, ретроспективы и поддержка делают команду устойчивой. Лидер задаёт темп и помогает расти.",
    theme: "leadership",
    testId: "test-leadership",
  },
  {
    id: "article-marketing",
    title: "Маркетинг и упаковка",
    description: "Как говорить о ценности продукта понятным языком.",
    content:
      "Опиши, какую проблему ты решаешь, покажи примеры и отзывы. Чёткий месседж и визуал помогают людям понимать, зачем им твой продукт.",
    theme: "entrepreneurship",
    testId: "test-brand",
  },
  {
    id: "article-brand",
    title: "Личный бренд подростка",
    description: "Как делиться опытом честно и полезно.",
    content:
      "Публикуй заметки о процессе, показывай результаты и выводы. Регулярность и ценность формируют доверие и возможности.",
    theme: "communication",
    testId: "test-brand",
  },
  {
    id: "article-networking",
    title: "Нетворкинг без неловкости",
    description: "Учимся знакомиться, поддерживать контакт и просить о помощи.",
    content:
      "Готовь пару вопросов, будь искренним и предлагай пользу. После встречи напиши человеку и закрепи договорённости.",
    theme: "communication",
    testId: "test-networking",
  },
];

export const communityMembers = [
  { id: "member-artem", name: "Макс Ковалёв", points: 840, status: "Амбассадор сообщества", achievements: ["Лидер недели", "Прошёл 3 теста подряд", "Закрыл 5 материалов"] },
  { id: "member-maria", name: "Мария Лебедева", points: 720, status: "Создатель проектов", achievements: ["10 дней подряд в треке", "Первый бизнес-проект", "Прошёл 3 теста подряд"] },
  { id: "member-daniil", name: "Даниил Петров", points: 690, status: "Создатель проектов", achievements: ["Закрыл 5 материалов", "Лидер недели"] },
  { id: "member-alina", name: "Алина Смирнова", points: 610, status: "Исследователь", achievements: ["Прошёл 3 теста подряд", "Первый бизнес-проект"] },
  { id: "member-nikita", name: "Никита Волков", points: 580, status: "Исследователь", achievements: ["Самый активный за неделю", "Закрыл 5 материалов"] },
  { id: "member-polina", name: "Полина Журавлёва", points: 560, status: "Исследователь", achievements: ["10 дней подряд в треке", "Прошёл 3 теста подряд"] },
  { id: "member-timur", name: "Тимур Сидоров", points: 540, status: "Исследователь", achievements: ["Лидер недели", "Закрыл 5 материалов"] },
  { id: "member-sofia", name: "София Орлова", points: 520, status: "Исследователь", achievements: ["Прошёл 3 теста подряд"] },
  { id: "member-ilya", name: "Илья Королёв", points: 500, status: "Исследователь", achievements: ["Самый активный за неделю", "Закрыл 5 материалов"] },
  { id: "member-kseniya", name: "Ксения Андреева", points: 490, status: "Исследователь", achievements: ["Прошёл 3 теста подряд"] },
  { id: "member-maksim", name: "Максим Романов", points: 470, status: "Исследователь", achievements: ["Первый бизнес-проект"] },
  { id: "member-eva", name: "Ева Морозова", points: 450, status: "Новичок NOESIS", achievements: ["Закрыл 5 материалов"] },
  { id: "member-kirill", name: "Кирилл Захаров", points: 430, status: "Новичок NOESIS", achievements: ["Прошёл 3 теста подряд"] },
  { id: "member-varvara", name: "Варвара Климова", points: 410, status: "Новичок NOESIS", achievements: ["Самый активный за неделю"] },
  { id: "member-andrey", name: "Андрей Фомин", points: 390, status: "Новичок NOESIS", achievements: ["Первый бизнес-проект"] },
  { id: "member-darya", name: "Дарья Егорова", points: 370, status: "Новичок NOESIS", achievements: ["Закрыл 5 материалов"] },
  { id: "member-roman", name: "Роман Тарасов", points: 350, status: "Новичок NOESIS", achievements: ["Прошёл 3 теста подряд"] },
  { id: "member-alexandra", name: "Александра Лунева", points: 330, status: "Новичок NOESIS", achievements: ["10 дней подряд в треке"] },
  { id: "member-vladislav", name: "Владислав Попов", points: 310, status: "Новичок NOESIS", achievements: ["Самый активный за неделю"] },
  { id: "member-milana", name: "Милана Григорьева", points: 290, status: "Новичок NOESIS", achievements: ["Первый бизнес-проект"] },
];

export const getMaterialByType = (type, id) => {
  if (type === "course") return courses.find((c) => c.id === id);
  if (type === "article") return articles.find((a) => a.id === id);
  if (type === "test") return tests.find((t) => t.id === id);
  return null;
};
