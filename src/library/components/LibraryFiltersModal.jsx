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
    <p className="text-sm text-gray-300 mb-2">{label}</p>
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isActive = selected.includes(option);
        return (
          <button
            key={option}
            className={`chip ${isActive ? "active" : ""}`}
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
  if (!open) return null;

  const toggle = (field, value) => {
    const next = filters[field].includes(value)
      ? filters[field].filter((v) => v !== value)
      : [...filters[field], value];
    onApply({ ...filters, [field]: next }, false);
  };

  const handleApply = () => onApply(filters, true);

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-card max-w-2xl w-full bg-[#0e0e0e] text-white border border-[#1f1f1f]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm text-gray-400">Расширенный поиск</p>
            <h3 className="text-xl font-semibold">Подбери материалы под себя</h3>
          </div>
          <button className="ghost" aria-label="Закрыть" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="grid gap-4 mt-4">
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
        <div className="flex items-center justify-between gap-3 mt-6">
          <button className="ghost" onClick={onReset}>
            Сбросить
          </button>
          <div className="flex gap-2">
            <button className="secondary" onClick={onClose}>
              Отмена
            </button>
            <button className="primary" onClick={handleApply}>
              Применить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibraryFiltersModal;
