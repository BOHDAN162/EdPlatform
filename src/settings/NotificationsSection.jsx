import React, { useEffect, useState } from "react";
import { safeGetJSON, safeSetJSON } from "./storage";

const STORAGE_KEY = "noesis_notification_settings";

const defaultState = {
  push: {
    assignments: true,
    streakReminders: true,
    teamChallenges: true,
  },
  email: {
    weeklyReport: true,
    newContent: true,
    productNews: false,
  },
};

const ToggleRow = ({ title, hint, checked, onChange }) => (
  <label className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 transition hover:border-white/20">
    <div className="space-y-1">
      <p className="text-sm font-semibold text-white">{title}</p>
      {hint && <p className="text-xs text-white/60">{hint}</p>}
    </div>
    <div className="relative inline-flex items-center">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="peer sr-only"
      />
      <div className="h-6 w-11 rounded-full bg-white/20 transition peer-checked:bg-indigo-500 peer-focus:outline peer-focus:outline-2 peer-focus:outline-offset-2 peer-focus:outline-indigo-400" />
      <div className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
    </div>
  </label>
);

const NotificationsSection = ({ addToast }) => {
  const [state, setState] = useState(() => safeGetJSON(STORAGE_KEY, defaultState));
  const [savedMessage, setSavedMessage] = useState("");

  useEffect(() => {
    safeSetJSON(STORAGE_KEY, state);
  }, [state]);

  const save = () => {
    setSavedMessage("Настройки уведомлений сохранены");
    addToast?.("Уведомления сохранены");
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-lg font-semibold text-white">Уведомления</p>
          <p className="text-sm text-white/60">Управляй push и email-сообщениями отдельно.</p>
        </div>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="space-y-3">
          <p className="text-sm font-semibold text-white/90">Push-уведомления</p>
          <ToggleRow
            title="Новые задания"
            hint="Узнавай о свежих квестах и уроках"
            checked={state.push.assignments}
            onChange={(value) => setState((prev) => ({ ...prev, push: { ...prev.push, assignments: value } }))}
          />
          <ToggleRow
            title="Напоминания о серии"
            hint="Сообщаем, когда streak под угрозой"
            checked={state.push.streakReminders}
            onChange={(value) => setState((prev) => ({ ...prev, push: { ...prev.push, streakReminders: value } }))}
          />
          <ToggleRow
            title="Челленджи команды"
            hint="Движение и прогресс команды"
            checked={state.push.teamChallenges}
            onChange={(value) => setState((prev) => ({ ...prev, push: { ...prev.push, teamChallenges: value } }))}
          />
        </div>
        <div className="space-y-3">
          <p className="text-sm font-semibold text-white/90">Email-уведомления</p>
          <ToggleRow
            title="Еженедельный отчёт"
            hint="Короткая сводка прогресса"
            checked={state.email.weeklyReport}
            onChange={(value) => setState((prev) => ({ ...prev, email: { ...prev.email, weeklyReport: value } }))}
          />
          <ToggleRow
            title="Новые материалы"
            hint="Сигналы о свежих гайдах и видео"
            checked={state.email.newContent}
            onChange={(value) => setState((prev) => ({ ...prev, email: { ...prev.email, newContent: value } }))}
          />
          <ToggleRow
            title="Новости продукта"
            hint="Редкие апдейты платформы"
            checked={state.email.productNews}
            onChange={(value) => setState((prev) => ({ ...prev, email: { ...prev.email, productNews: value } }))}
          />
        </div>
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={save}
          className="rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-600"
        >
          Сохранить уведомления
        </button>
        <p className="text-sm text-white/60">Ты можешь изменить настройки в любое время.</p>
        {savedMessage && <span className="text-sm text-emerald-400">{savedMessage}</span>}
      </div>
    </div>
  );
};

export default NotificationsSection;
