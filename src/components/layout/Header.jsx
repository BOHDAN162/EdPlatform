import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "../../routerShim";
import { navLinks } from "../../utils/navigation";

const AVATAR_KEY = "noesis_user_avatar";

const Header = ({ user }) => {
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const [avatarUrl, setAvatarUrl] = useState("");

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
    const handleStorage = () => {
      if (typeof localStorage === "undefined") return;
      setAvatarUrl(localStorage.getItem(AVATAR_KEY) || "");
    };
    window.addEventListener("storage", handleStorage);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  useEffect(() => {
    if (user?.avatar) {
      setAvatarUrl(user.avatar);
      return;
    }
    if (typeof localStorage !== "undefined") {
      setAvatarUrl(localStorage.getItem(AVATAR_KEY) || "");
    }
  }, [user?.avatar]);

  const handleImageError = () => setAvatarUrl("");

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
              className="avatar ghost-button overflow-hidden"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-haspopup="true"
              aria-expanded={menuOpen}
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Аватар пользователя"
                  className="h-full w-full object-cover"
                  onError={handleImageError}
                />
              ) : (
                user.name?.[0] || "Я"
              )}
            </button>
            {menuOpen && (
              <div className="profile-menu" role="menu">
                <div className="profile-menu__header">
                  <div className="avatar small overflow-hidden">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt="Аватар пользователя"
                        className="h-full w-full object-cover"
                        onError={handleImageError}
                      />
                    ) : (
                      user.name?.[0] || "Я"
                    )}
                  </div>
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
