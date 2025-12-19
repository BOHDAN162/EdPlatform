import React, { useMemo } from "react";
import { Link } from "../../routerShim";

const medalEmojis = ["🥇", "🥈", "🥉"];

const formatNumber = (value) => new Intl.NumberFormat("ru-RU").format(value || 0);

const RankingRow = ({
  participant,
  position,
  isCurrent,
  metricLabel = "XP",
  metricValue,
}) => {
  const value = metricValue ?? participant.points;
  const placeBadge = useMemo(() => {
    if (position <= 3) return medalEmojis[position - 1];
    return `#${position}`;
  }, [position]);

  const avatarBadge = participant.avatarEmoji || participant.avatarKey || participant.name?.[0];

  return (
    <div
      className={`ranking-row transition duration-150 ease-out hover:-translate-y-0.5 hover:shadow-lg ${
        isCurrent ? "current" : ""
      } ${position <= 3 ? "ranking-row-top" : ""}`}
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
        <span className="pill subtle" title="Подробнее в профиле">
          Профиль
        </span>
      </div>
    </div>
  );
};

export default RankingRow;
