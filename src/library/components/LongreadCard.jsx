import React from "react";
import { Link } from "../../routerShim";

const levelPalette = {
  Начальный: { color: "#22c55e", label: "Начальный" },
  Средний: { color: "#f97316", label: "Средний" },
  Продвинутый: { color: "#ef4444", label: "Продвинутый" },
};

const LongreadCard = ({ item, theme }) => {
  const level = levelPalette[item.level] || levelPalette[item.level?.[0]?.toUpperCase() + item.level?.slice(1)] || {
    color: "#22c55e",
    label: item.level || "Начальный",
  };

  return (
    <Link
      to={`/library/article/${item.id}`}
      className="group flex h-full min-h-[210px] flex-col rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-lg transition duration-200 ease-out hover:-translate-y-1 hover:border-[var(--accent)]/60 hover:shadow-2xl"
    >
      <div className="flex items-center justify-between gap-2 text-xs font-semibold text-[var(--muted)]">
        <span
          className="inline-flex items-center gap-2 rounded-full px-3 py-1"
          style={{ background: `${theme.accent}22`, color: theme.accent, boxShadow: `0 0 0 1px ${theme.accent}33` }}
        >
          <span className="inline-block h-2 w-2 rounded-full" style={{ background: theme.accent }} />
          {item.topicShort || theme.title}
        </span>
        <span className="pill outline text-xs text-[var(--muted)]">{item.estimatedTime || "10–15 мин"}</span>
      </div>
      <h3 className="mt-3 text-lg font-semibold leading-snug text-[var(--fg)] line-clamp-2">{item.title}</h3>
      <p className="mt-2 text-sm text-[var(--muted)] line-clamp-2">{item.description}</p>
      <div className="mt-auto pt-4">
        <span
          className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-[var(--fg)] ring-1 ring-white/10"
          aria-label={`Уровень: ${level.label}`}
        >
          <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: level.color }} />
          {level.label}
        </span>
      </div>
    </Link>
  );
};

export default LongreadCard;
