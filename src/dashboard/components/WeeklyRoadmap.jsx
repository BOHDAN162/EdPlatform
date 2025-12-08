import React from "react";

const dayLabels = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

const WeeklyRoadmap = ({ week }) => (
  <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-lg">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.08em] text-white/60">Шаги недели</p>
        <h3 className="text-xl font-semibold text-white">План · факт</h3>
      </div>
      <span className="rounded-full bg-[#8A3FFC]/20 px-3 py-1 text-xs text-white">7 дней</span>
    </div>
    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-7">
      {week.map((day, idx) => (
        <div
          key={day.date || idx}
          className="flex flex-col gap-2 rounded-2xl border border-white/5 bg-[#0f172a] p-3 text-white"
        >
          <div className="flex items-center justify-between text-xs text-white/70">
            <span>{dayLabels[day.weekday]}</span>
            <span className="text-white/50">{day.label}</span>
          </div>
          <div className="text-sm text-white/80">{day.focus}</div>
          <div className="relative h-1.5 overflow-hidden rounded-full bg-white/10">
            <div
              className={`absolute inset-y-0 left-0 rounded-full ${
                day.status === "done" ? "bg-gradient-to-r from-[#8A3FFC] to-[#22c55e]" : "bg-[#8A3FFC]"
              }`}
              style={{ width: `${day.progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-white/60">
            <span>План {day.planned}</span>
            <span>Сделано {day.completed}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default WeeklyRoadmap;
