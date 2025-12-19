import React, { useEffect, useState } from "react";
import { Link } from "../../routerShim";

const ChecklistCard = ({ checklist }) => {
  const [open, setOpen] = useState(false);
  const [completedSteps, setCompletedSteps] = useState([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem(`checklist-${checklist.id}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCompletedSteps(parsed || []);
      } catch (e) {
        /* noop */
      }
    }
  }, [checklist.id]);

  const toggleStep = (stepId) => {
    setCompletedSteps((prev) => {
      const next = prev.includes(stepId) ? prev.filter((id) => id !== stepId) : [...prev, stepId];
      if (typeof window !== "undefined") {
        window.localStorage.setItem(`checklist-${checklist.id}`, JSON.stringify(next));
      }
      return next;
    });
  };

  const progressText = `${completedSteps.length}/${checklist.steps.length} выполнено`;

  const target = checklist.link || "/library";

  return (
    <Link
      to={target}
      className="group rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 flex flex-col gap-3 shadow-lg transition duration-200 ease-out hover:-translate-y-1 hover:shadow-2xl hover:border-[var(--accent)]/60"
    >
      <div className="flex items-start justify-between text-sm text-[var(--muted)]">
        <div>
          <p className="text-xs text-[var(--muted)]">{checklist.topic}</p>
          <h3 className="text-lg font-semibold leading-snug text-[var(--fg)]">{checklist.title}</h3>
          <p className="text-sm text-[var(--muted)]">{checklist.steps.length} пунктов · {checklist.time}</p>
        </div>
        <button
          className="ghost small"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setOpen((v) => !v);
          }}
        >
          {open ? "Скрыть" : "Показать"}
        </button>
      </div>
      <div className="text-xs text-[var(--muted)]">{progressText}</div>
      {open && (
        <div className="rounded-xl border border-[#1f1f1f] bg-[#0e0e0e] p-3 max-h-56 overflow-y-auto grid gap-2">
          {checklist.steps.map((step) => {
            const active = completedSteps.includes(step.id);
            return (
              <label
                key={step.id}
                className="flex items-start gap-3 rounded-lg px-2 py-2 hover:bg-white/5 cursor-pointer text-sm text-gray-200"
              >
                <input
                  type="checkbox"
                  className="mt-1 accent-[#8A3FFC]"
                  checked={active}
                  onChange={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleStep(step.id);
                  }}
                />
                <div>
                  <p className="font-semibold">{step.title}</p>
                  <p className="text-xs text-gray-400">{step.hint}</p>
                </div>
              </label>
            );
          })}
        </div>
      )}
      <div className="flex items-center justify-between text-sm text-[var(--muted)]">
        <span className="pill subtle">Сохраняется автоматически</span>
        <span className="primary small inline-flex items-center gap-1">Открыть →</span>
      </div>
    </Link>
  );
};

export default ChecklistCard;
