export type AlcoholStatus = 'none' | 'moderate' | 'heavy';

export type DayMode = 'normal' | 'recovery' | 'minimal';

export type EnergyLevel = 1 | 2 | 3 | 4 | 5;

export type SleepQuality = 'poor' | 'ok' | 'good';

export type CognitiveBreakLevel = 'none' | 'small' | 'good' | 'deep';

export type { NutritionLevel, NutritionStatus, NutritionTrackingMode } from './nutrition';

import type { NutritionLevel, NutritionTrackingMode } from './nutrition';

export interface DailyEntry {
  id: string;
  date: string;
  calories: number | null;
  /** Упрощённая отметка питания (simple mode) */
  nutritionLevel?: NutritionLevel | null;
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
  /** Режим дня: обычный / восстановление / минимальный */
  dayMode?: DayMode;
  /** Ресурс дня: 5 — полный, 1 — восстановление */
  energyLevel?: EnergyLevel | null;
  /** Качество сна (legacy 1–5 нормализуется при чтении) */
  sleepQuality?: SleepQuality | 1 | 2 | 3 | 4 | 5 | null;
  /** Когнитивная разгрузка / перерыв для головы */
  cognitiveBreaks?: CognitiveBreakLevel | null;
  /** Опционально — часы сна (расширенный учёт) */
  sleepHours?: number | null;
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
  /** @deprecated legacy — используйте stepsNormal */
  stepsGoal: number;
  stepsMinimum?: number;
  stepsNormal?: number;
  stepsExcellent?: number;
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
  /** @deprecated legacy — используйте defaultStepsNormal */
  defaultStepsGoal: number;
  defaultStepsMinimum?: number;
  defaultStepsNormal?: number;
  defaultStepsExcellent?: number;
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
  /** Экспериментально: показывать поля сна на TodayPage */
  enableSleepTracking?: boolean;
  /** Пол героя в игровой системе (fallback: gender) */
  heroGender?: import('./gameAssets').HeroGender;
  transformationMode?: import('./gameAssets').TransformationMode;
  targetWeight?: number | null;
  activeCompanionId?: import('./gameAssets').CompanionId;
  /** Режим учёта питания */
  nutritionTrackingMode?: NutritionTrackingMode;
  /** Лимит калорий для precise mode */
  dailyCalorieLimit?: number | null;
  nutritionMediumOverThreshold?: number;
  nutritionHeavyOverThreshold?: number;
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
