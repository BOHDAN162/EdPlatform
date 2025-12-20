import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "../routerShim";
import useCommunity from "../useCommunity";
import { getLevelFromPoints, getStatusByPoints, progressToNextStatus } from "../gamification";
import RankingRow from "./components/RankingRow";
import MeaningWall from "./components/MeaningWall";
import InviteFriendsModal from "./components/InviteFriendsModal";
import MascotRenderer from "../mascots/MascotRenderer";

const leaderboardTabs = [
  { id: "active", label: "Активные", description: "Активность за 7 дней", metric: "activityScore", metricLabel: "активности" },
  { id: "top", label: "Топы", description: "Самые результативные", metric: "points", metricLabel: "XP" },
  { id: "mentors", label: "Менторы", description: "Опытные наставники", metric: "contributionScore", metricLabel: "поддержки" },
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
  const [leaderboardTab, setLeaderboardTab] = useState("top");
  const [showIntro, setShowIntro] = useState(false);
  const [messageModal, setMessageModal] = useState({ open: false, target: null, text: "" });
  const [inviteOpen, setInviteOpen] = useState(false);
  const [refLink, setRefLink] = useState("");

  useEffect(() => {
    const seen = localStorage.getItem("communityIntroSeen");
    if (!seen) {
      setShowIntro(true);
    }
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
    const sortAndMap = (metric, label, fallback, source = participantsSorted) => {
      const arr = [...source].sort((a, b) => (b[metric] || b[fallback] || 0) - (a[metric] || a[fallback] || 0));
      return arr.map((p) => ({ ...p, metricValue: p[metric] ?? p[fallback] ?? 0, metricLabel: label }));
    };

    const active = sortAndMap("activityScore", "активности", "points");
    const top = sortAndMap("points", "XP", "xp");
    const mentorsPool = participantsSorted.filter((p) => (p.role || "").toLowerCase().includes("мент"));
    const mentorsFallback = mentorsPool.length ? mentorsPool : participantsSorted.filter((p) => (p.level || 0) >= 7);
    const mentors = sortAndMap("contributionScore", "поддержки", "helpfulAnswers", mentorsFallback);

    return { active, top, mentors };
  }, [participantsSorted]);

  const handleScrollToLeague = () => {
    if (leagueRef.current) leagueRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleIntroClose = () => {
    localStorage.setItem("communityIntroSeen", "true");
    setShowIntro(false);
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
      <div className="page-header pb-3">
        <div>
          <p className="hero-kicker">Сообщество</p>
          <h1>Сообщество NOESIS</h1>
          <p className="meta">Помогай другим, собирай XP и смотри свой прогресс.</p>
        </div>
      </div>

      <div className="community-top-grid">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm">
          <div className="space-y-1 text-left">
            <p className="text-sm text-[var(--muted)]">Профиль в сообществе</p>
            <p className="text-lg font-semibold text-[var(--fg)]">{communityUser?.name || user?.name || "Ты"}</p>
            <p className="text-sm text-[var(--muted)]">Статус: {getStatusByPoints(totalPoints)} · Уровень {levelInfo.level}</p>
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
          <div className="status-grid">
            <div className="stat-pill">
              <p className="label">Текущий уровень</p>
              <p className="value">{levelInfo.level}</p>
              <p className="caption">{getStatusByPoints(totalPoints)}</p>
            </div>
            <div className="stat-pill">
              <p className="label">Всего XP</p>
              <p className="value">{totalPoints}</p>
              <p className="caption">Позиция: {rankPosition || "—"}</p>
            </div>
            <div className="stat-pill">
              <p className="label">Серия</p>
              <p className="value">{gamification?.currentStreak || 0} дн</p>
              <p className="caption">держи ритм</p>
            </div>
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
                className={`pill ${leaderboardTab === tab.id ? "active" : "outline"} ${leaderboardTab === tab.id ? "font-semibold" : ""}`}
                onClick={() => setLeaderboardTab(tab.id)}
                title={tab.description}
                aria-pressed={leaderboardTab === tab.id}
              >
                {tab.label}
              </button>
            ))}
            <button className="ghost" onClick={() => setInviteOpen(true)}>
              Пригласить друзей
            </button>
          </div>
        </div>
        <div className="card ranking-card">
          {(leaderboardData[leaderboardTab] || leaderboardData.top || leaderboardData.active || [])
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
