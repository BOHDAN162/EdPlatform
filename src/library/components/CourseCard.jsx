import React from "react";
import { Link } from "../../routerShim";
import CardActionLink from "./CardActionLink";

const themeAccents = {
  бизнес: "#f59e0b",
  мышление: "#8A3FFC",
  финансы: "#22c55e",
  коммуникации: "#38bdf8",
  продуктивность: "#f472b6",
  лидерство: "#a855f7",
};

const CourseCard = ({ course, statusLabel }) => {
  const accent = themeAccents[course.focus] || themeAccents[course.themeLabel] || "#8A3FFC";
  const status = statusLabel || "Новое";
  const progress = course.progress || 0;

  return (
    <Link
      to={`/library/course/${course.id}`}
      className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-lg flex flex-col gap-3 relative overflow-hidden transition duration-200 ease-out hover:-translate-y-1 hover:shadow-2xl hover:border-[var(--accent)]/60"
    >
      <div className="absolute inset-x-0 top-0 h-1" style={{ background: accent }} aria-hidden />
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
        <CardActionLink />
      </div>
    </Link>
  );
};

export default CourseCard;
