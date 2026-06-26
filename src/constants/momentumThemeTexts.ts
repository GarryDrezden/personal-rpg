import type { AppThemeId } from '../types/theme';
import type { MomentumLevelId } from '../types/momentum';
import { MOMENTUM_LEVELS } from './momentum';

export type MomentumThemeText = {
  title: string;
  description: string;
  bonusDescription?: string;
  helpDescription?: string;
  pageSubtitle?: string;
};

export const MOMENTUM_PAGE_SUBTITLE: Record<AppThemeId, string> = {
  cozy:
    'Инерция показывает, насколько системе сейчас легко продолжать движение. Это не воля и не мотивация — это накопленный ход режима.',
  darkFantasy:
    'Инерция пути показывает, насколько легко ядру персонажа продолжать движение. Это не воля — это накопленный ритм пути.',
};

export const MOMENTUM_THEME_TEXTS: Record<
  MomentumLevelId,
  Record<AppThemeId, MomentumThemeText>
> = {
  lost_speed: {
    cozy: {
      title: 'Потеря хода',
      description:
        'Система потеряла скорость. Сейчас важнее не разгоняться, а снова сдвинуться.',
      helpDescription:
        'Доступен режим возврата: минимальный день, облегченные шаги и простая база.',
    },
    darkFantasy: {
      title: 'Пламя пути ослабло',
      description:
        'Инерция пути почти погасла. Сейчас важнее не битва, а возвращение первого шага.',
      helpDescription:
        'Доступен режим возврата: щит минимального дня и простая база без героизма.',
    },
  },
  dip: {
    cozy: {
      title: 'Просадка',
      description:
        'Инерция просела, но путь не оборван. Один базовый день уже начнет возвращать ход.',
      helpDescription: 'Лучше не давить максимум, а собрать базовый день.',
    },
    darkFantasy: {
      title: 'Туман замедлил путь',
      description:
        'Ход ослаб, но нить пути не оборвана. Один базовый день снова зажжет ядро.',
      helpDescription: 'Не нужна атака в полную силу. Нужен щит базы: учет, шаги и ясность.',
    },
  },
  neutral: {
    cozy: {
      title: 'Нейтрально',
      description: 'Система в нейтральной зоне. Сегодня можно задать направление.',
    },
    darkFantasy: {
      title: 'Ядро спокойно',
      description: 'Инерция не тянет ни вверх, ни вниз. Сегодня можно направить путь.',
    },
  },
  stable: {
    cozy: {
      title: 'Стабильный ход',
      description: 'Режим начал держаться. Повторяемость уже работает на тебя.',
      bonusDescription: '+5% XP за дневные квесты.',
    },
    darkFantasy: {
      title: 'Руна хода активна',
      description: 'Путь набрал устойчивый ритм. Повторяемость усиливает персонажа.',
      bonusDescription: '+5% XP за дневные квесты.',
    },
  },
  boost: {
    cozy: {
      title: 'Хороший разгон',
      description:
        'Система набрала ход. Следующие дни становятся проще за счет накопленной базы.',
      bonusDescription: '+10% XP и возможность бонусной монеты за сильный день.',
    },
    darkFantasy: {
      title: 'Инерция пути усилилась',
      description:
        'Ядро персонажа набрало ход. Следующие шаги получают силу накопленного ритма.',
      bonusDescription: '+10% XP и возможность бонусной монеты за сильный день.',
    },
  },
  flow: {
    cozy: {
      title: 'Поток',
      description: 'Ты в потоке. Не нужно давить сильнее — достаточно не ломать ритм.',
      bonusDescription: '+15% XP и дополнительная монета за день с базой.',
    },
    darkFantasy: {
      title: 'Поток пробужден',
      description: 'Путь вошел в поток. Не нужна лишняя сила — достаточно удержать ритм.',
      bonusDescription: '+15% XP и дополнительная монета за день с базой.',
    },
  },
};

export const MOMENTUM_ACTION_THEME_TEXTS: Record<
  string,
  Record<AppThemeId, { title: string; description: string }>
> = {
  momentum_lost_speed_return: {
    cozy: {
      title: 'Вернуть ход системы',
      description:
        'Инерция сильно просела. Сегодня не нужен максимум — нужен один день без отката.',
    },
    darkFantasy: {
      title: 'Вернуть пламя пути',
      description: 'Инерция почти погасла. Сегодня нужен не подвиг, а первый защищенный шаг.',
    },
  },
  momentum_base_day: {
    cozy: {
      title: 'Собрать базовый день для инерции',
      description: 'Один базовый день уже начнет возвращать ход.',
    },
    darkFantasy: {
      title: 'Собрать руну базы',
      description: 'Один базовый день снова укрепит ядро пути.',
    },
  },
  momentum_set_direction: {
    cozy: {
      title: 'Задать направление дню',
      description: 'Инерция нейтральна. Начни с одного сигнала системы: калории, шаги или ясность.',
    },
    darkFantasy: {
      title: 'Направить путь',
      description: 'Ядро спокойно. Задай направление: калории, шаги или ясность.',
    },
  },
  momentum_keep_boost: {
    cozy: {
      title: 'Не ломать хороший разгон',
      description: 'Система набрала ход. Сегодня достаточно удержать базу, чтобы сохранить бонус инерции.',
    },
    darkFantasy: {
      title: 'Удержать поток пути',
      description: 'Инерция усилилась. Достаточно не ломать ритм — ядро само подхватит ход.',
    },
  },
};

export function getMomentumLevelThemeText(params: {
  levelId: MomentumLevelId;
  themeId?: AppThemeId;
}): MomentumThemeText {
  const themeId = params.themeId ?? 'cozy';
  const themed = MOMENTUM_THEME_TEXTS[params.levelId]?.[themeId];
  if (themed) return themed;

  const base = MOMENTUM_LEVELS.find((l) => l.id === params.levelId);
  if (base) {
    return {
      title: base.title,
      description: base.description,
      bonusDescription: base.bonusDescription,
      helpDescription: base.helpDescription,
    };
  }

  return MOMENTUM_THEME_TEXTS.neutral.cozy;
}

export function getMomentumActionThemeText(params: {
  actionId: string;
  themeId?: AppThemeId;
  fallback: { title: string; description: string };
}): { title: string; description: string } {
  const themeId = params.themeId ?? 'cozy';
  return MOMENTUM_ACTION_THEME_TEXTS[params.actionId]?.[themeId] ?? params.fallback;
}

export function getMomentumPageSubtitle(themeId: AppThemeId = 'cozy'): string {
  return MOMENTUM_PAGE_SUBTITLE[themeId] ?? MOMENTUM_PAGE_SUBTITLE.cozy;
}
