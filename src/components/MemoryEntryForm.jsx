import React, { useEffect, useMemo, useRef, useState } from "react";
import { materials } from "../libraryData";

const entryTypes = [
  { value: "text", label: "Текст", description: "Мысли и выводы" },
  { value: "link", label: "Ссылка", description: "Статья, видео или ресурс" },
  { value: "photo", label: "Фото", description: "Снимок или файл" },
  { value: "sketch", label: "Рисунок", description: "Набросок идеи" },
];

const normalizeTags = (value) =>
  value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

const MemoryEntryForm = ({ entry, landmark, onCancel, onSave, onDelete, defaultType = "text", prefillText = "" }) => {
  const [title, setTitle] = useState(entry?.title || "");
  const [text, setText] = useState(entry?.text || prefillText || "");
  const [tagsInput, setTagsInput] = useState(entry?.tags?.join(", ") || "");
  const [selectedMaterials, setSelectedMaterials] = useState(entry?.relatedMaterialIds || []);
  const [type, setType] = useState(entry?.type || defaultType);
  const [link, setLink] = useState(entry?.link || "");
  const [attachmentName, setAttachmentName] = useState(entry?.attachmentName || "");
  const [sketchNote, setSketchNote] = useState(entry?.sketchNote || "");
  const [error, setError] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    setTitle(entry?.title || "");
    setText(entry?.text || prefillText || "");
    setTagsInput(entry?.tags?.join(", ") || "");
    setSelectedMaterials(entry?.relatedMaterialIds || []);
    setType(entry?.type || defaultType);
    setLink(entry?.link || "");
    setAttachmentName(entry?.attachmentName || "");
    setSketchNote(entry?.sketchNote || "");
  }, [defaultType, entry, prefillText]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    try {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = "ru-RU";
      recognitionRef.current.continuous = true;
      setVoiceSupported(true);
    } catch (err) {
      console.warn("Speech recognition not available", err);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    const handler = (event) => {
      if (event.key === "Escape") {
        onCancel();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onCancel]);

  const materialOptions = useMemo(() => materials.map((item) => ({
    id: item.id,
    label: `[${item.type === "course" ? "Курс" : item.type === "article" ? "Статья" : "Тест"}] ${
      item.title
    } — ${item.estimatedTime || "15 минут"}`,
  })), []);

  const handleSubmit = () => {
    const hasText = text.trim().length > 0;
    const hasLink = link.trim().length > 0;
    const hasAttachment = attachmentName.trim().length > 0;
    const hasSketch = sketchNote.trim().length > 0;

    if (type === "text" && !hasText) {
      setError("Добавь текст заметки — даже пару слов");
      return;
    }
    if (type === "link" && !hasLink) {
      setError("Вставь ссылку, чтобы сохранить ресурс");
      return;
    }
    if (type === "photo" && !hasAttachment && !hasText) {
      setError("Прикрепи файл или подпиши снимок");
      return;
    }
    if (type === "sketch" && !hasSketch && !hasText) {
      setError("Опиши идею или добавь пометку к рисунку");
      return;
    }

    setError("");
    const tags = normalizeTags(tagsInput);
    onSave({
      title: title.trim() || "Без названия",
      text: text.trim(),
      tags,
      relatedMaterialIds: selectedMaterials,
      type,
      link: link.trim(),
      attachmentName: attachmentName.trim(),
      sketchNote: sketchNote.trim(),
    });
  };

  const toggleMaterial = (materialId) => {
    setSelectedMaterials((prev) =>
      prev.includes(materialId)
        ? prev.filter((id) => id !== materialId)
        : [...prev, materialId]
    );
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachmentName(file.name);
      if (!title.trim()) setTitle(file.name.replace(/\.[^.]+$/, ""));
    }
  };

  const startVoice = () => {
    if (!recognitionRef.current) return;
    recognitionRef.current.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join(" ");
      setText((prev) => `${prev ? `${prev} ` : ""}${transcript}`.trim());
    };
    recognitionRef.current.onend = () => setIsRecording(false);
    recognitionRef.current.start();
    setIsRecording(true);
  };

  const stopVoice = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
  };

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal-card memory-modal" onClick={(e) => e.stopPropagation()}>
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

        <div className="entry-type-grid">
          {entryTypes.map((item) => (
            <button
              key={item.value}
              className={`type-chip ${type === item.value ? "active" : ""}`}
              onClick={() => setType(item.value)}
            >
              <div className="type-chip-title">{item.label}</div>
              <div className="type-chip-desc">{item.description}</div>
            </button>
          ))}
        </div>

        <label className="stacked">
          Заголовок
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Например: Выводы из урока по переговорам" />
        </label>

        <label className="stacked">
          Текст
          <div className="textarea-with-actions">
            <textarea
              rows={6}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Опиши, что запомнил, какие выводы сделал и что попробуешь в следующий раз"
            />
            <div className="textarea-actions">
              <button
                type="button"
                className={`ghost small ${isRecording ? "danger" : ""}`}
                onClick={isRecording ? stopVoice : startVoice}
                disabled={!voiceSupported}
                title={voiceSupported ? "Голосовой ввод" : "Голосовой ввод не поддерживается"}
              >
                {isRecording ? "Стоп" : "🎙 Голос"}
              </button>
            </div>
          </div>
        </label>

        {type === "link" && (
          <label className="stacked">
            Ссылка
            <input
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://статья или видео"
              inputMode="url"
            />
          </label>
        )}

        {type === "photo" && (
          <label className="stacked">
            Фото или файл
            <input type="file" onChange={handleFileChange} />
            {attachmentName && <p className="meta">Прикреплено: {attachmentName}</p>}
          </label>
        )}

        {type === "sketch" && (
          <label className="stacked">
            Подпиши рисунок или идею
            <textarea
              rows={3}
              value={sketchNote}
              onChange={(e) => setSketchNote(e.target.value)}
              placeholder="Коротко: что изображено, какая мысль?"
            />
          </label>
        )}

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
