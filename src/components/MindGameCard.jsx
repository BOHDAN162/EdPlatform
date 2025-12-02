import React from "react";
import LibraryCard from "./LibraryCard";

const MindGameCard = ({ title, description, ctaLabel = "Играть", onPlay, bestResult, lastPlayed }) => {
  const bestText = bestResult ? `${bestResult.correct} из ${bestResult.total}` : "—";
  const lastPlayedText = lastPlayed ? new Date(lastPlayed).toLocaleDateString() : "—";

  return (
    <LibraryCard
      className="mindgame-card"
      badges={[<span key="badge" className="pill outline">Игра</span>]}
      title={title}
      description={description}
      footer={
        <div className="mindgame-card-footer">
          <div className="mindgame-card-meta">
            <div className="meta-label">Лучший результат</div>
            <div className="meta-value">{bestText}</div>
            <div className="meta-label">Последняя игра</div>
            <div className="meta-value">{lastPlayedText}</div>
          </div>
          <button className="primary small" onClick={onPlay}>
            {ctaLabel}
          </button>
        </div>
      }
    />
  );
};

export default MindGameCard;
