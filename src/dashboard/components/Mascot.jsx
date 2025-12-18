import React, { useEffect, useMemo, useState } from "react";

const moodConfig = {
  happy: {
    label: "На волне",
    tone: "bg-gradient-to-br from-[#8A3FFC] via-[#c084fc] to-[#6b21a8]",
  },
  calm: {
    label: "Спокоен",
    tone: "bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#1f2937]",
  },
  focused: {
    label: "В фокусе",
    tone: "bg-gradient-to-br from-[#0f172a] via-[#312e81] to-[#8A3FFC]",
  },
  tired: {
    label: "Нужен отдых",
    tone: "bg-gradient-to-br from-[#111827] via-[#4b5563] to-[#0f172a]",
  },
};

const formatDays = (value) => {
  if (value === 1) return "1 день";
  if (value >= 2 && value <= 4) return `${value} дня`;
  return `${value} дней`;
};

const MascotFace = ({ tone, pupilX, pupilY, blink }) => (
  <div className={`relative h-40 w-40 overflow-hidden rounded-[26px] border border-white/10 ${tone.tone} shadow-[0_20px_60px_rgba(0,0,0,0.35)]`}>
    <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/10" />
    <div className="absolute -left-6 -top-8 h-20 w-24 rounded-full bg-white/10 blur-3xl" />
    <div className="absolute -bottom-6 -right-4 h-20 w-24 rounded-full bg-[#8A3FFC]/30 blur-3xl" />
    <div className="relative flex h-full flex-col items-center justify-center gap-4 p-5">
      <div className="relative flex h-16 w-24 items-center justify-between rounded-full bg-black/30 px-4 py-3 shadow-inner shadow-black/40">
        {Array.from({ length: 2 }).map((_, idx) => (
          <div
            key={idx}
            className="relative flex h-12 w-12 items-center justify-center rounded-full bg-white/90"
          >
            <div
              className={`relative h-5 w-5 rounded-full bg-[#0f172a] transition-transform duration-500 ${
                blink ? "scale-y-110" : ""
              }`}
              style={{ transform: `translate(${pupilX}px, ${pupilY}px)` }}
            >
              <div className="absolute inset-[6px] rounded-full bg-[#8A3FFC]" />
            </div>
            <div className="absolute -bottom-1 h-1.5 w-6 rounded-full bg-[#8A3FFC]/40 blur-sm" />
          </div>
        ))}
      </div>
      <div className="flex w-full items-center justify-between text-[10px] font-semibold uppercase tracking-[0.12em] text-white/70">
        <span>Flux</span>
        <span>on</span>
      </div>
    </div>
  </div>
);

const Mascot = ({ mood = "happy", streak = 0, level = 1, showMeta = true }) => {
  const [blink, setBlink] = useState(false);
  const [pupilX, setPupilX] = useState(0);
  const [pupilY, setPupilY] = useState(0);

  const tone = moodConfig[mood] || moodConfig.happy;
  const streakLabel = useMemo(() => formatDays(streak), [streak]);

  useEffect(() => {
    const blinkTimer = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 140);
    }, 3200 + Math.random() * 1200);
    return () => clearInterval(blinkTimer);
  }, []);

  useEffect(() => {
    const moveTimer = setInterval(() => {
      setPupilX((Math.random() - 0.5) * 10);
      setPupilY((Math.random() - 0.5) * 8);
    }, 1400);
    return () => clearInterval(moveTimer);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-lg shadow-black/10">
      <div className="absolute inset-0 bg-gradient-to-br from-[#8A3FFC]/12 via-transparent to-[#8A3FFC]/10" />
      <div className={`relative flex gap-4 ${showMeta ? "items-center" : "justify-center"}`}>
        <MascotFace tone={tone} pupilX={pupilX} pupilY={pupilY} blink={blink} />
        {showMeta && (
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.12em] text-[var(--muted)]">Маскот</p>
            <h3 className="text-lg font-semibold text-[var(--fg)]">Flux рядом</h3>
            <p className="text-sm text-[var(--muted)]">Серия {streakLabel} · уровень {level}</p>
            <p className="text-xs text-[var(--muted)]">Настроение: {tone.label}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Mascot;
