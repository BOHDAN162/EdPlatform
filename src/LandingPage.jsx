import React from "react";
import { useNavigate } from "./routerShim";
import Mascot from "./components/Mascot";

const steps = [
  {
    title: "Пройди 10 вопросов",
    description: "3–5 минут, без правильных и неправильных ответов — только про тебя.",
  },
  {
    title: "Узнай свой тип личности",
    description: "Мы собираем профиль: сильные стороны, риски, стиль мышления.",
  },
  {
    title: "Собери свой трек развития",
    description: "Миссии, привычки и мини-игры под твой тип.",
  },
  {
    title: "Играй и прокачивай жизнь",
    description: "Закрывай миссии, получай XP и двигаешься вперёд каждый день.",
  },
];

const trackBullets = [
  "Миссии под твой тип личности",
  "XP и уровни за реальные действия",
  "Цели, которые определяешь ты — платформа помогает не слиться",
];

const libraryCards = [
  { title: "Мышление • article", meta: "10 мин", status: "В процессе" },
  { title: "Бизнес • video", meta: "12 мин", status: "Завершено" },
  { title: "Эмоции • longread", meta: "8 мин", status: "В избранном" },
  { title: "Навыки • microcourse", meta: "15 мин", status: "Новое" },
];

const mindGames = [
  { title: "Фокус", meta: "Внимание и концентрация" },
  { title: "Память", meta: "Запоминай быстрее" },
  { title: "Быстрая реакция", meta: "Решай на скорости" },
];

const transformationPairs = [
  { before: "Хаос в голове", after: "Понятная карта развития" },
  { before: "Бесконечный скролл соцсетей", after: "Миссии и мини-игры, которые реально развивают" },
  { before: "\"Я не знаю, кто я\"", after: "Профиль личности и сильных сторон" },
  { before: "Делать всё одному", after: "Комьюнити и проводник рядом" },
];

const LandingPage = () => {
  const navigate = useNavigate();

  const handleStartQuiz = () => {
    navigate("/track-quiz");
  };

  const handleScrollToHow = () => {
    const el = document.getElementById("how-it-works");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleOpenLibrary = () => navigate("/library");
  const handleOpenAuth = () => navigate("/auth");

  return (
    <div className="landing-page">
      <section className="landing-section landing-hero reveal">
        <div className="landing-container hero-grid">
          <div className="hero-copy appear">
            <span className="eyebrow">Экосистема развития 13–20</span>
            <h1>Игра, которая прокачивает твою реальную жизнь</h1>
            <p className="lead">
              Ответь на 10 вопросов, узнай свой тип личности и получи трек развития под себя: миссии, привычки,
              мини-игры и поддержка комьюнити.
            </p>
            <div className="hero-actions">
              <button className="primary" onClick={handleStartQuiz}>
                Пройти 10 вопросов
              </button>
              <button className="ghost" onClick={handleScrollToHow}>
                Посмотреть, как это работает
              </button>
            </div>
            <div className="meta hero-meta">
              10 вопросов • твой тип личности • первый трек за 3 минуты
            </div>
          </div>
          <div className="hero-visual appear delay-1">
            <div className="ui-preview">
              <div className="preview-header">
                <span className="pill">Миссии недели</span>
                <span className="pill ghost-pill">Уровень 3</span>
              </div>
              <div className="preview-list">
                {["Добро пожаловать", "MindGame: Фокус", "Запись в Память"].map((item, idx) => (
                  <div key={item} className="preview-card">
                    <div className="badge subtle">{idx + 1}</div>
                    <div>
                      <p className="card-title">{item}</p>
                      <p className="card-meta">+{(idx + 1) * 25} XP • {idx === 0 ? "30 мин" : "10 мин"}</p>
                    </div>
                    <div className="status-dot" />
                  </div>
                ))}
              </div>
              <div className="preview-footer">
                <div>
                  <p className="meta subtle">Тип личности</p>
                  <p className="card-title">Исследователь</p>
                </div>
                <div className="progress-mini">
                  <div className="progress-bar" style={{ width: "64%" }} />
                  <p className="meta subtle">64% до следующего уровня</p>
                </div>
              </div>
            </div>
            <Mascot variant="guide" size="lg" className="mascot-hero" label="Гид смотрит за прогрессом" />
          </div>
        </div>
      </section>

      <section id="how-it-works" className="landing-section reveal">
        <div className="landing-container section-header">
          <div>
            <p className="eyebrow">Путь за 4 шага</p>
            <h2>Как это работает</h2>
            <p className="section-subtitle">От первых ответов до трека и ежедневных миссий.</p>
          </div>
          <Mascot variant="explorer" size="md" label="Исследователь рядом" />
        </div>
        <div className="landing-container steps-grid appear">
          {steps.map((step, idx) => (
            <div key={step.title} className="step-card">
              <div className="step-icon">{idx + 1}</div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
        <div className="landing-container cta-inline">
          <button className="primary" onClick={handleStartQuiz}>
            Пройти 10 вопросов
          </button>
        </div>
      </section>

      <section className="landing-section reveal">
        <div className="landing-container dual-grid">
          <div className="appear">
            <p className="eyebrow">Личный маршрут</p>
            <h2>Твой трек развития вместо скучных планов</h2>
            <p className="section-subtitle">
              Мы превращаем развитие в понятный маршрут: миссии по сферам жизни, уровни, XP и цели, которые реально двигают
              тебя вперёд.
            </p>
            <ul className="bullet-list">
              {trackBullets.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="track-preview appear delay-1">
            <div className="track-column">
              <div className="pill">Миссии недели</div>
              {["Собрать трек", "MindGame: память", "Ответить в комьюнити", "План на неделю"].map((mission, idx) => (
                <div key={mission} className="mission-tile">
                  <div className="check-dot mini">{idx === 0 ? "✓" : "•"}</div>
                  <div>
                    <p className="card-title">{mission}</p>
                    <p className="card-meta">+{80 - idx * 10} XP</p>
                  </div>
                  <span className="pill subtle">{idx === 0 ? "готово" : "в процессе"}</span>
                </div>
              ))}
            </div>
            <div className="track-stats card">
              <p className="meta subtle">Твоя панель</p>
              <div className="stat-block">
                <div>
                  <p className="card-title">Уровень 4</p>
                  <p className="card-meta">320 XP / 500</p>
                </div>
                <div className="streak-chip">
                  <span>🔥</span>
                  <div>
                    <p className="card-title">Серия 6</p>
                    <p className="card-meta">Дней подряд</p>
                  </div>
                </div>
              </div>
              <div className="progress-shell">
                <div className="progress-bar" style={{ width: "64%" }} />
              </div>
              <div className="stat-goal">
                <div>
                  <p className="meta subtle">Ближайшая цель</p>
                  <p className="card-title">Закрыть 4 миссии</p>
                </div>
                <button className="ghost small" onClick={handleStartQuiz}>
                  Обновить трек
                </button>
              </div>
            </div>
            <Mascot variant="planner" size="md" className="mascot-track" label="Стратег держит курс" />
          </div>
        </div>
      </section>

      <section className="landing-section reveal">
        <div className="landing-container dual-grid">
          <div className="library-block appear">
            <p className="eyebrow">Контент в деле</p>
            <h2>Библиотека, которая не пылится</h2>
            <p className="section-subtitle">
              Конспекты, видео, статьи и лонгриды, которые ложатся в твой трек развития, а не висят мёртвым грузом в закладках.
            </p>
            <div className="library-grid">
              {libraryCards.map((card) => (
                <div key={card.title} className="library-card">
                  <div className="card-meta-row">
                    <span className="pill subtle">{card.status}</span>
                    <span className="meta subtle">{card.meta}</span>
                  </div>
                  <p className="card-title">{card.title}</p>
                  <p className="card-meta">Встроено в трек</p>
                </div>
              ))}
            </div>
            <button className="ghost" onClick={handleOpenLibrary}>
              Открыть библиотеку
            </button>
          </div>
          <div className="games-block appear delay-1">
            <Mascot variant="geek" size="md" className="mascot-floating" label="Гик по контенту" />
            <div className="mini-section">
              <p className="eyebrow">Мини-игры</p>
              <h3>Мини-игры, которые качают мозг</h3>
              <p className="section-subtitle">
                Короткие игровые задания на внимание, память, мышление и скорость решений — внутри миссий и отдельными челленджами.
              </p>
              <div className="games-grid">
                {mindGames.map((game) => (
                  <div key={game.title} className="game-card">
                    <div className="game-icon" />
                    <p className="card-title">{game.title}</p>
                    <p className="card-meta">{game.meta}</p>
                  </div>
                ))}
              </div>
              <div className="records-row">
                <div>
                  <p className="meta subtle">Твой лучший результат</p>
                  <p className="card-title">9 240 очков</p>
                </div>
                <div>
                  <p className="meta subtle">Серия</p>
                  <p className="card-title">4 дня</p>
                </div>
              </div>
              <Mascot variant="gamer" size="md" className="mascot-inline" label="Готов к челленджу" />
            </div>
          </div>
        </div>
      </section>

      <section className="landing-section reveal">
        <div className="landing-container dual-grid">
          <div className="memory-block appear">
            <p className="eyebrow">Метавселенная памяти</p>
            <h2>Твоя Метавселенная памяти</h2>
            <p className="section-subtitle">
              Место, где живут твои идеи, инсайты и важные решения. Ты видишь, как растёшь, а не просто закрываешь задачи.
            </p>
            <ul className="bullet-list">
              <li>Интеграция с библиотекой и миссиями</li>
              <li>Возврат к забытым зонам</li>
              <li>Видишь свой путь как мир, а не как список</li>
            </ul>
          </div>
          <div className="memory-map appear delay-1">
            <div className="map-preview">
              {["Знания", "Навыки", "Решения", "Выводы"].map((zone, idx) => (
                <div key={zone} className={`map-zone zone-${idx}`}>
                  <span className="map-dot" />
                  <p className="card-title">{zone}</p>
                  <p className="card-meta">{8 + idx * 3} заметок</p>
                </div>
              ))}
            </div>
            <Mascot variant="guide" size="md" className="mascot-inline" label="Гид фиксирует инсайты" />
          </div>
        </div>
      </section>

      <section className="landing-section reveal">
        <div className="landing-container dual-grid">
          <div className="community-block appear">
            <p className="eyebrow">Комьюнити</p>
            <h2>Ты не один в этом треке</h2>
            <p className="section-subtitle">
              Чаты, совместные миссии, челленджи и живые встречи. Рядом — такие же, как ты: подростки, которые не хотят жить на автопилоте.
            </p>
            <div className="community-grid">
              {["Совместная миссия недели", "Лига прогресса", "Клуб города", "Челлендж на 7 дней"].map((item) => (
                <div key={item} className="community-card">
                  <div className="avatar bubble">{item[0]}</div>
                  <div>
                    <p className="card-title">{item}</p>
                    <p className="card-meta">Команда • XP • Статусы</p>
                  </div>
                </div>
              ))}
            </div>
            <ul className="bullet-list">
              <li>Совместные миссии и челленджи</li>
              <li>Поддержка и обмен опытом</li>
              <li>Статусы и уровни в комьюнити</li>
            </ul>
          </div>
          <div className="community-avatars appear delay-1">
            <div className="avatar-cloud">
              {["А", "Б", "С", "D", "E", "F"].map((letter) => (
                <div key={letter} className="avatar bubble large">{letter}</div>
              ))}
            </div>
            <div className="community-mascots">
              <Mascot variant="community" size="sm" className="mascot-inline" label="Команда поддерживает" />
              <Mascot variant="explorer" size="sm" className="mascot-inline" label="Новые друзья" />
            </div>
          </div>
        </div>
      </section>

      <section className="landing-section reveal">
        <div className="landing-container dual-grid transformation">
          <div className="appear">
            <p className="eyebrow">До / после</p>
            <h2>Что меняется в твоей жизни</h2>
            <div className="transformation-list">
              {transformationPairs.map((pair) => (
                <div key={pair.before} className="transformation-row">
                  <div>
                    <p className="meta subtle">Было</p>
                    <p className="card-title">{pair.before}</p>
                  </div>
                  <div className="arrow">→</div>
                  <div>
                    <p className="meta subtle">Станет</p>
                    <p className="card-title">{pair.after}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="parents-block appear delay-1">
            <div className="eyebrow">Для родителей</div>
            <div className="card parents-card">
              <p className="section-subtitle">
                Безопасный контент, фокус на развитии, прозрачный прогресс. Видно, как ребёнок растёт и чем он занимается.
              </p>
              <div className="pill subtle">Прогресс доступен</div>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-section final-cta reveal">
        <div className="landing-container dual-grid">
          <div className="appear">
            <p className="eyebrow">Старт</p>
            <h2>Готов начать путь?</h2>
            <p className="section-subtitle">
              10 вопросов — и ты увидишь свой тип личности и первый трек развития.
            </p>
            <div className="hero-actions">
              <button className="primary" onClick={handleStartQuiz}>
                Пройти 10 вопросов
              </button>
              <button className="ghost" onClick={handleOpenAuth}>
                Я уже в платформе
              </button>
            </div>
          </div>
          <div className="appear delay-1 cta-card">
            <div className="pill">XP ждут</div>
            <p className="card-title">+120 XP за первые шаги</p>
            <p className="card-meta">Закрой первый опрос и получи стартовые миссии</p>
            <div className="cta-meter">
              <div className="progress-bar" style={{ width: "72%" }} />
              <p className="meta subtle">Осталось 3 шага</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
