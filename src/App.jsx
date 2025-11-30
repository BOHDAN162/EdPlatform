import React, { useEffect, useMemo, useState } from "react";
import { BrowserRouter, Routes, Route, Link, NavLink, useNavigate, useParams } from "react-router-dom";

const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));
const load = (k, d) => {
  try {
    const raw = localStorage.getItem(k);
    if (!raw) return d;
    return JSON.parse(raw);
  } catch (e) {
    console.error("restore", e);
    return d;
  }
};

const STATUSES = [
  { min: 800, title: "Визионер" },
  { min: 500, title: "Создатель" },
  { min: 250, title: "Мыслитель" },
  { min: 100, title: "Искатель" },
  { min: 0, title: "Новичок" },
];

const categories = [
  { id: "thinking", name: "Мышление" },
  { id: "business", name: "Бизнес" },
  { id: "finance", name: "Финансы" },
  { id: "psychology", name: "Психология" },
];

const entrepreneurArticle = `Предпринимательское мышление – это способ видеть возможности там, где другие замечают только препятствия. Оно строится на нескольких фундаментальных привычках: инициативности, ответственности, готовности работать с риском, уважении к ошибкам и умении мыслить на длинной дистанции. Следующие страницы помогают собрать эти элементы в целостную картину.

Инициативность. Предприниматель не ждёт, пока внешние обстоятельства станут идеальными. Он начинает с того, что есть, запускает маленький эксперимент и наблюдает за результатами. Инициативность проявляется в вопросе «Что могу сделать уже сегодня?». Например, если хочется открыть школьный кружок по дизайну, можно не искать идеального помещения, а собрать ребят онлайн и протестировать интерес. Малые шаги дают данные и уверенность, которые невозможно получить в теории.

Ответственность. В предпринимательстве нет удобной фигуры, на которую можно переложить последствия. Даже когда команда большая, ответственность за решение остаётся. Ответственность – это честный разбор: «Что я контролировал? Что не учёл? Что могу изменить в следующий раз?». Такой подход снимает беспомощность и переводит фокус на действия. Он же удерживает от обвинений окружающих и учит договариваться.

Работа с рисками. Риск неизбежен: можно ошибиться с продуктом, партнёром, рынком. Зрелый предприниматель не игнорирует риски и не драматизирует их. Он выписывает возможные сценарии, прикидывает вероятность и влияние, готовит план Б. Например, если вы продаёте мерч, заранее подумайте, что делать, если поставщик задержит ткань: есть ли альтернативы, нужно ли собирать предоплату или держать резерв. Риск, разложенный на элементы, перестаёт пугать и превращается в управляемую задачу.

Отношение к ошибкам. Ошибки неизбежны, и именно через них учатся быстрее всего. Критично разделять ошибку и личную ценность: «я допустил ошибку» ≠ «я плохой». Предприниматель задаёт себе вопрос: «Какой новый факт я узнал? Как перестроить систему, чтобы это не повторилось?». Ошибки становятся топливом для улучшений, а не поводом остановиться. Важный навык – делиться ошибками с командой, чтобы учились все.

Долгосрочное мышление. Мгновенная выгода редко создаёт прочный бизнес. Предприниматель смотрит на горизонт: что будет с продуктом через год, как клиенты будут меняться, какую репутацию мы формируем. Долгосрочное мышление помогает принимать решения, которые сегодня могут казаться сложнее: например, отказаться от быстрых продаж ради времени на качественный продукт. Оно же помогает выдерживать стресс и строить устойчивые привычки.

Как развивать эти качества? Начать с малого: вести журнал решений и их последствий, раз в неделю планировать эксперименты, искать наставника или сообщество, где обсуждают не только успехи, но и провалы. Чтение биографий предпринимателей даёт примеры того, как они справлялись с неопределённостью. Практика благодарности помогает замечать ресурсы, которые уже есть.

Предпринимательское мышление – не врождённый талант, а набор навыков. Любой подросток может их тренировать: выходить за пределы привычного, брать ответственность за выбор, спокойно анализировать ошибки и держать в голове длинную траекторию. Главное – помнить, что путь состоит из сотен маленьких шагов и каждый из них делает вас сильнее.`;

const initialMaterials = [
  {
    id: "entrepreneur-mind",
    title: "Как мыслит предприниматель",
    category: "thinking",
    type: "article",
    description: "500+ слов о том, как инициативность и ответственность превращают идеи в проекты.",
    content: entrepreneurArticle,
  },
  {
    id: "business-video",
    title: "Видео о ценности продукта",
    category: "business",
    type: "video",
    description: "Плейсхолдер видео о том, за что готовы платить клиенты.",
    content: "Видео будет доступно позже.",
  },
  {
    id: "thinking-quiz",
    title: "Тест: критическое мышление",
    category: "thinking",
    type: "quiz",
    description: "5 вопросов о проверке фактов и источников.",
    questions: [
      {
        text: "Что такое первичный источник?",
        options: ["Новостной заголовок", "Оригинальный документ или исследование", "Комментарий в соцсетях"],
        answer: 1,
      },
      {
        text: "Что делает корреляция?",
        options: ["Доказывает причинность", "Показывает совместное движение факторов", "Убирает риски"],
        answer: 1,
      },
      {
        text: "Как лучше реагировать на громкую новость?",
        options: ["Сразу репостнуть", "Проверить дату и источник", "Игнорировать любую информацию"],
        answer: 1,
      },
      {
        text: "Что спросить у автора материала?",
        options: ["Какой у него интерес и откуда данные", "Где он живёт", "Какой у него любимый цвет"],
        answer: 0,
      },
      {
        text: "Что поможет отличить факт от мнения?",
        options: ["Наличие проверки и доказательств", "Количества лайков", "Длина текста"],
        answer: 0,
      },
    ],
  },
  {
    id: "finance-longread",
    title: "Финансовая база подростка",
    category: "finance",
    type: "article",
    description: "Подробный гид о подушке безопасности, бюджете и первых инвестициях.",
    content: `
      Финансовая устойчивость начинается с дисциплины и прозрачности. Подушка безопасности — это 3–6 месяцев базовых расходов, которые позволяют спокойно учиться, пробовать и ошибаться. Начни с расчёта ежемесячных обязательных трат и поставь цель откладывать 10–20% поступлений, даже если это карманные деньги или подработки. Фиксируй каждый шаг: таблица или простое приложение помогают увидеть, куда утекают средства.

      Бюджетирование — это не про ограничения, а про осознанные выборы. Сначала отдели обязательные расходы (транспорт, еда, связь), затем — полезные инвестиции (курсы, книги, спорт), и только потом — развлечения. Такой порядок заставляет подумать, приносит ли трата пользу будущему «я». Полезно ставить маленькие финансовые цели: накопить на собственный ноутбук, оплатить часть обучения, собрать резерв на мини-проект.

      Инвестиции начинаются с знаний, а не с сложных инструментов. Изучи, как работают процентные ставки, инфляция и сложный процент. Оцени риски: вложения, которые обещают быстрый рост без усилий, почти всегда заканчиваются потерями. Выбирай понятные инструменты и инвестируй в себя: навыки, которые можно монетизировать, дают более высокий «доход на инвестиции», чем случайные сделки. Главное — регулярность и ответственность за решения.
    `,
  },
  {
    id: "psychology-longread",
    title: "Психология устойчивости",
    category: "psychology",
    type: "article",
    description: "Как сохранять мотивацию, работать со стрессом и не выгорать на старте.",
    content: `
      Психологическая устойчивость — это способность продолжать движение, когда план ломается. Она строится на трёх слоях: осознанности, поддержке и ритуалах восстановления. Осознанность помогает замечать свои реакции: когда тревога растёт, замедлись, сделай несколько глубоких вдохов и задай вопрос «что сейчас в моём контроле?». Это переключает мозг из паники в режим решения задач.

      Поддержка — это люди, которые могут выслушать без оценок. Создай мини-комьюнити из 3–5 друзей или наставников, с которыми можно делиться планами и ошибками. Проговаривание снижает стресс и даёт новые идеи. Важно и внутреннее самосострадание: относись к себе как к другу, который учится, а не как к противнику, которого нужно «дожать».

      Ритуалы восстановления — короткие действия, которые возвращают энергию: прогулка, спорт, сон без гаджетов, ведение дневника. Закрепи их в календаре, как встречи с самим собой. Если чувствуешь признаки выгорания (усталость, цинизм, потеря интереса), сделай паузу, пересмотри нагрузку, поговори с наставником или психологом. Устойчивость — это не жесткость, а гибкость и способность адаптироваться.
    `,
  },
];

const initialQuest = {
  id: "main-quest",
  title: "Интеллектуальный квест",
  steps: [
    {
      id: "quest-step-1",
      title: "Шаг 1: ответственность",
      questions: [
        {
          text: "Что такое ответственность предпринимателя?",
          options: ["Перекладывать вину", "Честно разбирать решения и менять действия", "Ждать идеальных условий"],
          answer: 1,
        },
        {
          text: "Что делать после ошибки?",
          options: ["Скрыть её", "Искать виноватых", "Извлечь факт и поменять процесс"],
          answer: 2,
        },
      ],
    },
    {
      id: "quest-step-2",
      title: "Шаг 2: риск и деньги",
      questions: [
        {
          text: "Как управлять риском?",
          options: ["Игнорировать", "Разложить сценарии и подготовить план Б", "Отказаться от идей"],
          answer: 1,
        },
        {
          text: "С чего начать личные финансы?",
          options: ["Подушки безопасности", "Кредитных карт", "Случайных трат"],
          answer: 0,
        },
        {
          text: "Что такое ценность продукта?",
          options: ["Количество функций", "Решение задачи клиента", "Цвет упаковки"],
          answer: 1,
        },
      ],
    },
    {
      id: "quest-step-3",
      title: "Шаг 3: мышление",
      questions: [
        {
          text: "Что помогает держать долгосрочный фокус?",
          options: ["Только эмоции", "Понимание горизонта и репутации", "Отсутствие планов"],
          answer: 1,
        },
        {
          text: "Что отличает факт от мнения?",
          options: ["Лайки", "Проверяемость", "Длина текста"],
          answer: 1,
        },
      ],
    },
  ],
};

const initialUsers = [
  { id: "you", name: "Ты", points: 20 },
  { id: "arsen", name: "Arsen", points: 880 },
  { id: "mira", name: "Mira", points: 760 },
  { id: "leo", name: "Leo", points: 640 },
];

const faqItems = [
  { q: "Как начать обучение?", a: "Нажмите «Начать обучение» на главной и пройдите регистрацию." },
  { q: "Нужна ли реальная оплата?", a: "Нет, подписка — фронтовый флаг, который активируется кнопкой." },
  { q: "Что дают очки?", a: "Они повышают статус, открывают достижения и мотивируют проходить материалы." },
  { q: "Можно ли пройти квесты повторно?", a: "После завершения основного квеста повтор ограничен, чтобы сохранить ценность." },
  { q: "Как считается прогресс?", a: "Процент завершённых уроков и квестов." },
  { q: "Где увидеть таблицу лидеров?", a: "В разделе Сообщество есть полная таблица и профили участников." },
  { q: "Как сменить тему?", a: "Используйте переключатель в шапке или в настройках профиля." },
  { q: "Куда писать идеи?", a: "Оставьте идею в форме на странице помощи — мы всё читаем." },
  { q: "Что за ежедневный стрик?", a: "За вход в разные дни даём очки и достижение «Серия 3 дня»." },
  { q: "Можно ли менять персональные данные?", a: "Да, в профиле в разделе «Настройки»." },
  { q: "Как активировать подписку?", a: "Перейдите на страницу «Подписка» и нажмите кнопку активации." },
  { q: "Есть ли помощь?", a: "На странице /help размещены ответы и ссылка на Telegram." },
];

const practicalTasks = [
  { id: "book", title: "Прочитать книгу", desc: "Выбери бизнес-книгу и закончи её за неделю." },
  { id: "movie", title: "Посмотреть фильм", desc: "Мотивационный фильм или история компании." },
  { id: "network", title: "Познакомиться с 10 новыми людьми", desc: "Потренируйся задавать вопросы и слушать." },
];

const defaultState = {
  profile: {
    firstName: "Ты",
    lastName: "User",
    phone: "",
    points: 20,
    subscriptionActive: false,
    lastLessonId: null,
    completedLessons: {},
    testResults: {},
    achievements: {
      firstLesson: false,
      firstTest: false,
      questMaster: false,
      streak3: false,
    },
    streak: { count: 1, lastVisit: new Date().toISOString().slice(0, 10) },
    practical: {},
    password: "",
    track: null,
  },
  materials: initialMaterials,
  quest: { ...initialQuest, progress: { currentStep: 0, completed: false, answers: {} } },
  users: initialUsers,
  ideas: [],
  theme: "dark",
};

const statusFromPoints = (pts) => STATUSES.find((s) => pts >= s.min)?.title || "Новичок";

const usePersistedState = () => {
  const [state, setState] = useState(() => load("ep_state", defaultState));

  useEffect(() => {
    save("ep_state", state);
  }, [state]);

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    setState((prev) => {
      const last = prev.profile.streak.lastVisit;
      if (last === today) return prev;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const prevDate = yesterday.toISOString().slice(0, 10);
      const consecutive = last === prevDate ? prev.profile.streak.count + 1 : 1;
      const newPoints = prev.profile.points + 5;
      const achieved = consecutive >= 3 ? true : prev.profile.achievements.streak3;
      return {
        ...prev,
        profile: {
          ...prev.profile,
          points: newPoints,
          streak: { count: consecutive, lastVisit: today },
          achievements: { ...prev.profile.achievements, streak3: achieved },
        },
      };
    });
  }, []);

  return [state, setState];
};

const Header = ({ theme, toggleTheme, subscriptionActive }) => {
  const [open, setOpen] = useState(false);
  const links = [
    { to: "/", label: "Главная" },
    { to: "/library", label: "Библиотека" },
    { to: "/quests", label: "Квесты" },
    { to: "/community", label: "Сообщество" },
    { to: "/profile", label: "Профиль" },
    { to: "/subscription", label: "Подписка" },
    { to: "/help", label: "Помощь" },
    { to: "/admin", label: "Админ" },
  ];
  return (
    <header className="header">
      <div className="logo">EdPlatform</div>
      <button className="burger" onClick={() => setOpen(!open)} aria-label="menu">☰</button>
      <nav className={`nav ${open ? "open" : ""}`}>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/"}
            className={() => `nav-link ${link.to === "/" ? "nav-link-home" : ""}`.trim()}
            onClick={() => setOpen(false)}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
      <div className="header-actions">
        <button onClick={toggleTheme} className="ghost">
          {theme === "dark" ? "Темная" : "Светлая"}
        </button>
        <Link to="/profile" className="avatar">Ты</Link>
      </div>
    </header>
  );
};

const Layout = ({ children, theme, toggleTheme, subscriptionActive }) => (
  <div className={`app ${theme}`}>
    <Header theme={theme} toggleTheme={toggleTheme} subscriptionActive={subscriptionActive} />
    <main className="container">{children}</main>
  </div>
);

const Quotes = () => {
  const items = [
    { author: "Стив Джобс", text: "Единственный способ сделать великую работу — любить то, что ты делаешь." },
    { author: "Элон Маск", text: "Если что-то достаточно важно, стоит попробовать, даже если исход неясен." },
    { author: "Рей Далио", text: "Боль плюс размышление равняется прогресс." },
    { author: "Сара Блейкли", text: "Ошибки — это не провалы, а топливо для роста." },
    { author: "Джек Ма", text: "Никогда не сдавайся. Сегодня тяжело, завтра будет хуже, но послезавтра — солнце." },
    { author: "Илонка Туск", text: "Дисциплина — мост между намерением и результатом." },
    { author: "Питер Тиль", text: "Секрет успеха — строить то, что ещё никто не осмелился представить." },
    { author: "Навал Равикант", text: "Люби науку. Она превращает удачу в стратегию." },
  ];
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % items.length), 5000);
    return () => clearInterval(t);
  }, [items.length]);
  const q = items[index];
  return (
    <div className="quote">
      <p>“{q.text}”</p>
      <span>— {q.author}</span>
      <div className="quote-controls">
        {items.map((_, i) => (
          <button key={i} className={i === index ? "dot active" : "dot"} onClick={() => setIndex(i)} aria-label="quote" />
        ))}
      </div>
    </div>
  );
};

const TrackTest = ({ onComplete, savedTrack }) => {
  const questions = [
    { text: "Как ты относишься к риску?", options: ["Избегаю", "Готов пробовать", "Люблю экспериментировать"], scores: [0, 1, 2] },
    { text: "Что делаешь при ошибке?", options: ["Расстраиваюсь", "Ищу вывод", "Делаю новую попытку"], scores: [0, 1, 2] },
    { text: "Как ты работаешь с идеями?", options: ["Думаю, но не делаю", "Делаю мини-тест", "Собираю команду"], scores: [0, 1, 2] },
    { text: "Как относишься к ответственности?", options: ["Это страшно", "Можно научиться", "Нравится брать на себя"], scores: [0, 1, 2] },
    { text: "Как планируешь время?", options: ["Спонтанно", "Списки и дедлайны", "Долгосрочные цели"], scores: [0, 1, 2] },
  ];
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const totalScore = answers.reduce((acc, val, i) => acc + (questions[i].scores[val] || 0), 0);
  const tracks = [
    { max: 3, title: "Командный игрок" },
    { max: 6, title: "Коммандир" },
    { max: 8, title: "Мыслитель" },
    { max: 10, title: "Создатель" },
  ];
  const result = tracks.find((t) => totalScore <= t.max) || tracks[tracks.length - 1];

  const submit = () => {
    if (answers.some((a) => a === null)) return alert("Ответь на все вопросы");
    onComplete(result.title);
  };

  return (
    <div className="card track-test-card" id="track-test">
      <div className="card-header">Быстрый тест на трек развития</div>
      {savedTrack && <div className="success">Твой трек: {savedTrack}</div>}
      <div className="test-grid">
        {questions.map((q, qi) => (
          <div key={qi} className="question">
            <div className="q-title">{qi + 1}. {q.text}</div>
            <div className="options">
              {q.options.map((opt, oi) => (
                <label key={oi} className={`option ${answers[qi] === oi ? "selected" : ""}`}>
                  <input type="radio" name={`q-${qi}`} onChange={() => setAnswers((arr) => arr.map((v, idx) => (idx === qi ? oi : v)))} />
                  {opt}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button className="primary" onClick={submit}>Узнать трек</button>
    </div>
  );
};

const Home = ({ subscriptionActive, onCTA, onTrackComplete, track, leaderboard, profile, onSaveProfile }) => {
  const merged = leaderboard.map((u) => (u.id === "you" ? { ...u, points: profile.points } : u));
  const top = [...merged].sort((a, b) => b.points - a.points).slice(0, 3);
  const [form, setForm] = useState({ firstName: profile.firstName, lastName: profile.lastName, phone: profile.phone });
  const [showTrackTest, setShowTrackTest] = useState(false);

  const scrollToLeaderboard = () => {
    const el = document.getElementById("leaderboard");
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    if (showTrackTest) {
      const el = document.getElementById("track-test");
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
      const firstInput = el?.querySelector("input");
      firstInput?.focus();
    }
  }, [showTrackTest]);
  return (
    <div className="home">
      <div className="card hero hero-spotlight">
        <div className="hero-inner">
          <p className="hero-kicker">Платформа развития</p>
          <h1 className="hero-title">Будь лучше вчерашнего себя</h1>
          <p className="hero-subtitle">Квесты, контент, форматы, сообщество, игры мышления и персональный путь — все чтобы прокачать себя и становиться сильнее каждый день.</p>
          <div className="quote-panel">
            <Quotes />
          </div>
          <button className="primary hero-cta" onClick={onCTA}>{subscriptionActive ? "Начать учиться" : "Начать обучение"}</button>
          <div className="how-it-works">
            <div>
              <strong>1.</strong>
              <span>Пройди короткую регистрацию</span>
            </div>
            <div>
              <strong>2.</strong>
              <span>Активируй подписку и выбери трек</span>
            </div>
            <div>
              <strong>3.</strong>
              <span>Проходи уроки, квесты, набирай очки</span>
            </div>
          </div>
        </div>
      </div>
      <div className="cta-suggestions">
        <button className="hint-card" onClick={() => setShowTrackTest(true)}>
          <span className="hint-label">Сформировать личный трекшн развития</span>
          <span className="hint-action">Пройти быстрый тест</span>
        </button>
        <button className="hint-card" onClick={scrollToLeaderboard}>
          <span className="hint-label">Лидеры недели</span>
          <span className="hint-action">Посмотреть топ-3</span>
        </button>
      </div>
      <div className="grid home-grid">
        <div className="card mini-track">
          <div className="card-header">Сформировать персональный трек развития</div>
          <p className="meta">Маленькое окно с быстрым доступом к тесту. Узнай, кто ты: командный игрок, коммандир, мыслитель или создатель.</p>
          <p>Ответь на 5 вопросов и получи свой маршрут — сохраним его в профиле и подскажем, с чего начать.</p>
          <button className="primary" onClick={() => setShowTrackTest(true)}>Сформировать личный трекшн развития</button>
          {track && <div className="success">Текущий трек: {track}</div>}
        </div>
        {showTrackTest && <TrackTest onComplete={onTrackComplete} savedTrack={track} />}
        <div className="card" id="leaderboard">
          <div className="card-header">Лидеры недели</div>
          <ul className="leader-list">
            {top.map((u, i) => (
              <li key={u.id}>
                <span>{i + 1}. {u.name}</span>
                <span>{u.points} очков</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="card">
          <div className="card-header">Регистрация / анкета</div>
          <div className="form">
            <label>Имя<input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} /></label>
            <label>Фамилия<input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} /></label>
            <label>Телефон<input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></label>
          </div>
          <button className="primary" onClick={() => onSaveProfile(form)}>Сохранить данные</button>
        </div>
      </div>
    </div>
  );
};

const Library = ({ materials, subscriptionActive }) => {
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();
  const filtered = materials.filter((m) => filter === "all" || m.category === filter);
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>Библиотека материалов</h2>
          <p>Статьи, видео и тесты. Доступ по подписке.</p>
        </div>
        <div className="chip-row">
          <button className={filter === "all" ? "chip active" : "chip"} onClick={() => setFilter("all")}>Все</button>
          {categories.map((c) => (
            <button key={c.id} className={filter === c.id ? "chip active" : "chip"} onClick={() => setFilter(c.id)}>{c.name}</button>
          ))}
        </div>
      </div>
      <div className="grid cards">
        {filtered.map((m) => (
          <div className="card" key={m.id}>
            <div className="card-header">{m.title}</div>
            <div className="meta">{categories.find((c) => c.id === m.category)?.name} • {m.type}</div>
            <p className="desc">{m.description}</p>
            <div className="tag">Доступ по подписке</div>
            <button className="primary" onClick={() => navigate(`/lesson/${m.id}`)}>{subscriptionActive ? "Открыть" : "Нужна подписка"}</button>
          </div>
        ))}
      </div>
    </div>
  );
};

const LessonPage = ({ materials, subscriptionActive, onCompleteLesson, onTestFinish, lastLessonId }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const lesson = materials.find((m) => m.id === id);
  const [answers, setAnswers] = useState([]);
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!lesson) return;
    setAnswers(Array(lesson.questions?.length || 0).fill(null));
  }, [lesson]);

  if (!lesson) return <div className="page">Урок не найден</div>;
  if (!subscriptionActive) {
    return (
      <div className="page">
        <div className="card">
          <div className="card-header">Нужна подписка</div>
          <p>Активируй подписку, чтобы смотреть уроки.</p>
          <button className="primary" onClick={() => navigate("/subscription")}>Оформить</button>
        </div>
      </div>
    );
  }

  const submitTest = () => {
    if (answers.some((a) => a === null)) return alert("Ответь на все вопросы");
    const correct = answers.filter((a, i) => a === lesson.questions[i].answer).length;
    const delta = correct * 10;
    onTestFinish(id, correct, lesson.questions.length, delta);
    setDone(true);
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>{lesson.title}</h2>
          <p className="meta">{lesson.type}</p>
        </div>
        <div className="progress-line">
          <div className="bar" style={{ width: `${done ? 100 : 40}%` }} />
        </div>
      </div>
      <div className="card">
        {lesson.type === "article" && <article className="article" dangerouslySetInnerHTML={{ __html: lesson.content.replace(/\n/g, "<br/>") }} />}
        {lesson.type === "video" && <div className="video-placeholder">Видео будет доступно позже</div>}
        {lesson.type === "quiz" && (
          <div className="test-grid">
            {lesson.questions.map((q, qi) => (
              <div key={qi} className="question">
                <div className="q-title">{qi + 1}. {q.text}</div>
                <div className="options">
                  {q.options.map((opt, oi) => (
                    <label key={oi} className={`option ${answers[qi] === oi ? "selected" : ""}`}>
                      <input type="radio" name={`q-${qi}`} onChange={() => setAnswers((arr) => arr.map((v, idx) => (idx === qi ? oi : v)))} />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
            ))}
            {!done ? <button className="primary" onClick={submitTest}>Пройти тест</button> : <div className="success">Тест завершён</div>}
          </div>
        )}
        {lesson.type !== "quiz" && (
          <button className="primary" onClick={() => { onCompleteLesson(id); setDone(true); }} disabled={done}>
            {done ? "Урок завершён" : "Завершить урок"}
          </button>
        )}
      </div>
      {done && (
        <div className="card">
          <div className="card-header">Урок завершён!</div>
          <p>Поздравляем, урок зачтён. Можно вернуться в библиотеку и выбрать следующий материал.</p>
          <button className="primary" onClick={() => navigate("/library")}>
            Вернуться в библиотеку
          </button>
        </div>
      )}
      {lastLessonId && lastLessonId !== id && (
        <button className="ghost" onClick={() => navigate(`/lesson/${lastLessonId}`)}>Вернуться к последнему уроку</button>
      )}
    </div>
  );
};

const QuestPage = ({ quest, onCompleteStep }) => {
  const [answers, setAnswers] = useState({});
  const currentStep = quest.progress.currentStep;
  const activeStep = quest.steps[currentStep];

  const submit = () => {
    if (!activeStep) return;
    const chosen = answers[activeStep.id] || {};
    if (activeStep.questions.some((_, idx) => chosen[idx] === undefined)) return alert("Ответь на все вопросы");
    onCompleteStep(activeStep, chosen);
    setAnswers({ ...answers, [activeStep.id]: {} });
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>Интеллектуальные квесты</h2>
          <p>Проходи последовательные шаги и получай очки.</p>
        </div>
      </div>
      <div className="grid cards">
        {quest.steps.map((step, idx) => {
          const locked = idx > quest.progress.currentStep;
          const completed = idx < quest.progress.currentStep || quest.progress.completed;
          return (
            <div className="card" key={step.id}>
              <div className="card-header">{step.title}</div>
              <div className="meta">Шаг {idx + 1} из {quest.steps.length}</div>
              {completed && <div className="success">Пройдено</div>}
              {locked && <div className="tag">Откроется после предыдущего шага</div>}
              {!locked && !quest.progress.completed && idx === currentStep && (
                <div className="test-grid">
                  {step.questions.map((q, qi) => (
                    <div key={qi} className="question">
                      <div className="q-title">{q.text}</div>
                      <div className="options">
                        {q.options.map((opt, oi) => (
                          <label key={oi} className={`option ${(answers[step.id]?.[qi] ?? null) === oi ? "selected" : ""}`}>
                            <input type="radio" name={`${step.id}-${qi}`} onChange={() => setAnswers((prev) => ({ ...prev, [step.id]: { ...(prev[step.id] || {}), [qi]: oi } }))} />
                            {opt}
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                  <button className="primary" onClick={submit}>Завершить шаг</button>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {quest.progress.completed && <div className="success">Квест пройден! Достижение «Квест-мастер» начислено.</div>}
    </div>
  );
};

const Community = ({ users, mePoints, onSelectUser }) => {
  const data = [...users.map((u) => (u.id === "you" ? { ...u, points: mePoints } : u))].sort((a, b) => b.points - a.points);
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>Сообщество</h2>
          <p>Таблица лидеров и профили участников.</p>
        </div>
      </div>
      <div className="card">
        <table className="table">
          <thead>
            <tr><th>Имя</th><th>Очки</th><th>Статус</th></tr>
          </thead>
          <tbody>
            {data.map((u) => (
              <tr key={u.id} onClick={() => onSelectUser(u)}>
                <td>{u.name}</td>
                <td>{u.points}</td>
                <td>{statusFromPoints(u.points)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Profile = ({ profile, materials, onContinue, onToggleTask, onSubscriptionLink, theme, toggleTheme, onUpdateProfile }) => {
  const completedCount = Object.keys(profile.completedLessons).length;
  const totalCount = materials.length;
  const progress = Math.round((completedCount / totalCount) * 100);
  const [profileForm, setProfileForm] = useState({
    firstName: profile.firstName || "",
    lastName: profile.lastName || "",
    phone: profile.phone || "",
    password: profile.password || "",
  });

  useEffect(() => {
    setProfileForm({
      firstName: profile.firstName || "",
      lastName: profile.lastName || "",
      phone: profile.phone || "",
      password: profile.password || "",
    });
  }, [profile.firstName, profile.lastName, profile.phone, profile.password]);

  const handleProfileChange = (field) => (e) => {
    const value = e.target.value;
    setProfileForm((prev) => ({ ...prev, [field]: value }));
    onUpdateProfile({ [field]: value });
  };

  return (
    <div className="page">
      <div className="grid profile-grid">
        <div className="card">
          <div className="avatar large">{profile.firstName?.[0] || "Т"}</div>
          <div className="card-header">{profile.firstName} {profile.lastName}</div>
          <p className="meta">Очки: {profile.points} • Статус: {statusFromPoints(profile.points)}</p>
          {profile.track && <p className="meta">Трек: {profile.track}</p>}
          <button className="primary" onClick={onContinue}>Продолжить обучение</button>
          <div className="progress-line">
            <div className="bar" style={{ width: `${progress}%` }} />
          </div>
          <div className="meta">Прогресс: {progress}%</div>
        </div>
        <div className="card">
          <div className="card-header">Достижения</div>
          <ul className="achievements">
            <li className={profile.achievements.firstLesson ? "active" : ""}>Первый урок</li>
            <li className={profile.achievements.firstTest ? "active" : ""}>Первый тест</li>
            <li className={profile.achievements.questMaster ? "active" : ""}>Квест-мастер</li>
            <li className={profile.achievements.streak3 ? "active" : ""}>Серия 3 дня</li>
          </ul>
          <div className="meta">Серия входов: {profile.streak.count} дней подряд</div>
        </div>
        <div className="card">
          <div className="card-header">Практические задания</div>
          <ul className="tasks">
            {practicalTasks.map((t) => (
              <li key={t.id}>
                <label>
                  <input type="checkbox" checked={profile.practical[t.id]} onChange={() => onToggleTask(t.id)} />
                  <div>
                    <strong>{t.title}</strong>
                    <p>{t.desc}</p>
                  </div>
                </label>
              </li>
            ))}
          </ul>
        </div>
        <div className={`card subscription ${profile.subscriptionActive ? "active" : ""}`}>
          <div className="card-header">Текущая подписка</div>
          <p>{profile.subscriptionActive ? "Активна" : "Не активна"}</p>
          <button className="primary" onClick={onSubscriptionLink}>Управление подпиской</button>
        </div>
        <div className="card">
          <div className="card-header">Настройки</div>
          <div className="form">
            <label>Имя<input value={profileForm.firstName} onChange={handleProfileChange("firstName")} /></label>
            <label>Фамилия<input value={profileForm.lastName} onChange={handleProfileChange("lastName")} /></label>
            <label>Телефон<input value={profileForm.phone} onChange={handleProfileChange("phone")} /></label>
            <label>Пароль<input value={profileForm.password} onChange={handleProfileChange("password")} /></label>
          </div>
          <button className="ghost" onClick={toggleTheme}>Сменить тему ({theme})</button>
          <button className="ghost" onClick={() => onUpdateProfile({ reset: true })}>Выйти из аккаунта</button>
        </div>
        <div className="card">
          <div className="card-header">Помощь</div>
          <a href="/help" className="link">FAQ и поддержка</a>
          <a href="https://t.me/yourproject" className="link" target="_blank" rel="noreferrer">Telegram-чат</a>
        </div>
      </div>
    </div>
  );
};

const SubscriptionPage = ({ active, onToggle }) => (
  <div className="page">
    <div className="card">
      <div className="card-header">Подписка</div>
      <p>Для кого: подростки 13–20. Доступ к материалам, квестам, прогрессу и достижениям. Оплаты нет — это учебный прототип.</p>
      <button className="primary" onClick={onToggle}>{active ? "Подписка активна" : "Активировать подписку"}</button>
      {active && <p className="success">Доступ разблокирован!</p>}
    </div>
  </div>
);

const AdminPage = ({ users, onChangePoints, materials, onAddMaterial, onRemoveMaterial }) => {
  const [draft, setDraft] = useState({ id: "", title: "", category: "thinking", type: "article", description: "", content: "" });
  return (
    <div className="page">
      <div className="grid cards">
        <div className="card">
          <div className="card-header">Пользователи</div>
          {users.map((u) => (
            <div key={u.id} className="admin-row">
              <span>{u.name}</span>
              <div className="admin-actions">
                <button onClick={() => onChangePoints(u.id, -10)}>-10</button>
                <button onClick={() => onChangePoints(u.id, 10)}>+10</button>
                <span>{u.points} очков</span>
              </div>
            </div>
          ))}
        </div>
        <div className="card">
          <div className="card-header">Материалы</div>
          <div className="form">
            <label>ID<input value={draft.id} onChange={(e) => setDraft({ ...draft, id: e.target.value })} /></label>
            <label>Название<input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} /></label>
            <label>Категория<select value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })}>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
            <label>Тип<select value={draft.type} onChange={(e) => setDraft({ ...draft, type: e.target.value })}>
              <option value="article">статья</option>
              <option value="video">видео</option>
              <option value="quiz">тест</option>
            </select></label>
            <label>Описание<textarea value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} /></label>
            <label>Контент<textarea value={draft.content} onChange={(e) => setDraft({ ...draft, content: e.target.value })} /></label>
            <button className="primary" onClick={() => onAddMaterial(draft)}>Добавить</button>
          </div>
          <ul className="simple-list">
            {materials.map((m) => (
              <li key={m.id}>
                <span>{m.title}</span>
                <button onClick={() => onRemoveMaterial(m.id)}>Удалить</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

const HelpPage = ({ onIdea }) => {
  const [form, setForm] = useState({ topic: "", description: "" });
  const submit = () => {
    if (!form.topic || !form.description) return alert("Заполни все поля");
    onIdea(form);
    setForm({ topic: "", description: "" });
    alert("Спасибо! Мы внимательно рассмотрим твою идею.");
  };
  return (
    <div className="page">
      <div className="card">
        <div className="card-header">Частые вопросы</div>
        <ul className="faq">
          {faqItems.map((f, i) => (
            <li key={i}>
              <strong>{f.q}</strong>
              <p>{f.a}</p>
            </li>
          ))}
        </ul>
        <a href="https://t.me/cfjbkevbbv" target="_blank" rel="noreferrer" className="primary outline">Нужна помощь? Telegram</a>
      </div>
      <div className="card">
        <div className="card-header">Поддержка и контакты</div>
        <ul className="contact-list">
          <li><a href="https://t.me/whohatesme" target="_blank" rel="noreferrer">@whohatesme</a> — FOUNDER, поможет с запуском, идеями и партнёрствами.</li>
          <li><a href="https://t.me/bohdan162" target="_blank" rel="noreferrer">@bohdan162</a> — CoFOUNDER, отвечает за продукты и комьюнити.</li>
        </ul>
      </div>
      <div className="card">
        <div className="card-header">О нас</div>
        <p>Мы — команда долларовых триллионеров из Силиконовой долины, которые решили сделать доступный тренажёр предпринимательского мышления для подростков.</p>
        <p>Запускаем продукты, собираем комьюнити и верим в силу любопытства. Ставим эксперименты, находим инсайты и делимся ими с тобой без paywall.</p>
        <p>Наша цель — чтобы каждый смог выбрать собственный путь: строить бизнес, создавать технологии или формировать команды мечты.</p>
      </div>
      <div className="card">
        <div className="card-header">Предложить идею</div>
        <div className="form">
          <label>Тема<input value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} /></label>
          <label>Описание<textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
        </div>
        <button className="primary" onClick={submit}>Отправить</button>
      </div>
    </div>
  );
};

const CommunityProfileModal = ({ user, onClose }) => {
  if (!user) return null;
  return (
    <div className="modal">
      <div className="modal-content">
        <div className="card-header">{user.name}</div>
        <p>Очки: {user.points}</p>
        <p>Статус: {statusFromPoints(user.points)}</p>
        <p>Достижения: «Первый урок», «Первый тест» (пример)</p>
        <button className="ghost" onClick={onClose}>Закрыть</button>
      </div>
    </div>
  );
};

function App() {
  const [state, setState] = usePersistedState();
  const status = statusFromPoints(state.profile.points);

  const toggleTheme = () => setState((prev) => ({ ...prev, theme: prev.theme === "dark" ? "light" : "dark" }));

  const addPoints = (amount) => setState((prev) => ({ ...prev, profile: { ...prev.profile, points: prev.profile.points + amount } }));

  const completeLesson = (id) => {
    setState((prev) => {
      if (prev.profile.completedLessons[id]) return prev;
      const achievements = { ...prev.profile.achievements };
      achievements.firstLesson = true;
      const updatedProfile = {
        ...prev.profile,
        completedLessons: { ...prev.profile.completedLessons, [id]: true },
        lastLessonId: id,
        achievements,
        points: prev.profile.points + 20,
      };
      return { ...prev, profile: updatedProfile };
    });
  };

  const finishTest = (id, correct, total, delta) => {
    setState((prev) => {
      const achievements = { ...prev.profile.achievements, firstTest: true };
      return {
        ...prev,
        profile: {
          ...prev.profile,
          testResults: { ...prev.profile.testResults, [id]: { correct, total } },
          points: prev.profile.points + delta,
          achievements,
          lastLessonId: id,
          completedLessons: { ...prev.profile.completedLessons, [id]: true },
        },
      };
    });
  };

  const toggleSubscription = () => setState((prev) => ({ ...prev, profile: { ...prev.profile, subscriptionActive: !prev.profile.subscriptionActive } }));

  const completeQuestStep = (step, answers) => {
    setState((prev) => {
      const isLast = prev.quest.progress.currentStep === prev.quest.steps.length - 1;
      const basePoints = step.questions.length * 10;
      const bonus = isLast ? 30 : 0;
      const achievements = { ...prev.profile.achievements };
      const nextStep = isLast ? prev.quest.progress.currentStep : prev.quest.progress.currentStep + 1;
      const completed = isLast;
      if (completed) achievements.questMaster = true;
      return {
        ...prev,
        profile: { ...prev.profile, points: prev.profile.points + basePoints + bonus, achievements },
        quest: { ...prev.quest, progress: { ...prev.quest.progress, currentStep: nextStep, completed } },
      };
    });
  };

  const togglePractical = (id) => {
    setState((prev) => {
      const newValue = !prev.profile.practical[id];
      return {
        ...prev,
        profile: {
          ...prev.profile,
          practical: { ...prev.profile.practical, [id]: newValue },
          points: prev.profile.points + (newValue ? 5 : -5),
        },
      };
    });
  };

  const updateProfile = (payload) => {
    if (payload.reset) {
      localStorage.removeItem("ep_state");
      window.location.reload();
      return;
    }
    setState((prev) => ({ ...prev, profile: { ...prev.profile, ...payload } }));
  };

  const changeUserPoints = (id, delta) => {
    setState((prev) => ({
      ...prev,
      users: prev.users.map((u) => (u.id === id ? { ...u, points: u.points + delta } : u)),
      profile: id === "you" ? { ...prev.profile, points: prev.profile.points + delta } : prev.profile,
    }));
  };

  const addMaterial = (draft) => {
    if (!draft.id || !draft.title) return alert("Нужен id и название");
    setState((prev) => ({ ...prev, materials: [...prev.materials.filter((m) => m.id !== draft.id), draft] }));
  };

  const removeMaterial = (id) => setState((prev) => ({ ...prev, materials: prev.materials.filter((m) => m.id !== id) }));

  const submitIdea = (idea) => setState((prev) => ({ ...prev, ideas: [...prev.ideas, { ...idea, date: new Date().toISOString() }] }));

  const recordTrack = (track) => setState((prev) => ({ ...prev, profile: { ...prev.profile, track } }));

  const [selectedUser, setSelectedUser] = useState(null);

  const HomePage = () => {
    const navigate = useNavigate();
    return (
      <Home
        subscriptionActive={state.profile.subscriptionActive}
        onCTA={() => navigate(state.profile.subscriptionActive ? "/library" : "/subscription")}
        onTrackComplete={recordTrack}
        track={state.profile.track}
        leaderboard={state.users}
        profile={state.profile}
        onSaveProfile={updateProfile}
      />
    );
  };

  const ProfilePage = () => {
    const navigate = useNavigate();
    const go = () => {
      const id = state.profile.lastLessonId || state.materials[0]?.id;
      navigate(id ? `/lesson/${id}` : "/library");
    };
    return (
      <Profile
        profile={state.profile}
        materials={state.materials}
        onContinue={go}
        onToggleTask={togglePractical}
        onSubscriptionLink={() => navigate("/subscription")}
        theme={state.theme}
        toggleTheme={toggleTheme}
        onUpdateProfile={updateProfile}
      />
    );
  };

  return (
    <BrowserRouter>
      <Layout theme={state.theme} toggleTheme={toggleTheme} subscriptionActive={state.profile.subscriptionActive}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/library" element={<Library materials={state.materials} subscriptionActive={state.profile.subscriptionActive} />} />
          <Route
            path="/lesson/:id"
            element={
              <LessonPage
                materials={state.materials}
                subscriptionActive={state.profile.subscriptionActive}
                onCompleteLesson={completeLesson}
                onTestFinish={finishTest}
                lastLessonId={state.profile.lastLessonId}
              />
            }
          />
          <Route path="/quests" element={<QuestPage quest={state.quest} onCompleteStep={completeQuestStep} />} />
          <Route path="/community" element={<Community users={state.users} mePoints={state.profile.points} onSelectUser={(u) => setSelectedUser(u)} />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/subscription" element={<SubscriptionPage active={state.profile.subscriptionActive} onToggle={toggleSubscription} />} />
          <Route
            path="/admin"
            element={
              <AdminPage
                users={state.users.map((u) => (u.id === "you" ? { ...u, points: state.profile.points } : u))}
                onChangePoints={changeUserPoints}
                materials={state.materials}
                onAddMaterial={addMaterial}
                onRemoveMaterial={removeMaterial}
              />
            }
          />
          <Route path="/help" element={<HelpPage onIdea={submitIdea} />} />
        </Routes>
        <CommunityProfileModal user={selectedUser} onClose={() => setSelectedUser(null)} />
      </Layout>
    </BrowserRouter>
  );
}

export default App;
