import type { AppThemeId } from '../types/theme';
import { getThemedDashboardCopy } from '../constants/themeContentRegistry';
import { getLevelInfo } from './levels';

export function getDayMoodPhrase(points: number, themeId: AppThemeId = 'darkFantasy'): string {
  const mood = getThemedDashboardCopy(themeId).mood;
  if (points <= 0) return mood.idle;
  if (points < 40) return mood.warming;
  if (points < 70) return mood.held;
  if (points < 100) return mood.good;
  return mood.great;
}

export function getLevelRankTitle(level: number, themeId: AppThemeId = 'darkFantasy'): string {
  const ranks = getThemedDashboardCopy(themeId).rank;
  if (level >= 20) return ranks[20];
  if (level >= 15) return ranks[15];
  if (level >= 10) return ranks[10];
  if (level >= 7) return ranks[7];
  if (level >= 4) return ranks[4];
  if (level >= 2) return ranks[2];
  return ranks[0];
}

export function getLevelFromXp(totalXp: number) {
  const info = getLevelInfo(totalXp);
  const currentLevelXp = totalXp - info.xpForCurrentLevel;
  const nextLevelXp = info.xpForNextLevel - info.xpForCurrentLevel;
  return {
    level: info.level,
    currentLevelXp,
    nextLevelXp,
    progressToNextLevel: info.progressPercent,
    totalXp,
  };
}
