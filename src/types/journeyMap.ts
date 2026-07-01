import type { AppThemeId } from './theme';

export type JourneyStageStatus = 'locked' | 'current' | 'completed';

export type JourneyStageThemeText = {
  title: string;
  description: string;
  completedText: string;
};

export type JourneyStageConditionType =
  | 'weight_entry'
  | 'calorie_tracking_days'
  | 'calorie_limit_days'
  | 'weight_loss_kg'
  | 'waist_loss_cm'
  | 'steps_days_minimum'
  | 'steps_days_normal'
  | 'steps_days_excellent'
  | 'steps_total'
  | 'no_alcohol_days'
  | 'gym_total'
  | 'recovery_days'
  | 'minimal_days'
  | 'body_abilities_unlocked'
  | 'return_after_bad_day'
  | 'rest_marker_days'
  | 'rest_recovery_days'
  | 'cognitive_break_days';

export type JourneyStageCondition = {
  id: string;
  type: JourneyStageConditionType;
  target: number;
  title: string;
  description?: string;
};

export type JourneyStage = {
  id: string;
  order: number;
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  completedText: string;
  conditions: JourneyStageCondition[];
  cozyText?: JourneyStageThemeText;
  darkFantasyText?: JourneyStageThemeText;
};

export type JourneyStageConditionProgress = {
  condition: JourneyStageCondition;
  current: number;
  target: number;
  completed: boolean;
  progressPercent: number;
};

export type JourneyStageProgress = {
  stage: JourneyStage;
  status: JourneyStageStatus;
  completedConditions: number;
  totalConditions: number;
  progressPercent: number;
  conditions: JourneyStageConditionProgress[];
};

export type JourneyMapSummary = {
  currentStage: JourneyStageProgress | null;
  nextStage: JourneyStageProgress | null;
  completedStages: number;
  totalStages: number;
  overallProgressPercent: number;
};

export type ResolvedJourneyStageText = {
  title: string;
  subtitle: string;
  description: string;
  completedText: string;
};

export function resolveJourneyStageText(
  stage: JourneyStage,
  themeId: AppThemeId = 'cozy',
): ResolvedJourneyStageText {
  const theme = themeId === 'darkFantasy' ? stage.darkFantasyText : stage.cozyText;

  if (theme) {
    return {
      title: theme.title,
      subtitle: stage.subtitle,
      description: theme.description,
      completedText: theme.completedText,
    };
  }

  return {
    title: stage.title,
    subtitle: stage.subtitle,
    description: stage.description,
    completedText: stage.completedText,
  };
}
