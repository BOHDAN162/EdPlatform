import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "./routerShim";

// Страница настроек живёт по пути /profile/settings (см. App.jsx) и возвращает назад на /profile.
// Все пользовательские флаги сейчас сохраняются в localStorage; TODO: заменить на бэкенд-синхронизацию.
// Список опций тем и акцентных цветов редактируется ниже в accentOptions и themeOptions.

const FAQItem = ({ question, answer, open, onToggle }) => (
  <div className={`faq-item ${open ? "open" : ""}`}>
    <button className="faq-question" onClick={onToggle}>
      <span>{question}</span>
      <span className="faq-icon">{open ? "−" : "+"}</span>
    </button>
    {open && <p className="faq-answer">{answer}</p>}
  </div>
);

const PreferenceToggle = ({ label, description, checked, onChange }) => (
  <div className="preference-row">
    <div className="preference-text">
      <div className="preference-label">{label}</div>
      <p className="meta subtle">{description}</p>
    </div>
    <label className="switch">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="slider" />
    </label>
  </div>
);

const accentOptions = [
  { id: "purple", label: "Фиолетовый", value: "#7c3aed" },
  { id: "blue", label: "Синий", value: "#2563eb" },
  { id: "green", label: "Зелёный", value: "#16a34a" },
  { id: "amber", label: "Янтарный", value: "#f59e0b" },
];

const themeOptions = [
  { id: "dark", label: "Тёмная" },
  { id: "light", label: "Светлая" },
  { id: "system", label: "Авто (soon)", disabled: true },
];

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

const SettingsPage = ({ theme, setTheme }) => {
  const navigate = useNavigate();
  const [passwordForm, setPasswordForm] = useState({ current: "", next: "", confirm: "" });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  const [accentChoice, setAccentChoice] = useState(() => {
    const stored = loadLocalJSON("ep_accent", null);
    return accentOptions.find((option) => option.id === stored) || accentOptions[0];
  });

  const [preferences, setPreferences] = useState(() =>
    loadLocalJSON("ep_preferences", {
      leaderboard: true,
      reminders: true,
      tips: true,
    })
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
        q: "За что я получаю XP и уровни?",
        a: "XP начисляются за материалы, тесты, челленджи и участие в сообществе. Чем активнее ты, тем выше статус и уровни.",
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
    }
    localStorage.setItem("ep_accent", JSON.stringify(accentChoice.id));
  }, [accentChoice]);

  useEffect(() => {
    localStorage.setItem("ep_preferences", JSON.stringify(preferences));
  }, [preferences]);

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
      setPasswordError("Пароль должен быть не короче 6 символов.");
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

  const handlePreferenceToggle = (key, value) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="page settings-page">
      <div className="settings-page-header">
        <button className="ghost back-link" onClick={() => navigate("/profile")}>← Назад в профиль</button>
        <div>
          <h1 className="page-title">Настройки профиля</h1>
          <p className="meta large">Управляй своим аккаунтом, темой и видимостью.</p>
        </div>
      </div>

      <div className="settings-columns">
        <div className="settings-main">
          <section className="card settings-panel">
            <div className="panel-header">
              <div>
                <div className="panel-title">Аккаунт и пароль</div>
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
                Сохранить
              </button>
            </form>
          </section>

          <section className="card settings-panel">
            <div className="panel-header">
              <div>
                <div className="panel-title">Тема и цвет интерфейса</div>
                <p className="meta">Внешний вид</p>
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
                  onClick={() => setAccentChoice(option)}
                >
                  <span className="accent-dot" style={{ backgroundColor: option.value }} />
                  {option.label}
                </button>
              ))}
            </div>
            <p className="meta subtle">
              Выбор цвета сохраняется на устройстве (localStorage). TODO: синхронизировать с аккаунтом.
            </p>
          </section>

          <section className="card settings-panel">
            <div className="panel-header">
              <div>
                <div className="panel-title">Предпочтения и уведомления</div>
                <p className="meta">Предпочтения</p>
              </div>
            </div>
            <div className="preference-list">
              <PreferenceToggle
                label="Показывать меня в рейтинге и таблицах лидеров"
                description="Твоё имя видно в лигах, XP и таблицах лидеров."
                checked={preferences.leaderboard}
                onChange={(value) => handlePreferenceToggle("leaderboard", value)}
              />
              <PreferenceToggle
                label="Напоминать о миссиях и треке"
                description="Получать дружелюбные напоминания о материалах и челленджах."
                checked={preferences.reminders}
                onChange={(value) => handlePreferenceToggle("reminders", value)}
              />
              <PreferenceToggle
                label="Показывать подсказки и обучающие всплывашки"
                description="Включить короткие подсказки по интерфейсу и онбордингу."
                checked={preferences.tips}
                onChange={(value) => handlePreferenceToggle("tips", value)}
              />
            </div>
            <p className="meta subtle">TODO: привязать эти переключатели к профилю пользователя на backend.</p>
          </section>
        </div>

        <aside className="settings-aside">
          <div className="card settings-panel faq-panel">
            <div className="panel-header">
              <div>
                <div className="panel-title">FAQ / Помощь</div>
                <p className="meta">Ответы на частые вопросы</p>
              </div>
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
          </div>
        </aside>
      </div>
    </div>
  );
};

export default SettingsPage;
