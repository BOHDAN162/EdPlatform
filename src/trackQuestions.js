export const trackQuestions = [
  {
    id: "focus",
    text: "Что сейчас важнее всего в развитии?",
    options: [
      { text: "Запустить идею и понять, работает ли она", scores: { founder: 2, creator: 1 } },
      { text: "Разобраться в цифрах и стратегии", scores: { strategist: 2 } },
      { text: "Собрать вокруг себя людей и договориться", scores: { leader: 2 } },
      { text: "Довести начатые проекты до конца", scores: { creator: 2, founder: 1 } },
    ],
  },
  {
    id: "experience",
    text: "Какой у тебя сейчас опыт?",
    options: [
      { text: "Есть идеи, пробовал что-то запускать", scores: { founder: 2, creator: 1 } },
      { text: "Люблю анализировать и строить планы", scores: { strategist: 2 } },
      { text: "Часто организую людей или помогаю команде", scores: { leader: 2 } },
      { text: "Делаю учебные или пет-проекты", scores: { creator: 2 } },
    ],
  },
  {
    id: "motivation",
    text: "Что тебя больше всего заводит?",
    options: [
      { text: "Свобода делать по-своему и влиять на результат", scores: { founder: 2 } },
      { text: "Когда всё просчитано и есть ясный план", scores: { strategist: 2 } },
      { text: "Общение, презентации и энергия команды", scores: { leader: 2 } },
      { text: "Собрать рабочий продукт и показать его", scores: { creator: 2, founder: 1 } },
    ],
  },
  {
    id: "confidence",
    text: "Насколько уверенно чувствуешь себя в действиях?",
    options: [
      { text: "Готов рисковать и тестировать", scores: { founder: 2 } },
      { text: "Уверен, когда есть данные и сценарий", scores: { strategist: 2 } },
      { text: "Легче, когда мы делаем вместе", scores: { leader: 2 } },
      { text: "Уверен, если могу быстро собрать прототип", scores: { creator: 2 } },
    ],
  },
  {
    id: "communication",
    text: "Как относишься к переговорам и продажам?",
    options: [
      { text: "Это про меня — люблю говорить и убеждать", scores: { leader: 2, founder: 1 } },
      { text: "Готов, если заранее приготовлю аргументы", scores: { strategist: 2 } },
      { text: "Хочу скорее сделать продукт, чем продавать", scores: { creator: 2 } },
      { text: "Смогу, если это нужно для запуска", scores: { founder: 2 } },
    ],
  },
  {
    id: "numbers",
    text: "Как работаешь с цифрами?",
    options: [
      { text: "Считаю бюджет и прибыль, мне это интересно", scores: { strategist: 2, founder: 1 } },
      { text: "Использую только базовые расчёты", scores: { founder: 1, creator: 1 } },
      { text: "Хочу научиться, пока ориентируюсь на ощущения", scores: { leader: 1, creator: 1 } },
      { text: "Делаю таблицы для проектов и гипотез", scores: { strategist: 2 } },
    ],
  },
  {
    id: "time",
    text: "Как распределяешь время?",
    options: [
      { text: "Ставлю дедлайны и держу ритм", scores: { strategist: 2, creator: 1 } },
      { text: "Делаю рывками, когда загорелся", scores: { founder: 2 } },
      { text: "Помогает, когда есть команда и напоминания", scores: { leader: 2 } },
      { text: "Планирую блоками и фиксирую прогресс", scores: { creator: 2 } },
    ],
  },
  {
    id: "support",
    text: "Что помогает тебе двигаться?",
    options: [
      { text: "Наставник или тот, кто задаёт темп", scores: { leader: 1, strategist: 1 } },
      { text: "Команда, с которой можно делиться идеями", scores: { leader: 2 } },
      { text: "Понятный список задач и чекпоинты", scores: { strategist: 2, creator: 1 } },
      { text: "Свобода пробовать и быстро менять курс", scores: { founder: 2 } },
    ],
  },
  {
    id: "finance",
    text: "Как смотришь на деньги и ресурсы?",
    options: [
      { text: "Думаю, как заработать и масштабировать", scores: { founder: 2 } },
      { text: "Важно понимать, куда уходят деньги", scores: { strategist: 2 } },
      { text: "Учу людей распределять задачи и ресурсы", scores: { leader: 2 } },
      { text: "Считаю расходы на свои проекты", scores: { creator: 2, founder: 1 } },
    ],
  },
  {
    id: "presentation",
    text: "Что с презентациями и публичкой?",
    options: [
      { text: "Легко выступаю и люблю объяснять идеи", scores: { leader: 2 } },
      { text: "Собираю структуру, чтобы звучать убедительно", scores: { strategist: 2 } },
      { text: "Выступаю, если это помогает запустить продукт", scores: { founder: 2 } },
      { text: "Показываю готовый результат и демонстрации", scores: { creator: 2 } },
    ],
  },
];

export const QUESTION_COUNT = trackQuestions.length;
