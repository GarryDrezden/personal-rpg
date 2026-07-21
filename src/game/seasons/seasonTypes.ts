export type SeasonQuestType =
  | 'daysWithNutritionTracking'
  | 'daysWithStepsAtLeast'
  | 'alcoholFreeDays'
  | 'daysWithResourceMarked'
  | 'minimalDaysHeld'
  | 'recoveryDays'
  | 'daysWithJournal'
  | 'daysWithMovement'
  | 'daysSaved';

export type SeasonQuestDef = {
  id: string;
  type: SeasonQuestType;
  target: number;
  label: string;
  stepsMin?: number;
};

export type SeasonPartialStatus = 'started' | 'marked' | 'held' | 'cleared' | 'empowered';

export type SeasonConfig = {
  id: string;
  actId: 'I' | 'II' | 'III' | 'I→II' | 'II→III';
  index: number;
  title: string;
  shortTitle: string;
  focus: string;
  description: string;
  miniBossName: string;
  miniBossHint: string;
  rewardName: string;
  quests: SeasonQuestDef[];
};

export type SeasonQuestProgress = SeasonQuestDef & {
  current: number;
  completed: boolean;
};

export type SeasonSnapshot = {
  config: SeasonConfig;
  seasonIndex: number;
  dayNumber: number;
  seasonLength: number;
  seasonStartDate: string;
  seasonEndDate: string;
  campaignStartDate: string;
  timeProgressPercent: number;
  quests: SeasonQuestProgress[];
  completedQuestCount: number;
  partialStatus: SeasonPartialStatus;
  partialStatusLabel: string;
  questsNearCompletion: number;
};

/** Soft reward state for Seasons v2 chronicle (narrative only). */
export type SeasonRewardStatus = 'fog' | 'preview' | 'awaiting' | 'earned';

export type SeasonHistoryEntry = {
  seasonIndex: number;
  config: SeasonConfig;
  seasonStartDate: string;
  seasonEndDate: string;
  completedQuestCount: number;
  questTotal: number;
  partialStatus: SeasonPartialStatus;
  partialStatusLabel: string;
  recapText: string;
  rewardStatus: SeasonRewardStatus;
  rewardLabel: string;
  isCurrent: boolean;
  isLocked: boolean;
};

export type SeasonHistoryArchive = {
  currentSeasonIndex: number;
  entries: SeasonHistoryEntry[];
  earnedRewardCount: number;
};
