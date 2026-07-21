import type { SeasonConfig, SeasonPartialStatus, SeasonRewardStatus } from './seasonTypes';

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

export const REWARD_STATUS_LABELS: Record<SeasonRewardStatus, string> = {
  fog: 'Ещё в тумане',
  preview: 'Ждёт в конце сезона',
  awaiting: 'Почти у тебя — ещё один квест',
  earned: 'У тебя',
};

export function getSeasonPartialStatus(completedQuestCount: number): SeasonPartialStatus {
  if (completedQuestCount >= 5) return 'empowered';
  if (completedQuestCount >= 4) return 'cleared';
  if (completedQuestCount >= 3) return 'held';
  if (completedQuestCount >= 1) return 'marked';
  return 'started';
}

export function getSeasonRewardStatus(
  partialStatus: SeasonPartialStatus,
  isLocked: boolean,
): SeasonRewardStatus {
  if (isLocked) return 'fog';
  if (partialStatus === 'cleared' || partialStatus === 'empowered') return 'earned';
  if (partialStatus === 'held') return 'awaiting';
  return 'preview';
}

export function getSeasonRewardLabel(
  rewardStatus: SeasonRewardStatus,
  rewardName: string,
): string {
  if (rewardStatus === 'earned') return `${rewardName} — у тебя`;
  if (rewardStatus === 'awaiting') return `${rewardName} — почти`;
  if (rewardStatus === 'fog') return `${rewardName} — ещё в тумане`;
  return `${rewardName} — ждёт в конце сезона`;
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

/** Soft past-season line for chronicle (never “failed”). */
export function getSeasonHistoryRecapText(
  status: SeasonPartialStatus,
  config: SeasonConfig,
  isPast: boolean,
): string {
  if (!isPast) return getSeasonRecapText(status, config);
  if (status === 'started') {
    return 'Сезон прошёл тихо. След всё равно остался — следующий круг будет яснее.';
  }
  if (status === 'marked') {
    return 'Сезон оставил метки маршрута. Не идеально — и этого достаточно.';
  }
  return getSeasonRecapText(status, config);
}
