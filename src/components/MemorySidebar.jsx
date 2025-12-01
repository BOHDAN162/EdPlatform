import React from "react";
import { Link } from "../routerShim";

const formatDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  return date.toLocaleDateString("ru-RU", { day: "2-digit", month: "short" });
};

const MemorySidebar = ({ landmark, entries, onAdd, onQuickAdd, onEdit, materialsIndex }) => {
  const materialsCount = entries.reduce((acc, entry) => acc + (entry.relatedMaterialIds?.length || 0), 0);

  return (
    <aside className="memory-sidebar card">
      {landmark ? (
        <>
          <div className="memory-sidebar-header">
            <div>
              <div className="chip-row">
                <span className="material-badge" style={{ background: `${landmark.color}20`, color: landmark.color }}>
                  {landmark.category}
                </span>
                {landmark.district && <span className="material-badge outline">{landmark.district}</span>}
              </div>
              <h2>{landmark.name}</h2>
              <p className="meta">{landmark.description}</p>
            </div>
            <button className="primary outline" onClick={onAdd}>
              Добавить запись
            </button>
          </div>

          <div className="memory-stats">
            <div className="stat-box">
              <div className="stat-number">{entries.length}</div>
              <div className="stat-label">Записей</div>
            </div>
            <div className="stat-box">
              <div className="stat-number">{materialsCount}</div>
              <div className="stat-label">Связанные материалы</div>
            </div>
            <button className="ghost" onClick={onQuickAdd}>
              Быстрая заметка
            </button>
          </div>

          <div className="memory-entries">
            {entries.length === 0 && (
              <div className="empty-state">
                <p>Здесь пока пусто. Добавь первую запись — например, выводы из последнего урока или идеи для проекта.</p>
                <button className="primary" onClick={onAdd}>
                  Добавить запись
                </button>
              </div>
            )}

            {entries.map((entry) => (
              <div key={entry.id} className="memory-entry" onClick={() => onEdit(entry)}>
                <div className="memory-entry-head">
                  <div>
                    <div className="memory-entry-title">{entry.title}</div>
                    <div className="memory-entry-date">{formatDate(entry.createdAt)}</div>
                  </div>
                  <div className="memory-entry-badges">
                    <span className="material-badge outline">Материалов: {entry.relatedMaterialIds?.length || 0}</span>
                    <span className="material-badge outline">Тегов: {entry.tags?.length || 0}</span>
                  </div>
                </div>
                <p className="memory-entry-text">{entry.text.slice(0, 140)}{entry.text.length > 140 ? "…" : ""}</p>
                {entry.tags?.length > 0 && (
                  <div className="chip-row">
                    {entry.tags.map((tag) => (
                      <span key={tag} className="tag">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
                {entry.relatedMaterialIds?.length > 0 && (
                  <div className="related-materials">
                    {entry.relatedMaterialIds.slice(0, 2).map((id) => (
                      <Link key={id} to={`/material/${id}`} className="related-link" onClick={(e) => e.stopPropagation()}>
                        {materialsIndex[id]?.title || "Материал"}
                      </Link>
                    ))}
                    {entry.relatedMaterialIds.length > 2 && <span className="meta">+ ещё {entry.relatedMaterialIds.length - 2}</span>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="empty-state">
          <p>Выбери объект на карте, чтобы увидеть записи.</p>
        </div>
      )}
    </aside>
  );
};

export default MemorySidebar;
