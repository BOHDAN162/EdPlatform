import React, { useEffect, useMemo, useRef } from "react";

const icons = {
  all: "✨",
  longreads: "📖",
  summaries: "📚",
  cases: "🧩",
  tests: "📝",
  mindgames: "🎮",
  checklists: "✅",
  courses: "🎓",
};

const LibraryTypeChips = ({ chips, activeType, onSelect }) => {
  const scrollRef = useRef(null);
  const chipRefs = useMemo(() => Object.fromEntries(chips.map((c) => [c.id, React.createRef()])), [chips]);

  useEffect(() => {
    const activeRef = chipRefs[activeType];
    if (activeRef?.current && scrollRef.current) {
      activeRef.current.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, [activeType, chipRefs]);

  return (
    <div className="relative">
      <div className="pointer-events-none absolute left-0 top-0 h-full w-12 bg-gradient-to-r from-[#0f0f0f] to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-[#0f0f0f] to-transparent" />
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-1 pr-2"
      >
        {chips.map((chip) => {
          const isActive = activeType === chip.id;
          return (
            <button
              key={chip.id}
              ref={chipRefs[chip.id]}
              className={`chip transition-transform duration-200 snap-start whitespace-nowrap ${
                isActive ? "active scale-[1.05] text-base" : "text-sm"
              }`}
              onClick={() => onSelect(chip)}
            >
              <span className="mr-1" aria-hidden>
                {icons[chip.id] || "•"}
              </span>
              {chip.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default LibraryTypeChips;
