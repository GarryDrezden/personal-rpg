/** Asset Registry 2.0 — shared types (docs/assets/manifest.json) */

export const ASSET_REGISTRY_CATEGORIES = [
  'hero',
  'femaleHero',
  'bodyStages',
  'journeyChapters',
  'companions',
  'dailyMobs',
  'seasonBosses',
  'chapterBosses',
  'actBosses',
  'campBase',
  'bodyAbilities',
  'seasonRewards',
  'plateauArtifacts',
  'achievementBadges',
  'onboardingArt',
  'emptyStates',
  'uiIcons',
] as const;

export type AssetRegistryCategory = (typeof ASSET_REGISTRY_CATEGORIES)[number];

export const ASSET_LIFECYCLE_STATUSES = [
  'idea',
  'needed',
  'prompt-ready',
  'generated',
  'processed',
  'in-app',
  'needs-redesign',
  'done',
] as const;

export type AssetLifecycleStatus = (typeof ASSET_LIFECYCLE_STATUSES)[number];

export const ASSET_PRIORITIES = ['P0', 'P1', 'P2', 'P3'] as const;

export type AssetPriority = (typeof ASSET_PRIORITIES)[number];

export const ASSET_TRACKING_STATUSES = [
  'missing',
  'planned',
  'ready',
  'registered',
] as const;

export type AssetTrackingStatus = (typeof ASSET_TRACKING_STATUSES)[number];

export type AssetManifestEntry = {
  id: string;
  type: string;
  category: AssetRegistryCategory;
  title: string;
  status: AssetLifecycleStatus;
  priority: AssetPriority;
  path?: string;
  usedIn: string[];
  relatedEntityId?: string;
  promptStatus: AssetTrackingStatus;
  fileStatus: AssetTrackingStatus;
  manifestStatus: AssetTrackingStatus;
  notes: string;
  /** v1 gallery fields — optional for backward compatibility */
  theme?: string;
  gender?: string;
  stage?: number;
  source?: string;
  date?: string;
  legacyStatus?: string;
  targetPath?: string;
};

export type AssetManifestV2 = {
  version: number;
  schema: string;
  updated: string;
  gameAssetVersion: string;
  conventions: {
    naming: string;
    preferredFormat: string;
    placeholderStrategy: string;
    promptPathPattern: string;
  };
  categories: AssetRegistryCategory[];
  statuses: AssetLifecycleStatus[];
  priorities: AssetPriority[];
  assets: AssetManifestEntry[];
};
