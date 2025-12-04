import React, { useEffect, useState } from "react";

const moods = [
  { id: "fired", label: "🔥 Заряжен" },
  { id: "calm", label: "🙂 Спокойно" },
  { id: "ok", label: "😐 Нормально" },
  { id: "tired", label: "🥱 Устал" },
  { id: "low", label: "😔 Плохо" },
];

const storageKey = "noesis_mood";

const MoodSelector = ({ onChange }) => {
  const [value, setValue] = useState(() => {
    if (typeof localStorage === "undefined") return "ok";
    return localStorage.getItem(storageKey) || "ok";
  });

  useEffect(() => {
    if (typeof localStorage === "undefined") return;
    localStorage.setItem(storageKey, value);
  }, [value]);

  return (
    <section className="card mood-selector">
      <div className="section-head">
        <div>
          <p className="meta">Настрой</p>
          <h3>Как ты себя чувствуешь?</h3>
        </div>
      </div>
      <div className="mood-grid">
        {moods.map((mood) => (
          <button
            key={mood.id}
            className={`mood-pill ${value === mood.id ? "active" : ""}`}
            onClick={() => {
              setValue(mood.id);
              onChange?.(mood.id);
            }}
          >
            {mood.label}
          </button>
        ))}
      </div>
      <div className="meta subtle">Настрой влияет на подсказки маскота и рекомендации.</div>
    </section>
  );
};

export default MoodSelector;
