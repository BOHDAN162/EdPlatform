import React, { useEffect, useMemo, useState } from "react";
import { themeLabels } from "../../libraryData";

const CATEGORY_LABELS = {
  navigation: "Навигация",
  actions: "Мои действия",
  search: "Материалы",
  missions: "Миссии",
  user: "Профиль",
  memory: "Память",
};

const MAX_VISIBLE = 9;

const CommandPalette = ({
  open,
  onClose,
  theme,
  toggleTheme,
  materials = [],
  missions = [],
  memoryLandmarks = [],
  trackData,
  completedMaterialIds = [],
  addToast,
  navigate,
}) => {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!open) return;
    const handleKeys = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((idx) => Math.min(idx + 1, Math.max(visibleCommands.length - 1, 0)));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((idx) => Math.max(idx - 1, 0));
      }
    };
    window.addEventListener("keydown", handleKeys);
    return () => window.removeEventListener("keydown", handleKeys);
  }, [open, onClose, visibleCommands.length]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
    }
  }, [open]);

  const completedMaterialSet = useMemo(() => new Set(completedMaterialIds || []), [completedMaterialIds]);

  const nextTrackStep = useMemo(() => {
    if (!trackData?.trackSteps?.length) return null;
    const completedSteps = new Set(trackData.completedStepIds || []);
    return trackData.trackSteps.find((step) => {
      const materialId = step.materialId || step.materials?.[0];
      if (!materialId) return false;
      return !completedSteps.has(step.id) && !completedMaterialSet.has(materialId);
    });
  }, [completedMaterialSet, trackData]);

  const baseCommands = useMemo(
    () => [
      { id: "nav-home", title: "Go to Главная", subtitle: "Перейти на главную", category: "navigation", action: () => navigate("/") },
      { id: "nav-library", title: "Go to Библиотека", subtitle: "Материалы и MindGames", category: "navigation", action: () => navigate("/library") },
      { id: "nav-community", title: "Go to Сообщество", subtitle: "Общение и вопросы", category: "navigation", action: () => navigate("/community") },
      { id: "nav-profile", title: "Go to Профиль", subtitle: "Твой прогресс и настройки", category: "navigation", action: () => navigate("/profile") },
      { id: "nav-missions", title: "Go to Миссии", subtitle: "Все активные квесты", category: "navigation", action: () => navigate("/missions") },
      { id: "nav-memory", title: "Go to Память", subtitle: "Город знаний", category: "navigation", action: () => navigate("/memory") },
      {
        id: "action-track",
        title: nextTrackStep ? "Continue мой трек развития" : "Собрать трек развития",
        subtitle: nextTrackStep ? nextTrackStep.title : "Запусти тест и получи план",
        category: "actions",
        accent: "#8b5cf6",
        action: () => {
          if (nextTrackStep?.materialId) {
            navigate(`/material/${nextTrackStep.materialId}`);
          } else {
            navigate("/track-quiz");
          }
          onClose();
        },
      },
      {
        id: "action-progress",
        title: "Открыть сегодняшний прогресс",
        subtitle: "Профиль и миссии",
        category: "actions",
        action: () => {
          navigate("/profile");
          onClose();
        },
      },
      {
        id: "action-active-missions",
        title: "Открыть активные миссии",
        subtitle: "Перейти к заданиям",
        category: "actions",
        action: () => {
          navigate("/missions");
          onClose();
        },
      },
      {
        id: "action-mindgame",
        title: "Пройти 1 MindGame",
        subtitle: "Раздел MindGames в библиотеке",
        category: "actions",
        action: () => {
          navigate("/library");
          setTimeout(() => {
            const el = document.getElementById("mindgames-section");
            if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 150);
          onClose();
        },
      },
      {
        id: "action-memory",
        title: "Написать запись в Память",
        subtitle: "Создай новую заметку",
        category: "actions",
        action: () => {
          navigate("/memory");
          onClose();
        },
      },
      {
        id: "user-theme",
        title: "Switch theme",
        subtitle: theme === "dark" ? "Включить светлую" : "Включить тёмную",
        category: "user",
        action: () => {
          toggleTheme();
          onClose();
        },
      },
      {
        id: "user-settings",
        title: "Open Settings",
        subtitle: "Профиль и персонализация",
        category: "user",
        action: () => {
          navigate("/profile");
          onClose();
        },
      },
      {
        id: "user-achievements",
        title: "View achievements",
        subtitle: "Все награды и статусы",
        category: "user",
        action: () => {
          navigate("/profile");
          onClose();
        },
      },
      {
        id: "user-streak",
        title: "View streak",
        subtitle: "Серия дней",
        category: "user",
        action: () => {
          navigate("/profile");
          onClose();
        },
      },
    ],
    [navigate, nextTrackStep, onClose, theme, toggleTheme]
  );

  const materialCommands = useMemo(
    () =>
      materials.map((material) => ({
        id: `material-${material.id}`,
        title: material.title,
        subtitle: `${material.type === "test" ? "Тест" : material.type === "course" ? "Курс" : "Лонгрид"} · ${themeLabels[material.theme]?.title || material.theme}`,
        category: "search",
        tags: [material.theme, material.type],
        action: () => {
          navigate(`/material/${material.id}`);
          onClose();
        },
      })),
    [materials, navigate, onClose]
  );

  const missionCommands = useMemo(
    () =>
      missions.map((mission) => ({
        id: `mission-${mission.id}`,
        title: mission.title,
        subtitle: mission.description,
        category: "missions",
        action: () => {
          navigate("/missions");
          setTimeout(() => {
            const el = document.querySelector(`[data-mission-id="${mission.id}"]`);
            if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
          }, 150);
          onClose();
        },
      })),
    [missions, navigate, onClose]
  );

  const memoryCommands = useMemo(
    () =>
      memoryLandmarks.map((landmark) => ({
        id: `memory-${landmark.id}`,
        title: landmark.name,
        subtitle: `Память · ${landmark.description}`,
        category: "memory",
        action: () => {
          sessionStorage.setItem("ep_memory_focus", landmark.id);
          navigate(`/memory`);
          setTimeout(() => {
            const el = document.querySelector(`[data-landmark-id="${landmark.id}"]`);
            if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
          }, 150);
          onClose();
        },
      })),
    [memoryLandmarks, navigate, onClose]
  );

  const allCommands = useMemo(
    () => [...baseCommands, ...materialCommands, ...missionCommands, ...memoryCommands],
    [baseCommands, materialCommands, missionCommands, memoryCommands]
  );

  const visibleCommands = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = allCommands.filter((cmd) => {
      if (!q) return true;
      return (
        cmd.title.toLowerCase().includes(q) ||
        cmd.subtitle?.toLowerCase().includes(q)
      );
    });
    return list.slice(0, MAX_VISIBLE);
  }, [allCommands, query]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    if (visibleCommands.length === 0) {
      setActiveIndex(0);
      return;
    }
    setActiveIndex((idx) => Math.min(idx, visibleCommands.length - 1));
  }, [visibleCommands.length]);

  const executeActive = () => {
    const cmd = visibleCommands[activeIndex];
    if (cmd) {
      cmd.action();
    } else if (!visibleCommands.length && addToast) {
      addToast("Ничего не найдено");
    }
  };

  if (!open) return null;

  return (
    <div className="command-overlay" onClick={onClose}>
      <div className="command-shell" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <div className="command-input-row">
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск команд, материалов, миссий…"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                executeActive();
              }
            }}
          />
          <button className="ghost" onClick={onClose} aria-label="Закрыть палитру">
            ESC
          </button>
        </div>
        <div className="command-list">
          {visibleCommands.length === 0 && <div className="empty">Ничего не найдено</div>}
          {visibleCommands.map((cmd, idx) => (
            <button
              key={cmd.id}
              className={`command-item ${idx === activeIndex ? "active" : ""}`}
              onMouseEnter={() => setActiveIndex(idx)}
              onClick={() => cmd.action()}
            >
              <div className="command-titles">
                <div className="command-title">{cmd.title}</div>
                <div className="command-subtitle">{cmd.subtitle}</div>
              </div>
              <div className="command-meta">
                <span className="command-category">{CATEGORY_LABELS[cmd.category] || "Команда"}</span>
                {cmd.accent && <span className="accent-dot" style={{ background: cmd.accent }} />}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;

