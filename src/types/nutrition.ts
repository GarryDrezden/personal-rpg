export type NutritionTrackingMode = 'disabled' | 'simple' | 'precise';

export type NutritionLevel = 'light' | 'medium' | 'heavy';

export type NutritionStatus =
  | 'disabled'
  | 'missing'
  | 'light'
  | 'medium'
  | 'heavy'
  | 'precise_in_limit'
  | 'precise_medium_over'
  | 'precise_heavy_over';

export type NutritionSettings = {
  trackingMode: NutritionTrackingMode;
  dailyCalorieLimit: number | null;
  mediumOverThreshold: number;
  heavyOverThreshold: number;
};
