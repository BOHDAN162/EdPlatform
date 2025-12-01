import React, { useEffect, useMemo, useState } from "react";
import { BrowserRouter, Routes, Route, Link, useNavigate, useParams } from "./routerShim";
import {
  awardForCommunityAction,
  awardForMaterial,
  awardForTest,
  awardForInlineQuiz,
  awardForMission,
  awardForMindGame,
  defaultGamification,
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
import { loadCurrentUser, loginUser, logoutUser, registerUser } from "./auth";
import { clearTrack, loadTrack, saveTrack } from "./trackStorage";
import ProfileDashboard from "./ProfileDashboard";
import { addActivityEntry, clearActivity, loadActivity } from "./activityLog";
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
import CommandPalette from "./components/common/CommandPalette";
import { memoryLandmarks } from "./data/memoryLandmarks";

const typeFilterOptions = [
  { id: "all", label: "Все" },
  { id: "course", label: "Курсы" },
  { id: "article", label: "Лонгриды" },
  { id: "test", label: "Тесты" },
  { id: "game", label: "Игры" },
];

const LandingMock = ({ theme }) => (
  <div className={`hero-visual ${theme}`}>
    <div className="mock-window">
      <div className="mock-header">
        <span className="mock-dot" />
        <span className="mock-dot" />
        <span className="mock-dot" />
        <div className="mock-title">NOESIS workspace</div>
      </div>
      <div className="mock-body">
        <div className="mock-panel">
          <div className="panel-label">Твой прогресс</div>
          {["Миссии", "Библиотека", "Память"].map((pill) => (
            <div key={pill} className="panel-row">
              <div className="panel-pill">{pill}</div>
              <div className="panel-line" />
              <span className="panel-meta">В фокусе</span>
            </div>
          ))}
        </div>
        <div className="mock-card-grid">
          {["Вопросы", "Модуль", "Челлендж"].map((title, idx) => (
            <div key={title} className="mock-card">
              <div className="mock-card-top">
                <span className="mock-badge">{idx + 1} шаг</span>
                <span className="mock-chip">10 минут</span>
              </div>
              <div className="mock-card-title">{title}</div>
              <div className="mock-progress">
                <div className="mock-progress-fill" style={{ width: `${50 + idx * 10}%` }} />
              </div>
              <div className="mock-meta">Активно • без отвлечений</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const HomePage = ({ navigate, trackData, theme }) => {
  const quotes = useMemo(
    () => [
      { text: "Ответственность за жизнь начинается с твоих ежедневных решений.", author: "NOESIS" },
      { text: "Ошибки — это топливо для роста, если ты извлекаешь уроки.", author: "NOESIS" },
      { text: "Каждый день без действия — это день без прогресса.", author: "NOESIS" },
      { text: "Храбрый шаг вперёд ценнее идеального плана в голове.", author: "NOESIS" },
      { text: "Твоя команда начинается с людей, которые верят в твои идеи.", author: "NOESIS" },
      { text: "Деньги любят тех, кто умеет считать и планировать.", author: "NOESIS" },
      { text: "Сначала создай ценность, потом ищи признание.", author: "NOESIS" },
      { text: "Настойчивость важнее таланта, когда речь о длинной дистанции.", author: "NOESIS" },
      { text: "Не бойся задавать вопросы — ответы ускоряют путь.", author: "NOESIS" },
      { text: "Сильное окружение держит тебя в тонусе, выбирай его осознанно.", author: "NOESIS" },
      { text: "Каждый тест — это зеркало твоих пробелов и возможностей.", author: "NOESIS" },
      { text: "Делай маленькие проекты, чтобы готовиться к большим.", author: "NOESIS" },
      { text: "Твои навыки — самая надёжная инвестиция.", author: "NOESIS" },
      { text: "Записывай идеи — они быстро улетают без действий.", author: "NOESIS" },
      { text: "Учись презентовать мысли коротко и ясно.", author: "NOESIS" },
      { text: "Слушать других — значит экономить время на своих ошибках.", author: "NOESIS" },
      { text: "Стартуй, даже если страшно: действие рождает уверенность.", author: "NOESIS" },
      { text: "Сравнивай себя только с тем, кем был вчера.", author: "NOESIS" },
      { text: "План без календаря остаётся мечтой.", author: "NOESIS" },
      { text: "Твой опыт — это сумма смелых попыток.", author: "NOESIS" },
    ],
    []
  );
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [quoteVisible, setQuoteVisible] = useState(true);
  useEffect(() => {
    const id = setInterval(() => {
      setQuoteVisible(false);
      setTimeout(() => {
        setQuoteIndex((idx) => (idx + 1) % quotes.length);
        setQuoteVisible(true);
      }, 250);
    }, 30000);
    return () => clearInterval(id);
  }, [quotes.length]);
  const currentQuote = quotes[quoteIndex];
  const hasTrack = !!trackData?.generatedTrack?.length;

  const howSteps = [
    {
      title: "Пройди короткий трек развития",
      description: "Всего 5 минут, чтобы зафиксировать цели и стартовать.",
      icon: "⚡",
    },
    {
      title: "Получи план и миссии",
      description: "Мы собираем маршрут с материалами, челленджами и контрольными точками.",
      icon: "🧭",
    },
    {
      title: "Прокачивайся через курсы и мини-игры",
      description: "Учись в удобном темпе, подключай сообщество и фиксируй прогресс.",
      icon: "🎯",
    },
  ];

  const insideCards = [
    { title: "Миссии", description: "Серия заданий и чекпоинтов", to: "/missions" },
    { title: "Библиотека", description: "Курсы, лонгриды, тесты", to: "/library" },
    { title: "Память", description: "Метавселенная твоих заметок", to: "/memory" },
  ];

  return (
    <div className="page home-page">
      <section className="card landing-hero">
        <div className="hero-grid-modern">
          <div className="hero-copy">
            <p className="hero-kicker">Платформа роста NOESIS</p>
            <h1 className="hero-title">Собери свой маршрут и двигайся без перегруза</h1>
            <p className="hero-subtitle">
              Минималистичная среда, которая помогает выбрать приоритеты, пройти трек и подключить комьюнити. Без лишнего шума — только прогресс.
            </p>
            <div className="hero-actions">
              <button
                className="primary hero-cta"
                onClick={() => navigate(hasTrack ? "/library" : "/track-quiz")}
              >
                Начать трек развития (5 минут)
              </button>
              <button className="ghost text-link" onClick={() => navigate("/library")}>
                Посмотреть библиотеку
              </button>
            </div>
            <div className={`quote-carousel ${quoteVisible ? "visible" : "hidden"}`}>
              <p className="quote-text">«{currentQuote.text}»</p>
              <p className="quote-author">— {currentQuote.author}</p>
            </div>
          </div>
          <LandingMock theme={theme} />
        </div>
      </section>

      <section className="card section how-section">
        <div className="section-header">
          <p className="section-kicker">Как это работает</p>
          <h2>Простой путь к результатам</h2>
          <p className="meta large">Три шага, которые занимают меньше 30 секунд внимания каждый.</p>
        </div>
        <div className="feature-grid">
          {howSteps.map((step) => (
            <div key={step.title} className="feature-card">
              <div className="icon-circle" aria-hidden>
                {step.icon}
              </div>
              <div>
                <h3>{step.title}</h3>
                <p className="meta">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="card section inside-section">
        <div className="section-header">
          <p className="section-kicker">Что внутри</p>
          <h2>Твой набор инструментов</h2>
          <p className="meta large">Кликни и переходи сразу в нужный раздел — навигация остаётся плавной.</p>
        </div>
        <div className="inside-grid">
          {insideCards.map((item) => (
            <Link key={item.title} to={item.to} className="inside-card" onClick={() => navigate(item.to)}>
              <div className="inside-top">
                <span className="inside-dot" />
                <span className="inside-dot" />
                <span className="inside-dot" />
              </div>
              <div className="inside-body">
                <div className="inside-title-row">
                  <h3>{item.title}</h3>
                  <span aria-hidden>→</span>
                </div>
                <p className="meta">{item.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
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

      <div className="library-layout">
        <aside className="library-sidebar card">
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

          <div className="library-split">
            <div className="card list-card">
              <div className="list-head">
                <span>Название</span>
                <span>Тип</span>
                <span>Тема</span>
                <span>Статус</span>
                <span>Длительность</span>
              </div>
              <div className="material-list">
                {filteredMaterials.map((material) => {
                  const status = statusFromProgress(material.id, completedSet, activeTrackMaterialId);
                  return (
                    <button
                      key={material.id}
                      className={`material-row ${selectedId === material.id ? "active" : ""}`}
                      onClick={() => setSelectedId(material.id)}
                    >
                      <div className="material-cell">
                        <div className="material-title-row">
                          <span className="material-name">{material.title}</span>
                          {trackMaterials.has(material.id) && <span className="pill outline">Трек</span>}
                        </div>
                        <p className="meta">{material.description}</p>
                      </div>
                      <span className="badge subtle">{typeFilterOptions.find((t) => t.id === material.type)?.label || "Материал"}</span>
                      <span className="badge theme">{themeLabels[material.theme]?.title || "Тема"}</span>
                      <span className={`badge status ${status}`}>{status === "new" ? "Новое" : status === "inProgress" ? "В процессе" : "Завершено"}</span>
                      <span className="badge subtle">{material.estimatedTime || "15 минут"}</span>
                    </button>
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
              <div className="card detail-card">
                <div className="panel-header">
                  <div>
                    <p className="section-kicker">Детали</p>
                    <h3>{selectedMaterial.title}</h3>
                  </div>
                  <button className="ghost" onClick={() => openMaterial(selectedMaterial.id)}>Открыть полностью</button>
                </div>
                <div className="chip-row">
                  <span className="material-badge" style={{ background: `${(themeLabels[selectedMaterial.theme]?.accent || "#7c3aed")}20`, color: themeLabels[selectedMaterial.theme]?.accent || "#7c3aed" }}>
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
          </div>

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
  const [user, setUser] = useState(() => initialUser);
  const [gamification, setGamification] = useState(() => loadGamification(initialUser?.id));
  const [trackData, setTrackData] = useState(() => loadTrack(initialUser?.id));
  const [progress, setProgress] = useState(() => loadProgress(initialUser?.id));
  const [activityLog, setActivityLog] = useState(() => loadActivity(initialUser?.id));
  const [communityState, setCommunityState] = useState(() => loadCommunityState(initialUser) || { ...baseCommunityState });
  const [isPaletteOpen, setPaletteOpen] = useState(false);

  const missionsApi = useMissions(user?.id, { onMissionCompleted: handleMissionComplete });
  const {
    missions,
    progress: missionProgress,
    getMissionProgress,
    updateProgressByKey,
    setMissionStatus,
    completedThisWeek,
  } = missionsApi;

  useEffect(() => {
    if (user) {
      setGamification(loadGamification(user.id));
      setTrackData(loadTrack(user.id));
      setProgress(loadProgress(user.id));
      setActivityLog(loadActivity(user.id));
      setCommunityState(loadCommunityState(user) || { ...baseCommunityState });
    } else {
      setGamification({ ...defaultGamification });
      setTrackData(loadTrack(null));
      setProgress(loadProgress(null));
      setActivityLog(loadActivity(null));
      setCommunityState(loadCommunityState(null) || { ...baseCommunityState });
    }
  }, [user]);

  useEffect(() => {
    const listener = (e) => {
      const isK = e.key?.toLowerCase?.() === "k";
      if ((e.metaKey || e.ctrlKey) && isK) {
        e.preventDefault();
        setPaletteOpen((open) => !open);
      }
      if (e.key === "Escape") {
        setPaletteOpen(false);
      }
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, []);

  const updateCommunityState = (nextState) => {
    setCommunityState(nextState);
    saveCommunityState(user, nextState);
  };

  const pushActivity = (entry) => {
    setActivityLog((prev) => addActivityEntry(user?.id, entry, prev));
  };

  const applyGamificationResult = (result, previousAchievements = []) => {
    setGamification(result.gamification);
    if (result.goalCompletions?.length) {
      result.goalCompletions.forEach((goal) =>
        pushActivity({ title: `Цель выполнена: ${goal.title}`, type: "цель" })
      );
    }
    const newAchievements = result.gamification.achievements.filter((a) => !previousAchievements.includes(a));
    newAchievements.forEach((ach) => pushActivity({ title: `Достижение: ${ach}`, type: "достижение" }));
    addToasts(result.messages || []);
  };

  const completedMaterialIds = progress.completedMaterialIds || [];
  function handleMissionComplete(mission) {
    if (!mission) return;
    pushActivity({ title: `Завершена миссия «${mission.title}»`, type: "миссия" });
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
    pushActivity({ title: `Закрыт материал «${material?.title || "Материал"}»`, type: materialType || material?.type || "материал" });
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
    pushActivity({ title: `Мини-тест по «${material?.title || "материалу"}»`, type: "квиз" });
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
    pushActivity({ title: `Пройден тест «${test?.title || "Тест"}»`, type: "тест" });
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
      pushActivity({ title: "Новый пост в сообществе", type: "сообщество" });
    } else if (action?.type === "answer") {
      pushActivity({ title: "Ответ в вопросах", type: "сообщество" });
      updateProgressByKey("community_replies", 1);
    } else if (action?.type === "message") {
      pushActivity({ title: "Сообщение в чате", type: "сообщество" });
    } else if (action?.type === "best-answer") {
      pushActivity({ title: "Лучший ответ", type: "сообщество" });
      updateProgressByKey("community_replies", 1);
    } else if (action?.type === "club-join") {
      pushActivity({ title: "Присоединился к клубу", type: "сообщество" });
    } else if (action?.type === "question") {
      pushActivity({ title: "Новый вопрос", type: "сообщество" });
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
    pushActivity({ title: `${title}: ${result.correct}/${result.total}`, type: "mindgame" });
  };

  const handleAuth = (usr) => {
    setUser(usr);
    setGamification(loadGamification(usr.id));
    setTrackData(loadTrack(usr.id));
    setProgress(loadProgress(usr.id));
    setActivityLog(loadActivity(usr.id));
    setMissionsState(loadMissionsState(usr.id));
  };

  const handleLogout = () => {
    const currentId = user?.id;
    logoutUser();
    clearActivity(currentId);
    setUser(null);
    setGamification({ ...defaultGamification });
    setTrackData(loadTrack(null));
    setProgress(loadProgress(null));
    setActivityLog(loadActivity(null));
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
    () => ({ count: gamification.streakCount || 0, lastDate: gamification.lastActivityDate }),
    [gamification.streakCount, gamification.lastActivityDate]
  );

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

  const PaletteBridge = (props) => {
    const navigate = useNavigate();
    return (
      <CommandPalette
        {...props}
        navigate={navigate}
        theme={theme}
        toggleTheme={toggleTheme}
        materials={materials}
        missions={missions}
        memoryLandmarks={memoryLandmarks}
        trackData={trackData}
        completedMaterialIds={completedMaterialIds}
        addToast={addToast}
      />
    );
  };

  const HomeRoute = () => {
    const navigate = useNavigate();
    return <HomePage navigate={navigate} trackData={trackData} theme={theme} />;
  };

  return (
    <BrowserRouter>
      <PaletteBridge open={isPaletteOpen} onClose={() => setPaletteOpen(false)} />
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
              />
            }
          />
          <Route
            path="/memory"
            element={<MemoryPage user={user} onEntryAdded={() => updateProgressByKey("memory_notes_created", 1)} />}
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
                activityLog={activityLog}
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
