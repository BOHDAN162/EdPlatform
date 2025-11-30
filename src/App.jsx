import React, { useEffect, useMemo, useState } from "react";
import { BrowserRouter, Routes, Route, Link, NavLink, useNavigate } from "react-router-dom";
import {
  awardForMaterial,
  awardForTest,
  defaultGamification,
  getStatusByPoints,
  loadGamification,
  progressToNextStatus,
} from "./gamification";
import { articles, communityMembers, courses, tests } from "./data";
import {
  loadCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
  updatePassword,
} from "./auth";
import DevelopmentTrackPage from "./DevelopmentTrackPage";

const Toast = ({ messages }) => {
  if (!messages.length) return null;
  return (
    <div className="toast-stack">
      {messages.map((m) => (
        <div key={m.id} className="toast">{m.text}</div>
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
    { to: "/track", label: "Трек" },
    { to: "/profile", label: "Профиль" },
  ];

  return (
    <header className="header">
      <div className="logo">NOESIS</div>
      <button className="burger" onClick={() => setOpen((v) => !v)} aria-label="menu">☰</button>
      <nav className={`nav ${open ? "open" : ""}`}>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/"}
            className="nav-link"
            onClick={() => setOpen(false)}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
      <div className="header-actions">
        <button className="ghost" onClick={toggleTheme}>{theme === "dark" ? "Тёмная" : "Светлая"}</button>
        {!user && (
          <Link to="/auth" className="primary">Войти</Link>
        )}
        {user && (
          <div className="user-chip">
            <Link to="/profile" className="avatar">{user.name?.[0] || "Я"}</Link>
            <div className="user-meta">
              <div className="user-name">{user.name}</div>
              <button className="ghost" onClick={onLogout}>Выйти</button>
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
          <span key={a} className="tag">{achievementsMap[a] || a}</span>
        ))}
      </div>
    </div>
  );
};

const HomePage = ({ user, navigate, community, gamification }) => {
  const top = [...community].sort((a, b) => b.points - a.points).slice(0, 3);
  return (
    <div className="page">
      <div className="grid hero-grid">
        <div className="card hero">
          <p className="hero-kicker">Платформа NOESIS</p>
          <h1>Будь лучше вчерашнего себя</h1>
          <p className="hero-subtitle">
            Курсы, тесты, статьи и живое сообщество подростков-предпринимателей. Собирай очки, повышай статус и открывай достижения.
          </p>
          <div className="actions">
            <button className="primary" onClick={() => navigate(user ? "/library" : "/auth")}>{user ? "Продолжить" : "Начать"}</button>
            <button className="ghost" onClick={() => navigate("/community")}>Сообщество</button>
          </div>
        </div>
        <GamificationSummary gamification={gamification} />
      </div>
      <div className="card">
        <div className="card-header">ТОП сообщества</div>
        <div className="grid columns-3">
          {top.map((u) => (
            <div key={u.id} className="mini-card">
              <div className="avatar large">{u.name[0]}</div>
              <div className="user-name">{u.name}</div>
              <div className="meta">{u.points} очков • {u.status}</div>
              <div className="badges">
                {u.achievements.slice(0, 2).map((a) => (
                  <span key={a} className="tag">{a}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const CourseCard = ({ course }) => (
  <div className="card">
    <div className="card-header">{course.title}</div>
    <p>{course.description}</p>
    <p className="meta">Возраст: {course.age} • Фокус: {course.focus} • Длительность: {course.duration}</p>
    <div className="tag">Уровень: {course.difficulty}</div>
  </div>
);

const ArticleCard = ({ article, onComplete }) => (
  <div className="card">
    <div className="card-header">{article.title}</div>
    <p>{article.description}</p>
    <p className="meta">{article.content}</p>
    <button className="primary" onClick={() => onComplete(article.id)}>Отметить прочитанным</button>
  </div>
);

const TestCard = ({ test, onComplete }) => {
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);

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
    <div className="card">
      <div className="card-header">{test.title}</div>
      <p className="meta">{test.description}</p>
      <div className="test-grid">
        {test.questions.map((q, qi) => (
          <div key={qi} className="question">
            <div className="q-title">{qi + 1}. {q.text}</div>
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
  );
};

const LibraryPage = ({ onFinishMaterial, onFinishTest }) => {
  const [tab, setTab] = useState("courses");
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Библиотека</h1>
          <p>Курсы, тесты и статьи, чтобы собрать свои очки и навыки.</p>
        </div>
        <div className="tabs">
          <button className={tab === "courses" ? "tab active" : "tab"} onClick={() => setTab("courses")}>Курсы</button>
          <button className={tab === "tests" ? "tab active" : "tab"} onClick={() => setTab("tests")}>Тесты</button>
          <button className={tab === "articles" ? "tab active" : "tab"} onClick={() => setTab("articles")}>Статьи</button>
        </div>
      </div>
      <div className="grid cards">
        {tab === "courses" && courses.map((c) => <CourseCard key={c.id} course={c} />)}
        {tab === "articles" && articles.map((a) => <ArticleCard key={a.id} article={a} onComplete={onFinishMaterial} />)}
        {tab === "tests" && tests.map((t) => <TestCard key={t.id} test={t} onComplete={onFinishTest} />)}
      </div>
    </div>
  );
};

const CommunityPage = ({ community }) => {
  const data = [...community].sort((a, b) => b.points - a.points);
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Сообщество участников</h1>
          <p>20+ ребят, которые уже копят очки и делятся прогрессом.</p>
        </div>
      </div>
      <div className="grid cards columns-3">
        {data.map((u) => (
          <div key={u.id} className="card">
            <div className="card-header">{u.name}</div>
            <p className="meta">{u.status}</p>
            <div className="big-number">{u.points} очков</div>
            <div className="badges">
              {u.achievements.slice(0, 3).map((a) => (
                <span key={a} className="tag">{a}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ProfilePage = ({ user, gamification, onPasswordChange }) => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");

  const submit = () => {
    if (!password || !confirm) {
      setMessage("Заполни оба поля");
      return;
    }
    if (password !== confirm) {
      setMessage("Пароли не совпадают");
      return;
    }
    onPasswordChange(password);
    setMessage("Пароль обновлён");
    setPassword("");
    setConfirm("");
  };

  if (!user) {
    return (
      <div className="page">
        <div className="card">
          <p>Сначала войди или зарегистрируйся.</p>
          <Link to="/auth" className="primary">Перейти к авторизации</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="grid profile-grid">
        <div className="card">
          <div className="avatar large">{user.name[0]}</div>
          <div className="card-header">{user.name}</div>
          <p className="meta">Email: {user.email}</p>
          <p className="meta">Статус: {getStatusByPoints(gamification.totalPoints)}</p>
        </div>
        <GamificationSummary gamification={gamification} />
        <div className="card">
          <div className="card-header">Смена пароля</div>
          <div className="form">
            <label>Новый пароль<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></label>
            <label>Подтверждение пароля<input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} /></label>
            <button className="primary" onClick={submit}>Сохранить</button>
            {message && <div className="success">{message}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

const AuthPage = ({ onAuth }) => {
  const [tab, setTab] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (tab === "register") {
      if (!form.name || !form.email || !form.password) {
        setError("Заполни все поля");
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
    <div className="page">
      <div className="page-header">
        <h1>{tab === "login" ? "Вход" : "Регистрация"}</h1>
        <div className="tabs">
          <button className={tab === "login" ? "tab active" : "tab"} onClick={() => setTab("login")}>Вход</button>
          <button className={tab === "register" ? "tab active" : "tab"} onClick={() => setTab("register")}>Регистрация</button>
        </div>
      </div>
      <div className="card">
        <div className="form">
          {tab === "register" && (
            <label>Имя<input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} /></label>
          )}
          <label>Email<input type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} /></label>
          <label>Пароль<input type="password" value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} /></label>
          {error && <div className="error">{error}</div>}
          <button className="primary" onClick={handleSubmit}>{tab === "login" ? "Войти" : "Зарегистрироваться"}</button>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem("ep_theme") || "light");
  const [user, setUser] = useState(() => loadCurrentUser());
  const [gamification, setGamification] = useState(() => loadGamification(loadCurrentUser()?.id));
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    document.body.dataset.theme = theme;
    localStorage.setItem("ep_theme", theme);
  }, [theme]);

  useEffect(() => {
    if (user) {
      setGamification(loadGamification(user.id));
    } else {
      setGamification({ ...defaultGamification });
    }
  }, [user]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  const addToast = (text) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, text }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  };

  const addToasts = (messages) => messages.forEach((m) => addToast(m));

  const handleFinishMaterial = () => {
    if (!user) {
      addToast("Войдите, чтобы получить очки за материалы");
      return;
    }
    const res = awardForMaterial(user.id, gamification);
    setGamification(res.gamification);
    addToasts(res.messages);
  };

  const handleFinishTest = () => {
    if (!user) {
      addToast("Войдите, чтобы получить очки за тест");
      return;
    }
    const res = awardForTest(user.id, gamification);
    setGamification(res.gamification);
    addToasts(res.messages);
  };

  const handleAuth = (usr) => {
    setUser(usr);
    setGamification(loadGamification(usr.id));
  };

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    setGamification({ ...defaultGamification });
  };

  const handlePasswordChange = (password) => {
    if (user) {
      const updated = updatePassword(user.id, password);
      if (updated) setUser(updated);
    }
  };

  const community = useMemo(() => {
    if (!user) return communityMembers;
    const me = {
      id: "me",
      name: user.name,
      points: gamification.totalPoints,
      status: getStatusByPoints(gamification.totalPoints),
      achievements: gamification.achievements.map((a) =>
        a === "first-test"
          ? "Первый тест"
          : a === "tests-3"
          ? "3 теста подряд"
          : a === "materials-5"
          ? "Закрыл 5 материалов"
          : a === "points-100"
          ? "100 очков"
          : a === "points-300"
          ? "300 очков"
          : a
      ),
    };
    return [me, ...communityMembers];
  }, [user, gamification]);

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
          <Route path="/library" element={<LibraryPage onFinishMaterial={handleFinishMaterial} onFinishTest={handleFinishTest} />} />
          <Route path="/community" element={<CommunityPage community={community} />} />
          <Route path="/profile" element={<ProfilePage user={user} gamification={gamification} onPasswordChange={handlePasswordChange} />} />
          <Route path="/auth" element={<AuthPage onAuth={handleAuth} />} />
          <Route path="/track" element={<DevelopmentTrackPage materials={articles} onSaveTrack={() => addToast("Трек сохранён") } />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
