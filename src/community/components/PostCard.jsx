import React from "react";

const typeMeta = {
  achievement: { label: "Достижение", emoji: "🏆" },
  progress: { label: "Прогресс", emoji: "📈" },
  announcement: { label: "Анонс", emoji: "📣" },
  story: { label: "История", emoji: "🎯" },
  mission_share: { label: "Задание", emoji: "🚀" },
  question: { label: "Вопрос", emoji: "❓" },
  generic: { label: "Активность", emoji: "✨" },
};

const PostCard = ({ post, onLike }) => {
  const meta = typeMeta[post.type] || typeMeta.story;
  return (
    <div className="card post-card">
      <div className="post-top">
        <div className="avatar bubble">{post.author?.name?.[0] || "?"}</div>
        <div>
          <div className="post-author">{post.author?.name}</div>
          <div className="meta">
            {post.author?.role || "Участник"} · {post.relativeTime}
          </div>
        </div>
        <span className="pill subtle">{meta.emoji} {meta.label}</span>
      </div>
      <div className="post-body">
        <div className="post-title">{post.title}</div>
        <p className="meta">{post.content || post.body}</p>
        {post.relatedMissionId && <span className="pill subtle">Задание</span>}
        {post.relatedMaterialId && <span className="pill subtle">Урок</span>}
      </div>
      <div className="post-footer">
        <div className="post-actions">
          <button className="ghost" onClick={() => onLike(post.id)}>
            ❤ {post.likes ?? post.likesCount ?? 0}
          </button>
          <span className="meta">💬 {post.commentsCount}</span>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
