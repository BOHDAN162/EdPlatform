import React, { useMemo, useRef, useState } from "react";
import { Link } from "../routerShim";
import FeedTab from "./FeedTab";
import QuestionsTab from "./QuestionsTab";
import useCommunity from "../useCommunity";
import { getLevelFromPoints, getStatusByPoints } from "../gamification";
import ClubCard from "./components/ClubCard";
import TeamCard from "./components/TeamCard";
import RankingRow from "./components/RankingRow";
import { missions } from "../missionsData";

const contentTabs = [
  { id: "feed", label: "Лента" },
  { id: "questions", label: "Вопросы" },
];

const CommunityPage = ({ user, gamification, onCommunityAction, onToast }) => {
  const leagueRef = useRef(null);
  const contentRef = useRef(null);
  const levelInfo = getLevelFromPoints(gamification.totalPoints);
  const communityUser = useMemo(
    () =>
      user
        ? {
            id: user.id,
            name: user.name,
            avatarKey: user.name?.slice(0, 2),
            xp: gamification.totalPoints,
            points: gamification.totalPoints,
            level: levelInfo.level,
            role: getStatusByPoints(gamification.totalPoints),
            clubIds: [],
          }
        : null,
    [user, gamification.totalPoints, levelInfo.level]
  );
  const [activeTab, setActiveTab] = useState("feed");
  const [leagueView, setLeagueView] = useState("global");

  const community = useCommunity(communityUser, {
    onAction: (action) => onCommunityAction?.(action),
    onToast,
  });

  const participantsSorted = useMemo(
    () => [...community.participants].sort((a, b) => (b.points || 0) - (a.points || 0)),
    [community.participants]
  );

  const miniLeague = useMemo(() => {
    const top = participantsSorted.slice(0, 5);
    const exists = communityUser ? top.some((p) => p.id === communityUser.id) : true;
    if (!exists && communityUser) {
      const myIndex = participantsSorted.findIndex((p) => p.id === communityUser.id);
      const entry = { ...communityUser, position: myIndex + 1 };
      return [...top, entry].map((p, idx) => ({ ...p, position: p.position || idx + 1 }));
    }
    return top.map((p, idx) => ({ ...p, position: idx + 1 }));
  }, [participantsSorted, communityUser]);

  const activeClub = useMemo(() => {
    const memberClub = community.clubs.find((club) => community.membershipSet.has(club.id));
    return memberClub || community.clubs[0];
  }, [community.clubs, community.membershipSet]);

  const clubLeague = useMemo(() => {
    if (!activeClub) return [];
    return participantsSorted.filter((p) => (p.clubIds || []).includes(activeClub.id));
  }, [participantsSorted, activeClub]);

  const highlightMissions = useMemo(
    () => missions.filter((m) => m.title.toLowerCase().includes("челлендж") || m.title.toLowerCase().includes("проект")).slice(0, 2),
    []
  );

  const weeklyGoal = useMemo(() => gamification.goals?.find((g) => g.id === "weekly-materials"), [gamification.goals]);

  const handleScrollToLeague = () => {
    if (leagueRef.current) leagueRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleScrollToContent = () => {
    if (contentRef.current) contentRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="page community-page">
      <div className="page-header community-hero">
        <div>
          <p className="hero-kicker">Сообщество NOESIS</p>
          <h1>Твоя лига, клубы и поддержка 24/7</h1>
          <p className="meta">
            Делись прогрессом, вступай в клубы, отвечай на вопросы и поднимайся в лигах. Здесь всё завязано на твой XP.
          </p>
          <div className="chip-row">
            <span className="pill outline">XP: {gamification.totalPoints}</span>
            <span className="pill outline">Уровень {levelInfo.level}</span>
            <span className="pill subtle">Статус: {getStatusByPoints(gamification.totalPoints)}</span>
          </div>
        </div>
      </div>

      <div className="community-top-grid">
        <div className="card status-card">
          <div className="status-head">
            <div className="avatar bubble large">{communityUser?.name?.[0] || "?"}</div>
            <div>
              <div className="card-header">Твой статус в сообществе</div>
              <p className="meta">Лига обновляется каждую неделю. Помогай ребятам, чтобы расти быстрее.</p>
            </div>
          </div>
          <div className="status-grid">
            <div className="stat-pill">
              <p className="label">Текущий уровень</p>
              <p className="value">{levelInfo.level}</p>
              <p className="caption">{getStatusByPoints(gamification.totalPoints)}</p>
            </div>
            <div className="stat-pill">
              <p className="label">Всего XP</p>
              <p className="value">{gamification.totalPoints}</p>
              <p className="caption">+10 XP за ответы, +50 XP за лучший ответ</p>
            </div>
            <div className="stat-pill">
              <p className="label">Материалов на неделе</p>
              <p className="value">{weeklyGoal?.progress ?? gamification.completedMaterialsCount ?? 0}</p>
              <p className="caption">цель: {weeklyGoal?.target ?? 3} материалов</p>
            </div>
          </div>
          <div className="status-actions">
            <button className="primary" onClick={handleScrollToLeague}>
              Открыть полную лигу
            </button>
            <button className="ghost" onClick={() => onToast?.("Скоро инвайты для друзей")}>
              Пригласить друзей
            </button>
          </div>
        </div>

        <div className="card mini-league-card">
          <div className="card-header">Мини-лига недели</div>
          <p className="meta">Топ активных участников по XP за текущую неделю.</p>
          <div className="mini-league-list">
            {miniLeague.map((p, idx) => (
              <div key={p.id || idx} className={`mini-league-row ${communityUser?.id === p.id ? "current" : ""}`}>
                <div className="mini-left">
                  <span className="pill subtle">#{p.position || idx + 1}</span>
                  <div className="avatar small">{p.name?.[0] || "?"}</div>
                  <div>
                    <div className="ranking-name">{p.name || "Ты"}</div>
                    <div className="meta">{communityUser?.id === p.id ? "Ты" : p.role}</div>
                  </div>
                </div>
                <div className="mini-right">
                  <span className="pill outline">{p.points || p.xp} XP</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mini-actions">
            <button className="ghost" onClick={handleScrollToLeague}>
              Смотреть рейтинги
            </button>
            <button className="ghost" onClick={handleScrollToContent}>
              К активности
            </button>
          </div>
        </div>

        <div className="card community-benefits">
          <div className="card-header">Что даёт участие</div>
          <ul className="benefits-list">
            <li>+10 XP за каждый полезный ответ и +50 XP за лучший.</li>
            <li>Клубные челленджи дают буст к твоей недельной лиге.</li>
            <li>Статусы «Помогатор» и «Ментор» открываются за стабильную активность.</li>
          </ul>
          <div className="mission-highlight">
            <p className="meta">Миссии с упором на комьюнити</p>
            <div className="chip-column">
              {highlightMissions.map((mission) => (
                <Link key={mission.id} className="pill outline" to="/missions">
                  {mission.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="community-section" ref={contentRef}>
        <div className="section-header">
          <div>
            <h2>Клубы и команды</h2>
            <p className="meta">Врывайся в локальные и тематические клубы, собери мини-команду под текущий квест.</p>
          </div>
        </div>
        <div className="grid cards columns-3 responsive-columns">
          {community.clubs.slice(0, 6).map((club) => (
            <ClubCard key={club.id} club={club} onJoin={community.joinClub} onOpen={() => onToast?.("Скоро страница клуба")} />
          ))}
        </div>
        <div className="teams-strip">
          <div className="section-subhead">
            <h3>Твои команды</h3>
            <p className="meta">Отряды по 3–5 человек с общими чекпоинтами.</p>
          </div>
          <div className="grid cards columns-3 responsive-columns">
            {community.teams.slice(0, 3).map((team) => (
              <TeamCard key={team.id} team={team} />
            ))}
          </div>
        </div>
      </div>

      <div className="community-section" ref={leagueRef}>
        <div className="section-header">
          <div>
            <h2>Лиги и рейтинги</h2>
            <p className="meta">Каждую неделю таблица обновляется. За топ-места — особые награды.</p>
          </div>
          <div className="chip-row">
            <button className={`pill ${leagueView === "global" ? "active" : "outline"}`} onClick={() => setLeagueView("global")}>
              Общая лига недели
            </button>
            <button className={`pill ${leagueView === "club" ? "active" : "outline"}`} onClick={() => setLeagueView("club")}>
              Лига твоего клуба
            </button>
          </div>
        </div>
        <div className="card ranking-card">
          {(leagueView === "global" ? participantsSorted : clubLeague).slice(0, 10).map((p, idx) => (
            <RankingRow key={p.id} participant={p} position={idx + 1} isCurrent={communityUser?.id === p.id} />
          ))}
          {leagueView === "club" && !clubLeague.length && <p className="meta">Вступи в клуб, чтобы увидеть клубную лигу.</p>}
        </div>
        <div className="card league-note">
          <div className="card-header">Как получить награду</div>
          <p className="meta">Отвечай на вопросы, закрывай клубные челленджи и делись прогрессом. Топ-3 получают +120 XP и особый бейдж.</p>
        </div>
      </div>

      <div className="community-section">
        <div className="section-header">
          <div>
            <h2>Активность комьюнити</h2>
            <p className="meta">Лента достижений и вопросы с ответами в стиле StackOverflow.</p>
          </div>
          <div className="chip-row">
            {contentTabs.map((tab) => (
              <button key={tab.id} className={`pill ${activeTab === tab.id ? "active" : "outline"}`} onClick={() => setActiveTab(tab.id)}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        {activeTab === "feed" && (
          <FeedTab
            posts={community.posts}
            clubs={community.clubs}
            membershipSet={community.membershipSet}
            onLike={community.likePost}
            onCreatePost={community.addPost}
          />
        )}
        {activeTab === "questions" && (
          <QuestionsTab
            questions={community.questions}
            answers={community.answers}
            currentUser={communityUser}
            onAsk={community.addQuestion}
            onAnswer={community.addAnswer}
            onUpvoteQuestion={community.upvoteQuestion}
            onUpvoteAnswer={community.upvoteAnswer}
            onMarkBest={community.markBestAnswer}
          />
        )}
      </div>
    </div>
  );
};

export default CommunityPage;
