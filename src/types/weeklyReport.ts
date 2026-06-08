export type WeeklyReportStatus =
  | 'weak'
  | 'normal'
  | 'good'
  | 'strong'
  | 'perfect';

export type WeeklyReport = {
  weekStart: string;
  weekEnd: string;
  status: WeeklyReportStatus;
  points: number;
  pointsGoal: number;
  pointsPercent: number;
  xpEarned: number;
  coinsEarned: number;
  caloriesInLimitDays: number;
  stepsGoalDays: number;
  noAlcoholDays: number;
  gymCount: number;
  gymTarget: number;
  totalSteps: number;
  averageSteps: number;
  bestDayDate?: string;
  bestDayPoints?: number;
  weightChange?: number;
  waistChange?: number;
  unlockedAchievementsCount: number;
  bestHabit: string;
  summary: string;
  advice: string;
};

export const WEEKLY_REPORT_STATUS_LABELS: Record<WeeklyReportStatus, string> = {
  weak: 'Тяжёлая неделя',
  normal: 'Нормальная неделя',
  good: 'Хорошая неделя',
  strong: 'Сильная неделя',
  perfect: 'Идеальная неделя',
};

export const WEEKLY_REPORT_SUMMARIES: Record<WeeklyReportStatus, string> = {
  weak: 'Неделя была тяжёлой, но данные — это уже контроль.',
  normal: 'Режим держится. Есть от чего оттолкнуться.',
  good: 'Хорошая неделя. База работает.',
  strong: 'Сильная неделя. Отличное движение.',
  perfect: 'Идеальная неделя. Это уровень героя.',
};
