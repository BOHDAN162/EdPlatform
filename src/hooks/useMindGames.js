import { useEffect, useMemo, useRef, useState } from "react";
import { getMindGameById, mindGames } from "../data/mindGames";

const storageKey = (userId) => `noesis_mindgames_${userId || "guest"}`;

const initialHistory = {
  best: {},
  lastPlayed: {},
};

export const useMindGames = (userId) => {
  const [currentGameId, setCurrentGameId] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [status, setStatus] = useState("idle");
  const [correctCount, setCorrectCount] = useState(0);
  const [lastResult, setLastResult] = useState(null);
  const [history, setHistory] = useState(() => {
    try {
      const raw = localStorage.getItem(storageKey(userId));
      return raw ? { ...initialHistory, ...JSON.parse(raw) } : initialHistory;
    } catch (e) {
      return initialHistory;
    }
  });

  const gameMap = useMemo(() => mindGames.reduce((acc, game) => ({ ...acc, [game.id]: game }), {}), []);
  const currentGame = currentGameId ? gameMap[currentGameId] : null;
  const prevUser = useRef(userId);

  useEffect(() => {
    if (prevUser.current === userId) return;
    prevUser.current = userId;
    try {
      const raw = localStorage.getItem(storageKey(userId));
      setHistory(raw ? { ...initialHistory, ...JSON.parse(raw) } : initialHistory);
    } catch (e) {
      setHistory(initialHistory);
    }
    resetGame();
  }, [userId]);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey(userId), JSON.stringify(history));
    } catch (e) {
      // ignore
    }
  }, [history, userId]);

  const startGame = (gameId) => {
    setCurrentGameId(gameId);
    setCurrentIndex(0);
    setAnswers([]);
    setStatus("inProgress");
    setCorrectCount(0);
    setLastResult(null);
  };

  const resetGame = () => {
    setCurrentGameId(null);
    setCurrentIndex(0);
    setAnswers([]);
    setStatus("idle");
    setCorrectCount(0);
    setLastResult(null);
  };

  const answerCurrentQuestion = (optionIndex) => {
    if (!currentGame || status !== "inProgress") return null;
    const question = currentGame.questions[currentIndex];
    const isCorrect = question.correctIndex === optionIndex;
    const nextCorrect = correctCount + (isCorrect ? 1 : 0);
    const nextAnswers = [...answers];
    nextAnswers[currentIndex] = { questionId: question.id, optionIndex, correct: isCorrect };
    const nextIndex = currentIndex + 1;
    const finished = nextIndex >= currentGame.questions.length;
    setAnswers(nextAnswers);
    setCorrectCount(nextCorrect);
    if (finished) {
      const xpGained = Math.round(currentGame.xpRewardBase * (nextCorrect / currentGame.questions.length));
      const result = {
        gameId: currentGame.id,
        correct: nextCorrect,
        total: currentGame.questions.length,
        xpGained,
        finishedAt: new Date().toISOString(),
      };
      setStatus("finished");
      setLastResult(result);
      setHistory((prev) => {
        const prevBest = prev.best[currentGame.id];
        const isBetter = !prevBest || nextCorrect > (prevBest.correct || 0);
        return {
          best: {
            ...prev.best,
            [currentGame.id]: isBetter ? result : prevBest,
          },
          lastPlayed: { ...prev.lastPlayed, [currentGame.id]: result.finishedAt },
        };
      });
    } else {
      setCurrentIndex(nextIndex);
    }
    return { correct: isCorrect, finished };
  };

  const getCurrentQuestion = () => {
    if (!currentGame) return null;
    return currentGame.questions[currentIndex];
  };

  const getProgress = () => ({
    currentIndex: Math.min(currentIndex + 1, currentGame?.questions.length || 0),
    total: currentGame?.questions.length || 0,
    score: currentGame ? Math.round((correctCount / currentGame.questions.length) * 100) : 0,
    correctCount,
  });

  return {
    currentGameId,
    currentGame,
    currentIndex,
    status,
    answers,
    history,
    lastResult,
    startGame,
    answerCurrentQuestion,
    resetGame,
    getCurrentQuestion,
    getProgress,
  };
};

export const getMindGameDefinitions = () => mindGames;
export const getMindGame = (id) => getMindGameById(id);
