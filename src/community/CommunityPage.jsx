import React, { useEffect, useMemo, useRef, useState } from "react";
import useCommunity from "../useCommunity";
import { getLevelFromPoints, getStatusByPoints } from "../gamification";
import RankingRow from "./components/RankingRow";
import { avatarRewards, medalRewards, skinRewards, statusRewards } from "./rewardsData";
import MeaningWall from "./components/MeaningWall";

const leaderboardTabs = [
  { id: "active", label: "Топ активных", description: "XP за ответы и участие" },
  { id: "students", label: "Топ студентов", description: "Закрытые материалы за неделю" },
  { id: "contributors", label: "Топ вкладчиков", description: "Полезные ответы" },
];

const rewardTabs = [
  { id: "avatars", label: "Аватары", data: avatarRewards },
  { id: "skins", label: "Оформление", data: skinRewards },
  { id: "statuses", label: "Статусы", data: statusRewards },
  { id: "medals", label: "Медали", data: medalRewards },
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
  const [leaderboardTab, setLeaderboardTab] = useState("active");
  const [rewardTab, setRewardTab] = useState("avatars");
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem("communityIntroSeen");
    if (!seen) {
      setShowIntro(true);
    }
  }, []);

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

  const weeklyGoal = useMemo(() => gamification.goals?.find((g) => g.id === "weekly-materials"), [gamification.goals]);

  const leaderboardData = useMemo(() => {
    const active = participantsSorted.map((p) => ({ ...p, metricValue: p.points || p.xp, metricLabel: "XP" }));
    const students = [...participantsSorted]
      .sort((a, b) => (b.weeklyMaterials || 0) - (a.weeklyMaterials || 0))
      .map((p) => ({ ...p, metricValue: p.weeklyMaterials || 0, metricLabel: "уроков" }));
    const contributors = [...participantsSorted]
      .sort((a, b) => (b.helpfulAnswers || 0) - (a.helpfulAnswers || 0))
      .map((p) => ({ ...p, metricValue: p.helpfulAnswers || 0, metricLabel: "ответов" }));
    return { active, students, contributors };
  }, [participantsSorted]);

  const handleScrollToLeague = () => {
    if (leagueRef.current) leagueRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleScrollToContent = () => {
    if (contentRef.current) contentRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleIntroClose = () => {
    localStorage.setItem("communityIntroSeen", "true");
    setShowIntro(false);
  };

  const renderRewards = rewardTabs.find((tab) => tab.id === rewardTab)?.data || [];

  return (
    <div className="page community-page">
      {showIntro && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <div>
                <p className="hero-kicker">Что даёт участие</p>
                <h3>Получай XP за помощь</h3>
              </div>
              <button className="ghost" onClick={handleIntroClose}>
                ✕
              </button>
            </div>
            <ul className="benefits-list compact">
              <li>+10 XP за каждый полезный ответ</li>
              <li>+50 XP за лучший ответ недели</li>
              <li>Бонусы за streak и закрытые уроки</li>
            </ul>
            <button className="primary full" onClick={handleIntroClose}>
              Понятно
            </button>
          </div>
        </div>
      )}
      <div className="page-header community-hero">
        <div>
          <p className="hero-kicker">Сообщество NOESIS</p>
          <h1>Сообщество NOESIS</h1>
          <p className="meta large">Отвечай на вопросы, помогай другим, поднимайся в рейтинге.</p>
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
              <p className="meta">Короткие челленджи каждую неделю. Помогай ребятам, чтобы расти быстрее.</p>
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
              <p className="caption">Больше очков за лучший ответ</p>
            </div>
            <div className="stat-pill">
              <p className="label">Материалов на неделе</p>
              <p className="value">{weeklyGoal?.progress ?? gamification.completedMaterialsCount ?? 0}</p>
              <p className="caption">цель: {weeklyGoal?.target ?? 3} материалов</p>
            </div>
          </div>
          <div className="status-actions">
            <button className="primary" onClick={handleScrollToLeague}>
              К лидам
            </button>
            <button className="ghost" onClick={() => onToast?.("Скоро инвайты для друзей")}>
              Пригласить друзей
            </button>
          </div>
        </div>

        <div className="card mini-league-card">
          <div className="card-header">Мини-лига недели</div>
          <p className="meta">Топ активных участников недели.</p>
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
      </div>

      <div className="community-section" ref={leagueRef}>
        <div className="section-header">
          <div>
            <h2>Лидеры</h2>
            <p className="meta">Обновляется каждую неделю. Нажми на строку, чтобы открыть профиль.</p>
          </div>
          <div className="chip-row">
            {leaderboardTabs.map((tab) => (
              <button
                key={tab.id}
                className={`pill ${leaderboardTab === tab.id ? "active" : "outline"}`}
                onClick={() => setLeaderboardTab(tab.id)}
                title={tab.description}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        <div className="card ranking-card">
          {(leaderboardData[leaderboardTab] || leaderboardData.active)
            .slice(0, 10)
            .map((p, idx) => (
              <RankingRow
                key={p.id}
                participant={p}
                position={idx + 1}
                isCurrent={communityUser?.id === p.id}
                metricLabel={p.metricLabel}
                metricValue={p.metricValue}
              />
            ))}
        </div>
        <div className="card league-note">
          <div className="card-header">Как подняться</div>
          <p className="meta">Ответы, апвоты и закрытые уроки дают очки. Топ-3 получают +120 XP и медаль недели.</p>
          <div className="chip-row">
            <button className="ghost" onClick={() => onToast?.("Полная таблица скоро")}>Смотреть полностью</button>
          </div>
        </div>
      </div>

      <div className="community-section">
        <div className="section-header">
          <div>
            <h2>Награды</h2>
            <p className="meta">Зарабатывай аватары, статусы и медали за активность.</p>
          </div>
          <div className="chip-row">
            {rewardTabs.map((tab) => (
              <button
                key={tab.id}
                className={`pill ${rewardTab === tab.id ? "active" : "outline"}`}
                onClick={() => setRewardTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        <div className="rewards-grid">
          {renderRewards.map((reward) => (
            <div key={reward.id} className={`reward-card ${reward.unlocked ? "" : "locked"}`} title={reward.requirement}>
              <div className="reward-icon">{reward.icon}</div>
              <div className="reward-title">{reward.title}</div>
              <p className="meta">{reward.description}</p>
              <div className="reward-footer">
                <span className="pill subtle">{reward.requirement}</span>
                {!reward.unlocked && <span className="lock">🔒</span>}
                {reward.unlocked && <button className="ghost small">Активировать</button>}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="community-section" ref={contentRef}>
        <MeaningWall onToast={onToast} />
      </div>
    </div>
  );
};

export default CommunityPage;
