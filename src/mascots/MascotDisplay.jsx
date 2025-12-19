import React from "react";
import { MASCOTS, getMascotById } from "./mascots";
import { defaultMascotId, useMascot } from "./MascotContext";

const variantStyles = {
  hero: "relative w-full max-w-[360px] aspect-square rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-2xl shadow-black/20",
  avatar:
    "relative h-16 w-16 sm:h-20 sm:w-20 overflow-hidden rounded-full border-2 border-[var(--border)] bg-[var(--card)] shadow-lg",
  picker:
    "relative flex flex-col items-center gap-3 rounded-2xl border border-[var(--border)] bg-white/5 p-4 text-center transition hover:border-[var(--accent)]/60 hover:shadow-lg",
};

const MascotDisplay = ({ variant = "hero", mascotId, withName = false }) => {
  const { mascotId: activeMascotId } = useMascot();
  const targetMascot = getMascotById(mascotId || activeMascotId) || getMascotById(defaultMascotId);
  const mascot = targetMascot || MASCOTS[0];
  const Svg = mascot.Component;

  const palette = mascot.palette || { primary: "#8A3FFC", glow: "#A855F7" };
  const wrapperClass = variantStyles[variant] || variantStyles.hero;
  const size = variant === "avatar" ? 96 : variant === "picker" ? 140 : 260;

  return (
    <div className={wrapperClass} aria-label={`Маскот ${mascot.name}`}>
      <div
        className="absolute inset-0 opacity-70"
        style={{
          background: `radial-gradient(circle at 30% 20%, ${palette.glow}33, transparent 45%), radial-gradient(circle at 70% 80%, ${palette.primary}2e, transparent 55%)`,
        }}
      />
      <div className="relative flex h-full w-full items-center justify-center">
        <Svg size={size} floating={variant === "hero"} />
      </div>
      {withName && (
        <div className="mt-2 text-sm font-semibold text-[var(--fg)]">{mascot.name}</div>
      )}
    </div>
  );
};

export const MascotLegend = () => (
  <div className="grid grid-cols-2 gap-3 text-left text-xs text-[var(--muted)]">
    {MASCOTS.map((mascot) => (
      <div key={mascot.id} className="rounded-xl border border-white/5 bg-white/5 px-3 py-2">
        {mascot.name}
      </div>
    ))}
  </div>
);

export default MascotDisplay;
