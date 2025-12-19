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
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-lg font-semibold text-white">Смена пароля</p>
          <p className="text-sm text-white/60">Минимум 8 символов. Используй буквы, цифры и символы.</p>
        </div>
      </div>
      <form className="mt-4 grid gap-4 md:grid-cols-3" onSubmit={handleSubmit}>
        <label className="flex flex-col gap-2 text-sm text-white/80">
          Текущий пароль
          <input
            type="password"
            value={form.current}
            onChange={(e) => setForm((prev) => ({ ...prev, current: e.target.value }))}
            className="rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-white outline-none focus:border-indigo-400"
            placeholder="●●●●●●"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm text-white/80">
          Новый пароль
          <input
            type="password"
            value={form.next}
            onChange={(e) => setForm((prev) => ({ ...prev, next: e.target.value }))}
            className="rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-white outline-none focus:border-indigo-400"
            placeholder="Минимум 8 символов"
          />
          <div className="space-y-2">
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div className={`h-full rounded-full ${meta.color} ${meta.width}`} />
            </div>
            <p className="text-xs text-white/60">{meta.label}. Используй буквы, цифры и символы.</p>
          </div>
        </label>
        <label className="flex flex-col gap-2 text-sm text-white/80">
          Подтверждение
          <input
            type="password"
            value={form.confirm}
            onChange={(e) => setForm((prev) => ({ ...prev, confirm: e.target.value }))}
            className="rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-white outline-none focus:border-indigo-400"
            placeholder="Повтори новый пароль"
          />
        </label>
        {error && <div className="md:col-span-3 text-sm text-rose-400">{error}</div>}
        {success && <div className="md:col-span-3 text-sm text-emerald-400">{success}</div>}
        <div className="md:col-span-3 flex flex-wrap gap-3">
          <button
            type="submit"
            className="rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-600"
          >
            Сменить пароль
          </button>
          <p className="text-sm text-white/60">Мы не сохраняем пароль, но подскажем критерии безопасности.</p>
        </div>
      </form>
    </div>
  );
};

export default PasswordSection;
