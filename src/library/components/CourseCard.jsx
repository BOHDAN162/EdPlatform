import React from "react";
import { Link } from "../../routerShim";

const themeAccents = {
  бизнес: "#f59e0b",
  мышление: "#8A3FFC",
  финансы: "#22c55e",
  коммуникации: "#38bdf8",
  продуктивность: "#f472b6",
  лидерство: "#a855f7",
};

const CourseCard = ({ course, statusLabel, isPopular }) => {
  const accent = themeAccents[course.focus] || themeAccents[course.themeLabel] || "#8A3FFC";
  const status = statusLabel || "Новое";
  const progress = course.progress || 0;

  return (
    <div className="rounded-2xl border border-[#1f1f1f] bg-[#0c0c0c] p-4 shadow-lg flex flex-col gap-3 relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-1" style={{ background: accent }} aria-hidden />
      {isPopular && (
        <span className="absolute right-3 top-3 text-xs px-2 py-1 rounded-full bg-white/10 text-amber-300">⭐ Популярный</span>
      )}
      <div className="flex items-start justify-between text-xs text-gray-300 gap-3">
        <span className="font-semibold" style={{ color: accent }}>
          {course.focus || course.themeLabel || "Курс"} • {course.duration || "4 недели"}
        </span>
        <span className="pill outline">{status}</span>
      </div>
      <div>
        <h3 className="text-lg font-semibold leading-snug line-clamp-2">{course.title}</h3>
        <p className="text-sm text-gray-400 mt-1 line-clamp-2">{course.description}</p>
      </div>
      {progress > 0 && (
        <div className="w-full bg-[#1a1a1a] h-2 rounded-full overflow-hidden">
          <div className="h-full rounded-full" style={{ width: `${progress}%`, background: accent }} />
        </div>
      )}
      <div className="flex items-center justify-between text-sm text-gray-300 mt-auto">
        <div className="flex flex-wrap gap-2 items-center">
          <span className="pill subtle">{course.age || "13+"}</span>
          <span className="pill subtle">{course.difficulty || "средний"}</span>
        </div>
        <Link className="primary small" to={`/library/course/${course.id}`}>
          Открыть
        </Link>
      </div>
    </div>
  );
};

export default CourseCard;
