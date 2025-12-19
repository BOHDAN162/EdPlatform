import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "../../routerShim";

const popularQueries = [
  "финансы",
  "продуктивность",
  "переговоры",
  "мышление",
  "привычки",
  "самооценка",
  "маркетинг",
  "команда",
];

const defaultRecent = [
  { id: "course-finance", title: "Финансовый старт", to: "/library/course/course-finance" },
  { id: "test-habits", title: "Привычки предпринимателя", to: "/library/test/test-habits" },
  { id: "article-productivity", title: "Фокус за 20 минут", to: "/library/article/article-productivity" },
];

const LibrarySearchBar = ({ query, onChange, materials, onApplySuggestion, onOpenFilters }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [recent, setRecent] = useState(defaultRecent);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("library-recent");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length) setRecent(parsed);
      } catch (e) {
        /* noop */
      }
    }
  }, []);

  useEffect(() => {
    const onEsc = (e) => {
      if (e.key === "Escape") setIsFocused(false);
    };
    const onClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("keydown", onEsc);
    document.addEventListener("click", onClickOutside);
    return () => {
      document.removeEventListener("keydown", onEsc);
      document.removeEventListener("click", onClickOutside);
    };
  }, []);

  const suggestions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return [
        { label: "Популярные запросы", items: popularQueries.map((q) => ({ id: q, title: q })) },
        { label: "Недавно смотрели", items: recent },
      ];
    }
    const matches = materials
      .filter((item) => item.title.toLowerCase().includes(normalizedQuery))
      .slice(0, 6)
      .map((item) => ({ id: item.id, title: item.title, to: item.to || item.link || `/library/${item.type}/${item.id}` }));
    return [{ label: "Совпадения", items: matches.length ? matches : [{ id: "no", title: "Ничего не нашли" }] }];
  }, [materials, query, recent]);

  const handleSelect = (item) => {
    if (item.id === "no") return;
    onChange(item.title);
    onApplySuggestion?.(item);
    if (typeof window !== "undefined") {
      const updated = [item, ...recent].slice(0, 6);
      setRecent(updated);
      window.localStorage.setItem("library-recent", JSON.stringify(updated));
    }
    setIsFocused(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="flex items-center gap-2 rounded-2xl border border-[#262626] bg-[#0b0b0b] px-3 py-2 shadow-sm focus-within:ring-1 focus-within:ring-[#8A3FFC]">
        <span aria-hidden className="text-lg opacity-80">🔍</span>
        <input
          type="search"
          className="w-full bg-transparent outline-none placeholder:text-gray-400/80 text-sm md:text-base"
          placeholder="Поиск по материалам и авторам"
          value={query}
          onFocus={() => setIsFocused(true)}
          onChange={(e) => onChange(e.target.value)}
        />
        {query && (
          <button
            className="text-gray-400 hover:text-white transition"
            onClick={() => {
              onChange("");
              setIsFocused(false);
            }}
            aria-label="Очистить поиск"
          >
            ✕
          </button>
        )}
        <button
          className="p-2 rounded-xl bg-[#161616] border border-[#2a2a2a] hover:border-[#8A3FFC] transition"
          onClick={onOpenFilters}
          aria-label="Фильтры"
        >
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" aria-hidden>
            <path
              d="M4 6h16M7 12h10M10 18h4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
      {isFocused && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 mt-2 rounded-2xl border border-[#1f1f1f] bg-[#0b0b0b] shadow-xl z-20 max-h-72 overflow-y-auto">
          {suggestions.map((group) => (
            <div key={group.label} className="py-2 px-3 border-b border-[#151515] last:border-0">
              <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">{group.label}</p>
              <div className="space-y-1">
                {group.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-2 rounded-xl px-2 py-2 hover:bg-white/5 cursor-pointer"
                    onClick={() => handleSelect(item)}
                  >
                    <span className="text-sm text-gray-100">{item.title}</span>
                    {item.to && item.to.startsWith("/") ? (
                      <Link
                        to={item.to}
                        className="text-xs text-violet-300 hover:text-white"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Открыть
                      </Link>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LibrarySearchBar;
