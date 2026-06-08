export type AlcoholStatus = 'none' | 'moderate' | 'heavy';

export interface DailyEntry {
  id: string;
  date: string;
  calories: number | null;
  steps: number | null;
  alcohol: AlcoholStatus | null;
  morningExercise: boolean;
  gym: boolean;
  journal: boolean;
  cooking: boolean;
  repair: boolean;
  plants: boolean;
  hobby: boolean;
  comment: string;
  /** Выполнение пользовательских целей: questId → done */
  customCompletions?: Record<string, boolean>;
}

export interface MeasurementEntry {
  id: string;
  date: string;
  weight: number | null;
  chest: number | null;
  waist: number | null;
  belly: number | null;
  hips: number | null;
  thigh: number | null;
  biceps: number | null;
  comment: string;
}

export interface WeeklySettings {
  id: string;
  weekStart: string;
  caloriesLimit: number;
  stepsGoal: number;
  gymTarget: number;
  weeklyPointsGoal: number;
}

export type CoinSettings = {
  goodDayCoins: number;
  greatDayCoins: number;
  heroDayBonusCoins: number;
  ironDayBonusCoins: number;
  week80Coins: number;
  week100Coins: number;
  noAlcoholWeekCoins: number;
  gymWeekCoins: number;
  caloriesWeekCoins: number;
  perfectBaseWeekCoins: number;
  measurementsMondayCoins: number;
  minimalDayCoins: number;
};

export interface PointSettings {
  caloriesOk: number;
  stepsOk: number;
  noAlcohol: number;
  alcoholModerate: number;
  alcoholHeavy: number;
  morningExercise: number;
  gym: number;
  journal: number;
  cooking: number;
  repair: number;
  plants: number;
  hobby: number;
  gymWeeklyBonus: number;
  noAlcoholWeekBonus: number;
  caloriesWeekBonus: number;
  measurementsMondayBonus: number;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  cost: number;
  category: string;
  purchasedAt: string | null;
  hidden: boolean;
  moneyGoal: number | null;
}

export interface BankDeposit {
  id: string;
  amount: number;
  date: string;
  comment: string;
}

export type CharacterGender = 'male' | 'female';

import type { AvatarSettings } from './avatar';
import type { AppThemeId } from './theme';
import type { HabitConfig } from './habits';

export type { AvatarSettings } from './avatar';
export type { AppThemeId } from './theme';
export type { HabitConfig, CustomHabitDefinition, BuiltinHabitId, HabitCardColorId } from './habits';

export interface AppSettings {
  defaultCaloriesLimit: number;
  defaultStepsGoal: number;
  defaultGymTarget: number;
  defaultWeeklyPointsGoal: number;
  /** Целевой вес (кг) — конец пути персонажа */
  weightGoal: number;
  pointSettings: PointSettings;
  coinSettings?: CoinSettings;
  weeklySettings: WeeklySettings[];
  gender: CharacterGender;
  avatarSettings?: AvatarSettings;
  themeId?: AppThemeId;
  habitConfig?: HabitConfig;
}

export interface AppData {
  dailyEntries: DailyEntry[];
  measurements: MeasurementEntry[];
  rewards: Reward[];
  bankDeposits: BankDeposit[];
  settings: AppSettings;
}

export type DayStatusLabel =
  | 'День выживания'
  | 'Нормально'
  | 'Хороший день'
  | 'Отличный день';

export type WeekStatusLabel =
  | 'Слабая неделя'
  | 'Нормальная неделя'
  | 'Хорошая неделя'
  | 'Сильная неделя';
