import React, { useState } from "react";
import { Link, NavLink } from "../../routerShim";
import { navLinks } from "../../utils/navigation";

const Header = ({ user, onLogout, theme, toggleTheme }) => {
  const [open, setOpen] = useState(false);

  return (
    <header className="header">
      <Link to="/" className="logo" onClick={() => setOpen(false)}>
        NOESIS
      </Link>
      <button className="burger" onClick={() => setOpen((v) => !v)} aria-label="menu">
        ☰
      </button>
      <nav className={`nav ${open ? "open" : ""}`}>
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/"}
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            onClick={() => setOpen(false)}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
      <div className="header-actions">
        <button className="ghost" onClick={toggleTheme}>
          {theme === "dark" ? "Тёмная" : "Светлая"}
        </button>
        {!user && <Link to="/auth" className="primary">Войти</Link>}
        {user && (
          <div className="user-chip">
            <Link to="/profile" className="avatar">
              {user.name?.[0] || "Я"}
            </Link>
            <div className="user-meta">
              <div className="user-name">{user.name}</div>
              <button className="ghost" onClick={onLogout}>
                Выйти
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
