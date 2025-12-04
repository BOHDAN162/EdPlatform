import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "./routerShim";
import useUserProfile from "./useUserProfile";
import { getLevelFromXP, getRoleFromLevel, getXPConfig } from "./gamification";
import { getMaterialById, learningPaths, materials, themeLabels } from "./libraryData";
import { getPathProgress } from "./progress";
import { missions as missionList } from "./data/missions";
import HabitProfileWidget from "./habits/HabitProfileWidget";

const ProgressLine = ({ value }) => (
  <div className="progress-shell">
    <div className="progress-fill" style={{ width: `${Math.min(100, value)}%` }} />
  </div>
);

const AvatarSelectorModal = ({ open, onClose, onSelect, currentAvatar }) => {
  const avatars = ["🚀", "🦊", "🐉", "🎧", "🛰️", "🌌", "⚡", "🧠", "🌿", "🎮", "🦄", "🔥"];
  if (!open) return null;
  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div className="modal-header">
          <div>
            <div className="card-header">Выбери аватар</div>
            <p className="meta">Подбери тотем, который будет рядом с тобой в каждом действии.</p>
          </div>
          <button className="ghost" onClick={onClose}>
            Закрыть
          </button>
        </div>
        <div className="avatar-grid">
          {avatars.map((icon) => (
            <button
              key={icon}
              className={`avatar-option ${currentAvatar === icon ? "active" : ""}`}
              onClick={() => onSelect(icon)}
            >
              {icon}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const HeroCard = ({ profile, levelInfo, roleLabel, streak, gamification, onAvatarClick, progressSummary, progressContent }) => (
  <div className="profile-hero modern">
    <div className="hero-left">
      <button className="avatar huge gradient interactive" onClick={onAvatarClick}>
        {profile.avatar}
      </button>
      <div className="hero-meta">
        <div className="hero-name-row">
          <div>
            <div className="hero-name">{profile.name}</div>
            <div className="meta subtle">{profile.personality || profile.role || "Исследователь"}</div>
          </div>
          <span className="status-pill">{roleLabel}</span>
        </div>
        <div className="hero-subtitle">Уровень {levelInfo.level} · XP: {gamification.totalPoints} · Серия: {streak?.count || 0} дней</div>
        <div className="level-line">
          <div className="level-title">Прогресс уровня</div>
          <span className="meta subtle">До следующего: {levelInfo.toNext} XP</span>
        </div>
        <ProgressLine value={levelInfo.progress} />
        <div className="level-footer">
          <div className={`chip streak ${streak?.count >= 3 ? "hot" : ""}`}>
            🔥 Серия: {streak?.count || 0} дней
          </div>
          <div className="meta subtle">{progressSummary}</div>
        </div>
      </div>
    </div>
    <div className="hero-right">{progressContent}</div>
  </div>
);

const ProgressRing = ({ size = 140, thickness = 12, value = 0, color, label, caption }) => {
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const [animatedValue, setAnimatedValue] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (hasAnimated) return;
    const frame = requestAnimationFrame(() => {
      setAnimatedValue(value);
      setHasAnimated(true);
    });
    return () => cancelAnimationFrame(frame);
  }, [value, hasAnimated]);

  const progress = Math.min(100, Math.max(0, animatedValue));
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="ring-card" style={{ width: size, height: size }}>
      <div className="ring-shell">
        <svg width={size} height={size}>
          <circle className="ring-track" strokeWidth={thickness} r={radius} cx={size / 2} cy={size / 2} />
          <circle
            className="ring-progress"
            stroke={color}
            strokeWidth={thickness}
            r={radius}
            cx={size / 2}
            cy={size / 2}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="ring-value">{Math.round(progress)}%</div>
      </div>
      <div className="ring-label">{label}</div>
      <div className="ring-caption">{caption}</div>
    </div>
  );
};

const ProgressRings = ({ xpToday, xpTarget, streakCount, streakTarget, habitsCompleted, habitsTotal }) => {
  const habitsPercent = habitsTotal ? Math.round((habitsCompleted / habitsTotal) * 100) : 0;
  return (
    <div className="progress-rings">
      <ProgressRing
        value={xpTarget ? Math.min(100, Math.round((xpToday / xpTarget) * 100)) : 0}
        color="url(#gradient-purple)"
        label="Дневной XP"
        caption={`${xpToday} / ${xpTarget} XP`}
      />
      <ProgressRing
        value={streakTarget ? Math.min(100, Math.round((streakCount / streakTarget) * 100)) : 0}
        color="url(#gradient-blue)"
        label="Серия дней"
        caption={`${streakCount} из ${streakTarget}`}
      />
      <ProgressRing
        value={habitsPercent}
        color="url(#gradient-green)"
        label="Дневные привычки"
        caption={`${habitsCompleted} / ${habitsTotal}`}
      />
      <svg className="ring-gradients" width="0" height="0">
        <defs>
          <linearGradient id="gradient-purple" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
          <linearGradient id="gradient-blue" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
          <linearGradient id="gradient-green" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#bef264" />
            <stop offset="100%" stopColor="#22c55e" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

const TrackCard = ({ path, progress, onOpen }) => {
  const ratio = progress.totalCount ? Math.round((progress.completedCount / progress.totalCount) * 100) : 0;
  const status =
    ratio === 0 ? "Не начат" : ratio === 100 ? "Завершён" : progress.onHold ? "На паузе" : "В процессе";
  const steps = Math.min(5, Math.max(1, Math.round((ratio || 1) / 20)));
  const statusClass = status.replace(/\s+/g, "-");
  return (
    <div className="track-card">
      <div className="track-card-top">
        <div>
          <div className="meta subtle">{themeLabels[path.theme]?.title || "Трек"}</div>
          <div className="track-title">{path.title}</div>
          <div className="meta">{progress.completedCount} / {progress.totalCount} материалов · {ratio}%</div>
        </div>
        <span className={`status-chip status-${statusClass}`}>{status}</span>
      </div>
      <div className="track-indicator" aria-hidden>
        {Array.from({ length: 5 }).map((_, idx) => (
          <span key={idx} className={`dot ${idx < steps ? "filled" : ""}`} />
        ))}
      </div>
      <div className="track-card-actions">
        <ProgressLine value={ratio} />
        <button className="primary outline" onClick={onOpen}>
          {ratio === 100 ? "Пересобрать" : "Продолжить"}
        </button>
      </div>
    </div>
  );
};

const XPCard = ({ gamification, levelInfo, roleLabel, streak }) => (
  <div className="card xp-card clear">
    <div className="card-header">Уровень и XP</div>
    <div className="xp-top">
      <div>
        <div className="xp-level">Уровень {levelInfo.level}</div>
        <p className="meta">Роль: {roleLabel}</p>
      </div>
      <div className={`chip streak ${streak?.count >= 3 ? "hot" : ""}`}>🔥 Серия {streak?.count || 0} дней</div>
    </div>
    <p className="meta">XP: {gamification.totalPoints} из {levelInfo.nextBase} для уровня {levelInfo.level + 1}</p>
    <ProgressLine value={levelInfo.progress} />
    <div className="meta subtle">Осталось {levelInfo.toNext} XP</div>
    <div className="xp-chips">
      <span className="chip">Материалы: {gamification.completedMaterialsCount || 0}</span>
      <span className="chip">Тесты: {gamification.completedTestsCount || 0}</span>
      <span className="chip">Ответы: {gamification.communityAnswers || 0}</span>
    </div>
  </div>
);

const GoalBar = ({ goal }) => {
  const progress = Math.min(100, Math.round(((goal.progress || 0) / goal.target) * 100));
  return (
    <div className={`goal-item ${goal.completed ? "done" : ""}`}>
      <div className="goal-top">
        <div>
          <div className="goal-title">{goal.title}</div>
          <p className="meta">{goal.description}</p>
        </div>
        <span className="goal-value">{goal.progress || 0}/{goal.target}</span>
      </div>
      <ProgressLine value={progress} />
      {goal.completed && <div className="meta success">Выполнено · +{goal.reward} XP</div>}
    </div>
  );
};

const GoalsCard = ({ goals = [] }) => {
  const dailyGoals = goals.filter((g) => g.type === "daily");
  const weeklyGoals = goals.filter((g) => g.type === "weekly");
  return (
    <div className="card goals-card">
      <div className="card-header">Цели</div>
      <div className="goal-columns">
        <div>
          <div className="goal-label">На сегодня</div>
          <div className="goal-list">
            {dailyGoals.map((goal) => (
              <GoalBar key={goal.id} goal={goal} />
            ))}
          </div>
        </div>
        <div>
          <div className="goal-label">На неделю</div>
          <div className="goal-list">
            {weeklyGoals.map((goal) => (
              <GoalBar key={goal.id} goal={goal} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ActiveDaysCard = ({ activeDays = 0, monthLabel, streakCurrent = 0, streakBest = 0 }) => (
  <div className="insight-card">
    <div className="insight-title">Активные дни</div>
    <div className="mission-value">
      <span className="number">{activeDays}</span>
      <span className="meta subtle">в {monthLabel}</span>
    </div>
    <div className="mission-meta">Серия: {streakCurrent} · Лучший стрик: {streakBest}</div>
  </div>
);

const MissionsCard = ({ completed = 0, active = 0 }) => {
  const total = completed + active;
  return (
    <div className="insight-card">
      <div className="insight-title">Миссии выполнено</div>
      <div className="mission-value">
        <span className="number">{completed}</span>
        <span className="meta subtle">из {total} в прогрессе</span>
      </div>
      <div className="mission-meta">Активные: {active}</div>
    </div>
  );
};

const MaterialsCard = ({ materialsCompleted = 0, testsCompleted = 0 }) => {
  const total = materialsCompleted + testsCompleted || 1;
  const matPercent = Math.round((materialsCompleted / total) * 100);
  const testPercent = 100 - matPercent;
  return (
    <div className="insight-card">
      <div className="insight-title">Материалы пройдены</div>
      <div className="bars">
        <div className="bar" style={{ width: `${matPercent}%` }} />
        <div className="bar alt" style={{ width: `${testPercent}%` }} />
      </div>
      <div className="insight-footer">
        <span className="meta">Материалы: {materialsCompleted}</span>
        <span className="meta">Тесты: {testsCompleted}</span>
      </div>
    </div>
  );
};

const MissionPlaylistCard = ({ mission, status, onOpen }) => (
  <div className={`hub-card mission ${status}`} onClick={onOpen}>
    <div className="hub-card-top">
      <div>
        <div className="meta subtle">Миссия недели</div>
        <div className="hub-title">{mission.title}</div>
        <div className="meta">{mission.description}</div>
      </div>
      <span className={`pill ${status}`}>{status === "completed" ? "Завершена" : status === "in-progress" ? "В процессе" : "Начата"}</span>
    </div>
    <div className="hub-progress">
      <ProgressLine value={status === "completed" ? 100 : status === "in-progress" ? 60 : 25} />
      <button className="ghost">Открыть</button>
    </div>
  </div>
);

const RecommendationCard = ({ material, onOpen }) => (
  <div className="hub-card recommendation" onClick={onOpen}>
    <div>
      <div className="meta subtle">Под твой тип личности</div>
      <div className="hub-title">{material.title}</div>
      <div className="meta">{material.type === "article" ? "Материал" : "Видео"}</div>
    </div>
    <div className="recommend-pill">Открыть</div>
  </div>
);

const MiniGameCard = ({ game, onOpen }) => (
  <div className="hub-card mini-game" onClick={onOpen}>
    <div className="hub-card-top">
      <div>
        <div className="meta subtle">Мини-игра</div>
        <div className="hub-title">{game.title}</div>
        <div className="meta">Лучший результат: {game.bestScore}</div>
      </div>
      <div className="pill">Сегодня: {game.todayScore}</div>
    </div>
    <div className="hub-progress">
      <ProgressLine value={game.progress || 0} />
      <button className="ghost">Играть</button>
    </div>
  </div>
);

const AchievementsRail = ({ achievements = [] }) => (
  <div className="achievements-rail">
    {achievements.map((ach) => (
      <div key={ach.id} className="badge-card" title={ach.label}>
        <span className="badge-icon">{ach.icon}</span>
        <span className="badge-title">{ach.label}</span>
      </div>
    ))}
  </div>
);

const MiniChart = ({ title, data = [], color }) => (
  <div className="mini-chart">
    <div className="mini-chart-title">{title}</div>
    <div className="mini-chart-graph">
      {data.map((value, idx) => (
        <div key={idx} className="mini-bar" style={{ height: `${value}%`, background: color }} />
      ))}
    </div>
  </div>
);

const TracksSection = ({ progress, navigate }) => (
  <div className="card tracks-card">
    <div className="card-header">Твои треки</div>
    <p className="meta">Минималистичные карточки как в Linear: выбери и продолжи свой путь.</p>
    <div className="tracks-grid">
      {learningPaths.slice(0, 3).map((path) => (
        <TrackCard
          key={path.id}
          path={path}
          progress={getPathProgress(path, progress?.completedMaterialIds)}
          onOpen={() => navigate(`/library/paths/${path.slug}`)}
        />
      ))}
    </div>
  </div>
);

const relativeLabel = (dateString) => {
  if (!dateString) return "Недавно";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "Недавно";
  const today = new Date();
  const diff = Math.floor((today - date) / (1000 * 60 * 60 * 24));
  if (diff <= 0) return "Сегодня";
  if (diff === 1) return "Вчера";
  return `${diff} дн. назад`;
};

const ActivityCard = ({ activityLog = [] }) => (
  <div className="card activity-card">
    <div className="card-header">История активности</div>
    {activityLog.length === 0 && <p className="meta">Пока нет событий — открой материалы, тесты или сообщество.</p>}
    <div className="activity-list">
      {activityLog.slice(0, 7).map((item) => {
        const type = item.type || "";
        const icon =
          type === "testCompleted"
            ? "🧠"
            : type === "materialCompleted"
            ? "📘"
            : type === "memoryEntryCreated"
            ? "📓"
            : type === "communityAction"
            ? "🤝"
            : type === "missionCompleted"
            ? "🏁"
            : type === "mindgameCompleted"
            ? "🎮"
            : "✨";
        const readableType =
          type === "testCompleted"
            ? "тест"
            : type === "materialCompleted"
            ? "материал"
            : type === "memoryEntryCreated"
            ? "память"
            : type === "communityAction"
            ? "сообщество"
            : type === "missionCompleted"
            ? "миссия"
            : type === "mindgameCompleted"
            ? "mindgame"
            : item.type || "действие";
        return (
          <div key={item.id} className="activity-item">
            <div className="activity-icon">{icon}</div>
            <div>
              <div className="activity-title">{item.title}</div>
              <div className="meta subtle">{relativeLabel(item.createdAt)} · {readableType}</div>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

const RulesCard = () => {
  const xp = getXPConfig();
  const rules = [
    { label: "Завершён материал", value: `+${xp.materialCompleted} XP` },
    { label: "Пройден тест", value: `+${xp.testCompleted} XP` },
    { label: "Ответ в сообществе", value: `+${xp.communityAnswer} XP` },
    { label: "Лучший ответ дня", value: `+${xp.communityBestAnswer} XP` },
    { label: "Дневная цель", value: `+${xp.dailyGoal} XP` },
    { label: "Недельная цель", value: `+${xp.weeklyGoal} XP` },
  ];
  return (
    <div className="card rules-card">
      <div className="card-header">За что дают очки</div>
      <div className="rules-list">
        {rules.map((rule) => (
          <div key={rule.label} className="rule-row">
            <div className="rule-icon">★</div>
            <div className="rule-body">
              <div className="rule-label">{rule.label}</div>
              <div className="meta">{rule.value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const LeagueSnippet = ({ community, currentUserName }) => {
  const sorted = useMemo(() => [...community].sort((a, b) => b.points - a.points), [community]);
  const top = sorted.slice(0, 4);
  const myIndex = sorted.findIndex((u) => u.name === currentUserName);
  return (
    <div className="card league-card">
      <div className="card-header">Твоя роль в лиге</div>
      <p className="meta">Кто сейчас в топе по активности.</p>
      <div className="league-list">
        {top.map((u, idx) => (
          <div key={u.id || u.name} className="league-row">
            <span className="league-place">{idx + 1}</span>
            <div className="avatar small">{u.name[0]}</div>
            <div className="league-meta">
              <div className="league-name">{u.name}</div>
              <div className="meta">{u.points} XP · {u.status}</div>
            </div>
          </div>
        ))}
      </div>
      {myIndex >= 0 && <div className="meta subtle">Ты на {myIndex + 1}-м месте в своей лиге.</div>}
      <Link to="/community" className="ghost">Перейти в сообщество</Link>
    </div>
  );
};

const FAQItem = ({ question, answer, open, onToggle }) => (
  <div className={`faq-item ${open ? "open" : ""}`}>
    <button className="faq-question" onClick={onToggle}>
      <span>{question}</span>
      <span className="faq-icon">{open ? "−" : "+"}</span>
    </button>
    {open && <p className="faq-answer">{answer}</p>}
  </div>
);

const SettingsSection = ({ theme, onToggleTheme, onClose, inModal }) => {
  const [form, setForm] = useState({ current: "", next: "", confirm: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const faqItems = [
    {
      q: "Как платформа помогает развиваться?",
      a: "Мы собираем твой маршрут по целям, добавляем практические задания и даём обратную связь, чтобы прогресс был видимым.",
    },
    {
      q: "Что такое трек развития?",
      a: "Это цепочка материалов, тестов и челленджей под твои цели. Ты видишь шаги и понимаешь, зачем делаешь каждый из них.",
    },
    {
      q: "За что я получаю XP и уровни?",
      a: "XP начисляются за материалы, тесты, челленджи и участие в сообществе. Чем активнее ты, тем выше статус и уровни.",
    },
    {
      q: "Как работают streak и серия дней?",
      a: "Каждый день с активностью продлевает серию. Чем длиннее streak, тем больше бонусов и уважения в сообществе.",
    },
    {
      q: "Как попасть в топ сообщества?",
      a: "Набирай очки за полезные ответы, материалы и тесты. Топ обновляется по XP, так что регулярность решает всё.",
    },
    {
      q: "Чем платформа полезна родителям?",
      a: "Родители видят понятный план развития, отчёты по активности и уверены, что ребёнок прокачивает важные навыки.",
    },
    {
      q: "Как сменить пароль и данные профиля?",
      a: "Пароль можно обновить прямо здесь, а данные профиля редактируются в твоём аккаунте и сохраняются мгновенно.",
    },
    {
      q: "Можно ли сбросить прогресс?",
      a: "Мы сохраняем историю, но ты всегда можешь выбрать новый трек и начать проходить материалы с чистого листа.",
    },
    {
      q: "Как подключиться к сообществу и клубам?",
      a: "Открой раздел «Сообщество», присоединяйся к чатам и клубам по темам — там проходят созвоны и челленджи.",
    },
    {
      q: "К кому обратиться, если что-то не работает?",
      a: "Напиши в поддержку внутри платформы или оставь заявку в чате сообщества — ответим и поможем разобраться.",
    },
  ];
  const [openFaq, setOpenFaq] = useState([0]);

  const toggleFaq = (idx) => {
    setOpenFaq((prev) => (prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]));
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
    setSuccess("");
  };

  const submit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (form.next !== form.confirm) {
      setError("Пароли не совпадают.");
      return;
    }
    localStorage.setItem("ep_mock_password", form.next);
    setSuccess("Пароль успешно обновлён.");
    setForm({ current: "", next: "", confirm: "" });
  };

  return (
    <div className={`card settings-card ${inModal ? "modal-layout" : ""}`}>
      <div className="settings-title-row">
        <div>
          <div className="card-header">Настройки</div>
          <p className="meta">Управляй безопасностью, темой и ответами на популярные вопросы прямо в профиле.</p>
        </div>
        {onClose && (
          <button className="ghost" onClick={onClose}>
            Закрыть
          </button>
        )}
      </div>
      <div className="settings-grid">
        <div className="settings-block">
          <div className="settings-block-header">Сменить пароль</div>
          <p className="meta">Измени пароль для входа в профиль.</p>
          <form className="settings-form" onSubmit={submit}>
            <label>
              Старый пароль
              <input
                type="password"
                value={form.current}
                onChange={(e) => handleChange("current", e.target.value)}
                placeholder="Введи текущий пароль"
              />
            </label>
            <label>
              Новый пароль
              <input
                type="password"
                value={form.next}
                onChange={(e) => handleChange("next", e.target.value)}
                placeholder="Минимум 6 символов"
              />
            </label>
            <label>
              Подтверждение пароля
              <input
                type="password"
                value={form.confirm}
                onChange={(e) => handleChange("confirm", e.target.value)}
                placeholder="Повтори новый пароль"
              />
            </label>
            {error && <div className="error">{error}</div>}
            {success && <div className="success">{success}</div>}
            <button className="primary" type="submit">Сохранить</button>
          </form>
        </div>

        <div className="settings-block">
          <div className="settings-block-header">Часто задаваемые вопросы</div>
          <div className="faq-list">
            {faqItems.map((item, idx) => (
              <FAQItem
                key={item.q}
                question={item.q}
                answer={item.a}
                open={openFaq.includes(idx)}
                onToggle={() => toggleFaq(idx)}
              />
            ))}
          </div>
        </div>

        <div className="settings-block theme-block">
          <div className="settings-block-header">Тема оформления</div>
          <p className="meta">Переключай светлую и тёмную тему, как тебе удобнее.</p>
          <div className="theme-toggle-row">
            <span className="meta">Светлая</span>
            <button type="button" className={`theme-switch ${theme === "dark" ? "on" : ""}`} onClick={onToggleTheme}>
              <span className="switch-knob" />
            </button>
            <span className="meta">Тёмная</span>
          </div>
          <div className="meta subtle">Сейчас: {theme === "dark" ? "тёмная тема" : "светлая тема"}</div>
        </div>
      </div>
    </div>
  );
};

const SettingsModal = ({ open, onClose, theme, onToggleTheme }) => {
  if (!open) return null;
  return (
    <div className="modal-backdrop settings-backdrop">
      <div className="modal-card wide">
        <SettingsSection theme={theme} onToggleTheme={onToggleTheme} onClose={onClose} inModal />
      </div>
    </div>
  );
};

const ProfileDashboard = ({
  user,
  gamification,
  progress,
  streak,
  trackData,
  activityLog = [],
  streakInfo,
  activeDaysThisMonth = 0,
  community = [],
  theme,
  onToggleTheme,
  missions = missionList,
  missionProgress,
  getMissionProgress,
}) => {
  const navigate = useNavigate();
  const [avatarChoice, setAvatarChoice] = useState(() => localStorage.getItem("ep_avatar_choice") || "");
  const [showSettings, setShowSettings] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const profile = useUserProfile(user, trackData);
  const profileWithAvatar = { ...profile, avatar: avatarChoice || profile.avatar };
  const completedSet = useMemo(() => new Set(progress?.completedMaterialIds || []), [progress?.completedMaterialIds]);

  const mainTrackSteps = trackData?.generatedTrack || [];
  const nextTrackStep = useMemo(
    () => mainTrackSteps.find((s) => !completedSet.has(s.materialId)) || mainTrackSteps[0],
    [mainTrackSteps, completedSet]
  );
  const doneMainSteps = mainTrackSteps.filter((s) => completedSet.has(s.materialId)).length;
  const trackProgressLabel = mainTrackSteps.length
    ? `${doneMainSteps} из ${mainTrackSteps.length} шагов`
    : "Трек ещё не собран";

  const missionStats = useMemo(() => {
    const statuses = (missions || []).map((mission) => {
      const progressEntry = getMissionProgress ? getMissionProgress(mission.id) : missionProgress?.[mission.id];
      return progressEntry || {};
    });
    return {
      completed: statuses.filter((s) => s.status === "completed").length,
      active: statuses.filter((s) => s.status === "inProgress" || s.status === "in_progress").length,
    };
  }, [missions, missionProgress, getMissionProgress]);

  const goalsSummary = useMemo(() => {
    const dailyGoals = gamification.goals?.filter((g) => g.type === "daily") || [];
    const weeklyGoals = gamification.goals?.filter((g) => g.type === "weekly") || [];
    const completedDaily = dailyGoals.filter((g) => g.completed).length;
    const completedWeekly = weeklyGoals.filter((g) => g.completed).length;
    return {
      daily: `${completedDaily}/${dailyGoals.length || 0}`,
      weekly: `${completedWeekly}/${weeklyGoals.length || 0}`,
    };
  }, [gamification.goals]);

  const dailyGoals = gamification.goals?.filter((g) => g.type === "daily") || [];
  const habitsCompleted = dailyGoals.filter((g) => g.completed).length;
  const levelInfo = getLevelFromXP(gamification.totalPoints);
  const roleLabel = getRoleFromLevel(levelInfo.level);
  const xpToday = gamification.dailyXp || gamification.xpToday || Math.min(140, Math.max(20, gamification.totalPoints % 180));
  const xpTarget = gamification.dailyXpTarget || 160;
  const streakCount = streak?.count || gamification.streakCount || 0;
  const progressSummary = `${trackProgressLabel} · Цели сегодня: ${habitsCompleted}/${dailyGoals.length || 0}`;

  const missionCards = useMemo(() => {
    return missions.slice(0, 3).map((mission) => {
      const state = getMissionProgress ? getMissionProgress(mission.id) : missionProgress?.[mission.id];
      const status = state?.status === "completed" ? "completed" : state?.status ? "in-progress" : "started";
      return { ...mission, status };
    });
  }, [missions, missionProgress, getMissionProgress]);

  const recommendations = useMemo(() => materials.slice(0, 4), []);
  const miniGames = useMemo(
    () => [
      { id: "mindgame-speed", title: "MindGame: Скорость", bestScore: "1240", todayScore: "540", progress: 68 },
      { id: "focus-lab", title: "Фокус-лаборатория", bestScore: "980", todayScore: "420", progress: 52 },
    ],
    []
  );

  const achievementBadges = useMemo(() => {
    const badgeMap = {
      "first-test": { label: "Первый тест", icon: "🧠" },
      "tests-3": { label: "3 теста", icon: "🎯" },
      "materials-5": { label: "5 материалов", icon: "📘" },
      "points-100": { label: "100 XP", icon: "⚡" },
      "points-300": { label: "300 XP", icon: "🚀" },
      "community-first-post": { label: "Первый пост", icon: "🤝" },
    };
    return (gamification.achievements || []).map((id) => ({ id, ...badgeMap[id], icon: badgeMap[id]?.icon || "✨", label: badgeMap[id]?.label || id }));
  }, [gamification.achievements]);

  const trends = useMemo(() => {
    const seed = gamification.totalPoints || 1;
    const base = [50, 62, 48, 74, 80, 68, 90].map((v, idx) => Math.min(100, Math.max(18, v + ((seed + idx * 13) % 15) - 7)));
    const habits = dailyGoals.length
      ? dailyGoals.map((goal, idx) => Math.min(100, Math.round(((goal.progress || (goal.completed ? goal.target : goal.progress || 0)) / (goal.target || 1)) * 100) || 0)).concat(
          Array(Math.max(0, 7 - dailyGoals.length)).fill(40)
        )
      : [35, 40, 48, 52, 60, 64, 72];
    const missionsTrend = [30, 44, 36, 52, 66, 58, 74];
    return { xp: base.slice(0, 7), habits: habits.slice(0, 7), missions: missionsTrend };
  }, [gamification.totalPoints, dailyGoals]);

  const monthLabel = useMemo(() => {
    const now = new Date();
    return now.toLocaleDateString("ru-RU", { month: "long", year: "numeric" });
  }, []);

  const handleNextAction = () => {
    if (nextTrackStep) {
      const materialType = nextTrackStep.materialType || materials.find((m) => m.id === nextTrackStep.materialId)?.type || "material";
      navigate(`/library/${materialType}/${nextTrackStep.materialId}`);
      return;
    }
    navigate("/missions");
  };

  const handleAvatarSelect = (icon) => {
    setAvatarChoice(icon);
    localStorage.setItem("ep_avatar_choice", icon);
    setShowAvatarModal(false);
  };

  if (!user) {
    return (
      <div className="page profile-dashboard new-profile">
        <div className="card">
          <div className="card-header">Профиль доступен после входа</div>
          <p className="meta">Авторизуйся, чтобы увидеть свой прогресс, XP и достижения.</p>
          <Link to="/auth" className="primary">Перейти к авторизации</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page profile-dashboard new-profile">
      <HeroCard
        profile={profileWithAvatar}
        levelInfo={levelInfo}
        roleLabel={roleLabel}
        streak={streak}
        gamification={gamification}
        onAvatarClick={() => setShowAvatarModal(true)}
        progressSummary={progressSummary}
        progressContent={
          <ProgressRings
            xpToday={xpToday}
            xpTarget={xpTarget}
            streakCount={streakCount}
            streakTarget={21}
            habitsCompleted={habitsCompleted}
            habitsTotal={dailyGoals.length || 3}
          />
        }
      />

      <div className="growth-hub">
        <div className="section-heading">
          <div>
            <div className="section-kicker">Твоя панель развития</div>
            <h2>Персональный хаб, как в Spotify</h2>
            <p className="meta">Миссии недели, рекомендации, мини-игры и достижения в одном месте.</p>
          </div>
          <div className="ghost-group">
            <button className="ghost" onClick={handleNextAction}>Продолжить трек</button>
            <button className="ghost" onClick={() => navigate("/missions")}>Все миссии</button>
          </div>
        </div>

        <div className="hub-grid three">
          {missionCards.map((mission) => (
            <MissionPlaylistCard
              key={mission.id}
              mission={mission}
              status={mission.status}
              onOpen={() => navigate(`/missions/${mission.id || ""}`)}
            />
          ))}
        </div>

        <div className="hub-grid recommendations">
          {recommendations.map((material) => (
            <RecommendationCard
              key={material.id}
              material={material}
              onOpen={() => navigate(`/library/${material.type}/${material.id}`)}
            />
          ))}
        </div>

        <div className="hub-grid mini-games">
          {miniGames.map((game) => (
            <MiniGameCard key={game.id} game={game} onOpen={() => navigate("/memory")} />
          ))}
        </div>

        <div className="achievements-block">
          <div className="section-subheader">
            <div className="section-kicker">История достижений</div>
            <p className="meta">Мини-бейджи, которые ты уже забрал. Продолжай собирать серию.</p>
          </div>
          <AchievementsRail achievements={achievementBadges} />
        </div>
      </div>

      <div className="progress-charts">
        <div className="section-heading compact">
          <div>
            <div className="section-kicker">Твой прогресс</div>
            <h3>Стиль Strava: XP, привычки, миссии за 7 дней</h3>
          </div>
          <button className="ghost" onClick={() => navigate("/activity")}>Детальный отчёт</button>
        </div>
        <div className="chart-grid">
          <MiniChart title="XP последние 7 дней" data={trends.xp} color="linear-gradient(135deg, #a855f7, #7c3aed)" />
          <MiniChart title="Привычки за день" data={trends.habits} color="linear-gradient(135deg, #bef264, #22c55e)" />
          <MiniChart title="Активность по миссиям" data={trends.missions} color="linear-gradient(135deg, #22d3ee, #6366f1)" />
        </div>
      </div>

      <TracksSection progress={progress} navigate={navigate} />

      <div className="insights-row">
        <ActiveDaysCard
          activeDays={activeDaysThisMonth}
          monthLabel={monthLabel}
          streakCurrent={streakInfo?.current || 0}
          streakBest={streakInfo?.best || 0}
        />
        <MissionsCard completed={missionStats.completed} active={missionStats.active} />
        <MaterialsCard
          materialsCompleted={gamification.completedMaterialsCount || 0}
          testsCompleted={gamification.completedTestsCount || 0}
        />
      </div>

      <div className="profile-columns">
        <div className="profile-main">
          <div className="card summary-card">
            <div className="card-header">Короткий обзор</div>
            <div className="summary-grid">
              <div className="summary-item">
                <div className="meta subtle">Трек</div>
                <div className="summary-value">{trackProgressLabel}</div>
                <div className="meta">Шаги из твоего маршрута</div>
              </div>
              <div className="summary-item">
                <div className="meta subtle">Миссии</div>
                <div className="summary-value">{missionStats.completed} выполнено</div>
                <div className="meta">Активных: {missionStats.active}</div>
              </div>
              <div className="summary-item">
                <div className="meta subtle">Цели</div>
                <div className="summary-value">День: {goalsSummary.daily}</div>
                <div className="meta">Неделя: {goalsSummary.weekly}</div>
              </div>
            </div>
            <div className="summary-actions">
              <button className="primary" onClick={() => navigate("/missions")}>Перейти в миссии</button>
              <button className="ghost" onClick={() => navigate("/library")}>Открыть библиотеку</button>
            </div>
          </div>

          <ActivityCard activityLog={activityLog} />
        </div>

        <div className="profile-side">
          <XPCard gamification={gamification} levelInfo={levelInfo} roleLabel={roleLabel} streak={streak} />
          <LeagueSnippet community={community} currentUserName={profileWithAvatar.name} />
          <HabitProfileWidget />
          <div className="card">
            <div className="card-header">Быстрые действия</div>
            <div className="quick-actions">
              <button className="ghost" onClick={() => navigate("/missions")}>Миссии и проекты</button>
              <button className="ghost" onClick={() => navigate("/community")}>Сообщество</button>
              <button className="ghost" onClick={() => navigate("/memory")}>Память</button>
              <button className="ghost" onClick={() => navigate("/library")}>Библиотека</button>
            </div>
          </div>
          <div className="card settings-entry">
            <div>
              <div className="card-header">Настройки</div>
              <p className="meta">Тема, пароль, FAQ и выход — в отдельном чистом экране.</p>
            </div>
            <button className="primary" onClick={() => setShowSettings(true)}>
              Открыть настройки
            </button>
          </div>
        </div>
      </div>

      <SettingsModal open={showSettings} onClose={() => setShowSettings(false)} theme={theme} onToggleTheme={onToggleTheme} />
      <AvatarSelectorModal
        open={showAvatarModal}
        currentAvatar={profileWithAvatar.avatar}
        onClose={() => setShowAvatarModal(false)}
        onSelect={handleAvatarSelect}
      />
    </div>
  );
};

export default ProfileDashboard;
