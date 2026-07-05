import type { AppSettings, DailyEntry } from '../types';
import type { DailyQuest, QuestStatus } from '../types/quests';
import { BUILTIN_HABITS } from '../constants/builtinHabits';
import { SKILL_XP_AWARDS } from '../constants/skills';
import { resolveHabitConfig } from './habitConfig';
import { getWeeklySettingsForDate } from './points';
import { getDayMode, getStepsStatus } from './stepsEngine';
import { weekDays, weekStart } from './dates';
import {
  getEffectiveCalorieLimit,
  getNutritionPoints,
  getNutritionQuestCompleted,
  getNutritionStatus,
  getNutritionStatusLabel,
  getTrackingMode,
  isNutritionTrackingEnabled,
} from './nutritionEngine';
import { hasJournalEntry } from './journalEntry';

function getEntryForDate(
  date: string,
  dailyEntries: DailyEntry[],
): DailyEntry | undefined {
  return dailyEntries.find((e) => e.date === date);
}

function weekGymCount(date: string, dailyEntries: DailyEntry[]): number {
  const ws = weekStart(date);
  return weekDays(ws).filter((d) => dailyEntries.find((e) => e.date === d)?.gym).length;
}

function skillXp(skillId: string, amount: number) {
  return [{ skillId, amount }];
}

function getCustomCompletions(entry: DailyEntry | undefined): Record<string, boolean> {
  return entry?.customCompletions ?? {};
}

export function getDailyQuests(params: {
  date: string;
  dailyEntries: DailyEntry[];
  settings: AppSettings;
}): DailyQuest[] {
  const { date, dailyEntries, settings } = params;
  const entry = getEntryForDate(date, dailyEntries);
  const weekly = getWeeklySettingsForDate(date, settings);
  const p = settings.pointSettings;
  const gymCount = weekGymCount(date, dailyEntries);
  const habitConfig = resolveHabitConfig(settings);
  const customCompletions = getCustomCompletions(entry);
  const quests: DailyQuest[] = [];

  if (isNutritionTrackingEnabled(settings)) {
    const mode = getTrackingMode(settings);
    const nutritionStatus = getNutritionStatus({ entry, settings });
    let nutritionQuestStatus: QuestStatus = 'pending';

    if (getNutritionQuestCompleted({ entry, settings })) {
      if (
        nutritionStatus === 'medium' ||
        nutritionStatus === 'precise_medium_over'
      ) {
        nutritionQuestStatus = 'partial';
      } else {
        nutritionQuestStatus = 'done';
      }
    }

    const limit = getEffectiveCalorieLimit(settings, date);
    quests.push({
      id: 'nutrition',
      title: mode === 'precise' ? 'Калории внесены' : 'Питание отмечено',
      description:
        mode === 'precise'
          ? limit
            ? `Лимит ${limit} ккал · ${getNutritionStatusLabel(nutritionStatus)}`
            : 'Задай лимит в настройках'
          : 'Отметь питание без точных цифр. Честность важнее идеальности.',
      category: 'main',
      status: nutritionQuestStatus,
      icon: '🍽️',
      points: getNutritionPoints({ entry, settings }),
      skillXp: skillXp('control', SKILL_XP_AWARDS.caloriesLogged),
      actionLabel: mode === 'precise' ? 'Внести калории' : 'Отметить питание',
    });
  }

  let stepsStatus: QuestStatus = 'pending';
  const dayMode = getDayMode(entry?.dayMode);
  const stepsInfo = getStepsStatus({
    steps: entry?.steps,
    settings,
    date,
    dayMode,
  });

  if (entry?.steps !== null && entry?.steps !== undefined) {
    if (stepsInfo.status === 'excellent' || stepsInfo.status === 'normal') {
      stepsStatus = 'done';
    } else if (stepsInfo.status === 'minimum') {
      stepsStatus = 'partial';
    } else if (stepsInfo.status === 'low') {
      stepsStatus = 'partial';
    }
  }

  const stepsDescription =
    dayMode !== 'normal'
      ? `${stepsInfo.description || stepsInfo.title} · облегчённый порог`
      : stepsInfo.stepsToNextTarget && stepsInfo.stepsToNextTarget > 0
        ? `${stepsInfo.title}. До ${stepsInfo.nextTargetLabel} осталось ${stepsInfo.stepsToNextTarget.toLocaleString('ru')}.`
        : stepsInfo.description || stepsInfo.title;

  const stepsSkillXp =
    stepsInfo.status === 'excellent'
      ? SKILL_XP_AWARDS.stepsExcellent
      : stepsInfo.status === 'normal'
        ? SKILL_XP_AWARDS.stepsNormal
        : stepsInfo.status === 'minimum'
          ? SKILL_XP_AWARDS.stepsMinimum
          : 0;

  quests.push({
    id: 'steps',
    title: 'Шаги',
    description: stepsDescription,
    category: 'main',
    status: stepsStatus,
    icon: '👟',
    points: stepsInfo.points,
    skillXp: stepsSkillXp > 0 ? skillXp('body', stepsSkillXp) : undefined,
    actionLabel: 'Внести шаги',
    stepsInfo,
  });

  let alcoholStatus: QuestStatus = 'pending';
  if (entry?.alcohol === 'none') alcoholStatus = 'done';
  else if (entry?.alcohol === 'moderate' || entry?.alcohol === 'heavy') {
    alcoholStatus = 'failed';
  }

  quests.push({
    id: 'alcohol',
    title: 'День без алкоголя',
    description: 'Трезвый день',
    category: 'main',
    status: alcoholStatus,
    icon: '💧',
    points: p.noAlcohol,
    skillXp: skillXp('clarity', SKILL_XP_AWARDS.noAlcohol),
    actionLabel: 'Отметить',
  });

  for (const habit of BUILTIN_HABITS) {
    if (habitConfig.hiddenBuiltinIds.includes(habit.id)) continue;

    const override = habitConfig.builtinOverrides[habit.id];
    const completed =
      habit.id === 'journal' ? hasJournalEntry(entry) : !!entry?.[habit.id as keyof DailyEntry];
    const description =
      habit.id === 'gym'
        ? `Недельный прогресс: ${gymCount}/${weekly.gymTarget}`
        : habit.id === 'journal'
          ? 'Отметка или строка в «Заметки / дневник дня»'
          : (override?.description ?? habit.description);

    quests.push({
      id: habit.id,
      title: override?.title ?? habit.title,
      description,
      category: habit.category,
      status: completed ? 'done' : 'neutral',
      icon: override?.icon ?? habit.icon,
      points: override?.points ?? p[habit.pointKey],
      cardColor: override?.cardColor ?? habit.cardColor,
      skillXp:
        habit.skillId && habit.skillXpAmount
          ? skillXp(habit.skillId, habit.skillXpAmount)
          : undefined,
      actionLabel: 'Выполнено',
    });
  }

  for (const custom of habitConfig.customHabits) {
    const completed = !!customCompletions[custom.id];
    quests.push({
      id: custom.id,
      title: custom.title,
      description: custom.description,
      category: custom.category,
      status: completed ? 'done' : 'neutral',
      icon: custom.icon,
      points: custom.points,
      cardColor: custom.cardColor,
      isCustom: true,
      actionLabel: 'Выполнено',
    });
  }

  return quests;
}

export function getQuestCompletionStats(quests: DailyQuest[]) {
  const total = quests.length;
  const done = quests.filter((q) => q.status === 'done').length;
  const mainQuests = quests.filter((q) => q.category === 'main');
  const mainTotal = mainQuests.length;
  const mainDone = mainQuests.filter((q) => q.status === 'done').length;
  const percent = total > 0 ? Math.round((done / total) * 100) : 0;

  return { total, done, mainTotal, mainDone, percent };
}

export function isDayEmpty(entry: DailyEntry | undefined, settings?: AppSettings): boolean {
  if (!entry) return true;

  const hasCustom =
    settings &&
    Object.values(entry.customCompletions ?? {}).some(Boolean);

  return (
    entry.calories === null &&
    entry.nutritionLevel == null &&
    entry.steps === null &&
    entry.alcohol === null &&
    !entry.morningExercise &&
    !entry.gym &&
    !hasJournalEntry(entry) &&
    !entry.cooking &&
    !entry.repair &&
    !entry.plants &&
    !entry.hobby &&
    !hasCustom
  );
}
