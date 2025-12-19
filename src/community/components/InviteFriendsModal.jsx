import React from "react";

const InviteFriendsModal = ({ link, onCopy, onShare, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <p className="hero-kicker">Пригласить друзей</p>
            <h3>Твоя реферальная ссылка</h3>
          </div>
          <button className="ghost" onClick={onClose} aria-label="Закрыть">
            ✕
          </button>
        </div>
        <div className="invite-link-block">
          <div className="invite-link-input" role="textbox" aria-label="Реферальная ссылка" tabIndex={0}>
            {link}
          </div>
          <button className="primary" onClick={onCopy}>
            Скопировать
          </button>
        </div>
        <div className="chip-row wrap">
          <button className="ghost" onClick={() => onShare("tg")}>Поделиться в Telegram</button>
          <button className="ghost" onClick={() => onShare("vk")}>Поделиться ВК</button>
          <button className="ghost" onClick={() => onShare("wa")}>Поделиться WhatsApp</button>
        </div>
      </div>
    </div>
  );
};

export default InviteFriendsModal;
