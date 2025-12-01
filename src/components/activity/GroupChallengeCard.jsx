import React from "react";

const ProgressBar = ({ value }) => (
  <div className="group-progress-bar">
    <div className="group-progress-fill" style={{ width: `${Math.min(100, value)}%` }} />
  </div>
);

const GroupChallengeCard = ({ title, description, deadline, progress, target, teamName, accent }) => {
  const ratio = target ? Math.min(100, Math.round((progress / target) * 100)) : 0;
  return (
    <div className="group-challenge-card">
      <div className="challenge-top">
        <div>
          <div className="meta subtle">{teamName}</div>
          <h4>{title}</h4>
          <p className="meta">{description}</p>
        </div>
        <span className="chip" style={{ background: `${accent || "#8b5cf6"}1a`, color: accent || "#8b5cf6" }}>
          до {deadline}
        </span>
      </div>
      <ProgressBar value={ratio} />
      <div className="challenge-footer">
        <div className="meta">{progress} / {target} XP</div>
        <div className="meta subtle">Командный прогресс</div>
      </div>
    </div>
  );
};

export default GroupChallengeCard;
