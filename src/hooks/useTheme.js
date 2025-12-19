import { useEffect, useState } from "react";

const THEME_STORAGE_KEY = "ep_theme";
const ACCENT_STORAGE_KEY = "ep_accent";

const accentPalette = {
  violet: "#8b5cf6",
  emerald: "#10b981",
  indigo: "#6366f1",
  orange: "#f97316",
};

const readStoredTheme = () => {
  if (typeof localStorage === "undefined") return "light";
  try {
    return localStorage.getItem(THEME_STORAGE_KEY) || "light";
  } catch (error) {
    console.warn("Не удалось прочитать тему из localStorage", error);
    return "light";
  }
};

const readStoredAccent = () => {
  if (typeof localStorage === "undefined") return "violet";
  try {
    return localStorage.getItem(ACCENT_STORAGE_KEY) || "violet";
  } catch (error) {
    console.warn("Не удалось прочитать акцент из localStorage", error);
    return "violet";
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

const persistAccent = (value) => {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(ACCENT_STORAGE_KEY, value);
  } catch (error) {
    console.warn("Не удалось сохранить акцент в localStorage", error);
  }
};

export const useTheme = () => {
  const [theme, setTheme] = useState(readStoredTheme);
  const [accent, setAccent] = useState(readStoredAccent);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.body.dataset.theme = theme;
    }
    persistTheme(theme);
  }, [theme]);

  useEffect(() => {
    const value = accentPalette[accent] || accentPalette.violet;
    if (typeof document !== "undefined") {
      document.documentElement.style.setProperty("--accent", value);
      document.body.dataset.accent = accent;
    }
    persistAccent(accent);
  }, [accent]);

  const toggleTheme = () => setTheme((current) => (current === "dark" ? "light" : "dark"));

  return { theme, setTheme, toggleTheme, accent, setAccent };
};
