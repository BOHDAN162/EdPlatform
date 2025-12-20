import React from "react";
import { Link } from "../../routerShim";

const Card = ({ item }) => (
  <Link
    to={item.to}
    className="group relative flex min-w-[220px] flex-col gap-2 rounded-2xl border border-white/5 bg-[#0f172a] p-4 text-white transition hover:-translate-y-1 hover:border-[#8A3FFC]/70 hover:shadow-xl hover:shadow-[#8A3FFC]/20"
  >
    <div className="flex items-center justify-between text-xs text-white/60">
      <span>{item.typeLabel}</span>
      <span className="text-white/50">{item.duration}</span>
    </div>
    <h4 className="text-lg font-semibold leading-tight">{item.title}</h4>
    <p className="text-sm text-white/60">{item.description}</p>
    <div className="flex items-center gap-2 text-xs text-white/60">
      <span className="rounded-full bg-[#8A3FFC]/15 px-3 py-1 text-[#c4b5fd]">{item.badge}</span>
      <span className="group-hover:text-white">Перейти →</span>
    </div>
  </Link>
);

const ContentRail = ({ content = [], title = "Рекомендации" }) => {
  const handleWheel = (event) => {
    if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
    if (typeof window !== "undefined") {
      window.scrollBy({ top: event.deltaY, behavior: "auto" });
    }
    event.preventDefault();
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-lg">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.08em] text-white/60">Рекомендации</p>
          <h3 className="text-xl font-semibold text-white">{title}</h3>
        </div>
        <Link
          to="/library"
          className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/70 transition hover:border-[#8A3FFC]/70 hover:text-white"
        >
          В библиотеку
        </Link>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2" onWheel={handleWheel}>
        {content.map((item) => (
          <Card key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default ContentRail;
