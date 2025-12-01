import React, { useMemo, useState } from "react";
import { computeIntensity } from "../../hooks/useActivityLog";

const daysOfWeek = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
const todayKey = () => new Date().toISOString().slice(0, 10);

const formatDateLabel = (isoDate) => {
  if (!isoDate) return "Нет данных";
  const date = new Date(isoDate);
  return date.toLocaleDateString("ru-RU", { day: "numeric", month: "long" });
};

const sumActions = (day = {}) =>
  (day.completedMaterialsCount || 0) +
  (day.missionsCompletedCount || 0) +
  (day.memoryEntriesCount || 0) +
  (day.communityActionsCount || 0) +
  (day.sessionsCount || 0);

const intensityLabel = (level) => {
  if (level >= 3) return "Мощная активность";
  if (level === 2) return "Средняя активность";
  if (level === 1) return "Лёгкая активность";
  return "Нет активности";
};

const DayCell = ({ dayNumber, dateKey, data, inStreak, isToday, compact, onSelect }) => {
  const intensity = computeIntensity(data);
  const hasActivity = intensity > 0;
  return (
    <button
      type="button"
      className={`activity-day ${hasActivity ? `intensity-${intensity}` : "idle"} ${inStreak ? "streak" : ""} ${
        isToday ? "today" : ""
      } ${compact ? "compact" : ""}`}
      onClick={() => onSelect(dateKey)}
      aria-label={`День ${dayNumber}. ${intensityLabel(intensity)}`}
    >
      <span>{dayNumber > 0 ? dayNumber : ""}</span>
    </button>
  );
};

const ActivityCalendar = ({
  activityByDate = {},
  streakInfo,
  compact = false,
  className = "",
  monthOffset = 0,
}) => {
  const [selectedDate, setSelectedDate] = useState(todayKey());
  const [cursor, setCursor] = useState(() => {
    const now = new Date();
    now.setMonth(now.getMonth() + monthOffset);
    return now;
  });

  const monthStart = useMemo(() => new Date(cursor.getFullYear(), cursor.getMonth(), 1), [cursor]);
  const daysInMonth = useMemo(() => new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate(), [cursor]);

  const monthActivity = useMemo(() => {
    const entries = {};
    Object.entries(activityByDate).forEach(([key, value]) => {
      const date = new Date(key);
      if (date.getFullYear() === cursor.getFullYear() && date.getMonth() === cursor.getMonth()) {
        entries[key] = value;
      }
    });
    return entries;
  }, [activityByDate, cursor]);

  const startOffset = useMemo(() => {
    const day = monthStart.getDay();
    return day === 0 ? 6 : day - 1;
  }, [monthStart]);

  const cells = useMemo(() => {
    const placeholders = Array.from({ length: startOffset }, () => 0);
    const days = Array.from({ length: daysInMonth }, (_, idx) => idx + 1);
    return [...placeholders, ...days];
  }, [daysInMonth, startOffset]);

  const streakDates = useMemo(() => new Set(streakInfo?.streakDates || []), [streakInfo]);
  const monthLabel = useMemo(
    () => monthStart.toLocaleDateString("ru-RU", { month: "long", year: "numeric" }),
    [monthStart]
  );

  const detailDate = selectedDate && monthActivity[selectedDate] ? selectedDate : Object.keys(monthActivity)[0];
  const detail = monthActivity[detailDate];

  const handlePrev = () => {
    setCursor((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNext = () => {
    setCursor((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  return (
    <div className={`activity-calendar-card ${compact ? "compact" : ""} ${className}`}>
      <div className="calendar-head">
        <div>
          <div className="meta subtle">Календарь активности</div>
          <h3>{monthLabel}</h3>
          {!compact && (
            <div className="streak-row">
              <span className="chip streak">🔥 Текущая серия: {streakInfo?.current || 0} дней</span>
              <span className="chip ghost">Лучший результат: {streakInfo?.best || 0} дней</span>
            </div>
          )}
        </div>
        <div className="calendar-nav">
          <button className="ghost" onClick={handlePrev} aria-label="Предыдущий месяц">
            ←
          </button>
          <button className="ghost" onClick={handleNext} aria-label="Следующий месяц">
            →
          </button>
        </div>
      </div>

      <div className="calendar-grid-wrapper">
        <div className="week-row">
          {daysOfWeek.map((day) => (
            <div key={day} className="week-label">
              {day}
            </div>
          ))}
        </div>
        <div className="calendar-grid">
          {cells.map((day, idx) => {
            if (day === 0) {
              return <div key={`empty-${idx}`} className="activity-day placeholder" />;
            }
            const dateKey = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const data = monthActivity[dateKey];
            const isToday = dateKey === todayKey();
            const inStreak = streakDates.has(dateKey);
            return (
              <DayCell
                key={dateKey}
                dayNumber={day}
                dateKey={dateKey}
                data={data}
                isToday={isToday}
                inStreak={inStreak}
                compact={compact}
                onSelect={(date) => setSelectedDate(date)}
              />
            );
          })}
        </div>
      </div>

      <div className="calendar-legend">
        {[0, 1, 2, 3].map((level) => (
          <div key={level} className="legend-item">
            <span className={`legend-dot intensity-${level}`} />
            <span className="meta">{intensityLabel(level)}</span>
          </div>
        ))}
      </div>

      <div className="calendar-tooltip">
        <div>
          <div className="meta subtle">{detail ? "Детали дня" : "Нет активности"}</div>
          <div className="tooltip-title">{formatDateLabel(detailDate)}</div>
        </div>
        {detail ? (
          <div className="tooltip-grid">
            <div>
              <div className="tooltip-label">Действия</div>
              <div className="tooltip-value">{sumActions(detail)}</div>
            </div>
            <div>
              <div className="tooltip-label">Материалы</div>
              <div className="tooltip-value">{detail.completedMaterialsCount || 0}</div>
            </div>
            <div>
              <div className="tooltip-label">Миссии</div>
              <div className="tooltip-value">{detail.missionsCompletedCount || 0}</div>
            </div>
            <div>
              <div className="tooltip-label">Память</div>
              <div className="tooltip-value">{detail.memoryEntriesCount || 0}</div>
            </div>
            <div>
              <div className="tooltip-label">Сообщество</div>
              <div className="tooltip-value">{detail.communityActionsCount || 0}</div>
            </div>
            <div>
              <div className="tooltip-label">XP</div>
              <div className="tooltip-value">{Math.round(detail.totalXP || 0)}</div>
            </div>
          </div>
        ) : (
          <div className="meta">Выбери активный день, чтобы увидеть детали.</div>
        )}
      </div>
    </div>
  );
};

export default ActivityCalendar;
