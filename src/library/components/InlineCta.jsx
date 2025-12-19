import React from "react";

const InlineCta = ({ label = "Открыть", className = "" }) => {
  const base = "inline-flex items-center gap-1 text-sm font-semibold text-[var(--accent)] transition hover:underline";
  return (
    <span className={`${base} ${className}`}>
      {label}
      <span aria-hidden>→</span>
    </span>
  );
};

export default InlineCta;
