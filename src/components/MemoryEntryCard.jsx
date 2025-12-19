import React from "react";

const typeLabels = {
  text: "Текст",
  link: "Ссылка",
  photo: "Фото",
  sketch: "Рисунок",
};

const formatDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  return date.toLocaleDateString("ru-RU", { day: "2-digit", month: "short" });
};

const MemoryEntryCard = ({ entry, onClick }) => {
  return (
    <button className="memory-entry-card" onClick={onClick} role="listitem">
      <div className="memory-entry-head">
        <div>
          <div className="memory-entry-title">{entry.title}</div>
          <div className="memory-entry-date">{formatDate(entry.createdAt)}</div>
        </div>
        <span className="material-badge outline">{typeLabels[entry.type] || "Заметка"}</span>
      </div>
      <p className="memory-entry-text">{entry.text || entry.link || entry.sketchNote}</p>
      <div className="chip-row">
        {entry.tags?.slice(0, 3).map((tag) => (
          <span key={tag} className="tag">#{tag}</span>
        ))}
        {entry.link && <span className="tag">🔗</span>}
        {entry.attachmentName && <span className="tag">📎 {entry.attachmentName}</span>}
      </div>
    </button>
  );
};

export default MemoryEntryCard;
