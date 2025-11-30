import React from "react";

const RankingRow = ({ participant, position, isCurrent }) => {
  return (
    <div className={`ranking-row ${isCurrent ? "current" : ""}`}>
      <div className="ranking-left">
        <span className="pill subtle">#{position}</span>
        <div className="avatar small">{participant.name[0]}</div>
        <div>
          <div className="ranking-name">{participant.name}</div>
          <div className="meta">{participant.role} · {participant.city || "онлайн"}</div>
        </div>
      </div>
      <div className="ranking-right">
        <div className="meta">уровень {participant.level || "?"}</div>
        <div className="pill outline">{participant.points} XP</div>
      </div>
    </div>
  );
};

export default RankingRow;
