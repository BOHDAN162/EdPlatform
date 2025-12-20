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

const LibrarySearchBar = ({ query, onChange, materials, onApplySuggestion }) => {
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
      <div className="flex items-center gap-2 rounded-2xl border px-3 py-2 shadow-sm input-surface">
        <span aria-hidden className="text-lg opacity-80">🔍</span>
        <input
          type="search"
          className="theme-input w-full bg-transparent outline-none text-sm md:text-base"
          placeholder="Поиск по материалам и авторам"
          value={query}
          onFocus={() => setIsFocused(true)}
          onChange={(e) => onChange(e.target.value)}
        />
        {query && (
          <button
            className="transition text-[color:var(--text-muted)] hover:text-[color:var(--text)]"
            onClick={() => {
              onChange("");
              setIsFocused(false);
            }}
            aria-label="Очистить поиск"
          >
            ✕
          </button>
        )}
      </div>
      {isFocused && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 mt-2 rounded-2xl border surface-popover shadow-xl z-20 max-h-72 overflow-y-auto">
          {suggestions.map((group) => (
            <div key={group.label} className="py-2 px-3 border-b border-[var(--border)] last:border-0">
              <p className="text-xs uppercase tracking-wide muted-text mb-1">{group.label}</p>
              <div className="space-y-1">
                {group.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-2 rounded-xl px-2 py-2 hover:bg-[color-mix(in_srgb,var(--surface-2)_80%,transparent)] cursor-pointer"
                    onClick={() => handleSelect(item)}
                  >
                    <span className="text-sm" style={{ color: "var(--text)" }}>{item.title}</span>
                    {item.to && item.to.startsWith("/") ? (
                      <Link
                        to={item.to}
                        className="text-xs font-semibold"
                        style={{ color: "var(--accent)" }}
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
