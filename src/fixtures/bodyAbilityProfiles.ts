import type { BodyAbilityProfile } from '../types/bodyAbilityPersonal';

/** QA archetype: large goal, already athletic/mobile. */
export const PROFILE_A_LARGE_ATHLETIC: BodyAbilityProfile = {
  goalKg: 80,
  goalBand: '80_plus',
  pathTypes: [
    'control_return',
    'athlete_return',
    'load_reduction',
    'resource_recovery',
  ],
  interests: [
    'endurance',
    'strength',
    'sport_training',
    'nutrition_control',
    'alcohol_evening',
    'sleep_resource',
    'measurements',
    'confidence',
  ],
  baselineEasy: [
    'tie_shoes',
    'walk_10k',
    'walk_15k',
    'stairs_ok',
    'stand_from_floor',
    'stand_long',
    'car_ok',
    'daily_chores_ok',
    'training_ok',
  ],
  hiddenTopics: [],
  configuredAt: null,
};

/** QA archetype: small goal, appearance/tone focus. */
export const PROFILE_B_SMALL_APPEARANCE: BodyAbilityProfile = {
  goalKg: 10,
  goalBand: '10_20',
  pathTypes: ['shape_tuning', 'appearance_focus', 'control_return'],
  interests: [
    'appearance',
    'measurements',
    'nutrition_control',
    'sleep_resource',
    'sport_training',
    'confidence',
  ],
  baselineEasy: [
    'tie_shoes',
    'walk_10k',
    'walk_15k',
    'stairs_ok',
    'stand_from_floor',
    'stand_long',
    'car_ok',
    'daily_chores_ok',
  ],
  hiddenTopics: ['daily_life_limitations'],
  configuredAt: null,
};

/** QA archetype: large goal, low mobility baseline. */
export const PROFILE_C_LARGE_LOW_MOBILITY: BodyAbilityProfile = {
  goalKg: 50,
  goalBand: '50_80',
  pathTypes: ['mobility_return', 'load_reduction', 'resource_recovery'],
  interests: [
    'mobility',
    'stairs_routes',
    'daily_life',
    'endurance',
    'sleep_resource',
    'measurements',
  ],
  baselineEasy: ['nutrition_ok'],
  hiddenTopics: ['alcohol'],
  configuredAt: null,
};

/** QA archetype: moderate goal, athletic comeback. */
export const PROFILE_D_ATHLETE_COMEBACK: BodyAbilityProfile = {
  goalKg: 20,
  goalBand: '20_50',
  pathTypes: ['athlete_return', 'shape_tuning', 'resource_recovery'],
  interests: [
    'sport_training',
    'strength',
    'endurance',
    'sleep_resource',
    'appearance',
    'measurements',
  ],
  baselineEasy: [
    'tie_shoes',
    'walk_10k',
    'walk_15k',
    'stairs_ok',
    'stand_from_floor',
    'daily_chores_ok',
    'car_ok',
  ],
  hiddenTopics: ['alcohol', 'daily_life_limitations'],
  configuredAt: null,
};

export const BODY_ABILITY_QA_PROFILES = {
  A_large_athletic: PROFILE_A_LARGE_ATHLETIC,
  B_small_appearance: PROFILE_B_SMALL_APPEARANCE,
  C_large_low_mobility: PROFILE_C_LARGE_LOW_MOBILITY,
  D_athlete_comeback: PROFILE_D_ATHLETE_COMEBACK,
} as const;
