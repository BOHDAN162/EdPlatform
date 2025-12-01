import { useCallback, useEffect, useState } from "react";
import { buildDevelopmentTrack, buildProfileResult } from "../trackTemplates";
import { clearTrack, loadTrack, saveTrack } from "../trackStorage";

export const useDevelopmentTrack = (userId, materials = []) => {
  const [trackState, setTrackState] = useState(() => loadTrack(userId));

  useEffect(() => {
    setTrackState(loadTrack(userId));
  }, [userId]);

  const buildTrack = useCallback(
    (archetypeKey, profileResult) => {
      const baseProfile = profileResult || buildProfileResult(archetypeKey);
      const generated = buildDevelopmentTrack(archetypeKey, materials);
      const payload = {
        ...generated,
        profileResult: baseProfile,
        profileKey: archetypeKey,
        trackTitle: generated.trackTitle || `Твой путь — ${baseProfile.profileType}`,
      };
      const saved = saveTrack(userId, payload);
      setTrackState(saved);
      return saved;
    },
    [materials, userId]
  );

  const updateTrack = useCallback(
    (next) => {
      const saved = saveTrack(userId, { ...(trackState || {}), ...next });
      setTrackState(saved);
      return saved;
    },
    [trackState, userId]
  );

  const updateSteps = useCallback(
    (steps) => {
      if (!steps) return trackState;
      return updateTrack({ trackSteps: steps, generatedTrack: steps });
    },
    [trackState, updateTrack]
  );

  const resetTrack = useCallback(() => {
    clearTrack(userId);
    setTrackState(null);
  }, [userId]);

  return {
    trackState,
    buildTrack,
    updateSteps,
    updateTrack,
    resetTrack,
  };
};
