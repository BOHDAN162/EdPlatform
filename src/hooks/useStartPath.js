import { useCallback } from "react";
import { useNavigate } from "../routerShim";

export const useStartPath = (trackData) => {
  const navigate = useNavigate();
  const goToStartPath = useCallback(() => {
    const hasTrack = !!(trackData?.generatedTrack?.length || trackData?.trackSteps?.length);
    navigate(hasTrack ? "/missions" : "/track-quiz");
  }, [navigate, trackData?.generatedTrack?.length, trackData?.trackSteps?.length]);

  return goToStartPath;
};
