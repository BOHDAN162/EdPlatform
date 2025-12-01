import { useMemo, useState } from "react";
import { QUESTION_COUNT, trackQuestions } from "../trackQuestions";
import { buildPersonalTrackFromAnswers } from "../utils/onboarding";

export const useOnboardingQuiz = (onComplete) => {
  const [answers, setAnswers] = useState(Array(QUESTION_COUNT).fill(null));
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentQuestion = trackQuestions[currentIndex];
  const answeredCount = useMemo(() => answers.filter((a) => a !== null).length, [answers]);
  const canGoNext = answers[currentIndex] !== null;
  const isComplete = answeredCount === QUESTION_COUNT;

  const setAnswer = (value) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[currentIndex] = value;
      return next;
    });
  };

  const nextQuestion = () => {
    if (currentIndex >= QUESTION_COUNT - 1) return;
    if (!canGoNext) return;
    setCurrentIndex((idx) => idx + 1);
  };

  const prevQuestion = () => {
    if (currentIndex === 0) return;
    setCurrentIndex((idx) => idx - 1);
  };

  const calculateResult = () => buildPersonalTrackFromAnswers(answers);

  const finishQuiz = () => {
    if (!isComplete) return null;
    const payload = buildPersonalTrackFromAnswers(answers);
    if (onComplete) onComplete(payload);
    return payload;
  };

  const resetQuiz = () => {
    setAnswers(Array(QUESTION_COUNT).fill(null));
    setCurrentIndex(0);
  };

  return {
    answers,
    currentIndex,
    answeredCount,
    currentQuestion,
    canGoNext,
    isComplete,
    setAnswer,
    nextQuestion,
    prevQuestion,
    calculateResult,
    finishQuiz,
    resetQuiz,
  };
};
