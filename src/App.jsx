import React, { useEffect, useMemo, useState } from "react";
import { BrowserRouter, Routes, Route, Link, NavLink, useNavigate, useParams } from "./routerShim";
import {
  awardForCommunityAction,
  awardForMaterial,
  awardForTest,
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
import { loadCurrentUser, loginUser, logoutUser, registerUser } from "./auth";
import DevelopmentTrackPage from "./DevelopmentTrackPage";
import { clearTrack, loadTrack, saveTrack } from "./trackStorage";
import ProfileDashboard from "./ProfileDashboard";
import { loadStreak, resetStreak, updateStreakOnActivity } from "./streak";
import { addActivityEntry, clearActivity, loadActivity } from "./activityLog";
import CommunityPage from "./community/CommunityPage";

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
        {!user && (
          <Link to="/login" className="primary" onClick={() => setOpen(false)}>
            Войти
          </Link>
        )}
        {user && (
          <div className="user-chip">
            <Link to="/profile" className="avatar" onClick={() => setOpen(false)}>
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

const Footer = () => (
  <footer className="footer">
    <div className="footer-brand">NOESIS · платформа развития</div>
    <div className="footer-links">
      <Link to="/">О платформе</Link>
      <a href="#privacy">Политика конфиденциальности</a>
      <a href="#contacts">Контакты</a>
    </div>
    <p className="meta">Мы создаём безопасное пространство, где подростки растут через практику, игры и поддержку сообщества.</p>
  </footer>
);

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
  const top = [...community].sort((a, b) => b.points - a.points).slice(0, 3);
  return (
    <div className="page landing">
      <section className="hero">
        <div className="hero-copy">
          <p className="hero-kicker">НОВАЯ ВЕРСИЯ NOESIS</p>
          <h1>
            Платформа развития для подростков и детей предпринимателей
          </h1>
          <p className="hero-subtitle">
            Треки, комьюнити и геймификация. Помогаем за 5–7 секунд понять, зачем ты здесь: чтобы расти не по лайкам, а по делу.
          </p>
          <div className="hero-actions">
            <button className="primary" onClick={() => navigate(user ? "/profile" : "/login")}>Начать трек развития</button>
            <button className="ghost" onClick={() => navigate("/library")}>Посмотреть библиотеку</button>
          </div>
          <div className="hero-badges">
            <span className="pill">Очки, уровни, серия дней</span>
            <span className="pill">Живое комьюнити</span>
            <span className="pill">Практика и реальные кейсы</span>
          </div>
        </div>
        <div className="hero-visual">
          <DeviceMock title="Твой маршрут" items={["Опрос", "Трек", "XP", "Ачивки"]} />
          <BadgeOrbit />
        </div>
      </section>

      <section className="card soft">
        <div className="section-head">
          <div>
            <p className="hero-kicker">Как это работает</p>
            <h2>4 шага, чтобы включиться</h2>
            <p className="meta">Мы ведём тебя от первого ответа до устойчивой привычки учиться.</p>
          </div>
          <button className="ghost" onClick={() => navigate(user ? "/profile" : "/login")}>Стартовать</button>
        </div>
        <div className="steps-grid">
          {[{title:"Пройди короткий опрос",text:"Фиксируем твои цели и выбираем роль."},{title:"Получишь личный трек развития",text:"Готовый маршрут с материалами и челленджами."},{title:"Учись, играй и расти",text:"Собирай XP, уровни и ачивки за каждый шаг."},{title:"Поддержка комьюнити",text:"Встречи, рейтинги и ответы на вопросы."}].map((step, idx) => (
            <div className="mini-card" key={step.title}>
              <div className="step-index">{idx + 1}</div>
              <div className="mini-title">{step.title}</div>
              <p className="meta">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid two">
        <div className="card">
          <p className="hero-kicker">Если ты подросток</p>
          <h3>Мы помогаем увидеть направление</h3>
          <ul className="bullet-list">
            <li>Понимаешь, куда двигаться и как монетизировать идеи.</li>
            <li>Учишься через реальные задачи, а не только теорию.</li>
            <li>Получаешь очки, уровни и ачивки за развитие.</li>
            <li>Видишь других ребят и не чувствуешь себя один.</li>
          </ul>
        </div>
        <div className="card">
          <p className="hero-kicker">Если ты родитель</p>
          <h3>Прозрачный рост ребёнка</h3>
          <ul className="bullet-list">
            <li>Видишь, чем занят ребёнок и какие навыки собирает.</li>
            <li>Получаешь прозрачную картину прогресса и отчёты.</li>
            <li>Уверенность, что время в телефоне тратится с пользой.</li>
            <li>Комьюнити, где безопасно и мотивирующе.</li>
          </ul>
        </div>
      </section>

      <section className="card soft">
        <div className="section-head">
          <div>
            <p className="hero-kicker">Что внутри</p>
            <h2>Контент, треки и комьюнити</h2>
            <p className="meta">Всё собрано в одном месте, чтобы не потеряться.</p>
          </div>
        </div>
        <div className="feature-grid">
          {[{title:"Треки развития",text:"Персональные цепочки шагов под твои цели."},{title:"Библиотека",text:"Курсы, статьи, тесты и практики по ключевым темам."},{title:"Сообщество и клубы",text:"Лента, клубы, рейтинги, вопросы и чаты."},{title:"Геймификация",text:"XP, уровни, серия дней и ачивки за активность."}].map((card) => (
            <div className="feature-card" key={card.title}>
              <div className="pill outline">{card.title}</div>
              <p>{card.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="card">
        <div className="section-head">
          <div>
            <p className="hero-kicker">Лига NOESIS</p>
            <h2>Сообщество, которое двигает вперёд</h2>
          </div>
        </div>
        <div className="top-grid">
          <div className="top-list">
            {top.map((u, idx) => (
              <div className="top-row" key={u.id}>
                <div className="avatar large">{u.name[0]}</div>
                <div>
                  <div className="user-name">{u.name}</div>
                  <p className="meta">{u.points} XP · {u.status}</p>
                </div>
                <span className="pill outline">#{idx + 1}</span>
              </div>
            ))}
          </div>
          <div className="cta-panel">
            <p className="meta">Уровень {getLevelFromPoints(gamification.totalPoints).level} · {gamification.totalPoints} XP</p>
            <p>Вступай в клубы, участвуй в рейтингах и собирай достижения.</p>
            <button className="primary" onClick={() => navigate("/community")}>Зайти в сообщество</button>
          </div>
        </div>
      </section>

      <section className="cta-final card soft">
        <div>
          <p className="hero-kicker">Готов?</p>
          <h2>Начни трек развития и держи серию</h2>
          <p className="meta">Буквально пару кликов — и у тебя личный маршрут с наградами.</p>
        </div>
        <div className="hero-actions">
          <button className="primary" onClick={() => navigate(user ? "/profile" : "/login")}>Начать сейчас</button>
          <button className="ghost" onClick={() => navigate("/library")}>Открыть библиотеку</button>
        </div>
      </section>
    </div>
  );
};

const LibraryPage = ({ completedMaterialIds, trackData }) => {
  const navigate = useNavigate();
  const [themeFilter, setThemeFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [onlyRecommended, setOnlyRecommended] = useState(false);

  const recommendedSet = useMemo(() => new Set(trackData?.generatedTrack?.map((s) => s.materialId) || []), [trackData]);

  const filtered = useMemo(() => {
    return materials.filter((m) => {
      if (onlyRecommended && recommendedSet.size > 0 && !recommendedSet.has(m.id)) return false;
      if (themeFilter !== "all" && m.theme !== themeFilter) return false;
      if (typeFilter !== "all" && m.type !== typeFilter) return false;
      return true;
    });
  }, [themeFilter, typeFilter, onlyRecommended, recommendedSet]);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Библиотека</h1>
          <p className="meta">Курсы, статьи, практики и тесты по ключевым темам: мышление, финансы, коммуникации, проекты.</p>
        </div>
        <button className="ghost" onClick={() => navigate("/profile")}>В профиль</button>
      </div>

      <div className="filters card soft">
        <div className="filter-row">
          <div>
            <p className="hero-kicker">Темы</p>
            <div className="chip-row scrollable">
              <button className={`pill ${themeFilter === "all" ? "active" : "outline"}`} onClick={() => setThemeFilter("all")}>Все</button>
              {materialThemes.map((theme) => (
                <button
                  key={theme.id}
                  className={`pill ${themeFilter === theme.id ? "active" : "outline"}`}
                  onClick={() => setThemeFilter(theme.id)}
                >
                  {theme.title}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="hero-kicker">Формат</p>
            <div className="chip-row">
              {[{ id: "all", label: "Все" }, { id: "course", label: "Курсы" }, { id: "article", label: "Статьи" }, { id: "test", label: "Тесты" }].map((t) => (
                <button
                  key={t.id}
                  className={`pill ${typeFilter === t.id ? "active" : "outline"}`}
                  onClick={() => setTypeFilter(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="recommended-toggle">
          <label className="toggle">
            <input type="checkbox" checked={onlyRecommended} onChange={(e) => setOnlyRecommended(e.target.checked)} />
            <span>Рекомендовано тебе</span>
          </label>
          <p className="meta">Мы подсветили материалы из твоего трека и похожие темы.</p>
        </div>
      </div>

      <div className="card">
        <div className="card-header">Дорожки по темам</div>
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

      <div className="material-grid">
        {filtered.map((material) => (
          <MaterialCard key={material.id} material={material} completed={completedMaterialIds.includes(material.id)} />
        ))}
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
    navigate(target.type === "test" ? `/tests/${target.id}` : `/library/${target.type}/${target.id}`);
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
  const [form, setForm] = useState({ name: "", age: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    setError("");
    if (tab === "register") {
      if (!form.name || !form.email || !form.password || !form.confirm) {
        setError("Заполни все поля");
        return;
      }
      if (form.password !== form.confirm) {
        setError("Пароли не совпадают");
        return;
      }
      const res = registerUser({ name: form.name.trim(), email: form.email.trim(), password: form.password });
      if (!res.ok) {
        setError(res.error || "Ошибка регистрации");
        return;
      }
      onAuth(res.user);
      navigate("/profile");
      return;
    }
    const res = loginUser({ email: form.email.trim(), password: form.password });
    if (!res.ok) {
      setError(res.error || "Неверные данные");
      return;
    }
    onAuth(res.user);
    navigate("/profile");
  };

  return (
    <div className="page auth-page">
      <div className="card soft">
        <div className="auth-head">
          <div>
            <p className="hero-kicker">Вход / Регистрация</p>
            <h1>Подключись к NOESIS</h1>
            <p className="meta">Один аккаунт — доступ к трекам, библиотеке и комьюнити.</p>
          </div>
          <div className="tabs">
            <button className={tab === "login" ? "tab active" : "tab"} onClick={() => setTab("login")}>Войти</button>
            <button className={tab === "register" ? "tab active" : "tab"} onClick={() => setTab("register")}>Создать аккаунт</button>
          </div>
        </div>

        <div className="auth-grid">
          <div className="form">
            {tab === "register" && (
              <>
                <label>
                  Имя
                  <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="Например, Алина" />
                </label>
                <label>
                  Возраст (необязательно)
                  <input value={form.age} onChange={(e) => setForm((p) => ({ ...p, age: e.target.value }))} placeholder="15" />
                </label>
              </>
            )}
            <label>
              Email
              <input type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} placeholder="you@example.com" />
            </label>
            <label>
              Пароль
              <input type="password" value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} placeholder="••••••••" />
            </label>
            {tab === "register" && (
              <label>
                Повтори пароль
                <input type="password" value={form.confirm} onChange={(e) => setForm((p) => ({ ...p, confirm: e.target.value }))} placeholder="••••••••" />
              </label>
            )}
            {error && <div className="error">{error}</div>}
            <button className="primary" onClick={handleSubmit}>
              {tab === "login" ? "Войти" : "Создать аккаунт"}
            </button>
          </div>

          <div className="auth-aside">
            <div className="mini-card">
              <div className="mini-title">Что даст аккаунт?</div>
              <ul className="bullet-list">
                <li>Сохраняем прогресс, XP и серию дней.</li>
                <li>Открываем треки под твои цели.</li>
                <li>Доступ ко всем разделам сообщества.</li>
              </ul>
            </div>
            <div className="mini-card">
              <div className="mini-title">Безопасность</div>
              <p className="meta">Мы не передаём данные третьим лицам. Можно выйти в любой момент.</p>
            </div>
          </div>
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
  const [streak, setStreak] = useState(() => loadStreak(initialUser?.id));
  const [activityLog, setActivityLog] = useState(() => loadActivity(initialUser?.id));
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
      setStreak(loadStreak(user.id));
      setActivityLog(loadActivity(user.id));
    } else {
      setGamification({ ...defaultGamification });
      setTrackData(loadTrack(null));
      setProgress(loadProgress(null));
      setStreak(loadStreak(null));
      setActivityLog(loadActivity(null));
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

  const completedMaterialIds = progress.completedMaterialIds || [];

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
      setGamification(res.gamification);
      addToasts(res.messages);
      const newAchievements = res.gamification.achievements.filter((a) => !previousAchievements.includes(a));
      newAchievements.forEach((ach) => pushActivity({ title: `Достижение: ${ach}`, type: "достижение" }));
    }
    const updatedStreak = updateStreakOnActivity(user?.id, streak);
    setStreak(updatedStreak);
    pushActivity({ title: `Закрыт материал «${material?.title || "Материал"}»`, type: materialType || material?.type || "материал" });
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
      setGamification(res.gamification);
      addToasts(res.messages);
      const newAchievements = res.gamification.achievements.filter((a) => !previousAchievements.includes(a));
      newAchievements.forEach((ach) => pushActivity({ title: `Достижение: ${ach}`, type: "достижение" }));
    }
    const updatedStreak = updateStreakOnActivity(user?.id, streak);
    setStreak(updatedStreak);
    pushActivity({ title: `Пройден тест «${test?.title || "Тест"}»`, type: "тест" });
  };

  const handleCommunityAction = (action) => {
    if (!user) {
      addToast("Войдите, чтобы получать XP за активность в сообществе");
      return;
    }
    const previousAchievements = gamification.achievements || [];
    const res = awardForCommunityAction(user.id, gamification, action);
    setGamification(res.gamification);
    addToasts(res.messages);
    const newAchievements = res.gamification.achievements.filter((a) => !previousAchievements.includes(a));
    newAchievements.forEach((ach) => pushActivity({ title: `Достижение: ${ach}`, type: "достижение" }));
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
    setStreak(loadStreak(usr.id));
    setActivityLog(loadActivity(usr.id));
  };

  const handleLogout = () => {
    const currentId = user?.id;
    logoutUser();
    resetStreak(currentId);
    clearActivity(currentId);
    setUser(null);
    setGamification({ ...defaultGamification });
    setTrackData(loadTrack(null));
    setProgress(loadProgress(null));
    setStreak(loadStreak(null));
    setActivityLog(loadActivity(null));
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

  const handleTrackSave = (payload) => {
    const saved = saveTrack(user?.id, payload);
    setTrackData(saved);
    addToast("Трек сохранён");
  };

  const handleTrackReset = () => {
    clearTrack(user?.id);
    setTrackData(null);
    addToast("Трек сброшен");
  };

  const Layout = ({ children }) => (
    <div className={`app ${theme}`}>
      <Header user={user} onLogout={handleLogout} theme={theme} toggleTheme={toggleTheme} />
      <main className="container">{children}</main>
      <Footer />
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
            element={<MaterialDetailPage onComplete={handleFinishMaterial} completedMaterialIds={completedMaterialIds} />}
          />
          <Route path="/tests/:id" element={<TestPage onComplete={handleFinishTest} completedMaterialIds={completedMaterialIds} />} />
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
              />
            }
          />
          <Route path="/login" element={<AuthPage onAuth={handleAuth} />} />
          <Route
            path="/track"
            element={
              <DevelopmentTrackPage
                libraryMaterials={materials}
                userId={user?.id}
                savedTrack={trackData}
                completedMaterialIds={completedMaterialIds}
                onTrackSave={handleTrackSave}
                onTrackReset={handleTrackReset}
              />
            }
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
