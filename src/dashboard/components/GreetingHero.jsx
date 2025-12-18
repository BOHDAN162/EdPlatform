import React, { useMemo } from "react";
import { Link } from "../../routerShim";
import Mascot from "./Mascot";

const ProgressRing = ({ label, value, hint, color, to }) => (
  <Link
    to={to || "#"}
    className="group flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-center transition hover:border-[#8A3FFC]/70 hover:bg-[#8A3FFC]/10"
  >
    <div className="relative h-24 w-24">
      <svg className="h-24 w-24 -rotate-90 text-white/10" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="52" stroke="currentColor" strokeWidth="10" fill="none" />
        <circle
          cx="60"
          cy="60"
          r="52"
          stroke={color}
          strokeWidth="10"
          fill="none"
          strokeDasharray={`${(value / 100) * 326} 326`}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-semibold text-white">{value}%</span>
      </div>
    </div>
    <div className="text-sm font-semibold text-white">{label}</div>
    {hint && <div className="text-xs text-white/60">{hint}</div>}
  </Link>
);

const formatDays = (value) => {
  if (value === 1) return "1 день";
  if (value >= 2 && value <= 4) return `${value} дня`;
  return `${value} дней`;
};

const GreetingHero = ({ user, streak = 0, level = 1, xp = 0, role = "Исследователь", rings = [], quote, insight, mood }) => {
  const topLine = useMemo(() => `Роль: ${role} · Серия: ${formatDays(streak)} · ${xp} XP`, [role, streak, xp]);
  const quoteText = quote?.text || "Движение важнее идеальной траектории. Сделай шаг — поймешь дорогу.";
  const quoteAuthor = quote?.author || "NOESIS";

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#1a0b2b] p-6 shadow-2xl shadow-[#8A3FFC]/10 lg:p-8">
      <div className="absolute inset-0 opacity-50">
        <div className="absolute left-10 top-10 h-32 w-32 rounded-full bg-[#8A3FFC]/25 blur-3xl" />
        <div className="absolute right-10 top-0 h-24 w-24 rounded-full bg-[#22d3ee]/25 blur-3xl" />
      </div>
      <div className="relative grid grid-cols-1 gap-6 lg:grid-cols-[1.25fr_0.9fr] lg:items-start">
        <div className="flex flex-col gap-5">
          <div className="space-y-2">
            <p className="text-sm text-white/70">{topLine}</p>
            <h1 className="text-3xl font-bold text-white sm:text-4xl">Привет, {user?.name || "Исследователь"} 🚀</h1>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-inner">
            <p className="text-lg font-semibold text-white">{quoteText}</p>
            <p className="mt-2 text-sm text-white/60">{quoteAuthor}</p>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {rings.map((ring) => (
              <ProgressRing key={ring.label} {...ring} />
            ))}
          </div>
        </div>
        <div className="flex flex-col items-center gap-4 lg:items-stretch">
          <Mascot mood={mood} streak={streak} level={level} />
          <div className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 shadow-lg">
            <p className="text-xs uppercase tracking-[0.12em] text-white/60">Совет от платформы</p>
            <p className="mt-2 text-base font-semibold text-white">{insight?.title || "Продолжи главный шаг на сегодня"}</p>
            <p className="mt-1 text-sm text-white/60">{insight?.context || "Открой задания и закрой одну задачу, чтобы удержать серию."}</p>
            <Link
              to={insight?.to || "/missions"}
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#8A3FFC] px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-[#8A3FFC]/30 transition hover:-translate-y-0.5"
            >
              {insight?.cta || "Продолжить задание"}
              <span className="text-xs">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GreetingHero;
