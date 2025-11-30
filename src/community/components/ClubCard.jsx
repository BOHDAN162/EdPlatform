import React from "react";

const ClubCard = ({ club, onJoin, onOpen }) => {
  return (
    <div className="card club-card" style={{ backgroundImage: club.coverColor }}>
      <div className="club-top">
        <div>
          <div className="card-header">{club.name}</div>
          <p className="meta">{club.description}</p>
          <div className="chip-row">
            {club.city && <span className="pill outline">{club.city}</span>}
            {club.theme && <span className="pill outline">{club.theme}</span>}
            <span className="pill subtle">{club.memberCount} участников</span>
          </div>
        </div>
      </div>
      <div className="club-actions">
        <button className="primary" onClick={() => (club.isMember ? onOpen(club) : onJoin(club.id))}>
          {club.isMember ? "Перейти в клуб" : "Войти в клуб"}
        </button>
        {club.isMember && (
          <button className="ghost" onClick={() => onOpen(club)}>
            О клубе
          </button>
        )}
      </div>
    </div>
  );
};

export default ClubCard;
