import React from "react";
import UiMockupIllustration from "../../UiMockupIllustration";
import NoesisMascotScene from "../NoesisMascotScene";

const FloatingBadge = ({ children, delay = 0 }) => (
  <div className="orbiting-badge" style={{ animationDelay: `${delay}s` }}>
    <span className="badge-dot" />
    <span>{children}</span>
  </div>
);

const VisualPanel = ({ variant = "generic", mascotVariant = "guide", compact = false }) => {
  const mascotSceneVariant = (() => {
    if (mascotVariant === "community") return "community";
    if (mascotVariant === "geek") return "library";
    if (mascotVariant === "planner") return "memory";
    if (mascotVariant === "gamer") return "missions";
    return variant === "games" ? "final" : "hero";
  })();

  const renderContent = () => {
    switch (variant) {
      case "track":
        return (
          <div className="visual-stack">
            <div className="visual-card strong">
              <div className="pill">Личный трек</div>
              <div className="track-steps">
                {["Опрос", "Мышление", "Деньги", "Проект", "Комьюнити"].map((step, idx) => (
                  <div key={step} className={`track-chip ${idx === 1 ? "active" : ""}`}>
                    <span className="badge subtle">{idx + 1}</span>
                    <div>
                      <p className="chip-title">{step}</p>
                      <p className="chip-meta">{idx === 1 ? "Сейчас" : "Далее"}</p>
                    </div>
                    <span className="pill-dot" />
                  </div>
                ))}
              </div>
              <div className="progress-shell compact">
                <div className="progress-bar" style={{ width: "56%" }} />
              </div>
            </div>
            <UiMockupIllustration variant="missions" />
          </div>
        );
      case "games":
        return (
          <div className="visual-grid games">
            {["Focus Dash", "Memory Flip", "Logic Sprint"].map((title, idx) => (
              <div key={title} className="visual-card game">
                <div className="pill subtle">MindGame</div>
                <h4>{title}</h4>
                <p className="meta">{idx === 0 ? "3 мин" : idx === 1 ? "5 мин" : "7 мин"}</p>
                <div className="game-meta">
                  <span className="pill">Рекорд {120 + idx * 30} XP</span>
                  <span className="pill outline">Челлендж</span>
                </div>
              </div>
            ))}
            <div className="visual-card stats">
              <p className="meta">Динамика</p>
              <div className="sparkline">
                {[46, 52, 64, 72, 88].map((v) => (
                  <span key={v} style={{ height: `${v}%` }} />
                ))}
              </div>
              <p className="meta success">+18% к вниманию</p>
            </div>
          </div>
        );
      case "library":
        return (
          <div className="visual-grid library">
            {["Мышление", "Бизнес", "Финансы", "Soft Skills", "MindGame", "Тест"].map((title, idx) => (
              <div key={title} className="visual-card tile">
                <p className="pill subtle">{idx % 2 === 0 ? "Видео" : "Статья"}</p>
                <h4>{title}</h4>
                <p className="meta">{idx % 2 === 0 ? "12 мин" : "8 мин"}</p>
                <div className="chip-row">
                  <span className="pill outline">В процессе</span>
                  {idx % 3 === 0 && <span className="pill accent">Завершено</span>}
                </div>
              </div>
            ))}
          </div>
        );
      case "memory":
        return (
          <div className="visual-card memory">
            <div className="pill">Память</div>
            <div className="memory-map">
              {["Идея", "Инсайт", "Решение", "План"].map((label, idx) => (
                <div key={label} className={`memory-node node-${idx}`}>
                  <span className="node-dot" />
                  <p>{label}</p>
                </div>
              ))}
            </div>
            <p className="meta">Связано с треком и материалами</p>
          </div>
        );
      case "community":
        return (
          <div className="visual-stack">
            <div className="visual-card community">
              <div className="pill">Комьюнити</div>
              <div className="avatar-grid">
                {["А", "М", "С", "Т", "Н", "Д"].map((initial, idx) => (
                  <div key={initial} className="avatar bubble" aria-hidden>
                    {initial}
                    <span className="status-dot" style={{ background: idx % 2 === 0 ? "#34d399" : "#38bdf8" }} />
                  </div>
                ))}
              </div>
              <div className="leaderboard">
                {[{ name: "Лига XP", xp: 820 }, { name: "Mind Sprint", xp: 740 }, { name: "Weekend Crew", xp: 610 }].map(
                  (row, idx) => (
                    <div key={row.name} className="leader-row">
                      <span className="badge subtle">{idx + 1}</span>
                      <div>
                        <p className="chip-title">{row.name}</p>
                        <p className="chip-meta">+{row.xp} XP</p>
                      </div>
                      <span className="pill outline">Челлендж</span>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        );
      case "change":
        return (
          <div className="visual-card change">
            <div className="pill">Прогресс</div>
            <div className="progress-shell">
              <div className="progress-bar" style={{ width: "72%" }} />
            </div>
            <div className="goal-grid">
              {["Фокус", "Энергия", "Навык", "Деньги"].map((goal) => (
                <div key={goal} className="goal-pill">
                  <span className="pill-dot" />
                  <span>{goal}</span>
                </div>
              ))}
            </div>
            <div className="sparkline">
              {[40, 48, 54, 66, 78, 92].map((v) => (
                <span key={v} style={{ height: `${v}%` }} />
              ))}
            </div>
            <p className="meta success">+24% к стабильности</p>
          </div>
        );
      default:
        return (
          <div className="visual-stack">
            <UiMockupIllustration />
            <div className="floating-card">
              <p className="meta">Мини-миссии</p>
              <h4>3 задачи на сегодня</h4>
              <div className="chip-row">
                <span className="pill">+80 XP</span>
                <span className="pill outline">Серия 4</span>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`visual-panel ${compact ? "compact" : ""}`}>
      <div className="visual-bg" />
      <div className="visual-decor orb-1" />
      <div className="visual-decor orb-2" />
      <div className="visual-content">
        <div className="visual-mascot floating">
          <NoesisMascotScene variant={mascotSceneVariant} />
        </div>
        <div className="visual-body fade-in">{renderContent()}</div>
        <div className="visual-orbits" aria-hidden>
          <FloatingBadge delay={0.2}>XP +120</FloatingBadge>
          <FloatingBadge delay={0.6}>Серия 5</FloatingBadge>
          <FloatingBadge delay={1}>Фокус</FloatingBadge>
        </div>
      </div>
    </div>
  );
};

export default VisualPanel;
