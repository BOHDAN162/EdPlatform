import React, { useEffect, useMemo, useState } from "react";
import { Link } from "../../routerShim";
import UserHoverCard from "./UserHoverCard";

const medalEmojis = ["🥇", "🥈", "🥉"];

const formatNumber = (value) => new Intl.NumberFormat("ru-RU").format(value || 0);

const RankingRow = ({
  participant,
  position,
  isCurrent,
  metricLabel = "XP",
  metricValue,
  isFollowing,
  onFollowToggle,
  onMessage,
}) => {
  const value = metricValue ?? participant.points;
  const [showCard, setShowCard] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 768px)");
    setIsTouch(query.matches);
    const handleChange = (e) => setIsTouch(e.matches);
    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, []);

  const placeBadge = useMemo(() => {
    if (position <= 3) return medalEmojis[position - 1];
    return `#${position}`;
  }, [position]);

  const avatarBadge = participant.avatarEmoji || participant.avatarKey || participant.name?.[0];

  const openCard = () => {
    if (!isTouch) setShowCard(true);
  };

  const closeCard = () => setShowCard(false);

  const handleToggleSheet = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setShowCard((prev) => !prev);
  };

  return (
    <div
      className={`ranking-row ${isCurrent ? "current" : ""} ${position <= 3 ? "ranking-row-top" : ""}`}
      onMouseEnter={openCard}
      onMouseLeave={closeCard}
    >
      <Link to={`/user/${participant.id}`} className="ranking-left">
        <span className={`pill ${position <= 3 ? "pill-medal" : "subtle"}`}>{placeBadge}</span>
        <div className="avatar small">
          <span className="emoji-avatar">{avatarBadge}</span>
        </div>
        <div className="ranking-copy">
          <div className="ranking-name">{participant.name}</div>
          <div className="meta">
            уровень {participant.level || "?"} · {participant.city || "онлайн"}
          </div>
        </div>
      </Link>
      <div className="ranking-right">
        <div className="meta" title="Опыт за всё время">
          💎 {formatNumber(participant.points || participant.xp)}
        </div>
        <div className="pill outline" title="Активность вкладки">
          {formatNumber(value)} {metricLabel}
        </div>
        <button className="ghost icon" onClick={handleToggleSheet} aria-label="Подробнее">
          ⋯
        </button>
      </div>

      {showCard && !isTouch && (
        <div className="hover-card-wrapper">
          <UserHoverCard
            user={participant}
            isFollowing={isFollowing}
            onFollowToggle={onFollowToggle}
            onMessage={onMessage}
          />
        </div>
      )}
      {showCard && isTouch && (
        <div className="hover-sheet-overlay" onClick={closeCard}>
          <div className="hover-sheet" onClick={(e) => e.stopPropagation()}>
            <UserHoverCard
              user={participant}
              isFollowing={isFollowing}
              onFollowToggle={onFollowToggle}
              onMessage={onMessage}
              onClose={closeCard}
              variant="sheet"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default RankingRow;
