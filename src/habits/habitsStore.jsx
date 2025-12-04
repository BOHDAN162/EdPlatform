import React, { createContext, useContext, useMemo, useState } from "react";

// TODO: заменить на запросы к backend/БД после появления API
const HabitContext = createContext(null);

const initialHabits = [
  {
    id: "habit-focus",
    name: "Утренняя фокус-сессия",
    category: "productivity",
    priority: 1,
    targetPerWeek: 5,
    createdAt: new Date(),
    active: true,
    order: 1,
  },
  {
    id: "habit-move",
    name: "10 000 шагов",
    category: "health",
    priority: 2,
    targetPerWeek: 4,
    createdAt: new Date(),
    active: true,
    order: 2,
  },
  {
    id: "habit-learn",
    name: "30 минут обучения",
    category: "learning",
    priority: 1,
    targetPerWeek: 6,
    createdAt: new Date(),
    active: true,
    order: 3,
  },
  {
    id: "habit-reflect",
    name: "Короткая рефлексия",
    category: "mindset",
    priority: 3,
    targetPerWeek: 3,
    createdAt: new Date(),
    active: true,
    order: 4,
  },
];

export const getWeekStart = (baseDate = new Date()) => {
  const date = new Date(baseDate);
  const day = date.getDay();
  const diff = (day === 0 ? -6 : 1) - day;
  date.setDate(date.getDate() + diff);
  date.setHours(0, 0, 0, 0);
  return date;
};

export const getWeekDates = (startDate) =>
  Array.from({ length: 7 }).map((_, idx) => {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + idx);
    return d.toISOString().slice(0, 10);
  });

const initialLogs = (() => {
  const today = new Date();
  const start = getWeekStart(today);
  const dates = getWeekDates(start);
  return [
    { habitId: "habit-focus", date: dates[0], status: "done" },
    { habitId: "habit-focus", date: dates[1], status: "done" },
    { habitId: "habit-move", date: dates[0], status: "done" },
    { habitId: "habit-move", date: dates[2], status: "done" },
    { habitId: "habit-learn", date: dates[1], status: "done" },
    { habitId: "habit-learn", date: dates[2], status: "done" },
    { habitId: "habit-reflect", date: dates[3], status: "done" },
  ];
})();

export const HabitProvider = ({ children }) => {
  const [habits, setHabits] = useState(initialHabits);
  const [logs, setLogs] = useState(initialLogs);
  const [weekOffset, setWeekOffset] = useState(0);

  const weekStart = useMemo(() => {
    const start = getWeekStart(new Date());
    const shifted = new Date(start);
    shifted.setDate(start.getDate() + weekOffset * 7);
    return shifted;
  }, [weekOffset]);

  const weekDates = useMemo(() => getWeekDates(weekStart), [weekStart]);

  const addHabit = (habit) => {
    setHabits((prev) => {
      const maxOrder = prev.reduce((acc, h) => Math.max(acc, h.order || 0), 0);
      return [
        ...prev,
        {
          ...habit,
          id: habit.id || `habit-${Date.now()}`,
          createdAt: habit.createdAt || new Date(),
          active: true,
          order: maxOrder + 1,
        },
      ];
    });
  };

  const updateHabit = (id, updates) => {
    setHabits((prev) => prev.map((habit) => (habit.id === id ? { ...habit, ...updates } : habit)));
  };

  const deleteHabit = (id) => {
    setHabits((prev) => prev.filter((habit) => habit.id !== id));
    setLogs((prev) => prev.filter((log) => log.habitId !== id));
  };

  const reorderHabits = (sourceId, targetId) => {
    setHabits((prev) => {
      const ordered = [...prev].sort((a, b) => (a.order || 0) - (b.order || 0));
      const sourceIndex = ordered.findIndex((h) => h.id === sourceId);
      const targetIndex = ordered.findIndex((h) => h.id === targetId);
      if (sourceIndex === -1 || targetIndex === -1) return prev;
      const [moved] = ordered.splice(sourceIndex, 1);
      ordered.splice(targetIndex, 0, moved);
      return ordered.map((item, idx) => ({ ...item, order: idx + 1 }));
    });
  };

  const setHabitStatus = (habitId, date, status) => {
    setLogs((prev) => {
      const next = prev.filter((log) => !(log.habitId === habitId && log.date === date));
      if (status && status !== "none") {
        next.push({ habitId, date, status });
      }
      return next;
    });
  };

  const toggleHabitLog = (habitId, date) => {
    setLogs((prev) => {
      const existing = prev.find((log) => log.habitId === habitId && log.date === date);
      if (existing?.status === "done") {
        return prev.filter((log) => !(log.habitId === habitId && log.date === date));
      }
      const filtered = prev.filter((log) => !(log.habitId === habitId && log.date === date));
      return [...filtered, { habitId, date, status: "done" }];
    });
  };

  const bestStreak = useMemo(() => {
    const byHabit = habits.reduce((acc, habit) => {
      acc[habit.id] = logs
        .filter((log) => log.habitId === habit.id && log.status === "done")
        .map((log) => log.date)
        .sort();
      return acc;
    }, {});

    let best = 0;
    Object.values(byHabit).forEach((dates) => {
      let streak = 0;
      let prevDate = null;
      dates.forEach((dateStr) => {
        const date = new Date(dateStr);
        if (prevDate) {
          const diff = (date - prevDate) / (1000 * 60 * 60 * 24);
          streak = diff === 1 ? streak + 1 : 1;
        } else {
          streak = 1;
        }
        prevDate = date;
        best = Math.max(best, streak);
      });
    });
    return best;
  }, [habits, logs]);

  const weeklyProgress = useMemo(() => {
    const done = logs.filter((log) => weekDates.includes(log.date) && log.status === "done").length;
    const total = habits.filter((h) => h.active).length * weekDates.length;
    return { done, total, percent: total ? Math.round((done / total) * 100) : 0 };
  }, [habits, logs, weekDates]);

  const value = useMemo(
    () => ({
      habits: [...habits].sort((a, b) => (a.order || 0) - (b.order || 0)),
      logs,
      weekStart,
      weekDates,
      weekOffset,
      weeklyProgress,
      bestStreak,
      addHabit,
      updateHabit,
      deleteHabit,
      reorderHabits,
      setHabitStatus,
      toggleHabitLog,
      goToNextWeek: () => setWeekOffset((prev) => prev + 1),
      goToPrevWeek: () => setWeekOffset((prev) => prev - 1),
      goToCurrentWeek: () => setWeekOffset(0),
    }),
    [habits, logs, weekStart, weekDates, weekOffset, weeklyProgress, bestStreak]
  );

  return <HabitContext.Provider value={value}>{children}</HabitContext.Provider>;
};

export const useHabits = () => {
  const ctx = useContext(HabitContext);
  if (!ctx) throw new Error("useHabits must be used within HabitProvider");
  return ctx;
};

export const habitCategories = {
  mindset: { label: "Мышление", color: "#22d3ee" },
  health: { label: "Здоровье", color: "#22c55e" },
  productivity: { label: "Продуктивность", color: "#a855f7" },
  learning: { label: "Обучение", color: "#6366f1" },
  other: { label: "Другое", color: "#e5e7eb" },
};

export const priorityLabels = {
  1: { label: "Высокий", tone: "high" },
  2: { label: "Средний", tone: "medium" },
  3: { label: "Низкий", tone: "low" },
};

export const weekDayNames = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
