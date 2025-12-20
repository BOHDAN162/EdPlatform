import React from "react";
import { Link } from "../../routerShim";
import CardActionLink from "./CardActionLink";

const difficultyColors = {
  легкий: "#22c55e",
  средний: "#f59e0b",
  сложный: "#ef4444",
};

const TestCard = ({ test, stats }) => {
  const difficulty = stats?.difficulty || test.difficulty || "средний";
  const rewardXp = stats?.rewardXp || (difficulty === "легкий" ? 20 : difficulty === "средний" ? 30 : 50);
  const attempts = stats?.attemptsCount || 0;
  const lastScore = stats?.lastScore;
  const accuracy = lastScore ? Math.round((lastScore.correct / (lastScore.total || test.questions.length)) * 100) : null;

  return (
    <Link
      to={`/library/test/${test.id}`}
      className="group rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 flex h-full flex-col shadow-lg transition duration-200 ease-out hover:-translate-y-1 hover:shadow-2xl hover:border-[var(--accent)]/60"
    >
      <div className="flex items-center justify-between text-xs text-[var(--muted)]">
        <div className="flex items-center gap-2">
          <span className="pill outline">Тест</span>
          <span className="flex items-center gap-1 text-gray-200">
            <span className="h-2 w-2 rounded-full" style={{ background: difficultyColors[difficulty] || "#8A3FFC" }} />
            {difficulty}
          </span>
        </div>
        <span className="pill subtle">+{rewardXp} XP</span>
      </div>
      <h3 className="text-lg font-semibold leading-snug mt-2 line-clamp-2 text-[var(--fg)]">{test.title}</h3>
      <p className="text-sm text-[var(--muted)] line-clamp-2 mt-1">{test.description}</p>
      <div className="grid grid-cols-3 gap-2 text-xs text-[var(--muted)] mt-3">
        <div className="rounded-xl bg-white/5 px-3 py-2">
          <p className="text-[var(--muted)]">Вопросов</p>
          <p className="font-semibold text-[var(--fg)]">{test.questions.length}</p>
        </div>
        <div className="rounded-xl bg-white/5 px-3 py-2">
          <p className="text-[var(--muted)]">Попыток</p>
          <p className="font-semibold text-[var(--fg)]">{attempts}</p>
        </div>
        <div className="rounded-xl bg-white/5 px-3 py-2">
          <p className="text-[var(--muted)]">Точность</p>
          <p className="font-semibold text-[var(--fg)]">{accuracy !== null ? `${accuracy}%` : "—"}</p>
        </div>
      </div>
      <div className="mt-auto pt-3 flex items-center justify-between text-sm text-[var(--muted)]">
        <div>
          {lastScore ? (
            <p className="text-[var(--fg)]">Последний результат: {lastScore.correct}/{lastScore.total}</p>
          ) : (
            <p>Ещё не проходил</p>
          )}
        </div>
        <CardActionLink />
      </div>
    </Link>
  );
};

export default TestCard;
