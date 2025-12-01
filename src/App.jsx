import React, { useEffect, useMemo, useState } from "react";
import { BrowserRouter, Routes, Route, Link, NavLink, useNavigate, useParams } from "./routerShim";
import {
  awardForCommunityAction,
  awardForMaterial,
  awardForTest,
  awardForInlineQuiz,
  awardForMission,
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
import MaterialCard from "./components/MaterialCard";
import TrackSummaryBar from "./components/TrackSummaryBar";
import { loadCurrentUser, loginUser, logoutUser, registerUser } from "./auth";
import TrackQuizPage from "./TrackQuizPage";
import { loadTrack, saveTrack } from "./trackStorage";
import {
  loadMissionsState,
  saveMissionsState,
  setMissionNotes,
  setMissionStatus,
  toggleMissionStep,
  getMissionById,
} from "./missionsData";
import LandingSection from "./LandingSection";
import MascotIllustration from "./MascotIllustration";
import ProfileDashboard from "./ProfileDashboard";
import { addActivityEntry, clearActivity, loadActivity } from "./activityLog";
import CommunityPage from "./community/CommunityPage";
import MaterialPage from "./MaterialPage";
import MissionsPage from "./MissionsPage";

const Toast = ({ messages }) => {
  if (!messages.length) return null;
  return (
    <div className="toast-stack">
      {messages.map((m) => (
        <div key={m.id} className="toast">
          {m.text}
        </div>
      ))}
    </div>
  );
};

const Header = ({ user, onLogout, theme, toggleTheme }) => {
  const [open, setOpen] = useState(false);
  const links = [
    { to: "/", label: "Главная" },
    { to: "/library", label: "Библиотека" },
    { to: "/missions", label: "Миссии" },
    { to: "/community", label: "Сообщество" },
    { to: "/profile", label: "Профиль" },
  ];

  return (
    <header className="header">
      <Link to="/" className="logo" onClick={() => setOpen(false)}>
        NOESIS
      </Link>
      <button className="burger" onClick={() => setOpen((v) => !v)} aria-label="menu">
        ☰
      </button>
      <nav className={`nav ${open ? "open" : ""}`}>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/"}
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            onClick={() => setOpen(false)}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
      <div className="header-actions">
        <button className="ghost" onClick={toggleTheme}>
          {theme === "dark" ? "Тёмная" : "Светлая"}
        </button>
        {!user && <Link to="/auth" className="primary">Войти</Link>}
        {user && (
          <div className="user-chip">
            <Link to="/profile" className="avatar">
              {user.name?.[0] || "Я"}
            </Link>
            <div className="user-meta">
              <div className="user-name">{user.name}</div>
              <button className="ghost" onClick={onLogout}>
                Выйти
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

const GamificationSummary = ({ gamification }) => {
  const status = getStatusByPoints(gamification.totalPoints);
  const { next, progress } = progressToNextStatus(gamification.totalPoints);
  const achievementsMap = {
    "first-test": "Первый тест",
    "tests-3": "3 теста подряд",
    "materials-5": "5 материалов",
    "points-100": "100 очков",
    "points-300": "300 очков",
    "community-first-post": "Первый пост в сообществе",
    "community-5-answers": "5 ответов в сообществе",
    "community-3-best": "3 лучших ответа",
    "community-10-messages": "10 сообщений в чатах",
  };

  return (
    <div className="card">
      <div className="card-header">Твоя геймификация</div>
      <div className="big-number">{gamification.totalPoints} очков</div>
      <p className="meta">Статус: {status}</p>
      {next && (
        <div className="progress-line">
          <div className="bar" style={{ width: `${progress}%` }} />
        </div>
      )}
      {next && <p className="meta">До уровня «{next}» осталось {100 - progress}%</p>}
      <div className="badges">
        {gamification.achievements.length === 0 && <span className="tag">Пока без наград</span>}
        {gamification.achievements.map((a) => (
          <span key={a} className="tag">
            {achievementsMap[a] || a}
          </span>
        ))}
      </div>
    </div>
  );
};

const DeviceMock = ({ title, items }) => (
  <div className="device-mock">
    <div className="device-top">
      <span className="device-dot" />
      <span className="device-dot" />
      <span className="device-dot" />
    </div>
    <div className="device-body">
      <div className="device-title">{title}</div>
      <div className="device-items">
        {items.map((item, idx) => (
          <div key={idx} className="device-item">
            <div className="device-pill" />
            <div className="device-line" style={{ width: `${70 - idx * 8}%` }} />
            <div className="device-label-line">{item}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const BadgeOrbit = () => (
  <div className="badge-orbit">
    <div className="badge bubble">Очки +120</div>
    <div className="badge bubble">Новый статус</div>
    <div className="badge bubble">Серия 7 дней</div>
    <div className="badge bubble">Тест закрыт</div>
  </div>
);

const TrackPreview = () => (
  <div className="track-preview">
    {["Осознание", "Финансы", "Проект", "Комьюнити"].map((label, idx) => (
      <div key={label} className={`track-chip ${idx === 0 ? "active" : ""}`}>
        <span className="track-index">{idx + 1}</span>
        <div>
          <div className="track-label">{label}</div>
          <div className="track-sub">Шаг {idx + 1}</div>
        </div>
      </div>
    ))}
  </div>
);

const CommunityOrbit = () => (
  <div className="community-orbit">
    {["Алия", "Рома", "Милена", "Тимур"].map((name, idx) => (
      <div key={name} className={`orbit-card orbit-${idx}`}>
        <div className="avatar bubble">{name[0]}</div>
        <div className="orbit-meta">{name}</div>
      </div>
    ))}
    <div className="orbit-core">Живые созвоны
      <span className="orbit-chip">каждую неделю</span>
    </div>
  </div>
);

const HomePage = ({ user, navigate, community, gamification }) => {
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
  useEffect(() => {
    const id = setInterval(() => {
      setQuoteIndex((idx) => (idx + 1) % quotes.length);
    }, 30000);
    return () => clearInterval(id);
  }, [quotes.length]);
  const currentQuote = quotes[quoteIndex];
  return (
    <div className="page">
      <div className="card hero-spotlight">
        <div className="hero-inner">
          <p className="hero-kicker">Платформа развития</p>
          <h1 className="hero-title">Будь лучше вчерашнего себя</h1>
          <p className="hero-subtitle">
            Квесты, контент, форматы, сообщество, игры мышления и персональный путь — все чтобы прокачать себя и становиться сильнее каждый день.
          </p>
          <div className="quote-panel">
            <p className="quote-label">Совет дня</p>
            <p className="quote-text">«{currentQuote.text}»</p>
            <p className="quote-author">— {currentQuote.author}</p>
          </div>
          <div className="actions hero-actions">
            <button className="primary hero-cta" onClick={() => navigate("/track")}>Старт</button>
          </div>
          <div className="how-it-works">
            <div>
              <span className="check-dot">✓</span>
              <span>Пройди короткую регистрацию</span>
            </div>
            <div>
              <span className="check-dot">✓</span>
              <span>Активируй подписку и выбери трек</span>
            </div>
            <div>
              <span className="check-dot">✓</span>
              <span>Учись, проходи тесты и собирай очки</span>
            </div>
          </div>
        </div>
      </div>

      <div className="landing-flow">
        <LandingSection
          kicker="Почему NOESIS"
          title="Платформа роста для подростков и детей предпринимателей"
          subtitle="Мы не просто даём уроки. Мы собираем твой маршрут, мотивируем наградами и создаём среду, где хочется двигаться вперёд."
          bullets={[
            "Личный трек под твои цели",
            "Геймификация и награды за активность",
            "Фокус на мышлении, деньгах, проектах",
            "Комьюнити, которое поддержит и не даст слиться",
          ]}
          childrenIllustration={<MascotIllustration />}
        />

        <LandingSection
          kicker="Личный маршрут"
          title="Твой трек развития"
          subtitle="Ответь на вопросы, получи профиль и двигайся по понятной цепочке шагов: курсы, статьи, тесты и челленджи."
          bullets={[
            "Фокус и ясные приоритеты",
            "План по 5 направлениям: мышление, деньги, коммуникации, лидерство, эффективность",
            "Видимый прогресс и чекпоинты",
            "Мотивация за закрытие каждого шага",
          ]}
          reverse
          childrenIllustration={<TrackPreview />}
        />

        <LandingSection
          kicker="Геймификация"
          title="Очки, статусы и достижения"
          subtitle="Получай баллы за действия, открывай уровни и собирай коллекцию достижений. Видно, как ты растёшь."
          bullets={[
            "Баллы за материалы, тесты и челленджи",
            "Статусы за серию дней и общее количество очков",
            "Челленджи с друзьями и группами",
            "Вся статистика в профиле без лишних кликов",
          ]}
          childrenIllustration={<BadgeOrbit />}
        />

        <LandingSection
          kicker="Библиотека"
          title="Курсы, статьи и тесты в одном месте"
          subtitle="Подборка материалов по пяти темам: предпринимательское мышление, деньги, коммуникации, лидерство и эффективность."
          bullets={[
            "Курсы по запуску проектов и управлению ресурсами",
            "Статьи и лонгриды, которые можно пройти на бегу",
            "Тесты после каждого блока, чтобы закрепить знания",
            "Новые материалы каждую неделю",
          ]}
          reverse
          childrenIllustration={
            <DeviceMock
              title="Библиотека NOESIS"
              items={["Курс", "Статья", "Тест", "Разбор"]}
            />
          }
        />

        <LandingSection
          kicker="Для кого"
          title="13–20 лет: ребята, которые хотят большего"
          subtitle="Подходит подросткам и детям предпринимателей. Родители получают систему развития, подростки — живую среду и понятный маршрут."
          bullets={[
            "Гибкие форматы под занятый график",
            "Общение с наставниками и сверстниками",
            "Практика на реальных мини-проектах",
            "Прозрачные отчёты для родителей",
          ]}
          childrenIllustration={<CommunityOrbit />}
        />

        <LandingSection
          kicker="Как это работает"
          title="4 шага до результатов"
          subtitle="Первые шаги занимают меньше 10 минут. Дальше — движение по треку с понятными точками роста."
          bullets={[
            "Ответить на вопросы и зафиксировать цели",
            "Получить персональный трек",
            "Проходить материалы и собирать награды",
            "Видеть прогресс и праздновать уровни",
          ]}
          reverse
          childrenIllustration={<DeviceMock title="Стартовый маршрут" items={["Опрос", "Трек", "Челлендж", "Статус"]} />}
        />

        <LandingSection
          kicker="Среда"
          title="Комьюнити, события и челленджи"
          subtitle="Окружение активных ребят, живые созвоны, проектные спринты и дружеские соревнования."
          bullets={[
            "Чат и встречи по темам",
            "Совместные челленджи на неделю",
            "Поддержка наставников и комьюнити-менеджеров",
            "Видно, кто рядом и кто помогает",
          ]}
          childrenIllustration={<MascotIllustration mood="joy" />}
        />

        <LandingSection
          kicker="Призыв"
          title="Готов начать путь в NOESIS?"
          subtitle="Собери свой трек, получи первые очки и познакомься с комьюнити."
          reverse
          childrenIllustration={<BadgeOrbit />}
        >
          <div className="cta-actions">
            <button className="primary hero-cta" onClick={() => navigate(user ? "/profile" : "/auth")}>
              Апгрейд
            </button>
          </div>
        </LandingSection>
      </div>
    </div>
  );
};

const LibraryPage = ({ completedMaterialIds, trackData }) => {
  const navigate = useNavigate();
  const groupedMaterials = useMemo(
    () =>
      materialThemes.map((theme) => ({
        ...theme,
        items: materials.filter((m) => m.theme === theme.id),
      })),
    []
  );

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Библиотека</h1>
          <p>Дорожки развития, курсы, статьи и тесты в одном месте. Выбирай тему и двигайся шаг за шагом.</p>
        </div>
      </div>

      <TrackSummaryBar track={trackData} completedMaterialIds={completedMaterialIds} />

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

      {groupedMaterials.map((theme) => (
        <div key={theme.id} className="card">
          <div className="card-header">{theme.title}</div>
          <p className="meta">{theme.description}</p>
          <div className="material-grid">
            {theme.items.map((material) => (
              <MaterialCard key={material.id} material={material} completed={completedMaterialIds.includes(material.id)} />
            ))}
          </div>
        </div>
      ))}
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

  if (!material) {
    return (
      <div className="page">
        <div className="card">
          <p>Материал не найден.</p>
          <button className="ghost" onClick={() => navigate(-1)}>Назад</button>
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
      <div className="page-header">
        <div>
          <h1>{material.title}</h1>
          <p className="meta">Тема: {theme.title || material.theme}</p>
        </div>
        <button className="ghost" onClick={() => navigate(-1)}>Назад</button>
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

  if (!test) {
    return (
      <div className="page">
        <div className="card">
          <p>Тест не найден.</p>
          <button className="ghost" onClick={() => navigate(-1)}>Назад</button>
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
      <div className="page-header">
        <div>
          <h1>{test.title}</h1>
          <p className="meta">{test.description}</p>
          {completed && <p className="meta success">Тест уже завершён — результат можно улучшить</p>}
        </div>
        <button className="ghost" onClick={() => navigate(-1)}>Назад</button>
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
  const [theme, setTheme] = useState(() => localStorage.getItem("ep_theme") || "light");
  const initialUser = loadCurrentUser();
  const [user, setUser] = useState(() => initialUser);
  const [gamification, setGamification] = useState(() => loadGamification(initialUser?.id));
  const [trackData, setTrackData] = useState(() => loadTrack(initialUser?.id));
  const [progress, setProgress] = useState(() => loadProgress(initialUser?.id));
  const [activityLog, setActivityLog] = useState(() => loadActivity(initialUser?.id));
  const [missionsState, setMissionsState] = useState(() => loadMissionsState(initialUser?.id));
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    document.body.dataset.theme = theme;
    localStorage.setItem("ep_theme", theme);
  }, [theme]);

  useEffect(() => {
    if (user) {
      setGamification(loadGamification(user.id));
      setTrackData(loadTrack(user.id));
      setProgress(loadProgress(user.id));
      setActivityLog(loadActivity(user.id));
      setMissionsState(loadMissionsState(user.id));
    } else {
      setGamification({ ...defaultGamification });
      setTrackData(loadTrack(null));
      setProgress(loadProgress(null));
      setActivityLog(loadActivity(null));
      setMissionsState(loadMissionsState(null));
    }
  }, [user]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  const addToast = (text) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, text }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  };

  const addToasts = (messages) => messages.forEach((m) => addToast(m));

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
  const updateMissionState = (action) => {
    setMissionsState((prev) => {
      const base = prev || loadMissionsState(user?.id);
      let next = base;
      if (action.type === "status") {
        const previousStatus = base?.missions?.[action.missionId]?.status;
        next = setMissionStatus(base, action.missionId, action.status);
        if (action.status === "completed" && previousStatus !== "completed") {
          pushActivity({ title: `Завершена миссия «${getMissionById(action.missionId)?.title || "Миссия"}»`, type: "миссия" });
          if (user) {
            const previousAchievements = gamification.achievements || [];
            const res = awardForMission(user.id, gamification, action.reward || undefined);
            applyGamificationResult(res, previousAchievements);
          }
        }
      } else if (action.type === "toggleStep") {
        next = toggleMissionStep(base, action.missionId, action.stepId);
      } else if (action.type === "notes") {
        next = setMissionNotes(base, action.missionId, action.text);
      }
      return saveMissionsState(user?.id, next);
    });
  };

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
    } else if (action?.type === "message") {
      pushActivity({ title: "Сообщение в чате", type: "сообщество" });
    } else if (action?.type === "best-answer") {
      pushActivity({ title: "Лучший ответ", type: "сообщество" });
    } else if (action?.type === "club-join") {
      pushActivity({ title: "Присоединился к клубу", type: "сообщество" });
    } else if (action?.type === "question") {
      pushActivity({ title: "Новый вопрос", type: "сообщество" });
    }
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
    const saved = saveTrack(user?.id, payload);
    setTrackData(saved);
    addToast("Трек сохранён");
  };

  const Layout = ({ children }) => (
    <div className={`app ${theme}`}>
      <Header user={user} onLogout={handleLogout} theme={theme} toggleTheme={toggleTheme} />
      <main className="container">{children}</main>
      <Toast messages={toasts} />
    </div>
  );

  const HomeRoute = () => {
    const navigate = useNavigate();
    return <HomePage user={user} navigate={navigate} community={community} gamification={gamification} />;
  };

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomeRoute />} />
          <Route path="/library" element={<LibraryPage completedMaterialIds={completedMaterialIds} trackData={trackData} />} />
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
                user={user}
                gamification={gamification}
                progress={progress}
                trackData={trackData}
                missionsState={missionsState}
                onUpdateMissionState={updateMissionState}
                onMissionCompleted={(mission) => addToast(`Миссия «${mission.title}» закрыта!`)}
              />
            }
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
                missionsState={missionsState}
              />
            }
          />
          <Route path="/auth" element={<AuthPage onAuth={handleAuth} />} />
          <Route
            path="/track"
            element={<TrackQuizPage savedTrack={trackData} materials={materials} onTrackSave={handleTrackSave} />}
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
