import type { AppThemeId } from './theme';

export type BodyAbilityBranch =
  | 'lightness'
  | 'endurance'
  | 'control'
  | 'clarity'
  | 'recovery'
  | 'strength';

export type BodyAbilityTier = 'common' | 'rare' | 'epic' | 'legendary';

export type BodyAbilityConditionType =
  | 'weight_loss_kg'
  | 'waist_loss_cm'
  | 'steps_total'
  | 'steps_days_minimum'
  | 'steps_days_normal'
  | 'steps_days_excellent'
  | 'calorie_tracking_days'
  | 'calorie_limit_days'
  | 'no_alcohol_days'
  | 'gym_total'
  | 'recovery_days'
  | 'minimal_days'
  | 'return_after_bad_day';

export type BodyAbilityThemeText = {
  title: string;
  description: string;
  unlockText: string;
};

export type BodyAbility = {
  id: string;
  branch: BodyAbilityBranch;
  tier: BodyAbilityTier;
  conditionType: BodyAbilityConditionType;
  target: number;
  icon: string;
  title: string;
  description: string;
  unlockText: string;
  cozyText?: BodyAbilityThemeText;
  darkFantasyText?: BodyAbilityThemeText;
  effectLabel?: string;
};

export type BodyAbilityProgress = {
  ability: BodyAbility;
  current: number;
  target: number;
  progressPercent: number;
  unlocked: boolean;
};

export type BodyAbilityBranchSummary = {
  branch: BodyAbilityBranch;
  title: string;
  description: string;
  icon: string;
  unlockedCount: number;
  totalCount: number;
  progressPercent: number;
};

export type ResolvedBodyAbilityText = {
  title: string;
  description: string;
  unlockText: string;
  unlockHeading: string;
};

export function resolveBodyAbilityText(
  ability: BodyAbility,
  themeId: AppThemeId = 'cozy',
): ResolvedBodyAbilityText {
  const theme = themeId === 'darkFantasy' ? ability.darkFantasyText : ability.cozyText;
  const unlockHeading =
    themeId === 'darkFantasy' && ability.darkFantasyText
      ? 'Способность пробудилась'
      : 'Открыта способность';

  if (theme) {
    return {
      title: theme.title,
      description: theme.description,
      unlockText: theme.unlockText,
      unlockHeading,
    };
  }

  return {
    title: ability.title,
    description: ability.description,
    unlockText: ability.unlockText,
    unlockHeading: themeId === 'darkFantasy' ? 'Печать снята' : 'Открыта способность',
  };
}
