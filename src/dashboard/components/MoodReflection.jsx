import React, { useState } from "react";

const moods = [
  { id: "happy", label: "Рад", icon: "😊", color: "bg-[#22c55e]/20" },
  { id: "focused", label: "В фокусе", icon: "🎯", color: "bg-[#8A3FFC]/20" },
  { id: "calm", label: "Спокоен", icon: "🌊", color: "bg-[#0ea5e9]/20" },
  { id: "tired", label: "Устал", icon: "😴", color: "bg-white/5" },
];

const MoodReflection = ({ onChangeMood, onReflect }) => {
  const [selected, setSelected] = useState("happy");
  const [note, setNote] = useState("");

  const handleSelect = (id) => {
    setSelected(id);
    onChangeMood?.(id);
  };

  const handleSave = () => {
    onReflect?.({ mood: selected, note });
    setNote("");
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.08em] text-white/60">Настроение</p>
          <h3 className="text-xl font-semibold text-white">Как ты сейчас?</h3>
        </div>
        <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/60">сохраняется</span>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {moods.map((mood) => (
          <button
            key={mood.id}
            onClick={() => handleSelect(mood.id)}
            className={`flex items-center gap-2 rounded-full border px-3 py-2 text-sm transition ${
              selected === mood.id
                ? "border-[#8A3FFC]/80 bg-[#8A3FFC]/15 text-white"
                : "border-white/10 bg-white/5 text-white/70 hover:border-[#8A3FFC]/70 hover:text-white"
            }`}
          >
            <span className="text-lg">{mood.icon}</span>
            {mood.label}
          </button>
        ))}
      </div>
      <div className="mt-4 space-y-2">
        <label className="text-sm text-white/70" htmlFor="mood-reflection">
          Коротко запиши, что чувствуешь
        </label>
        <textarea
          id="mood-reflection"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="min-h-[96px] w-full rounded-2xl border border-white/10 bg-[#0f172a] p-3 text-sm text-white focus:border-[#8A3FFC]/60 focus:outline-none"
          placeholder="Например: собрался, хочу закрыть задание и походить 10к шагов"
        />
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="rounded-full bg-[#8A3FFC] px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-[#8A3FFC]/30 transition hover:-translate-y-0.5"
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
};

export default MoodReflection;
