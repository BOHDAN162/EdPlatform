import React, { useEffect, useMemo, useState } from "react";
import { Link } from "../../routerShim";

const moodConfig = {
  happy: {
    label: "На волне",
    tone: "bg-gradient-to-br from-[#8A3FFC] via-[#c084fc] to-[#6b21a8]",
    eye: "scale-110",
    glow: "shadow-[0_0_32px_rgba(138,63,252,0.45)]",
    message: "Сохраняем ритм, ты двигаешься мощно!",
  },
  calm: {
    label: "Спокоен",
    tone: "bg-gradient-to-br from-[#111827] via-[#1f2937] to-[#0f172a]",
    eye: "scale-100",
    glow: "shadow-[0_0_28px_rgba(59,130,246,0.35)]",
    message: "Баланс между фокусом и отдыхом — сила",
  },
  focused: {
    label: "В фокусе",
    tone: "bg-gradient-to-br from-[#0f172a] via-[#312e81] to-[#8A3FFC]",
    eye: "scale-105",
    glow: "shadow-[0_0_42px_rgba(99,102,241,0.45)]",
    message: "Концентрация на ключевых шагах",
  },
  tired: {
    label: "Нужен чилл",
    tone: "bg-gradient-to-br from-[#0f172a] via-[#4b5563] to-[#111827]",
    eye: "scale-95",
    glow: "shadow-[0_0_28px_rgba(156,163,175,0.38)]",
    message: "Сделай вдох — 5 минут дыхания",
  },
};

const Mascot = ({ mood = "happy", streak = 0, level = 1, onMoodChange }) => {
  const [blink, setBlink] = useState(false);
  const [pupilX, setPupilX] = useState(0);
  const [pupilY, setPupilY] = useState(0);
  const [hovered, setHovered] = useState(false);

  const tone = moodConfig[mood] || moodConfig.happy;

  useEffect(() => {
    const blinkTimer = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 180);
    }, 3400 + Math.random() * 1200);
    return () => clearInterval(blinkTimer);
  }, []);

  useEffect(() => {
    const moveTimer = setInterval(() => {
      setPupilX((Math.random() - 0.5) * 12);
      setPupilY((Math.random() - 0.5) * 10);
    }, 1400);
    return () => clearInterval(moveTimer);
  }, []);

  const stateLabel = useMemo(() => {
    if (mood === "tired" && streak < 2) return "Поддержка";
    if (mood === "happy" && streak >= 5) return "Герой серии";
    if (mood === "focused") return "Максимум внимания";
    return "Мы рядом";
  }, [mood, streak]);

  const badge = useMemo(() => {
    if (streak >= 10) return "🔥 Серия 10+";
    if (streak >= 5) return "⚡ 5 дней подряд";
    return "✨ Давай продолжим";
  }, [streak]);

  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c12]/80 p-5 backdrop-blur xl:p-6"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#111827]/50 via-transparent to-[#8A3FFC]/10" />
      <div className="relative flex flex-col gap-4 xl:flex-row xl:items-center">
        <div className="flex flex-1 flex-col gap-2">
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.08em] text-white/70">
              Маскот Flux
            </span>
            <span className="text-sm text-white/60">{stateLabel}</span>
          </div>
          <h3 className="text-lg font-semibold text-white md:text-xl">Твой напарник в росте</h3>
          <p className="text-sm text-white/70">
            {tone.message} · уровень поддержки {level}. Я отслеживаю твоё настроение и помогаю держать ритм.
          </p>
          <div className="flex flex-wrap gap-2 text-xs text-white/70">
            <span className="rounded-full bg-white/5 px-3 py-1">{badge}</span>
            <span className="rounded-full bg-white/5 px-3 py-1">Режим: {moodConfig[mood]?.label}</span>
            <span className="rounded-full bg-white/5 px-3 py-1">XP буст за настроение</span>
          </div>
          <div className="mt-2 flex flex-wrap gap-3">
            {Object.keys(moodConfig).map((key) => (
              <button
                key={key}
                onClick={() => onMoodChange?.(key)}
                className={`group inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs transition duration-200 ${
                  key === mood
                    ? "border-[#8A3FFC]/80 bg-[#8A3FFC]/15 text-white"
                    : "border-white/10 bg-white/5 text-white/70 hover:border-[#8A3FFC]/60 hover:text-white"
                }`}
              >
                <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-br from-[#8A3FFC] to-[#6366f1]" />
                {moodConfig[key].label}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-2 pt-2 text-sm text-white/70 md:flex-row md:items-center md:gap-4">
            <Link
              to="/missions"
              className="inline-flex items-center gap-2 rounded-full bg-[#8A3FFC]/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#8A3FFC]/30"
            >
              В миссии
              <span className="text-xs text-white/60">→</span>
            </Link>
            <Link
              to="/memory"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-white/80 transition hover:border-[#8A3FFC]/70 hover:text-white"
            >
              Записать мысль
            </Link>
          </div>
        </div>
        <div className="flex w-full justify-center xl:w-auto">
          <div
            className={`relative h-48 w-48 rounded-3xl border border-white/10 ${tone.tone} ${tone.glow} overflow-hidden transition duration-300`}
            style={{ transform: hovered ? "scale(1.03) rotate(-1.5deg)" : "scale(1)" }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/10" />
            <div className="absolute -left-6 -top-8 h-24 w-24 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-6 -right-4 h-20 w-24 rounded-full bg-[#8A3FFC]/30 blur-3xl" />
            <div className="relative flex h-full flex-col items-center justify-center gap-4 p-4">
              <div className="relative flex h-20 w-28 items-center justify-around rounded-full bg-black/40 px-4 py-3 shadow-inner shadow-black/40">
                {Array.from({ length: 2 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="relative flex h-12 w-12 items-center justify-center rounded-full bg-white/90"
                  >
                    <div
                      className={`relative h-5 w-5 rounded-full bg-[#0f172a] transition-transform duration-500 ${
                        blink ? "scale-y-10" : ""
                      }`}
                      style={{ transform: `translate(${pupilX}px, ${pupilY}px)` }}
                    >
                      <div className="absolute inset-[6px] rounded-full bg-[#8A3FFC]" />
                    </div>
                    <div className="absolute -bottom-1 h-1.5 w-6 rounded-full bg-[#8A3FFC]/40 blur-sm" />
                  </div>
                ))}
              </div>
              <div className="flex w-full items-center justify-between text-[11px] font-semibold uppercase tracking-[0.12em] text-white/70">
                <span>lvl {level}</span>
                <span>{mood === "tired" ? "Rest" : "Drive"}</span>
              </div>
              <div className="flex w-full items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-xs text-white/80">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#8A3FFC]/20 text-sm text-[#c4b5fd]">
                  ⚡
                </span>
                <div className="flex-1">
                  <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.08em] text-white/60">
                    <span>Ритм</span>
                    <span>{streak} дн</span>
                  </div>
                  <div className="relative mt-1 h-1.5 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#8A3FFC] to-[#22d3ee]"
                      style={{ width: `${Math.min(100, streak * 10)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mascot;
