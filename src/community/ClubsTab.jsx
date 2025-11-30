import React, { useMemo, useState } from "react";
import ClubCard from "./components/ClubCard";
import TeamCard from "./components/TeamCard";
import PostCard from "./components/PostCard";

const ClubsTab = ({ clubs, teams, posts, membershipSet, onJoin, onLeave, onLike, participants }) => {
  const [activeClub, setActiveClub] = useState(null);

  const filteredPosts = useMemo(() => {
    if (!activeClub) return posts.filter((p) => p.clubId);
    return posts.filter((p) => p.clubId === activeClub.id);
  }, [posts, activeClub]);

  const membersPreview = useMemo(() => {
    if (!activeClub) return [];
    const ids = activeClub.memberIds || [];
    return ids
      .map((id) => participants.find((p) => p.id === id))
      .filter(Boolean)
      .slice(0, 6);
  }, [activeClub, participants]);

  return (
    <div className="tab-content">
      <div className="tab-header">
        <div>
          <h2>Клубы и команды</h2>
          <p className="meta">Выбирай города и темы, заходи в клубы и собери свою мини-команду.</p>
        </div>
      </div>
      <div className="grid cards columns-2 responsive-columns">
        {clubs.map((club) => (
          <ClubCard key={club.id} club={club} onJoin={onJoin} onOpen={(c) => setActiveClub(c)} />
        ))}
      </div>
      {activeClub && (
        <div className="card club-detail">
          <div className="club-detail-head">
            <div>
              <div className="card-header">{activeClub.name}</div>
              <p className="meta">{activeClub.description}</p>
              <div className="chip-row">
                {activeClub.city && <span className="pill outline">{activeClub.city}</span>}
                {activeClub.theme && <span className="pill outline">{activeClub.theme}</span>}
                <span className="pill subtle">{activeClub.memberCount} участников</span>
              </div>
            </div>
            <div className="club-detail-actions">
              {membershipSet.has(activeClub.id) ? (
                <button className="ghost" onClick={() => onLeave(activeClub.id)}>Выйти</button>
              ) : (
                <button className="primary" onClick={() => onJoin(activeClub.id)}>Вступить</button>
              )}
            </div>
          </div>
          <div className="club-detail-grid">
            <div>
              <h3>Мини-рейтинг клуба</h3>
              <div className="chip-row">
                {membersPreview.map((member) => (
                  <span key={member.id} className="pill outline">{member.name}</span>
                ))}
              </div>
            </div>
            <div>
              <h3>Посты клуба</h3>
              <div className="grid cards columns-2">
                {filteredPosts.map((post) => (
                  <PostCard key={post.id} post={post} clubName={activeClub.name} onLike={onLike} />
                ))}
                {filteredPosts.length === 0 && <p className="meta">Пока нет постов.</p>}
              </div>
            </div>
          </div>
        </div>
      )}
      <div>
        <h3>Твои команды</h3>
        <p className="meta">Маленькие отряды по 3–5 человек с общими квестами.</p>
        <div className="grid cards columns-3 responsive-columns">
          {teams.map((team) => (
            <TeamCard key={team.id} team={team} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClubsTab;
