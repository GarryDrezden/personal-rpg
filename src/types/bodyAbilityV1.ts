export type BodyAbilityV1Category =
  | 'mobility'
  | 'endurance'
  | 'dailyLife'
  | 'confidence'
  | 'clothing'
  | 'recovery'
  | 'strength';

export type BodyAbilityV1Tier = 'early' | 'middle' | 'late';

export type BodyAbilityProgressionRing =
  | 'early_signals'
  | 'stable_form'
  | 'new_mobility';

export type BodyAbilityAvailability = 'active' | 'future';

export type BodyAbilityArtStatus = 'inApp' | 'placeholder';

export type BodyAbilityV1UnlockMode = 'manual';

export type BodyAbilityHintSignal =
  | 'steps_stable'
  | 'steps_5000_days'
  | 'steps_8000_days'
  | 'waist_down'
  | 'weight_down'
  | 'recovery_rhythm'
  | 'journal_entries'
  | 'movement_habits';

export type BodyAbilityV1Def = {
  id: string;
  title: string;
  description: string;
  category: BodyAbilityV1Category;
  tier: BodyAbilityV1Tier;
  progressionRing: BodyAbilityProgressionRing;
  availability: BodyAbilityAvailability;
  artStatus: BodyAbilityArtStatus;
  unlockMode: BodyAbilityV1UnlockMode;
  hint: string;
  hintSignals: BodyAbilityHintSignal[];
  icon: string;
};

export type BodyAbilityUnlockRecord = {
  abilityId: string;
  unlockedAt: string;
  source: 'manual' | 'hint';
  note?: string;
};

export type BodyAbilityState = {
  unlockedAbilityIds: string[];
  abilityUnlocks?: BodyAbilityUnlockRecord[];
  dismissedAbilityHintIds?: string[];
};

export type BodyAbilityV1Item = {
  ability: BodyAbilityV1Def;
  unlocked: boolean;
  unlockedAt?: string;
  hintActive: boolean;
};

export type BodyAbilityV1Hint = {
  ability: BodyAbilityV1Def;
  message: string;
};

export type BodyAbilityV1Summary = {
  unlockedCount: number;
  /** Active v1 abilities only (12). */
  totalCount: number;
  futureCount: number;
  nextSuggested: BodyAbilityV1Def | null;
  progressLine: string;
};
