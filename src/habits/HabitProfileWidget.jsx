import React, { useMemo } from "react";
import { useNavigate } from "../routerShim";
import { useHabits } from "./habitsStore";

const HabitProfileWidget = () => {
  const navigate = useNavigate();
  const { habits, weeklyProgress, bestStreak } = useHabits();

  const activeCount = habits.filter((h) => h.active).length;
  const avgPercent = useMemo(() => weeklyProgress.percent, [weeklyProgress]);

  return (
    <div className="card habit-profile-card">
      <div className="card-header">Привычки</div>
      <div className="profile-habit-stats">
        <div className="meta">Активных привычек: {activeCount}</div>
        <div className="meta">Средний прогресс за неделю: {avgPercent}%</div>
        <div className="meta">Лучшая серия: {bestStreak} дней</div>
      </div>
      <button className="primary outline" onClick={() => navigate("/habits")}>Открыть трекер</button>
    </div>
  );
};

export default HabitProfileWidget;
