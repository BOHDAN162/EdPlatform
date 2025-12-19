import React, { useEffect, useMemo, useState } from "react";
import MemoryEntryCard from "./MemoryEntryCard";
import MemoryEmptyState from "./MemoryEmptyState";

const quickActions = [
  { type: "text", label: "Быстрый текст", icon: "✍️", hint: "Записать мысль", template: "Мысль: ... Вывод: ..." },
  { type: "photo", label: "Фото", icon: "📸", hint: "Прикрепить снимок", template: "Кадр о..." },
  { type: "link", label: "Ссылка", icon: "🔗", hint: "Сохранить ресурс", template: "" },
  { type: "sketch", label: "Рисунок", icon: "🎨", hint: "Набросок идеи", template: "Рисунок про..." },
];

const MemoryPavilionModal = ({
  open,
  pavilion,
  entries = [],
  onClose,
  onCreate,
  onSelectEntry,
  onQuickAction,
}) => {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handler = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    if (open) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter((entry) =>
      [entry.title, entry.text, entry.link, entry.tags?.join(" "), entry.sketchNote]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(q))
    );
  }, [entries, query]);

  if (!open || !pavilion) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card pavilion-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div className="chip-row">
              <span className="material-badge outline">Павильон</span>
              <span className="material-badge" style={{ background: `${pavilion.color}20`, color: pavilion.color }}>
                {pavilion.shortName || pavilion.name}
              </span>
            </div>
            <h3>Павильон: {pavilion.name}</h3>
            <p className="meta">
              {entries.length} заметок • {pavilion.category}
            </p>
          </div>
          <button className="ghost" onClick={onClose}>Закрыть</button>
        </div>

        <div className="pavilion-toolbar">
          <div className="search-field">
            <span>🔍</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Поиск внутри павильона"
            />
            {query && (
              <button className="ghost small" onClick={() => setQuery("")}>
                Очистить
              </button>
            )}
          </div>
          <div className="toolbar-actions">
            {quickActions.map((action) => (
              <button key={action.type} className="ghost" onClick={() => onQuickAction(action.type, action.template)} title={action.hint}>
                {action.icon} {action.label}
              </button>
            ))}
            <button className="primary" onClick={() => onCreate("text")}>Добавить запись</button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <MemoryEmptyState onTemplate={onQuickAction} compact />
        ) : (
          <div className="pavilion-entries" role="list">
            {filtered.map((entry) => (
              <MemoryEntryCard key={entry.id} entry={entry} onClick={() => onSelectEntry(entry)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MemoryPavilionModal;
