import React from "react";
import Header from "./Header";
import ToastStack from "../common/ToastStack";

const AppLayout = ({ theme, accent, user, onLogout, toasts, children }) => (
  <div className={`app ${theme} ${accent ? `accent-${accent}` : ""}`}>
    <Header user={user} onLogout={onLogout} theme={theme} />
    <main className="container">{children}</main>
    <ToastStack messages={toasts} />
  </div>
);

export default AppLayout;
