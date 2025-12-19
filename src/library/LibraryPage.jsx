import React, { useEffect, useMemo, useState } from "react";
import { Link } from "../routerShim";
import { learningPaths, materialThemes, materials, themeLabels } from "../libraryData";
import { statusFromProgress } from "../utils/materialStatus";
import { courses } from "../data";
import { mindGames } from "../data/mindGames";
import LogicGame from "../components/LogicGame";
import FinanceGame from "../components/FinanceGame";
import MindGameModal from "../components/MindGameModal";
import { useMindGames } from "../hooks/useMindGames";

const filterTypeChips = [
  { id: "all", label: "Все", target: "catalog-top" },
  { id: "longreads", label: "Лонгриды", target: "longreads" },
  { id: "summaries", label: "Саммари книг", target: "summaries" },
  { id: "cases", label: "Разборы кейсов", target: "cases" },
  { id: "tests", label: "Тесты", target: "tests" },
  { id: "mindgames", label: "Игры мышления", target: "mindgames" },
  { id: "checklists", label: "Чек-листы", target: "checklists" },
  { id: "courses", label: "Курсы", target: "courses" },
];

const statusLabels = { new: "Новое", inProgress: "В процессе", completed: "Завершено" };

const ProgramModal = ({ open, program, onClose }) => {
  if (!open) return null;
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-card max-w-2xl w-full bg-[#111] text-white border border-[#262626]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-violet-300">Программа</p>
            <h3 className="text-2xl font-semibold leading-tight">{program.title}</h3>
            <p className="text-sm text-gray-300 mt-2">{program.description}</p>
          </div>
          <button className="ghost" onClick={onClose} aria-label="Закрыть">✕</button>
        </div>
        <div className="grid gap-3 mt-4 text-sm text-gray-200">
          <div className="flex items-center gap-3">
            <span className="pill outline">Формат</span>
            <span>{program.format}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="pill outline">Темы</span>
            <span>{program.topics}</span>
          </div>
          <p className="text-gray-300 leading-relaxed">{program.details}</p>
        </div>
        <div className="flex flex-wrap gap-2 mt-6 justify-end">
          {program.actionLink ? (
            <Link to={program.actionLink} className="primary">
              Участвовать
            </Link>
          ) : (
            <button className="ghost" onClick={onClose}>Скоро</button>
          )}
        </div>
      </div>
    </div>
  );
};

const Tag = ({ label, accent }) => (
  <span
    className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold"
    style={{ background: `${accent}22`, color: accent, boxShadow: `0 0 0 1px ${accent}33` }}
  >
    <span className="inline-block h-2 w-2 rounded-full" style={{ background: accent }} />
    {label}
  </span>
);

const SectionShell = ({ id, title, action, children }) => (
  <section id={id} className="card bg-[#0f0f0f] border border-[#1f1f1f]">
    <div className="flex items-center justify-between gap-3 mb-3">
      <h2 className="text-xl font-semibold">{title}</h2>
      {action}
    </div>
    {children}
  </section>
);

const MaterialCard = ({ title, description, footer, badge, tags = [], extra }) => (
  <div className="h-full flex flex-col rounded-2xl border border-[#1f1f1f] bg-gradient-to-b from-[#131313] to-[#0b0b0b] p-4 shadow-lg">
    <div className="flex flex-wrap gap-2 text-xs font-semibold text-gray-200">{badge}{tags}</div>
    <h3 className="text-lg font-semibold leading-snug mt-2 line-clamp-2">{title}</h3>
    {description && <p className="text-sm text-gray-400 mt-2 line-clamp-2">{description}</p>}
    {extra}
    <div className="mt-auto pt-4 flex items-center justify-between text-sm text-gray-300">{footer}</div>
  </div>
);

const GameCard = ({ game, onPlay, bestResult }) => {
  const gradient =
    game.id === "logic"
      ? "linear-gradient(135deg, rgba(138,63,252,0.3), rgba(59,130,246,0.25))"
      : "linear-gradient(135deg, rgba(16,185,129,0.28), rgba(59,130,246,0.18))";
  const bestText = bestResult ? `${bestResult.correct} из ${bestResult.total}` : "—";
  return (
    <div className="h-full flex flex-col rounded-2xl border border-[#1f1f1f] overflow-hidden bg-[#0b0b0b] shadow-lg">
      <div className="h-32 w-full" style={{ background: gradient }} aria-hidden />
      <div className="p-4 flex flex-col gap-2 h-full">
        <div className="flex items-center gap-2 text-xs text-violet-200">
          <span className="pill outline">MindGame</span>
          <span className="text-gray-400">{game.questions.length} вопросов</span>
        </div>
        <h3 className="text-lg font-semibold leading-snug">{game.title}</h3>
        <p className="text-sm text-gray-400 line-clamp-2">{game.description}</p>
        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="text-sm text-gray-300">Лучший результат: {bestText}</span>
          <Link
            to="/library"
            className="primary small"
            onClick={(e) => {
              e.preventDefault();
              onPlay(game.id);
            }}
          >
            Играть
          </Link>
        </div>
      </div>
    </div>
  );
};

const ProgramCard = ({ program, onMore }) => (
  <div className="h-full flex flex-col rounded-2xl border border-[#1f1f1f] bg-gradient-to-br from-[#151515] to-[#0d0d0d] p-4 shadow-lg">
    <div className="flex items-center gap-2 text-xs text-violet-200">
      <span className="pill outline">Программа</span>
      <span className="text-gray-400">{program.format}</span>
    </div>
    <h3 className="text-lg font-semibold mt-2 leading-snug line-clamp-2">{program.title}</h3>
    <p className="text-sm text-gray-400 mt-2 line-clamp-2">{program.description}</p>
    <div className="mt-auto pt-4 flex items-center justify-between text-sm text-gray-300">
      <span className="text-gray-300">Темы: {program.topics}</span>
      <button className="primary small" onClick={() => onMore(program)}>Подробнее</button>
    </div>
  </div>
);

const EmptyState = ({ text }) => (
  <div className="rounded-xl border border-dashed border-[#2a2a2a] bg-[#0b0b0b] p-4 text-gray-400 text-sm text-center">
    {text}
  </div>
);

const LibraryPage = ({ completedMaterialIds, user, onMindGameComplete }) => {
  const completedSet = useMemo(() => new Set(completedMaterialIds || []), [completedMaterialIds]);
  const [search, setSearch] = useState("");
  const [activeType, setActiveType] = useState("all");
  const [selectedThemes, setSelectedThemes] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [historyExpanded, setHistoryExpanded] = useState(false);
  const [openProgram, setOpenProgram] = useState(null);
  const {
    currentGameId,
    startGame,
    answerCurrentQuestion,
    resetGame,
    status,
    getProgress,
    lastResult,
    currentIndex,
    history,
  } = useMindGames(user?.id);

  const courseTestIds = useMemo(() => new Set(courses.map((c) => c.testId).filter(Boolean)), []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const matchesFilters = (material) => {
    const query = search.trim().toLowerCase();
    if (selectedThemes.length && !selectedThemes.includes(material.theme)) return false;
    if (statusFilter !== "all") {
      const statusValue = statusFromProgress(material.id, completedSet, null);
      if (statusValue !== statusFilter) return false;
    }
    if (!query) return true;
    return (
      material.title.toLowerCase().includes(query) ||
      material.description?.toLowerCase().includes(query)
    );
  };

  const longreads = materials.filter((m) => m.type === "article").filter(matchesFilters);
  const courseItems = materials.filter((m) => m.type === "course").filter(matchesFilters);
  const tests = materials.filter((m) => m.type === "test");
  const postMaterialTests = tests.filter((t) => courseTestIds.has(t.id)).filter(matchesFilters);
  const standaloneTests = tests.filter((t) => !courseTestIds.has(t.id)).filter(matchesFilters);

  const historyItems = learningPaths;

  const programs = [
    {
      id: "deep-mindset",
      title: "Глубокое мышление создателя",
      description: "6 недель практики: эксперименты, разборы, поддержка наставника.",
      format: "6 недель · 6 модулей",
      topics: "Майндсет, эксперименты, обратная связь",
      details:
        "Подходит тем, кто хочет довести идею до первых пользователей. Внутри еженедельные спринты, групповые сессии и разборы кейсов.",
      actionLink: user ? "/missions" : null,
    },
    {
      id: "deep-communication",
      title: "Коммуникации и публичные выступления",
      description: "Практика сторителлинга, питчей и уверенного общения.",
      format: "4 недели · воркшопы",
      topics: "Коммуникации, питч, бренд",
      details: "Тренируемся на реальных сценариях: питч проекта, презентация, ответы на вопросы аудитории.",
      actionLink: user ? "/missions" : null,
    },
  ];

  const summaries = [];
  const cases = [];

  const handleChipClick = (chip) => {
    setActiveType(chip.id);
    scrollToSection(chip.target);
  };

  const toggleTheme = (themeId) => {
    setSelectedThemes((prev) =>
      prev.includes(themeId) ? prev.filter((t) => t !== themeId) : [...prev, themeId]
    );
  };

  const resetFilters = () => {
    setSelectedThemes([]);
    setStatusFilter("all");
    setActiveType("all");
  };

  const currentGame = currentGameId ? mindGames.find((g) => g.id === currentGameId) : null;
  const progress = getProgress();

  const closeGame = () => {
    resetGame();
  };

  const handleAnswer = (optionIndex) => {
    answerCurrentQuestion(optionIndex);
  };

  useEffect(() => {
    if (lastResult && onMindGameComplete) {
      onMindGameComplete(lastResult);
    }
  }, [lastResult, onMindGameComplete]);

  return (
    <div className="page library-page">
      <div className="page-header">
        <div>
          <h1>Библиотека</h1>
        </div>
      </div>

      <div className="card bg-[#0f0f0f] border border-[#1f1f1f]" id="catalog-top">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-2">
            {filterTypeChips.map((chip) => (
              <button
                key={chip.id}
                className={`chip ${activeType === chip.id ? "active" : ""}`}
                onClick={() => handleChipClick(chip)}
              >
                {chip.label}
              </button>
            ))}
          </div>
          <div className="grid gap-3 md:grid-cols-[1fr_auto] items-end">
            <div className="grid gap-2">
              <label className="meta subtle" htmlFor="library-search">Поиск</label>
              <input
                id="library-search"
                type="search"
                className="w-full rounded-xl border border-[#2a2a2a] bg-[#0b0b0b] px-3 py-2"
                placeholder="Поиск по материалам…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button className="ghost" onClick={() => setAdvancedOpen((v) => !v)}>
              {advancedOpen ? "Свернуть расширенный поиск" : "Расширенный поиск"}
            </button>
          </div>
          {advancedOpen && (
            <div className="rounded-2xl border border-[#1f1f1f] bg-[#0b0b0b] p-4 grid gap-4">
              <div>
                <p className="text-sm text-gray-300 mb-2">Темы</p>
                <div className="flex flex-wrap gap-2">
                  {materialThemes.map((theme) => (
                    <button
                      key={theme.id}
                      className={`chip ${selectedThemes.includes(theme.id) ? "active" : ""}`}
                      onClick={() => toggleTheme(theme.id)}
                    >
                      {theme.title}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm text-gray-300">Статус</span>
                {["all", "new", "inProgress", "completed"].map((option) => (
                  <button
                    key={option}
                    className={`chip ${statusFilter === option ? "active" : ""}`}
                    onClick={() => setStatusFilter(option)}
                  >
                    {option === "all" ? "Все" : statusLabels[option]}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-3 justify-end">
                <button className="ghost" onClick={resetFilters}>Сбросить</button>
                <button className="primary" onClick={() => setAdvancedOpen(false)}>Применить</button>
              </div>
            </div>
          )}
        </div>
      </div>

      <SectionShell
        id="history"
        title="История"
        action={
          <button className="ghost small" onClick={() => setHistoryExpanded((v) => !v)}>
            {historyExpanded ? "Скрыть" : "Больше"}
          </button>
        }
      >
        <div className="overflow-x-auto no-scrollbar -mx-2 px-2">
          <div className="flex gap-3 min-w-full py-1">
            {historyItems.map((path) => {
              const theme = themeLabels[path.theme] || { accent: "#8A3FFC" };
              return (
                <Link
                  key={path.id}
                  to={`/library/paths/${path.slug}`}
                  className="min-w-[220px] max-w-[260px] flex-1 rounded-2xl border border-[#1f1f1f] bg-[#0b0b0b] p-4 shadow-md hover:border-[#8A3FFC] transition"
                >
                  <div className="flex items-center justify-between text-xs text-gray-300">
                    <span className="font-semibold" style={{ color: theme.accent }}>
                      {theme.title}
                    </span>
                    <span className="pill outline">Дорожка</span>
                  </div>
                  <h3 className="text-base font-semibold mt-2 leading-snug line-clamp-2">{path.title}</h3>
                  <p className="text-sm text-gray-400 line-clamp-2 mt-1">{path.description}</p>
                </Link>
              );
            })}
          </div>
        </div>
        {historyExpanded && (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 mt-4">
            {historyItems.map((path) => {
              const theme = themeLabels[path.theme] || { accent: "#8A3FFC" };
              return (
                <Link
                  key={path.slug}
                  to={`/library/paths/${path.slug}`}
                  className="h-full rounded-2xl border border-[#1f1f1f] bg-[#0b0b0b] p-4 shadow-md hover:border-[#8A3FFC] transition flex flex-col"
                >
                  <div className="flex items-center justify-between text-xs text-gray-300">
                    <span className="font-semibold" style={{ color: theme.accent }}>
                      {theme.title}
                    </span>
                    <span className="pill outline">Дорожка</span>
                  </div>
                  <h3 className="text-base font-semibold mt-2 leading-snug line-clamp-2">{path.title}</h3>
                  <p className="text-sm text-gray-400 line-clamp-2 mt-1">{path.description}</p>
                  <span className="mt-auto text-xs text-gray-400">Материалов: {path.materials.length}</span>
                </Link>
              );
            })}
          </div>
        )}
      </SectionShell>

      <SectionShell id="longreads" title="Лонгриды и статьи">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {longreads.map((item) => {
            const theme = themeLabels[item.theme] || { accent: "#8A3FFC", title: "" };
            return (
              <MaterialCard
                key={item.id}
                badge={<Tag label={theme.title} accent={theme.accent} />}
                tags={[
                  <span key="time" className="pill outline text-xs text-gray-200">{item.estimatedTime || "10 минут"}</span>,
                ]}
                title={item.title}
                description={item.description}
                footer={
                  <>
                    <span className="text-gray-400">{item.level || "Начальный"}</span>
                    <Link className="ghost small" to={`/library/article/${item.id}`}>
                      Открыть
                    </Link>
                  </>
                }
              />
            );
          })}
          {longreads.length === 0 && <EmptyState text="Пока нет материалов" />}
        </div>
      </SectionShell>

      <SectionShell id="summaries" title="Саммари книг">
        {summaries.length === 0 ? (
          <EmptyState text="Пока нет материалов" />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {summaries.map((item) => (
              <MaterialCard
                key={item.id}
                badge={<span className="pill outline">Саммари</span>}
                title={item.title}
                description={item.description}
                footer={
                  <>
                    <span className="text-gray-400">{item.author}</span>
                    <Link className="ghost small" to={item.to}>Открыть</Link>
                  </>
                }
              />
            ))}
          </div>
        )}
      </SectionShell>

      <SectionShell id="cases" title="Разборы кейсов">
        {cases.length === 0 ? (
          <EmptyState text="Пока нет материалов" />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {cases.map((item) => (
              <MaterialCard
                key={item.id}
                badge={<span className="pill outline">Кейс</span>}
                title={item.title}
                description={item.description}
                footer={
                  <>
                    <span className="text-gray-400">{item.level || "Средний"}</span>
                    <Link className="ghost small" to={item.to}>Открыть</Link>
                  </>
                }
              />
            ))}
          </div>
        )}
      </SectionShell>

      <SectionShell id="tests" title="Тесты">
        <div className="grid gap-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">После материалов</h3>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {postMaterialTests.map((test) => (
                <MaterialCard
                  key={test.id}
                  badge={<span className="pill outline">Тест</span>}
                  title={test.title}
                  description={test.description}
                  footer={
                    <>
                      <span className="text-gray-400">{test.questions.length} вопросов</span>
                      <Link className="ghost small" to={`/library/test/${test.id}`}>
                        Открыть
                      </Link>
                    </>
                  }
                />
              ))}
              {postMaterialTests.length === 0 && <EmptyState text="Пока нет материалов" />}
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Самостоятельные тесты</h3>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {standaloneTests.map((test) => (
                <MaterialCard
                  key={test.id}
                  badge={<span className="pill outline">Тест</span>}
                  title={test.title}
                  description={test.description}
                  footer={
                    <>
                      <span className="text-gray-400">{test.questions.length} вопросов</span>
                      <Link className="ghost small" to={`/library/test/${test.id}`}>
                        Открыть
                      </Link>
                    </>
                  }
                />
              ))}
              {standaloneTests.length === 0 && <EmptyState text="Пока нет материалов" />}
            </div>
          </div>
        </div>
      </SectionShell>

      <SectionShell id="courses" title="Курсы">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {courseItems.map((course) => {
            const theme = themeLabels[course.theme] || { accent: "#8A3FFC", title: "" };
            const status = statusFromProgress(course.id, completedSet, null);
            return (
              <MaterialCard
                key={course.id}
                badge={<Tag label={theme.title} accent={theme.accent} />}
                tags={[
                  <span key="duration" className="pill outline text-xs text-gray-200">{course.duration || "4 недели"}</span>,
                  <span key="status" className={`pill status ${status}`}>{statusLabels[status]}</span>,
                ]}
                title={course.title}
                description={course.description}
                footer={
                  <>
                    <span className="text-gray-400">{course.focus || ""}</span>
                    <Link className="ghost small" to={`/library/course/${course.id}`}>
                      Открыть
                    </Link>
                  </>
                }
              />
            );
          })}
          {courseItems.length === 0 && <EmptyState text="Пока нет материалов" />}
        </div>
      </SectionShell>

      <SectionShell id="mindgames" title="Игры мышления">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {mindGames.map((game) => (
            <GameCard key={game.id} game={game} onPlay={startGame} bestResult={history?.best?.[game.id]} />
          ))}
        </div>
      </SectionShell>

      <SectionShell id="checklists" title="Чек-листы">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <MaterialCard
            title="Дисциплина недели"
            description="Пошаговый чек-лист на 7 дней для фокуса и привычек."
            badge={<span className="pill outline">Чек-лист</span>}
            footer={
              <>
                <span className="text-gray-400">8 пунктов · 15 минут</span>
                <Link className="ghost small" to="/missions">
                  Перейти к заданиям
                </Link>
              </>
            }
            extra={<p className="text-xs text-amber-200 mt-2">Выполнение — в заданиях</p>}
          />
          <MaterialCard
            title="Питч проекта"
            description="Подготовка короткого питча: структура, ценность, финальный чек."
            badge={<span className="pill outline">Чек-лист</span>}
            footer={
              <>
                <span className="text-gray-400">6 пунктов · 12 минут</span>
                <Link className="ghost small" to="/missions">
                  Перейти к заданиям
                </Link>
              </>
            }
            extra={<p className="text-xs text-amber-200 mt-2">Выполнение — в заданиях</p>}
          />
        </div>
      </SectionShell>

      <SectionShell id="programs" title="Программы">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {programs.map((program) => (
            <ProgramCard key={program.id} program={program} onMore={setOpenProgram} />
          ))}
        </div>
      </SectionShell>

      <MindGameModal open={!!currentGame} onClose={closeGame}>
        {currentGame?.id === "logic" && (
          <LogicGame
            status={status}
            currentIndex={currentIndex}
            onAnswer={handleAnswer}
            onRestart={() => startGame("logic")}
            onClose={closeGame}
            feedback={null}
            progress={progress}
            lastResult={lastResult}
          />
        )}
        {currentGame?.id === "finance" && (
          <FinanceGame
            status={status}
            currentIndex={currentIndex}
            onAnswer={handleAnswer}
            onRestart={() => startGame("finance")}
            onClose={closeGame}
            feedback={null}
            progress={progress}
            lastResult={lastResult}
          />
        )}
      </MindGameModal>

      <ProgramModal open={!!openProgram} program={openProgram} onClose={() => setOpenProgram(null)} />
    </div>
  );
};

export default LibraryPage;
