import React, { useMemo } from "react";
import { Link } from "../../routerShim";
import Mascot from "./Mascot";

const randomMicroCopy = [
  "Каждый шаг — инвестиция в твою версию завтра",
  "5 минут фокуса сейчас сэкономят час позже",
  "Доведи серию — мозг любит последовательность",
  "Рефлексия = ускорение роста",
  "Сегодня день для смелых решений",
];

const HeroStat = ({ label, value, hint, to }) => (
  <Link
    to={to}
    className="group relative flex flex-1 flex-col gap-1 overflow-hidden rounded-2xl border border-white/5 bg-white/5 p-4 transition duration-200 hover:border-[#8A3FFC]/70 hover:bg-[#8A3FFC]/10"
  >
    <div className="flex items-center justify-between text-xs uppercase tracking-[0.08em] text-white/60">
      <span>{label}</span>
      <span className="text-white/50">→</span>
    </div>
    <div className="text-2xl font-semibold text-white">{value}</div>
    <div className="text-sm text-white/60">{hint}</div>
  </Link>
);

const GreetingHero = ({ user, streak = 0, level = 1, xp = 0, role = "Исследователь", morningMode, onToggleMode, mood, onMoodChange }) => {
  const motivational = useMemo(() => {
    const seed = (user?.name?.length || 2) + streak + xp;
    return randomMicroCopy[seed % randomMicroCopy.length];
  }, [streak, xp, user?.name]);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#1a0b2b] p-6 shadow-2xl shadow-[#8A3FFC]/10 lg:p-8">
      <div className="absolute inset-0 opacity-60">
        <div className="absolute left-10 top-10 h-32 w-32 rounded-full bg-[#8A3FFC]/30 blur-3xl" />
        <div className="absolute right-10 top-0 h-24 w-24 rounded-full bg-[#22d3ee]/20 blur-3xl" />
      </div>
      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start">
        <div className="flex-1 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.12em] text-white/70">
              NOESIS · Dashboard
            </span>
            <button
              onClick={onToggleMode}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs uppercase tracking-[0.08em] text-white/70 transition hover:border-[#8A3FFC]/70 hover:text-white"
            >
              {morningMode ? "Утро" : "Вечер"} · сменить
            </button>
          </div>
          <div>
            <div className="flex items-center gap-3 text-sm text-white/70">
              <span className="rounded-full bg-[#8A3FFC]/20 px-3 py-1 text-xs font-semibold text-white">Серия {streak} дн.</span>
              <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/70">Роль: {role}</span>
              <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/70">XP: {xp}</span>
            </div>
            <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
              Привет, {user?.name || "Исследователь"}! 🚀
            </h1>
            <p className="mt-2 max-w-2xl text-base text-white/70 sm:text-lg">{motivational}</p>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <HeroStat label="Прогресс" value={`${xp} XP`} hint="Обновлено в реальном времени" to="/profile" />
            <HeroStat label="Миссии" value="Дневной трек" hint="Продолжи миссию дня" to="/missions" />
            <HeroStat label="Память" value="Новая запись" hint="Оставь короткую заметку" to="/memory" />
          </div>
        </div>
        <div className="w-full max-w-md">
          <Mascot mood={mood} streak={streak} level={level} onMoodChange={onMoodChange} />
        </div>
      </div>
    </div>
  );
};

export default GreetingHero;
