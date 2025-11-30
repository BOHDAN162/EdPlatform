import React from "react";

const TeamCard = ({ team }) => {
  return (
    <div className="card team-card">
      <div className="card-header">{team.name}</div>
      <p className="meta">Совместный квест: {team.questId === "quest-starter" ? "1000 XP за неделю" : "Спринт по фокусу"}</p>
      <div className="team-avatars">
        {team.members.slice(0, 5).map((m) => (
          <div key={m.id} className="avatar small">{m.name[0]}</div>
        ))}
      </div>
      <div className="progress-line">
        <div className="bar" style={{ width: `${Math.min(90, team.members.length * 15)}%` }} />
      </div>
      <p className="meta">{team.members.length} в команде</p>
    </div>
  );
};

export default TeamCard;
