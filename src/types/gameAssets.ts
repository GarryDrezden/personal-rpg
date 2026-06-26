export type HeroGender = 'male' | 'female';

export type TransformationMode = 'weight_loss' | 'muscle_gain' | 'recomposition';

export type HeroStageNumber =
  | 1 | 2 | 3 | 4 | 5
  | 6 | 7 | 8 | 9 | 10
  | 11 | 12 | 13 | 14 | 15
  | 16 | 17 | 18 | 19 | 20;

export type ChapterNumber = 1 | 2 | 3 | 4 | 5;

export type CompanionId =
  | 'golden_chinchilla_cat'
  | 'alabai'
  | 'raven'
  | 'fox_cub';

export type MobId =
  | 'sofa_magnet'
  | 'snack_chaos'
  | 'fog_of_fatigue'
  | 'empty_day'
  | 'impulse_of_rollback'
  | 'night_call'
  | 'gray_heaviness'
  | 'sweet_whisper';

export type BossId =
  | 'misty_baron'
  | 'resource_devourer'
  | 'divan_king'
  | 'lord_of_empty_day'
  | 'chain_of_rollback'
  | 'night_feast_baron'
  | 'promise_collector'
  | 'old_form_guardian';

export type ArtifactId =
  | 'beer_staff'
  | 'clarity_crystal'
  | 'recovery_shield'
  | 'return_shield'
  | 'step_boots'
  | 'iron_boots'
  | 'control_compass'
  | 'journal_quill'
  | 'stability_seal'
  | 'momentum_core'
  | 'body_key'
  | 'boss_chain_fragment'
  | 'night_lantern'
  | 'resource_flask'
  | 'golden_collar';

export type AssetUnlockStatus = 'locked' | 'unlocked' | 'current';

export type GameAssetTheme = 'cozy' | 'darkFantasy' | 'universal';

export type HeroStageMeta = {
  stage: HeroStageNumber;
  title: string;
  description: string;
  progressPercent: number;
  chapter: ChapterNumber;
  image: string;
};

export type CompanionMeta = {
  id: CompanionId;
  title: string;
  subtitle: string;
  description: string;
  role: string;
  image: string;
  theme: GameAssetTheme;
};

export type MobWeakness =
  | 'steps'
  | 'calories'
  | 'journal'
  | 'recovery'
  | 'minimal_day'
  | 'no_alcohol'
  | 'any_data'
  | 'base_day';

export type MobMeta = {
  id: MobId;
  title: string;
  subtitle: string;
  description: string;
  weakness: MobWeakness;
  image: string;
  theme: GameAssetTheme;
};

export type BossMeta = {
  id: BossId;
  title: string;
  subtitle: string;
  description: string;
  chapter?: ChapterNumber;
  image: string;
  rewardArtifactId?: ArtifactId;
  theme: GameAssetTheme;
};

export type ArtifactRarity = 'common' | 'rare' | 'epic' | 'legendary';

export type ArtifactMeta = {
  id: ArtifactId;
  title: string;
  description: string;
  unlockHint: string;
  rarity: ArtifactRarity;
  image: string;
  theme: GameAssetTheme;
};

export type GameAssetRegistry = {
  heroStages: Record<HeroGender, HeroStageMeta[]>;
  companions: Record<CompanionId, CompanionMeta>;
  mobs: Record<MobId, MobMeta>;
  bosses: Record<BossId, BossMeta>;
  artifacts: Record<ArtifactId, ArtifactMeta>;
};

export type GameAssetLayoutItem = {
  id: string;
  src: string;
  alt: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex?: number;
  status?: AssetUnlockStatus;
};

export const HERO_STAGE_COUNT = 20;

export const MOB_IDS: MobId[] = [
  'sofa_magnet',
  'snack_chaos',
  'fog_of_fatigue',
  'empty_day',
  'impulse_of_rollback',
  'night_call',
  'gray_heaviness',
  'sweet_whisper',
];

export const COMPANION_IDS: CompanionId[] = [
  'golden_chinchilla_cat',
  'alabai',
  'raven',
  'fox_cub',
];
