import { trackQuestions } from "../trackQuestions";
import { buildPersonalTrack } from "../trackTemplates";
import { missions } from "../missionsData";

const baseTotals = { founder: 0, strategist: 0, leader: 0, creator: 0 };

export const calculateArchetypeFromAnswers = (answers) => {
  const totals = { ...baseTotals };
  trackQuestions.forEach((question, idx) => {
    const optionIndex = answers[idx];
    if (optionIndex === null || optionIndex === undefined) return;
    const option = question.options[optionIndex];
    Object.entries(option.scores || {}).forEach(([key, points]) => {
      totals[key] = (totals[key] || 0) + points;
    });
  });
  const archetype = Object.keys(totals).reduce(
    (best, key) => (totals[key] > totals[best] ? key : best),
    Object.keys(totals)[0]
  );
  return { archetype, totals };
};

const pickRecommendedMission = (materialId) => {
  if (!materialId) return missions[0];
  return missions.find((mission) => mission.steps.some((step) => step.materialId === materialId)) || missions[0];
};

export const buildPersonalTrackFromAnswers = (answers) => {
  const result = calculateArchetypeFromAnswers(answers);
  const track = buildPersonalTrack(result.archetype);
  const firstStep = track.generatedTrack?.[0];
  const mission = pickRecommendedMission(firstStep?.materialId);

  return {
    result,
    track: {
      ...track,
      firstMaterialId: firstStep?.materialId || null,
      recommendedMissionId: mission?.id || null,
      onboardingCompletedAt: new Date().toISOString(),
    },
  };
};
