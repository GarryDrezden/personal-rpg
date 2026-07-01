export type MomentumLevelId =
  | 'lost_speed'
  | 'dip'
  | 'neutral'
  | 'stable'
  | 'boost'
  | 'flow';

export type MomentumLevel = {
  id: MomentumLevelId;
  min: number;
  max: number;
  title: string;
  description: string;
  icon: string;
  bonusDescription?: string;
  helpDescription?: string;
};

export type MomentumFactorSource =
  | 'steps'
  | 'calories'
  | 'alcohol'
  | 'recovery'
  | 'sleep'
  | 'tracking'
  | 'gym'
  | 'journal'
  | 'energy'
  | 'rest'
  | 'other';

export type MomentumDailyFactor = {
  id: string;
  title: string;
  value: number;
  type: 'positive' | 'negative' | 'neutral';
  description?: string;
  explanation?: string;
  source?: MomentumFactorSource;
};

export type MomentumDayResult = {
  date: string;
  startValue: number;
  decayValue: number;
  dailyDelta: number;
  endValue: number;
  level: MomentumLevel;
  factors: MomentumDailyFactor[];
};

export type MomentumSummary = {
  currentValue: number;
  currentLevel: MomentumLevel;
  todayDelta: number;
  todayFactors: MomentumDailyFactor[];
  weekDelta: number;
  weekAverage: number;
  bonusMultiplier: number;
  coinBonusAvailable: boolean;
  recoverySuggested: boolean;
  minimalModeSuggested: boolean;
};

export type MomentumHistoryRange = 7 | 14 | 30 | 90;

export type MomentumTrendPoint = {
  date: string;
  value: number;
  delta: number;
  levelId: MomentumLevelId;
};

export type MomentumTrendSummary = {
  range: MomentumHistoryRange;
  points: MomentumTrendPoint[];
  minValue: number;
  maxValue: number;
  averageValue: number;
  totalDelta: number;
};
