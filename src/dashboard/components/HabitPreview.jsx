import React, { useMemo } from "react";
import { Link } from "../../routerShim";
import { useHabits, weekDayNames } from "../../habits/habitsStore";

const HabitPreview = () => {
  const { habits, weekDates, logs, toggleHabitLog } = useHabits();
  const topHabits = useMemo(() => habits.slice(0, 3), [habits]);

  const getStatus = (habitId, date) => logs.find((log) => log.habitId === habitId && log.date === date)?.status === "done";

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.08em] text-white/60">Привычки</p>
          <h3 className="text-xl font-semibold text-white">3 главных привычки</h3>
        </div>
        <Link
          to="/habits"
          className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/70 transition hover:border-[#8A3FFC]/70 hover:text-white"
        >
          Управлять
        </Link>
      </div>
      <div className="mt-4 space-y-3">
        {topHabits.map((habit) => (
          <div key={habit.id} className="rounded-2xl border border-white/5 bg-[#0f172a] p-3">
            <div className="flex items-center justify-between text-sm text-white">
              <span>{habit.name}</span>
              <span className="text-xs text-white/60">{habit.targetPerWeek}×/нед</span>
            </div>
            <div className="mt-3 grid grid-cols-7 gap-2 text-center text-xs text-white/60">
              {weekDates.map((date, idx) => (
                <button
                  key={date}
                  onClick={() => toggleHabitLog(habit.id, date)}
                  className={`flex flex-col items-center rounded-xl border px-2 py-2 transition ${
                    getStatus(habit.id, date)
                      ? "border-[#8A3FFC]/70 bg-[#8A3FFC]/15 text-white"
                      : "border-white/5 bg-white/5 hover:border-[#8A3FFC]/40"
                  }`}
                >
                  <span className="text-[10px] text-white/50">{weekDayNames[idx]}</span>
                  <span>{new Date(date).getDate()}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HabitPreview;
