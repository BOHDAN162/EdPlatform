import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { getMascotById } from "./mascots";

const STORAGE_KEY = "noesis_mascot_id";
const defaultMascotId = "violet";

const MascotContext = createContext({ mascotId: defaultMascotId, setMascotId: () => {} });

const readStoredMascot = () => {
  if (typeof localStorage === "undefined") return defaultMascotId;
  try {
    return localStorage.getItem(STORAGE_KEY) || defaultMascotId;
  } catch (error) {
    console.warn("Не удалось прочитать маскота", error);
    return defaultMascotId;
  }
};

export const MascotProvider = ({ children }) => {
  const [mascotId, setMascotId] = useState(() => readStoredMascot());

  const setMascot = useCallback((id) => {
    const mascot = getMascotById(id);
    setMascotId(mascot.id);
    if (typeof localStorage !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, mascot.id);
      } catch (error) {
        console.warn("Не удалось сохранить маскота", error);
      }
    }
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
