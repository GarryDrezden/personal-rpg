import type { AppSettings, DailyEntry } from '../types';
import type { DailyQuest, QuestStatus } from '../types/quests';
import { SKILL_XP_AWARDS } from '../constants/skills';
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
  const quests: DailyQuest[] = [];

  // --- Основные ---
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

  // --- Средние ---
  quests.push({
    id: 'morningExercise',
    title: 'Зарядка',
    description: 'Утренняя разминка',
    category: 'medium',
    status: entry?.morningExercise ? 'done' : 'neutral',
    icon: '☀️',
    points: p.morningExercise,
    skillXp: skillXp('body', SKILL_XP_AWARDS.morningExercise),
    actionLabel: 'Выполнено',
  });

  quests.push({
    id: 'journal',
    title: 'Дневник',
    description: 'Запись в дневник',
    category: 'medium',
    status: entry?.journal ? 'done' : 'neutral',
    icon: '✍️',
    points: p.journal,
    skillXp: skillXp('clarity', SKILL_XP_AWARDS.journal),
    actionLabel: 'Выполнено',
  });

  const gymDone = !!entry?.gym;
  quests.push({
    id: 'gym',
    title: 'Зал',
    description: `Недельный прогресс: ${gymCount}/${weekly.gymTarget}`,
    category: 'medium',
    status: gymDone ? 'done' : 'neutral',
    icon: '🏋️',
    points: p.gym,
    skillXp: skillXp('body', SKILL_XP_AWARDS.gym),
    actionLabel: 'Выполнено',
  });

  // --- Бонусные ---
  quests.push({
    id: 'cooking',
    title: 'Готовка',
    description: 'Приготовил еду',
    category: 'bonus',
    status: entry?.cooking ? 'done' : 'neutral',
    icon: '🍳',
    points: p.cooking,
    skillXp: skillXp('home', SKILL_XP_AWARDS.cooking),
    actionLabel: 'Выполнено',
  });

  quests.push({
    id: 'repair',
    title: 'Ремонт',
    description: 'Домашние дела',
    category: 'bonus',
    status: entry?.repair ? 'done' : 'neutral',
    icon: '🔧',
    points: p.repair,
    skillXp: skillXp('home', SKILL_XP_AWARDS.repair),
    actionLabel: 'Выполнено',
  });

  quests.push({
    id: 'plants',
    title: 'Цветы',
    description: 'Уход за растениями',
    category: 'bonus',
    status: entry?.plants ? 'done' : 'neutral',
    icon: '🌱',
    points: p.plants,
    skillXp: skillXp('green', SKILL_XP_AWARDS.plants),
    actionLabel: 'Выполнено',
  });

  quests.push({
    id: 'hobby',
    title: 'Хобби',
    description: 'Время для себя',
    category: 'bonus',
    status: entry?.hobby ? 'done' : 'neutral',
    icon: '✨',
    points: p.hobby,
    skillXp: skillXp('joy', SKILL_XP_AWARDS.hobby),
    actionLabel: 'Выполнено',
  });

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

export function isDayEmpty(entry: DailyEntry | undefined): boolean {
  if (!entry) return true;
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
    !entry.comment.trim()
  );
}
