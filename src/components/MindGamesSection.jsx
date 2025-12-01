import React, { useEffect, useMemo, useState } from "react";
import { mindGames } from "../data/mindGames";
import { useMindGames } from "../hooks/useMindGames";
import MindGameCard from "./MindGameCard";
import MindGameModal from "./MindGameModal";
import LogicGame from "./LogicGame";
import FinanceGame from "./FinanceGame";

const feedbackTexts = {
  success: ["Отлично!", "Так держать!", "Попадание в точку!"],
  error: ["Есть куда расти", "Почти получилось", "Попробуй иначе"],
};

const MindGamesSection = ({ userId, onGameComplete }) => {
  const {
    currentGameId,
    startGame,
    answerCurrentQuestion,
    resetGame,
    status,
    getCurrentQuestion,
    getProgress,
    history,
    lastResult,
    currentIndex,
  } = useMindGames(userId);

  const [modalOpen, setModalOpen] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const activeGame = useMemo(() => mindGames.find((g) => g.id === currentGameId), [currentGameId]);

  useEffect(() => {
    if (lastResult && onGameComplete) {
      onGameComplete(lastResult);
    }
  }, [lastResult, onGameComplete]);

  const closeModal = () => {
    setModalOpen(false);
    resetGame();
    setFeedback(null);
  };

  const handlePlay = (gameId) => {
    startGame(gameId);
    setModalOpen(true);
    setFeedback(null);
  };

  const handleAnswer = (optionIndex) => {
    const currentQuestion = getCurrentQuestion();
    if (!currentQuestion) return;
    const result = answerCurrentQuestion(optionIndex);
    setFeedback({
      correct: result?.correct,
      explanation: currentQuestion.explanation,
      title: currentQuestion.text,
      flair: result?.correct
        ? feedbackTexts.success[Math.floor(Math.random() * feedbackTexts.success.length)]
        : feedbackTexts.error[Math.floor(Math.random() * feedbackTexts.error.length)],
    });
  };

  const progress = getProgress();

  return (
    <div className="card mindgames-card" id="mindgames-section">
      <div className="card-header">Игры мышления (MindGames)</div>
      <p className="meta">Логические и финансовые мини-игры, чтобы прокачать мозг и деньги в формате игры.</p>
      <div className="mindgame-grid">
        {mindGames.map((game) => (
          <MindGameCard
            key={game.id}
            title={game.title}
            description={game.description}
            bestResult={history.best?.[game.id]}
            lastPlayed={history.lastPlayed?.[game.id]}
            onPlay={() => handlePlay(game.id)}
          />
        ))}
      </div>

      <MindGameModal open={modalOpen} onClose={closeModal}>
        {activeGame?.id === "logic" && (
          <LogicGame
            status={status}
            currentIndex={currentIndex}
            onAnswer={handleAnswer}
            onRestart={() => handlePlay("logic")}
            onClose={closeModal}
            feedback={feedback}
            progress={progress}
            lastResult={lastResult}
          />
        )}
        {activeGame?.id === "finance" && (
          <FinanceGame
            status={status}
            currentIndex={currentIndex}
            onAnswer={handleAnswer}
            onRestart={() => handlePlay("finance")}
            onClose={closeModal}
            feedback={feedback}
            progress={progress}
            lastResult={lastResult}
          />
        )}
      </MindGameModal>
    </div>
  );
};

export default MindGamesSection;
