import React from "react";
import { Link } from "../../routerShim";

const MindGameCard = ({ game, leaderboard = [], stats = {}, onPlay }) => {
  const maxScore = stats.maxScore || 9;
  const avgScore = stats.avgScore || 7.2;
  const best = stats.best || "8/10";
  const gradient =
    game.id === "logic"
      ? "linear-gradient(135deg, rgba(138,63,252,0.35), rgba(59,130,246,0.25))"
      : "linear-gradient(135deg, rgba(16,185,129,0.32), rgba(56,189,248,0.25))";

  return (
    <div className="rounded-2xl border border-[#1f1f1f] bg-[#0b0b0b] overflow-hidden shadow-lg flex flex-col">
      <div className="relative h-32 w-full" style={{ background: gradient }}>
        <div className="absolute -left-6 top-4 h-20 w-20 rounded-full bg-white/10 blur-3xl" aria-hidden />
        <div className="absolute right-6 -top-6 h-24 w-24 rounded-full bg-violet-500/20 blur-2xl animate-pulse" aria-hidden />
        <div className="absolute inset-0 flex items-center justify-between px-4 text-sm text-white/80">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-wide text-white/70">MindGame</p>
            <p className="text-lg font-semibold">{game.title}</p>
          </div>
          <div className="text-right text-xs space-y-1">
            <p>MAX: {maxScore}</p>
            <p>AVG: {avgScore}</p>
          </div>
        </div>
      </div>
      <div className="p-4 flex flex-col gap-3">
        <p className="text-sm text-gray-300 line-clamp-2">{game.description}</p>
        <div className="rounded-xl border border-[#1f1f1f] p-3 bg-[#0e0e0e]">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
            <span>Топ-3 друзей</span>
            <span>Лучший: {best}</span>
          </div>
          <div className="grid gap-2">
            {leaderboard.map((user, idx) => (
              <Link
                key={user.id}
                to={user.profileLink || "/community"}
                className="flex items-center justify-between rounded-lg px-2 py-2 hover:bg-white/5 text-sm text-gray-200"
              >
                <div className="flex items-center gap-2">
                  <span className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-sm font-semibold">
                    {user.initial || user.name?.[0] || "?"}
                  </span>
                  <div>
                    <p className="font-semibold">{idx + 1}. {user.name}</p>
                    <p className="text-xs text-gray-400">{user.city || "online"}</p>
                  </div>
                </div>
                <span className="text-sm text-emerald-300">{user.score}</span>
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between gap-2 text-sm text-gray-300">
          <div className="space-y-1">
            <p>Вопросов: {game.questions.length}</p>
            <p>Награда: {game.xpRewardBase || 80} XP</p>
          </div>
          <div className="flex gap-2">
            <Link className="secondary small" to={`/library/game/${game.id}`} onClick={(e) => e.preventDefault() || onPlay(game.id)}>
              Улучшить результат
            </Link>
            <Link className="primary small" to={`/library/game/${game.id}`} onClick={(e) => e.preventDefault() || onPlay(game.id)}>
              Играть
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MindGameCard;
