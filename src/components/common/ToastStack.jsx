import React from "react";

const ToastStack = ({ messages }) => {
  if (!messages.length) return null;

  return (
    <div className="toast-stack">
      {messages.map((message) => (
        <div key={message.id} className="toast">
          {message.text}
        </div>
      ))}
    </div>
  );
};

export default ToastStack;
