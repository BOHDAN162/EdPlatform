import React, { useMemo, useState } from "react";

const calcStrength = (password) => {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
  if (/[A-ZА-Я]/.test(password)) score += 1;
  return score;
};

const strengthMeta = {
  0: { label: "Слабый", color: "bg-rose-500", width: "w-1/4" },
  1: { label: "Слабый", color: "bg-rose-500", width: "w-2/4" },
  2: { label: "Средний", color: "bg-amber-500", width: "w-3/4" },
  3: { label: "Средний", color: "bg-amber-500", width: "w-4/5" },
  4: { label: "Сильный", color: "bg-emerald-500", width: "w-full" },
};

const PasswordSection = ({ addToast }) => {
  const [form, setForm] = useState({ current: "", next: "", confirm: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const score = useMemo(() => calcStrength(form.next), [form.next]);
  const meta = strengthMeta[score] || strengthMeta[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess("");
    if (!form.current.trim()) {
      setError("Укажи текущий пароль");
      return;
    }
    if (form.next.length < 8) {
      setError("Новый пароль должен быть длиной от 8 символов");
      return;
    }
    if (form.next !== form.confirm) {
      setError("Пароли не совпадают");
      return;
    }
    setError("");
    setForm({ current: "", next: "", confirm: "" });
    setSuccess("Пароль обновлён");
    addToast?.("Пароль обновлён");
  };

  return (
    <div className="rounded-2xl border p-6 surface-card">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-lg font-semibold">Смена пароля</p>
          <p className="text-sm muted-text">Минимум 8 символов. Используй буквы, цифры и символы.</p>
        </div>
      </div>
      <form className="mt-4 grid gap-4 md:grid-cols-3" onSubmit={handleSubmit}>
        <label className="flex flex-col gap-2 text-sm">
          Текущий пароль
          <input
            type="password"
            value={form.current}
            onChange={(e) => setForm((prev) => ({ ...prev, current: e.target.value }))}
            className="rounded-xl border px-3 py-2 input-surface theme-input"
            placeholder="●●●●●●"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm">
          Новый пароль
          <input
            type="password"
            value={form.next}
            onChange={(e) => setForm((prev) => ({ ...prev, next: e.target.value }))}
            className="rounded-xl border px-3 py-2 input-surface theme-input"
            placeholder="Минимум 8 символов"
          />
          <div className="space-y-2">
            <div className="h-2 overflow-hidden rounded-full" style={{ background: "var(--surface-3)" }}>
              <div className={`h-full rounded-full ${meta.color} ${meta.width}`} />
            </div>
            <p className="text-xs muted-text">{meta.label}. Используй буквы, цифры и символы.</p>
          </div>
        </label>
        <label className="flex flex-col gap-2 text-sm">
          Подтверждение
          <input
            type="password"
            value={form.confirm}
            onChange={(e) => setForm((prev) => ({ ...prev, confirm: e.target.value }))}
            className="rounded-xl border px-3 py-2 input-surface theme-input"
            placeholder="Повтори новый пароль"
          />
        </label>
        {error && <div className="md:col-span-3 text-sm" style={{ color: "var(--danger)" }}>{error}</div>}
        {success && <div className="md:col-span-3 text-sm" style={{ color: "var(--success)" }}>{success}</div>}
        <div className="md:col-span-3 flex flex-wrap gap-3">
          <button
            type="submit"
            className="rounded-xl px-4 py-2 text-sm font-semibold text-white"
            style={{ background: "var(--accent)" }}
          >
            Сменить пароль
          </button>
          <p className="text-sm muted-text">Мы не сохраняем пароль, но подскажем критерии безопасности.</p>
        </div>
      </form>
    </div>
  );
};

export default PasswordSection;
