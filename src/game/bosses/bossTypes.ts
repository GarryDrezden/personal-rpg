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

/** One row in Boss Campaign v2 archive (season or chapter). */
export type BossArchiveEntry = {
  boss: BossDef;
  progressPercent: number;
  status: BossStatus;
  statusLabel: string;
  isCurrent: boolean;
  isLocked: boolean;
  artUrl: string | null;
};

/** Act-level derived progress (Boss Campaign v2). */
export type ActBossProgressEntry = {
  boss: BossDef;
  progressPercent: number;
  status: BossStatus;
  statusLabel: string;
  seasonRange: [number, number];
  chapterRange: [number, number];
  sealedSeasonCount: number;
  seasonTotal: number;
  completedChapterCount: number;
  chapterTotal: number;
  isCurrentAct: boolean;
  isLocked: boolean;
};

export type BossCampaignArchive = {
  current: BossCampaignSnapshot;
  seasonBosses: BossArchiveEntry[];
  chapterBosses: BossArchiveEntry[];
  actBosses: ActBossProgressEntry[];
};
