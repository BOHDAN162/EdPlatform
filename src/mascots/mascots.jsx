import BlueSquareMascot from "./BlueSquareMascot";
import GreenTriangleMascot from "./GreenTriangleMascot";
import RedCircleMascot from "./RedCircleMascot";

export const MASCOTS = [
  {
    id: "blueSquare",
    name: "Синий квадрат",
    palette: { primary: "#3B82F6", glow: "#93C5FD" },
    Component: BlueSquareMascot,
  },
  {
    id: "greenTriangle",
    name: "Зелёный треугольник",
    palette: { primary: "#22C55E", glow: "#86EFAC" },
    Component: GreenTriangleMascot,
  },
  {
    id: "redCircle",
    name: "Красный круг",
    palette: { primary: "#EF4444", glow: "#FCA5A5" },
    Component: RedCircleMascot,
  },
];

export const defaultMascotId = MASCOTS[0]?.id || "blueSquare";

export const getMascotById = (id) => MASCOTS.find((item) => item.id === id) || null;
