import React, { useMemo } from "react";
import { Link, useParams } from "../routerShim";
import { communityParticipants } from "../communityData";
import { avatarRewards, statusRewards, medalRewards } from "./rewardsData";

const miniBadges = [...avatarRewards.slice(0, 2), ...statusRewards.slice(0, 2), ...medalRewards.slice(0, 1)];

const UserProfilePage = ({ currentUser, gamification }) => {
  const { id } = useParams();

  const participants = useMemo(() => {
    const base = communityParticipants.map((p) => ({ ...p, points: p.xp }));
    if (currentUser) {
      const exists = base.some((p) => p.id === currentUser.id);
      if (!exists) {
        base.push({
          ...currentUser,
          id: currentUser.id,
          name: currentUser.name || "Гость",
          points: currentUser.xp ?? gamification?.totalPoints ?? 0,
          weeklyMaterials: currentUser.weeklyMaterials || 0,
          helpfulAnswers: currentUser.helpfulAnswers || 0,
          streak: currentUser.streak || 0,
          role: currentUser.role || "Участник",
        });
      }
    }
    return base;
  }, [currentUser, gamification?.totalPoints]);

  const profile = participants.find((p) => p.id === id) || participants[0];

  if (!profile) return null;

  return (
    <div className="page community-page">
      <div className="page-header community-hero">
        <div className="breadcrumb-row">
          <Link to="/community" className="ghost">
            ← Назад
          </Link>
          <span className="pill subtle">Профиль</span>
        </div>
        <div className="profile-hero">
          <div className="avatar bubble large">{profile.name?.[0] || "?"}</div>
          <div>
            <h1>{profile.name}</h1>
            <p className="meta">
              {profile.role} · Уровень {profile.level || "—"} · {profile.city || "онлайн"}
            </p>
            <div className="chip-row">
              <span className="pill outline">{profile.points || profile.xp} XP</span>
              <span className="pill subtle">Серия: {profile.streak || 0} дней</span>
            </div>
          </div>
        </div>
      </div>

      <div className="community-top-grid">
        <div className="card status-card">
          <div className="status-grid">
            <div className="stat-pill">
              <p className="label">XP</p>
              <p className="value">{profile.points || profile.xp}</p>
              <p className="caption">за ответы и участие</p>
            </div>
            <div className="stat-pill">
              <p className="label">Закрытых материалов</p>
              <p className="value">{profile.weeklyMaterials || 0}</p>
              <p className="caption">за неделю</p>
            </div>
            <div className="stat-pill">
              <p className="label">Полезных ответов</p>
              <p className="value">{profile.helpfulAnswers || 0}</p>
              <p className="caption">лучшие ответы и лайки</p>
            </div>
            <div className="stat-pill">
              <p className="label">Streak</p>
              <p className="value">{profile.streak || 0} дн.</p>
              <p className="caption">подряд активность</p>
            </div>
          </div>
        </div>

        <div className="card ranking-card">
          <div className="card-header">Мини-награды</div>
          <div className="badges-row">
            {miniBadges.map((badge) => (
              <div key={badge.id} className={`mini-badge ${badge.unlocked ? "" : "locked"}`} title={badge.requirement}>
                <span className="badge-icon">{badge.icon}</span>
                <div className="badge-label">{badge.title}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">Сводка</div>
        <div className="stat-row">
          <span>Ответы</span>
          <span className="pill outline">{profile.helpfulAnswers || 0}</span>
        </div>
        <div className="stat-row">
          <span>Закрытые материалы</span>
          <span className="pill outline">{profile.weeklyMaterials || 0}</span>
        </div>
        <div className="stat-row">
          <span>Активность</span>
          <span className="pill outline">Streak {profile.streak || 0} дней</span>
        </div>
        <p className="meta">Публичный профиль показывает только агрегированную статистику.</p>
      </div>
    </div>
  );
};

export default UserProfilePage;
