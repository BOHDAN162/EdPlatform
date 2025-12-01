import React from "react";

const MindGameCard = ({
  title,
  description,
  quickInfo,
  xpReward,
  ctaLabel = "Играть",
  onPlay,
  bestResult,
  lastPlayed,
}) => {
  const bestText = bestResult ? `${bestResult.correct} из ${bestResult.total}` : "—";
  const lastPlayedText = lastPlayed ? new Date(lastPlayed).toLocaleDateString() : "—";

  return (
    <div className="mindgame-card">
      <div className="mindgame-card-head">
        <div className="mindgame-card-body">
          <div className="mindgame-card-title">{title}</div>
          <div className="mindgame-card-sub">{description}</div>
          {quickInfo && <div className="mindgame-card-quick">{quickInfo}</div>}
          <div className="mindgame-card-tags">
            {xpReward ? <span className="pill xp-pill">+{xpReward} XP</span> : <span className="pill xp-pill">+XP</span>}
            <span className="pill soft">Быстрые сценарии</span>
          </div>
        </div>
        <div className="mindgame-card-meta">
          <div className="meta-label">Лучший результат</div>
          <div className="meta-value">{bestText}</div>
          <div className="meta-label">Последняя игра</div>
          <div className="meta-value">{lastPlayedText}</div>
        </div>
      </div>
      <button className="primary ghost" onClick={onPlay}>
        {ctaLabel}
      </button>
    </div>
  );
};

export default MindGameCard;
