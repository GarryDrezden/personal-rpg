import type { QuestCategory } from './quests';

export type BuiltinHabitId =
  | 'morningExercise'
  | 'journal'
  | 'gym'
  | 'cooking'
  | 'repair'
  | 'plants'
  | 'hobby';

export type SecondaryQuestCategory = 'medium' | 'bonus';

export type HabitCardColorId =
  | 'default'
  | 'primary'
  | 'success'
  | 'secondary'
  | 'warning'
  | 'danger'
  | 'violet'
  | 'teal';

export type BuiltinHabitOverride = {
  title?: string;
  description?: string;
  icon?: string;
  cardColor?: HabitCardColorId;
  points?: number;
};

export type CustomHabitDefinition = {
  id: string;
  title: string;
  description: string;
  category: SecondaryQuestCategory;
  icon: string;
  cardColor: HabitCardColorId;
  points: number;
};

export type HabitConfig = {
  hiddenBuiltinIds: BuiltinHabitId[];
  builtinOverrides: Partial<Record<BuiltinHabitId, BuiltinHabitOverride>>;
  customHabits: CustomHabitDefinition[];
};

export type BuiltinHabitTemplate = {
  id: BuiltinHabitId;
  title: string;
  description: string;
  category: SecondaryQuestCategory;
  icon: string;
  cardColor: HabitCardColorId;
  pointKey: keyof import('./index').PointSettings;
  skillId?: string;
  skillXpAmount?: number;
};

export function isSecondaryCategory(c: QuestCategory): c is SecondaryQuestCategory {
  return c === 'medium' || c === 'bonus';
}
