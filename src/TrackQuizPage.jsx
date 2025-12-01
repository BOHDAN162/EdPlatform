import React, { useMemo, useState } from "react";
import { useNavigate } from "./routerShim";
import { trackQuestions, QUESTION_COUNT } from "./trackQuestions";
import { archetypes, buildPersonalTrack } from "./trackTemplates";

const ProgressBar = ({ current, total }) => {
  const percent = Math.round(((current + 1) / total) * 100);
  return (
    <div className="quiz-progress">
      <div className="quiz-progress-head">
        <span>
          Вопрос {current + 1} из {total}
        </span>
        <span className="meta">{percent}%</span>
      </div>
      <div className="progress-shell large">
        <div className="progress-fill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
};

const FinalDiagnostic = ({ result, onBuildPlan, onRestart }) => {
  if (!result) return null;
  const profile = archetypes[result.archetype];
  const title = profile?.title || "Твой профиль";
  return (
    <div className="quiz-card">
      <p className="pill outline">Мини-диагностика</p>
      <h2 className="quiz-title">Ты — {title}</h2>
      <p className="meta quiz-description">{profile?.description}</p>
      <div className="bullet-list">
        {(profile?.summary || []).map((item) => (
          <div key={item} className="bullet-row">
            <span className="check-dot">•</span>
            <span>{item}</span>
          </div>
        ))}
      </div>
      <div className="quiz-actions">
        <button className="primary large" onClick={onBuildPlan}>
          Построить мой план
        </button>
        <button className="ghost" onClick={onRestart}>
          Пройти заново
        </button>
      </div>
    </div>
  );
};

const TrackQuizPage = ({ savedTrack, onTrackSave, materials }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState(Array(QUESTION_COUNT).fill(null));
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  const currentQuestion = trackQuestions[currentIndex];
  const answeredCount = answers.filter((a) => a !== null).length;

  const canGoNext = answers[currentIndex] !== null;

  const computedResult = useMemo(() => {
    const totals = { founder: 0, strategist: 0, leader: 0, creator: 0 };
    trackQuestions.forEach((q, idx) => {
      const optionIndex = answers[idx];
      if (optionIndex === null || optionIndex === undefined) return;
      const option = q.options[optionIndex];
      Object.entries(option.scores || {}).forEach(([key, points]) => {
        totals[key] = (totals[key] || 0) + points;
      });
    });
    const winner = Object.keys(totals).reduce((best, key) => (totals[key] > totals[best] ? key : best), "founder");
    return { archetype: winner, totals };
  }, [answers]);

  const goNext = () => {
    if (currentIndex < QUESTION_COUNT - 1) {
      if (!canGoNext) return;
      setCurrentIndex((idx) => idx + 1);
    } else {
      setResult(computedResult);
    }
  };

  const goPrev = () => {
    if (currentIndex === 0) return;
    setCurrentIndex((idx) => idx - 1);
  };

  const handleRestart = () => {
    setAnswers(Array(QUESTION_COUNT).fill(null));
    setCurrentIndex(0);
    setResult(null);
  };

  const handleBuild = () => {
    const track = buildPersonalTrack(computedResult.archetype, materials);
    onTrackSave?.(track);
    navigate("/profile");
  };

  return (
    <div className="page quiz-page">
      <div className="quiz-header">
        <div>
          <p className="hero-kicker">Стартовый трек</p>
          <h1 className="quiz-hero-title">Стартовый трек развития</h1>
          <p className="quiz-lead">Ответь на несколько вопросов — мы подберём твой личный маршрут развития.</p>
          <p className="meta">Займёт меньше 5 минут. Твой результат сохранится в профиле.</p>
        </div>
        <div className="quiz-progress-block">
          <div className="pill outline">{answeredCount} / {QUESTION_COUNT} заполнено</div>
          <div className="pill">Новый маршрут без регистрации</div>
        </div>
      </div>

      {result ? (
        <FinalDiagnostic result={result} onBuildPlan={handleBuild} onRestart={handleRestart} />
      ) : (
        <div className="quiz-card">
          <ProgressBar current={currentIndex} total={QUESTION_COUNT} />
          <div className="quiz-question">
            <div className="quiz-question-title">
              {currentIndex + 1}. {currentQuestion.text}
            </div>
            <div className="quiz-options">
              {currentQuestion.options.map((option, idx) => (
                <label
                  key={option.text}
                  className={`quiz-option ${answers[currentIndex] === idx ? "selected" : ""}`}
                  onClick={() => setAnswers((prev) => {
                    const next = [...prev];
                    next[currentIndex] = idx;
                    return next;
                  })}
                >
                  <input
                    type="radio"
                    name={currentQuestion.id}
                    checked={answers[currentIndex] === idx}
                    onChange={() => setAnswers((prev) => {
                      const next = [...prev];
                      next[currentIndex] = idx;
                      return next;
                    })}
                  />
                  <span>{option.text}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="quiz-actions">
            <button className="ghost" onClick={goPrev} disabled={currentIndex === 0}>
              Назад
            </button>
            <div className="spacer" />
            <button className="primary" onClick={goNext} disabled={!canGoNext}>
              {currentIndex === QUESTION_COUNT - 1 ? "Показать результат" : "Далее"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackQuizPage;
