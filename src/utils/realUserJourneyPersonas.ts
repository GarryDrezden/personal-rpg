import type { SimulateUserJourneyParams } from './gameDesignSimulation';

export const JOURNEY_PERSONA_IDS = ['A', 'B', 'C', 'D', 'E', 'F'] as const;
export type JourneyPersonaId = (typeof JOURNEY_PERSONA_IDS)[number];

export type JourneyPersonaSpec = SimulateUserJourneyParams & {
  id: JourneyPersonaId;
  label: string;
  summary: string;
};

/** Synthetic QA personas for the real-user-journey pass. Not medical models. */
export const JOURNEY_PERSONAS: Record<JourneyPersonaId, JourneyPersonaSpec> = {
  A: {
    id: 'A',
    label: 'Large goal / athletic',
    summary: '180 → 100, already walks 10–15k, long journey, not a sofa beginner.',
    profileId: 'active',
    days: 28,
    startWeight: 180,
    targetWeight: 100,
    waistStartCm: 128,
  },
  B: {
    id: 'B',
    label: 'Small goal',
    summary: '65 → 55. Path must still feel like a full game.',
    profileId: 'balanced',
    days: 28,
    startWeight: 65,
    targetWeight: 55,
    waistStartCm: 78,
  },
  C: {
    id: 'C',
    label: 'Low mobility',
    summary: '130 → 80. Early functional abilities; lower daily steps.',
    profileId: 'recovery_heavy',
    days: 28,
    startWeight: 130,
    targetWeight: 80,
    waistStartCm: 118,
    stepScale: 0.4,
  },
  D: {
    id: 'D',
    label: 'Athlete comeback',
    summary: '95 → 75. Strength/endurance, not beginner shoes-and-stairs.',
    profileId: 'active',
    days: 28,
    startWeight: 95,
    targetWeight: 75,
    waistStartCm: 92,
  },
  E: {
    id: 'E',
    label: 'Recovery-heavy',
    summary: 'Often recovery/minimal; the game must still move.',
    profileId: 'recovery_heavy',
    days: 28,
    startWeight: 98,
    targetWeight: 82,
    waistStartCm: 104,
  },
  F: {
    id: 'F',
    label: 'Inconsistent / returning',
    summary: '5 days on, 18 away, repeat. Return must not feel like debt.',
    profileId: 'inconsistent',
    days: 28,
    startWeight: 90,
    targetWeight: 75,
    waistStartCm: 96,
    cycle: { onDays: 5, offDays: 18 },
  },
};
