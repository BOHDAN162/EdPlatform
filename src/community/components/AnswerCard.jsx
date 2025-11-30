import React from "react";

const AnswerCard = ({ answer, isBest, canMarkBest, onMarkBest, onUpvote }) => {
  return (
    <div className={`card answer-card ${isBest ? "best" : ""}`}>
      <div className="answer-header">
        <div className="avatar small">{answer.author?.name?.[0]}</div>
        <div>
          <div className="answer-author">{answer.author?.name}</div>
          <div className="meta">{answer.relativeTime}</div>
        </div>
        {isBest && <span className="pill subtle">Лучший ответ</span>}
      </div>
      <p>{answer.body}</p>
      <div className="answer-actions">
        <button className="ghost" onClick={() => onUpvote(answer.id)}>⬆ {answer.upvotesCount}</button>
        {canMarkBest && !isBest && (
          <button className="primary outline" onClick={() => onMarkBest(answer.id)}>
            Отметить лучшим
          </button>
        )}
      </div>
    </div>
  );
};

export default AnswerCard;
