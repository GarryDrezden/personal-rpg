/** Personalized Body Abilities v1 — profile, bank metadata, user grid state. */

export type WeightLossGoalBand =
  | 'under_10'
  | '10_20'
  | '20_50'
  | '50_80'
  | '80_plus';

export type BodyPathType =
  | 'shape_tuning'
  | 'control_return'
  | 'mobility_return'
  | 'athlete_return'
  | 'load_reduction'
  | 'appearance_focus'
  | 'resource_recovery';

export type BodyAbilityInterest =
  | 'appearance'
  | 'measurements'
  | 'endurance'
  | 'stairs_routes'
  | 'strength'
  | 'flexibility'
  | 'nutrition_control'
  | 'sleep_resource'
  | 'alcohol_evening'
  | 'sport_training'
  | 'daily_life'
  | 'mobility'
  | 'confidence';

export type BodyAbilityBaselineEasy =
  | 'tie_shoes'
  | 'walk_10k'
  | 'walk_15k'
  | 'stairs_ok'
  | 'stand_from_floor'
  | 'stand_long'
  | 'car_ok'
  | 'daily_chores_ok'
  | 'training_ok'
  | 'nutrition_ok'
  | 'alcohol_ok';

export type BodyAbilityHiddenTopic =
  | 'weight'
  | 'alcohol'
  | 'nutrition'
  | 'appearance'
  | 'daily_life_limitations'
  | 'stairs'
  | 'sport'
  | 'measurements';

export interface BodyAbilityProfile {
  goalKg?: number | null;
  goalBand: WeightLossGoalBand;
  pathTypes: BodyPathType[];
  interests: BodyAbilityInterest[];
  baselineEasy: BodyAbilityBaselineEasy[];
  hiddenTopics: BodyAbilityHiddenTopic[];
  configuredAt?: string | null;
}

export type BodyAbilityUnlockMode =
  | 'auto'
  | 'suggested_confirmation'
  | 'manual';

export type BodyAbilityDifficulty =
  | 'early'
  | 'middle'
  | 'late'
  | 'epic';

export type BodyAbilityAutoUnlockType =
  | 'weight_loss_kg'
  | 'waist_loss_cm'
  | 'steps_days_normal'
  | 'steps_days_minimum'
  | 'no_alcohol_days'
  | 'calorie_tracking_days'
  | 'calorie_limit_days'
  | 'recovery_days'
  | 'gym_total'
  | 'sleep_or_energy_days';

export interface BodyAbilityDefinition {
  id: string;
  title: string;
  description: string;
  category: BodyAbilityInterest;
  secondaryCategories?: BodyAbilityInterest[];
  goalBands: WeightLossGoalBand[];
  pathTypes?: BodyPathType[];
  unlockMode: BodyAbilityUnlockMode;
  difficulty: BodyAbilityDifficulty;
  tags: string[];
  excludedByBaselineEasy?: BodyAbilityBaselineEasy[];
  hiddenByTopics?: BodyAbilityHiddenTopic[];
  prerequisites?: string[];
  maxCount?: number;
  scoreWeight: number;
  /** Threshold for unlockMode === 'auto'. Ignored for suggested/manual. */
  autoUnlock?: {
    type: BodyAbilityAutoUnlockType;
    target: number;
  };
}

export type BodyAbilityStatus =
  | 'locked'
  | 'suggested'
  | 'unlocked'
  | 'hidden';

export interface UserBodyAbility {
  abilityId: string;
  status: BodyAbilityStatus;
  selectedAt: string;
  suggestedAt?: string | null;
  unlockedAt?: string | null;
  confirmedByUser?: boolean;
}

export interface BodyAbilitiesPersonalState {
  profile?: BodyAbilityProfile | null;
  selectedAbilityIds: string[];
  abilities: Record<string, UserBodyAbility>;
  generatedAt?: string | null;
  lastReviewedAt?: string | null;
}

export type BodyAbilityPersonalItem = {
  definition: BodyAbilityDefinition;
  user: UserBodyAbility;
};

export type BodyAbilityPersonalSummary = {
  configured: boolean;
  unlockedCount: number;
  selectedCount: number;
  suggestedCount: number;
  nextSuggested: BodyAbilityDefinition | null;
  nextAuto: BodyAbilityDefinition | null;
  progressLine: string;
};
