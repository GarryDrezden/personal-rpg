export type QuestCategory =
  | 'main'
  | 'medium'
  | 'bonus'
  | 'weekly';

export type QuestStatus =
  | 'done'
  | 'failed'
  | 'pending'
  | 'neutral'
  | 'partial';

import type { HabitCardColorId } from './habits';
import type { StepsStatusInfo } from './steps';

export type DailyQuest = {
  id: string;
  title: string;
  description: string;
  category: QuestCategory;
  status: QuestStatus;
  icon: string;
  points: number;
  skillXp?: {
    skillId: string;
    amount: number;
  }[];
  coins?: number;
  actionLabel?: string;
  cardColor?: HabitCardColorId;
  isCustom?: boolean;
  stepsInfo?: StepsStatusInfo;
};

export const QUEST_STATUS_LABELS: Record<QuestStatus, string> = {
  done: 'Выполнено',
  failed: 'Провалено',
  pending: 'Ждёт данных',
  neutral: 'Необязательно',
  partial: 'В процессе',
};
