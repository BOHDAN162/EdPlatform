import React, { useState } from "react";
import { useNavigate } from "./routerShim";
import { QUESTION_COUNT } from "./trackQuestions";
import { archetypes } from "./trackTemplates";
import { missions } from "./missionsData";
import { getMaterialById } from "./libraryData";
import { useOnboardingQuiz } from "./hooks/useOnboardingQuiz";

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
  const firstMaterial = track.firstMaterialId ? getMaterialById(track.firstMaterialId) : null;
  const recommendedMission = missions.find((m) => m.id === track.recommendedMissionId) || missions[0];

  return (
    <div className="onboarding-result card">
      <p className="pill outline">Опрос пройден</p>
      <h1>Готово! Мы собрали твой трек развития</h1>
      <p className="meta">
        Ты можешь сразу перейти к первому шагу или открыть детали трека. Всё уже сохранено.
      </p>

      <div className="result-grid">
        <div className="result-column">
          <div className="card-header">Кто ты</div>
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
        </div>

        <div className="result-column">
          <div className="card-header">Твои первые шаги</div>
          {recommendedMission && (
            <div className="mini-mission">
              <p className="pill outline">Первое задание</p>
              <div className="next-title">{recommendedMission.title}</div>
              <p className="meta">{recommendedMission.description}</p>
              <p className="meta subtle">{recommendedMission.estimatedTime} · +{recommendedMission.xpReward} XP</p>
              <button className="primary" onClick={onGoMissions}>
                Перейти к заданиям
              </button>
            </div>
          )}
          {firstMaterial && (
            <div className="mini-roadmap">
              <p className="pill outline">Первый урок</p>
              <div className="next-title">{firstMaterial.title}</div>
              <p className="meta subtle">{firstMaterial.type === "test" ? "Тест" : firstMaterial.type === "article" ? "Лонгрид" : "Курс"}</p>
              <p className="meta subtle">~{firstMaterial.estimatedTime || "15 минут"}</p>
              <button className="ghost" onClick={() => onGoLesson(firstMaterial.id)}>
                Открыть урок
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="quiz-actions">
        <button className="primary" onClick={onGoMissions}>
          Перейти к заданиям
        </button>
        {firstMaterial && (
          <button className="ghost" onClick={() => onGoLesson(firstMaterial.id)}>
            Открыть первый урок
          </button>
        )}
        <button className="ghost" onClick={onRestart}>
          Перепройти опрос
        </button>
      </div>
    </div>
  );
};

const OnboardingPage = ({ user, trackData, onSaveTrack, onRetake }) => {
  const navigate = useNavigate();
  const [mode, setMode] = useState("quiz");
  const [result, setResult] = useState(null);
  const [track, setTrack] = useState(trackData || null);

  const {
    answers,
    currentIndex,
    answeredCount,
    currentQuestion,
    canGoNext,
    setAnswer,
    nextQuestion,
    prevQuestion,
    finishQuiz,
    resetQuiz,
  } = useOnboardingQuiz();

  const hasExistingTrack = !!trackData?.generatedTrack?.length;

  const finishAndShowResult = () => {
    if (!canGoNext) return;
    const payload = finishQuiz();
    if (!payload) return;
    setResult(payload.result);
    setTrack(payload.track);
    onSaveTrack?.(payload.track);
    setMode("result");
  };

  const goNext = () => {
    if (currentIndex === QUESTION_COUNT - 1) {
      finishAndShowResult();
      return;
    }
    if (!canGoNext) return;
    nextQuestion();
  };

  const goPrev = () => {
    prevQuestion();
  };

  const restart = () => {
    resetQuiz();
    setResult(null);
    setTrack(null);
    setMode("quiz");
    onRetake?.();
  };

  const handleGoMissions = () => navigate("/missions");
  const handleGoLesson = (id) => navigate(`/material/${id}`);

  const showQuiz = mode === "quiz";

  return (
    <div className="page onboarding-page">
      <div className="page-header onboarding-header">
        <div>
          <p className="hero-kicker">Сформируем твой трек развития</p>
          <h1>Соберём твой трек развития</h1>
          <p className="meta">Ответь честно на 10 вопросов — и мы подберём задания и материалы под тебя.</p>
        </div>
        {hasExistingTrack && showQuiz && (
          <div className="card compact">
            <div className="card-header">Ты уже проходил опрос</div>
            <p className="meta">Хочешь обновить маршрут или вернуться к текущим заданиям?</p>
            <div className="chip-row">
              <button className="ghost" onClick={() => navigate("/missions")}>Перейти к заданиям</button>
              <button className="primary" onClick={restart}>Перепройти опрос</button>
            </div>
          </div>
        )}
      </div>

      {showQuiz && (
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
                  onClick={() => setAnswer(idx)}
                >
                  <input
                    type="radio"
                    name={currentQuestion.id}
                    checked={answers[currentIndex] === idx}
                    onChange={() => setAnswer(idx)}
                  />
                  <span>{option.text}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="quiz-actions">
            <button className="ghost" onClick={goPrev} disabled={currentIndex === 0}>Назад</button>
            <div className="spacer" />
            <button className="primary" onClick={goNext} disabled={!canGoNext}>
              {currentIndex === QUESTION_COUNT - 1 ? "Завершить" : "Далее"}
            </button>
          </div>
        </div>
      )}

      {mode === "result" && result && track && (
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
