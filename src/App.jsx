import React, { useEffect, useMemo, useState } from "react";
import { BrowserRouter, Routes, Route, Link, useNavigate, useParams, useLocation } from "./routerShim";
import {
  awardForCommunityAction,
  awardForMaterial,
  awardForTest,
  awardForInlineQuiz,
  awardForMission,
  awardForMindGame,
  defaultGamification,
  getXPConfig,
  getStatusByPoints,
  getLevelFromPoints,
  loadGamification,
  progressToNextStatus,
} from "./gamification";
import { tests } from "./data";
import { communityParticipants } from "./communityData";
import { learningPaths, materialThemes, materials, getMaterialById, themeLabels } from "./libraryData";
import { getPathProgress, loadProgress, markMaterialCompleted } from "./progress";
import PathCard from "./components/PathCard";
import TrackQuizPage from "./TrackQuizPage";
import LibraryTrackView from "./components/LibraryTrackView";
import MindGamesSection from "./components/MindGamesSection";
import LibraryCard from "./components/LibraryCard";
import { loadCurrentUser, loginUser, logoutUser, registerUser } from "./auth";
import { clearTrack, loadTrack, saveTrack } from "./trackStorage";
import ProfileDashboard from "./ProfileDashboard";
import { clearActivityLog, useActivityLog } from "./hooks/useActivityLog";
import CommunityPage from "./community/CommunityPage";
import MaterialPage from "./MaterialPage";
import MissionsPage from "./MissionsPage";
import { useMissions } from "./hooks/useMissions";
import { useTheme } from "./hooks/useTheme";
import { useToasts } from "./hooks/useToasts";
import AppLayout from "./components/layout/AppLayout";
import { statusFromProgress, statusProgressValue } from "./utils/materialStatus";
import { baseCommunityState, createCommunityPost, loadCommunityState, saveCommunityState } from "./communityState";
import MemoryPage from "./MemoryPage";
import CommandPalette from "./components/CommandPalette";
import { useSmartCommands, useLastVisit } from "./hooks/useSmartCommands";
import { navLinks } from "./utils/navigation";
import { useMemory } from "./hooks/useMemory";
import { useStartPath } from "./hooks/useStartPath";

const typeFilterOptions = [
  { id: "all", label: "Все" },
  { id: "course", label: "Курсы" },
  { id: "article", label: "Лонгриды" },
  { id: "test", label: "Тесты" },
  { id: "game", label: "Игры" },
];

const MascotOrbit = () => (
  <div className="mascot-orbit">
    <div className="mascot-glow" />
    <div className="mascot-circle floating">
      <img src="/assets/noesis-mascot.png" alt="NOESIS маскот" className="mascot-image" />
    </div>
    {["Твой трек", "Награды", "Прогресс"].map((label, idx) => (
      <div key={label} className={`mascot-pill pill-${idx + 1}`}>
        <span>{label}</span>
      </div>
    ))}
  </div>
);

const TrackPathVisual = () => (
  <div className="track-path-visual card glassy">
    <div className="path-row">
      {Array.from({ length: 5 }).map((_, idx) => (
        <div key={`top-${idx}`} className={`path-node ${idx === 2 ? "active" : ""}`} style={{ animationDelay: `${idx * 0.08}s` }}>
          <span className="node-dot" />
        </div>
      ))}
    </div>
    <div className="path-arrow" />
    <div className="path-row">
      {Array.from({ length: 5 }).map((_, idx) => (
        <div
          key={`bottom-${idx}`}
          className={`path-node ${idx === 0 ? "up-next" : idx === 1 ? "active" : ""}`}
          style={{ animationDelay: `${idx * 0.08}s` }}
        >
          <span className="node-dot" />
        </div>
      ))}
    </div>
  </div>
);

const RewardsVisual = () => (
  <div className="rewards-visual card glassy">
    <div className="badge-row">
      {["Серый", "Серебро", "Золото", "Фиолет", "Изумруд"].map((title, idx) => (
        <div key={title} className={`badge badge-${idx + 1}`} style={{ animationDelay: `${idx * 0.1}s` }}>
          <span className="badge-icon">★</span>
          <span className="badge-label">{title}</span>
        </div>
      ))}
    </div>
    <div className="xp-bar">
      <div className="xp-fill" />
      <div className="xp-shimmer" />
    </div>
    <div className="streak">
      <div className="streak-flame" />
      <div>
        <p className="streak-title">7-дневный стрик</p>
        <p className="streak-meta">держи темп — +120 XP</p>
      </div>
    </div>
  </div>
);

const LibraryDeviceVisual = () => (
  <div className="device-visual card glassy">
    {["Курс", "Статья", "Тест", "Игра"].map((item, idx) => (
      <div key={item} className={`device-card ${idx === 1 ? "highlight" : ""}`} style={{ animationDelay: `${idx * 0.12}s` }}>
        <div className="card-dot" />
        <div>
          <p className="device-title">{item}</p>
          <p className="device-meta">{idx === 0 ? "12 уроков" : idx === 1 ? "следующий шаг" : idx === 2 ? "+80 XP" : "мини-игра"}</p>
        </div>
        <div className="device-progress">
          <div style={{ width: `${50 + idx * 12}%` }} />
        </div>
      </div>
    ))}
  </div>
);

const CommunityVisual = () => (
  <div className="community-visual card glassy">
    <div className="community-core">
      <img src="/assets/noesis-mascot.png" alt="NOESIS маскот" className="community-mascot" />
      <div className="orb" />
    </div>
    {["Мск", "СПб", "Алматы", "Онлайн", "Лига"].map((city, idx) => (
      <div key={city} className={`community-avatar avatar-${idx + 1}`}> {city} </div>
    ))}
    <div className="chat-bubble bubble-1">«Ребята, делимся прогрессом по миссии?»</div>
    <div className="chat-bubble bubble-2">«Давайте созвонимся завтра в 18:00»</div>
  </div>
);

const FeatureSection = ({ kicker, title, subtitle, bullets = [], visual, reverse = false }) => (
  <section className="feature-section">
    <div className="home-container">
      <div className={`feature-grid ${reverse ? "reverse" : ""}`}>
        <div className="feature-copy">
          {kicker && <p className="landing-kicker">{kicker}</p>}
          <h2>{title}</h2>
          {subtitle && <p className="feature-subtitle">{subtitle}</p>}
          {bullets.length > 0 && (
            <ul className="feature-bullets">
              {bullets.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
        </div>
        <div className="feature-visual" aria-hidden>
          {visual}
        </div>
      </div>
    </div>
  </section>
);

const FinalCtaSection = ({ onStart }) => (
  <section className="cta-section">
    <div className="home-container">
      <div className="cta-card gradient-panel">
        <p className="landing-kicker">Финишная прямая</p>
        <h2>Готов начать путь?</h2>
        <p className="feature-subtitle">
          Пройди короткий опрос, получи личный трек и первую миссию уже сегодня.
        </p>
        <button className="primary hero-cta" onClick={onStart}>
          Старт
        </button>
      </div>
    </div>
  </section>
);

const HomePage = ({ trackData }) => {
  const quotes = useMemo(
    () => [
      "С каждым днём по маленькому шагу — и ты уже далеко.",
      "Ошибки — это подсказки, а не приговор.",
      "Сильные проекты рождаются из смелых вопросов.",
      "День без действий — день без прогресса.",
      "Лучший момент начать был вчера, второй лучший — сейчас.",
      "Сравнивай себя только с тем, кем был вчера.",
      "Деньги любят порядок и ясный план.",
      "Лидеры растут, когда помогают другим расти.",
      "Риск — это билет в новый опыт.",
      "Не жди идеальных условий, создавай их.",
      "Голос уверенности звучит после практики.",
      "Мечта становится целью, когда есть дедлайн.",
      "Сильная команда начинается с честного диалога.",
      "Каждый прототип — это шаг к лучшему решению.",
      "Фокусируйся на том, что можешь сделать сегодня.",
      "Задай вопрос — и ты уже на шаг умнее.",
      "Маленькие победы складываются в уровень.",
      "Финансовая грамотность — щит и меч создателя.",
      "Вдохновение приходит к тем, кто действует.",
      "Ты не один: комьюнити рядом, чтобы помочь.",
    ],
    []
  );
  const [quoteIndex] = useState(() => Math.floor(Math.random() * quotes.length));
  const [quoteVisible, setQuoteVisible] = useState(false);
  const handleStartJourney = useStartPath(trackData);

  useEffect(() => {
    setQuoteVisible(true);
  }, []);

  const featureSections = [
    {
      kicker: "Личный трек развития",
      title: "Личный трек развития",
      subtitle: "Ответь на 10 вопросов — и мы соберём твой план: профиль, миссии и первый урок.",
      bullets: ["Фокус на ключевой цели", "План на 30–90 дней", "Прогресс виден в профиле"],
      visual: <TrackPathVisual />,
    },
    {
      kicker: "Геймификация и награды",
      title: "Геймификация и награды",
      subtitle: "Баллы, статусы и челленджи поддерживают темп и делают развитие игрой.",
      bullets: [
        "XP за материалы, тесты и челленджи",
        "Статусы за серию дней и общее XP",
        "Дуэли с друзьями и группами",
        "Вся статистика — в профиле",
      ],
      visual: <RewardsVisual />,
      reverse: true,
    },
    {
      kicker: "Библиотека",
      title: "Курсы, статьи и тесты в одном месте",
      subtitle: "Майндсет, финансы, навыки, коммуникации и эффективность — выбирай, что нужно именно сейчас.",
      bullets: ["Майндсет", "Финансы", "Навыки", "Коммуникации", "Эффективность"],
      visual: <LibraryDeviceVisual />,
    },
    {
      kicker: "Комьюнити",
      title: "Комьюнити, события и челленджи",
      subtitle: "Чаты, клубы по городам и лиги XP — вокруг тебя ребята, которые поддержат и подтолкнут.",
      bullets: ["Чаты и встречи по темам", "Команды и клубы", "Общие челленджи и рейтинги"],
      visual: <CommunityVisual />,
      reverse: true,
    },
  ];

  return (
    <div className="page home-page new-landing">
      <section className="home-hero">
        <div className="home-container">
          <div className="hero-card gradient-panel">
            <p className="hero-label">ПЛАТФОРМА РАЗВИТИЯ</p>
            <h1>БУДЬ ЛУЧШЕ ВЧЕРАШНЕГО СЕБЯ</h1>
            <p className="hero-subtitle">
              Ответь на 10 вопросов — и мы соберём твой личный план: профиль, миссии и первый урок.
            </p>
            <div className={`hero-tip-card ${quoteVisible ? "visible" : ""}`}>
              <span className="tip-label">СОВЕТ ДНЯ</span>
              <p className="tip-quote">{quotes[quoteIndex]}</p>
            </div>
            <button className="primary hero-cta" onClick={handleStartJourney}>
              Начать
            </button>
            <ul className="hero-bullets">
              <li>Пройди короткую регистрацию</li>
              <li>Активируй подписку и выбери трек</li>
              <li>Учись, проходи тесты и собирай очки</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="why-section">
        <div className="home-container">
          <div className="why-card gradient-panel">
            <div className="why-copy">
              <p className="hero-label">ПОЧЕМУ NOESIS</p>
              <h2>Платформа роста для подростков и детей предпринимателей</h2>
              <p className="feature-subtitle">
                Одно место, где трек, миссии, библиотека и комьюнити собираются в понятный маршрут.
              </p>
              <ul className="feature-bullets">
                <li>Личный трек под твои цели</li>
                <li>Геймификация и награды за активность</li>
                <li>Фокус на мышлении, деньгах, проектах</li>
                <li>Комьюнити, которое поддержит и не даст слиться</li>
              </ul>
            </div>
            <div className="why-visual" aria-hidden>
              <MascotOrbit />
            </div>
          </div>
        </div>
      </section>

      {featureSections.map((section, idx) => (
        <FeatureSection key={section.title} reverse={idx % 2 === 1 || section.reverse} {...section} />
      ))}

      <FinalCtaSection onStart={handleStartJourney} />
    </div>
  );
};

const LibraryPage = ({
  completedMaterialIds,
  trackData,
  user,
  onMindGameComplete,
  onTrackUpdate,
  onRetakeTrack,
}) => {
  const navigate = useNavigate();
  const completedSet = useMemo(() => new Set(completedMaterialIds || []), [completedMaterialIds]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [themeFilter, setThemeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [scopeFilter, setScopeFilter] = useState(trackData?.trackSteps?.length ? "track" : "all");
  const [selectedId, setSelectedId] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(
    () => (typeof window !== "undefined" ? window.innerWidth >= 960 : true)
  );

  const trackMaterials = useMemo(() => {
    const steps = trackData?.trackSteps || [];
    const ids = steps.flatMap((step) => step.materialId || step.materials || []);
    return new Set(ids.filter(Boolean));
  }, [trackData]);

  const activeTrackMaterialId = useMemo(() => {
    if (!trackData?.trackSteps?.length) return null;
    const firstIncomplete = trackData.trackSteps.find((step) => {
      const candidate = step.materialId || step.materials?.[0];
      return candidate && !completedSet.has(candidate);
    });
    return firstIncomplete?.materialId || firstIncomplete?.materials?.[0] || null;
  }, [trackData, completedSet]);

  const filteredMaterials = useMemo(() => {
    const query = search.trim().toLowerCase();
    return materials.filter((material) => {
      if (scopeFilter === "track" && trackMaterials.size && !trackMaterials.has(material.id)) return false;
      if (typeFilter !== "all" && material.type !== typeFilter) return false;
      if (themeFilter !== "all" && material.theme !== themeFilter) return false;
      const status = statusFromProgress(material.id, completedSet, activeTrackMaterialId);
      if (statusFilter !== "all" && status !== statusFilter) return false;
      if (!query) return true;
      return (
        material.title.toLowerCase().includes(query) ||
        material.description?.toLowerCase().includes(query)
      );
    });
  }, [search, typeFilter, themeFilter, statusFilter, scopeFilter, completedSet, activeTrackMaterialId, trackMaterials]);

  useEffect(() => {
    if (filteredMaterials.length === 0) {
      setSelectedId(null);
      return;
    }
    if (!filteredMaterials.find((m) => m.id === selectedId)) {
      setSelectedId(filteredMaterials[0].id);
    }
  }, [filteredMaterials, selectedId]);

  const selectedMaterial = useMemo(
    () => filteredMaterials.find((m) => m.id === selectedId) || null,
    [filteredMaterials, selectedId]
  );

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 960) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleRetake = () => {
    onRetakeTrack?.();
    navigate("/track-quiz");
  };

  const statusOptions = [
    { id: "all", label: "Все" },
    { id: "new", label: "Новое" },
    { id: "inProgress", label: "В процессе" },
    { id: "completed", label: "Завершено" },
  ];

  const openMaterial = (materialId) => navigate(`/material/${materialId}`);

  const libraryLayoutClass = `library-layout ${isSidebarOpen ? "" : "sidebar-collapsed"}`;
  const statusLabels = { new: "Новое", inProgress: "В процессе", completed: "Завершено" };

  return (
    <div className="page library-page">
      <div className="page-header">
        <div>
          <h1>Библиотека</h1>
          <p className="meta large">
            Курсы, лонгриды, тесты и игры для прокачки мышления, финансов и навыков.
          </p>
        </div>
      </div>

      <div className={libraryLayoutClass}>
        <aside className={`library-sidebar card ${isSidebarOpen ? "" : "collapsed"}`}>
          <div className="filter-group">
            <p className="filter-title">Типы</p>
            <div className="filter-chips">
              {typeFilterOptions.map((option) => (
                <button
                  key={option.id}
                  className={`chip ${typeFilter === option.id ? "active" : ""}`}
                  onClick={() => setTypeFilter(option.id)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <p className="filter-title">Темы</p>
            <div className="filter-chips column">
              <button
                className={`chip ${themeFilter === "all" ? "active" : ""}`}
                onClick={() => setThemeFilter("all")}
              >
                Все
              </button>
              {materialThemes.map((theme) => (
                <button
                  key={theme.id}
                  className={`chip ${themeFilter === theme.id ? "active" : ""}`}
                  onClick={() => setThemeFilter(theme.id)}
                >
                  {theme.title}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <p className="filter-title">Область</p>
            <div className="chip-row">
              <button
                className={`chip ${scopeFilter === "track" ? "active" : ""}`}
                onClick={() => setScopeFilter("track")}
              >
                Только в моём треке
              </button>
              <button
                className={`chip ${scopeFilter === "all" ? "active" : ""}`}
                onClick={() => setScopeFilter("all")}
              >
                Все материалы
              </button>
            </div>
          </div>
        </aside>

        <section className="library-main">
          <div className="library-toolbar card">
            <div className="toolbar-left">
              <button className="ghost filter-toggle" onClick={() => setSidebarOpen((prev) => !prev)}>
                <span className="filter-icon">{isSidebarOpen ? "←" : "→"}</span>
                {isSidebarOpen ? "Свернуть фильтры" : "Фильтры"}
              </button>
              <div className="search-block">
                <label className="meta subtle" htmlFor="library-search">Поиск</label>
                <input
                  id="library-search"
                  type="search"
                  placeholder="Поиск по материалам…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="toolbar-actions">
              <div className="chip-row">
                {statusOptions.map((option) => (
                  <button
                    key={option.id}
                    className={`chip ${statusFilter === option.id ? "active" : ""}`}
                    onClick={() => setStatusFilter(option.id)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              <button className="ghost focus-btn">Пройти сессию фокуса (20 минут)</button>
            </div>
          </div>

          <LibraryTrackView
            track={trackData}
            materials={materials}
            completedMaterialIds={completedMaterialIds}
            onUpdateSteps={(steps) => onTrackUpdate?.({ trackSteps: steps, generatedTrack: steps })}
            onRetake={handleRetake}
          />

          <div className="card">
            <div className="card-header">Твои дорожки</div>
            <div className="path-grid">
              {learningPaths.map((path) => (
                <PathCard
                  key={path.id}
                  path={path}
                  progress={getPathProgress(path, completedMaterialIds)}
                  onOpen={() => navigate(`/library/paths/${path.slug}`)}
                />
              ))}
            </div>
          </div>

          <MindGamesSection userId={user?.id} onGameComplete={onMindGameComplete} />

          <div className="card materials-card">
            <div className="card-header-row">
              <div>
                <div className="card-header">Все материалы</div>
                <p className="meta">Карточки курсов, лонгридов, тестов и игр в едином стиле.</p>
              </div>
            </div>
            <div className="material-grid">
              {filteredMaterials.map((material) => {
                const status = statusFromProgress(material.id, completedSet, activeTrackMaterialId);
                const theme = themeLabels[material.theme] || { title: "Тема", accent: "#7c3aed" };
                const typeLabel = typeFilterOptions.find((t) => t.id === material.type)?.label || "Материал";

                return (
                  <LibraryCard
                    key={material.id}
                    onClick={() => setSelectedId(material.id)}
                    active={selectedId === material.id}
                    badges={[
                      <span key="type" className="pill outline">{typeLabel}</span>,
                      <span
                        key="theme"
                        className="material-badge"
                        style={{ background: `${theme.accent}20`, color: theme.accent }}
                      >
                        {theme.title}
                      </span>,
                      <span key="status" className={`pill status ${status}`}>
                        {statusLabels[status]}
                      </span>,
                      trackMaterials.has(material.id) ? <span key="track" className="pill accent">Трек</span> : null,
                    ].filter(Boolean)}
                    title={material.title}
                    description={material.description}
                    progress={statusProgressValue[status] || 0}
                    footer={
                      <div className="material-card-footer">
                        <span className="material-foot-note">{material.estimatedTime || "15 минут"}</span>
                        <button
                          className="ghost small"
                          onClick={(e) => {
                            e.stopPropagation();
                            openMaterial(material.id);
                          }}
                        >
                          Открыть
                        </button>
                      </div>
                    }
                  />
                );
              })}
              {filteredMaterials.length === 0 && (
                <div className="empty-state">
                  <p>Нет материалов по выбранным фильтрам.</p>
                </div>
              )}
            </div>
          </div>

          {selectedMaterial && (
            <div className="card detail-card material-detail-card">
              <div className="panel-header">
                <div>
                  <p className="section-kicker">Детали</p>
                  <h3>{selectedMaterial.title}</h3>
                </div>
                <button className="ghost" onClick={() => openMaterial(selectedMaterial.id)}>Открыть полностью</button>
              </div>
              <div className="chip-row">
                <span
                  className="material-badge"
                  style={{ background: `${(themeLabels[selectedMaterial.theme]?.accent || "#7c3aed")}20`, color: themeLabels[selectedMaterial.theme]?.accent || "#7c3aed" }}
                >
                  {themeLabels[selectedMaterial.theme]?.title || "Тема"}
                </span>
                <span className="material-badge outline">{selectedMaterial.type === "course" ? "Курс" : selectedMaterial.type === "article" ? "Лонгрид" : "Тест"}</span>
                <span className="material-badge outline">{selectedMaterial.estimatedTime || "15 минут"}</span>
              </div>
              <p className="meta">{selectedMaterial.description}</p>
              <div className="detail-actions">
                <button className="primary" onClick={() => openMaterial(selectedMaterial.id)}>
                  Начать / продолжить
                </button>
                <button className="ghost" onClick={() => navigate("/")}>На главную</button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

const LearningPathPage = ({ completedMaterialIds }) => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const path = learningPaths.find((p) => p.slug === slug);

  if (!path) {
    return (
      <div className="page">
        <div className="card">
          <p>Дорожка не найдена.</p>
          <button className="ghost" onClick={() => navigate(-1)}>Назад</button>
        </div>
      </div>
    );
  }

  const progress = getPathProgress(path, completedMaterialIds);
  const theme = themeLabels[path.theme] || { accent: "#6b7280", title: "Тема" };
  const completedSet = new Set(completedMaterialIds);
  const nextId = path.materials.find((m) => !completedSet.has(m)) || path.materials[0];
  const nextMaterial = getMaterialById(nextId);

  const goToMaterial = (materialId) => {
    const target = getMaterialById(materialId);
    if (!target) return;
    navigate(`/material/${target.id}`);
  };

  const ratio = progress.totalCount ? Math.round((progress.completedCount / progress.totalCount) * 100) : 0;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>{path.title}</h1>
          <p className="meta">{path.description}</p>
        </div>
        <button className="ghost" onClick={() => navigate(-1)}>Назад</button>
      </div>
      <div className="card path-detail">
        <div className="path-detail-header">
          <span className="path-theme" style={{ background: `${theme.accent}20`, color: theme.accent }}>
            {theme.title}
          </span>
          <span className="path-progress">{progress.completedCount} / {progress.totalCount} шагов</span>
        </div>
        <div className="progress-shell large">
          <div className="progress-fill" style={{ width: `${ratio}%` }} />
        </div>
        <p className="meta">
          {progress.completedCount === 0
            ? "Начни с первого шага, чтобы разогнаться"
            : progress.completedCount === progress.totalCount
            ? "Все шаги закрыты — можно повторить или выбрать новую дорожку"
            : `Следующий шаг под номером ${progress.completedCount + 1}`}
        </p>
        {nextMaterial && (
          <button className="primary" onClick={() => goToMaterial(nextMaterial.id)}>
            {completedSet.has(nextMaterial.id) ? "Повторить" : "Продолжить"}: {nextMaterial.title}
          </button>
        )}
      </div>

      <div className="card">
        <div className="card-header">Шаги дорожки</div>
        <div className="path-steps">
          {path.materials.map((materialId, idx) => {
            const material = getMaterialById(materialId);
            const done = completedSet.has(materialId);
            if (!material) return null;
            return (
              <div key={materialId} className={`path-step ${done ? "done" : ""}`}>
                <div className="path-step-index">{idx + 1}</div>
                <div className="path-step-body">
                  <div className="path-step-top">
                    <div className="path-step-title">{material.title}</div>
                    <span className="material-badge outline">{material.type === "course" ? "Курс" : material.type === "article" ? "Статья" : "Тест"}</span>
                  </div>
                  <p className="meta">{material.description}</p>
                  <div className="path-step-meta">{material.estimatedTime} • Уровень: {material.level}</div>
                </div>
                <button className="ghost" onClick={() => goToMaterial(material.id)}>{done ? "Повторить" : "Открыть"}</button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const AuthPage = ({ onAuth }) => {
  const [tab, setTab] = useState("login");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    age: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "", form: "" }));
  };

  const validateEmail = (email) => /[^\s@]+@[^\s@]+\.[^\s@]+/.test(email);

  const handleSubmit = () => {
    const nextErrors = {};
    if (tab === "register") {
      if (!form.firstName.trim()) nextErrors.firstName = "Имя обязательно";
      if (!form.lastName.trim()) nextErrors.lastName = "Фамилия обязательна";
      if (!form.age) nextErrors.age = "Возраст обязателен";
      if (!form.email.trim()) nextErrors.email = "Email обязателен";
      if (form.email && !validateEmail(form.email)) nextErrors.email = "Некорректный email";
      if (!form.password) nextErrors.password = "Пароль обязателен";
      if (!form.confirmPassword) nextErrors.confirmPassword = "Подтверждение пароля обязательно";
      if (form.password && form.confirmPassword && form.password !== form.confirmPassword) {
        nextErrors.confirmPassword = "Пароли не совпадают";
      }

      if (Object.keys(nextErrors).length) {
        setErrors(nextErrors);
        return;
      }
      const res = registerUser({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        age: form.age,
        email: form.email.trim(),
        password: form.password,
      });
      if (!res.ok) {
        setErrors({ form: res.error || "Ошибка регистрации" });
        return;
      }
      onAuth(res.user);
      navigate("/profile");
      return;
    }

    if (!form.email.trim()) nextErrors.email = "Email обязателен";
    if (!form.password) nextErrors.password = "Пароль обязателен";
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }
    const res = loginUser({ email: form.email.trim(), password: form.password });
    if (!res.ok) {
      setErrors({ form: "Неверный email или пароль" });
      return;
    }
    onAuth(res.user);
    navigate("/profile");
  };

  return (
    <div className="page auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div>
            <p className="hero-kicker">NOESIS</p>
            <h1>{tab === "login" ? "Вход" : "Регистрация"}</h1>
          </div>
          <div className="tabs">
            <button className={tab === "login" ? "tab active" : "tab"} onClick={() => setTab("login")}>
              Войти
            </button>
            <button className={tab === "register" ? "tab active" : "tab"} onClick={() => setTab("register")}>Регистрация</button>
          </div>
        </div>

        {tab === "register" && (
          <p className="auth-note">Регистрация нужна, чтобы сохранять твой прогресс, XP и достижения.</p>
        )}

        <div className="form auth-form">
          {tab === "register" && (
            <div className="form-grid">
              <label>
                Имя
                <input
                  value={form.firstName}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                  placeholder="Например, Алина"
                />
                {errors.firstName && <span className="field-error">{errors.firstName}</span>}
              </label>
              <label>
                Фамилия
                <input
                  value={form.lastName}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                  placeholder="Например, Иванова"
                />
                {errors.lastName && <span className="field-error">{errors.lastName}</span>}
              </label>
              <label>
                Возраст
                <input
                  type="number"
                  min="10"
                  max="99"
                  value={form.age}
                  onChange={(e) => handleChange("age", e.target.value)}
                  placeholder="16"
                />
                {errors.age && <span className="field-error">{errors.age}</span>}
              </label>
            </div>
          )}

          <label>
            Email
            <input
              type="email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="you@example.com"
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </label>
          <label>
            Пароль
            <input
              type="password"
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
              placeholder="Минимум 6 символов"
            />
            {errors.password && <span className="field-error">{errors.password}</span>}
          </label>
          {tab === "register" && (
            <label>
              Подтверждение пароля
              <input
                type="password"
                value={form.confirmPassword}
                onChange={(e) => handleChange("confirmPassword", e.target.value)}
                placeholder="Повтори пароль"
              />
              {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
            </label>
          )}
          {errors.form && <div className="error">{errors.form}</div>}
          <button className="primary large" onClick={handleSubmit}>
            {tab === "login" ? "Войти" : "Зарегистрироваться"}
          </button>
        </div>
      </div>
    </div>
  );
};

const MaterialDetailPage = ({ onComplete, completedMaterialIds }) => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const material = getMaterialById(id);
  const backToLibrary = () => navigate("/library");

  if (!material) {
    return (
      <div className="page">
        <div className="card">
          <p>Материал не найден.</p>
          <button className="ghost" onClick={backToLibrary}>Назад</button>
        </div>
      </div>
    );
  }

  const nextTestId = material.testId;
  const completed = completedMaterialIds?.includes(material.id);
  const theme = themeLabels[material.theme] || { accent: "#6b7280", title: "Тема" };
  const materialType = material.type || type;

  return (
    <div className="page">
      <div className="back-link-row">
        <Link className="back-link" to="/library">
          <span aria-hidden>←</span>
          <span>Назад в библиотеку</span>
        </Link>
      </div>
      <div className="page-header">
        <div>
          <h1>{material.title}</h1>
          <p className="meta">Тема: {theme.title || material.theme}</p>
        </div>
        <button className="ghost" onClick={backToLibrary}>Назад</button>
      </div>
      <div className="card">
        <div className="chip-row">
          <span className="material-badge" style={{ background: `${theme.accent}20`, color: theme.accent }}>
            {theme.title || "Тема"}
          </span>
          <span className="material-badge outline">{materialType === "course" ? "Курс" : materialType === "article" ? "Статья" : "Тест"}</span>
          <span className="material-badge outline">{material.level || "начальный"}</span>
          <span className="material-badge outline">{material.estimatedTime || "15 минут"}</span>
        </div>
        <p className="meta">{materialType === "course" ? material.duration || material.estimatedTime : material.estimatedTime || "Быстрое изучение"}</p>
        <p>{material.description}</p>
        {material.content && <p className="meta">{material.content}</p>}
        <button className="primary" onClick={() => onComplete(material.id, materialType)}>
          {completed ? "Повторить материал" : "Отметить завершённым"}
        </button>
        {nextTestId && (
          <div className="test-followup">
            <div className="card-header">Проверь себя по этой теме</div>
            <p className="meta">Короткий тест поможет закрепить материал.</p>
            <Link className="primary outline" to={`/tests/${nextTestId}`}>
              Пройти тест
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

const TestPage = ({ onComplete, completedMaterialIds }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const test = tests.find((t) => t.id === id);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const completed = completedMaterialIds?.includes(id);
  const backToLibrary = () => navigate("/library");

  if (!test) {
    return (
      <div className="page">
        <div className="card">
          <p>Тест не найден.</p>
          <button className="ghost" onClick={backToLibrary}>Назад</button>
        </div>
      </div>
    );
  }

  const submit = () => {
    if (test.questions.some((_, idx) => answers[idx] === undefined)) {
      alert("Ответь на все вопросы");
      return;
    }
    const correct = test.questions.reduce((acc, q, idx) => acc + (q.answer === answers[idx] ? 1 : 0), 0);
    setResult({ correct, total: test.questions.length });
    onComplete({ testId: test.id, correct, total: test.questions.length });
  };

  return (
    <div className="page">
      <div className="back-link-row">
        <Link className="back-link" to="/library">
          <span aria-hidden>←</span>
          <span>Назад в библиотеку</span>
        </Link>
      </div>
      <div className="page-header">
        <div>
          <h1>{test.title}</h1>
          <p className="meta">{test.description}</p>
          {completed && <p className="meta success">Тест уже завершён — результат можно улучшить</p>}
        </div>
        <button className="ghost" onClick={backToLibrary}>Назад</button>
      </div>
      <div className="card">
        <div className="test-grid">
          {test.questions.map((q, qi) => (
            <div key={qi} className="question">
              <div className="q-title">
                {qi + 1}. {q.text}
              </div>
              <div className="options">
                {q.options.map((opt, oi) => (
                  <label key={oi} className={`option ${answers[qi] === oi ? "selected" : ""}`}>
                    <input type="radio" name={`${test.id}-${qi}`} onChange={() => setAnswers((prev) => ({ ...prev, [qi]: oi }))} />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
        <button className="primary" onClick={submit}>Завершить тест</button>
        {result && <div className="success">Результат: {result.correct} из {result.total}</div>}
      </div>
    </div>
  );
};

function App() {
  const { theme, toggleTheme } = useTheme();
  const { toasts, addToast, addToasts } = useToasts();
  const initialUser = loadCurrentUser();
  const xpConfig = useMemo(() => getXPConfig(), []);
  const [user, setUser] = useState(() => initialUser);
  const [gamification, setGamification] = useState(() => loadGamification(initialUser?.id));
  const [trackData, setTrackData] = useState(() => loadTrack(initialUser?.id));
  const [progress, setProgress] = useState(() => loadProgress(initialUser?.id));
  const activityLogApi = useActivityLog(user?.id);
  const [communityState, setCommunityState] = useState(() => loadCommunityState(initialUser) || { ...baseCommunityState });
  const [isPaletteOpen, setPaletteOpen] = useState(false);

  const lastVisit = useLastVisit(user?.id);

  const missionsApi = useMissions(user?.id, { onMissionCompleted: handleMissionComplete });
  const {
    missions,
    progress: missionProgress,
    getMissionProgress,
    updateProgressByKey,
    setMissionStatus,
    completedThisWeek,
  } = missionsApi;

  const { activityByDate, activityFeed, logActivity, streakInfo, getActivityForMonth, activeDaysThisMonth } = activityLogApi;

  useEffect(() => {
    if (user) {
      setGamification(loadGamification(user.id));
      setTrackData(loadTrack(user.id));
      setProgress(loadProgress(user.id));
      setCommunityState(loadCommunityState(user) || { ...baseCommunityState });
    } else {
      setGamification({ ...defaultGamification });
      setTrackData(loadTrack(null));
      setProgress(loadProgress(null));
      setCommunityState(loadCommunityState(null) || { ...baseCommunityState });
    }
  }, [user]);

  useEffect(() => {
    const result = logActivity("sessionStarted", { title: "Вход в платформу" });
    if (result?.isFirstActive) {
      updateProgressByKey("login_days", 1);
    }
  }, [logActivity, updateProgressByKey, user?.id]);

  useEffect(() => {
    const handler = (e) => {
      const isCommand = (e.metaKey || e.ctrlKey) && e.key?.toLowerCase() === "k";
      if (isCommand) {
        e.preventDefault();
        setPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const updateCommunityState = (nextState) => {
    setCommunityState(nextState);
    saveCommunityState(user, nextState);
  };

  const pushActivity = (eventType, payload = {}) => {
    logActivity(eventType, payload);
  };

  const applyGamificationResult = (result, previousAchievements = []) => {
    setGamification(result.gamification);
    if (result.goalCompletions?.length) {
      result.goalCompletions.forEach((goal) => pushActivity("meta", { title: `Цель выполнена: ${goal.title}` }));
    }
    const newAchievements = result.gamification.achievements.filter((a) => !previousAchievements.includes(a));
    newAchievements.forEach((ach) => pushActivity("meta", { title: `Достижение: ${ach}` }));
    addToasts(result.messages || []);
  };

  const completedMaterialIds = progress.completedMaterialIds || [];
  function handleMissionComplete(mission) {
    if (!mission) return;
    pushActivity("missionCompleted", { title: `Завершена миссия «${mission.title}»`, xp: mission.xpRewardBase });
    addToast(`Миссия «${mission.title}» закрыта!`);
    if (user) {
      const previousAchievements = gamification.achievements || [];
      const res = awardForMission(user.id, gamification, mission.xpRewardBase || undefined);
      applyGamificationResult(res, previousAchievements);
    }
  }

  const handleFinishMaterial = (materialId, materialType) => {
    const alreadyCompleted = completedMaterialIds.includes(materialId);
    const updatedProgress = markMaterialCompleted(user?.id, materialId, progress);
    setProgress(updatedProgress);
    const material = getMaterialById(materialId);
    if (alreadyCompleted) {
      addToast("Материал уже отмечен как завершён");
      return;
    }
    if (!user) {
      addToast("Войдите, чтобы получить очки за материалы");
    } else {
      const previousAchievements = gamification.achievements || [];
      const res = awardForMaterial(user.id, gamification);
      applyGamificationResult(res, previousAchievements);
    }
    if (material?.theme === "finance") {
      updateProgressByKey("library_finance_completed", 1);
    }
    if (material?.theme === "mindset") {
      updateProgressByKey("library_mindset_completed", 1);
    }
    updateProgressByKey("library_items_completed", 1);
    pushActivity("materialCompleted", {
      title: `Закрыт материал «${material?.title || "Материал"}»`,
      xp: xpConfig.materialCompleted,
    });
  };

  const handleInlineQuizComplete = (materialId, reward) => {
    if (!user) {
      addToast("Войдите, чтобы получить XP за проверку себя");
      return;
    }
    const previousAchievements = gamification.achievements || [];
    const res = awardForInlineQuiz(user.id, gamification, reward || undefined);
    applyGamificationResult(res, previousAchievements);
    const material = getMaterialById(materialId);
    pushActivity("inlineQuizCompleted", {
      title: `Мини-тест по «${material?.title || "материалу"}»`,
      xp: reward || xpConfig.inlineQuiz,
    });
  };

  const handleFinishTest = ({ testId }) => {
    const alreadyCompleted = completedMaterialIds.includes(testId);
    const updatedProgress = markMaterialCompleted(user?.id, testId, progress);
    setProgress(updatedProgress);
    const test = tests.find((t) => t.id === testId);
    if (alreadyCompleted) {
      addToast("Тест уже закрыт, но можно освежить знания");
      return;
    }
    if (!user) {
      addToast("Войдите, чтобы получить очки за тест");
    } else {
      const previousAchievements = gamification.achievements || [];
      const res = awardForTest(user.id, gamification);
      applyGamificationResult(res, previousAchievements);
    }
    pushActivity("testCompleted", {
      title: `Пройден тест «${test?.title || "Тест"}»`,
      xp: xpConfig.testCompleted,
    });
  };

  const handleCommunityAction = (action) => {
    if (!user) {
      addToast("Войдите, чтобы получать XP за активность в сообществе");
      return;
    }
    const previousAchievements = gamification.achievements || [];
    const res = awardForCommunityAction(user.id, gamification, action);
    applyGamificationResult(res, previousAchievements);
    if (action?.type === "post-create") {
      pushActivity("communityAction", { title: "Новый пост в сообществе", xp: xpConfig.communityAnswer });
    } else if (action?.type === "answer") {
      pushActivity("communityAction", { title: "Ответ в вопросах", xp: xpConfig.communityAnswer });
      updateProgressByKey("community_replies", 1);
    } else if (action?.type === "message") {
      pushActivity("communityAction", { title: "Сообщение в чате" });
    } else if (action?.type === "best-answer") {
      pushActivity("communityAction", { title: "Лучший ответ", xp: xpConfig.communityBestAnswer });
      updateProgressByKey("community_replies", 1);
    } else if (action?.type === "club-join") {
      pushActivity("communityAction", { title: "Присоединился к клубу" });
    } else if (action?.type === "question") {
      pushActivity("communityAction", { title: "Новый вопрос", xp: xpConfig.communityAnswer });
    }
  };

  const appendCommunityPost = (payload) => {
    const { state } = createCommunityPost(user, payload);
    updateCommunityState(state);
    if (user) {
      handleCommunityAction({ type: "post-create" });
    }
    return state.posts[0];
  };

  const handleMissionShare = (mission, message) => {
    if (!mission) return;
    appendCommunityPost({
      type: "mission_share",
      title: `Миссия выполнена: ${mission.title}`,
      content: message?.trim() || `Я завершил(а) миссию “${mission.title}” (+${mission.xpReward} XP).`,
      relatedMissionId: mission.id,
      xpGained: mission.xpReward,
    });
    addToast("Пост отправлен в сообщество");
  };

  const handleMaterialQuestion = (material, body) => {
    if (!material || !body?.trim()) return;
    appendCommunityPost({
      type: "question",
      title: `Вопрос по уроку “${material.title}”`,
      content: body.trim(),
      relatedMaterialId: material.id,
    });
    addToast("Вопрос отправлен в сообщество");
  };

  const handleMindGameComplete = (result) => {
    const title = result.gameId === "finance" ? "Финансовая игра" : "Логическая игра";
    if (!user) {
      addToast("Войдите, чтобы получить XP за мини-игры");
      return;
    }
    const previousAchievements = gamification.achievements || [];
    const res = awardForMindGame(user.id, gamification, result.xpGained, {
      label: `+${result.xpGained} XP за ${title}`,
      gameId: result.gameId,
    });
    applyGamificationResult(res, previousAchievements);
    updateProgressByKey("mindgames_played", 1);
    pushActivity("mindgameCompleted", {
      title: `${title}: ${result.correct}/${result.total}`,
      xp: result.xpGained,
    });
  };

  const handleMemoryEntryAdded = () => {
    updateProgressByKey("memory_notes_created", 1);
    logActivity("memoryEntryCreated", { title: "Запись в Памяти", xp: 10 });
  };

  const handleAuth = (usr) => {
    setUser(usr);
    setGamification(loadGamification(usr.id));
    setTrackData(loadTrack(usr.id));
    setProgress(loadProgress(usr.id));
    setMissionsState(loadMissionsState(usr.id));
  };

  const handleLogout = () => {
    const currentId = user?.id;
    logoutUser();
    clearActivityLog(currentId);
    setUser(null);
    setGamification({ ...defaultGamification });
    setTrackData(loadTrack(null));
    setProgress(loadProgress(null));
    setMissionsState(loadMissionsState(null));
  };

  const community = useMemo(() => {
    const base = communityParticipants.map((p) => ({
      ...p,
      points: p.xp,
      status: p.role,
      achievements: [],
    }));
    if (!user) return base;
    const levelInfo = getLevelFromPoints(gamification.totalPoints);
    const me = {
      id: "me",
      name: user.name,
      points: gamification.totalPoints,
      xp: gamification.totalPoints,
      level: levelInfo.level,
      status: getStatusByPoints(gamification.totalPoints),
      achievements: gamification.achievements,
    };
    return [me, ...base.filter((p) => p.id !== me.id)];
  }, [user, gamification]);

  const streak = useMemo(
    () => ({ count: streakInfo?.current || 0, best: streakInfo?.best || 0, lastDate: streakInfo?.lastActiveDate }),
    [streakInfo]
  );

  const staticCommands = useMemo(() => {
    const commands = navLinks.map((link) => ({
      id: `nav-${link.to}`,
      title: `Открыть: ${link.label}`,
      description: "Быстрый переход по разделам",
      category: "Навигация",
      priority: 10,
      action: { type: "navigate", to: link.to },
    }));

    commands.push({
      id: "start-track",
      title: trackData?.generatedTrack?.length ? "Открыть твой трек" : "Собрать трек развития",
      description: trackData?.generatedTrack?.length
        ? "Посмотреть следующий шаг и прогресс"
        : "Ответить на вопросы и получить план",
      category: "Трек",
      priority: 12,
      action: { type: "navigate", to: trackData?.generatedTrack?.length ? "/missions" : "/track-quiz" },
    });

    commands.push({
      id: "view-streak",
      title: `Серия ${streak.count || 0} дней`,
      description: "Не теряй темп — отметь любое действие",
      category: "Геймификация",
      priority: 8,
      action: { type: "navigate", to: "/profile" },
    });

    commands.push({
      id: "toggle-theme",
      title: theme === "dark" ? "Переключить на светлую тему" : "Включить тёмную тему",
      description: "Сменить оформление без перезагрузки",
      category: "Настройки",
      priority: 6,
      action: () => toggleTheme(),
    });

    return commands;
  }, [streak.count, theme, toggleTheme, trackData?.generatedTrack?.length]);

  const handleTrackSave = (payload) => {
    const saved = saveTrack(user?.id, { ...payload, updatedAt: new Date().toISOString() });
    setTrackData(saved);
    addToast("Трек сохранён");
    updateProgressByKey("track_completed", 1);
  };

  const handleTrackUpdate = (next) => {
    const saved = saveTrack(user?.id, { ...(trackData || {}), ...next, updatedAt: new Date().toISOString() });
    setTrackData(saved);
    addToast("Трек обновлён");
  };

  const handleTrackRetake = () => {
    clearTrack(user?.id);
    setTrackData(null);
  };

  const CommandCenter = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { entries: memoryEntries } = useMemory(user?.id);
    const smartCommands = useSmartCommands({
      currentRoute: pathname,
      trackData,
      progress,
      missions,
      missionProgress,
      gamification,
      activityLog: activityFeed,
      memoryEntries,
      lastVisit,
    });

    const runCommand = (command) => {
      const action = command?.action;
      if (typeof action === "function") {
        action();
      } else if (action?.type === "navigate" && action.to) {
        navigate(action.to);
      }
      setPaletteOpen(false);
    };

    return (
      <CommandPalette
        isOpen={isPaletteOpen}
        onClose={() => setPaletteOpen(false)}
        smartCommands={smartCommands}
        staticCommands={staticCommands}
        onSelect={runCommand}
      />
    );
  };

  const HomeRoute = () => {
    return <HomePage trackData={trackData} />;
  };

  return (
    <BrowserRouter>
      <CommandCenter />
      <AppLayout theme={theme} user={user} onLogout={handleLogout} toggleTheme={toggleTheme} toasts={toasts}>
        <Routes>
          <Route path="/" element={<HomeRoute />} />
          <Route
            path="/library"
            element={
              <LibraryPage
                completedMaterialIds={completedMaterialIds}
                trackData={trackData}
                user={user}
                onMindGameComplete={handleMindGameComplete}
                onTrackUpdate={handleTrackUpdate}
                onRetakeTrack={() => {
                  handleTrackRetake();
                }}
              />
            }
          />
          <Route path="/library/paths/:slug" element={<LearningPathPage completedMaterialIds={completedMaterialIds} />} />
          <Route
            path="/library/:type/:id"
            element={
              <MaterialPage
                user={user}
                gamification={gamification}
                progress={progress}
                trackData={trackData}
                onMaterialComplete={handleFinishMaterial}
                onQuizComplete={handleInlineQuizComplete}
                onAskCommunity={handleMaterialQuestion}
              />
            }
          />
          <Route
            path="/material/:materialId"
            element={
              <MaterialPage
                user={user}
                gamification={gamification}
                progress={progress}
                trackData={trackData}
                onMaterialComplete={handleFinishMaterial}
                onQuizComplete={handleInlineQuizComplete}
              />
            }
          />
          <Route path="/tests/:id" element={<TestPage onComplete={handleFinishTest} completedMaterialIds={completedMaterialIds} />} />
          <Route
            path="/missions"
            element={
              <MissionsPage
                gamification={gamification}
                missions={missions}
                missionProgress={missionProgress}
                getMissionProgress={getMissionProgress}
                setMissionStatus={setMissionStatus}
                updateProgressByKey={updateProgressByKey}
                completedThisWeek={completedThisWeek}
                activityByDate={activityByDate}
                streakInfo={streakInfo}
                getActivityForMonth={getActivityForMonth}
                trackData={trackData}
                onStartTrack={() => {}}
                onEditTrack={() => {
                  handleTrackRetake();
                }}
              />
            }
          />
          <Route
            path="/memory"
            element={<MemoryPage user={user} onEntryAdded={handleMemoryEntryAdded} />}
          />
          <Route
            path="/community"
            element={
              <CommunityPage
                user={user}
                gamification={gamification}
                onCommunityAction={handleCommunityAction}
                onToast={addToast}
              />
            }
          />
          <Route
            path="/profile"
            element={
              <ProfileDashboard
                user={user}
                gamification={gamification}
                progress={progress}
                streak={streak}
                trackData={trackData}
                activityLog={activityFeed}
                activityByDate={activityByDate}
                streakInfo={streakInfo}
                getActivityForMonth={getActivityForMonth}
                activeDaysThisMonth={activeDaysThisMonth}
                community={community}
                theme={theme}
                onToggleTheme={toggleTheme}
                missions={missions}
                missionProgress={missionProgress}
                getMissionProgress={getMissionProgress}
              />
            }
          />
          <Route path="/auth" element={<AuthPage onAuth={handleAuth} />} />
          <Route
            path="/track"
            element={<TrackQuizPage savedTrack={trackData} onTrackSave={handleTrackSave} materials={materials} />}
          />
          <Route
            path="/onboarding"
            element={<TrackQuizPage savedTrack={trackData} onTrackSave={handleTrackSave} materials={materials} />}
          />
          <Route
            path="/track-quiz"
            element={<TrackQuizPage savedTrack={trackData} onTrackSave={handleTrackSave} materials={materials} />}
          />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;
