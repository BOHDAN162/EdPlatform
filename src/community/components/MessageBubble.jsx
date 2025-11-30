import React from "react";

const MessageBubble = ({ message, participant }) => {
  return (
    <div className="message-bubble">
      <div className="avatar small">{participant?.name?.[0] || "?"}</div>
      <div>
        <div className="message-head">
          <span className="message-author">{participant?.name || "Участник"}</span>
          <span className="pill subtle">{participant?.role || "Новичок"}</span>
          <span className="meta">{new Date(message.createdAt).toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" })}</span>
        </div>
        <div className="message-body">{message.body}</div>
      </div>
    </div>
  );
};

export default MessageBubble;
