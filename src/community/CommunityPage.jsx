import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "../routerShim";
import useCommunity from "../useCommunity";
import { getLevelFromPoints, getStatusByPoints, progressToNextStatus } from "../gamification";
import RankingRow from "./components/RankingRow";
import { avatarRewards, medalRewards, skinRewards, statusRewards } from "./rewardsData";
import MeaningWall from "./components/MeaningWall";
import ProgressRing from "./components/ProgressRing";
import InviteFriendsModal from "./components/InviteFriendsModal";
import MascotRenderer from "../mascots/MascotRenderer";

const leaderboardTabs = [
  { id: "active", label: "Активные", description: "Активность за 7 дней", metric: "activityScore", metricLabel: "активности" },
  { id: "students", label: "Студенты", description: "Материалы и тесты", metric: "learningScore", metricLabel: "учёбы" },
  { id: "contributors", label: "Вкладчики", description: "Помощь сообществу", metric: "contributionScore", metricLabel: "вклада" },
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
  const totalPoints = gamification?.totalPoints || 0;
  const levelInfo = getLevelFromPoints(totalPoints);
  const communityUser = useMemo(
    () =>
      user
        ? {
            id: user.id,
            name: user.name,
            avatarKey: user.name?.slice(0, 2),
            xp: totalPoints,
            points: totalPoints,
            level: levelInfo.level,
            role: getStatusByPoints(totalPoints),
            clubIds: [],
          }
        : null,
    [user, totalPoints, levelInfo.level]
  );
  const [leaderboardTab, setLeaderboardTab] = useState("active");
  const [rewardTab, setRewardTab] = useState("avatars");
  const [showIntro, setShowIntro] = useState(false);
  const [rewardClaimed, setRewardClaimed] = useState(false);
  const [messageModal, setMessageModal] = useState({ open: false, target: null, text: "" });
  const [inviteOpen, setInviteOpen] = useState(false);
  const [refLink, setRefLink] = useState("");

  useEffect(() => {
    const seen = localStorage.getItem("communityIntroSeen");
    if (!seen) {
      setShowIntro(true);
    }
  }, []);

  useEffect(() => {
    const claimed = localStorage.getItem("community_weekly_reward_claimed");
    setRewardClaimed(claimed === "true");
  }, []);

  const community =
    useCommunity(communityUser, {
      onAction: (action) => onCommunityAction?.(action),
      onToast,
    }) || { participants: [], posts: [], questions: [], answers: [], messages: {}, channels: [] };

  const participantsSorted = useMemo(
    () => [...community.participants].sort((a, b) => (b.points || 0) - (a.points || 0)),
    [community.participants]
  );

  const weeklyGoal = useMemo(() => gamification?.goals?.find((g) => g.id === "weekly-materials"), [gamification?.goals]);
  const weeklyTarget = weeklyGoal?.target ?? 6;
  const weeklyProgress = weeklyGoal?.progress ?? gamification?.completedMaterialsCount ?? 0;
  const goalAchieved = weeklyProgress >= weeklyTarget && weeklyTarget > 0;
  const rankPosition = communityUser ? participantsSorted.findIndex((p) => p.id === communityUser.id) + 1 : null;
  const statusProgress = progressToNextStatus(totalPoints);

  const ensureReferral = () => {
    const stored = localStorage.getItem("community_referral_code");
    if (stored) return stored;
    const code = `BDN-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    localStorage.setItem("community_referral_code", code);
    return code;
  };

  const referralLink = useMemo(() => {
    const code = ensureReferral();
    const origin = typeof window !== "undefined" ? window.location.origin : "https://noesis.local";
    return `${origin}/#/signup?ref=${code}`;
  }, []);

  useEffect(() => {
    setRefLink(referralLink);
  }, [referralLink]);

  const leaderboardData = useMemo(() => {
    const sortAndMap = (metric, label, fallback) => {
      const arr = [...participantsSorted].sort((a, b) => (b[metric] || b[fallback] || 0) - (a[metric] || a[fallback] || 0));
      return arr.map((p) => ({ ...p, metricValue: p[metric] ?? p[fallback] ?? 0, metricLabel: label }));
    };
    const active = sortAndMap("activityScore", "активности", "points");
    const students = sortAndMap("learningScore", "учёбы", "weeklyMaterials");
    const contributors = sortAndMap("contributionScore", "вклада", "helpfulAnswers");
    return { active, students, contributors };
  }, [participantsSorted]);

  const handleScrollToLeague = () => {
    if (leagueRef.current) leagueRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleIntroClose = () => {
    localStorage.setItem("communityIntroSeen", "true");
    setShowIntro(false);
  };

  const renderRewards = rewardTabs.find((tab) => tab.id === rewardTab)?.data || [];

  const handleClaimReward = () => {
    if (!goalAchieved || rewardClaimed) return;
    setRewardClaimed(true);
    localStorage.setItem("community_weekly_reward_claimed", "true");
    onToast?.("Награда получена!");
  };

  const openMessageModal = (userTarget) => {
    setMessageModal({ open: true, target: userTarget, text: "" });
  };

  const closeMessageModal = () => setMessageModal({ open: false, target: null, text: "" });

  const handleSendMessage = () => {
    if (!messageModal.text.trim()) return;
    const prev = JSON.parse(localStorage.getItem("community_messages") || "[]");
    const entry = { id: `msg-${crypto.randomUUID()}`, to: messageModal.target.id, body: messageModal.text, createdAt: new Date().toISOString() };
    localStorage.setItem("community_messages", JSON.stringify([entry, ...prev]));
    onToast?.(`Сообщение ${messageModal.target.name} отправлено`);
    closeMessageModal();
  };

  const handleCopyReferral = async () => {
    try {
      await navigator.clipboard.writeText(refLink || referralLink);
      onToast?.("Ссылка скопирована");
    } catch (err) {
      onToast?.("Скопируй ссылку вручную");
    }
  };

  const handleShare = (channel) => {
    const text = "Залетай в NOESIS и прокачивайся со мной";
    const link = refLink || referralLink;
    if (navigator.share) {
      navigator.share({ title: "NOESIS", text, url: link }).catch(() => {});
      return;
    }
    const encodedLink = encodeURIComponent(link);
    const encodedText = encodeURIComponent(text);
    const targets = {
      tg: `https://t.me/share/url?url=${encodedLink}&text=${encodedText}`,
      wa: `https://wa.me/?text=${encodedText}%20${encodedLink}`,
      vk: `https://vk.com/share.php?url=${encodedLink}&title=${encodedText}`,
    };
    window.open(targets[channel], "_blank", "noopener,noreferrer");
  };

  if (!community || !Array.isArray(community.participants) || community.participants.length === 0) {
    return (
      <div className="page community-page">
        <div className="page-header">
          <h1>Сообщество</h1>
        </div>
        <div className="card">
          <h2>Данные загружаются/пока недоступны</h2>
          <p className="meta">Попробуй позже или вернись на главную.</p>
          <div className="flex gap-3 mt-3">
            <Link to="/" className="primary">
              Вернуться на Главную
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm">
          <div className="space-y-1 text-left">
            <p className="text-sm text-[var(--muted)]">Профиль в сообществе</p>
            <p className="text-lg font-semibold text-[var(--fg)]">{communityUser?.name || user?.name || "Ты"}</p>
            <p className="text-sm text-[var(--muted)]">Статус: {getStatusByPoints(gamification.totalPoints)} · Уровень {levelInfo.level}</p>
            <Link to="/settings" className="text-xs font-semibold text-[var(--accent)] underline">
              Сменить персонажа
            </Link>
          </div>
          <div className="mt-4 flex w-full justify-center">
            <MascotRenderer size={230} variant="card" className="w-full max-w-[260px]" />
          </div>
        </div>

        <div className="card status-card premium">
          <div className="status-head">
            <div>
              <div className="card-header">Статус в сообществе</div>
              <p className="meta">XP, роль и прогресс до следующего уровня.</p>
            </div>
          </div>
          <div className="weekly-progress-row">
            <ProgressRing value={weeklyProgress} target={weeklyTarget} />
            <div className="weekly-copy">
              <p className="label">Материалов на этой неделе</p>
              <h3 className="value">
                {weeklyProgress}/{weeklyTarget}
              </h3>
              <p className="caption">Цель недели: {weeklyTarget} материалов</p>
              <div className={`reward-pill ${goalAchieved ? "success" : ""}`}>
                {goalAchieved ? "Награда: +50 XP 💎 и бейдж 🏅" : `До награды осталось: ${Math.max(weeklyTarget - weeklyProgress, 0)} материалов`}
              </div>
              <button className="primary" disabled={!goalAchieved || rewardClaimed} onClick={handleClaimReward}>
                {rewardClaimed ? "Получено ✅" : "Забрать награду"}
              </button>
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
              <p className="caption">Позиция: {rankPosition || "—"}</p>
            </div>
            <div className="stat-pill">
              <p className="label">Серия</p>
              <p className="value">{gamification.currentStreak || 0} дн</p>
              <p className="caption">держи ритм</p>
            </div>
          </div>
          <div className="status-grid">
            <div className="stat-pill">
              <p className="label">До следующей роли</p>
              <div className="progress-shell subtle">
                <div className="progress-fill" style={{ width: `${statusProgress.progress}%` }} />
              </div>
              <p className="caption">Следующая: {statusProgress.next}</p>
            </div>
          </div>
          <div className="status-actions">
            <button className="primary" onClick={handleScrollToLeague}>
              К лидам
            </button>
            <button className="ghost" onClick={() => setInviteOpen(true)}>
              Пригласить друзей
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
          <div className="chip-row scrollable">
            {leaderboardTabs.map((tab) => (
              <button
                key={tab.id}
                className={`pill ${leaderboardTab === tab.id ? "active" : "outline"}`}
                onClick={() => setLeaderboardTab(tab.id)}
                title={tab.description}
              >
                {tab.label} <span className="info-icon" title={tab.description}>i</span>
              </button>
            ))}
            <button className="ghost" onClick={() => setInviteOpen(true)}>
              Пригласить друзей
            </button>
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

      {inviteOpen && (
        <InviteFriendsModal
          link={refLink || referralLink}
          onCopy={handleCopyReferral}
          onShare={handleShare}
          onClose={() => setInviteOpen(false)}
        />
      )}

      {messageModal.open && (
        <div className="modal-overlay" onClick={closeMessageModal}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <p className="hero-kicker">Сообщение</p>
                <h3>Для {messageModal.target?.name}</h3>
              </div>
              <button className="ghost" onClick={closeMessageModal} aria-label="Закрыть">
                ✕
              </button>
            </div>
            <textarea
              className="input"
              rows={3}
              placeholder="Напиши поддержку или вопрос"
              value={messageModal.text}
              onChange={(e) => setMessageModal((prev) => ({ ...prev, text: e.target.value }))}
            />
            <div className="status-actions">
              <button className="primary" onClick={handleSendMessage}>
                Отправить
              </button>
              <button className="ghost" onClick={closeMessageModal}>
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityPage;
