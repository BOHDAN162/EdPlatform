import React, { useEffect, useMemo, useState } from "react";
import { materials } from "../libraryData";

const normalizeTags = (value) =>
  value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

const MemoryEntryForm = ({ entry, landmark, onCancel, onSave, onDelete }) => {
  const [title, setTitle] = useState(entry?.title || "");
  const [text, setText] = useState(entry?.text || "");
  const [tagsInput, setTagsInput] = useState(entry?.tags?.join(", ") || "");
  const [selectedMaterials, setSelectedMaterials] = useState(entry?.relatedMaterialIds || []);
  const [error, setError] = useState("");

  useEffect(() => {
    setTitle(entry?.title || "");
    setText(entry?.text || "");
    setTagsInput(entry?.tags?.join(", ") || "");
    setSelectedMaterials(entry?.relatedMaterialIds || []);
  }, [entry]);

  const materialOptions = useMemo(() => materials.map((item) => ({
    id: item.id,
    label: `[${item.type === "course" ? "Курс" : item.type === "article" ? "Статья" : "Тест"}] ${
      item.title
    } — ${item.estimatedTime || "15 минут"}`,
  })), []);

  const handleSubmit = () => {
    if (!title.trim() || !text.trim()) {
      setError("Заполни заголовок и текст заметки");
      return;
    }
    setError("");
    const tags = normalizeTags(tagsInput);
    onSave({
      title: title.trim(),
      text: text.trim(),
      tags,
      relatedMaterialIds: selectedMaterials,
    });
  };

  const toggleMaterial = (materialId) => {
    setSelectedMaterials((prev) =>
      prev.includes(materialId)
        ? prev.filter((id) => id !== materialId)
        : [...prev, materialId]
    );
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card memory-modal">
        <div className="modal-header">
          <div>
            <div className="chip-row">
              <span className="material-badge outline">{landmark?.shortName || landmark?.name}</span>
              <span className="material-badge" style={{ background: `${landmark?.color || "#8b5cf6"}20`, color: landmark?.color || "#8b5cf6" }}>
                {landmark?.category || "зона памяти"}
              </span>
            </div>
            <h3>{entry ? "Редактировать запись" : "Новая запись"}</h3>
          </div>
          <button className="ghost" onClick={onCancel}>
            Закрыть
          </button>
        </div>

        <label className="stacked">
          Заголовок
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Например: Выводы из урока по переговорам" />
        </label>
        <label className="stacked">
          Текст
          <textarea
            rows={6}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Опиши, что запомнил, какие выводы сделал и что попробуешь в следующий раз"
          />
        </label>

        <div className="two-cols">
          <label className="stacked">
            Теги
            <input
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="мышление, проект, ошибки"
            />
            <p className="meta">Разделяй теги запятой, чтобы находить записи быстрее.</p>
          </label>
          <div className="stacked">
            <div className="field-label">Материалы платформы</div>
            <div className="material-select">
              {materialOptions.map((item) => (
                <label key={item.id} className="material-option">
                  <input
                    type="checkbox"
                    checked={selectedMaterials.includes(item.id)}
                    onChange={() => toggleMaterial(item.id)}
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {error && <div className="error">{error}</div>}

        <div className="modal-actions">
          <button className="primary" onClick={handleSubmit}>
            Сохранить
          </button>
          <button className="ghost" onClick={onCancel}>
            Отмена
          </button>
          {entry && (
            <button className="ghost danger" onClick={() => onDelete(entry.id)}>
              Удалить запись
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemoryEntryForm;
