import React from "react";

const templates = [
  { label: "💡 Напиши идею для своего проекта", type: "text", text: "Идея: ... Почему это важно? ... Как проверить?" },
  { label: "📚 Сохрани мысль из книги", type: "text", text: "Цитата: ... Вывод: ... Как применю: ..." },
  { label: "🎯 Запиши цель на неделю", type: "text", text: "Цель недели: ... Метрика успеха: ... Первый шаг: ..." },
];

const MemoryEmptyState = ({ onTemplate, compact = false }) => {
  return (
    <div className={`memory-empty ${compact ? "compact" : ""}`}>
      <div>
        <h3>Начни собирать свою память</h3>
        <p className="meta">Выбери подсказку — мы сразу откроем форму с текстом-заготовкой.</p>
      </div>
      <div className="template-grid">
        {templates.map((item) => (
          <button key={item.label} className="template-card" onClick={() => onTemplate(item.type, item.text)}>
            {item.label}
          </button>
        ))}
      </div>
      {!compact && (
        <div className="quick-shortcuts">
          <button className="ghost" onClick={() => onTemplate("photo", "Кадр: ")}>Добавить фото</button>
          <button className="ghost" onClick={() => onTemplate("link", "")}>Добавить ссылку</button>
          <button className="ghost" onClick={() => onTemplate("text", "Быстрая заметка: ")}>Быстрый текст</button>
          <button className="ghost" onClick={() => onTemplate("sketch", "Идея для рисунка: ")}>Рисунок</button>
        </div>
      )}
    </div>
  );
};

export default MemoryEmptyState;
