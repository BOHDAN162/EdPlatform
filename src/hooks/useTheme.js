import { useEffect, useState } from "react";

const THEME_STORAGE_KEY = "ep_theme";

const readStoredTheme = () => {
  if (typeof localStorage === "undefined") return "light";
  try {
    return localStorage.getItem(THEME_STORAGE_KEY) || "light";
  } catch (error) {
    console.warn("Не удалось прочитать тему из localStorage", error);
    return "light";
  }
};

const persistTheme = (value) => {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, value);
  } catch (error) {
    console.warn("Не удалось сохранить тему в localStorage", error);
  }
};

export const useTheme = () => {
  const [theme, setTheme] = useState(readStoredTheme);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.body.dataset.theme = theme;
    }
    persistTheme(theme);
  }, [theme]);

  const toggleTheme = () => setTheme((current) => (current === "dark" ? "light" : "dark"));

  return { theme, setTheme, toggleTheme };
};
