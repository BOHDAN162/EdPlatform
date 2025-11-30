import React from "react";

const QuestionCard = ({ question, onSelect, onUpvote }) => {
  return (
    <div className="card question-card" onClick={() => onSelect(question)}>
      <div className="question-top">
        <div>
          <div className="question-title">{question.title}</div>
          <p className="meta">{question.body}</p>
          <div className="chip-row">
            {question.tags.map((tag) => (
              <span key={tag} className="pill outline">#{tag}</span>
            ))}
          </div>
        </div>
        <button className="ghost" onClick={(e) => { e.stopPropagation(); onUpvote(question.id); }}>
          ⬆ {question.upvotesCount}
        </button>
      </div>
      <div className="question-meta">
        <div className="meta">{question.author?.name} · {question.relativeTime}</div>
        <div className="meta">Ответов: {question.answersCount}</div>
      </div>
    </div>
  );
};

export default QuestionCard;
