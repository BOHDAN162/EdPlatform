import React, { useMemo } from "react";
import { mindGamesMap } from "../data/mindGames";

const getSummaryText = (correct, total) => {
  const ratio = total ? correct / total : 0;
  if (ratio === 1) return "Мозг работает как радар!";
  if (ratio >= 0.6) return "Нормальный старт, можно прокачаться ещё.";
  return "Это только разминка, попробуй ещё раз.";
};

const LogicGame = ({
  status,
  currentIndex,
  onAnswer,
  onRestart,
  onClose,
  feedback,
  progress,
  lastResult,
}) => {
  const game = mindGamesMap.logic;
  const question = useMemo(() => game.questions[currentIndex], [game.questions, currentIndex]);

  if (status === "finished" && lastResult) {
    return (
      <div className="mindgame-shell">
        <div className="mindgame-head">
          <div>
            <p className="mindgame-kicker">Логическая игра</p>
            <h3 className="mindgame-title">Игра окончена</h3>
            <p className="mindgame-sub">Ты ответил(а) верно на {lastResult.correct} из {lastResult.total}</p>
            <p className="mindgame-sub">{getSummaryText(lastResult.correct, lastResult.total)}</p>
          </div>
          <div className="mindgame-result">+{lastResult.xpGained} XP</div>
        </div>
        <div className="mindgame-actions">
          <button className="primary" onClick={onRestart}>Сыграть ещё раз</button>
          <button className="ghost" onClick={onClose}>Закрыть игру</button>
        </div>
      </div>
    );
  }

  return (
    <div className="mindgame-shell">
      <div className="mindgame-head">
        <div>
          <p className="mindgame-kicker">Логическая игра</p>
          <h3 className="mindgame-title">Отвечай на вопросы и смотри, сколько задач ты решишь</h3>
          <p className="mindgame-sub">Вопрос {progress.currentIndex} из {progress.total}</p>
          <div className="progress-shell">
            <div
              className="progress-fill"
              style={{ width: `${progress.total ? (progress.currentIndex / progress.total) * 100 : 0}%` }}
            />
          </div>
        </div>
        <div className="mindgame-stat">
          <div className="meta-label">Верных ответов</div>
          <div className="meta-value">{progress.correctCount}</div>
        </div>
      </div>

      <div className="mindgame-question-card">
        <div className="mindgame-question">{question.text}</div>
        <div className="mindgame-options">
          {question.options.map((opt, idx) => (
            <button key={opt} className="mindgame-option" onClick={() => onAnswer(idx)}>
              {opt}
            </button>
          ))}
        </div>
      </div>

      {feedback && (
        <div className={`mindgame-feedback ${feedback.correct ? "success" : "error"}`}>
          {feedback.correct ? "Верно" : "Неверно"}. {feedback.explanation}
        </div>
      )}
    </div>
  );
};

export default LogicGame;
