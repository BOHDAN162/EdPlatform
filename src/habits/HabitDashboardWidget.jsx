import React, { useMemo } from "react";
import { useNavigate } from "../routerShim";
import { useHabits, weekDayNames } from "./habitsStore";

const HabitDashboardWidget = () => {
  const navigate = useNavigate();
  const { habits, logs, weekDates, toggleHabitLog, setHabitStatus } = useHabits();

  const recentDays = useMemo(() => weekDates.slice(3), [weekDates]);
  const topHabits = useMemo(() => habits.slice(0, 4), [habits]);

  return (
    <section className="card habit-widget">
      <div className="section-head">
        <div>
          <p className="meta">Трекер привычек</p>
          <h3>Следи за своими ежедневными действиями</h3>
        </div>
        <button className="primary outline" onClick={() => navigate("/habits")}>Управлять</button>
      </div>
      <div className="widget-table">
        <div className="widget-head">
          <div className="widget-col">Привычка</div>
          <div className="widget-days">
            {recentDays.map((date, idx) => (
              <span key={date} className="meta subtle">
                {weekDayNames[idx + (weekDayNames.length - recentDays.length)]}
              </span>
            ))}
          </div>
        </div>
        <div className="widget-body">
          {topHabits.map((habit) => (
            <div key={habit.id} className="widget-row">
              <div className="widget-col name">{habit.name}</div>
              <div className="widget-days">
                {recentDays.map((date) => {
                  const status = logs.find((log) => log.habitId === habit.id && log.date === date)?.status || "none";
                  return (
                    <button
                      key={date}
                      className={`mini-circle status-${status}`}
                      onClick={() => toggleHabitLog(habit.id, date)}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        setHabitStatus(habit.id, date, status === "skipped" ? "none" : "skipped");
                      }}
                      aria-label={`${habit.name} ${date}`}
                    >
                      {status === "done" ? "✓" : status === "skipped" ? "–" : ""}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
          {topHabits.length === 0 && <div className="empty-state">Добавь привычки, чтобы видеть прогресс.</div>}
        </div>
      </div>
    </section>
  );
};

export default HabitDashboardWidget;
