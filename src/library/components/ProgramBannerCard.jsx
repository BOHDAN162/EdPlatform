import React from "react";

const ProgramBannerCard = ({ program, onSignup, onMore }) => {
  const fill = Math.round(((program.slotsTotal - program.slotsLeft) / program.slotsTotal) * 100);
  return (
    <button
      type="button"
      onClick={() => onMore(program)}
      className="text-left rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-xl flex flex-col gap-3 transition duration-200 ease-out hover:-translate-y-1 hover:shadow-2xl hover:border-[var(--accent)]/60"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-[var(--muted)]">{program.label || "Программа"}</p>
          <h3 className="text-xl font-semibold leading-snug text-[var(--fg)]">{program.title}</h3>
          <p className="text-sm text-[var(--muted)] mt-1 line-clamp-2">{program.description}</p>
        </div>
        <span className="ghost" aria-label="Подробнее">
          ↗
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {(program.topics || []).map((topic) => (
          <span key={topic} className="pill outline text-xs text-[var(--muted)]">
            {topic}
          </span>
        ))}
      </div>
      <div className="text-sm text-[var(--muted)]">Осталось {program.slotsLeft} мест из {program.slotsTotal}</div>
      <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
        <div className="h-full" style={{ width: `${fill}%`, background: "linear-gradient(90deg, #8A3FFC, #22d3ee)" }} />
      </div>
      <div className="flex gap-2 flex-wrap justify-between items-center text-sm text-[var(--muted)]">
        <span className="text-[var(--muted)]">Формат: {program.format}</span>
        <button
          className="primary"
          onClick={(e) => {
            e.stopPropagation();
            onSignup(program);
          }}
        >
          Записаться
        </button>
      </div>
    </button>
  );
};

export default ProgramBannerCard;
