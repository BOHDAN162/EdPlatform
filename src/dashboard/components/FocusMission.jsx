import React from "react";
import { Link } from "../../routerShim";

const FocusMission = ({ mission, onStart }) => {
  if (!mission) return null;

  const statusLabel = mission.progress?.status === "completed" ? "Завершено" : "В процессе";
  const progressValue = mission.progress?.currentValue || 0;
  const target = mission.progress?.target || mission.target || 100;
  const percent = Math.min(100, Math.round((progressValue / target) * 100));

  return (
    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#1a0b2b] via-[#0f172a] to-[#111827] p-5 shadow-lg">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.08em] text-white/60">Миссия дня</p>
          <h3 className="text-xl font-semibold text-white">{mission.title}</h3>
          <p className="text-sm text-white/70">{mission.description}</p>
          <div className="mt-2 flex items-center gap-2 text-xs text-white/60">
            <span className="rounded-full bg-white/10 px-3 py-1">{statusLabel}</span>
            <span className="rounded-full bg-white/5 px-3 py-1">Награда: {mission.reward || "+120 XP"}</span>
          </div>
        </div>
        <div className="flex flex-col items-start gap-3 sm:items-end">
          <div className="w-full min-w-[220px]">
            <div className="flex items-center justify-between text-xs text-white/60">
              <span>Прогресс</span>
              <span>{percent}%</span>
            </div>
            <div className="relative mt-1 h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#8A3FFC] to-[#22d3ee]"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onStart}
              className="rounded-full bg-[#8A3FFC] px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-[#8A3FFC]/30 transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              Продолжить трек
            </button>
            <Link
              to="/missions"
              className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/80 transition hover:border-[#8A3FFC]/70 hover:text-white"
            >
              Все миссии
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FocusMission;
