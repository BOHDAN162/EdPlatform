import React from "react";
import { Link } from "../../routerShim";

const CommunitySnapshot = ({ items = [] }) => {
  return (
    <section className="card community-snapshot">
      <div className="section-head">
        <div>
          <p className="meta">Сообщество</p>
          <h3>Что делают другие</h3>
        </div>
        <Link to="/community" className="ghost">
          В сообщество
        </Link>
      </div>
      <div className="community-grid">
        {items.map((item) => (
          <div key={item.id} className="community-card">
            <div className="avatar small">{item.name?.[0] || "?"}</div>
            <div>
              <div className="community-title">{item.name}</div>
              <div className="meta subtle">{item.action}</div>
            </div>
            <span className="pill subtle">{item.tag}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CommunitySnapshot;
