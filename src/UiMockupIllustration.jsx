import React from "react";

const ProgressPill = ({ label, value }) => (
  <div className="pill-row">
    <span className="pill-label">{label}</span>
    <span className="pill-value">{value}</span>
  </div>
);

const UiMockupIllustration = ({ variant = "hero" }) => {
  if (variant === "track") {
    return (
      <div className="ui-mockup">
        <div className="mock-screen">
          <div className="mock-header">
            <div className="mock-chip">Твой трек</div>
            <div className="mock-meta">5 шагов • автофокус</div>
          </div>
          <div className="mock-track">
            {["Опрос", "Мышление", "Деньги", "Проект", "Комьюнити"].map((step, idx) => (
              <div key={step} className={`track-node ${idx === 1 ? "active" : ""}`}>
                <span className="node-index">{idx + 1}</span>
                <span className="node-label">{step}</span>
              </div>
            ))}
          </div>
          <div className="mock-footer">
            <ProgressPill label="Прогресс" value="42%" />
            <ProgressPill label="Следующий шаг" value="Мышление" />
          </div>
        </div>
      </div>
    );
  }

  if (variant === "missions") {
    return (
      <div className="ui-mockup">
        <div className="mock-card accent">
          <div className="mock-chip">Миссии</div>
          <h4>Дневной прогресс</h4>
          <div className="progress-shell">
            <div className="progress-bar" style={{ width: "68%" }} />
          </div>
          <div className="mock-badges">
            <span className="badge">+120 XP</span>
            <span className="badge">Серия 5 дней</span>
          </div>
          <div className="mission-list">
            {["Пройти тест", "Запись в Памяти", "Ответ в клубе"].map((item, idx) => (
              <div key={item} className="mission-row">
                <span className="check-dot mini">✓</span>
                <div>
                  <p className="mission-title">{item}</p>
                  <p className="mission-meta">+{(idx + 1) * 30} XP</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (variant === "library") {
    return (
      <div className="ui-mockup">
        <div className="mock-card grid">
          <div className="mock-chip">Библиотека</div>
          <div className="mock-grid">
            {["Курс", "Статья", "Тест", "MindGame", "Разбор", "Мини-курс"].map((item) => (
              <div key={item} className="grid-tile">
                <div className="tile-icon" />
                <p className="tile-title">{item}</p>
                <p className="tile-meta">15–40 минут</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (variant === "memory") {
    return (
      <div className="ui-mockup">
        <div className="mock-card map">
          <div className="mock-chip">Память</div>
          <div className="map-grid">
            {["Идея", "Инсайт", "Вывод"].map((label, idx) => (
              <div key={label} className={`map-node node-${idx}`}>
                <div className="map-marker" />
                <p className="map-label">{label}</p>
              </div>
            ))}
          </div>
          <div className="mock-meta">Связано с курсами и тестами</div>
        </div>
      </div>
    );
  }

  if (variant === "community") {
    return (
      <div className="ui-mockup">
        <div className="mock-card league">
          <div className="mock-chip">Комьюнити</div>
          <div className="league-table">
            {[{ name: "Клуб Волгоград", xp: 820 }, { name: "Финансовый спринт", xp: 760 }, { name: "Лига Москвы", xp: 640 }].map((item, idx) => (
              <div key={item.name} className="league-row">
                <span className="badge subtle">{idx + 1}</span>
                <div className="avatar bubble">{item.name[0]}</div>
                <div className="league-meta">
                  <p className="league-title">{item.name}</p>
                  <p className="league-sub">+{item.xp} XP</p>
                </div>
                <span className="pill">Челлендж</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (variant === "audience") {
    return (
      <div className="ui-mockup split">
        <div className="persona-card">
          <div className="avatar bubble">Т</div>
          <p className="persona-title">Подросток</p>
          <p className="persona-meta">XP, миссии, серия дней</p>
        </div>
        <div className="persona-card">
          <div className="avatar bubble">Р</div>
          <p className="persona-title">Родитель</p>
          <p className="persona-meta">Прозрачные отчёты и прогресс</p>
        </div>
      </div>
    );
  }

  if (variant === "flow") {
    return (
      <div className="ui-mockup flow">
        {["Ответить на вопросы", "Получить трек", "Миссии и материалы", "XP и серии"].map((step, idx) => (
          <div key={step} className="flow-step">
            <span className="badge subtle">{idx + 1}</span>
            <p className="flow-title">{step}</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="ui-mockup">
      <div className="mock-screen">
        <div className="mock-header">
          <div className="mock-chip">NOESIS</div>
          <div className="mock-meta">XP • Трек • Миссии</div>
        </div>
        <div className="mock-body">
          <div className="panel-row">
            <div className="panel-pill">+50 XP</div>
            <div className="panel-line" />
            <div className="panel-pill">Серия 5</div>
          </div>
          <div className="mock-card-grid">
            {["Трек", "Миссии", "Память"].map((item) => (
              <div key={item} className="mock-card mini">
                <p className="panel-label">{item}</p>
                <p className="panel-meta">активно</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UiMockupIllustration;
