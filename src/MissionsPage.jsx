import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "./routerShim";
import {
  badgePalette,
  missionCategories,
  missions as missionList,
} from "./data/missions";

const durationMap = {
  "ежедневная": { type: "today", label: "Сегодня" },
  "ежечасная": { type: "today", label: "Сегодня" },
  "3-дневная": { type: "week", label: "3 дня" },
  "недельная": { type: "week", label: "Неделя" },
  "месячная": { type: "month", label: "Месяц" },
  разовая: { type: "today", label: "Разовое" },
};

const difficultyMap = {
  лёгкая: { key: "easy", label: "Легкий", dots: 1 },
  средняя: { key: "medium", label: "Средний", dots: 2 },
  сложная: { key: "hard", label: "Сложный", dots: 3 },
};

const categoryMeta = {
  библиотека: { icon: "📚", label: "Учёба" },
  геймификация: { icon: "🎮", label: "Геймификация" },
  сообщество: { icon: "👥", label: "Социальное" },
  память: { icon: "🧠", label: "Навыки" },
  трек: { icon: "✅", label: "Привычки" },
};

const tabs = [
  { id: "all", label: "Все" },
  { id: "today", label: "Сегодня" },
  { id: "week", label: "На неделю" },
  { id: "team", label: "Для команды" },
  { id: "new", label: "Новые" },
  { id: "done", label: "Завершенные" },
];

const statusLabels = {
  new: "NEW",
  inProgress: "В процессе",
  completed: "Завершено",
};

  const chipBase = "px-3 py-2 rounded-full border text-sm font-medium transition";

const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4" onClick={onClose}>
    <div
      className="w-full max-w-2xl rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-2xl"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-[var(--muted)]">Модал</p>
          <h3 className="text-xl font-bold text-[var(--fg)]">{title}</h3>
        </div>
        <button
          type="button"
          className="text-[var(--muted)] transition hover:text-[var(--fg)]"
          onClick={onClose}
          aria-label="Закрыть"
        >
          ✕
        </button>
      </div>
      <div className="mt-4 max-h-[70vh] overflow-y-auto text-[var(--muted)]">{children}</div>
    </div>
  </div>
);

const ProgressBar = ({ percent }) => (
  <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--border)]">
    <div
      className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 transition-all duration-500"
      style={{ width: `${Math.min(100, percent)}%` }}
    />
  </div>
);

const MissionCard = ({ mission, progress, onAction, onDetails }) => {
  const category = missionCategories[mission.category] || missionCategories["геймификация"];
  const meta = categoryMeta[mission.category] || { icon: "🎯", label: category?.label || "Категория" };
  const diffMeta = difficultyMap[mission.difficulty] || { key: "easy", label: mission.difficulty, dots: 1 };
  const duration = durationMap[mission.period] || { type: "week", label: mission.period };
  const ratio = mission.targetValue
    ? Math.min(100, Math.round(((progress?.currentValue || 0) / mission.targetValue) * 100))
    : progress?.status === "completed"
    ? 100
    : 0;

  const status = progress?.status === "completed" ? "completed" : progress?.status === "inProgress" ? "inProgress" : "new";
  const statusColor = status === "completed" ? "bg-emerald-500/10 text-emerald-200" : status === "inProgress"
    ? "bg-amber-500/10 text-amber-200"
    : "bg-indigo-500/10 text-indigo-200";

  return (
    <div className="group flex h-full flex-col rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl">
      <div className="flex items-center justify-between gap-3 text-sm text-[var(--muted)]">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-[var(--fg)]">
            <span className="text-base">{meta.icon}</span>
            {meta.label}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-[var(--muted)] ring-1 ring-white/10">
            ⏱ {duration.label}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-[var(--muted)] ring-1 ring-white/10">
            {"●".repeat(diffMeta.dots)} {diffMeta.label}
          </span>
        </div>
        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold ${statusColor}`}>
          {status === "completed" ? "✓" : status === "inProgress" ? "↻" : "NEW"}
          <span>{statusLabels[status]}</span>
        </span>
      </div>

      <div className="mt-3 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-[var(--fg)]">{mission.title}</h3>
            <p className="text-sm text-[var(--muted)] line-clamp-2">{mission.description}</p>
          </div>
          <button
            type="button"
            className="text-sm text-indigo-400 underline-offset-4 hover:underline"
            onClick={onDetails}
          >
            Подробнее
          </button>
        </div>
        <div className="flex items-center gap-3">
          <ProgressBar percent={status === "completed" ? 100 : ratio} />
          <span className="text-xs font-semibold text-[var(--muted)] whitespace-nowrap">
            {mission.targetType === "streak"
              ? `${progress?.streakCount || 0}/${mission.targetValue}`
              : `${progress?.currentValue || 0}/${mission.targetValue}`}
          </span>
        </div>
        <div className="flex items-center justify-between gap-3 text-sm text-[var(--fg)]">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-200">+{mission.xpRewardBase} XP</span>
            {mission.badgeLevels?.length ? (
              <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-[var(--muted)]">
                Бейдж: {badgePalette[progress?.badgeTier || 0]?.label || "База"}
              </span>
            ) : null}
          </div>
          {status === "completed" ? (
            <div className="flex items-center gap-2 text-emerald-300 font-semibold">
              ✓ Завершено
              <button
                type="button"
                className="text-xs text-indigo-300 underline-offset-4 hover:underline"
                onClick={onAction}
              >
                Повторить
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
              onClick={onAction}
            >
              {status === "inProgress" ? "Продолжить" : "Начать"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const StoryCard = ({ title, description, gradient, icon }) => (
  <div className="flex min-w-[220px] flex-col gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg">
    <div className="h-28 w-full rounded-xl p-4 text-3xl" style={{ backgroundImage: gradient }}>
      <div className="flex h-full items-center justify-center text-4xl">{icon}</div>
    </div>
    <div>
      <h4 className="text-base font-semibold text-[var(--fg)]">{title}</h4>
      <p className="text-sm text-[var(--muted)]">{description}</p>
    </div>
  </div>
);

const ChallengeCard = ({ challenge, onJoin, onOpenChat, isJoined }) => {
  const percent = Math.min(100, Math.round((challenge.progress / challenge.target) * 100));
  return (
    <div className="flex h-full flex-col gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-[var(--muted)]">Командный вызов</p>
          <h3 className="text-lg font-semibold text-[var(--fg)]">{challenge.title}</h3>
          <p className="text-sm text-[var(--muted)]">{challenge.description}</p>
        </div>
        <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-[var(--fg)]">{challenge.deadline}</span>
      </div>
      <div className="flex items-center gap-3">
        <ProgressBar percent={percent} />
        <span className="text-xs font-semibold text-[var(--muted)] whitespace-nowrap">{challenge.progress}/{challenge.target}</span>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {challenge.participants.map((p) => (
          <span
            key={p.name}
            className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg)] px-3 py-1 text-xs font-semibold text-[var(--fg)]"
          >
            <span className="grid h-7 w-7 place-items-center rounded-full bg-white/5 shadow ring-1 ring-[var(--border)]">
              {p.avatar}
            </span>
            {p.name}
            <span className="text-[11px] font-medium text-[var(--muted)]">+{p.xp} XP</span>
          </span>
        ))}
      </div>
      <div className="mt-auto flex items-center justify-between gap-3">
        <p className="text-sm text-[var(--muted)]">Топ-3 вклада видны команде — поднимись в лидерборде.</p>
        <div className="flex flex-wrap gap-2">
          {!isJoined && (
            <button
              type="button"
              className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:shadow-lg"
              onClick={() => onJoin(challenge.id)}
            >
              Присоединиться
            </button>
          )}
          <button
            type="button"
            className="rounded-full border border-[var(--border)] bg-[var(--bg)] px-4 py-2 text-sm font-semibold text-[var(--fg)] transition hover:border-[var(--accent)]/60"
            onClick={() => onOpenChat(challenge.id)}
          >
            Открыть чат
          </button>
        </div>
      </div>
    </div>
  );
};

const EmptyState = ({ onReset }) => (
  <div className="flex min-h-[240px] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--card)] p-6 text-center">
    <div className="text-3xl">🔍</div>
    <h3 className="text-lg font-semibold text-[var(--fg)]">Ничего не найдено</h3>
    <p className="text-sm text-[var(--muted)]">Попробуй другие фильтры или сбрось выбор, чтобы вернуться ко всем заданиям.</p>
    <button
      type="button"
      className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white shadow hover:shadow-lg"
      onClick={onReset}
    >
      Сбросить фильтры
    </button>
  </div>
);

const MissionsPage = ({
  gamification,
  missions = missionList,
  getMissionProgress,
  setMissionStatus,
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [filters, setFilters] = useState({ duration: "all", difficulty: "all", status: "all" });
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [detailsMission, setDetailsMission] = useState(null);
  const [gamificationModal, setGamificationModal] = useState(false);
  const [chatFor, setChatFor] = useState(null);
  const [chatMessages, setChatMessages] = useState({});
  const [joinToast, setJoinToast] = useState("");

  const messageEndRef = useRef(null);

  const enriched = useMemo(
    () =>
      missions.map((mission) => {
        const duration = durationMap[mission.period] || { type: "week", label: mission.period };
        const diff = difficultyMap[mission.difficulty] || { key: "medium", label: mission.difficulty };
        return {
          ...mission,
          durationType: duration.type,
          durationLabel: duration.label,
          difficultyKey: diff.key,
          difficultyLabel: diff.label,
          isTeam: mission.category === "сообщество" || mission.isTeam,
        };
      }),
    [missions]
  );

  const missionsWithProgress = useMemo(
    () =>
      enriched.map((mission) => ({
        mission,
        progress: getMissionProgress?.(mission.id) || { status: "new", currentValue: 0, streakCount: 0 },
      })),
    [enriched, getMissionProgress]
  );

  useEffect(() => {
    const storedChats = localStorage.getItem("mission_chats");
    if (storedChats) setChatMessages(JSON.parse(storedChats));
  }, []);

  useEffect(() => {
    localStorage.setItem("mission_chats", JSON.stringify(chatMessages));
  }, [chatMessages]);

  useEffect(() => {
    if (messageEndRef.current) messageEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [chatFor, chatMessages]);

  const applyTab = (tabId) => {
    setActiveTab(tabId);
    if (tabId === "today") setFilters((prev) => ({ ...prev, duration: "today" }));
    else if (tabId === "week") setFilters((prev) => ({ ...prev, duration: "week" }));
    else setFilters((prev) => ({ ...prev, duration: prev.duration === "today" || prev.duration === "week" ? "all" : prev.duration }));

    if (tabId === "new") setFilters((prev) => ({ ...prev, status: "new" }));
    else if (tabId === "done") setFilters((prev) => ({ ...prev, status: "completed" }));
    else setFilters((prev) => ({ ...prev, status: prev.status === "new" || prev.status === "completed" ? "all" : prev.status }));
  };

  const filtered = useMemo(() => {
    return missionsWithProgress.filter(({ mission, progress }) => {
      const matchesDuration = filters.duration === "all" || mission.durationType === filters.duration;
      const matchesDifficulty = filters.difficulty === "all" || mission.difficultyKey === filters.difficulty;
      const matchesCategory = !selectedCategories.length || selectedCategories.includes(mission.category);
      const matchesStatus =
        filters.status === "all" ||
        (filters.status === "new" && progress.status !== "inProgress" && progress.status !== "completed") ||
        (filters.status === "inProgress" && progress.status === "inProgress") ||
        (filters.status === "completed" && progress.status === "completed");
      const matchesTeam = activeTab === "team" ? mission.isTeam : true;
      return matchesDuration && matchesDifficulty && matchesCategory && matchesStatus && matchesTeam;
    });
  }, [activeTab, filters, missionsWithProgress, selectedCategories]);

  const handleAction = (missionId, link) => {
    setMissionStatus?.(missionId, "inProgress");
    if (link) navigate(link);
  };

  const handleJoinChallenge = (id) => {
    const next = { ...chatMessages, [id]: { ...(chatMessages[id] || {}), joined: true } };
    setChatMessages(next);
    localStorage.setItem("mission_chats", JSON.stringify(next));
    setJoinToast("Ты в команде!");
    setTimeout(() => setJoinToast(""), 2000);
  };

  const handleSendMessage = (id, text) => {
    if (!text.trim()) return;
    const payload = {
      text: text.trim(),
      author: "Ты",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setChatMessages((prev) => ({
      ...prev,
      [id]: { ...(prev[id] || {}), joined: true, messages: [ ...(prev[id]?.messages || defaultMessages(id)), payload ] },
    }));
  };

  const defaultMessages = (id) => {
    const base = {
      squad1: [
        { author: "Аня", text: "Давайте закрывать задания сегодня!", time: "09:20" },
        { author: "Илья", text: "Я беру материал по финансам.", time: "09:45" },
      ],
      squad2: [
        { author: "Маша", text: "Кто-то идёт на стрим?", time: "10:10" },
        { author: "Тим", text: "Я беру чек-лист привычек", time: "10:22" },
      ],
    };
    return base[id] || [];
  };

  const challenges = useMemo(
    () => [
      {
        id: "squad1",
        title: "XP-спринт команды",
        description: "Соберите 500 XP вместе за 3 дня",
        progress: 320,
        target: 500,
        deadline: "до пятницы",
        participants: [
          { name: "Аня", xp: 120, avatar: "A" },
          { name: "Илья", xp: 90, avatar: "И" },
          { name: "Маша", xp: 60, avatar: "M" },
        ],
      },
      {
        id: "squad2",
        title: "Челлендж привычек",
        description: "7 дней без пропусков в трекере",
        progress: 4,
        target: 7,
        deadline: "осталось 3 дня",
        participants: [
          { name: "Тим", xp: 80, avatar: "T" },
          { name: "Лера", xp: 70, avatar: "L" },
          { name: "Катя", xp: 55, avatar: "K" },
        ],
      },
    ],
    []
  );

  const storyCards = [
    { title: "Выполняй → получай XP", description: "Каждая миссия даёт 💎 XP и двигает к уровню.", icon: "💎", gradient: "linear-gradient(135deg,#c7d2fe,#e0f2fe)" },
    { title: "Серия растёт", description: "Закрывай задания ежедневно и держи 🔥 streak.", icon: "🔥", gradient: "linear-gradient(135deg,#fef9c3,#fecdd3)" },
    { title: "Уровни и статусы", description: "Новые уровни открывают роли и бейджи.", icon: "🛡️", gradient: "linear-gradient(135deg,#e0f2f1,#d1fae5)" },
    { title: "Командные бонусы", description: "Челленджи дают общий буст XP.", icon: "🤝", gradient: "linear-gradient(135deg,#ede9fe,#cffafe)" },
  ];

  const quickFilters = [
    { id: "today", label: "Сегодня" },
    { id: "week", label: "Неделя" },
    { id: "month", label: "Месяц" },
  ];

  const difficulties = [
    { id: "easy", label: "Легкий" },
    { id: "medium", label: "Средний" },
    { id: "hard", label: "Сложный" },
  ];

  const statuses = [
    { id: "all", label: "Все" },
    { id: "new", label: "NEW" },
    { id: "inProgress", label: "В процессе" },
    { id: "completed", label: "Завершено" },
  ];

  const handleReset = () => {
    setFilters({ duration: "all", difficulty: "all", status: "all" });
    setSelectedCategories([]);
    setActiveTab("all");
  };

  const isEmpty = filtered.length === 0;

  return (
    <div className="page space-y-8">
      <div className="flex flex-col gap-4 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-lg md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-wide text-[var(--muted)]">Задания</p>
          <h1 className="text-3xl font-bold text-[var(--fg)]">Задания</h1>
          <p className="max-w-2xl text-sm text-[var(--muted)]">
            Вкладки, фильтры, геймификация и командные челленджи — собери XP, удерживай серию и проходи квесты вместе.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/profile"
            className="rounded-full border border-[var(--border)] bg-[var(--bg)] px-4 py-2 text-sm font-semibold text-[var(--fg)] shadow"
          >
            Мой прогресс
          </Link>
          <button
            type="button"
            className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white shadow hover:shadow-lg"
            onClick={() => setGamificationModal(true)}
          >
            Подробнее о геймификации
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`${chipBase} ${
                activeTab === tab.id
                  ? "border-[var(--accent)] bg-[var(--accent)]/20 text-[var(--fg)]"
                  : "border-[var(--border)] bg-[var(--card)] text-[var(--muted)]"
              }`}
              onClick={() => applyTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3 overflow-x-auto pb-2">
          {quickFilters.map((item) => (
            <button
              key={item.id}
              className={`${chipBase} ${
                filters.duration === item.id
                  ? "border-[var(--accent)] bg-[var(--accent)]/20 text-[var(--fg)]"
                  : "border-[var(--border)] bg-[var(--card)] text-[var(--muted)]"
              }`}
              onClick={() => setFilters((prev) => ({ ...prev, duration: prev.duration === item.id ? "all" : item.id }))}
            >
              {item.label}
            </button>
          ))}
          {difficulties.map((item) => (
            <button
              key={item.id}
              className={`${chipBase} ${
                filters.difficulty === item.id
                  ? "border-[var(--accent)] bg-[var(--accent)]/20 text-[var(--fg)]"
                  : "border-[var(--border)] bg-[var(--card)] text-[var(--muted)]"
              }`}
              onClick={() => setFilters((prev) => ({ ...prev, difficulty: prev.difficulty === item.id ? "all" : item.id }))}
            >
              {item.label}
            </button>
          ))}
          <button
            type="button"
            className="ml-auto flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm font-semibold text-[var(--fg)] shadow"
            onClick={() => setFiltersOpen(true)}
          >
            <span>Фильтры</span>
            <span className="text-lg">⚙️</span>
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {isEmpty ? <EmptyState onReset={handleReset} /> : filtered.map(({ mission, progress }) => (
              <MissionCard
                key={mission.id}
                mission={mission}
                progress={progress}
                onAction={() => handleAction(mission.id, mission.link)}
                onDetails={() => setDetailsMission({ mission, progress })}
              />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-[var(--fg)]">Быстрый статус</h3>
            <div className="mt-3 space-y-2 text-sm text-[var(--muted)]">
              <div className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2">
                <span>XP</span>
                <span className="font-semibold text-[var(--fg)]">{gamification?.totalPoints || 0} XP</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2">
                <span>Стрик</span>
                <span className="font-semibold text-[var(--fg)]">{gamification?.streakCount || 0} дней</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2">
                <span>Бейджи</span>
                <span className="font-semibold text-[var(--fg)]">{badgePalette.length}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[var(--fg)]">Групповые челленджи</h3>
              <span className="text-xs text-[var(--muted)]">Команда</span>
            </div>
            {challenges.map((challenge) => (
              <ChallengeCard
                key={challenge.id}
                challenge={{
                  ...challenge,
                  participants: chatMessages[challenge.id]?.joined
                    ? [...challenge.participants, { name: "Ты", xp: 30, avatar: "✨" }]
                    : challenge.participants,
                }}
                isJoined={Boolean(chatMessages[challenge.id]?.joined)}
                onJoin={(id) => {
                  handleJoinChallenge(id);
                  setChatFor(id);
                }}
                onOpenChat={(id) => setChatFor(id)}
              />
            ))}
          </div>
        </div>
      </div>

      {joinToast && (
        <div className="fixed inset-x-0 top-4 mx-auto flex max-w-md items-center justify-center rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700 shadow-lg">
          {joinToast}
        </div>
      )}

      <div className="space-y-3 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-900 p-6 text-white">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-indigo-200">Комикс</p>
            <h2 className="text-2xl font-bold">Как работает геймификация</h2>
            <p className="text-sm text-slate-200">Истории о том, как XP, streak и уровни двигают тебя вперёд.</p>
          </div>
          <button
            type="button"
            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow"
            onClick={() => setGamificationModal(true)}
          >
            Подробнее
          </button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-3">
          {storyCards.map((story) => (
            <StoryCard key={story.title} {...story} />
          ))}
        </div>
      </div>

      {filtersOpen && (
        <Modal title="Фильтры заданий" onClose={() => setFiltersOpen(false)}>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold text-slate-900">Длительность</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {quickFilters.map((item) => (
                  <button
                    key={item.id}
                    className={`${chipBase} ${filters.duration === item.id ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "bg-white"}`}
                    onClick={() => setFilters((prev) => ({ ...prev, duration: prev.duration === item.id ? "all" : item.id }))}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Сложность</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {difficulties.map((item) => (
                  <button
                    key={item.id}
                    className={`${chipBase} ${filters.difficulty === item.id ? "border-amber-500 bg-amber-50 text-amber-700" : "bg-white"}`}
                    onClick={() => setFilters((prev) => ({ ...prev, difficulty: prev.difficulty === item.id ? "all" : item.id }))}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Категории</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {Object.keys(missionCategories).map((key) => (
                  <button
                    key={key}
                    className={`${chipBase} ${selectedCategories.includes(key) ? "border-indigo-500 bg-indigo-50 text-indigo-700" : "bg-white"}`}
                    onClick={() =>
                      setSelectedCategories((prev) =>
                        prev.includes(key) ? prev.filter((i) => i !== key) : [...prev, key]
                      )
                    }
                  >
                    {missionCategories[key].label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Статус</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {statuses.map((item) => (
                  <button
                    key={item.id}
                    className={`${chipBase} ${filters.status === item.id ? "border-slate-800 bg-slate-900 text-white" : "bg-white"}`}
                    onClick={() => setFilters((prev) => ({ ...prev, status: item.id }))}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-between gap-3">
              <button
                type="button"
                className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-800"
                onClick={handleReset}
              >
                Сбросить
              </button>
              <button
                type="button"
                className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white"
                onClick={() => setFiltersOpen(false)}
              >
                Применить
              </button>
            </div>
          </div>
        </Modal>
      )}

      {detailsMission && (
        <Modal title={detailsMission.mission.title} onClose={() => setDetailsMission(null)}>
          <div className="space-y-3 text-sm text-slate-700">
            <p>{detailsMission.mission.description}</p>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="rounded-full bg-slate-100 px-3 py-1">Категория: {missionCategories[detailsMission.mission.category]?.label}</span>
              <span className="rounded-full bg-slate-100 px-3 py-1">Длительность: {detailsMission.mission.durationLabel}</span>
              <span className="rounded-full bg-slate-100 px-3 py-1">Сложность: {detailsMission.mission.difficultyLabel || detailsMission.mission.difficulty}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="font-semibold text-slate-900">Награда: +{detailsMission.mission.xpRewardBase} XP</span>
              <button
                type="button"
                className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white"
                onClick={() => {
                  handleAction(detailsMission.mission.id, detailsMission.mission.link);
                  setDetailsMission(null);
                }}
              >
                {detailsMission.progress?.status === "inProgress" ? "Продолжить" : "Начать"}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {gamificationModal && (
        <Modal title="Геймификация" onClose={() => setGamificationModal(false)}>
          <div className="space-y-3 text-sm text-slate-700">
            <p>Задания дают XP. Собирай streak, чтобы умножать награды. Уровни открывают роли и доступ к редким бейджам.</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>XP за задания, тесты и челленджи</li>
              <li>🔥 Серия растёт за ежедневные действия</li>
              <li>Бейджи улучшаются по мере прогресса</li>
              <li>Командные миссии дают бонусный XP</li>
            </ul>
            <p className="text-slate-600">Двигайся каждый день, чтобы видеть рост статуса.</p>
          </div>
        </Modal>
      )}

      {chatFor && (
        <Modal title="Чат команды" onClose={() => setChatFor(null)}>
          <div className="flex flex-col gap-3">
            <div className="max-h-64 space-y-2 overflow-y-auto rounded-xl bg-slate-50 p-3">
              {(chatMessages[chatFor]?.messages || defaultMessages(chatFor)).map((msg, idx) => (
                <div key={idx} className="flex flex-col gap-1 rounded-lg bg-white p-2 shadow-sm">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-semibold text-slate-800">{msg.author}</span>
                    <span>{msg.time}</span>
                  </div>
                  <p className="text-sm text-slate-700">{msg.text}</p>
                </div>
              ))}
              <div ref={messageEndRef} />
            </div>
            <ChatInput
              onSend={(text) => {
                handleSendMessage(chatFor, text);
              }}
            />
          </div>
        </Modal>
      )}
    </div>
  );
};

const ChatInput = ({ onSend }) => {
  const [value, setValue] = useState("");
  return (
    <div className="flex items-center gap-2">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full rounded-full border border-slate-200 px-4 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none"
        placeholder="Напиши сообщение"
      />
      <button
        type="button"
        className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-700"
        onClick={() => {
          onSend(value);
          setValue("");
        }}
      >
        Отправить
      </button>
    </div>
  );
};

export default MissionsPage;
