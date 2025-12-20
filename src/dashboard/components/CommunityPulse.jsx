import React, { useState } from "react";
import { Link } from "../../routerShim";

const CommunityPulse = ({ members = [] }) => {
  const [likes, setLikes] = useState({});

  const toggleLike = (id) => {
    setLikes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="flex h-full flex-col rounded-3xl border border-white/10 bg-white/5 p-5 shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.08em] text-white/60">Что делают другие</p>
          <h3 className="text-xl font-semibold text-white">Сообщество сейчас</h3>
        </div>
        <Link
          to="/community"
          className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/70 transition hover:border-[#8A3FFC]/70 hover:text-white"
        >
          В сообщество
        </Link>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {members.map((member) => (
          <div key={member.id} className="flex items-center gap-3 rounded-2xl border border-white/5 bg-[#0f172a] p-3 text-white">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#8A3FFC] to-[#22d3ee] text-lg font-semibold">
              {member.name.slice(0, 1)}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">{member.name}</p>
              <p className="text-xs text-white/60">{member.action}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => toggleLike(member.id)}
                className={`rounded-full px-2 py-1 text-sm transition ${likes[member.id] ? "bg-[#8A3FFC]/30 text-[#c084fc]" : "bg-white/5 text-white/70 hover:border-[#8A3FFC]/70"}`}
                aria-label="Поставить лайк"
              >
                {likes[member.id] ? "♥" : "♡"}
              </button>
              <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/70">{member.tag}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityPulse;
