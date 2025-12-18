import React, { useMemo, useState } from "react";
import PostCard from "./components/PostCard";

const filters = [
  { id: "all", label: "Все" },
  { id: "my", label: "Мои клубы" },
  { id: "achievement", label: "Достижения" },
  { id: "mission_share", label: "Задания" },
  { id: "question", label: "Вопросы" },
  { id: "announcement", label: "Анонсы" },
];

const FeedTab = ({ posts, clubs, membershipSet, onLike, onCreatePost }) => {
  const [filter, setFilter] = useState("all");
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({ title: "", body: "", type: "story", clubId: "" });

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      if (filter === "my") return post.clubId && membershipSet.has(post.clubId);
      if (filter === "achievement") return post.type === "achievement";
      if (filter === "mission_share") return post.type === "mission_share";
      if (filter === "question") return post.type === "question";
      if (filter === "announcement") return post.type === "announcement";
      return true;
    });
  }, [posts, filter, membershipSet]);

  const handleSubmit = () => {
    if (!form.title || !form.body) return;
    onCreatePost(form);
    setForm({ title: "", body: "", type: "story", clubId: "" });
    setFormOpen(false);
  };

  return (
    <div className="tab-content">
      <div className="tab-header">
        <div>
          <h2>Лента сообщества</h2>
          <p className="meta">Истории, победы и анонсы из клубов.</p>
        </div>
        <button className="primary" onClick={() => setFormOpen((v) => !v)}>
          {formOpen ? "Закрыть" : "Создать пост"}
        </button>
      </div>
      {formOpen && (
        <div className="card post-form">
          <div className="form-grid">
            <label>
              Заголовок
              <input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} placeholder="Напиши яркий заголовок" />
            </label>
            <label>
              Текст
              <textarea value={form.body} onChange={(e) => setForm((p) => ({ ...p, body: e.target.value }))} placeholder="Что произошло?" />
            </label>
            <div className="form-inline">
              <label>
                Тип
                <select value={form.type} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}>
                  <option value="story">История</option>
                  <option value="achievement">Достижение</option>
                  <option value="announcement">Анонс</option>
                  <option value="progress">Прогресс</option>
                </select>
              </label>
              <label>
                Клуб (необязательно)
                <select value={form.clubId} onChange={(e) => setForm((p) => ({ ...p, clubId: e.target.value }))}>
                  <option value="">Без клуба</option>
                  {clubs.map((club) => (
                    <option key={club.id} value={club.id}>
                      {club.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <button className="primary" onClick={handleSubmit}>Опубликовать</button>
          </div>
        </div>
      )}
      <div className="chip-row scrollable">
        {filters.map((f) => (
          <button key={f.id} className={`pill ${filter === f.id ? "active" : "outline"}`} onClick={() => setFilter(f.id)}>
            {f.label}
          </button>
        ))}
      </div>
      <div className="grid cards columns-2">
        {filteredPosts.map((post) => (
          <PostCard key={post.id} post={post} clubName={clubs.find((c) => c.id === post.clubId)?.name} onLike={onLike} />
        ))}
      </div>
    </div>
  );
};

export default FeedTab;
