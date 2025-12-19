import React, { useState } from "react";
import { Link } from "../../routerShim";
import Mascot from "./Mascot";

const advicePool = [
  { id: "focus", text: "Сделай одно важное задание до 17:00 — мозг в пике.", action: "Открыть задания", to: "/missions" },
  { id: "mindgame", text: "Играй 1 MindGame — +30 XP и заряд на вечер.", action: "К MindGame", to: "/library" },
  { id: "library", text: "Выбери короткий материал на 10 минут и закрой его.", action: "В библиотеку", to: "/library" },
  { id: "streak", text: "Отметь рефлексию сегодня, чтобы удержать серию.", action: "К Памяти", to: "/memory" },
  { id: "quiz", text: "Пройди быстрый тест — это +XP и новые рекомендации.", action: "Начать тест", to: "/library" },
  { id: "track", text: "Вернись к треку: одно действие = шаг к цели.", action: "Продолжить трек", to: "/dashboard" },
];

const icons = {
  learning: "📚",
  actions: "⚡",
  awareness: "🌿",
};

const formatDays = (value) => {
  if (value === 1) return "1 день";
  if (value >= 2 && value <= 4) return `${value} дня`;
  return `${value} дней`;
};

const ProgressCard = ({ goal, onToggleTip, isTipOpen }) => {
  const percent = Math.min(100, Math.max(0, goal.percent || 0));

  return (
    <Link
      to={goal.to || "#"}
      className="group flex flex-col gap-2 rounded-2xl border border-[var(--border)] bg-white/5 p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[#8A3FFC]/60 hover:shadow-lg"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">{icons[goal.id] || "🧩"}</span>
          <div>
            <div className="text-sm font-semibold text-[var(--fg)]">{goal.label}</div>
            <div className="text-xs text-[var(--muted)]">{goal.targetLabel}</div>
          </div>
        </div>
        <button
          type="button"
          className="rounded-full border border-white/10 px-2 text-xs text-[var(--muted)] transition hover:border-[#8A3FFC]/50 hover:text-[var(--fg)]"
          onClick={(e) => {
            e.preventDefault();
            onToggleTip(goal.id);
          }}
          aria-label="Как увеличить прогресс?"
        >
          ?
        </button>
      </div>
      <div className="relative mt-1 h-3 overflow-hidden rounded-full bg-white/10">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#8A3FFC] to-[#22d3ee] transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="flex items-center justify-between text-xs text-[var(--muted)]">
        <span>{goal.progressLabel}</span>
        <span>{percent}%</span>
      </div>
      <div className="flex items-center justify-between text-xs text-[#c084fc]">
        <span>Награда за завершение</span>
        <span className="font-semibold text-white">{goal.reward}</span>
      </div>
      {isTipOpen && (
        <div className="mt-2 rounded-xl border border-white/10 bg-black/30 p-3 text-xs text-[var(--fg)] shadow-inner">
          <div className="font-semibold">Как увеличить прогресс?</div>
          <ul className="mt-1 list-disc pl-4 text-[var(--muted)]">
            {goal.tips?.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </div>
      )}
    </Link>
  );
};

const GreetingHero = ({ user, streak = 0, level = 1, xp = 0, role = "Исследователь", goals = [], quote, insight, mood }) => {
  const topLineItems = [
    { icon: "🧩", label: `Статус: ${role}` },
    { icon: "🔥", label: `Серия: ${formatDays(streak)}` },
    { icon: "💎", label: `${xp} XP` },
  ];

  const quoteText = quote?.text || "Движение важнее идеальной траектории. Сделай шаг — поймешь дорогу.";
  const quoteAuthor = quote?.author || "NOESIS";

  const [activeAdvice, setActiveAdvice] = useState(0);
  const [disliked, setDisliked] = useState({});
  const [liked, setLiked] = useState({});
  const [openTip, setOpenTip] = useState(null);

  const visibleAdvice = advicePool[activeAdvice] || insight;

  const findNextAdvice = (direction = 1) => {
    const total = advicePool.length;
    for (let i = 1; i <= total; i += 1) {
      const candidate = (activeAdvice + direction * i + total) % total;
      if (!disliked[advicePool[candidate].id]) {
        return candidate;
      }
    }
    return (activeAdvice + direction + total) % total;
  };

  const handleFeedback = (type) => {
    const current = advicePool[activeAdvice];
    if (!current) return;
    if (type === "like") {
      setLiked((prev) => ({ ...prev, [current.id]: true }));
    } else {
      setDisliked((prev) => ({ ...prev, [current.id]: true }));
    }
    setActiveAdvice(findNextAdvice(1));
  };

  return (
    <section className="relative isolate flex min-h-[72vh] flex-col overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-2xl shadow-black/10 lg:p-10">
      <div className="absolute inset-0 opacity-60">
        <div className="absolute left-6 top-10 h-32 w-32 rounded-full bg-[#8A3FFC]/20 blur-3xl" />
        <div className="absolute right-4 top-0 h-24 w-24 rounded-full bg-[#22d3ee]/25 blur-3xl" />
        <div className="absolute bottom-6 left-1/3 h-24 w-36 rounded-full bg-black/5 blur-3xl" />
      </div>
      <div className="relative flex flex-1 items-center">
        <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-[1.2fr_0.95fr] lg:items-start">
          <div className="flex flex-col gap-6">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2 text-sm text-[var(--muted)]">
                {topLineItems.map((item) => (
                  <span key={item.label} className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1">
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </span>
                ))}
              </div>
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
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              {goals.map((goal) => (
                <ProgressCard key={goal.id} goal={goal} onToggleTip={(id) => setOpenTip((prev) => (prev === id ? null : id))} isTipOpen={openTip === goal.id} />
              ))}
            </div>
          </div>
          <div className="flex flex-col items-center gap-4 lg:items-stretch">
            <Mascot mood={mood} streak={streak} level={level} showMeta={false} />
            <div className="w-full rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-lg sm:p-5">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[10px] uppercase tracking-[0.12em] text-[var(--muted)]">Совет от платформы</p>
                <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
                  <button
                    type="button"
                    className="rounded-full border border-white/10 px-2 py-1 hover:border-[#8A3FFC]/60"
                    onClick={() => setActiveAdvice(findNextAdvice(-1))}
                    aria-label="Предыдущий совет"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    className="rounded-full border border-white/10 px-2 py-1 hover:border-[#8A3FFC]/60"
                    onClick={() => setActiveAdvice(findNextAdvice(1))}
                    aria-label="Следующий совет"
                  >
                    →
                  </button>
                </div>
              </div>
              <p className="mt-2 text-base font-semibold text-[var(--fg)]">
                {visibleAdvice?.text || insight?.title || "Продолжи главный шаг на сегодня"}
              </p>
              <p className="mt-1 text-sm text-[var(--muted)]">
                {insight?.context || "Переходи к заданию или игре — короткое действие даст +XP и держит серию."}
              </p>
              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  className="rounded-full border border-white/10 px-3 py-1 text-sm text-[var(--muted)] transition hover:border-[#8A3FFC]/70 hover:text-white"
                  onClick={() => handleFeedback("like")}
                  aria-label="Совет полезен"
                >
                  👍 Полезно
                </button>
                <button
                  type="button"
                  className="rounded-full border border-white/10 px-3 py-1 text-sm text-[var(--muted)] transition hover:border-[#8A3FFC]/70 hover:text-white"
                  onClick={() => handleFeedback("dislike")}
                  aria-label="Совет неинтересен"
                >
                  👎 Неинтересно
                </button>
              </div>
              <Link
                to={visibleAdvice?.to || insight?.to || "/missions"}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#8A3FFC] px-4 py-2 text-sm font-semibold text-white shadow-[0_12px_32px_rgba(138,63,252,0.28)] transition hover:-translate-y-0.5"
              >
                {visibleAdvice?.action || insight?.cta || "Продолжить задание"}
                <span className="text-xs">→</span>
              </Link>
              {liked[visibleAdvice?.id] && <p className="mt-2 text-xs text-[#c084fc]">Будем показывать больше таких советов</p>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GreetingHero;
