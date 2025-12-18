import React from "react";

const AchievementsFeed = ({ feed = [] }) => {
  return (
    <section className="card achievements-feed">
      <div className="section-head">
        <div>
          <p className="meta">История</p>
          <h3>Что уже сделано</h3>
        </div>
      </div>
      <div className="timeline">
        {feed.length === 0 && <p className="meta subtle">Пока нет событий — закрой задание или материал, чтобы увидеть движение.</p>}
        {feed.slice(0, 6).map((item) => (
          <div key={item.id} className="timeline-item">
            <div className="timeline-dot" />
            <div>
              <div className="timeline-title">{item.title}</div>
              <div className="meta subtle">{item.type || "событие"}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AchievementsFeed;
