import React from "react";
import Header from "./Header";
import ToastStack from "../common/ToastStack";

const AppLayout = ({ theme, user, onLogout, toggleTheme, toasts, children }) => (
  <div className={`app ${theme}`}>
    <Header user={user} onLogout={onLogout} theme={theme} toggleTheme={toggleTheme} />
    <main className="container">{children}</main>
    <ToastStack messages={toasts} />
  </div>
);

export default AppLayout;
