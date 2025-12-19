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

  return (
    <div className="rounded-2xl border border-[#1f1f1f] bg-[#0c0c0c] p-4 flex flex-col gap-3 shadow-lg">
      <div className="flex items-start justify-between text-sm text-gray-300">
        <div>
          <p className="text-xs text-gray-400">{checklist.topic}</p>
          <h3 className="text-lg font-semibold leading-snug">{checklist.title}</h3>
          <p className="text-sm text-gray-400">{checklist.steps.length} пунктов · {checklist.time}</p>
        </div>
        <button className="ghost small" onClick={() => setOpen((v) => !v)}>
          {open ? "Скрыть" : "Показать"}
        </button>
      </div>
      <div className="text-xs text-gray-400">{progressText}</div>
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
                  onChange={() => toggleStep(step.id)}
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
      <div className="flex items-center justify-between text-sm text-gray-300">
        <span className="pill subtle">Сохраняется автоматически</span>
        {checklist.link && (
          <Link className="primary small" to={checklist.link}>
            Перейти
          </Link>
        )}
      </div>
    </div>
  );
};

export default ChecklistCard;
