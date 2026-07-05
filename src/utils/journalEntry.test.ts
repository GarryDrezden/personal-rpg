import { describe, expect, it } from 'vitest';
import type { DailyEntry } from '../types';
import { ACHIEVEMENTS } from '../constants/achievements';
import { calcSkillXpFromDailyEntry } from './skillEngine';
import { calcDailyPoints } from './points';
import { getDailyQuests } from './questEngine';
import { getAchievementProgress } from './achievementEngine';
import { hasJournalEntry } from './journalEntry';
import { SKILL_XP_AWARDS } from '../constants/skills';

function day(partial: Partial<DailyEntry> & Pick<DailyEntry, 'date'>): DailyEntry {
  return {
    id: partial.id ?? '1',
    calories: null,
    steps: null,
    alcohol: null,
    morningExercise: false,
    gym: false,
    journal: false,
    cooking: false,
    repair: false,
    plants: false,
    hobby: false,
    comment: '',
    ...partial,
  };
}

const defaultSettings = {
  defaultCaloriesLimit: 2000,
  defaultStepsGoal: 11500,
  defaultStepsMinimum: 7000,
  defaultStepsNormal: 11500,
  defaultStepsExcellent: 14000,
  defaultGymTarget: 3,
  defaultWeeklyPointsGoal: 500,
  weeklySettings: [],
  pointSettings: {
    caloriesOk: 10,
    caloriesOver: -5,
    stepsMinimum: 5,
    stepsNormal: 10,
    stepsExcellent: 15,
    noAlcohol: 10,
    alcoholModerate: -5,
    alcoholHeavy: -10,
    morningExercise: 5,
    gym: 15,
    journal: 20,
    cooking: 5,
    repair: 5,
    plants: 5,
    hobby: 5,
  },
  nutritionTrackingMode: 'disabled' as const,
};

describe('hasJournalEntry', () => {
  it('returns false for empty notes and no journal flag', () => {
    expect(hasJournalEntry(day({ date: '2026-06-01' }))).toBe(false);
    expect(hasJournalEntry(null)).toBe(false);
  });

  it('returns false for whitespace-only notes', () => {
    expect(hasJournalEntry(day({ date: '2026-06-01', comment: '   \n\t  ' }))).toBe(false);
  });

  it('returns true for non-empty notes', () => {
    expect(hasJournalEntry(day({ date: '2026-06-01', comment: 'Один след дня' }))).toBe(true);
  });

  it('returns true when journal flag is set even without notes', () => {
    expect(hasJournalEntry(day({ date: '2026-06-01', journal: true }))).toBe(true);
  });
});

describe('journal entry integration', () => {
  it('counts notes for clarity skill XP once', () => {
    const entry = day({ date: '2026-06-01', comment: 'Короткая строка', journal: true });
    const xp = calcSkillXpFromDailyEntry(entry, defaultSettings);
    expect(xp.clarity).toBe(SKILL_XP_AWARDS.journal);
  });

  it('counts notes for daily journal points once', () => {
    const entry = day({ date: '2026-06-01', comment: 'Заметка', journal: true });
    expect(calcDailyPoints(entry, defaultSettings)).toBe(defaultSettings.pointSettings.journal);
  });

  it('marks journal quest done from notes alone', () => {
    const entry = day({ date: '2026-06-01', comment: 'След дня' });
    const quests = getDailyQuests({
      date: '2026-06-01',
      dailyEntries: [entry],
      settings: defaultSettings,
    });
    expect(quests.find((q) => q.id === 'journal')?.status).toBe('done');
  });

  it('counts notes for journal achievements', () => {
    const entries = [day({ date: '2026-06-01', comment: 'Первый след' })];
    const progress = getAchievementProgress({
      dailyEntries: entries,
      measurements: [],
      settings: defaultSettings,
      totalXp: 0,
      unlockedAchievements: [],
    });
    const journalFirst = progress.find((p) => p.achievementId === 'journal_first');
    expect(journalFirst?.completed).toBe(true);
    expect(ACHIEVEMENTS.some((a) => a.id === 'journal_first')).toBe(true);
  });
});
