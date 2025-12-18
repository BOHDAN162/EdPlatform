import React from "react";
import { Link } from "../../routerShim";

const Ring = ({ value, label, color }) => (
  <div className="relative flex flex-col items-center gap-2 rounded-xl border border-white/5 bg-white/5 p-4">
    <div className="relative h-20 w-20">
      <svg className="h-20 w-20 -rotate-90" viewBox="0 0 36 36">
        <path
          className="text-white/10"
          strokeWidth="3"
          stroke="currentColor"
          fill="none"
          d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
        />
        <path
          className="transition-all duration-500"
          strokeWidth="3"
          strokeLinecap="round"
          stroke={color}
          fill="none"
          strokeDasharray={`${value}, 100`}
          d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-lg font-semibold text-white">{value}%</div>
    </div>
    <div className="text-sm text-white/70">{label}</div>
  </div>
);

const Stat = ({ label, value, accent }) => (
  <div className="flex flex-col rounded-xl border border-white/5 bg-white/5 p-4">
    <span className="text-xs uppercase tracking-[0.08em] text-white/50">{label}</span>
    <span className="text-2xl font-semibold text-white">{value}</span>
    {accent && <span className="text-xs text-white/60">{accent}</span>}
  </div>
);

const ProgressPanel = ({ xp, levelLabel, streakLabel, rings }) => (
  <div className="grid grid-cols-1 gap-4 rounded-3xl border border-white/10 bg-[#0f172a] p-5 shadow-lg lg:grid-cols-3">
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.08em] text-white/60">Главный прогресс</p>
          <h3 className="text-xl font-semibold text-white">{levelLabel}</h3>
          <p className="text-sm text-white/60">{streakLabel}</p>
        </div>
        <Link
          to="/profile"
          className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/70 transition hover:border-[#8A3FFC]/70 hover:text-white"
        >
          В настройки
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Stat label="XP" value={xp} accent="твоя общая энергия" />
        <Stat label="Серия" value={streakLabel} accent="не теряй темп" />
      </div>
    </div>
    <div className="lg:col-span-2">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {rings.map((ring) => (
          <Link key={ring.label} to={ring.to || "#"} className="group">
            <Ring label={ring.label} value={ring.value} color={ring.color} />
            <p className="mt-2 text-center text-sm text-white/60 group-hover:text-white">{ring.hint}</p>
          </Link>
        ))}
      </div>
    </div>
  </div>
);

export default ProgressPanel;
