export const safeGetJSON = (key, fallback) => {
  if (typeof localStorage === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    console.warn("Ошибка чтения из localStorage", error);
    return fallback;
  }
};

export const safeSetJSON = (key, value) => {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn("Ошибка записи в localStorage", error);
  }
};

export const safeRemove = (key) => {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.warn("Ошибка удаления из localStorage", error);
  }
};
