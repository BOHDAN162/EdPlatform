import { useCallback } from "react";
import { useNavigate } from "../routerShim";

export const useStartPath = (trackData) => {
  const navigate = useNavigate();
  const goToStartPath = useCallback(() => {
    const hasTrack = !!trackData?.generatedTrack?.length;
    navigate(hasTrack ? "/library" : "/track-quiz");
  }, [navigate, trackData?.generatedTrack?.length]);

  return goToStartPath;
};
