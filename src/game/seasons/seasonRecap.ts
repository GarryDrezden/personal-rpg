import type { SeasonConfig, SeasonPartialStatus } from './seasonTypes';

const STATUS_RECAP: Record<SeasonPartialStatus, string> = {
  started: 'Сезон начат. Костёр уже виден — теперь важно возвращаться к нему.',
  marked: 'Маршрут отмечен. Даже неровная неделя оставляет след.',
  held: 'Сезон удержан. Ты не прошёл идеально, но система стала устойчивее.',
  cleared: 'Сезон пройден. Путь стал заметнее.',
  empowered: 'Сезон усилен. Искра ядра разгорелась ярче.',
};

export const PARTIAL_STATUS_LABELS: Record<SeasonPartialStatus, string> = {
  started: 'Сезон начат',
  marked: 'Маршрут отмечен',
  held: 'Сезон удержан',
  cleared: 'Сезон пройден',
  empowered: 'Сезон усилен',
};

export function getSeasonPartialStatus(completedQuestCount: number): SeasonPartialStatus {
  if (completedQuestCount >= 5) return 'empowered';
  if (completedQuestCount >= 4) return 'cleared';
  if (completedQuestCount >= 3) return 'held';
  if (completedQuestCount >= 1) return 'marked';
  return 'started';
}

export function getSeasonRecapText(
  status: SeasonPartialStatus,
  config: SeasonConfig,
): string {
  const base = STATUS_RECAP[status];
  if (status === 'cleared' || status === 'empowered') {
    return `${base} ${config.description}`;
  }
  return base;
}
