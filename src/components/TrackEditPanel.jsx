import React, { useEffect, useState } from "react";

const TrackEditPanel = ({ steps = [], onSave, onCancel }) => {
  const [draftSteps, setDraftSteps] = useState(steps);

  useEffect(() => {
    setDraftSteps(steps);
  }, [steps]);

  const updateStep = (idx, key, value) => {
    setDraftSteps((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [key]: value };
      return next;
    });
  };

  const handleSave = () => onSave?.(draftSteps);

  return (
    <div className="track-edit-panel">
      <div className="panel-head">
        <div>
          <p className="pill outline">Редактирование</p>
          <h3>Настрой трек под себя</h3>
          <p className="meta">Можно поменять названия этапов и короткие описания.</p>
        </div>
        <div className="panel-actions">
          <button className="ghost" onClick={onCancel}>
            Отмена
          </button>
          <button className="primary" onClick={handleSave}>
            Сохранить изменения
          </button>
        </div>
      </div>
      <div className="edit-list">
        {draftSteps.map((step, idx) => (
          <div key={step.id} className="edit-row">
            <div className="edit-index">{idx + 1}</div>
            <div className="edit-fields">
              <label>
                Название этапа
                <input
                  value={step.title}
                  onChange={(e) => updateStep(idx, "title", e.target.value)}
                  placeholder="Название шага"
                />
              </label>
              <label>
                Описание
                <textarea
                  value={step.description || ""}
                  onChange={(e) => updateStep(idx, "description", e.target.value)}
                  rows={2}
                  placeholder="Коротко, что делать на этапе"
                />
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrackEditPanel;
