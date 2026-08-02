import type { AppSettings, DailyEntry } from '../types';
import type { DailyQuest, QuestStatus } from '../types/quests';
import type { AppThemeId } from '../types/theme';
import { BUILTIN_HABITS } from '../constants/builtinHabits';
import { SKILL_XP_AWARDS } from '../constants/skills';
import { getThemedQuestCopy } from '../constants/themeContentRegistry';
import { resolveHabitConfig } from './habitConfig';
import { getWeeklySettingsForDate } from './points';
import { getDayMode, getStepsStatus } from './stepsEngine';
import {
  formatPhysicalActivitySummary,
  getMovementCredit,
} from './movementCreditEngine';
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
  themeId?: AppThemeId;
}): DailyQuest[] {
  const { date, dailyEntries, settings } = params;
  const themeId = params.themeId ?? settings.themeId ?? 'cozy';
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
    const nutritionCopy = getThemedQuestCopy(
      themeId,
      'nutrition',
      {
        title: mode === 'precise' ? 'Калории внесены' : 'Питание отмечено',
        actionLabel: mode === 'precise' ? 'Внести калории' : 'Отметить питание',
      },
      { nutritionMode: mode === 'precise' ? 'precise' : 'simple' },
    );
    quests.push({
      id: 'nutrition',
      title: nutritionCopy.title,
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
      actionLabel: nutritionCopy.actionLabel ?? 'Отметить питание',
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

  const movement = entry ? getMovementCredit(entry, settings) : null;
  const paSummary = entry ? formatPhysicalActivitySummary(entry) : null;

  let stepsDescription =
    dayMode !== 'normal'
      ? `${stepsInfo.description || stepsInfo.title} · облегчённый порог`
      : stepsInfo.stepsToNextTarget && stepsInfo.stepsToNextTarget > 0
        ? `${stepsInfo.title}. До ${stepsInfo.nextTargetLabel} осталось ${stepsInfo.stepsToNextTarget.toLocaleString('ru')}.`
        : stepsInfo.description || stepsInfo.title;

  if (
    movement?.holdsMinimumMovement &&
    movement.sources.includes('physical_activity') &&
    stepsStatus !== 'done'
  ) {
    const stepsPart =
      entry?.steps != null
        ? `Шаги: ${entry.steps.toLocaleString('ru')} · шаговый квест отдельно`
        : 'Шаговый квест отдельно';
    stepsDescription = `Движение дня удержано через физическую активность. ${stepsPart}${
      paSummary ? `. ${paSummary}` : ''
    }`;
  }

  const stepsSkillXp =
    stepsInfo.status === 'excellent'
      ? SKILL_XP_AWARDS.stepsExcellent
      : stepsInfo.status === 'normal'
        ? SKILL_XP_AWARDS.stepsNormal
        : stepsInfo.status === 'minimum'
          ? SKILL_XP_AWARDS.stepsMinimum
          : 0;

  const stepsCopy = getThemedQuestCopy(themeId, 'steps', {
    title: 'Шаги',
    actionLabel: 'Внести шаги',
  });
  quests.push({
    id: 'steps',
    title: stepsCopy.title,
    description: stepsDescription,
    category: 'main',
    status: stepsStatus,
    icon: '👟',
    points: stepsInfo.points,
    skillXp: stepsSkillXp > 0 ? skillXp('body', stepsSkillXp) : undefined,
    actionLabel: stepsCopy.actionLabel ?? 'Внести шаги',
    stepsInfo,
  });

  let alcoholStatus: QuestStatus = 'pending';
  if (entry?.alcohol === 'none') alcoholStatus = 'done';
  else if (entry?.alcohol === 'moderate' || entry?.alcohol === 'heavy') {
    alcoholStatus = 'failed';
  }

  const alcoholCopy = getThemedQuestCopy(themeId, 'alcohol', {
    title: 'День без алкоголя',
    actionLabel: 'Отметить',
  });
  quests.push({
    id: 'alcohol',
    title: alcoholCopy.title,
    description: themeId === 'cozy' ? 'Ясный вечер без алкоголя' : 'Трезвый день',
    category: 'main',
    status: alcoholStatus,
    icon: '💧',
    points: p.noAlcohol,
    skillXp: skillXp('clarity', SKILL_XP_AWARDS.noAlcohol),
    actionLabel: alcoholCopy.actionLabel ?? 'Отметить',
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
          ? themeId === 'cozy'
            ? 'Отметка или строка в дневнике дома'
            : 'Отметка или строка в «Заметки / дневник дня»'
          : (override?.description ?? habit.description);

    const habitTitle = override?.title ?? habit.title;
    const habitCopy = override?.title
      ? { title: habitTitle, actionLabel: 'Выполнено' as const }
      : getThemedQuestCopy(themeId, habit.id, {
          title: habitTitle,
          actionLabel: 'Выполнено',
        });

    quests.push({
      id: habit.id,
      title: habitCopy.title,
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
      actionLabel: habitCopy.actionLabel ?? 'Выполнено',
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
    entry.physicalActivityLevel !== 'light' &&
    entry.physicalActivityLevel !== 'medium' &&
    entry.physicalActivityLevel !== 'heavy' &&
    !hasCustom
  );
}
