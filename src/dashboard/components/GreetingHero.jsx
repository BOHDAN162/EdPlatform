import React, { useMemo } from "react";
import { Link } from "../../routerShim";
import Mascot from "./Mascot";

const ProgressRing = ({ label, value, hint, color, to }) => {
  const percentage = Math.min(100, Math.max(0, value || 0));

  return (
    <Link
      to={to || "#"}
      className="group flex flex-col items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] px-4 py-5 text-center shadow-sm transition hover:-translate-y-0.5 hover:border-[#8A3FFC]/60 hover:shadow-lg"
    >
      <div className="relative h-24 w-24 sm:h-28 sm:w-28">
        <svg className="h-full w-full -rotate-90 text-[var(--border)]" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="52" stroke="currentColor" strokeWidth="10" fill="none" />
          <circle
            cx="60"
            cy="60"
            r="52"
            stroke={color}
            strokeWidth="10"
            fill="none"
            strokeDasharray={`${(percentage / 100) * 326} 326`}
            strokeLinecap="round"
            className="transition-all duration-500"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-semibold text-[var(--fg)]">{percentage}%</span>
        </div>
      </div>
      <div className="text-sm font-semibold text-[var(--fg)]">{label}</div>
      {hint && <div className="text-xs text-[var(--muted)]">{hint}</div>}
    </Link>
  );
};

const formatDays = (value) => {
  if (value === 1) return "1 день";
  if (value >= 2 && value <= 4) return `${value} дня`;
  return `${value} дней`;
};

const GreetingHero = ({ user, streak = 0, level = 1, xp = 0, role = "Исследователь", rings = [], quote, insight, mood }) => {
  const topLine = useMemo(() => `Статус: ${role} · Серия: ${formatDays(streak)} · ${xp} XP`, [role, streak, xp]);
  const quoteText = quote?.text || "Движение важнее идеальной траектории. Сделай шаг — поймешь дорогу.";
  const quoteAuthor = quote?.author || "NOESIS";

  return (
    <section className="relative isolate flex min-h-screen min-h-[100svh] flex-col overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-2xl shadow-black/10 lg:p-10">
      <div className="absolute inset-0 opacity-60">
        <div className="absolute left-6 top-10 h-32 w-32 rounded-full bg-[#8A3FFC]/20 blur-3xl" />
        <div className="absolute right-4 top-0 h-24 w-24 rounded-full bg-[#22d3ee]/25 blur-3xl" />
        <div className="absolute bottom-6 left-1/3 h-24 w-36 rounded-full bg-black/5 blur-3xl" />
      </div>
      <div className="relative flex flex-1 items-center">
        <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-[1.2fr_0.95fr] lg:items-center">
          <div className="flex flex-col gap-6">
            <div className="space-y-2">
              <p className="text-sm text-[var(--muted)]">{topLine}</p>
              <h1 className="text-3xl font-bold text-[var(--fg)] sm:text-4xl lg:text-5xl">
                Привет, {user?.name || "Исследователь"} 🚀
              </h1>
            </div>
            <div className="min-h-[120px] rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-inner sm:p-5">
              <p
                className="text-base font-semibold text-[var(--fg)] sm:text-lg"
                style={{ display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}
              >
                {quoteText}
              </p>
              <p className="mt-2 text-sm text-[var(--muted)]">{quoteAuthor}</p>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {rings.map((ring) => (
                <ProgressRing key={ring.label} {...ring} />
              ))}
            </div>
          </div>
          <div className="flex flex-col items-center gap-4 lg:items-stretch">
            <Mascot mood={mood} streak={streak} level={level} showMeta={false} />
            <div className="w-full rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-lg sm:p-5">
              <p className="text-[10px] uppercase tracking-[0.12em] text-[var(--muted)]">Совет от платформы</p>
              <p className="mt-2 text-base font-semibold text-[var(--fg)]">
                {insight?.title || "Продолжи главный шаг на сегодня"}
              </p>
              <p className="mt-1 text-sm text-[var(--muted)]">
                {insight?.context || "Открой задания и закрой одну задачу, чтобы удержать серию."}
              </p>
              <Link
                to={insight?.to || "/missions"}
                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#8A3FFC] px-4 py-2 text-sm font-semibold text-white shadow-[0_12px_32px_rgba(138,63,252,0.28)] transition hover:-translate-y-0.5"
              >
                {insight?.cta || "Продолжить задание"}
                <span className="text-xs">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GreetingHero;
