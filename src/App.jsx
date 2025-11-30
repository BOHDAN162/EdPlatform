import React, { useEffect, useMemo, useState } from "react";
import { BrowserRouter, Routes, Route, Link, NavLink, useNavigate, useParams } from "./routerShim";
import {
  awardForMaterial,
  awardForTest,
  defaultGamification,
  getStatusByPoints,
  loadGamification,
  progressToNextStatus,
} from "./gamification";
import { communityMembers, tests } from "./data";
import { learningPaths, materialThemes, materials, getMaterialById, themeLabels } from "./libraryData";
import { getPathProgress, loadProgress, markMaterialCompleted } from "./progress";
import { loadActivity, registerActivity } from "./activity";
import PathCard from "./components/PathCard";
import MaterialCard from "./components/MaterialCard";
import { loadCurrentUser, loginUser, logoutUser, registerUser, updatePassword } from "./auth";
import { loadTrack } from "./trackStorage";
import LandingSection from "./LandingSection";
import MascotIllustration from "./MascotIllustration";
import Dashboard from "./Dashboard";

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
      <Link to="/" className="logo">NOESIS</Link>
      <button className="burger" onClick={() => setOpen((v) => !v)} aria-label="menu">
        ☰
      </button>
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
    <div className="page">
      <div className="card hero-spotlight">
        <div className="hero-inner">
          <p className="hero-kicker">Платформа развития</p>
          <h1 className="hero-title">Будь лучше вчерашнего себя</h1>
          <p className="hero-subtitle">
            Квесты, контент, форматы, сообщество, игры мышления и персональный путь — все чтобы прокачать себя и становиться сильнее каждый день.
          </p>
          <div className="quote-panel">
            <p className="quote-text">«Единственный способ сделать великую работу — любить то, что ты делаешь.»</p>
            <p className="quote-author">— Стив Джобс</p>
          </div>
          <div className="actions hero-actions">
            <button className="primary hero-cta" onClick={() => navigate(user ? "/library" : "/auth")}>Начать учиться</button>
            <button className="ghost" onClick={() => navigate(user ? "/profile" : "/auth")}>Перейти в профиль</button>
            <button className="ghost" onClick={() => navigate("/community")}>Посмотреть сообщество</button>
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

      <div className="grid hero-grid">
        <div className="card track-highlight">
          <div className="card-header">Личный трек развития</div>
          <p className="meta">Определи направление, собери подборку материалов и двигайся по персональному маршруту.</p>
          <div className="track-steps">
            <div className="pill">Осознание болей</div>
            <div className="pill">Определение сильных сторон</div>
            <div className="pill">Грамотное использование ресурсов</div>
          </div>
          <p className="meta">Это пригодится в любых направлениях — учёбе, бизнесе, работе и настройке своей головы.</p>
          <div className="track-actions">
            <button className="primary outline" onClick={() => navigate(user ? "/profile" : "/auth")}>Открыть профиль</button>
            <button className="ghost" onClick={() => navigate("/library")}>Посмотреть материалы</button>
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
                  <span key={a} className="tag">
                    {a}
                  </span>
                ))}
              </div>
            </div>
          ))}
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
            <button className="primary hero-cta" onClick={() => navigate(user ? "/profile" : "/auth")}>Открыть профиль</button>
            <button className="ghost" onClick={() => navigate(user ? "/library" : "/auth")}>Зарегистрироваться и начать</button>
            <button className="ghost" onClick={() => navigate("/community")}>Сообщество</button>
          </div>
        </LandingSection>
      </div>
    </div>
  );
};

const LibraryPage = ({ completedMaterialIds }) => {
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
        <div className="cta-actions">
          <button className="ghost" onClick={() => navigate("/community")}>Сообщество</button>
          <button className="ghost" onClick={() => navigate("/profile")}>Профиль</button>
        </div>
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

const CommunityPage = ({ community }) => {
  const data = [...community].sort((a, b) => b.points - a.points);
  const navigate = useNavigate();
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Сообщество участников</h1>
          <p>20+ ребят, которые уже копят очки и делятся прогрессом.</p>
        </div>
        <div className="cta-actions">
          <button className="ghost" onClick={() => navigate("/library")}>Библиотека</button>
          <button className="ghost" onClick={() => navigate("/profile")}>Профиль</button>
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
                <span key={a} className="tag">
                  {a}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ProfilePage = ({ user, gamification, onPasswordChange, trackData, progress, community, activity, onVisit }) => {
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

  const faq = [
    {
      q: "Что такое личный трек развития?",
      a: "Это персональный маршрут по курсам, статьям и тестам в нашей платформе. Мы подбираем для тебя 10 шагов, исходя из твоих ответов в опросе и твоего текущего профиля. Проходя этот трек, ты двигаешься к своим целям более осознанно и планомерно.",
    },
    {
      q: "Нужно ли проходить опрос каждый раз заново?",
      a: "Нет. Опрос проходится один раз. После того как ты ответил на 10 вопросов и нажал “Сформировать мой трек развития”, результат сохраняется. В разделе “Трек” ты увидишь готовую стратегию и прогресс по шагам. При желании ты можешь сбросить трек и пройти опрос ещё раз.",
    },
    {
      q: "Как работают баллы и уровни?",
      a: "За прохождение тестов, курсов и статей ты получаешь баллы. Чем больше баллов — тем выше твой уровень и статус в системе. Это помогает видеть свой прогресс и даёт мотивацию двигаться дальше.",
    },
    {
      q: "Что дают достижения?",
      a: "Достижения — это специальные отметки за ключевые действия: первый тест, серия пройденных материалов, набор определённого количества баллов. Они помогают фиксировать важные шаги в развитии и выделяют тебя в сообществе.",
    },
    {
      q: "Где посмотреть свой прогресс?",
      a: "Основной прогресс по развитию можно увидеть в разделе “Профиль” — там отображаются баллы, статус, достижения и общий прогресс по треку. Также прогресс виден на линии трека в разделе “Трек развития”.",
    },
    {
      q: "Можно ли поменять свой трек?",
      a: "Да. Если ты чувствуешь, что трек больше тебе не подходит, ты можешь сбросить его и пройти опрос заново. Тогда мы сформируем для тебя новый маршрут на основе свежих ответов.",
    },
    {
      q: "Что делать, если я забыл пароль?",
      a: "Если ты забыл пароль, воспользуйся формой смены пароля в профиле или на странице входа (в рамках текущего MVP это может быть ручной сброс внутри приложения). В будущих версиях мы добавим восстановление пароля через email.",
    },
    {
      q: "Кто видит мои баллы и достижения?",
      a: "В базовом режиме твои баллы и достижения видишь ты сам. Если ты участвуешь в рейтингах или челленджах внутри сообщества, часть информации может отображаться в общем списке участников, но без лишних личных данных.",
    },
    {
      q: "Нужно ли платить за доступ к материалам?",
      a: "Сейчас платформа находится на этапе развития и тестирования. Часть материалов может быть открыта бесплатно, часть может потребовать отдельного доступа. Точную информацию о доступе ты увидишь рядом с каждым курсом или программой.",
    },
    {
      q: "Для кого вообще эта платформа?",
      a: "NOESIS создаётся для подростков и детей предпринимателей, которые хотят развиваться быстрее: понимать себя, разбираться в деньгах, пробовать проекты, прокачивать мышление и окружать себя сильными ребятами. Родители получают здесь понятную систему развития, а подростки — живую среду и понятный маршрут.",
    },
  ];

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
      <Dashboard
        user={user}
        trackData={trackData}
        progress={progress}
        gamification={gamification}
        community={community}
        activity={activity}
        onVisit={onVisit}
      />
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
            <label>
              Новый пароль
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </label>
            <label>
              Подтверждение пароля
              <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
            </label>
            <button className="primary" onClick={submit}>Сохранить</button>
            {message && <div className="success">{message}</div>}
          </div>
        </div>
      </div>
      <div className="card faq-card">
        <div className="card-header">Помощь</div>
        <div className="faq-list">
          {faq.map((item, idx) => (
            <details key={idx} className="faq-item" open={idx === 0}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
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
      navigate("/");
      return;
    }
    const res = loginUser({ email: form.email.trim(), password: form.password });
    if (!res.ok) {
      setError(res.error || "Неверные данные");
      return;
    }
    onAuth(res.user);
    navigate("/");
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>{tab === "login" ? "Вход" : "Регистрация"}</h1>
        <div className="tabs">
          <button className={tab === "login" ? "tab active" : "tab"} onClick={() => setTab("login")}>
            Вход
          </button>
          <button className={tab === "register" ? "tab active" : "tab"} onClick={() => setTab("register")}>
            Регистрация
          </button>
        </div>
      </div>
      <div className="card">
        <div className="form">
          {tab === "register" && (
            <label>
              Имя
              <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value || "Макс" }))} />
            </label>
          )}
          <label>
            Email
            <input type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
          </label>
          <label>
            Пароль
            <input type="password" value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} />
          </label>
          {error && <div className="error">{error}</div>}
          <button className="primary" onClick={handleSubmit}>
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
  const [user, setUser] = useState(() => loadCurrentUser());
  const [gamification, setGamification] = useState(() => loadGamification(loadCurrentUser()?.id));
  const [trackData, setTrackData] = useState(() => loadTrack(loadCurrentUser()?.id));
  const [progress, setProgress] = useState(() => loadProgress(loadCurrentUser()?.id));
  const [activity, setActivity] = useState(() => loadActivity(loadCurrentUser()?.id));
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
      setActivity(loadActivity(user.id));
    } else {
      setGamification({ ...defaultGamification });
      setTrackData(loadTrack(null));
      setProgress(loadProgress(null));
      setActivity(loadActivity(null));
    }
  }, [user]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  const addToast = (text) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, text }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  };

  const addToasts = (messages) => messages.forEach((m) => addToast(m));

  const recordActivity = (event) => {
    const updated = registerActivity(user?.id, event);
    setActivity(updated);
  };

  const completedMaterialIds = progress.completedMaterialIds || [];

  const handleFinishMaterial = (materialId, materialType) => {
    const alreadyCompleted = completedMaterialIds.includes(materialId);
    const updatedProgress = markMaterialCompleted(user?.id, materialId, progress);
    setProgress(updatedProgress);
    if (alreadyCompleted) {
      addToast("Материал уже отмечен как завершён");
      return;
    }
    if (!user) {
      addToast("Войдите, чтобы получить очки за материалы");
    } else {
      const res = awardForMaterial(user.id, gamification);
      setGamification(res.gamification);
      addToasts(res.messages);
    }
    const material = getMaterialById(materialId);
    recordActivity({
      type: "material",
      text: `Закрыл материал «${material?.title || "Материал"}»`,
      materialId,
      materialType,
    });
  };

  const handleFinishTest = ({ testId }) => {
    const alreadyCompleted = completedMaterialIds.includes(testId);
    const updatedProgress = markMaterialCompleted(user?.id, testId, progress);
    setProgress(updatedProgress);
    if (alreadyCompleted) {
      addToast("Тест уже закрыт, но можно освежить знания");
      return;
    }
    if (!user) {
      addToast("Войдите, чтобы получить очки за тест");
    } else {
      const res = awardForTest(user.id, gamification);
      setGamification(res.gamification);
      addToasts(res.messages);
    }
    const test = tests.find((t) => t.id === testId);
    recordActivity({ type: "test", text: `Пройден тест «${test?.title || "Тест"}»`, materialId: testId });
  };

  const handleAuth = (usr) => {
    setUser(usr);
    setGamification(loadGamification(usr.id));
    setTrackData(loadTrack(usr.id));
    setProgress(loadProgress(usr.id));
    setActivity(loadActivity(usr.id));
  };

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    setGamification({ ...defaultGamification });
    setTrackData(loadTrack(null));
    setProgress(loadProgress(null));
    setActivity(loadActivity(null));
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

  const DashboardRedirect = () => {
    const navigate = useNavigate();
    useEffect(() => {
      navigate("/profile");
    }, [navigate]);
    return null;
  };

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomeRoute />} />
          <Route path="/dashboard" element={<DashboardRedirect />} />
          <Route path="/library" element={<LibraryPage completedMaterialIds={completedMaterialIds} />} />
          <Route path="/library/paths/:slug" element={<LearningPathPage completedMaterialIds={completedMaterialIds} />} />
          <Route
            path="/library/:type/:id"
            element={<MaterialDetailPage onComplete={handleFinishMaterial} completedMaterialIds={completedMaterialIds} />}
          />
          <Route path="/tests/:id" element={<TestPage onComplete={handleFinishTest} completedMaterialIds={completedMaterialIds} />} />
          <Route path="/community" element={<CommunityPage community={community} />} />
          <Route
            path="/profile"
            element={
              <ProfilePage
                user={user}
                gamification={gamification}
                trackData={trackData}
                progress={progress}
                community={community}
                activity={activity}
                onVisit={recordActivity}
                onPasswordChange={handlePasswordChange}
              />
            }
          />
          <Route path="/auth" element={<AuthPage onAuth={handleAuth} />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
