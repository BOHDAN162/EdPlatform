import React from "react";
import NoesisMascotScene from "./NoesisMascotScene";

const StepPath = () => (
  <div className="path-visual">
    {["Опрос", "Маршрут", "Награды", "Прогресс"].map((step, idx) => (
      <div key={step} className="path-node">
        <span className="node-index">{idx + 1}</span>
        <div className="node-labels">
          <span className="node-title">{step}</span>
          <span className="node-meta">{idx === 0 ? "<10 минут" : idx === 3 ? "статусы" : "активный шаг"}</span>
        </div>
        {idx < 3 && <div className="node-connector" />}
      </div>
    ))}
  </div>
);

const TrackLines = () => (
  <div className="track-visual">
    {[0, 1].map((row) => (
      <div key={row} className="track-row">
        {[0, 1, 2, 3, 4].map((col) => {
          const index = row * 5 + col + 1;
          const active = index === 3;
          return (
            <div key={index} className={`track-step ${active ? "active" : ""}`}>
              <span className="step-index">{index}</span>
              <span className="step-label">{row === 0 ? "Шаг" : "Фокус"} {col + 1}</span>
            </div>
          );
        })}
      </div>
    ))}
  </div>
);

const LibraryGrid = () => (
  <div className="library-visual">
    {["Курс", "Статья", "Тест", "Игра"].map((item, idx) => (
      <div key={item} className="library-card">
        <div className="card-icon" />
        <div>
          <p className="card-title">{item}</p>
          <p className="card-meta">{idx === 0 ? "12 уроков" : idx === 1 ? "15 мин" : idx === 2 ? "+80 XP" : "реакция"}</p>
        </div>
        <div className="progress-shell mini">
          <div className="progress-bar" style={{ width: `${40 + idx * 15}%` }} />
        </div>
      </div>
    ))}
  </div>
);

const MemoryCity = () => (
  <div className="memory-visual">
    {["башня", "мост", "купол", "сити"].map((item, idx) => (
      <div key={item} className={`city-block city-${item}`} style={{ animationDelay: `${idx * 0.25}s` }}>
        <div className="city-top" />
        <div className="city-body" />
        <div className="city-base" />
      </div>
    ))}
    <div className="city-ground" />
  </div>
);

const LeagueTable = () => (
  <div className="league-visual">
    {["Лига городов", "XP-сезон", "Команды"].map((title, idx) => (
      <div key={title} className="league-row">
        <div className="avatar badge">{idx + 1}</div>
        <div>
          <p className="league-title">{title}</p>
          <p className="league-meta">{idx === 0 ? "Москва 920 XP" : idx === 1 ? "7 дней" : "Команда 5"}</p>
        </div>
        <span className="pill">Челлендж</span>
      </div>
    ))}
  </div>
);

const AudienceSplit = () => (
  <div className="audience-visual">
    <div className="audience-card">
      <div className="avatar bubble">Т</div>
      <p className="audience-title">Если ты подросток…</p>
      <p className="audience-meta">Игровой маршрут, миссии, XP и понятный прогресс.</p>
    </div>
    <div className="audience-card">
      <div className="avatar bubble">Р</div>
      <p className="audience-title">Если ты родитель…</p>
      <p className="audience-meta">Система развития с отчётами и точками роста.</p>
    </div>
  </div>
);

const visuals = {
  hero: <NoesisMascotScene variant="hero" />,
  steps: <StepPath />,
  track: <TrackLines />,
  missions: <NoesisMascotScene variant="missions" />,
  library: <LibraryGrid />,
  memory: <MemoryCity />,
  community: <NoesisMascotScene variant="community" />,
  audience: <AudienceSplit />,
  final: <NoesisMascotScene variant="final" />,
};

const LandingVisual = ({ variant }) => visuals[variant] || null;

export default LandingVisual;
