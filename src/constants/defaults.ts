import type { AppSettings, PointSettings } from '../types';
import { DEFAULT_COIN_SETTINGS } from './coins';
import { DEFAULT_AVATAR_SETTINGS } from './avatar';
import { DEFAULT_STEPS_THRESHOLDS } from './steps';

export const DEFAULT_POINT_SETTINGS: PointSettings = {
  caloriesOk: 40,
  stepsOk: 35,
  noAlcohol: 35,
  alcoholModerate: -20,
  alcoholHeavy: -60,
  morningExercise: 20,
  gym: 25,
  journal: 20,
  cooking: 10,
  repair: 10,
  plants: 10,
  hobby: 10,
  gymWeeklyBonus: 50,
  noAlcoholWeekBonus: 70,
  caloriesWeekBonus: 70,
  measurementsMondayBonus: 30,
};

export const DEFAULT_WEIGHT_GOAL_KG = 100;

export const DEFAULT_APP_SETTINGS: AppSettings = {
  defaultCaloriesLimit: 2650,
  defaultStepsGoal: DEFAULT_STEPS_THRESHOLDS.normal,
  defaultStepsMinimum: DEFAULT_STEPS_THRESHOLDS.minimum,
  defaultStepsNormal: DEFAULT_STEPS_THRESHOLDS.normal,
  defaultStepsExcellent: DEFAULT_STEPS_THRESHOLDS.excellent,
  defaultGymTarget: 2,
  defaultWeeklyPointsGoal: 500,
  weightGoal: DEFAULT_WEIGHT_GOAL_KG,
  pointSettings: DEFAULT_POINT_SETTINGS,
  coinSettings: DEFAULT_COIN_SETTINGS,
  weeklySettings: [],
  gender: 'male',
  avatarSettings: DEFAULT_AVATAR_SETTINGS,
  themeId: 'cozy',
  enableSleepTracking: false,
  transformationMode: 'weight_loss',
  activeCompanionId: 'golden_chinchilla_cat',
  nutritionTrackingMode: 'simple',
  dailyCalorieLimit: null,
  nutritionMediumOverThreshold: 300,
  nutritionHeavyOverThreshold: 700,
};

export const DAY_STATUS_THRESHOLDS = [
  { min: 100, label: 'Отличный день' as const },
  { min: 70, label: 'Хороший день' as const },
  { min: 40, label: 'Нормально' as const },
  { min: 0, label: 'День выживания' as const },
];

export const WEEK_STATUS_THRESHOLDS = [
  { min: 100, label: 'Сильная неделя' as const },
  { min: 80, label: 'Хорошая неделя' as const },
  { min: 50, label: 'Нормальная неделя' as const },
  { min: 0, label: 'Слабая неделя' as const },
];

export const LEVEL_THRESHOLDS = [0, 500, 1200, 2200, 3500];
