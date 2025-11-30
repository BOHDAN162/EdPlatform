import React, { useMemo, useState } from "react";
import ChannelCard from "./components/ChannelCard";
import MessageBubble from "./components/MessageBubble";

const ChatsTab = ({ channels, messages, participants, onSend }) => {
  const [active, setActive] = useState(channels[0]);
  const [text, setText] = useState("");

  const channelMessages = useMemo(() => messages[active?.id] || [], [messages, active]);

  const handleSend = () => {
    if (!text || !active) return;
    onSend(active.id, text);
    setText("");
  };

  return (
    <div className="tab-content chats-tab">
      <div className="tab-header">
        <div>
          <h2>Чаты</h2>
          <p className="meta">Лёгкое общение по темам: общие вопросы, финансы, продукт, квесты.</p>
        </div>
      </div>
      <div className="chats-grid">
        <div className="channels-list">
          {channels.map((ch) => (
            <ChannelCard key={ch.id} channel={ch} active={active?.id === ch.id} onSelect={setActive} />
          ))}
        </div>
        <div className="channel-view card">
          <div className="channel-head">
            <div>
              <div className="card-header">{active?.name}</div>
              <p className="meta">{active?.description}</p>
            </div>
            <span className="pill outline">{active?.type}</span>
          </div>
          <div className="messages-area">
            {channelMessages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} participant={participants.find((p) => p.id === msg.authorId)} />
            ))}
            {channelMessages.length === 0 && <p className="meta">Пока пусто. Напиши первое сообщение!</p>}
          </div>
          <div className="chat-input">
            <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Отправь поддержку или идею" />
            <button className="primary" onClick={handleSend}>Отправить</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatsTab;
