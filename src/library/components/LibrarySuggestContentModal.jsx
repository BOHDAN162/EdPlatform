import React, { useEffect, useState } from "react";

const typeOptions = ["книга", "кейс", "другое"];
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

const LibrarySuggestContentModal = ({ open, onClose }) => {
  const [payload, setPayload] = useState({
    type: "книга",
    title: "",
    reason: "",
    link: "",
    level: "",
    topics: [],
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (open) {
      setSubmitted(false);
    }
  }, [open]);

  if (!open) return null;

  const toggleTopic = (topic) => {
    setPayload((prev) => ({
      ...prev,
      topics: prev.topics.includes(topic) ? prev.topics.filter((t) => t !== topic) : [...prev.topics, topic],
    }));
  };

  const update = (field, value) => setPayload((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!payload.title.trim()) return;
    if (typeof window !== "undefined") {
      const existingRaw = window.localStorage.getItem("library-suggestions");
      const existing = existingRaw ? JSON.parse(existingRaw) : [];
      window.localStorage.setItem("library-suggestions", JSON.stringify([...existing, payload]));
    }
    setSubmitted(true);
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-card max-w-2xl w-full surface-elevated"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm muted-text">Предложить контент</p>
            <h3 className="text-xl font-semibold">Что добавить в библиотеку?</h3>
          </div>
          <button className="ghost" aria-label="Закрыть" onClick={onClose}>
            ✕
          </button>
        </div>

        <form className="grid gap-3 mt-4" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <label className="text-sm muted-text">Тип</label>
            <div className="flex flex-wrap gap-2">
              {typeOptions.map((item) => (
                <button
                  type="button"
                  key={item}
                  className={`chip ${payload.type === item ? "active" : ""}`}
                  onClick={() => update("type", item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div className="grid gap-1">
            <label className="text-sm muted-text">Название *</label>
            <input
              required
              value={payload.title}
              onChange={(e) => update("title", e.target.value)}
              className="rounded-xl border px-3 py-2 input-surface theme-input"
              placeholder="Название книги, кейса или формата"
            />
          </div>
          <div className="grid gap-1">
            <label className="text-sm muted-text">Почему это важно?</label>
            <textarea
              value={payload.reason}
              onChange={(e) => update("reason", e.target.value)}
              className="rounded-xl border px-3 py-2 input-surface theme-input"
              rows={2}
              placeholder="1–2 предложения"
            />
          </div>
          <div className="grid gap-1">
            <label className="text-sm muted-text">Ссылка (опционально)</label>
            <input
              value={payload.link}
              onChange={(e) => update("link", e.target.value)}
              className="rounded-xl border px-3 py-2 input-surface theme-input"
              placeholder="https://"
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm muted-text">Уровень (опционально)</label>
            <div className="flex flex-wrap gap-2">
              {levelOptions.map((item) => (
                <button
                  type="button"
                  key={item}
                  className={`chip ${payload.level === item ? "active" : ""}`}
                  onClick={() => update("level", item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div className="grid gap-2">
            <label className="text-sm muted-text">Тематика</label>
            <div className="flex flex-wrap gap-2">
              {topicOptions.map((topic) => {
                const active = payload.topics.includes(topic);
                return (
                  <button
                    type="button"
                    key={topic}
                    className={`chip ${active ? "active" : ""}`}
                    onClick={() => toggleTopic(topic)}
                  >
                    {topic}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex items-center justify-between gap-3 mt-2">
            {submitted ? <p className="text-sm" style={{ color: "var(--success)" }}>Отправлено, спасибо!</p> : <span />}
            <div className="flex gap-2">
              <button type="button" className="ghost" onClick={onClose}>
                Отмена
              </button>
              <button type="submit" className="primary">
                Отправить
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LibrarySuggestContentModal;
