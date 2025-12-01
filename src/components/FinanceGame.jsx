import React, { useMemo } from "react";
import { mindGamesMap } from "../data/mindGames";

const getSummaryText = (correct, total) => {
  const ratio = total ? correct / total : 0;
  if (ratio === 1) return "У тебя уже есть чувство денег";
  if (ratio >= 0.6) return "Хороший старт, можно улучшить финансовое мышление";
  return "Самое время разобраться с финансами — попробуй ещё раз.";
};

const FinanceGame = ({
  status,
  currentIndex,
  onAnswer,
  onRestart,
  onClose,
  feedback,
  progress,
  lastResult,
}) => {
  const game = mindGamesMap.finance;
  const question = useMemo(() => game.questions[currentIndex], [game.questions, currentIndex]);

  if (status === "finished" && lastResult) {
    return (
      <div className="mindgame-shell">
        <div className="mindgame-head">
          <div>
            <p className="mindgame-kicker">Финансовая игра</p>
            <h3 className="mindgame-title">Игра окончена</h3>
            <p className="mindgame-sub">Ты принял(а) {lastResult.correct} из {lastResult.total} финансовых решений правильно</p>
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
          <p className="mindgame-kicker">Финансовая игра</p>
          <h3 className="mindgame-title">Сценарии про деньги, решения и последствия</h3>
          <p className="mindgame-sub">Сценарий {progress.currentIndex} из {progress.total}</p>
          <div className="progress-shell">
            <div
              className="progress-fill"
              style={{ width: `${progress.total ? (progress.currentIndex / progress.total) * 100 : 0}%` }}
            />
          </div>
        </div>
        <div className="mindgame-stat">
          <div className="meta-label">Верных решений</div>
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

export default FinanceGame;
