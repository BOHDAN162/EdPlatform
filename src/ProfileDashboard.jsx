import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "./routerShim";
import useUserProfile from "./useUserProfile";
import { getLevelFromXP, getRoleFromLevel, getXPConfig } from "./gamification";
import { getMaterialById, learningPaths, materials, themeLabels } from "./libraryData";
import { getPathProgress } from "./progress";
import { missions, getMissionProgress } from "./missionsData";

const ProgressLine = ({ value }) => (
  <div className="progress-shell">
    <div className="progress-fill" style={{ width: `${Math.min(100, value)}%` }} />
  </div>
);

const HeroCard = ({ profile, levelInfo, roleLabel, streak, gamification }) => (
  <div className="card profile-hero modern">
    <div className="hero-main">
      <div className="avatar huge gradient">{profile.avatar}</div>
      <div>
        <div className="hero-name">{profile.name}</div>
        <div className="meta">{profile.role}</div>
        <div className="meta subtle">Уровень {levelInfo.level} · роль: {roleLabel}</div>
      </div>
    </div>
    <div className="hero-stats">
      <div className="stat-block">
        <div className="stat-top">
          <span className="pill outline">XP</span>
          <span className="meta">{gamification.totalPoints} XP</span>
        </div>
        <ProgressLine value={levelInfo.progress} />
        <div className="meta">До следующего уровня: {levelInfo.toNext} XP</div>
      </div>
      <div className="stat-chips">
        <div className={`chip streak ${streak?.count >= 3 ? "hot" : ""}`}>
          🔥 Серия: {streak?.count || 0} дней
        </div>
        <div className="chip">Материалы: {gamification.completedMaterialsCount || 0}</div>
        <div className="chip">Тесты: {gamification.completedTestsCount || 0}</div>
      </div>
    </div>
  </div>
);

const NextStepCard = ({ material, onStart, onFallback, doneCount, totalSteps }) => {
  const remaining = Math.max((totalSteps || 0) - doneCount, 0);
  return (
    <div className="card focus next-step">
      <div className="card-header">Твой следующий шаг</div>
      <p className="meta">
        Мы выбрали действие, которое лучше всего продвинет тебя вперёд сегодня. Открой и сделай его прямо сейчас.
      </p>
    {material ? (
      <div className="next-step-body">
        <div>
          <div className="pill filled">{material.type === "test" ? "Тест" : material.type === "article" ? "Статья" : "Курс"}</div>
          <h3>{material.title}</h3>
          <p className="meta">{material.description || "Материал из твоего трека"}</p>
          <div className="meta subtle">~ {material.estimatedTime || "15 минут"} · {material.level || "базовый"}</div>
        </div>
        <div className="next-actions">
          <button className="primary large" onClick={() => onStart(material)}>Перейти к шагу</button>
          {totalSteps ? (
            <span className="meta subtle">До финиша: {remaining} шагов · всего {totalSteps}</span>
          ) : (
            <span className="meta subtle">Собери свой маршрут в опросе трека</span>
          )}
        </div>
      </div>
    ) : (
      <div className="next-step-body">
        <div>
          <h3>Основной трек завершён!</h3>
          <p className="meta">Выбери новые направления в библиотеке или собери другой трек.</p>
        </div>
        <div className="next-actions">
          <button className="primary large" onClick={onFallback}>Посмотреть новые треки</button>
        </div>
      </div>
    )}
  </div>
  );
};

const MainTrackCard = ({ steps, completedSet, onOpenMaterial }) => {
  const doneCount = steps.filter((s) => completedSet.has(s.materialId)).length;
  const ratio = steps.length ? Math.round((doneCount / steps.length) * 100) : 0;
  return (
    <div className="card main-track path-card">
      <div className="card-header">Основной трек</div>
      {steps.length ? (
        <>
          <p className="meta">Прогресс: {doneCount} из {steps.length} · {ratio}%</p>
          <div className="track-path">
            {steps.map((step, idx) => {
              const done = completedSet.has(step.materialId);
              const active = !done && idx === doneCount;
              return (
                <button
                  key={step.id}
                  className={`path-node ${done ? "done" : ""} ${active ? "active" : ""}`}
                  onClick={() => onOpenMaterial(step.materialId, step.materialType)}
                >
                  <span className="path-index">{done ? "✓" : idx + 1}</span>
                  <span className="path-title">{step.title}</span>
                </button>
              );
            })}
          </div>
        </>
      ) : (
        <div className="empty">Пока нет трека. Создай его через опрос.</div>
      )}
    </div>
  );
};

const PathPreviewCard = ({ path, progress, onOpen }) => {
  const theme = themeLabels[path.theme] || { accent: "#7c3aed", title: path.theme };
  const ratio = progress.totalCount ? Math.round((progress.completedCount / progress.totalCount) * 100) : 0;
  const status =
    progress.completedCount === 0
      ? "Не начат"
      : progress.completedCount === progress.totalCount
      ? "Завершён"
      : "В процессе";
  return (
    <div className="mini-path modern" style={{ borderColor: `${theme.accent}30` }}>
      <div className="mini-path-head">
        <div className="pill" style={{ background: `${theme.accent}18`, color: theme.accent }}>
          {theme.title}
        </div>
        <span className="meta">{status}</span>
      </div>
      <div className="mini-path-title">{path.title}</div>
      <p className="meta subtle">{path.description}</p>
      <ProgressLine value={ratio} />
      <div className="mini-path-footer">
        <span className="meta">{progress.completedCount} / {progress.totalCount} материалов</span>
        <button className="ghost" onClick={onOpen}>{progress.completedCount ? "Продолжить" : "Начать"}</button>
      </div>
    </div>
  );
};

const TracksOverview = ({ progress, navigate }) => (
  <div className="card">
    <div className="card-header">Твои треки</div>
    <p className="meta">Посмотри, какие направления продвигаются быстрее всего.</p>
    <div className="path-grid compact">
      {learningPaths.slice(0, 4).map((path) => (
        <PathPreviewCard
          key={path.id}
          path={path}
          progress={getPathProgress(path, progress?.completedMaterialIds)}
          onOpen={() => navigate(`/library/paths/${path.slug}`)}
        />
      ))}
    </div>
  </div>
);

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
  <div className="card">
    <div className="card-header">История активности</div>
    {activityLog.length === 0 && <p className="meta">Пока нет событий — открой материалы, тесты или сообщество.</p>}
    <div className="activity-list">
      {activityLog.slice(0, 7).map((item) => (
        <div key={item.id} className="activity-item">
          <div className="activity-dot" />
          <div>
            <div className="activity-title">{item.title}</div>
            <div className="meta">{relativeLabel(item.createdAt)} · {item.type || "действие"}</div>
          </div>
        </div>
      ))}
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

const SettingsSection = ({ theme, onToggleTheme }) => {
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
    <div className="card settings-card">
      <div className="card-header">Настройки</div>
      <p className="meta">Управляй безопасностью, темой и ответами на популярные вопросы прямо в профиле.</p>
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

const ProfileDashboard = ({
  user,
  gamification,
  progress,
  streak,
  trackData,
  activityLog = [],
  community = [],
  theme,
  onToggleTheme,
  missionsState,
}) => {
  const navigate = useNavigate();
  const profile = useUserProfile(user, trackData);
  const completedSet = useMemo(() => new Set(progress?.completedMaterialIds || []), [progress?.completedMaterialIds]);

  const mainTrackSteps = trackData?.generatedTrack || [];
  const doneMainSteps = mainTrackSteps.filter((s) => completedSet.has(s.materialId)).length;
  const trackProgressLabel = mainTrackSteps.length
    ? `${doneMainSteps} из ${mainTrackSteps.length} шагов`
    : "Трек ещё не собран";

  const missionStats = useMemo(() => {
    const statuses = missions.map((mission) => getMissionProgress(mission, missionsState));
    return {
      completed: statuses.filter((s) => s.status === "completed").length,
      active: statuses.filter((s) => s.status === "in_progress").length,
    };
  }, [missionsState]);

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

  const levelInfo = getLevelFromXP(gamification.totalPoints);
  const roleLabel = getRoleFromLevel(levelInfo.level);

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
      <HeroCard profile={profile} levelInfo={levelInfo} roleLabel={roleLabel} streak={streak} gamification={gamification} />

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
          <LeagueSnippet community={community} currentUserName={profile.name} />
          <div className="card">
            <div className="card-header">Быстрые действия</div>
            <div className="quick-actions">
              <button className="ghost" onClick={() => navigate("/missions")}>Миссии и проекты</button>
              <button className="ghost" onClick={() => navigate("/community")}>Сообщество</button>
              <button className="ghost" onClick={() => navigate("/library")}>Библиотека</button>
            </div>
          </div>
        </div>
      </div>

      <SettingsSection theme={theme} onToggleTheme={onToggleTheme} />
    </div>
  );
};

export default ProfileDashboard;
