import React from "react";
import { defaultMascotId, getMascotById } from "./mascots";
import { useMascot } from "./MascotContext";

const MascotRenderer = ({ mascotId, size = 240, className = "", variant = "standalone" }) => {
  const { mascotId: activeMascotId } = useMascot();
  const targetMascot = getMascotById(mascotId || activeMascotId) || getMascotById(defaultMascotId);
  const mascot = targetMascot || getMascotById(defaultMascotId);
  const Svg = mascot.Component;

  const baseWrapper = "relative flex items-center justify-center";
  const variantClasses = {
    standalone: "rounded-3xl border border-[var(--border)] bg-[var(--card)] shadow-2xl shadow-black/15",
    card: "rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-lg",
  };

  const wrapperClass = [baseWrapper, variantClasses[variant] || variantClasses.standalone, className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={wrapperClass}>
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background: `radial-gradient(circle at 30% 20%, ${mascot.palette.glow}2e, transparent 45%), radial-gradient(circle at 70% 80%, ${mascot.palette.primary}22, transparent 55%)`,
        }}
      />
      <div className="relative flex h-full w-full items-center justify-center p-4 sm:p-6">
        <Svg size={size} />
      </div>
    </div>
  );
};

export default MascotRenderer;
