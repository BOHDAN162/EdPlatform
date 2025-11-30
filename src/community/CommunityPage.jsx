import React, { useMemo, useState } from "react";
import FeedTab from "./FeedTab";
import ClubsTab from "./ClubsTab";
import RankingsTab from "./RankingsTab";
import QuestionsTab from "./QuestionsTab";
import ChatsTab from "./ChatsTab";
import useCommunity from "../useCommunity";
import { getLevelFromPoints, getStatusByPoints } from "../gamification";

const tabs = [
  { id: "feed", label: "Лента" },
  { id: "clubs", label: "Клубы" },
  { id: "rankings", label: "Рейтинги" },
  { id: "questions", label: "Вопросы" },
  { id: "chats", label: "Чаты" },
];

const CommunityPage = ({ user, gamification, onCommunityAction, onToast }) => {
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

  const community = useCommunity(communityUser, {
    onAction: (action) => onCommunityAction?.(action),
    onToast,
  });

  return (
    <div className="page community-page">
      <div className="page-header community-hero">
        <div>
          <p className="hero-kicker">Сообщество NOESIS</p>
          <h1>Игровые клубы, рейтинги и поддержка</h1>
          <p className="meta">
            Делись прогрессом, вступай в клубы, отвечай на вопросы и поднимайся в лигах.
          </p>
          <div className="chip-row">
            <span className="pill outline">XP: {gamification.totalPoints}</span>
            <span className="pill outline">Уровень {levelInfo.level}</span>
          </div>
        </div>
        <div className="community-cta">
          <div className="card">
            <div className="card-header">Статус</div>
            <p className="big-number">{getStatusByPoints(gamification.totalPoints)}</p>
            <p className="meta">Взаимодействуй с лигой и получай опыт за помощь.</p>
          </div>
        </div>
      </div>

      <div className="tab-bar scrollable">
        {tabs.map((tab) => (
          <button key={tab.id} className={`tab ${activeTab === tab.id ? "active" : ""}`} onClick={() => setActiveTab(tab.id)}>
            {tab.label}
          </button>
        ))}
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
      {activeTab === "clubs" && (
        <ClubsTab
          clubs={community.clubs}
          teams={community.teams}
          posts={community.posts}
          membershipSet={community.membershipSet}
          onJoin={community.joinClub}
          onLeave={community.leaveClub}
          onLike={community.likePost}
          participants={community.participants}
        />
      )}
      {activeTab === "rankings" && (
        <RankingsTab participants={community.participants} currentUser={communityUser} />
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
      {activeTab === "chats" && (
        <ChatsTab
          channels={community.channels}
          messages={community.messages}
          participants={community.participants}
          onSend={community.sendMessage}
        />
      )}
    </div>
  );
};

export default CommunityPage;
