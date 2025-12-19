import React from "react";
import { Link } from "../../routerShim";

const RankingRow = ({ participant, position, isCurrent, metricLabel = "XP", metricValue }) => {
  const value = metricValue ?? participant.points;
  return (
    <Link to={`/user/${participant.id}`} className={`ranking-row ${isCurrent ? "current" : ""}`}>
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
        <div className="pill outline">{value} {metricLabel}</div>
      </div>
    </Link>
  );
};

export default RankingRow;
