import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "../../routerShim";
import { navLinks } from "../../utils/navigation";

const Header = ({ user }) => {
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    const handleEsc = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  const closeMenus = () => {
    setOpen(false);
    setMenuOpen(false);
  };

  return (
    <header className="header">
      <Link to="/landing" className="logo" onClick={closeMenus}>
        NOESIS
      </Link>
      <button className="burger" onClick={() => setOpen((v) => !v)} aria-label="Открыть меню">
        ☰
      </button>
      <nav className={`nav ${open ? "open" : ""}`}>
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/"}
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            onClick={closeMenus}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
      <div className="header-actions" ref={menuRef}>
        {!user && (
          <Link to="/auth" className="primary">
            Войти
          </Link>
        )}
        {user && (
          <>
            <button
              className="avatar ghost-button"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-haspopup="true"
              aria-expanded={menuOpen}
            >
              {user.name?.[0] || "Я"}
            </button>
            {menuOpen && (
              <div className="profile-menu" role="menu">
                <div className="profile-menu__header">
                  <div className="avatar small">{user.name?.[0] || "Я"}</div>
                  <div>
                    <div className="profile-menu__name">{user.name}</div>
                    <div className="profile-menu__meta">{user.email || "Аккаунт"}</div>
                  </div>
                </div>
                <Link to="/profile" className="profile-menu__item" onClick={closeMenus} role="menuitem">
                  Профиль
                </Link>
                <Link to="/settings" className="profile-menu__item" onClick={closeMenus} role="menuitem">
                  Настройки
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
