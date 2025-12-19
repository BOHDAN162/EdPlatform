import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "../../routerShim";
import Mascot from "./Mascot";

const tipsList = [
  "Определи цель дня и начни с самой важной задачи.",
  "Сделай шаг к проекту: запиши проблему, которую хочешь решить.",
  "Поговори с человеком из другой сферы — свежий взгляд даёт идеи.",
  "25 минут без отвлечений: включи таймер и проверь результат.",
  "Составь план карманного бюджета на неделю.",
  "Подумай, какой навык нужен мечте — найди материал в библиотеке.",
  "Запиши 3 улучшения продукта и обсуди их с другом.",
  "Сыграй MindGame на внимательность — разомни мозг перед учёбой.",
  "Сделай чек-лист целей на неделю и отмечай выполненное.",
  "Почитай саммари по лидерству и примени один совет сегодня.",
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

  const tips = useMemo(
    () =>
      tipsList.map((text, index) => ({
        id: `tip-${index + 1}`,
        text,
        to: "/missions",
      })),
    []
  );

  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState({});
  const [liked, setLiked] = useState({});
  const [openTip, setOpenTip] = useState(null);
  const [startX, setStartX] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("noesis_tip_feedback");
    if (stored) {
      const parsed = JSON.parse(stored);
      setFeedback(parsed);
      setLiked(
        Object.entries(parsed).reduce((acc, [key, value]) => {
          if (value === "up") acc[key] = true;
          return acc;
        }, {})
      );
    }
  }, []);

  const visibleAdvice = tips[currentIndex] || insight;

  const persistFeedback = (next) => {
    setFeedback(next);
    localStorage.setItem("noesis_tip_feedback", JSON.stringify(next));
  };

  const findNextIndex = (direction = 1) => {
    const total = tips.length;
    for (let step = 1; step <= total; step += 1) {
      const candidate = (currentIndex + direction * step + total) % total;
      if (feedback[tips[candidate].id] !== "down") return candidate;
    }
    return (currentIndex + direction + total) % total;
  };

  const handleFeedback = (type) => {
    const current = tips[currentIndex];
    if (!current) return;
    const nextState = { ...feedback, [current.id]: type === "like" ? "up" : "down" };
    persistFeedback(nextState);
    if (type === "like") {
      setLiked((prev) => ({ ...prev, [current.id]: true }));
    }
    setCurrentIndex(findNextIndex(1));
  };

  const handleSwipeStart = (clientX) => setStartX(clientX);
  const handleSwipeEnd = (clientX) => {
    if (startX === null) return;
    const delta = clientX - startX;
    if (Math.abs(delta) > 32) {
      setCurrentIndex(findNextIndex(delta > 0 ? -1 : 1));
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
                <ProgressCard key={goal.id} goal={goal} onToggleTip={(id) => setOpenTip((prev) => (prev === id ? null : id))} isTipOpen={openTip === goal.id} />
              ))}
            </div>
          </div>
          <div className="flex flex-col items-center gap-4 lg:items-stretch">
            <Mascot mood={mood} streak={streak} level={level} showMeta={false} />
            <div
              className="w-full rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-lg sm:p-5"
              onTouchStart={(e) => handleSwipeStart(e.touches[0].clientX)}
              onTouchEnd={(e) => handleSwipeEnd(e.changedTouches[0].clientX)}
              onPointerDown={(e) => handleSwipeStart(e.clientX)}
              onPointerUp={(e) => handleSwipeEnd(e.clientX)}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-[10px] uppercase tracking-[0.12em] text-[var(--muted)]">Совет от платформы</p>
                <div className="flex items-center gap-3 text-sm text-[var(--muted)]">
                  <button
                    type="button"
                    className="rounded-full border border-white/10 px-2 py-1 transition hover:border-[#8A3FFC]/60"
                    onClick={() => setCurrentIndex(findNextIndex(-1))}
                    aria-label="Предыдущий совет"
                  >
                    ←
                  </button>
                  <span className="text-xs font-semibold text-[var(--muted)]">{`${currentIndex + 1}/${tips.length}`}</span>
                  <button
                    type="button"
                    className="rounded-full border border-white/10 px-2 py-1 transition hover:border-[#8A3FFC]/60"
                    onClick={() => setCurrentIndex(findNextIndex(1))}
                    aria-label="Следующий совет"
                  >
                    →
                  </button>
                </div>
              </div>
              <div className="mt-2 space-y-1 overflow-hidden">
                <p className="text-base font-semibold text-[var(--fg)] transition duration-300 ease-out" key={visibleAdvice?.id}>
                  {visibleAdvice?.text || insight?.title || "Продолжи главный шаг на сегодня"}
                </p>
                <p className="text-sm text-[var(--muted)] transition duration-300 ease-out" key={`${visibleAdvice?.id}-desc`}>
                  {insight?.context || "Переходи к заданию или игре — короткое действие даст +XP и держит серию."}
                </p>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  className={`rounded-full border px-3 py-1 text-sm transition hover:border-[#8A3FFC]/70 hover:text-white ${
                    feedback[visibleAdvice?.id] === "up" ? "border-[#8A3FFC]/70 text-white" : "border-white/10 text-[var(--muted)]"
                  }`}
                  onClick={() => handleFeedback("like")}
                  aria-label="Совет полезен"
                >
                  👍 Полезно
                </button>
                <button
                  type="button"
                  className={`rounded-full border px-3 py-1 text-sm transition hover:border-[#8A3FFC]/70 hover:text-white ${
                    feedback[visibleAdvice?.id] === "down"
                      ? "border-[#8A3FFC]/70 text-white"
                      : "border-white/10 text-[var(--muted)]"
                  }`}
                  onClick={() => handleFeedback("dislike")}
                  aria-label="Совет неинтересен"
                >
                  👎 Неинтересно
                </button>
              </div>
              <button
                type="button"
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#8A3FFC] px-4 py-2 text-sm font-semibold text-white shadow-[0_12px_32px_rgba(138,63,252,0.28)] transition hover:-translate-y-0.5"
                onClick={() => navigate(`${visibleAdvice?.to || "/missions"}?tip=${visibleAdvice?.id || currentIndex}`)}
              >
                Вперёд
                <span className="text-xs">→</span>
              </button>
              {liked[visibleAdvice?.id] && <p className="mt-2 text-xs text-[#c084fc]">Будем показывать больше таких советов</p>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GreetingHero;
