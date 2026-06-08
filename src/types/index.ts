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

export interface AppSettings {
  defaultCaloriesLimit: number;
  defaultStepsGoal: number;
  defaultGymTarget: number;
  defaultWeeklyPointsGoal: number;
  /** Целевой вес (кг) — конец пути персонажа */
  weightGoal: number;
  pointSettings: PointSettings;
  weeklySettings: WeeklySettings[];
  gender: CharacterGender;
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
