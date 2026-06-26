export type WeeklyStoryType =
  | 'breakthrough_week'
  | 'holding_week'
  | 'recovery_week'
  | 'clarity_week'
  | 'movement_week'
  | 'chaos_week'
  | 'empty_week';

export type WeeklyStoryReport = {
  weekStart: string;
  type: WeeklyStoryType;
  title: string;
  subtitle: string;
  summary: string;
  highlights: string[];
  gains: {
    label: string;
    value: number;
    icon: string;
  }[];
  nextFocus: string;
  momentumDelta?: number;
  averageMomentum?: number;
  momentumSummaryText?: string;
};
