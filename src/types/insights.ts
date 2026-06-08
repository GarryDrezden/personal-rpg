export type InsightType =
  | 'positive'
  | 'warning'
  | 'neutral'
  | 'suggestion';

export type Insight = {
  id: string;
  type: InsightType;
  title: string;
  description: string;
  metric?: string;
  value?: string | number;
};

export type InsightFilter = 'all' | 'positive' | 'warning' | 'suggestion';

export const INSIGHT_TYPE_LABELS: Record<InsightType, string> = {
  positive: 'Позитивный',
  warning: 'Замечание',
  neutral: 'Наблюдение',
  suggestion: 'Совет',
};
