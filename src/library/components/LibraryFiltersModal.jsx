import React from "react";

const durationOptions = ["до 5 мин", "5–15", "15–30", "30+"];
const levelOptions = ["легкий", "средний", "сложный"];
const topicOptions = [
  "бизнес",
  "мышление",
  "финансы",
  "коммуникации",
  "продуктивность",
  "лидерство",
  "стресс",
  "самодисциплина",
];
const formatOptions = ["текст", "тест", "игра", "курс"];

const ChipGroup = ({ label, options, selected, onToggle }) => (
  <div>
    <p className="mb-1.5 text-sm text-gray-300">{label}</p>
    <div className="flex flex-wrap gap-2.5">
      {options.map((option) => {
        const isActive = selected.includes(option);
        return (
          <button
            key={option}
            className={`chip px-3 py-1.5 text-sm ${isActive ? "active" : ""}`}
            onClick={() => onToggle(option)}
          >
            {option}
          </button>
        );
      })}
    </div>
  </div>
);

const LibraryFiltersModal = ({ open, filters, onClose, onApply, onReset }) => {
  const toggle = (field, value) => {
    const next = filters[field].includes(value)
      ? filters[field].filter((v) => v !== value)
      : [...filters[field], value];
    onApply({ ...filters, [field]: next }, false);
  };

  const handleApply = () => onApply(filters, true);

  return (
    <div
      className={`overflow-hidden transition-all duration-300 ${open ? "max-h-[480px] opacity-100" : "max-h-0 opacity-0"}`}
    >
      <div className="mt-2 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-lg md:max-w-5xl md:mx-auto">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm text-[var(--muted)]">Расширенный поиск</p>
            <h3 className="text-lg font-semibold text-[var(--fg)]">Подбери материалы под себя</h3>
          </div>
          <button className="ghost" aria-label="Закрыть" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="grid gap-3 mt-3 md:grid-cols-2 md:gap-4">
          <ChipGroup
            label="Длительность"
            options={durationOptions}
            selected={filters.durations}
            onToggle={(v) => toggle("durations", v)}
          />
          <ChipGroup
            label="Уровень"
            options={levelOptions}
            selected={filters.levels}
            onToggle={(v) => toggle("levels", v)}
          />
          <ChipGroup
            label="Тематика"
            options={topicOptions}
            selected={filters.topics}
            onToggle={(v) => toggle("topics", v)}
          />
          <ChipGroup
            label="Формат"
            options={formatOptions}
            selected={filters.formats}
            onToggle={(v) => toggle("formats", v)}
          />
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 md:mt-3">
          <button className="ghost text-sm" onClick={onReset}>
            Сбросить
          </button>
          <div className="flex flex-wrap gap-2">
            <button className="secondary px-4 py-2 text-sm" onClick={onClose}>
              Свернуть
            </button>
            <button className="primary px-4 py-2 text-sm" onClick={handleApply}>
              Применить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibraryFiltersModal;
