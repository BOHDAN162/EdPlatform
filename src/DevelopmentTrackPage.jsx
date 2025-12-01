import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "./routerShim";

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

const profileTracks = {
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
};

const StrategyTimeline = ({ steps, completedStepIds, completedMaterialIds = [], onReset }) => {
  const completed = new Set(completedStepIds || []);
  const materialCompleted = new Set(completedMaterialIds || []);
  const doneCount = steps.filter((step) => completed.has(step.id) || materialCompleted.has(step.materialId)).length;
  const midIndex = Math.ceil(steps.length / 2);
  const topRow = steps.slice(0, midIndex);
  const bottomRow = steps.slice(midIndex);

  const renderStep = (step, idx) => {
    const done = completed.has(step.id) || materialCompleted.has(step.materialId);
    const active = !done && idx === doneCount;
    const shortTitle = step.title?.length > 28 ? `${step.title.slice(0, 26)}…` : step.title;
    return (
      <Link
        key={step.id}
        to={`/material/${step.materialId}`}
        className={`timeline-node ${done ? "done" : ""} ${active ? "active" : ""}`}
      >
        <span className="node-index">{done ? "✓" : `Этап ${idx + 1}`}</span>
        <span className="node-title">{shortTitle}</span>
      </Link>
    );
  };

  return (
    <div className="timeline-card">
      <div className="timeline-header">
        <div>
          <div className="card-header">Личный трек развития</div>
          <p className="meta">Твой путь из {steps.length} шагов — от старта до первых результатов</p>
        </div>
        {onReset && (
          <button className="ghost" onClick={onReset}>
            Сбросить трек и пройти опрос заново
          </button>
        )}
      </div>
      <div className="timeline-grid">
        <div className="timeline-row">
          {topRow.map((step, idx) => renderStep(step, idx))}
        </div>
        {bottomRow.length > 0 && (
          <div className="timeline-connector">
            <div className="down-connector" />
          </div>
        )}
        {bottomRow.length > 0 && (
          <div className="timeline-row">
            {bottomRow.map((step, idx) => renderStep(step, idx + topRow.length))}
          </div>
        )}
      </div>
      <p className="meta">Выполнено {doneCount} из {steps.length} шагов</p>
    </div>
  );
};

const buildTrack = (profileKey, libraryIndex) => {
  const trackScheme = profileTracks[profileKey] || [];
  const steps = trackScheme.map((entry, idx) => {
    const material = libraryIndex[entry.materialType][entry.materialId];
    return {
      id: `${profileKey}-${idx + 1}`,
      order: idx + 1,
      materialId: entry.materialId,
      materialType: entry.materialType,
      title: material?.title || "Материал",
    };
  });
  return steps;
};

const DevelopmentTrackPage = ({ libraryMaterials, userId, savedTrack, onTrackSave, onTrackReset, completedMaterialIds }) => {
  const [answers, setAnswers] = useState({});
  const [currentTrack, setCurrentTrack] = useState(savedTrack);

  const allAnswered = questions.every((q) => answers[q.id] !== undefined);
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentTrack(savedTrack);
  }, [savedTrack]);

  const libraryIndex = useMemo(() => {
    const byType = { course: {}, article: {}, test: {} };
    (libraryMaterials || []).forEach((m) => {
      if (!byType[m.type]) byType[m.type] = {};
      byType[m.type][m.id] = m;
    });
    return byType;
  }, [libraryMaterials]);

  const handleSubmit = () => {
    if (!allAnswered) return;
    const totals = { founder: 0, strategist: 0, leader: 0 };

    questions.forEach((q) => {
      const optionIndex = answers[q.id];
      const option = q.options[optionIndex];
      Object.entries(option.scores).forEach(([profileKey, points]) => {
        totals[profileKey] += points;
      });
    });

    const winner = Object.keys(totals).reduce((best, current) => (totals[current] > totals[best] ? current : best), "founder");
    const steps = buildTrack(winner, libraryIndex);
    const payload = {
      profileKey: winner,
      profileType: profiles[winner].title,
      description: profiles[winner].description,
      growth: profiles[winner].growth,
      generatedTrack: steps,
      completedStepIds: [],
    };
    setCurrentTrack(payload);
    onTrackSave?.(payload);
  };

  const profileTitle = currentTrack ? profiles[currentTrack.profileKey]?.title || currentTrack.profileType : null;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Личный трек развития</h1>
          <p>
            Этот трек помогает подросткам-предпринимателям понять свои сильные стороны, зоны роста и получить понятный маршрут по материалам библиотеки.
          </p>
          <p>
            Ответь на вопросы ниже, чтобы получить профиль и подборку шагов. Результат останется на странице и поможет вернуться к материалам в нужном порядке.
          </p>
        </div>
        <Link to="/" className="ghost">
          На главную
        </Link>
      </div>

      {!currentTrack && (
        <div className="card">
          <div className="card-header">Ответь на 10 вопросов</div>
          <div className="test-grid">
            {questions.map((q, idx) => (
              <div key={q.id} className="question">
                <div className="q-title">
                  {idx + 1}. {q.text}
                </div>
                <div className="options">
                  {q.options.map((opt, oi) => (
                    <label key={oi} className={`option ${answers[q.id] === oi ? "selected" : ""}`}>
                      <input type="radio" name={q.id} onChange={() => setAnswers({ ...answers, [q.id]: oi })} />
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
      )}

      {currentTrack && (
        <div className="card result-card">
          <div className="card-header">Поздравляем! Твой личный трек развития готов.</div>
          <p className="meta">Ты сейчас ближе всего к профилю: {profileTitle}.</p>
          <p>{currentTrack.description}</p>
          <p>{currentTrack.growth}</p>
          <StrategyTimeline
            steps={currentTrack.generatedTrack}
            completedStepIds={currentTrack.completedStepIds}
            completedMaterialIds={completedMaterialIds}
            onReset={() => {
              setAnswers({});
              setCurrentTrack(null);
              onTrackReset?.();
            }}
          />
          <div className="actions">
            <button className="primary" onClick={() => navigate("/library")}>Перейти к материалам</button>
            <button className="ghost" onClick={() => navigate("/profile")}>В профиль</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DevelopmentTrackPage;
