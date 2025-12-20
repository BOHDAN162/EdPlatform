import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { defaultMascotId, getMascotById } from "./mascots";

const STORAGE_KEY = "noesis:selectedMascot";

const MascotContext = createContext({ mascotId: defaultMascotId, setMascotId: () => {} });

const normalizeMascotId = (id) => {
  const mascot = getMascotById(id);
  if (mascot) return mascot.id;
  return null;
};

const persistMascot = (id) => {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, id);
  } catch (error) {
    console.warn("Не удалось сохранить маскота", error);
  }
};

const readStoredMascot = () => {
  if (typeof localStorage === "undefined") return defaultMascotId;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const validId = normalizeMascotId(stored);
    if (validId) return validId;
    persistMascot(defaultMascotId);
    return defaultMascotId;
  } catch (error) {
    console.warn("Не удалось прочитать маскота", error);
    return defaultMascotId;
  }
};

export const MascotProvider = ({ children }) => {
  const [mascotId, setMascotId] = useState(() => readStoredMascot());

  const setMascot = useCallback((id) => {
    const validId = normalizeMascotId(id) || defaultMascotId;
    setMascotId(validId);
    persistMascot(validId);
  }, []);

  const value = useMemo(() => ({ mascotId, setMascotId: setMascot }), [mascotId, setMascot]);

  return <MascotContext.Provider value={value}>{children}</MascotContext.Provider>;
};

export const useMascot = () => {
  const context = useContext(MascotContext);
  if (!context) throw new Error("useMascot должен использоваться внутри MascotProvider");
  return context;
};

export { STORAGE_KEY as MASCOT_STORAGE_KEY, defaultMascotId };
