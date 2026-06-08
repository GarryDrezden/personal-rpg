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
};

export const QUEST_STATUS_LABELS: Record<QuestStatus, string> = {
  done: 'Выполнено',
  failed: 'Провалено',
  pending: 'Ждёт данных',
  neutral: 'Необязательно',
  partial: 'В процессе',
};
