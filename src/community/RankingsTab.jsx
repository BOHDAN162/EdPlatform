import React, { useMemo } from "react";
import RankingRow from "./components/RankingRow";

const leagueName = (points) => {
  if (points >= 800) return "Лига менторов";
  if (points >= 500) return "Лига создателей";
  if (points >= 250) return "Лига исследователей";
  return "Лига новичков";
};

const RankingsTab = ({ participants, currentUser }) => {
  const sorted = useMemo(() => [...participants].sort((a, b) => (b.points || 0) - (a.points || 0)), [participants]);
  const myIndex = currentUser ? sorted.findIndex((p) => p.id === currentUser.id) : -1;
  const league = currentUser ? leagueName(currentUser.points || 0) : "Лига";

  return (
    <div className="tab-content">
      <div className="tab-header">
        <div>
          <h2>Лиги и рейтинги</h2>
          <p className="meta">Топ участников по XP за неделю и сезон. Врывайся в верхнюю десятку.</p>
        </div>
        {currentUser && <span className="pill outline">Твоя лига: {league}</span>}
      </div>
      <div className="card ranking-card">
        {sorted.slice(0, 10).map((p, idx) => (
          <RankingRow key={p.id} participant={p} position={idx + 1} isCurrent={currentUser?.id === p.id} />
        ))}
        {myIndex >= 10 && (
          <>
            <div className="meta">...</div>
            <RankingRow
              participant={sorted[myIndex]}
              position={myIndex + 1}
              isCurrent
            />
          </>
        )}
      </div>
      <div className="card">
        <div className="card-header">Награды лиг</div>
        <p className="meta">Топ-3 участника недели получают доп. XP и значок «Лидер недели». Следим за активностью в ленте, вопросах и чатах.</p>
      </div>
    </div>
  );
};

export default RankingsTab;
