import React, { useMemo, useState } from "react";
import { habitCategories, priorityLabels, useHabits, weekDayNames } from "./habitsStore";

const formatWeekLabel = (weekStart, offset = 0) => {
  const end = new Date(weekStart);
  end.setDate(weekStart.getDate() + 6);
  const options = { day: "numeric", month: "short" };
  const range = `${weekStart.toLocaleDateString("ru-RU", options)} — ${end.toLocaleDateString("ru-RU", options)}`;
  if (offset === 0) return `Эта неделя · ${range}`;
  if (offset === -1) return `Прошлая неделя · ${range}`;
  if (offset === 1) return `Следующая неделя · ${range}`;
  return `${offset > 0 ? "+" : ""}${offset} нед. · ${range}`;
};

const SummaryCard = ({ label, value, hint }) => (
  <div className="summary-tile">
    <p className="meta subtle">{label}</p>
    <div className="summary-value">{value}</div>
    <p className="meta subtle">{hint}</p>
  </div>
);

const WeekSelector = ({ label, onPrev, onNext, onReset }) => (
  <div className="week-selector">
    <button className="ghost icon" onClick={onPrev} aria-label="Предыдущая неделя">
      ‹
    </button>
    <div className="week-label" onClick={onReset} role="button" tabIndex={0}>
      {label}
    </div>
    <button className="ghost icon" onClick={onNext} aria-label="Следующая неделя">
      ›
    </button>
  </div>
);

const HabitFormModal = ({ open, onClose, onSubmit, initial }) => {
  const [form, setForm] = useState(
    initial || {
      name: "",
      category: "productivity",
      priority: 2,
      targetPerWeek: 3,
    }
  );

  React.useEffect(() => {
    if (initial) {
      setForm(initial);
    } else {
      setForm({ name: "", category: "productivity", priority: 2, targetPerWeek: 3 });
    }
  }, [initial]);

  if (!open) return null;

  const handleChange = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = () => {
    if (!form.name.trim()) return;
    const target = Math.min(7, Math.max(1, Number(form.targetPerWeek) || 1));
    onSubmit({ ...form, targetPerWeek: target });
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card wide">
        <div className="modal-header">
          <div>
            <div className="card-header">{initial ? "Редактировать привычку" : "Новая привычка"}</div>
            <p className="meta">Название обязательно, цель — от 1 до 7 раз в неделю.</p>
          </div>
          <button className="ghost" onClick={onClose}>
            Закрыть
          </button>
        </div>
        <div className="form-grid">
          <label className="form-field">
            <span className="meta subtle">Название</span>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Например, зарядка утром"
            />
          </label>
          <label className="form-field">
            <span className="meta subtle">Категория</span>
            <select value={form.category} onChange={(e) => handleChange("category", e.target.value)}>
              {Object.entries(habitCategories).map(([value, meta]) => (
                <option key={value} value={value}>
                  {meta.label}
                </option>
              ))}
            </select>
          </label>
          <label className="form-field">
            <span className="meta subtle">Приоритет</span>
            <select value={form.priority} onChange={(e) => handleChange("priority", Number(e.target.value))}>
              {[1, 2, 3].map((level) => (
                <option key={level} value={level}>
                  {priorityLabels[level].label}
                </option>
              ))}
            </select>
          </label>
          <label className="form-field">
            <span className="meta subtle">Цель в неделю</span>
            <input
              type="number"
              min={1}
              max={7}
              value={form.targetPerWeek}
              onChange={(e) => handleChange("targetPerWeek", Number(e.target.value))}
            />
          </label>
        </div>
        <div className="modal-actions">
          <button className="ghost" onClick={onClose}>
            Отменить
          </button>
          <button className="primary" onClick={handleSave}>
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
};

const HabitRow = ({
  habit,
  weekDates,
  logs,
  onToggle,
  onSkip,
  onEdit,
  onDelete,
  onDragStart,
  onDragEnter,
  onDragEnd,
}) => {
  const getStatus = (date) => logs.find((log) => log.habitId === habit.id && log.date === date)?.status || "none";

  return (
    <div
      className="habit-row"
      draggable
      onDragStart={(e) => onDragStart(e, habit.id)}
      onDragEnter={() => onDragEnter(habit.id)}
      onDragEnd={onDragEnd}
    >
      <div className="habit-meta">
        <span className="drag-handle" aria-hidden>
          ⋮⋮
        </span>
        <div className="habit-name">
          <div className="title-line">
            <span className="name-text">{habit.name}</span>
            <span
              className="category-pill"
              style={{ color: habitCategories[habit.category]?.color, borderColor: `${habitCategories[habit.category]?.color}40` }}
            >
              {habitCategories[habit.category]?.label || "Категория"}
            </span>
          </div>
          <div className="meta subtle">Цель: {habit.targetPerWeek} раз в неделю</div>
        </div>
      </div>
      <div className="priority-chip" data-tone={priorityLabels[habit.priority]?.tone}>
        {priorityLabels[habit.priority]?.label}
      </div>
      <div className="habit-target">{habit.targetPerWeek} / 7</div>
      <div className="habit-week">
        {weekDates.map((date, idx) => {
          const status = getStatus(date);
          return (
            <button
              key={date}
              className={`day-circle status-${status}`}
              onClick={() => onToggle(habit.id, date)}
              onContextMenu={(e) => {
                e.preventDefault();
                onSkip(habit.id, date, status === "skipped" ? "none" : "skipped");
              }}
              aria-label={`${habit.name} · ${weekDayNames[idx]} · ${status === "done" ? "выполнено" : status === "skipped" ? "пропущено" : "не отмечено"}`}
            >
              {status === "done" ? "✓" : status === "skipped" ? "–" : ""}
            </button>
          );
        })}
      </div>
      <div className="habit-actions">
        <button className="ghost icon" onClick={() => onEdit(habit)}>
          ✎
        </button>
        <button className="ghost icon" onClick={() => onDelete(habit.id)}>
          ×
        </button>
      </div>
    </div>
  );
};

const HabitTable = ({ habits, weekDates, logs, onToggle, onSkip, onEdit, onDelete, onReorder }) => {
  const [dragging, setDragging] = useState(null);

  const handleDragStart = (e, id) => {
    setDragging(id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnter = (id) => {
    if (!dragging || dragging === id) return;
    onReorder(dragging, id);
  };

  return (
    <div className="habit-table card">
      <div className="habit-table-head">
        <div className="col habit-col">Привычка</div>
        <div className="col priority-col">Приоритет</div>
        <div className="col target-col">Цель</div>
        <div className="col days-col">Неделя</div>
        <div className="col actions-col" aria-hidden>
          ·
        </div>
      </div>
      <div className="habit-table-body">
        {habits.length === 0 && <div className="empty-state">Добавь первую привычку, чтобы видеть прогресс.</div>}
        {habits.map((habit) => (
          <HabitRow
            key={habit.id}
            habit={habit}
            weekDates={weekDates}
            logs={logs}
            onToggle={onToggle}
            onSkip={onSkip}
            onEdit={onEdit}
            onDelete={onDelete}
            onDragStart={handleDragStart}
            onDragEnter={handleDragEnter}
            onDragEnd={() => setDragging(null)}
          />
        ))}
      </div>
    </div>
  );
};

const HabitMobileList = ({ habits, weekDates, logs, onToggle, onSkip, onEdit, onDelete }) => (
  <div className="habit-mobile-list">
    {habits.map((habit) => {
      const getStatus = (date) => logs.find((log) => log.habitId === habit.id && log.date === date)?.status || "none";
      return (
        <div key={habit.id} className="habit-mobile-card card">
          <div className="mobile-top">
            <div>
              <div className="title-line">
                <span className="name-text">{habit.name}</span>
                <span
                  className="category-pill"
                  style={{ color: habitCategories[habit.category]?.color, borderColor: `${habitCategories[habit.category]?.color}40` }}
                >
                  {habitCategories[habit.category]?.label}
                </span>
              </div>
              <div className="meta subtle">Цель: {habit.targetPerWeek} / 7</div>
            </div>
            <div className={`priority-chip compact`} data-tone={priorityLabels[habit.priority]?.tone}>
              {priorityLabels[habit.priority]?.label}
            </div>
          </div>
          <div className="mobile-week">
            {weekDates.map((date, idx) => {
              const status = getStatus(date);
              return (
                <button
                  key={date}
                  className={`day-circle status-${status}`}
                  onClick={() => onToggle(habit.id, date)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    onSkip(habit.id, date, status === "skipped" ? "none" : "skipped");
                  }}
                  aria-label={`${habit.name} · ${weekDayNames[idx]} · ${status}`}
                >
                  {status === "done" ? "✓" : status === "skipped" ? "–" : ""}
                </button>
              );
            })}
          </div>
          <div className="mobile-actions">
            <button className="ghost" onClick={() => onEdit(habit)}>
              Редактировать
            </button>
            <button className="ghost" onClick={() => onDelete(habit.id)}>
              Удалить
            </button>
          </div>
        </div>
      );
    })}
  </div>
);

const HabitTrackerContent = () => {
  const {
    habits,
    logs,
    weekDates,
    weekStart,
    weekOffset,
    weeklyProgress,
    bestStreak,
    goToNextWeek,
    goToPrevWeek,
    goToCurrentWeek,
    addHabit,
    updateHabit,
    deleteHabit,
    reorderHabits,
    toggleHabitLog,
    setHabitStatus,
  } = useHabits();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const summary = useMemo(() => {
    const activeCount = habits.filter((h) => h.active).length;
    const doneThisWeek = logs.filter((log) => weekDates.includes(log.date) && log.status === "done").length;
    return { activeCount, doneThisWeek };
  }, [habits, logs, weekDates]);

  const handleSubmit = (payload) => {
    if (editing) {
      updateHabit(editing.id, payload);
    } else {
      addHabit(payload);
    }
    setModalOpen(false);
    setEditing(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Удалить эту привычку?")) {
      deleteHabit(id);
    }
  };

  return (
    <div className="page habit-page">
      <div className="page-header habit-header">
        <div>
          <p className="section-kicker">Новая вкладка</p>
          <h1>Трекер привычек</h1>
          <p className="meta large">Отслеживай привычки, которые двигают тебя вперёд.</p>
        </div>
        <div className="habit-toolbar">
          <WeekSelector
            label={formatWeekLabel(weekStart, weekOffset)}
            onPrev={goToPrevWeek}
            onNext={goToNextWeek}
            onReset={goToCurrentWeek}
          />
          <button className="primary" onClick={() => setModalOpen(true)}>
            Добавить привычку
          </button>
        </div>
      </div>

      <div className="card habit-summary">
        <SummaryCard label="Активных привычек" value={summary.activeCount} hint="Всего в списке" />
        <SummaryCard
          label="Выполнено за неделю"
          value={`${summary.doneThisWeek} / ${weeklyProgress.total}`}
          hint="Отметок done"
        />
        <SummaryCard label="Лучший стрик" value={`${bestStreak} дней`} hint="Сохрани темп" />
      </div>

      <div className="habit-table-wrapper desktop">
        <HabitTable
          habits={habits}
          weekDates={weekDates}
          logs={logs}
          onToggle={toggleHabitLog}
          onSkip={setHabitStatus}
          onEdit={(habit) => {
            setEditing(habit);
            setModalOpen(true);
          }}
          onDelete={handleDelete}
          onReorder={reorderHabits}
        />
      </div>

      <div className="habit-mobile-wrapper mobile-only">
        <HabitMobileList
          habits={habits}
          weekDates={weekDates}
          logs={logs}
          onToggle={toggleHabitLog}
          onSkip={setHabitStatus}
          onEdit={(habit) => {
            setEditing(habit);
            setModalOpen(true);
          }}
          onDelete={handleDelete}
        />
      </div>

      <HabitFormModal
        open={modalOpen}
        initial={editing}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

const HabitTrackerPage = () => <HabitTrackerContent />;

export default HabitTrackerPage;
