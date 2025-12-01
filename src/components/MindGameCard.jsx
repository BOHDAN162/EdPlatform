import React from "react";

const MindGameCard = ({ title, description, ctaLabel = "Играть", onPlay, bestResult, lastPlayed }) => {
  const bestText = bestResult ? `${bestResult.correct} из ${bestResult.total}` : "—";
  const lastPlayedText = lastPlayed ? new Date(lastPlayed).toLocaleDateString() : "—";

  return (
    <div className="mindgame-card">
      <div className="mindgame-card-head">
        <div>
          <div className="mindgame-card-title">{title}</div>
          <div className="mindgame-card-sub">{description}</div>
        </div>
        <div className="mindgame-card-meta">
          <div className="meta-label">Лучший результат</div>
          <div className="meta-value">{bestText}</div>
          <div className="meta-label">Последняя игра</div>
          <div className="meta-value">{lastPlayedText}</div>
        </div>
      </div>
      <button className="primary" onClick={onPlay}>
        {ctaLabel}
      </button>
    </div>
  );
};

export default MindGameCard;
