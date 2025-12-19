import React, { useEffect, useMemo, useState } from "react";
import { Link } from "./routerShim";

const STORAGE_KEYS = {
  appearance: "ep_appearance",
  account: "ep_account_settings",
  notifications: "ep_notifications",
  avatar: "ep_avatar_upload",
};

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

const SettingToggle = ({ label, description, checked, onChange }) => (
  <label className="preference-row">
    <div className="preference-text">
      <div className="preference-label">{label}</div>
      {description && <p className="meta subtle">{description}</p>}
    </div>
    <div className="switch">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="slider" />
    </div>
  </label>
);

const SectionCard = ({ title, subtitle, children, footer }) => (
  <section className="card settings-panel modern">
    <div className="panel-header">
      <div>
        <div className="panel-title">{title}</div>
        {subtitle && <p className="meta">{subtitle}</p>}
      </div>
    </div>
    <div className="space-y-4">{children}</div>
    {footer}
  </section>
);

const accentOptions = [
  { id: "purple", label: "Фиолетовый", value: "#8A3FFC" },
  { id: "indigo", label: "Индиго", value: "#6366f1" },
  { id: "emerald", label: "Изумрудный", value: "#10b981" },
  { id: "orange", label: "Апельсин", value: "#f59e0b" },
];

const fontOptions = [
  { id: "normal", label: "Обычный размер" },
  { id: "large", label: "Крупнее", hint: "+2px" },
];

const tabList = [
  { id: "appearance", label: "Оформление" },
  { id: "account", label: "Данные" },
  { id: "notifications", label: "Уведомления" },
  { id: "security", label: "Безопасность" },
  { id: "about", label: "О сервисе" },
];

const SettingsPage = ({ theme, setTheme, user, onUserUpdate, onLogout }) => {
  const initialAccount = useMemo(
    () =>
      loadLocalJSON(STORAGE_KEYS.account, {
        name: user?.name || "Твое имя",
        email: user?.email || "you@noesis.app",
        username: user?.username || "noesis-user",
      }),
    [user]
  );

  const [activeTab, setActiveTab] = useState("appearance");
  const [appearance, setAppearance] = useState(() =>
    loadLocalJSON(STORAGE_KEYS.appearance, { accent: "purple", reduceMotion: false, fontSize: "normal" })
  );
  const [account, setAccount] = useState(initialAccount);
  const [notifications, setNotifications] = useState(() =>
    loadLocalJSON(STORAGE_KEYS.notifications, {
      assignments: true,
      streak: true,
      comments: true,
      newMaterials: true,
      push: true,
      email: true,
    })
  );
  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" });
  const [avatarPreview, setAvatarPreview] = useState(() => localStorage.getItem(STORAGE_KEYS.avatar) || "");
  const [feedback, setFeedback] = useState({ appearance: "", account: "", notifications: "", security: "" });
  const [errors, setErrors] = useState({ avatar: "", password: "" });

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.style.setProperty("--accent", accentOptions.find((o) => o.id === appearance.accent)?.value || "#8A3FFC");
      document.body.dataset.reduceMotion = appearance.reduceMotion ? "on" : "off";
      document.body.dataset.fontScale = appearance.fontSize;
    }
    localStorage.setItem(STORAGE_KEYS.appearance, JSON.stringify(appearance));
  }, [appearance]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.account, JSON.stringify(account));
  }, [account]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.notifications, JSON.stringify(notifications));
  }, [notifications]);

  const handleAccentSelect = (id) => {
    setAppearance((prev) => ({ ...prev, accent: id }));
    setFeedback((prev) => ({ ...prev, appearance: "Цвет акцента сохранён" }));
  };

  const handleFontSelect = (id) => {
    setAppearance((prev) => ({ ...prev, fontSize: id }));
    setFeedback((prev) => ({ ...prev, appearance: "Размер шрифта применён" }));
  };

  const handleAvatarUpload = (file) => {
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, avatar: "Размер файла должен быть до 2 МБ" }));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const preview = reader.result;
      setAvatarPreview(preview);
      localStorage.setItem(STORAGE_KEYS.avatar, preview);
      setErrors((prev) => ({ ...prev, avatar: "" }));
      setFeedback((prev) => ({ ...prev, account: "Аватар обновлён" }));
      if (onUserUpdate) {
        onUserUpdate({ ...(user || {}), avatar: preview });
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwords.next.length < 6) {
      setErrors((prev) => ({ ...prev, password: "Новый пароль должен быть длиннее 6 символов" }));
      return;
    }
    if (passwords.next !== passwords.confirm) {
      setErrors((prev) => ({ ...prev, password: "Пароли не совпадают" }));
      return;
    }
    setErrors((prev) => ({ ...prev, password: "" }));
    setPasswords({ current: "", next: "", confirm: "" });
    setFeedback((prev) => ({ ...prev, security: "Пароль обновлён" }));
  };

  const handleAccountSave = () => {
    setFeedback((prev) => ({ ...prev, account: "Данные сохранены" }));
    if (onUserUpdate) {
      onUserUpdate({ ...(user || {}), name: account.name, email: account.email, username: account.username, avatar: avatarPreview });
    }
  };

  const handleNotificationsSave = () => {
    setFeedback((prev) => ({ ...prev, notifications: "Предпочтения уведомлений сохранены" }));
  };

  const handleAppearanceSave = (themeId) => {
    if (themeId) {
      setTheme(themeId);
    }
    setFeedback((prev) => ({ ...prev, appearance: "Оформление обновлено" }));
  };

  const appearanceTab = (
    <>
      <SectionCard
        title="Тема и акцент"
        subtitle="Переключай тёмную/светлую тему и выбирай цветовой акцент."
        footer={
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="meta subtle">{feedback.appearance}</div>
            <button className="primary" onClick={() => handleAppearanceSave()}>
              Сохранить изменения
            </button>
          </div>
        }
      >
        <div className="flex flex-wrap gap-3">
          {["dark", "light"].map((mode) => (
            <button
              key={mode}
              type="button"
              className={`theme-option ${theme === mode ? "active" : ""}`}
              onClick={() => handleAppearanceSave(mode)}
            >
              <div className="theme-option-title">{mode === "dark" ? "Тёмная" : "Светлая"}</div>
              <p className="meta subtle">{mode === "dark" ? "Фиолетовый акцент и тёмный фон" : "Светлые панели"}</p>
            </button>
          ))}
        </div>
        <div className="accent-grid">
          {accentOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              className={`accent-chip ${appearance.accent === option.id ? "active" : ""}`}
              onClick={() => handleAccentSelect(option.id)}
            >
              <span className="accent-dot" style={{ backgroundColor: option.value }} />
              {option.label}
            </button>
          ))}
        </div>
        <div className="chip-row">
          {fontOptions.map((font) => (
            <button
              key={font.id}
              className={`chip ${appearance.fontSize === font.id ? "active" : ""}`}
              onClick={() => handleFontSelect(font.id)}
            >
              {font.label} {font.hint && <span className="meta subtle">{font.hint}</span>}
            </button>
          ))}
        </div>
        <SettingToggle
          label="Минимум анимаций"
          description="Сокращаем движения для комфортного чтения."
          checked={appearance.reduceMotion}
          onChange={(value) => setAppearance((prev) => ({ ...prev, reduceMotion: value }))}
        />
      </SectionCard>
    </>
  );

  const accountTab = (
    <>
      <SectionCard
        title="Данные аккаунта"
        subtitle="Имя, контактный email и короткий ник для карточек."
        footer={
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="meta subtle">{feedback.account}</div>
            <button className="primary" type="button" onClick={handleAccountSave}>
              Сохранить данные
            </button>
          </div>
        }
      >
        <div className="grid gap-4 md:grid-cols-2">
          <label className="settings-field">
            Имя
            <input value={account.name} onChange={(e) => setAccount((prev) => ({ ...prev, name: e.target.value }))} placeholder="Твоё имя" />
          </label>
          <label className="settings-field">
            Email
            <input
              type="email"
              value={account.email}
              onChange={(e) => setAccount((prev) => ({ ...prev, email: e.target.value }))}
              placeholder="you@noesis.app"
            />
          </label>
          <label className="settings-field">
            Имя пользователя
            <input
              value={account.username}
              onChange={(e) => setAccount((prev) => ({ ...prev, username: e.target.value }))}
              placeholder="noesis-user"
            />
          </label>
        </div>
        <div className="avatar-upload">
          <div>
            <div className="preference-label">Аватар</div>
            <p className="meta subtle">Загрузи квадратное изображение до 2 МБ — превью появится сразу.</p>
            {errors.avatar && <div className="error">{errors.avatar}</div>}
            <div className="flex items-center gap-3">
              <label className="ghost">
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  hidden
                  onChange={(e) => handleAvatarUpload(e.target.files?.[0])}
                />
                Загрузить
              </label>
              <span className="meta subtle">webp / jpg</span>
            </div>
          </div>
          <div className="avatar-preview">
            {avatarPreview ? <img src={avatarPreview} alt="avatar preview" /> : <div className="avatar empty">🙂</div>}
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
          <div>
            <div className="preference-label">Выйти из аккаунта</div>
            <p className="meta subtle">Сессия завершится на всех вкладках. Можно войти позже.</p>
          </div>
          <button type="button" className="ghost danger" onClick={() => onLogout?.()}>
            Выйти
          </button>
        </div>
      </SectionCard>

      <SectionCard
        title="Пароль"
        subtitle="Минимум 6 символов, раз в несколько месяцев."
        footer={
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="meta subtle">{feedback.security}</div>
            <button className="primary" type="submit" form="password-form">
              Сохранить пароль
            </button>
          </div>
        }
      >
        <form id="password-form" className="grid gap-4 md:grid-cols-3" onSubmit={handlePasswordSubmit}>
          <label className="settings-field">
            Текущий пароль
            <input
              type="password"
              value={passwords.current}
              onChange={(e) => setPasswords((prev) => ({ ...prev, current: e.target.value }))}
              placeholder="●●●●●●"
            />
          </label>
          <label className="settings-field">
            Новый пароль
            <input
              type="password"
              value={passwords.next}
              onChange={(e) => setPasswords((prev) => ({ ...prev, next: e.target.value }))}
              placeholder="Минимум 6 символов"
            />
          </label>
          <label className="settings-field">
            Подтверждение
            <input
              type="password"
              value={passwords.confirm}
              onChange={(e) => setPasswords((prev) => ({ ...prev, confirm: e.target.value }))}
              placeholder="Повтори новый пароль"
            />
          </label>
          {errors.password && <div className="error md:col-span-3">{errors.password}</div>}
        </form>
      </SectionCard>
    </>
  );

  const notificationsTab = (
    <SectionCard
      title="Уведомления"
      subtitle="Выбирай, что напоминать: задания, streak, комментарии и новые материалы."
      footer={
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="meta subtle">{feedback.notifications}</div>
          <button className="primary" onClick={handleNotificationsSave}>
            Сохранить уведомления
          </button>
        </div>
      }
    >
      <div className="preference-list">
        <SettingToggle
          label="Новые задания"
          description="Уведомлять о старте свежих квестов."
          checked={notifications.assignments}
          onChange={(value) => setNotifications((prev) => ({ ...prev, assignments: value }))}
        />
        <SettingToggle
          label="Напоминания о streak"
          description="Сигнал перед тем как серия оборвётся."
          checked={notifications.streak}
          onChange={(value) => setNotifications((prev) => ({ ...prev, streak: value }))}
        />
        <SettingToggle
          label="Комментарии и ответы"
          description="Уведомлять, если пришёл ответ или отметили в обсуждении."
          checked={notifications.comments}
          onChange={(value) => setNotifications((prev) => ({ ...prev, comments: value }))}
        />
        <SettingToggle
          label="Новые материалы по избранным темам"
          description="Push или email, когда появляется полезный контент."
          checked={notifications.newMaterials}
          onChange={(value) => setNotifications((prev) => ({ ...prev, newMaterials: value }))}
        />
        <SettingToggle
          label="Push-уведомления"
          description="Мгновенные напоминания в браузере."
          checked={notifications.push}
          onChange={(value) => setNotifications((prev) => ({ ...prev, push: value }))}
        />
        <SettingToggle
          label="Email-уведомления"
          description="Редкие дайджесты и важные изменения."
          checked={notifications.email}
          onChange={(value) => setNotifications((prev) => ({ ...prev, email: value }))}
        />
      </div>
    </SectionCard>
  );

  const securityTab = (
    <SectionCard
      title="Безопасность"
      subtitle="Двухфакторная аутентификация и активные сессии (прототип)."
      footer={
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="meta subtle">{feedback.security}</div>
          <button className="primary" onClick={() => setFeedback((prev) => ({ ...prev, security: "Настройки сохранены" }))}>
            Сохранить
          </button>
        </div>
      }
    >
      <SettingToggle
        label="Включить 2FA"
        description="Получать код подтверждения при входе."
        checked={false}
        onChange={() => {}}
      />
      <div className="card subtle">
        <div className="card-header">Активные сессии</div>
        <p className="meta subtle">Прототип: текущая сессия отмечена, управление скоро появится.</p>
      </div>
    </SectionCard>
  );

  const aboutTab = (
    <SectionCard title="О сервисе" subtitle="Версия прототипа, полезные ссылки и поддержка.">
      <div className="grid gap-3 md:grid-cols-2">
        <div className="card subtle">
          <div className="card-header">Версия приложения</div>
          <p className="meta">v0.8 · обновлено сегодня</p>
        </div>
        <div className="card subtle">
          <div className="card-header">Политика и соглашение</div>
          <div className="flex gap-3">
            <Link to="/legal/privacy" className="ghost">Политика конфиденциальности</Link>
            <Link to="/legal/terms" className="ghost">Пользовательское соглашение</Link>
          </div>
        </div>
      </div>
      <div className="help-links">
        <button type="button" className="ghost link-row">
          <span>Как настроить профиль?</span>
          <span className="meta subtle">Пошаговая инструкция и чек-лист</span>
        </button>
        <button type="button" className="ghost link-row">
          <span>Написать в поддержку</span>
          <span className="meta subtle">support@noesis.app</span>
        </button>
      </div>
    </SectionCard>
  );

  const renderTab = () => {
    switch (activeTab) {
      case "appearance":
        return appearanceTab;
      case "account":
        return accountTab;
      case "notifications":
        return notificationsTab;
      case "security":
        return securityTab;
      case "about":
        return aboutTab;
      default:
        return null;
    }
  };

  return (
    <div className="page settings-page">
      <div className="settings-page-header">
        <div>
          <p className="section-kicker">Настройки</p>
          <h1 className="page-title">Настройки</h1>
          <p className="meta large">Управляй своим аккаунтом, внешним видом и уведомлениями.</p>
        </div>
      </div>

      <div className="settings-shell">
        <div className="settings-tabs">
          {tabList.map((tab) => (
            <button
              key={tab.id}
              className={`tab-chip ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="settings-stack">{renderTab()}</div>
      </div>
    </div>
  );
};

export default SettingsPage;
