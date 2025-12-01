import React, { useMemo, useState } from "react";
import { useNavigate } from "./routerShim";
import { trackQuestions, QUESTION_COUNT } from "./trackQuestions";
import { archetypes, buildPersonalTrack } from "./trackTemplates";
import { missions } from "./missionsData";
import { getMaterialById } from "./libraryData";

const ProgressRail = ({ current }) => {
  const percent = Math.round(((current + 1) / QUESTION_COUNT) * 100);
  return (
    <div className="progress-stack">
      <div className="progress-head">Вопрос {current + 1} из {QUESTION_COUNT}</div>
      <div className="progress-shell large">
        <div className="progress-fill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
};

const ResultCard = ({ result, track, onRestart, onGoMissions, onGoLesson }) => {
  if (!result || !track) return null;
  const profile = archetypes[result.archetype];
  const firstStep = track.generatedTrack?.[0];
  const firstMaterial = firstStep ? getMaterialById(firstStep.materialId) : null;
  const recommendedMission = missions.find((m) => m.steps.some((step) => step.materialId === firstStep?.materialId)) || missions[0];
  return (
    <div className="onboarding-result card">
      <div className="card-header">Готово! Мы собрали твой трек развития</div>
      <div className="result-grid">
        <div>
          <p className="pill outline">Кто ты</p>
          <h2>Ты ближе всего к профилю: {profile?.title}</h2>
          <p className="meta">{profile?.description}</p>
          <ul className="bullet-list">
            {(profile?.summary || []).map((item) => (
              <li key={item} className="bullet-row">
                <span className="check-dot">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="chip-row">
            <span className="pill filled">10 вопросов закрыты</span>
            <span className="pill outline">Личный маршрут готов</span>
          </div>
          <div className="quiz-actions">
            <button className="primary" onClick={onGoMissions}>Перейти к миссиям</button>
            {firstMaterial && (
              <button className="ghost" onClick={() => onGoLesson(firstMaterial.id)}>
                Первый урок: {firstMaterial.title}
              </button>
            )}
            <button className="ghost" onClick={onRestart}>Перепройти опрос</button>
          </div>
        </div>
        <div className="result-side">
          <div className="mini-roadmap">
            <div className="card-header">С чего начнём</div>
            <p className="meta">Вот первые шаги твоего личного трека. Полная версия в разделе «Миссии».</p>
            <ol>
              {track.generatedTrack?.slice(0, 3).map((step) => (
                <li key={step.id}>
                  <div className="next-title">{step.title}</div>
                  <p className="meta subtle">{step.estimatedTime || "15 минут"}</p>
                </li>
              ))}
            </ol>
            {recommendedMission && (
              <div className="mini-mission">
                <p className="pill outline">Миссия</p>
                <div className="next-title">{recommendedMission.title}</div>
                <p className="meta">+{recommendedMission.xpReward} XP • {recommendedMission.estimatedTime}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const OnboardingPage = ({ user, trackData, onSaveTrack, onRetake }) => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState(Array(QUESTION_COUNT).fill(null));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [result, setResult] = useState(null);
  const [track, setTrack] = useState(trackData || null);

  const currentQuestion = trackQuestions[currentIndex];
  const canNext = answers[currentIndex] !== null;

  const answeredCount = answers.filter((a) => a !== null).length;

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
    if (!canNext) return;
    if (currentIndex === QUESTION_COUNT - 1) {
      const builtTrack = buildPersonalTrack(computedResult.archetype);
      setResult(computedResult);
      setTrack(builtTrack);
      onSaveTrack?.(builtTrack);
      return;
    }
    setCurrentIndex((idx) => idx + 1);
  };

  const goPrev = () => {
    if (currentIndex === 0) return;
    setCurrentIndex((idx) => idx - 1);
  };

  const restart = () => {
    setAnswers(Array(QUESTION_COUNT).fill(null));
    setCurrentIndex(0);
    setResult(null);
    setTrack(null);
    onRetake?.();
  };

  const handleGoMissions = () => navigate("/missions");
  const handleGoLesson = (id) => navigate(`/material/${id}`);

  const hasExistingTrack = !!trackData?.generatedTrack?.length;

  return (
    <div className="page onboarding-page">
      <div className="page-header onboarding-header">
        <div>
          <p className="hero-kicker">Сформируем твой трек развития</p>
          <h1>Ответь на 10 вопросов</h1>
          <p className="meta">Ответь честно — и мы подберём миссии и материалы под твой уровень и цели.</p>
        </div>
        {hasExistingTrack && (
          <div className="card compact">
            <div className="card-header">Трек уже есть</div>
            <p className="meta">Если хочешь поменять маршрут — просто перепройди опрос.</p>
            <div className="chip-row">
              <button className="ghost" onClick={() => navigate("/missions")}>Вернуться к миссиям</button>
              <button className="primary" onClick={restart}>Перепройти</button>
            </div>
          </div>
        )}
      </div>

      <div className="card quiz-card">
        <div className="quiz-meta-row">
          <span className="pill outline">{answeredCount} / {QUESTION_COUNT} заполнено</span>
          <span className="pill filled">Займёт ~5 минут</span>
        </div>
        <ProgressRail current={currentIndex} />
        <div className="quiz-question">
          <div className="quiz-question-title">{currentIndex + 1}. {currentQuestion.text}</div>
          <div className="quiz-options">
            {currentQuestion.options.map((option, idx) => (
              <label
                key={option.text}
                className={`quiz-option ${answers[currentIndex] === idx ? "selected" : ""}`}
                onClick={() =>
                  setAnswers((prev) => {
                    const next = [...prev];
                    next[currentIndex] = idx;
                    return next;
                  })
                }
              >
                <input
                  type="radio"
                  name={currentQuestion.id}
                  checked={answers[currentIndex] === idx}
                  onChange={() =>
                    setAnswers((prev) => {
                      const next = [...prev];
                      next[currentIndex] = idx;
                      return next;
                    })
                  }
                />
                <span>{option.text}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="quiz-actions">
          <button className="ghost" onClick={goPrev} disabled={currentIndex === 0}>Назад</button>
          <div className="spacer" />
          <button className="primary" onClick={goNext} disabled={!canNext}>
            {currentIndex === QUESTION_COUNT - 1 ? "Показать результат" : "Далее"}
          </button>
        </div>
      </div>

      {result && track && (
        <ResultCard
          result={result}
          track={track}
          onRestart={restart}
          onGoMissions={handleGoMissions}
          onGoLesson={handleGoLesson}
        />
      )}
    </div>
  );
};

export default OnboardingPage;
