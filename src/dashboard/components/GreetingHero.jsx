import React, { useEffect, useMemo, useState } from "react";
import { Link } from "../../routerShim";
import MascotRenderer from "../../mascots/MascotRenderer";

const platformTips = [
  {
    id: "library",
    title: "Прокачай навык за 10 минут",
    text: "Открой лонгрид/саммари и выпиши 3 тезиса в Память — короткая сессия даст буст.",
    route: "/library",
  },
  {
    id: "missions",
    title: "Закрой миссию сегодня",
    text: "Закрой 1 миссию, чтобы удержать серию и получить XP — выбери короткую цель.",
    route: "/missions",
  },
  {
    id: "memory",
    title: "Запиши инсайт в Память",
    text: "Запиши идею или вывод в Память — хотя бы 2 строки, чтобы сохранить фокус.",
    route: "/memory",
  },
  {
    id: "community",
    title: "Зайди в активное сообщество",
    text: "Посмотри топ активных, вдохновись прогрессом и отметься в одном обсуждении.",
    route: "/community",
  },
  {
    id: "profile",
    title: "Настрой профиль и оформление",
    text: "Зайди в настройки профиля: выбери персонажа, акцент и обнови данные.",
    route: "/settings?tab=profile",
  },
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

const ProgressCard = ({ goal }) => {
  const percent = Math.min(100, Math.max(0, goal.percent || 0));

  return (
    <Link
      to={goal.to || "#"}
      className="group flex flex-col gap-2 rounded-2xl border border-[var(--border)] bg-white/5 p-4 text-left shadow-sm transition-transform transition-shadow duration-200 hover:-translate-y-1 hover:border-[#8A3FFC]/60 hover:shadow-xl"
      role="button"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">{icons[goal.id] || "🧩"}</span>
          <div>
            <div className="text-sm font-semibold text-[var(--fg)]">{goal.label}</div>
            <div className="text-xs text-[var(--muted)]">{goal.targetLabel}</div>
          </div>
        </div>
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

  const tips = useMemo(() => platformTips, []);

  const [tipIndex, setTipIndex] = useState(0);
  const [startX, setStartX] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
    const timeout = setTimeout(() => setIsAnimating(false), 40);
    return () => clearTimeout(timeout);
  }, [tipIndex]);

  const visibleAdvice = tips[tipIndex] || tips[0] || insight;

  const handlePrev = () => setTipIndex((i) => (i - 1 + tips.length) % tips.length);
  const handleNext = () => setTipIndex((i) => (i + 1) % tips.length);

  const handleSwipeStart = (clientX) => setStartX(clientX);
  const handleSwipeEnd = (clientX) => {
    if (startX === null) return;
    const delta = clientX - startX;
    if (Math.abs(delta) > 32) {
      if (delta > 0) handlePrev();
      else handleNext();
    }
    setStartX(null);
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
              <ProgressCard key={goal.id} goal={goal} />
            ))}
            </div>
          </div>
          <div className="flex flex-col items-center gap-4 lg:items-stretch">
            <MascotRenderer size={260} className="w-full max-w-[320px]" />
            <div
              className="relative w-full rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 pb-16 pr-4 shadow-lg sm:p-5 sm:pb-14"
              onTouchStart={(e) => handleSwipeStart(e.touches[0].clientX)}
              onTouchEnd={(e) => handleSwipeEnd(e.changedTouches[0].clientX)}
              onPointerDown={(e) => handleSwipeStart(e.clientX)}
              onPointerUp={(e) => handleSwipeEnd(e.clientX)}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-[10px] uppercase tracking-[0.12em] text-[var(--muted)]">Совет от платформы</p>
                <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
                  <button
                    type="button"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/35 bg-black/40 text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-[var(--accent)] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                    onClick={handlePrev}
                    aria-label="Предыдущий совет"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                  </button>
                  <span className="text-xs font-semibold text-[var(--muted)]">{`${tipIndex + 1}/${tips.length}`}</span>
                  <button
                    type="button"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/35 bg-black/40 text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-[var(--accent)] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                    onClick={handleNext}
                    aria-label="Следующий совет"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                      <path d="M9 6l6 6-6 6" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="mt-3 space-y-2 overflow-hidden pr-2">
                <p
                  className={`text-base font-semibold text-[var(--fg)] transition-all duration-300 ease-out ${
                    isAnimating ? "opacity-0 translate-y-1" : "opacity-100 translate-y-0"
                  }`}
                  key={visibleAdvice?.id || "tip-title"}
                >
                  {visibleAdvice?.title || insight?.title || "Продолжи главный шаг на сегодня"}
                </p>
                <p
                  className={`text-sm text-[var(--muted)] transition-all duration-300 ease-out ${
                    isAnimating ? "opacity-0 translate-y-1" : "opacity-100 translate-y-0"
                  }`}
                  key={`${visibleAdvice?.id || "tip"}-desc`}
                >
                  {visibleAdvice?.text || insight?.context || "Переходи к заданию или игре — короткое действие даст +XP и держит серию."}
                </p>
              </div>
              <Link
                to={visibleAdvice?.route || insight?.to || "/missions"}
                className="absolute bottom-3 right-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent)] text-white shadow-[0_10px_30px_rgba(138,63,252,0.32)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_34px_rgba(138,63,252,0.42)] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
                aria-label="Перейти по совету"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                  <path d="M5 12h14" />
                  <path d="M13 6l6 6-6 6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GreetingHero;
