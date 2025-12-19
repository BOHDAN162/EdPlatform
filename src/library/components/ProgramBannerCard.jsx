import React from "react";

const ProgramBannerCard = ({ program, onSignup, onMore }) => {
  const fill = Math.round(((program.slotsTotal - program.slotsLeft) / program.slotsTotal) * 100);
  return (
    <div className="rounded-3xl border border-[#1f1f1f] bg-gradient-to-r from-[#141018] via-[#0f0c1f] to-[#0c111f] p-5 shadow-xl flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-violet-200">{program.label || "Программа"}</p>
          <h3 className="text-xl font-semibold leading-snug">{program.title}</h3>
          <p className="text-sm text-gray-300 mt-1 line-clamp-2">{program.description}</p>
        </div>
        <button className="ghost" onClick={() => onMore(program)} aria-label="Подробнее">
          ↗
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {(program.topics || []).map((topic) => (
          <span key={topic} className="pill outline text-xs text-gray-200">
            {topic}
          </span>
        ))}
      </div>
      <div className="text-sm text-gray-300">Осталось {program.slotsLeft} мест из {program.slotsTotal}</div>
      <div className="w-full h-2 rounded-full bg-[#1a1a1a] overflow-hidden">
        <div className="h-full" style={{ width: `${fill}%`, background: "linear-gradient(90deg, #8A3FFC, #22d3ee)" }} />
      </div>
      <div className="flex gap-2 flex-wrap justify-between items-center text-sm text-gray-200">
        <span className="text-gray-400">Формат: {program.format}</span>
        <button className="primary" onClick={() => onSignup(program)}>
          Записаться
        </button>
      </div>
    </div>
  );
};

export default ProgramBannerCard;
