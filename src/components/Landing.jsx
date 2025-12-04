import React from "react";
import { Link } from "../routerShim";

const steps = [
  {
    title: "Ответь на 10 вопросов",
    text: "Узнаем твой тип личности и точку старта.",
  },
  {
    title: "Получишь свой трек",
    text: "Соберём маршрут из миссий, игр и материалов.",
  },
  {
    title: "Действуй каждый день",
    text: "Маленькие шаги, MindGames и заметки в Памяти.",
  },
];

const modules = [
  {
    title: "Трек развития",
    text: "Личный маршрут из миссий под твой тип.",
    to: "/track-quiz",
  },
  {
    title: "Миссии",
    text: "Задачи и челленджи с XP и сериями.",
    to: "/missions",
  },
  {
    title: "Библиотека",
    text: "Видео, статьи, тесты и конспекты.",
    to: "/library",
  },
  {
    title: "MindGames",
    text: "Короткие игры на внимание и память.",
    to: "/missions",
  },
  {
    title: "Память",
    text: "Храни инсайты и связывай материалы между собой.",
    to: "/memory",
  },
  {
    title: "Сообщество",
    text: "Подростки, которые тоже растут и делятся опытом.",
    to: "/community",
  },
];

const valuePoints = [
  "Хочешь прокачать мышление и продуктивность",
  "Нужен понятный трек вместо хаоса из видео",
  "Важно делать проекты и не забивать",
];

const changeList = [
  "Появится ощущение маршрута и контроля",
  "Больше действий, меньше прокрастинации",
  "Видишь реальный прогресс, а не просто просмотр",
];

const testimonials = [
  {
    quote: "Поняла, что мне реально интересно. Миссии короткие, поэтому не сливаюсь.",
    name: "Аня, 15 лет",
  },
  {
    quote: "Ребёнок сам напоминает про трек. Видим прогресс, а не просто ролики.",
    name: "Родитель",
  },
];

const Landing = () => {
  return (
    <div className="marketing-landing">
      <section className="landing-hero">
        <div className="hero-copy">
          <p className="hero-kicker">NOESIS • платформа развития</p>
          <h1>Твой трек роста без хаоса</h1>
          <p className="hero-sub">Ответь на 10 вопросов, получи личный маршрут и двигайся по миссиям, играм и материалам.</p>
          <div className="hero-actions">
            <Link className="primary hero-cta" to="/track-quiz">
              Начать
            </Link>
            <Link className="secondary" to="/auth">
              Войти
            </Link>
            <Link className="ghost" to="/auth">
              Зарегистрироваться
            </Link>
          </div>
          <p className="hero-note">Главная кнопка ведёт в трек-вопросник (10 вопросов → тип личности → миссии).</p>
        </div>
        <div className="hero-visual">
          <div className="hero-mock">
            <div className="mock-header">
              <span className="badge">Твой трек</span>
              <span className="muted-text">+120 XP · серия 4</span>
            </div>
            <div className="mock-steps">
              {["Опрос", "Мышление", "Проект", "Комьюнити"].map((item, idx) => (
                <div key={item} className={`mock-step ${idx === 1 ? "active" : ""}`}>
                  <div className="step-index">{idx + 1}</div>
                  <div>
                    <p className="step-title">{item}</p>
                    <p className="step-caption">{idx === 1 ? "Сейчас" : "Далее"}</p>
                  </div>
                  <span className="step-pill">XP</span>
                </div>
              ))}
            </div>
            <div className="mock-progress">
              <div className="progress-track">
                <div className="progress-fill" style={{ width: "56%" }} />
              </div>
              <div className="progress-meta">
                <span>56% пути</span>
                <span className="muted-text">MindGames · Память · Миссии</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-section">
        <div className="section-header">
          <p className="section-kicker">Путь</p>
          <h2>Как это работает</h2>
          <p className="section-sub">Простой маршрут из 3 шагов — без лишней теории.</p>
        </div>
        <div className="card-grid three">
          {steps.map((step) => (
            <div key={step.title} className="info-card">
              <div className="icon-dot" />
              <h3>{step.title}</h3>
              <p className="muted-text">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="landing-section">
        <div className="section-header">
          <p className="section-kicker">Модули</p>
          <h2>Что внутри NOESIS</h2>
          <p className="section-sub">Все разделы доступны по существующим маршрутам платформы.</p>
        </div>
        <div className="card-grid">
          {modules.map((item) => (
            <Link key={item.title} to={item.to} className="info-card link-card">
              <div className="icon-dot" />
              <div>
                <h3>{item.title}</h3>
                <p className="muted-text">{item.text}</p>
                <span className="pill subtle">Перейти</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="landing-section split">
        <div>
          <p className="section-kicker">Для кого</p>
          <h2>Если ты хочешь расти и не терять фокус</h2>
          <p className="section-sub">
            Подходит подросткам 13–20 лет: активным, любознательным, тем, кто хочет делать проекты и держать темп.
          </p>
          <ul className="bullet-list">
            {valuePoints.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </div>
        <div className="value-card">
          <p className="section-kicker">Что изменится</p>
          <ul className="check-list">
            {changeList.map((item) => (
              <li key={item}>
                <span className="check-dot">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="landing-section">
        <div className="section-header">
          <p className="section-kicker">Доверие</p>
          <h2>Почему нам верят</h2>
          <p className="section-sub">Здесь временные цифры — замените на реальные метрики, когда подключится бэкенд. {/* TODO: заменить на реальные данные */}</p>
        </div>
        <div className="card-grid">
          <div className="stat-card">
            <p className="stat-number">12 400+</p>
            <p className="muted-text">часов развития внутри платформы</p>
          </div>
          <div className="stat-card">
            <p className="stat-number">3 200</p>
            <p className="muted-text">миссий пройдено подростками</p>
          </div>
          {testimonials.map((item) => (
            <div key={item.name} className="quote-card">
              <p className="quote">“{item.quote}”</p>
              <p className="muted-text">{item.name}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="landing-final">
        <div className="final-content">
          <div>
            <p className="section-kicker">Старт</p>
            <h2>Готов начать свой трек развития?</h2>
            <p className="section-sub">Ответь на 10 вопросов — мы соберём маршрут под тебя.</p>
          </div>
          <div className="final-actions">
            <Link className="primary hero-cta" to="/track-quiz">
              Начать
            </Link>
            <Link className="ghost" to="/auth">
              Уже есть аккаунт? Войти
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
