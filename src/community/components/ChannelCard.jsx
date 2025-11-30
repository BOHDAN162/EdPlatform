import React from "react";

const typeLabels = {
  global: "Общий",
  topic: "Тема",
  club: "Клуб",
};

const ChannelCard = ({ channel, onSelect, active }) => {
  return (
    <button type="button" className={`channel-card ${active ? "active" : ""}`} onClick={() => onSelect(channel)}>
      <div>
        <div className="channel-name">{channel.name}</div>
        <p className="meta">{channel.description}</p>
      </div>
      <span className="pill outline">{typeLabels[channel.type] || "Чат"}</span>
    </button>
  );
};

export default ChannelCard;
