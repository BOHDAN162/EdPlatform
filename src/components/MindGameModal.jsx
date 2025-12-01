import React from "react";

const MindGameModal = ({ open, onClose, children }) => {
  if (!open) return null;
  return (
    <div className="modal-backdrop mindgame-modal" role="dialog" aria-modal="true">
      <div className="modal-card mindgame-modal-card">
        <button className="ghost close-button" onClick={onClose} aria-label="Закрыть игру">
          ✕
        </button>
        {children}
      </div>
    </div>
  );
};

export default MindGameModal;
