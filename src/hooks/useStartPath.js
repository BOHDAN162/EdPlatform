import { useCallback } from "react";
import { useNavigate } from "../routerShim";

export const useStartPath = () => {
  const navigate = useNavigate();
  const goToStartPath = useCallback(() => {
    navigate("/missions");
  }, [navigate]);

  return goToStartPath;
};
