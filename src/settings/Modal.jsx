import React, { useEffect } from "react";

const Modal = ({ title, children, onClose, actions, size = "md" }) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div className="modal-backdrop px-4 py-8" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className={`w-full max-h-[90vh] overflow-hidden rounded-2xl surface-elevated ${
          size === "lg" ? "max-w-3xl" : "max-w-xl"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button className="text-sm muted-text hover:text-[color:var(--text)]" onClick={onClose} aria-label="Закрыть модальное окно">
            ✕
          </button>
        </div>
        <div className="max-h-[65vh] overflow-y-auto px-6 py-4 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
          {children}
        </div>
        {actions && <div className="flex justify-end gap-3 border-t border-[var(--border)] px-6 py-4">{actions}</div>}
      </div>
    </div>
  );
};

export default Modal;
