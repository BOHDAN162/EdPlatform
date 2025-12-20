import React, { useEffect, useState } from "react";
import { Link, NavLink } from "../../routerShim";
import { navLinks } from "../../utils/navigation";

const AVATAR_KEY = "noesis_user_avatar";

const Header = ({ user }) => {
  const [open, setOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    const handleStorage = () => {
      if (typeof localStorage === "undefined") return;
      setAvatarUrl(localStorage.getItem(AVATAR_KEY) || "");
    };
    document.addEventListener("keydown", handleEsc);
    window.addEventListener("storage", handleStorage);
    return () => {
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
      <div className="header-actions">
        {!user && (
          <Link to="/auth" className="primary">
            Войти
          </Link>
        )}
        {user && (
          <>
            <Link
              to="/settings?tab=profile"
              className="avatar ghost-button overflow-hidden transition hover:border-[var(--accent)] hover:bg-white/5"
              onClick={closeMenus}
              aria-label="Перейти в профиль настроек"
              title="Настройки профиля"
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
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
