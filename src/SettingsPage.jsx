import React, { useEffect, useMemo, useState } from "react";
import AvatarUploader from "./settings/AvatarUploader";
import PasswordSection from "./settings/PasswordSection";
import NotificationsSection from "./settings/NotificationsSection";
import AboutService from "./settings/AboutService";
import { safeGetJSON, safeRemove, safeSetJSON } from "./settings/storage";

const ACCOUNT_KEY = "noesis_account_settings";
const AVATAR_KEY = "noesis_user_avatar";

const tabList = [
  { id: "data", label: "Данные" },
  { id: "notifications", label: "Уведомления" },
  { id: "about", label: "О сервисе" },
];

const SettingsPage = ({ user, onUserUpdate, onLogout, addToast }) => {
  const [activeTab, setActiveTab] = useState("data");
  const [account, setAccount] = useState(() =>
    safeGetJSON(ACCOUNT_KEY, {
      name: user?.name || "",
      email: user?.email || "",
      username: user?.username || "",
    })
  );
  const [avatar, setAvatar] = useState(() => (typeof localStorage !== "undefined" ? localStorage.getItem(AVATAR_KEY) : ""));
  const [message, setMessage] = useState("");

  useEffect(() => {
    safeSetJSON(ACCOUNT_KEY, account);
  }, [account]);

  const handleAvatarSave = (dataUrl) => {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(AVATAR_KEY, dataUrl);
    }
    setAvatar(dataUrl);
    onUserUpdate?.({ ...(user || {}), name: account.name || user?.name, email: account.email || user?.email, avatar: dataUrl });
  };

  const handleAvatarDelete = () => {
    safeRemove(AVATAR_KEY);
    setAvatar("");
    onUserUpdate?.({ ...(user || {}), avatar: "" });
  };

  const saveAccount = () => {
    safeSetJSON(ACCOUNT_KEY, account);
    onUserUpdate?.({ ...(user || {}), ...account, avatar });
    setMessage("Данные сохранены");
    addToast?.("Данные обновлены");
  };

  const dataTab = (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-lg font-semibold text-white">Основные данные</p>
            <p className="text-sm text-white/60">Имя и контакт остаются только у тебя — мы используем их для писем и бейджей.</p>
          </div>
          <button
            type="button"
            onClick={saveAccount}
            className="rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-600"
          >
            Сохранить данные
          </button>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <label className="flex flex-col gap-2 text-sm text-white/80">
            Имя
            <input
              value={account.name}
              onChange={(e) => setAccount((prev) => ({ ...prev, name: e.target.value }))}
              className="rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-white outline-none focus:border-indigo-400"
              placeholder="Твоё имя"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm text-white/80">
            Email
            <input
              type="email"
              value={account.email}
              onChange={(e) => setAccount((prev) => ({ ...prev, email: e.target.value }))}
              className="rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-white outline-none focus:border-indigo-400"
              placeholder="you@noesis.app"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm text-white/80">
            Никнейм
            <input
              value={account.username}
              onChange={(e) => setAccount((prev) => ({ ...prev, username: e.target.value }))}
              className="rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-white outline-none focus:border-indigo-400"
              placeholder="noesis-user"
            />
          </label>
        </div>
        {message && <p className="mt-3 text-sm text-emerald-400">{message}</p>}
      </div>

      <AvatarUploader value={avatar} onSave={handleAvatarSave} onDelete={handleAvatarDelete} addToast={addToast} />
      <PasswordSection addToast={addToast} />
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold text-white">Выйти из аккаунта</p>
          <p className="text-xs text-white/60">Сессия завершится на всех вкладках — вернуться можно в любой момент.</p>
        </div>
        <button
          type="button"
          onClick={() => onLogout?.()}
          className="rounded-xl bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20"
        >
          Выйти
        </button>
      </div>
    </div>
  );

  const notificationsTab = <NotificationsSection addToast={addToast} />;
  const aboutTab = <AboutService addToast={addToast} />;

  const renderTab = useMemo(() => {
    switch (activeTab) {
      case "data":
        return dataTab;
      case "notifications":
        return notificationsTab;
      case "about":
        return aboutTab;
      default:
        return null;
    }
  }, [activeTab, aboutTab, dataTab, notificationsTab]);

  return (
    <div className="page settings-page">
      <div className="settings-page-header">
        <div>
          <p className="section-kicker">Настройки</p>
          <h1 className="page-title">Настройки профиля</h1>
          <p className="meta large">Аватар, уведомления и безопасность — всё в одном месте.</p>
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
        <div className="settings-stack">{renderTab}</div>
      </div>
    </div>
  );
};

export default SettingsPage;
