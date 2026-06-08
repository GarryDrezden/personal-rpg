export type AchievementCategory =
  | 'start'
  | 'weight'
  | 'measurements'
  | 'calories'
  | 'steps'
  | 'alcohol'
  | 'training'
  | 'journal'
  | 'life'
  | 'combo'
  | 'xp';

export type AchievementTier =
  | 'bronze'
  | 'silver'
  | 'gold'
  | 'epic'
  | 'legendary';

export type AchievementConditionType =
  | 'instant'
  | 'total'
  | 'streak'
  | 'milestone'
  | 'combo'
  | 'weekly'
  | 'monthly';

export type Achievement = {
  id: string;
  title: string;
  description: string;
  category: AchievementCategory;
  tier: AchievementTier;
  iconKey: string;
  conditionType: AchievementConditionType;
  target?: number;
  hidden?: boolean;
};

export type UnlockedAchievement = {
  achievementId: string;
  unlockedAt: string;
};

export type AchievementProgress = {
  achievementId: string;
  current: number;
  target: number;
  completed: boolean;
  percent: number;
};
