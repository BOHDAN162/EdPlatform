import React from "react";

const AchievementsStream = ({ items = [] }) => (
  <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-lg">
    <div>
      <p className="text-xs uppercase tracking-[0.08em] text-white/60">Мини-достижения</p>
      <h3 className="text-xl font-semibold text-white">Последние награды</h3>
    </div>
    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <div key={item.id} className="flex items-center gap-3 rounded-2xl border border-white/5 bg-[#0f172a] p-3 text-white">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#8A3FFC] to-[#22d3ee] text-lg">
            {item.icon}
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold">{item.title}</p>
            <p className="text-xs text-white/60">{item.subtitle}</p>
          </div>
          <span className="text-xs text-[#c084fc]">{item.reward}</span>
        </div>
      ))}
    </div>
  </div>
);

export default AchievementsStream;
