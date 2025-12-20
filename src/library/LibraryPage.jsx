import React, { useEffect, useMemo, useState } from "react";
import { Link } from "../routerShim";
import { learningPaths, materials, themeLabels } from "../libraryData";
import { statusFromProgress } from "../utils/materialStatus";
import { courses } from "../data";
import { mindGames } from "../data/mindGames";
import LogicGame from "../components/LogicGame";
import FinanceGame from "../components/FinanceGame";
import MindGameModal from "../components/MindGameModal";
import { useMindGames } from "../hooks/useMindGames";
import LibraryTypeChips from "./components/LibraryTypeChips";
import LibrarySearchBar from "./components/LibrarySearchBar";
import LibraryFiltersModal from "./components/LibraryFiltersModal";
import LibraryEmptyState from "./components/LibraryEmptyState";
import LibraryVoteModal from "./components/LibraryVoteModal";
import LibrarySuggestContentModal from "./components/LibrarySuggestContentModal";
import TestCard from "./components/TestCard";
import CourseCard from "./components/CourseCard";
import MindGameCard from "./components/MindGameCard";
import ChecklistCard from "./components/ChecklistCard";
import ProgramBannerCard from "./components/ProgramBannerCard";
import LongreadCard from "./components/LongreadCard";
import { cases, checklists, mindGameLeaders, programs, summaries, testStats } from "./libraryExtras";

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

const SectionShell = ({ id, title, action, children }) => (
  <section id={id} className="card surface-card">
    <div className="flex items-center justify-between gap-3 mb-3">
      <h2 className="text-xl font-semibold">{title}</h2>
      {action}
    </div>
    {children}
  </section>
);

const ProgramModal = ({ open, program, onClose }) => {
  const [contact, setContact] = useState({ name: "", handle: "", interest: [] });
  useEffect(() => {
    if (open) setContact({ name: "", handle: "", interest: [] });
  }, [open]);

  if (!open) return null;
  const toggleInterest = (item) => {
    setContact((prev) => ({
      ...prev,
      interest: prev.interest.includes(item)
        ? prev.interest.filter((i) => i !== item)
        : [...prev.interest, item],
    }));
  };
  const submit = (e) => {
    e.preventDefault();
    if (!contact.handle.trim()) return;
    if (typeof window !== "undefined") {
      const saved = window.localStorage.getItem("program-signups");
      const parsed = saved ? JSON.parse(saved) : [];
      window.localStorage.setItem("program-signups", JSON.stringify([...parsed, { program: program.id, ...contact }]));
    }
    onClose();
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" onClick={onClose}>
      <div
        className="modal-card max-w-xl w-full surface-elevated"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-violet-200">Запись скоро</p>
            <h3 className="text-2xl font-semibold leading-tight">{program.title}</h3>
            <p className="text-sm text-gray-300 mt-2">Оставь контакт — отправим, когда откроется набор.</p>
          </div>
          <button className="ghost" onClick={onClose} aria-label="Закрыть">
            ✕
          </button>
        </div>
        <form className="grid gap-3 mt-4" onSubmit={submit}>
          <div>
            <label className="text-sm text-gray-300">Имя (опционально)</label>
            <input
              value={contact.name}
              onChange={(e) => setContact((prev) => ({ ...prev, name: e.target.value }))}
              className="w-full rounded-xl border px-3 py-2 input-surface theme-input"
              placeholder="Как к тебе обращаться"
            />
          </div>
          <div>
            <label className="text-sm text-gray-300">Телеграм/контакт *</label>
            <input
              required
              value={contact.handle}
              onChange={(e) => setContact((prev) => ({ ...prev, handle: e.target.value }))}
              className="w-full rounded-xl border px-3 py-2 input-surface theme-input"
              placeholder="@username"
            />
          </div>
          <div>
            <label className="text-sm text-gray-300">Что интересно?</label>
            <div className="flex flex-wrap gap-2">
              {program.topics.map((topic) => {
                const active = contact.interest.includes(topic);
                return (
                  <button
                    type="button"
                    key={topic}
                    className={`chip ${active ? "active" : ""}`}
                    onClick={() => toggleInterest(topic)}
                  >
                    {topic}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex items-center justify-end gap-2">
            <button type="button" className="ghost" onClick={onClose}>
              Отмена
            </button>
            <button type="submit" className="primary">
              Отправить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const LibraryPage = ({ completedMaterialIds, user, onMindGameComplete }) => {
  const completedSet = useMemo(() => new Set(completedMaterialIds || []), [completedMaterialIds]);
  const [search, setSearch] = useState("");
  const [activeType, setActiveType] = useState("all");
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [filters, setFilters] = useState({ durations: [], levels: [], topics: [], formats: [] });
  const [historyExpanded, setHistoryExpanded] = useState(false);
  const [openProgram, setOpenProgram] = useState(null);
  const [voteOpen, setVoteOpen] = useState(false);
  const [suggestOpen, setSuggestOpen] = useState(false);

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

  const summaryItems = useMemo(() => summaries.map((s) => ({ ...s, type: "summary", theme: "mindset" })), []);
  const caseItems = useMemo(() => cases.map((c) => ({ ...c, type: "case", theme: "entrepreneur_skills" })), []);

  const allSearchMaterials = useMemo(
    () => [
      ...materials,
      ...summaryItems,
      ...caseItems,
      ...mindGames.map((g) => ({ ...g, type: "mindgame", to: "/library" })),
      ...courses,
    ],
    [summaryItems, caseItems]
  );

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleChipClick = (chip) => {
    setActiveType(chip.id);
    scrollToSection(chip.target);
  };

  const getFormatLabel = (item) => {
    if (item.type === "article" || item.type === "summary" || item.type === "case") return "текст";
    if (item.type === "test") return "тест";
    if (item.type === "course") return "курс";
    if (item.type === "mindgame") return "игра";
    return item.type;
  };

  const durationBucket = (item) => {
    const text = item.estimatedTime || item.duration || "";
    if (text.includes("30") || text.includes("6 модулей") || text.includes("6 недель")) return "30+";
    if (text.includes("20") || text.includes("15")) return "15–30";
    if (text.includes("10")) return "5–15";
    return "до 5 мин";
  };

  const matchesFilters = (item) => {
    const query = search.trim().toLowerCase();
    if (query && !(`${item.title}`.toLowerCase().includes(query) || item.description?.toLowerCase().includes(query))) return false;
    if (filters.topics.length) {
      const label = `${item.theme || item.focus || ""}`.toLowerCase();
      if (!filters.topics.some((t) => label.includes(t))) return false;
    }
    if (filters.formats.length) {
      const format = getFormatLabel(item);
      if (!filters.formats.includes(format)) return false;
    }
    if (filters.levels.length && item.level) {
      if (!filters.levels.includes(item.level.toLowerCase())) return false;
    }
    if (filters.durations.length) {
      const bucket = durationBucket(item);
      if (!filters.durations.includes(bucket)) return false;
    }
    return true;
  };

  const longreads = materials.filter((m) => m.type === "article").filter(matchesFilters);
  const courseItems = materials.filter((m) => m.type === "course").filter(matchesFilters);
  const tests = materials.filter((m) => m.type === "test");
  const postMaterialTests = tests.filter((t) => courseTestIds.has(t.id)).filter(matchesFilters);
  const standaloneTests = tests.filter((t) => !courseTestIds.has(t.id)).filter(matchesFilters);
  const filteredSummaries = summaryItems.filter(matchesFilters);
  const filteredCases = caseItems.filter(matchesFilters);

  const historyItems = learningPaths;

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

  const totalTests = tests.length;
  const completedTests = Object.values(testStats).filter((s) => s.attemptsCount > 0).length;
  const avgAccuracy = Math.round(
    (Object.values(testStats).reduce((acc, cur) => acc + (cur.lastScore ? cur.lastScore.correct / cur.lastScore.total : 0), 0) /
      Math.max(Object.values(testStats).length, 1)) *
      100
  );

  const onApplyFilters = (next, close) => {
    setFilters(next);
    if (close) setFiltersExpanded(false);
  };

  return (
    <div className="page library-page">
      <div className="page-header">
        <div>
          <h1>Библиотека</h1>
          <p className="text-sm text-gray-400">Находи форматы под своё настроение и время</p>
        </div>
      </div>

      <div className="card surface-card" id="catalog-top">
        <div className="flex flex-col gap-3">
          <LibraryTypeChips chips={filterTypeChips} activeType={activeType} onSelect={handleChipClick} />
          <div className="grid gap-3 md:grid-cols-[1.2fr_auto] items-end">
            <div className="grid gap-2">
              <label className="meta subtle" htmlFor="library-search">
                Поиск
              </label>
              <LibrarySearchBar query={search} onChange={setSearch} materials={allSearchMaterials} />
            </div>
            <div className="flex justify-end">
              <button className="ghost" onClick={() => setFiltersExpanded((v) => !v)}>
                {filtersExpanded ? "Скрыть" : "Больше"}
              </button>
            </div>
          </div>

          <LibraryFiltersModal
            open={filtersExpanded}
            filters={filters}
            onClose={() => setFiltersExpanded(false)}
            onApply={onApplyFilters}
            onReset={() => {
              setFilters({ durations: [], levels: [], topics: [], formats: [] });
              setFiltersExpanded(false);
            }}
          />
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
                  className="min-w-[220px] max-w-[260px] flex-1 rounded-2xl border p-4 shadow-md hover:border-[color:var(--accent)] transition surface-card"
                >
                  <div className="flex items-center justify-between text-xs text-gray-300">
                    <span className="font-semibold" style={{ color: theme.accent }}>
                      {theme.title}
                    </span>
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
                  className="h-full rounded-2xl border p-4 shadow-md hover:border-[color:var(--accent)] transition flex flex-col surface-card"
                >
                  <div className="flex items-center justify-between text-xs text-gray-300">
                    <span className="font-semibold" style={{ color: theme.accent }}>
                      {theme.title}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold mt-2 leading-snug line-clamp-2">{path.title}</h3>
                  <p className="text-sm text-gray-400 line-clamp-3 mt-1">{path.description}</p>
                </Link>
              );
            })}
          </div>
        )}
      </SectionShell>

      <SectionShell id="longreads" title="Лонгриды">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {longreads.map((item) => {
            const theme = themeLabels[item.theme] || { accent: "#8A3FFC" };
            return (
              <LongreadCard key={item.id} item={item} theme={theme} />
            );
          })}
          {longreads.length === 0 && (
            <LibraryEmptyState onVote={() => setVoteOpen(true)} onSuggest={() => setSuggestOpen(true)} />
          )}
        </div>
      </SectionShell>

      <SectionShell id="summaries" title="Саммари книг">
        {filteredSummaries.length === 0 ? (
          <LibraryEmptyState onVote={() => setVoteOpen(true)} onSuggest={() => setSuggestOpen(true)} />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filteredSummaries.map((item) => (
              <Link
                key={item.id}
                to={item.to}
                className="group flex h-full flex-col gap-2 rounded-2xl border p-4 shadow-lg transition hover:-translate-y-1 hover:border-[color:var(--accent)]/60 hover:shadow-xl surface-card"
              >
                <div className="flex items-center justify-between text-xs text-gray-300">
                  <span className="pill outline">Саммари</span>
                  <span className="text-gray-400">{item.author}</span>
                </div>
                <h3 className="text-lg font-semibold leading-snug line-clamp-2">{item.title}</h3>
                <p className="text-sm text-gray-400 line-clamp-2">{item.description}</p>
                <div className="mt-auto pt-2 flex items-center justify-between text-sm text-gray-300">
                  <span className="text-gray-400">7–10 минут</span>
                  <span className="text-indigo-300 group-hover:text-white">Открыть →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </SectionShell>

      <SectionShell id="cases" title="Разборы кейсов">
        {filteredCases.length === 0 ? (
          <LibraryEmptyState onVote={() => setVoteOpen(true)} onSuggest={() => setSuggestOpen(true)} />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCases.map((item) => (
              <Link
                key={item.id}
                to={item.to}
                className="group flex h-full flex-col gap-2 rounded-2xl border p-4 shadow-lg transition hover:-translate-y-1 hover:border-[color:var(--accent)]/60 hover:shadow-xl surface-card"
              >
                <div className="flex items-center justify-between text-xs text-gray-300">
                  <span className="pill outline">Кейс</span>
                  <span className="text-gray-400">{item.level || "Средний"}</span>
                </div>
                <h3 className="text-lg font-semibold leading-snug line-clamp-2">{item.title}</h3>
                <p className="text-sm text-gray-400 line-clamp-2">{item.description}</p>
                <div className="mt-auto pt-2 flex items-center justify-between text-sm text-gray-300">
                  <span className="text-gray-400">Практический разбор</span>
                  <span className="text-indigo-300 group-hover:text-white">Открыть →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </SectionShell>

      <SectionShell id="tests" title="Тесты">
        <div className="rounded-2xl border border-[#1f1f1f] bg-[#0b0b0b] p-4 mb-3 flex flex-wrap items-center justify-between gap-3 text-sm text-gray-200">
          <span>Пройдено тестов: {completedTests} / {totalTests}</span>
          <span>Средняя точность: {Number.isNaN(avgAccuracy) ? 0 : avgAccuracy}%</span>
          <span>Лучшая серия: 🔥 {Math.max(...Object.values(testStats).map((s) => s.attemptsCount || 0), 0)}</span>
        </div>
        <div className="grid gap-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">После материалов</h3>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {postMaterialTests.map((test) => (
                <TestCard key={test.id} test={test} stats={testStats[test.id]} />
              ))}
              {postMaterialTests.length === 0 && (
                <LibraryEmptyState onVote={() => setVoteOpen(true)} onSuggest={() => setSuggestOpen(true)} />
              )}
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Самостоятельные тесты</h3>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {standaloneTests.map((test) => (
                <TestCard key={test.id} test={test} stats={testStats[test.id]} />
              ))}
              {standaloneTests.length === 0 && (
                <LibraryEmptyState onVote={() => setVoteOpen(true)} onSuggest={() => setSuggestOpen(true)} />
              )}
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
              <CourseCard
                key={course.id}
                course={{ ...course, themeLabel: theme.title }}
                statusLabel={statusLabels[status]}
              />
            );
          })}
          {courseItems.length === 0 && (
            <LibraryEmptyState onVote={() => setVoteOpen(true)} onSuggest={() => setSuggestOpen(true)} />
          )}
        </div>
      </SectionShell>

      <SectionShell id="mindgames" title="Игры мышления">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {mindGames.map((game) => (
            <MindGameCard
              key={game.id}
              game={game}
              leaderboard={mindGameLeaders[game.id] || []}
              stats={{ maxScore: 10, avgScore: 8, best: history?.best?.[game.id]?.correct || "8/10" }}
              onPlay={startGame}
            />
          ))}
        </div>
      </SectionShell>

      <SectionShell id="checklists" title="Чек-листы">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {checklists.map((item) => (
            <ChecklistCard key={item.id} checklist={item} />
          ))}
        </div>
      </SectionShell>

      <SectionShell id="programs" title="Программы">
        <div className="grid gap-3 sm:grid-cols-2">
          {programs.map((program) => (
            <ProgramBannerCard key={program.id} program={program} onSignup={setOpenProgram} onMore={setOpenProgram} />
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
      <LibraryVoteModal open={voteOpen} onClose={() => setVoteOpen(false)} />
      <LibrarySuggestContentModal open={suggestOpen} onClose={() => setSuggestOpen(false)} />
    </div>
  );
};

export default LibraryPage;
