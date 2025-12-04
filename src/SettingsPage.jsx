import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "./routerShim";

// Настройки сохраняем в localStorage для фронтового превью.
// TODO: заменить на синхронизацию с бэкендом профиля.
const loadLocalJSON = (key, fallback) => {
  if (typeof localStorage === "undefined") return fallback;
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch (error) {
    console.warn("Не удалось прочитать настройки", error);
    return fallback;
  }
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

const SettingToggle = ({ label, description, checked, onChange }) => (
  <div className="preference-row">
    <div className="preference-text">
      <div className="preference-label">{label}</div>
      {description && <p className="meta subtle">{description}</p>}
    </div>
    <label className="switch">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="slider" />
    </label>
  </div>
);

const accentOptions = [
  { id: "purple", label: "Фиолетовый", value: "#7c3aed" },
  { id: "indigo", label: "Сине-фиолетовый", value: "#6366f1" },
  { id: "blue", label: "Холодный синий", value: "#2563eb" },
  { id: "teal", label: "Бирюзовый", value: "#0ea5e9" },
  { id: "emerald", label: "Зелёный", value: "#10b981" },
];

const themeOptions = [
  { id: "dark", label: "Тёмная" },
  { id: "light", label: "Светлая" },
  { id: "system", label: "Авто (скоро)", disabled: true },
];

const focusOptions = [
  { id: "missions", label: "Миссии и проекты" },
  { id: "mindgames", label: "MindGames" },
  { id: "habits", label: "Трекер привычек" },
  { id: "library", label: "Библиотека" },
];

const SettingsPage = ({ theme, setTheme }) => {
  const navigate = useNavigate();
  const [passwordForm, setPasswordForm] = useState({ current: "", next: "", confirm: "" });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  const [appearance, setAppearance] = useState(() =>
    loadLocalJSON("ep_appearance", { accent: "purple", reduceMotion: false })
  );
  const [personalization, setPersonalization] = useState(() =>
    loadLocalJSON("ep_personalization", {
      focus: "missions",
      missionReminder: true,
      habitReminder: true,
    })
  );
  const [privacy, setPrivacy] = useState(() =>
    loadLocalJSON("ep_privacy", { leaderboard: true, achievements: true, invites: true })
  );

  const accentChoice = useMemo(
    () => accentOptions.find((option) => option.id === appearance.accent) || accentOptions[0],
    [appearance.accent]
  );

  const faqItems = useMemo(
    () => [
      {
        q: "Как платформа помогает развиваться?",
        a: "Мы собираем твой маршрут по целям, добавляем практические задания и даём обратную связь, чтобы прогресс был видимым.",
      },
      {
        q: "Что такое трек развития?",
        a: "Это цепочка материалов, тестов и челленджей под твои цели. Ты видишь шаги и понимаешь, зачем делаешь каждый из них.",
      },
      {
        q: "Как работают streak и серия дней?",
        a: "Каждый день с активностью продлевает серию. Чем длиннее streak, тем больше бонусов и уважения в сообществе.",
      },
      {
        q: "Как сменить пароль и данные профиля?",
        a: "Пароль можно обновить здесь, а данные профиля редактируются в аккаунте и сохраняются мгновенно.",
      },
      {
        q: "К кому обратиться, если что-то не работает?",
        a: "Напиши в поддержку или в чат сообщества — ответим и поможем разобраться.",
      },
    ],
    []
  );

  const [openFaq, setOpenFaq] = useState([0]);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.style.setProperty("--accent", accentChoice.value);
      document.body.dataset.reduceMotion = appearance.reduceMotion ? "on" : "off";
    }
    localStorage.setItem("ep_appearance", JSON.stringify(appearance));
  }, [appearance, accentChoice]);

  useEffect(() => {
    localStorage.setItem("ep_personalization", JSON.stringify(personalization));
  }, [personalization]);

  useEffect(() => {
    localStorage.setItem("ep_privacy", JSON.stringify(privacy));
  }, [privacy]);

  const handlePasswordChange = (field, value) => {
    setPasswordForm((prev) => ({ ...prev, [field]: value }));
    setPasswordError("");
    setPasswordSuccess("");
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (passwordForm.next.length < 6) {
      setPasswordError("Новый пароль должен быть не короче 6 символов.");
      return;
    }

    if (passwordForm.next !== passwordForm.confirm) {
      setPasswordError("Пароли не совпадают.");
      return;
    }

    localStorage.setItem("ep_mock_password", passwordForm.next);
    setPasswordSuccess("Пароль успешно обновлён");
    setPasswordForm({ current: "", next: "", confirm: "" });
  };

  const handleThemeSelect = (option) => {
    if (option.disabled) return;
    setTheme(option.id);
    // TODO: добавить автоопределение темы при support "system".
  };

  const handleAccentSelect = (option) => {
    setAppearance((prev) => ({ ...prev, accent: option.id }));
  };

  const handleReduceMotionToggle = (value) => {
    setAppearance((prev) => ({ ...prev, reduceMotion: value }));
  };

  const handleFocusChange = (id) => {
    setPersonalization((prev) => ({ ...prev, focus: id }));
  };

  const handleReminderToggle = (key, value) => {
    setPersonalization((prev) => ({ ...prev, [key]: value }));
  };

  const handlePrivacyToggle = (key, value) => {
    setPrivacy((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="page settings-page">
      <div className="settings-page-header">
        <button className="ghost back-link" onClick={() => navigate("/profile")}>← Назад в профиль</button>
        <div>
          <h1 className="page-title">Настройки профиля</h1>
          <p className="meta large">Управляй аккаунтом, внешним видом и персонализацией платформы.</p>
        </div>
      </div>

      <div className="settings-stack">
        <section className="card settings-panel">
          <div className="panel-header">
            <div>
              <div className="panel-title">Аккаунт и безопасность</div>
              <p className="meta">Данные входа</p>
            </div>
          </div>
          <form className="settings-form wide" onSubmit={handlePasswordSubmit}>
            <label>
              Старый пароль
              <input
                type="password"
                value={passwordForm.current}
                onChange={(e) => handlePasswordChange("current", e.target.value)}
                placeholder="Введи текущий пароль"
              />
            </label>
            <label>
              Новый пароль
              <input
                type="password"
                value={passwordForm.next}
                onChange={(e) => handlePasswordChange("next", e.target.value)}
                placeholder="Минимум 6 символов"
              />
            </label>
            <label>
              Подтверждение пароля
              <input
                type="password"
                value={passwordForm.confirm}
                onChange={(e) => handlePasswordChange("confirm", e.target.value)}
                placeholder="Повтори новый пароль"
              />
            </label>
            {passwordError && <div className="error">{passwordError}</div>}
            {passwordSuccess && <div className="success">{passwordSuccess}</div>}
            <button className="primary" type="submit">
              Сохранить пароль
            </button>
          </form>
          <p className="meta subtle">
            Пароль обновляется локально для прототипа. TODO: подключить реальное обновление на backend.
          </p>
        </section>

        <section className="card settings-panel">
          <div className="panel-header">
            <div>
              <div className="panel-title">Внешний вид и стиль</div>
              <p className="meta">Внешний вид платформы</p>
            </div>
          </div>
          <div className="theme-options">
            {themeOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                className={`theme-option ${theme === option.id ? "active" : ""} ${option.disabled ? "disabled" : ""}`}
                onClick={() => handleThemeSelect(option)}
              >
                <div className="theme-option-title">{option.label}</div>
                {option.disabled && <div className="meta subtle">TODO: подключить авто по системе</div>}
              </button>
            ))}
          </div>
          <div className="accent-grid">
            {accentOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                className={`accent-chip ${accentChoice.id === option.id ? "active" : ""}`}
                onClick={() => handleAccentSelect(option)}
              >
                <span className="accent-dot" style={{ backgroundColor: option.value }} />
                {option.label}
              </button>
            ))}
          </div>
          <SettingToggle
            label="Минимум анимаций"
            description="Рекомендуется, если отвлекают движения интерфейса."
            checked={appearance.reduceMotion}
            onChange={handleReduceMotionToggle}
          />
          <p className="meta subtle">
            Выбор темы и цвета сохраняется на устройстве (localStorage). TODO: синхронизировать с аккаунтом.
          </p>
        </section>

        <section className="card settings-panel">
          <div className="panel-header">
            <div>
              <div className="panel-title">Персонализация развития</div>
              <p className="meta">Как ты хочешь использовать платформу</p>
            </div>
          </div>
          <div className="focus-grid">
            {focusOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                className={`focus-chip ${personalization.focus === option.id ? "active" : ""}`}
                onClick={() => handleFocusChange(option.id)}
              >
                {option.label}
              </button>
            ))}
          </div>
          <div className="preference-list">
            <SettingToggle
              label="Напоминать о дневной миссии"
              description="Флаг для будущих пушей/писем с напоминаниями."
              checked={personalization.missionReminder}
              onChange={(value) => handleReminderToggle("missionReminder", value)}
            />
            <SettingToggle
              label="Напоминать о трекере привычек"
              description="Напомнить обновить прогресс и привычки."
              checked={personalization.habitReminder}
              onChange={(value) => handleReminderToggle("habitReminder", value)}
            />
          </div>
          <p className="meta subtle">Все значения пока хранятся локально. TODO: отправить выбор на backend.</p>
        </section>

        <section className="card settings-panel">
          <div className="panel-header">
            <div>
              <div className="panel-title">Приватность и социальные настройки</div>
              <p className="meta">Видимость и взаимодействие</p>
            </div>
          </div>
          <div className="preference-list">
            <SettingToggle
              label="Показывать меня в рейтинге и таблице лидеров"
              description="Имя и XP будут видны другим участникам в рейтингах."
              checked={privacy.leaderboard}
              onChange={(value) => handlePrivacyToggle("leaderboard", value)}
            />
            <SettingToggle
              label="Показывать мои достижения другим участникам"
              description="Публикуем бейджи и прогресс в профиле."
              checked={privacy.achievements}
              onChange={(value) => handlePrivacyToggle("achievements", value)}
            />
            <SettingToggle
              label="Разрешать приглашать меня в челленджи и клубы"
              description="Участники могут звать тебя в совместные активности."
              checked={privacy.invites}
              onChange={(value) => handlePrivacyToggle("invites", value)}
            />
          </div>
          <p className="meta subtle">TODO: привязать социальные флаги к профилю пользователя на backend.</p>
        </section>

        <section className="card settings-panel faq-panel">
          <div className="panel-header">
            <div>
              <div className="panel-title">Помощь и данные</div>
              <p className="meta">Поддержка и данные</p>
            </div>
          </div>
          <div className="help-links">
            <button type="button" className="ghost link-row">
              <span>Как работает трек развития?</span>
              <span className="meta subtle">Откроем подробный разбор твоего маршрута</span>
            </button>
            <button type="button" className="ghost link-row">
              <span>Как сбросить прогресс?</span>
              <span className="meta subtle">TODO: добавить подтверждение перед сбросом</span>
            </button>
            <button type="button" className="ghost link-row">
              <span>Как связаться с поддержкой?</span>
              <span className="meta subtle">TODO: добавить реальный контакт (почта/чат)</span>
            </button>
          </div>
          <div className="faq-list tall">
            {faqItems.map((item, idx) => (
              <FAQItem
                key={item.q}
                question={item.q}
                answer={item.a}
                open={openFaq.includes(idx)}
                onToggle={() =>
                  setOpenFaq((prev) => (prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]))
                }
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default SettingsPage;
