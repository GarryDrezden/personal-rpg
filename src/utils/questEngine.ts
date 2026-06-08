import type { AppSettings, DailyEntry } from '../types';
import type { DailyQuest, QuestStatus } from '../types/quests';
import { BUILTIN_HABITS } from '../constants/builtinHabits';
import { SKILL_XP_AWARDS } from '../constants/skills';
import { resolveHabitConfig } from './habitConfig';
import { getWeeklySettingsForDate } from './points';
import { weekDays, weekStart } from './dates';

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

  let caloriesStatus: QuestStatus = 'pending';
  if (entry?.calories !== null && entry?.calories !== undefined) {
    caloriesStatus =
      entry.calories <= weekly.caloriesLimit ? 'done' : 'failed';
  }

  quests.push({
    id: 'calories',
    title: 'Калории в лимите',
    description: `Лимит ${weekly.caloriesLimit} ккал`,
    category: 'main',
    status: caloriesStatus,
    icon: '🍽️',
    points: p.caloriesOk,
    skillXp: skillXp('control', SKILL_XP_AWARDS.caloriesLogged + SKILL_XP_AWARDS.caloriesOk),
    actionLabel: 'Внести калории',
  });

  let stepsStatus: QuestStatus = 'pending';
  if (entry?.steps !== null && entry?.steps !== undefined) {
    stepsStatus =
      entry.steps >= weekly.stepsGoal
        ? 'done'
        : entry.steps > 0
          ? 'partial'
          : 'pending';
  }

  quests.push({
    id: 'steps',
    title: 'Шаги выполнены',
    description: `Цель ${weekly.stepsGoal.toLocaleString('ru')} шагов`,
    category: 'main',
    status: stepsStatus,
    icon: '👟',
    points: p.stepsOk,
    skillXp: skillXp('body', SKILL_XP_AWARDS.stepsGoal),
    actionLabel: 'Внести шаги',
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
    const completed = !!entry?.[habit.id];
    const description =
      habit.id === 'gym'
        ? `Недельный прогресс: ${gymCount}/${weekly.gymTarget}`
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
    entry.steps === null &&
    entry.alcohol === null &&
    !entry.morningExercise &&
    !entry.gym &&
    !entry.journal &&
    !entry.cooking &&
    !entry.repair &&
    !entry.plants &&
    !entry.hobby &&
    !hasCustom &&
    !entry.comment.trim()
  );
}
