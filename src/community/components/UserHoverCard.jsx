import React from "react";
import { Link } from "../../routerShim";

const formatXp = (value) => new Intl.NumberFormat("ru-RU").format(value || 0);

const UserHoverCard = ({
  user,
  isFollowing,
  onFollowToggle,
  onMessage,
  onClose,
  variant = "floating",
}) => {
  if (!user) return null;

  return (
    <div className={`hover-card ${variant === "sheet" ? "hover-card-sheet" : ""}`}>
      <div className="hover-card-header">
        <div className="avatar bubble large">{user.avatarEmoji || user.avatarKey || user.name?.[0]}</div>
        <div className="hover-card-title">
          <div className="ranking-name">{user.name}</div>
          <p className="meta">
            уровень {user.level || "?"} · 💎 {formatXp(user.points || user.xp)}
          </p>
        </div>
        {variant === "sheet" && (
          <button className="ghost small" onClick={onClose} aria-label="Закрыть">✕</button>
        )}
      </div>
      {user.bio && <p className="meta">{user.bio}</p>}
      {user.interests?.length ? (
        <div className="chip-row wrap">
          {user.interests.map((tag) => (
            <span key={tag} className="pill subtle">
              #{tag}
            </span>
          ))}
        </div>
      ) : null}
      <div className="hover-card-actions">
        <button className="primary" onClick={() => onFollowToggle?.(user.id)}>
          {isFollowing ? "Вы подписаны" : "Подписаться"}
        </button>
        <button className="ghost" onClick={() => onMessage?.(user)}>
          Написать
        </button>
        <Link to={`/user/${user.id}`} className="ghost">
          Открыть профиль
        </Link>
      </div>
    </div>
  );
};

export default UserHoverCard;
