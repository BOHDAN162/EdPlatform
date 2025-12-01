import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "./routerShim";
import { getMaterialById, themeLabels } from "./libraryData";
import { tests } from "./data";
import { getXPRewards } from "./gamification";

const blockRenderers = {
  heading: (block, idx) => (
    <h2 key={idx} className="lesson-heading">
      {block.text}
    </h2>
  ),
  paragraph: (block, idx) => (
    <p key={idx} className="lesson-paragraph">
      {block.text}
    </p>
  ),
  highlight: (block, idx) => (
    <div key={idx} className="lesson-highlight">
      <div className="highlight-title">Запомни</div>
      <p>{block.text}</p>
    </div>
  ),
  quote: (block, idx) => (
    <blockquote key={idx} className="lesson-quote">
      {block.text}
    </blockquote>
  ),
  callout: (block, idx) => (
    <div key={idx} className="lesson-callout">
      <div className="callout-title">Действие</div>
      <p>{block.text}</p>
    </div>
  ),
  divider: (_, idx) => <hr key={idx} className="lesson-divider" />,
};

const typeLabels = {
  course: "Курс",
  article: "Лонгрид",
  test: "Тест",
  practice: "Практика",
};

const useReflection = (materialId) => {
  const storageKey = `ep_reflection_${materialId}`;
  const [value, setValue] = useState(() => localStorage.getItem(storageKey) || "");
  useEffect(() => {
    localStorage.setItem(storageKey, value);
  }, [storageKey, value]);
  return [value, setValue];
};

const useInlineQuizState = (materialId) => {
  const storageKey = `ep_quiz_${materialId}`;
  const [completed, setCompleted] = useState(() => localStorage.getItem(storageKey) === "done");
  const markCompleted = () => {
    localStorage.setItem(storageKey, "done");
    setCompleted(true);
  };
  return { completed, markCompleted };
};

const InlineQuiz = ({ materialId, quiz, onComplete, alreadyCompleted }) => {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [finished, setFinished] = useState(false);
  const { completed, markCompleted } = useInlineQuizState(materialId);

  if (!quiz || !quiz.questions?.length) return null;

  const currentQuestion = quiz.questions[index];
  const total = quiz.questions.length;

  const selectOption = (optionId) => {
    if (finished) return;
    const updatedAnswers = { ...answers, [currentQuestion.id]: optionId };
    setAnswers(updatedAnswers);
    const isCorrect = optionId === currentQuestion.correctOptionId;
    setFeedback({
      correct: isCorrect,
      message: isCorrect ? "Верно! Ты цепляешься за главную мысль." : "Немного мимо, сравни с правильным вариантом и попробуй ещё раз.",
      correctOption: currentQuestion.options.find((o) => o.id === currentQuestion.correctOptionId)?.label,
    });
  };

  const nextQuestion = () => {
    setFeedback(null);
    if (index + 1 < total) {
      setIndex((i) => i + 1);
    } else {
      const correctCount = quiz.questions.reduce(
        (acc, q) => acc + (answers[q.id] === q.correctOptionId ? 1 : 0),
        0
      );
      setFinished(true);
      if (!completed && correctCount / total >= 0.6) {
        markCompleted();
        onComplete();
      }
    }
  };

  const restart = () => {
    setFeedback(null);
    setAnswers({});
    setFinished(false);
    setIndex(0);
  };

  const correctCount = quiz.questions.reduce((acc, q) => acc + (answers[q.id] === q.correctOptionId ? 1 : 0), 0);
  const passed = correctCount / total >= 0.6;

  return (
    <div className="card inline-quiz">
      <div className="card-header">Проверка себя</div>
      {!finished && <p className="meta">Вопрос {index + 1} из {total}</p>}
      {finished ? (
        <div className="quiz-summary">
          <div className="big-number">{correctCount} / {total}</div>
          <p className="meta">{passed ? "Класс, можно двигаться дальше!" : "Попробуй ещё раз и закрепи знания."}</p>
          <div className="quiz-actions">
            <button className="primary" onClick={restart}>Повторить</button>
          </div>
          {completed && <div className="chip success">XP уже получен за этот квиз</div>}
        </div>
      ) : (
        <>
          <div className="quiz-question">
            <div className="quiz-title">{currentQuestion.question}</div>
            <div className="quiz-options">
              {currentQuestion.options.map((opt) => {
                const selected = answers[currentQuestion.id] === opt.id;
                const isCorrect = feedback && opt.id === currentQuestion.correctOptionId;
                const isWrong = feedback && selected && !isCorrect;
                return (
                  <button
                    key={opt.id}
                    className={`quiz-option ${selected ? "selected" : ""} ${isCorrect ? "correct" : ""} ${isWrong ? "wrong" : ""}`}
                    onClick={() => selectOption(opt.id)}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
          {feedback && (
            <div className={`quiz-feedback ${feedback.correct ? "success" : ""}`}>
              <div className="quiz-feedback-title">{feedback.correct ? "Верно" : "Ответ"}</div>
              <p>{feedback.correct ? feedback.message : `Правильно: ${feedback.correctOption}`}</p>
              <button className="primary outline" onClick={nextQuestion}>Дальше</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const defaultBlocks = (material) => [
  { type: "heading", text: material.title },
  { type: "paragraph", text: material.description || "Короткий материал" },
  {
    type: "highlight",
    text: "Выдели одну мысль и зафиксируй, как применишь её сегодня.",
  },
];

const ensureBlocks = (material) => {
  if (material.contentBlocks?.length) return material.contentBlocks;
  if (material.content?.length) {
    return [
      { type: "heading", text: material.title },
      { type: "paragraph", text: material.content },
      { type: "highlight", text: material.description || "Главная идея материала." },
    ];
  }
  return defaultBlocks(material);
};

const quizFromTest = (materialId) => {
  const test = tests.find((t) => t.id === materialId);
  if (!test) return null;
  return {
    questions: test.questions.map((q, idx) => ({
      id: `${materialId}-${idx}`,
      question: q.text,
      options: q.options.map((opt, optIdx) => ({ id: `${materialId}-${idx}-${optIdx}`, label: opt })),
      correctOptionId: `${materialId}-${idx}-${q.answer}`,
    })),
  };
};

const lessonStatusLabel = (completed, inProgress) => {
  if (completed) return "Завершён";
  if (inProgress) return "В процессе";
  return "Не начат";
};

const MaterialPage = ({
  user,
  gamification,
  progress,
  trackData,
  onMaterialComplete,
  onQuizComplete,
  onAskCommunity,
}) => {
  const { materialId } = useParams();
  const navigate = useNavigate();
  const material = getMaterialById(materialId);
  const completedSet = useMemo(() => new Set(progress?.completedMaterialIds || []), [progress?.completedMaterialIds]);
  const [reflection, setReflection] = useReflection(materialId);
  const [questionOpen, setQuestionOpen] = useState(false);
  const [questionText, setQuestionText] = useState("");
  const xp = getXPRewards();

  const inlineQuiz = useMemo(() => material?.inlineQuiz || quizFromTest(materialId), [material, materialId]);

  const trackSteps = trackData?.generatedTrack || [];
  const currentIndex = trackSteps.findIndex((s) => s.materialId === materialId);
  const trackTitle = trackData?.title || trackData?.trackName;
  const nextStep = currentIndex >= 0 ? trackSteps[currentIndex + 1] : null;
  const nextMaterial = nextStep ? getMaterialById(nextStep.materialId) : null;

  useEffect(() => {
    if (!material) return;
    document.title = `${material.title} — NOESIS`;
  }, [material]);

  if (!material) {
    return (
      <div className="page">
        <div className="card">
          <p>Материал не найден.</p>
          <button className="ghost" onClick={() => navigate(-1)}>Назад</button>
        </div>
      </div>
    );
  }

  const theme = themeLabels[material.theme] || { accent: "#6b7280", title: "Тема" };
  const completed = completedSet.has(materialId);

  const blocks = ensureBlocks(material);

  const handleComplete = () => {
    if (onMaterialComplete) onMaterialComplete(material.id, material.type);
  };

  const handleQuizFinish = () => {
    if (onQuizComplete) onQuizComplete(material.id, xp.inlineQuiz);
    if (!completed) {
      handleComplete();
    }
  };

  const submitQuestion = () => {
    if (!questionText.trim()) return;
    onAskCommunity?.(material, questionText);
    setQuestionText("");
    setQuestionOpen(false);
  };

  const statusLabel = lessonStatusLabel(completed, false);

  const trackBreadcrumb = currentIndex >= 0 ? `Трек: ${trackTitle || "Личный трек"} · Шаг ${currentIndex + 1} из ${trackSteps.length}` : null;

  return (
    <div className="page material-page">
      <div className="page-header">
        <div>
          <p className="meta subtle">{trackBreadcrumb || "Самостоятельный материал"}</p>
          <h1>{material.title}</h1>
          <p className="meta">{material.description}</p>
        </div>
        <button className="ghost" onClick={() => navigate(-1)}>Назад</button>
      </div>

      <div className="material-layout">
        <div className="material-content">
          {blocks.map((block, idx) => (blockRenderers[block.type] || blockRenderers.paragraph)(block, idx))}

          <div className="reflection-card">
            <div className="card-header">Мини-рефлексия</div>
            <p className="meta">Запиши, что из урока применишь сегодня. Мы сохраним это только у тебя.</p>
            <textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="Какая мысль цепанула? Что попробуешь сделать?"
            />
          </div>

          {inlineQuiz && (
            <InlineQuiz
              materialId={material.id}
              quiz={inlineQuiz}
              onComplete={handleQuizFinish}
              alreadyCompleted={completed}
            />
          )}

          <div className="card next-block">
            <div className="card-header">Что дальше?</div>
            {nextMaterial ? (
              <>
                <p className="meta">Следующий шаг в треке</p>
                <div className="next-material">
                  <div>
                    <div className="pill outline">{typeLabels[nextMaterial.type] || "Шаг"}</div>
                    <div className="next-title">{nextMaterial.title}</div>
                    <div className="meta subtle">{nextMaterial.estimatedTime}</div>
                  </div>
                  <button className="primary" onClick={() => navigate(`/material/${nextMaterial.id}`)}>
                    Перейти к следующему шагу
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="meta">Посмотри похожие материалы по теме {theme.title}.</p>
                <div className="next-actions">
                  <Link className="ghost" to="/library">Вернуться в библиотеку</Link>
                  <button className="primary outline" onClick={() => navigate("/missions")}>Вернуться в миссии</button>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="material-side">
          <div className="card lesson-info">
            <div className="card-header">Этот урок</div>
            <div className="badge-row">
              <span className="material-badge" style={{ background: `${theme.accent}20`, color: theme.accent }}>
                {theme.title}
              </span>
              <span className="material-badge outline">{typeLabels[material.type]}</span>
              <span className="material-badge outline">{material.estimatedTime || "15 минут"}</span>
            </div>
            <p className="meta">Уровень: {material.level || "Начальный"}</p>
            <div className="info-grid">
              <div>
                <div className="meta subtle">Награда</div>
                <div className="big-number">+{getXPRewards().materialCompleted} XP</div>
              </div>
              <div>
                <div className="meta subtle">Статус</div>
                <div className="pill filled light">{statusLabel}</div>
              </div>
            </div>
            {trackBreadcrumb && <div className="meta subtle">{trackBreadcrumb}</div>}
            <button className="primary full" onClick={handleComplete}>
              {completed ? "Отметить повторение" : "Отметить завершение"}
            </button>
          </div>

          <div className="card lesson-mini">
            <div className="card-header">Краткие заметки</div>
            <ul className="lesson-list">
              <li>Сделай одно действие сразу после урока.</li>
              <li>Поделись выводом в сообществе, чтобы закрепить.</li>
              <li>Возвращайся к конспекту, если что-то не заходит.</li>
            </ul>
          </div>

          <div className="card lesson-mini">
            <div className="card-header">Нужна помощь?</div>
            <p className="meta">Задай вопрос ребятам и наставникам прямо из урока.</p>
            <button className="primary outline" onClick={() => setQuestionOpen(true)}>
              Задать вопрос в сообществе
            </button>
          </div>
        </div>
      </div>

      {questionOpen && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="card-header">Вопрос по уроку</div>
            <p className="meta">Напиши, что осталось непонятным или что хочется обсудить.</p>
            <textarea
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value.slice(0, 300))}
              placeholder="Что тебя волнует?"
            />
            <div className="modal-actions">
              <button className="primary" onClick={submitQuestion} disabled={!questionText.trim()}>
                Опубликовать
              </button>
              <button className="ghost" onClick={() => setQuestionOpen(false)}>
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaterialPage;
