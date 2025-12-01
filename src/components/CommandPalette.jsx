import React, { useEffect, useMemo, useState } from "react";

const Badge = ({ children }) => <span className="cmd-badge">{children}</span>;

const CommandPalette = ({
  isOpen,
  onClose,
  smartCommands = [],
  staticCommands = [],
  onSelect,
}) => {
  const [query, setQuery] = useState("");
  const [highlighted, setHighlighted] = useState(0);

  const combined = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const withSmart = smartCommands
      .map((c) => ({ ...c, smart: true }))
      .filter((cmd) => {
        if (!normalized) return true;
        return (
          cmd.title?.toLowerCase().includes(normalized) || cmd.description?.toLowerCase().includes(normalized)
        );
      })
      .sort((a, b) => (b.priority || 0) - (a.priority || 0));

    const withStatic = staticCommands
      .filter((cmd) => {
        if (!normalized) return true;
        return (
          cmd.title?.toLowerCase().includes(normalized) || cmd.description?.toLowerCase().includes(normalized)
        );
      })
      .sort((a, b) => (b.priority || 0) - (a.priority || 0));

    return [...withSmart, ...withStatic];
  }, [query, smartCommands, staticCommands]);

  const smartFiltered = useMemo(() => combined.filter((c) => c.smart), [combined]);
  const hasSmart = smartFiltered.length > 0;

  useEffect(() => {
    if (!isOpen) return undefined;
    const handler = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlighted((prev) => Math.min(prev + 1, combined.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlighted((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (combined[highlighted]) {
          onSelect(combined[highlighted]);
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [combined, highlighted, isOpen, onClose, onSelect]);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setHighlighted(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="cmd-overlay" onClick={onClose}>
      <div className="cmd-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="cmd-header">
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск команд и действий"
            className="cmd-input"
          />
          <span className="cmd-hint">Esc — закрыть</span>
        </div>
        <div className="cmd-body">
          {hasSmart && (
            <div className="cmd-section">
              <div className="cmd-section-title">Рекомендации для тебя</div>
              <div className="cmd-list">
                {smartFiltered.map((cmd, idx) => {
                  const indexInCombined = combined.indexOf(cmd);
                  return (
                    <button
                      key={cmd.id}
                      className={`cmd-item ${highlighted === indexInCombined ? "active" : ""}`}
                      onMouseEnter={() => setHighlighted(indexInCombined)}
                      onClick={() => onSelect(cmd)}
                    >
                      <div className="cmd-item-top">
                        <span className="cmd-title">{cmd.title}</span>
                        <Badge>Рекомендация</Badge>
                      </div>
                      <div className="cmd-meta">
                        <span className="cmd-category">{cmd.category}</span>
                        <span className="cmd-desc">{cmd.description}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          {hasSmart && <div className="cmd-divider" />}
          <div className="cmd-section">
            <div className="cmd-section-title">Быстрые команды</div>
            <div className="cmd-list">
              {combined
                .filter((c) => !c.smart)
                .map((cmd) => {
                  const indexInCombined = combined.indexOf(cmd);
                  return (
                    <button
                      key={cmd.id}
                      className={`cmd-item ${highlighted === indexInCombined ? "active" : ""}`}
                      onMouseEnter={() => setHighlighted(indexInCombined)}
                      onClick={() => onSelect(cmd)}
                    >
                      <div className="cmd-item-top">
                        <span className="cmd-title">{cmd.title}</span>
                      </div>
                      <div className="cmd-meta">
                        <span className="cmd-category">{cmd.category}</span>
                        <span className="cmd-desc">{cmd.description}</span>
                      </div>
                    </button>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
