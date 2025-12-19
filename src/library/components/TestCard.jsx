import React from "react";
import { Link } from "../../routerShim";

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
    <div className="rounded-2xl border border-[#1f1f1f] bg-gradient-to-b from-[#141018] to-[#0b0b0b] p-4 flex flex-col shadow-lg">
      <div className="flex items-center justify-between text-xs text-gray-300">
        <div className="flex items-center gap-2">
          <span className="pill outline">Тест</span>
          <span className="flex items-center gap-1 text-gray-200">
            <span className="h-2 w-2 rounded-full" style={{ background: difficultyColors[difficulty] || "#8A3FFC" }} />
            {difficulty}
          </span>
        </div>
        <span className="pill subtle">+{rewardXp} XP</span>
      </div>
      <h3 className="text-lg font-semibold leading-snug mt-2 line-clamp-2">{test.title}</h3>
      <p className="text-sm text-gray-400 line-clamp-2 mt-1">{test.description}</p>
      <div className="grid grid-cols-3 gap-2 text-xs text-gray-300 mt-3">
        <div className="rounded-xl bg-white/5 px-3 py-2">
          <p className="text-gray-400">Вопросов</p>
          <p className="font-semibold text-white">{test.questions.length}</p>
        </div>
        <div className="rounded-xl bg-white/5 px-3 py-2">
          <p className="text-gray-400">Попыток</p>
          <p className="font-semibold text-white">{attempts}</p>
        </div>
        <div className="rounded-xl bg-white/5 px-3 py-2">
          <p className="text-gray-400">Точность</p>
          <p className="font-semibold text-white">{accuracy !== null ? `${accuracy}%` : "—"}</p>
        </div>
      </div>
      <div className="mt-auto pt-3 flex items-center justify-between text-sm text-gray-300">
        <div>
          {lastScore ? (
            <p>Последний результат: {lastScore.correct}/{lastScore.total}</p>
          ) : (
            <p>Ещё не проходил</p>
          )}
        </div>
        <Link className="primary small" to={`/library/test/${test.id}`}>
          Открыть
        </Link>
      </div>
    </div>
  );
};

export default TestCard;
