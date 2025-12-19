import React from "react";
import { useNavigate } from "../routerShim";

const MemoryQuickAddFab = () => {
  const navigate = useNavigate();

  return (
    <button
      className="memory-fab"
      aria-label="Быстро добавить заметку в память"
      onClick={() => navigate("/memory", { state: { quickAdd: true } })}
    >
      ✍️
    </button>
  );
};

export default MemoryQuickAddFab;
