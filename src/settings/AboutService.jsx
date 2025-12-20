import React, { useMemo, useState } from "react";
import Modal from "./Modal";
import { safeGetJSON, safeSetJSON } from "./storage";

const SUPPORT_KEY = "noesis_support_tickets";

const InstructionModal = ({ onClose }) => (
  <Modal
    title="Как настроить профиль?"
    onClose={onClose}
    actions={[
      <button key="close" className="rounded-xl bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20" onClick={onClose}>
        Закрыть
      </button>,
    ]}
  >
    <ol className="list-decimal space-y-2 pl-5 text-white/80">
      <li>Загрузи аватар и обрежь его под квадрат.</li>
      <li>Заполни имя и контактный email, чтобы мы знали, как обратиться.</li>
      <li>Включи push или email-уведомления для важных событий.</li>
      <li>Выбери интересы в библиотеке и закрепи любимые треки.</li>
      <li>Проверь безопасность: обнови пароль и включи напоминания о серии.</li>
    </ol>
  </Modal>
);

const SupportModal = ({ onClose, addToast }) => {
  const [form, setForm] = useState({ topic: "profile", message: "", contact: "" });
  const [error, setError] = useState("");

  const submit = () => {
    if (!form.message.trim() || !form.contact.trim()) {
      setError("Заполни сообщение и контакт");
      return;
    }
    const existing = safeGetJSON(SUPPORT_KEY, []);
    const next = [...existing, { ...form, createdAt: new Date().toISOString() }];
    safeSetJSON(SUPPORT_KEY, next);
    addToast?.("Сообщение отправлено");
    onClose();
  };

  return (
    <Modal
      title="Написать в поддержку"
      onClose={onClose}
      actions={[
        <button key="cancel" className="rounded-xl px-4 py-2 text-sm badge-soft hover:shadow-sm" onClick={onClose}>
          Отмена
        </button>,
        <button
          key="send"
          className="rounded-xl px-4 py-2 text-sm font-semibold text-white"
          style={{ background: "var(--accent)" }}
          onClick={submit}
        >
          Отправить
        </button>,
      ]}
    >
      <div className="space-y-3">
        <label className="flex flex-col gap-2 text-sm">
          Тема
          <select
            value={form.topic}
            onChange={(e) => setForm((prev) => ({ ...prev, topic: e.target.value }))}
            className="rounded-xl border px-3 py-2 input-surface theme-input"
          >
            <option value="profile">Профиль и аватар</option>
            <option value="notifications">Уведомления</option>
            <option value="billing">Оплата и подписка</option>
            <option value="other">Другое</option>
          </select>
        </label>
        <label className="flex flex-col gap-2 text-sm">
          Сообщение
          <textarea
            value={form.message}
            onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
            rows={4}
            className="rounded-xl border px-3 py-2 input-surface theme-input"
            placeholder="Опиши вопрос или проблему"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm">
          Контакт
          <input
            value={form.contact}
            onChange={(e) => setForm((prev) => ({ ...prev, contact: e.target.value }))}
            className="rounded-xl border px-3 py-2 input-surface theme-input"
            placeholder="Email или Telegram"
          />
        </label>
        {error && <p className="text-sm" style={{ color: "var(--danger)" }}>{error}</p>}
      </div>
    </Modal>
  );
};

const AboutService = ({ addToast }) => {
  const [showInstruction, setShowInstruction] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const version = useMemo(() => import.meta?.env?.VITE_APP_VERSION || "v0.1.0", []);

  return (
    <div className="rounded-2xl border p-6 surface-card">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--accent)] text-lg font-semibold text-white">N</div>
          <div>
            <p className="text-lg font-semibold">NOESIS</p>
            <p className="text-sm muted-text">Ежедневный центр роста: учёба, привычки, мышление и сообщество.</p>
          </div>
        </div>
        <div className="rounded-full px-4 py-2 text-sm badge-soft">Версия {version}</div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="rounded-xl border p-4 surface-card">
          <p className="text-sm font-semibold">Политика и соглашение</p>
          <p className="text-xs muted-text">Документы скоро будут доступны.</p>
          <div className="mt-3 flex flex-wrap gap-3 text-sm">
            <button
              type="button"
              className="rounded-xl px-3 py-2 badge-soft hover:shadow-sm"
              onClick={() => setShowInstruction(true)}
            >
              Политика конфиденциальности
            </button>
            <button
              type="button"
              className="rounded-xl px-3 py-2 badge-soft hover:shadow-sm"
              onClick={() => setShowInstruction(true)}
            >
              Пользовательское соглашение
            </button>
          </div>
        </div>
        <div className="rounded-xl border p-4 surface-card">
          <p className="text-sm font-semibold">Что нового</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm muted-text">
            <li>Улучшена библиотека и быстрый поиск.</li>
            <li>Добавлены новые задания и челленджи команды.</li>
            <li>Обновлён дизайн сообщества и прогресс-баров.</li>
            <li>Добавлен новый профиль настроек с аватаром и уведомлениями.</li>
          </ul>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <p className="text-sm font-semibold">Нужна помощь?</p>
          <p className="text-xs muted-text">Смотри шаги настройки или напиши нам напрямую.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setShowInstruction(true)}
            className="rounded-xl px-4 py-2 text-sm badge-soft hover:shadow-sm"
          >
            Как настроить профиль?
          </button>
          <button
            type="button"
            onClick={() => setShowSupport(true)}
            className="rounded-xl px-4 py-2 text-sm font-semibold text-white"
            style={{ background: "var(--accent)" }}
          >
            Написать в поддержку
          </button>
        </div>
      </div>

      {showInstruction && <InstructionModal onClose={() => setShowInstruction(false)} />}
      {showSupport && <SupportModal onClose={() => setShowSupport(false)} addToast={addToast} />}
    </div>
  );
};

export default AboutService;
