import React from "react";

const ActivityHistory = ({ feed = [] }) => (
  <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-lg">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.08em] text-white/60">Что уже сделано</p>
        <h3 className="text-xl font-semibold text-white">Лента активности</h3>
      </div>
      <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/60">{feed.length} событий</span>
    </div>
    <div className="mt-4 space-y-3">
      {feed.map((item) => (
        <div key={item.id} className="flex items-center justify-between rounded-2xl border border-white/5 bg-[#0f172a] p-3 text-white">
          <div>
            <p className="text-sm font-semibold">{item.title}</p>
            <p className="text-xs text-white/60">{item.type}</p>
          </div>
          <span className="text-sm text-[#c084fc]">{item.points || "+120 XP"}</span>
        </div>
      ))}
    </div>
  </div>
);

export default ActivityHistory;
