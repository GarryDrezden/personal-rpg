export type WeeklyBossStatus =
  | 'not_started'
  | 'in_progress'
  | 'wounded'
  | 'defeated'
  | 'perfect';

export type WeeklyBossConditionId =
  | 'weekly_points'
  | 'calories_days'
  | 'steps_days'
  | 'no_alcohol_days'
  | 'gym_target';

export type WeeklyBossCondition = {
  id: WeeklyBossConditionId;
  title: string;
  description: string;
  current: number;
  target: number;
  completed: boolean;
  icon: string;
};

import type { BossTemplateId } from '../constants/bosses';

export type WeeklyBoss = {
  id: string;
  weekStart: string;
  templateId: BossTemplateId;
  title: string;
  subtitle: string;
  description: string;
  avatarEmoji: string;
  imagePath: string;
  accent: string;
  status: WeeklyBossStatus;
  hpPercent: number;
  conditions: WeeklyBossCondition[];
  rewardXp: number;
  rewardCoins: number;
};

export const BOSS_STATUS_LABELS: Record<WeeklyBossStatus, string> = {
  not_started: 'Босс ждёт',
  in_progress: 'В бою',
  wounded: 'Босс ранен',
  defeated: 'Босс повержен!',
  perfect: 'Идеальная победа!',
};
