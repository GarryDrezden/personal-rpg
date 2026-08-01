import type { AppThemeId } from '../types/theme';
import type { BossDef, BossStatus } from './bosses/bossTypes';
import type { SeasonRewardStatus } from './seasons/seasonTypes';

const COZY_SEASON_REWARDS: Record<number, string> = {
  1: 'Искра очага',
  2: 'След тропинки',
  3: 'Камень крыльца',
  4: 'Ключ от мастерской',
  5: 'Знак двора',
  6: 'Свет над прудом',
  7: 'Печать уюта',
  8: 'Капля садовой лейки',
  9: 'Щит спокойствия',
  10: 'Значок силы рук',
  11: 'Тёплый фонарь',
  12: 'Ключ от калитки',
  13: 'Память года дома',
};

const COZY_SEASON_BOSS: Record<
  number,
  { title: string; shortTitle: string; weaknessText: string }
> = {
  1: {
    title: 'Заброшенная комната',
    shortTitle: 'Пустая комната',
    weaknessText: 'Уходит после сохранённых и минимальных дней',
  },
  2: {
    title: 'Сонный диван',
    shortTitle: 'Диван',
    weaknessText: 'Отступает от любого движения и шагов',
  },
  3: {
    title: 'Вечерняя кладовая',
    shortTitle: 'Кладовая',
    weaknessText: 'Рассеивается, когда питание отмечено',
  },
  4: {
    title: 'Туман над двором',
    shortTitle: 'Туман',
    weaknessText: 'Рассеивается, когда ресурс отмечен',
  },
  5: {
    title: 'Сквозняк усталости',
    shortTitle: 'Сквозняк',
    weaknessText: 'Слабеет от шагов и движения',
  },
  6: {
    title: 'Заросший угол',
    shortTitle: 'Заросль',
    weaknessText: 'Уступает восстановлению и удержанному ритму',
  },
  7: {
    title: 'Скрипучая дверь привычек',
    shortTitle: 'Скрип',
    weaknessText: 'Рвётся, когда маршрут снова отмечен',
  },
  8: {
    title: 'Ночной стол без меры',
    shortTitle: 'Ночной стол',
    weaknessText: 'Ослабевает от ясных дней и трезвости',
  },
  9: {
    title: 'Стопка неначатого',
    shortTitle: 'Неначатое',
    weaknessText: 'Рассыпается от сохранённых дней',
  },
  10: {
    title: 'Старый сарай привычек',
    shortTitle: 'Сарай',
    weaknessText: 'Отступает от движения и заботы о теле',
  },
  11: {
    title: 'Серая тяжесть',
    shortTitle: 'Тяжесть',
    weaknessText: 'Меркнет от дневника и спокойных дней',
  },
  12: {
    title: 'Закрытая калитка',
    shortTitle: 'Калитка',
    weaknessText: 'Открывается, когда путь продолжается',
  },
  13: {
    title: 'Тень старого года',
    shortTitle: 'Старый год',
    weaknessText: 'Слабеет от честных отметок и возвращения',
  },
};

const COZY_BOSS_STATUS: Record<BossStatus, string> = {
  untouched: 'Помеха ещё держит угол дома.',
  noticed: 'Появились первые просветы.',
  weakened: 'Помеха слабеет от удержанного ритма.',
  broken: 'Порядка и тепла стало заметно больше.',
  sealed: 'Сезон почти закрыт заботой и ритмом.',
};

export function getThemedSeasonRewardName(
  themeId: AppThemeId,
  seasonIndex: number,
  fallbackName: string,
): string {
  if (themeId !== 'cozy') return fallbackName;
  return COZY_SEASON_REWARDS[seasonIndex] ?? fallbackName;
}

export function getThemedSeasonRewardLabel(
  themeId: AppThemeId,
  rewardStatus: SeasonRewardStatus,
  rewardName: string,
): string {
  if (themeId !== 'cozy') {
    if (rewardStatus === 'earned') return `${rewardName} — у тебя`;
    if (rewardStatus === 'awaiting') return `${rewardName} — почти`;
    if (rewardStatus === 'fog') return `${rewardName} — ещё в тумане`;
    return `${rewardName} — ждёт в конце сезона`;
  }

  if (rewardStatus === 'earned') return `${rewardName} — уже в доме`;
  if (rewardStatus === 'awaiting') return `${rewardName} — почти готова`;
  if (rewardStatus === 'fog') return `${rewardName} — ещё впереди`;
  return `${rewardName} — появится к концу сезона`;
}

export function getThemedSeasonBossPresentation(
  themeId: AppThemeId,
  boss: BossDef,
  status: BossStatus,
): {
  title: string;
  shortTitle: string;
  statusLabel: string;
  weaknessText: string;
} {
  if (themeId !== 'cozy') {
    return {
      title: boss.title,
      shortTitle: boss.shortTitle,
      statusLabel: boss.statusCopy[status],
      weaknessText: boss.weaknessText,
    };
  }

  const seasonId = boss.seasonId ?? 0;
  const cozy = COZY_SEASON_BOSS[seasonId];
  return {
    title: cozy?.title ?? boss.title,
    shortTitle: cozy?.shortTitle ?? boss.shortTitle,
    statusLabel: COZY_BOSS_STATUS[status],
    weaknessText: cozy?.weaknessText ?? boss.weaknessText,
  };
}
