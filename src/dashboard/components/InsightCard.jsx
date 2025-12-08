import React from "react";
import { Link } from "../../routerShim";

const InsightCard = ({ insight }) => (
  <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#1a0b2b] p-5 shadow-lg">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.08em] text-white/60">Insight</p>
        <h3 className="text-xl font-semibold text-white">Персональная подсказка</h3>
      </div>
      <Link
        to="/memory"
        className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/70 transition hover:border-[#8A3FFC]/70 hover:text-white"
      >
        В память
      </Link>
    </div>
    <div className="mt-3 rounded-2xl border border-white/5 bg-white/5 p-4 text-white">
      <p className="text-sm text-white/70">{insight.context}</p>
      <p className="mt-2 text-lg font-semibold">{insight.title}</p>
      <p className="text-sm text-white/70">{insight.action}</p>
      <div className="mt-3 flex gap-2 text-xs text-white/60">
        {insight.tags.map((tag) => (
          <span key={tag} className="rounded-full bg-white/5 px-3 py-1">
            {tag}
          </span>
        ))}
      </div>
    </div>
  </div>
);

export default InsightCard;
