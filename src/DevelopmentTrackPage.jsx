import React, { useMemo, useState } from "react";
import { Link } from "./routerShim";

const profiles = {
  founder: {
    title: "Будущий основатель бизнеса",
    description:
      "Ты заряжен на запуск собственных проектов, готов брать ответственность и рисковать ради результата. Тебя двигает желание проверять идеи в реальности и зарабатывать на том, что создаёшь.",
    growth:
      "Чтобы ускориться, учись просчитывать риски, работать с клиентами и оформлять свои идеи так, чтобы их понимали другие. Дисциплина и фокус помогут доводить задумки до конца.",
  },
  strategist: {
    title: "Исследователь и стратег",
    description:
      "Тебе интересно разбираться, как устроены рынки, цифры и процессы. Ты любишь анализировать, строить планы и находить системные решения, которые делают проект устойчивым.",
    growth:
      "Развивай финансовую грамотность, учись приоритизировать задачи и тренируй навыки упаковки идей. Тебе помогут инструменты планирования и понимание, как тестировать гипотезы малыми шагами.",
  },
  leader: {
    title: "Лидер команды и коммуникатор",
    description:
      "Ты сильнее всего проявляешься рядом с людьми: умеешь вдохновлять, договариваться и создавать атмосферу, в которой команда хочет работать. Тебе важны отношения и совместный результат.",
    growth:
      "Прокачивай эмоциональный интеллект, навыки презентации и клиентоориентированность. Учись вести переговоры, поддерживать команду в сложностях и при этом держать высокие стандарты.",
  },
};

// Каждая опция даёт очки одному или нескольким профилям. Итоговый профиль — тот, у кого сумма баллов выше всего.
const questions = [
  {
    id: "motivation",
    text: "Что тебя больше всего вдохновляет в проектах?",
    options: [
      { text: "Запускать свои идеи и видеть результат в мире", scores: { founder: 2 } },
      { text: "Разбираться в информации и строить систему действий", scores: { strategist: 2 } },
      { text: "Объединять людей и вести команду", scores: { leader: 2 } },
    ],
  },
  {
    id: "discipline",
    text: "Как ты относишься к дисциплине?",
    options: [
      { text: "Это мой инструмент — люблю ставить цели и идти по плану", scores: { strategist: 2, founder: 1 } },
      { text: "Нужен гибкий режим: важно, но без жёстких правил", scores: { leader: 1, founder: 1 } },
      { text: "Сложно удерживать режим, нужна поддержка и напоминания", scores: { leader: 1 } },
    ],
  },
  {
    id: "people",
    text: "Как тебе работать с людьми?",
    options: [
      { text: "Обожаю общаться, помогать и собирать вокруг себя", scores: { leader: 2 } },
      { text: "Нравится, когда роли понятны и процессы настроены", scores: { strategist: 2 } },
      { text: "Предпочитаю делать самому, подключаю людей под задачу", scores: { founder: 2 } },
    ],
  },
  {
    id: "numbers",
    text: "Как ты работаешь с цифрами и фактами?",
    options: [
      { text: "Люблю считать, моделировать и проверять гипотезы", scores: { strategist: 2 } },
      { text: "Использую базовые расчёты, чтобы понять, взлетит ли идея", scores: { founder: 2 } },
      { text: "Предпочитаю истории и людей, а цифры беру у аналитиков", scores: { leader: 2 } },
    ],
  },
  {
    id: "risk",
    text: "Что для тебя риск?",
    options: [
      { text: "Двигатель — готов тестировать и учиться на ошибках", scores: { founder: 2 } },
      { text: "То, что нужно заранее просчитать и снизить", scores: { strategist: 2 } },
      { text: "Важно идти в риски вместе с командой и поддержкой", scores: { leader: 1, founder: 1 } },
    ],
  },
  {
    id: "selfEducation",
    text: "Как ты учишься новому?",
    options: [
      { text: "Сам ищу материалы, пробую и быстро применяю", scores: { founder: 2 } },
      { text: "Составляю план, делаю конспекты и сверяюсь с целями", scores: { strategist: 2 } },
      { text: "Лучше через общение: обсуждения, наставники, команда", scores: { leader: 2 } },
    ],
  },
  {
    id: "responsibility",
    text: "Как ты реагируешь на ответственность?",
    options: [
      { text: "Беру на себя и двигаю проект вперёд", scores: { founder: 2 } },
      { text: "Распределяю роли и контролирую процесс", scores: { strategist: 2 } },
      { text: "Помогаю другим включиться и поддерживаю команду", scores: { leader: 2 } },
    ],
  },
  {
    id: "leadership",
    text: "Что для тебя лидерство?",
    options: [
      { text: "Запустить идею и показать пример действием", scores: { founder: 2, leader: 1 } },
      { text: "Поставить цель, план и метрики, а потом довести", scores: { strategist: 2 } },
      { text: "Слушать людей, вдохновлять и помогать расти", scores: { leader: 2 } },
    ],
  },
  {
    id: "empathy",
    text: "Как ты относишься к эмоциям людей вокруг?",
    options: [
      { text: "Считываю атмосферу и хочу, чтобы всем было комфортно", scores: { leader: 2 } },
      { text: "Важно понимать эмоции, чтобы лучше договариваться", scores: { strategist: 1, leader: 1 } },
      { text: "Если эмоции не мешают делу, могу их не замечать", scores: { founder: 2 } },
    ],
  },
  {
    id: "communication",
    text: "Как тебе публичные выступления и презентации?",
    options: [
      { text: "Люблю выступать и чувствую себя уверенно", scores: { leader: 2 } },
      { text: "Готовлю структуру и аргументы, чтобы убедить", scores: { strategist: 2 } },
      { text: "Выступаю, когда нужно продать идею или привлечь ресурсы", scores: { founder: 2 } },
    ],
  },
];

const trackRecommendations = {
  founder: [
    "entrepreneurial-thinking-risk",
    "marketing-packaging",
    "sales-negotiations",
    "client-service-value",
    "habits-discipline",
    "teamwork-leadership",
  ],
  strategist: [
    "teen-financial-literacy",
    "personal-productivity",
    "entrepreneurial-thinking-risk",
    "marketing-packaging",
    "presentation-skills",
    "client-service-value",
  ],
  leader: [
    "emotional-intelligence",
    "teamwork-leadership",
    "presentation-skills",
    "sales-negotiations",
    "client-service-value",
    "habits-discipline",
  ],
};

const DevelopmentTrackPage = ({ materials = [], onSaveTrack }) => {
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const allAnswered = questions.every((q) => answers[q.id] !== undefined);

  const handleSubmit = () => {
    if (!allAnswered) return;
    const totals = { founder: 0, strategist: 0, leader: 0 };

    questions.forEach((q) => {
      const optionIndex = answers[q.id];
      const option = q.options[optionIndex];
      // Каждая опция хранит очки, которые добавляются выбранным профилям.
      Object.entries(option.scores).forEach(([profileKey, points]) => {
        totals[profileKey] += points;
      });
    });

    const winner = Object.keys(totals).reduce((best, current) =>
      totals[current] > totals[best] ? current : best
    , "founder");

    const computed = { key: winner, totals, profile: profiles[winner] };
    setResult(computed);
    if (onSaveTrack) onSaveTrack(profiles[winner].title);
  };

  const recommendedMaterials = useMemo(() => {
    if (!result) return [];
    const ids = trackRecommendations[result.key] || [];
    return ids
      .map((id) => materials.find((m) => m.id === id))
      .filter(Boolean);
  }, [materials, result]);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Личный трек развития</h1>
          <p>
            Этот трек помогает подросткам-предпринимателям понять свои сильные стороны, зоны роста и получить
            понятный маршрут по материалам библиотеки.
          </p>
          <p>
            Ответь на вопросы ниже, чтобы получить профиль и подборку шагов. Результат останется на странице и поможет
            вернуться к материалам в нужном порядке.
          </p>
        </div>
        <Link to="/" className="ghost">На главную</Link>
      </div>

      <div className="card">
        <div className="card-header">Ответь на 10 вопросов</div>
        <div className="test-grid">
          {questions.map((q, idx) => (
            <div key={q.id} className="question">
              <div className="q-title">{idx + 1}. {q.text}</div>
              <div className="options">
                {q.options.map((opt, oi) => (
                  <label
                    key={oi}
                    className={`option ${answers[q.id] === oi ? "selected" : ""}`}
                  >
                    <input
                      type="radio"
                      name={q.id}
                      onChange={() => setAnswers({ ...answers, [q.id]: oi })}
                    />
                    {opt.text}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
        <button className="primary" onClick={handleSubmit} disabled={!allAnswered}>
          Сформировать мой трек развития
        </button>
        {!allAnswered && <p className="meta">Заполни все ответы, чтобы кнопка стала активной.</p>}
      </div>

      {result && (
        <div className="grid cards">
          <div className="card">
            <div className="card-header">Ты сейчас ближе всего к профилю: {result.profile.title}</div>
            <p>{result.profile.description}</p>
            <p>{result.profile.growth}</p>
          </div>
          <div className="card">
            <div className="card-header">Твой трек развития</div>
            {recommendedMaterials.length === 0 && <p>Материалы скоро появятся.</p>}
            <div className="grid cards">
              {recommendedMaterials.map((item, idx) => (
                <div className="card" key={item.id}>
                  <div className="meta">Шаг {idx + 1}</div>
                  <div className="card-header">{item.title}</div>
                  <p className="desc">{item.description}</p>
                  <Link to={`/lesson/${item.id}`} className="primary outline">Читать</Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DevelopmentTrackPage;
