export type FreedomScoreLevelId =
  | 'awakening'
  | 'first_relief'
  | 'movement_return'
  | 'stable_base'
  | 'new_form'
  | 'rebirth';

export type FreedomScoreLevel = {
  id: FreedomScoreLevelId;
  min: number;
  max: number;
  title: string;
  description: string;
  icon: string;
};

export type FreedomScoreBreakdownItem = {
  id: string;
  title: string;
  description: string;
  value: number;
  maxValue: number;
  points: number;
  maxPoints: number;
};

export type FreedomScoreResult = {
  score: number;
  level: FreedomScoreLevel;
  title: string;
  description: string;
  breakdown: FreedomScoreBreakdownItem[];
};
