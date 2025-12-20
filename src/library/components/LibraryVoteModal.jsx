import React, { useEffect, useState } from "react";

const LibraryVoteModal = ({ open, onClose }) => {
  const bookOptions = [
    "Атомные привычки",
    "Думай и богатей",
    "Богатый папа, бедный папа",
    "Психология влияния",
    "Rework",
    "Стартап за $100",
    "Черный лебедь",
    "Сделано, чтобы прилипать",
  ];

  const caseOptions = [
    "Кейс: рост продаж",
    "Кейс: переговоры",
    "Кейс: запуск продукта",
    "Кейс: финмодель",
    "Кейс: команда",
    "Кейс: маркетинг",
    "Кейс: сервис",
    "Кейс: удержание",
  ];

  const [selectedBooks, setSelectedBooks] = useState([]);
  const [selectedCases, setSelectedCases] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem("library-votes");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSelectedBooks(parsed.books || []);
        setSelectedCases(parsed.cases || []);
        setSubmitted(Boolean(parsed.submitted));
      } catch (e) {
        /* noop */
      }
    }
  }, []);

  if (!open) return null;

  const toggleItem = (type, value) => {
    const updater = type === "book" ? setSelectedBooks : setSelectedCases;
    updater((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value].slice(0, 3)));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        "library-votes",
        JSON.stringify({ books: selectedBooks, cases: selectedCases, submitted: true })
      );
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-card max-w-3xl w-full surface-elevated"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm muted-text">Голосование</p>
            <h3 className="text-xl font-semibold">Что добавить первым?</h3>
            <p className="text-sm muted-text mt-1">Выбирай до 3 вариантов в каждой категории</p>
          </div>
          <button className="ghost" aria-label="Закрыть" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <div className="rounded-2xl border p-4 surface-card">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold">Книги</h4>
              <span className="text-xs muted-text">Выбрано: {selectedBooks.length}/3</span>
            </div>
            <div className="grid gap-2">
              {bookOptions.map((item) => {
                const active = selectedBooks.includes(item);
                return (
                  <label
                    key={item}
                    className={`flex items-center gap-3 rounded-xl border px-3 py-2 cursor-pointer transition ${
                      active
                        ? "border-[color:var(--accent)] bg-[color-mix(in_srgb,var(--accent-weak)_65%,transparent)]"
                        : "border-[color:var(--border)]"
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="accent-[var(--accent)]"
                      checked={active}
                      onChange={() => toggleItem("book", item)}
                    />
                    <span className="text-sm" style={{ color: "var(--text)" }}>{item}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border p-4 surface-card">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold">Кейсы</h4>
              <span className="text-xs muted-text">Выбрано: {selectedCases.length}/3</span>
            </div>
            <div className="grid gap-2">
              {caseOptions.map((item) => {
                const active = selectedCases.includes(item);
                return (
                  <label
                    key={item}
                    className={`flex items-center gap-3 rounded-xl border px-3 py-2 cursor-pointer transition ${
                      active
                        ? "border-[color:var(--accent)] bg-[color-mix(in_srgb,var(--accent-weak)_65%,transparent)]"
                        : "border-[color:var(--border)]"
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="accent-[var(--accent)]"
                      checked={active}
                      onChange={() => toggleItem("case", item)}
                    />
                    <span className="text-sm" style={{ color: "var(--text)" }}>{item}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 mt-6">
          {submitted ? (
            <p className="text-sm" style={{ color: "var(--success)" }}>
              Спасибо! Мы учтём твой выбор.
            </p>
          ) : (
            <p className="text-sm muted-text">Можно изменить выбор до отправки.</p>
          )}
          <div className="flex gap-2">
            <button className="ghost" onClick={() => { setSelectedBooks([]); setSelectedCases([]); }}>
              Очистить
            </button>
            <button className="primary" onClick={handleSubmit}>
              Отправить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibraryVoteModal;
