import React from "react";

const typeMeta = {
  achievement: { label: "Достижение", emoji: "🏆" },
  progress: { label: "Прогресс", emoji: "📈" },
  announcement: { label: "Анонс", emoji: "📣" },
  story: { label: "История", emoji: "🎯" },
};

const PostCard = ({ post, clubName, onLike }) => {
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
        <p className="meta">{post.body}</p>
      </div>
      <div className="post-footer">
        {clubName && <span className="pill outline">{clubName}</span>}
        <div className="post-actions">
          <button className="ghost" onClick={() => onLike(post.id)}>
            ❤ {post.likesCount}
          </button>
          <span className="meta">💬 {post.commentsCount}</span>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
