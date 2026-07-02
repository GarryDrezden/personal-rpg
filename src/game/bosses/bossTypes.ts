export type BossLayer = 'dailyMob' | 'seasonMiniBoss' | 'chapterBoss' | 'actBoss';

export type BossProgressSource =
  | 'seasonQuests'
  | 'routeHeldDays'
  | 'minimalDays'
  | 'recoveryDays'
  | 'movementDays'
  | 'nutritionDays'
  | 'resourceDays'
  | 'alcoholFreeDays'
  | 'bodyAbilities'
  | 'plateauHolding'
  | 'campBase';

export type BossStatus = 'untouched' | 'noticed' | 'weakened' | 'broken' | 'sealed';

export type BossDef = {
  id: string;
  layer: BossLayer;
  seasonId?: number;
  chapterId?: number;
  actId?: 'I' | 'II' | 'III';
  title: string;
  shortTitle: string;
  description: string;
  weaknessText: string;
  strengthText: string;
  progressSources: BossProgressSource[];
  flavorLine: string;
  statusCopy: Record<BossStatus, string>;
  icon: string;
};

export type BossCampaignSnapshot = {
  currentBoss: BossDef;
  seasonIndex: number;
  bossProgressPercent: number;
  bossStatus: BossStatus;
  bossStatusLabel: string;
  weaknessSignals: string[];
  nextWeaknessHint: string;
  flavorLine: string;
  isWeakened: boolean;
  isDefeatedNarratively: boolean;
};
