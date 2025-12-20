import React, { useEffect, useState } from "react";

const moods = [
  { id: "sleepy", label: "😴", hint: "Хочу паузу" },
  { id: "neutral", label: "😐", hint: "Норм" },
  { id: "light", label: "🙂", hint: "Спокоен" },
  { id: "happy", label: "😄", hint: "В ресурсе" },
  { id: "fire", label: "🔥", hint: "Макс. фокус" },
];

const cardBase = "flex h-full flex-col rounded-3xl border border-white/10 bg-white/5 p-5 shadow-lg";

const MoodReflection = ({ onChangeMood }) => {
  const [selected, setSelected] = useState(() => localStorage.getItem("noesis_mood") || "light");

  useEffect(() => {
    localStorage.setItem("noesis_mood", selected);
  }, [selected]);

  const handleSelect = (id) => {
    setSelected(id);
    onChangeMood?.(id);
  };

  return (
    <div className={cardBase}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.08em] text-white/60">Настроение</p>
          <h3 className="text-xl font-semibold text-white">Как ты сейчас?</h3>
        </div>
        <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/60">сохраняется</span>
      </div>
      <div className="mt-3 grid grid-cols-5 gap-2">
        {moods.map((mood) => (
          <button
            key={mood.id}
            onClick={() => handleSelect(mood.id)}
            className={`flex flex-col items-center gap-1 rounded-2xl border px-2 py-3 text-sm transition ${
              selected === mood.id
                ? "border-[#8A3FFC]/80 bg-[#8A3FFC]/15 text-white"
                : "border-white/10 bg-white/5 text-white/70 hover:border-[#8A3FFC]/70 hover:text-white"
            }`}
            aria-label={mood.hint}
          >
            <span className="text-2xl leading-none">{mood.label}</span>
            <span className="text-[11px] text-white/70">{mood.hint}</span>
          </button>
        ))}
      </div>
      <div className="mt-3 rounded-2xl border border-white/10 bg-[#0f172a] p-3 text-xs text-white/70">
        Выбор сохраняется локально. Выбери, чтобы рекомендации подстроились под настроение.
      </div>
    </div>
  );
};

export default MoodReflection;
