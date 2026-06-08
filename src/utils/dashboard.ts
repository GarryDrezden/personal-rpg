import { getLevelInfo } from './levels';

export function getDayMoodPhrase(points: number): string {
  if (points <= 0) return 'День только начинается';
  if (points < 40) return 'Разгоняемся';
  if (points < 70) return 'Режим держится';
  if (points < 100) return 'Хороший день';
  return 'Отличный день';
}

export function getLevelRankTitle(level: number): string {
  if (level >= 20) return 'Легенда привычек';
  if (level >= 15) return 'Мастер режима';
  if (level >= 10) return 'Ветеран пути';
  if (level >= 7) return 'Опытный боец';
  if (level >= 4) return 'Уверенный старт';
  if (level >= 2) return 'Ученик системы';
  return 'Новичок';
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
