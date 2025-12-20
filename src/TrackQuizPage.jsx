import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "./routerShim";
import { trackQuestions, QUESTION_COUNT } from "./trackQuestions";
import { buildDevelopmentTrack, buildProfileResult } from "./trackTemplates";
import CongratsScreen from "./components/CongratsScreen";

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

const TrackQuizPage = ({ savedTrack, onTrackSave, materials }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState(Array(QUESTION_COUNT).fill(null));
  const [result, setResult] = useState(null);
  const [mode, setMode] = useState("quiz");
  const [isAdvancing, setIsAdvancing] = useState(false);
  const advanceLockRef = useRef(false);
  const navigate = useNavigate();

  const currentQuestion = trackQuestions[currentIndex];
  const answeredCount = answers.filter((a) => a !== null).length;

  const calculateResult = (answerList) => {
    const totals = { founder: 0, strategist: 0, leader: 0, creator: 0 };
    trackQuestions.forEach((q, idx) => {
      const optionIndex = answerList[idx];
      if (optionIndex === null || optionIndex === undefined) return;
      const option = q.options[optionIndex];
      Object.entries(option.scores || {}).forEach(([key, points]) => {
        totals[key] = (totals[key] || 0) + points;
      });
    });
    const winner = Object.keys(totals).reduce((best, key) => (totals[key] > totals[best] ? key : best), "founder");
    return { archetype: winner, totals };
  };

  const computedResult = useMemo(() => calculateResult(answers), [answers]);

  const handleSelectOption = (optionIndex) => {
    if (advanceLockRef.current) return;
    advanceLockRef.current = true;
    setIsAdvancing(true);

    const nextAnswers = [...answers];
    nextAnswers[currentIndex] = optionIndex;
    setAnswers(nextAnswers);

    if (currentIndex < QUESTION_COUNT - 1) {
      setCurrentIndex((idx) => Math.min(idx + 1, QUESTION_COUNT - 1));
    } else {
      const finalResult = calculateResult(nextAnswers);
      setResult(buildProfileResult(finalResult.archetype));
      setMode("result");
    }
  };

  const goPrev = () => {
    if (currentIndex === 0) return;
    setCurrentIndex((idx) => idx - 1);
  };

  const handleRestart = () => {
    advanceLockRef.current = false;
    setIsAdvancing(false);
    setAnswers(Array(QUESTION_COUNT).fill(null));
    setCurrentIndex(0);
    setResult(null);
    setMode("quiz");
  };

  const handleBuild = () => {
    const profileResult = result || buildProfileResult(computedResult.archetype);
    const track = buildDevelopmentTrack(computedResult.archetype, materials);
    onTrackSave?.({ ...track, profileResult });
    navigate("/missions");
  };

  const showQuiz = mode === "quiz";

  useEffect(() => {
    if (isAdvancing) {
      advanceLockRef.current = false;
      setIsAdvancing(false);
    }
  }, [currentIndex, mode, isAdvancing]);

  return (
    <div className="page quiz-page">
      <div className="quiz-header">
        <div>
          <p className="hero-kicker">Трек развития</p>
          <h1 className="quiz-hero-title">Ответь на 10 вопросов</h1>
          <p className="quiz-lead">Мы соберём твой профиль и подготовим цепочку из 10 шагов в библиотеке.</p>
          <p className="meta">Займёт меньше 5 минут. Можно вернуться в любой момент через хедер.</p>
        </div>
        <div className="quiz-progress-block">
          <div className="pill outline">{answeredCount} / {QUESTION_COUNT} заполнено</div>
          {savedTrack?.generatedTrack?.length ? <div className="pill">Текущий трек сохранён</div> : <div className="pill">Новый маршрут</div>}
        </div>
      </div>

      {showQuiz && (
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
                  className={`quiz-option ${answers[currentIndex] === idx ? "selected" : ""} ${
                    isAdvancing ? "disabled" : ""
                  }`}
                  aria-disabled={isAdvancing}
                >
                  <input
                    type="radio"
                    name={currentQuestion.id}
                    checked={answers[currentIndex] === idx}
                    onChange={() => handleSelectOption(idx)}
                    disabled={isAdvancing}
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
          </div>
        </div>
      )}

      {mode === "result" && result && (
        <CongratsScreen profileResult={result} onBuild={handleBuild} onRestart={handleRestart} />
      )}
    </div>
  );
};

export default TrackQuizPage;
