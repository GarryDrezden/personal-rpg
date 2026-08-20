import type { SeasonConfig, SeasonPartialStatus, SeasonRewardStatus } from './seasonTypes';
import type { AppThemeId } from '../../types/theme';
import {
  pickSeasonFlavorLine,
  pickSeasonHistoryRecap,
  pickSeasonCurrentOpenLine,
  seasonCopyPhase,
} from '../../content/seasonsFlavor';

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

/** Quests required to clear a season arc (MVP completion gate). */
export const SEASON_QUESTS_TO_CLEAR = 4;

export function getSeasonPartialStatus(completedQuestCount: number): SeasonPartialStatus {
  if (completedQuestCount >= 5) return 'empowered';
  if (completedQuestCount >= SEASON_QUESTS_TO_CLEAR) return 'cleared';
  if (completedQuestCount >= 3) return 'held';
  if (completedQuestCount >= 1) return 'marked';
  return 'started';
}

/** Season arc is finished only by quest progress — never by calendar alone. */
export function isSeasonArcCompleted(partialStatus: SeasonPartialStatus): boolean {
  return partialStatus === 'cleared' || partialStatus === 'empowered';
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
  opts?: {
    themeId?: AppThemeId;
    date?: string;
    dayNumber?: number;
    seasonLength?: number;
  },
): string {
  if (opts?.themeId && opts.date) {
    const phase = seasonCopyPhase({
      partialStatus: status,
      dayNumber: opts.dayNumber ?? 1,
      seasonLength: opts.seasonLength ?? 28,
      isArcCompleted: isSeasonArcCompleted(status),
    });
    const flavor = pickSeasonFlavorLine({
      themeId: opts.themeId,
      phase,
      date: opts.date,
      extra: config.id,
    });
    if (status === 'cleared' || status === 'empowered') {
      return config.description ? `${flavor} ${config.description}` : flavor;
    }
    return flavor;
  }
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
  opts?: { themeId?: AppThemeId; date?: string },
): string {
  const themeId = opts?.themeId ?? 'darkFantasy';
  const date = opts?.date ?? '2000-01-01';
  if (!isPast) {
    if (!isSeasonArcCompleted(status)) {
      return pickSeasonCurrentOpenLine({ themeId, date });
    }
    return getSeasonRecapText(status, config, { themeId, date });
  }
  const flavored = pickSeasonHistoryRecap({
    themeId,
    date,
    isPast: true,
    isArcCompleted: isSeasonArcCompleted(status),
    partialStatus: status,
  });
  if (flavored) return flavored;
  return getSeasonRecapText(status, config, { themeId, date });
}

export function getSeasonContinuingArcLabel(themeId?: 'cozy' | 'darkFantasy'): string {
  if (themeId === 'cozy') {
    return 'Сезонный дневник ещё открыт';
  }
  return 'Арка ещё не завершена';
}
