import React, { useMemo } from "react";
import { useNavigate } from "../routerShim";
import UiMockupIllustration from "../UiMockupIllustration";
import InfoSection from "./landing/InfoSection";
import VisualPanel from "./landing/VisualPanel";
import NoesisMascotScene from "./NoesisMascotScene";

const LandingPage = () => {
  const navigate = useNavigate();
  const startQuiz = () => navigate("/track-quiz");

  const sections = useMemo(
    () => [
      {
        id: "why",
        accentLabel: "Наука + геймификация",
        title: "Мы собираем лучшую практику обучения и игр",
        subtitle:
          "NOESIS сочетает миссии, мини-игры, библиотеку и систему памяти, чтобы ты не просто читал теорию, а менял привычки.",
        bullets: [
          "Короткие миссии вместо длинных нудных уроков",
          "Мини-игры на мозг и внимание",
          "Персональный трек развития под твой тип личности",
        ],
        visualVariant: "generic",
        textSide: "left",
        mascotVariant: "guide",
      },
      {
        id: "track",
        accentLabel: "Твой маршрут",
        title: "Твоя личная карта развития вместо хаоса",
        subtitle:
          "После 10 вопросов мы собираем трек под твой тип личности: цели, шаги, уровни и XP — чтобы не слиться.",
        bullets: [
          "Миссии по сферам жизни",
          "Уровни и XP за реальные действия",
          "Цели, которые ты ставишь сам — мы помогаем не слиться",
        ],
        visualVariant: "track",
        textSide: "right",
        mascotVariant: "planner",
        backgroundVariant: "alt",
      },
      {
        id: "games",
        accentLabel: "Игры",
        title: "Мини-игры, которые качают мозг",
        subtitle:
          "3–7-минутные MindGames на внимание, память и реакцию вшиты в твой трек и дают быстрый дофамин.",
        bullets: [
          "Быстрые челленджи вместо часовых занятий",
          "Игровые сессии, встроенные в твой трек",
          "Рекорды, челленджи и соревнования с друзьями",
        ],
        visualVariant: "games",
        textSide: "left",
        mascotVariant: "gamer",
      },
      {
        id: "library",
        accentLabel: "Библиотека",
        title: "Контент, который не пылится в закладках",
        subtitle: "Статьи, видео и разборы встроены в миссии и закрепляются через память и действия.",
        bullets: [
          "Краткие конспекты без воды",
          "Видео и статьи, привязанные к миссиям",
          "Всё, что ты проходишь, закрепляется в памяти",
        ],
        visualVariant: "library",
        textSide: "right",
        mascotVariant: "geek",
        backgroundVariant: "alt",
      },
      {
        id: "memory",
        accentLabel: "Память",
        title: "Метавселенная памяти: твой мир знаний",
        subtitle:
          "Все инсайты становятся объектами в мире, к которому ты возвращаешься. Видишь свой путь, а не только задачи.",
        bullets: [
          "Инсайты не пропадают — они превращаются в объекты",
          "Возвращение к забытым зонам памяти",
          "Видишь не только задачи, но и путь, который уже прошёл",
        ],
        visualVariant: "memory",
        textSide: "left",
        mascotVariant: "guide",
      },
      {
        id: "community",
        accentLabel: "Комьюнити",
        title: "Люди, которые двигаются вместе с тобой",
        subtitle:
          "Командные миссии, чаты и офлайн-ивенты помогают держать темп и не выпадать из трека.",
        bullets: [
          "Челленджи на неделю с друзьями",
          "Лиги по прогрессу и streak",
          "Живые встречи и комьюнити-ивенты",
        ],
        visualVariant: "community",
        textSide: "right",
        mascotVariant: "community",
        backgroundVariant: "alt",
      },
      {
        id: "change",
        accentLabel: "Результат",
        title: "Что реально меняется",
        subtitle: "Мы фиксируем, как меняется твой день, мышление и энергия — чтобы ты видел сдвиг, а не просто галочки.",
        comparison: [
          { before: "Чтение теории без применения", after: "Действия по миссиям и XP за реальный прогресс" },
          { before: "Случайные советы", after: "Трек под твой тип личности и цели" },
          { before: "Нет поддержки", after: "Комьюнити, челленджи и напоминания" },
        ],
        visualVariant: "change",
        textSide: "left",
        mascotVariant: "planner",
      },
    ],
    []
  );

  return (
    <div className="landing-page">
      <section className="landing-hero">
        <div className="hero-grid">
          <div className="hero-copy">
            <p className="hero-kicker">NOESIS • Навигация по личному развитию</p>
            <h1 className="hero-title">Найди свой трек развития за 10 вопросов</h1>
            <p className="hero-subtitle">
              Персональные миссии, мини-игры и библиотека, которые подстраиваются под твой тип личности. XP, streak и память
              помогают держать темп и видеть прогресс.
            </p>
            <div className="hero-actions">
              <button className="hero-cta" onClick={startQuiz}>Пройти 10 вопросов</button>
              <button className="hero-secondary" onClick={() => navigate("/missions")}>Посмотреть миссии</button>
            </div>
            <div className="hero-meta-grid">
              <div className="hero-stat">
                <div className="hero-stat-title">+120 XP в день</div>
                <div className="hero-stat-caption">за действия в треке и MindGames</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-title">Серия 7 дней</div>
                <div className="hero-stat-caption">держим фокус и отправляем лёгкие напоминания</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-title">Память растёт</div>
                <div className="hero-stat-caption">все инсайты становятся объектами в твоей карте</div>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-visual-card">
              <UiMockupIllustration variant="track" />
              <NoesisMascotScene variant="hero" />
            </div>
          </div>
        </div>
      </section>

      <div className="info-flow">
        {sections.map((section, idx) => (
          <InfoSection
            key={section.id}
            {...section}
            visual={<VisualPanel variant={section.visualVariant} mascotVariant={section.mascotVariant} />}
            textSide={section.textSide}
            backgroundVariant={section.backgroundVariant}
            isReversed={section.textSide === "right"}
          />
        ))}
      </div>

      <section className="final-cta">
        <div className="final-cta-content">
          <div>
            <p className="accent-label">Готов начать?</p>
            <h2>Готов начать свой трек?</h2>
            <p className="meta">
              10 вопросов — и ты увидишь свой тип личности, первый маршрут и миссии, которые реально двигают вперёд.
            </p>
            <div className="cta-actions">
              <button className="hero-cta" onClick={startQuiz}>Пройти 10 вопросов</button>
              <button className="hero-secondary" onClick={() => navigate("/library")}>Посмотреть библиотеку</button>
            </div>
          </div>
          <div className="final-cta-visual">
            <VisualPanel variant="generic" mascotVariant="guide" compact />
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
