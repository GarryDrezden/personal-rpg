import type { AppThemeId } from '../types/theme';

export type RemovedLoadThemeText = {
  cardTitle: string;
  emptyTitle: string;
  emptyDescription: string;
  mainDescription: string;
  visualPrefix: string;
};

export const REMOVED_LOAD_THEME_TEXTS: Record<AppThemeId, RemovedLoadThemeText> = {
  cozy: {
    cardTitle: 'Снятый груз',
    emptyTitle: 'Рюкзак пока не стал легче',
    emptyDescription:
      'По данным веса груз пока не уменьшился. Но путь может расти через учёт, шаги и ясность.',
    mainDescription: 'Столько веса уже не нужно нести каждый шаг.',
    visualPrefix: 'Рюкзак стал легче примерно на:',
  },
  darkFantasy: {
    cardTitle: 'Снятые печати тяжести',
    emptyTitle: 'Печати пока держатся',
    emptyDescription:
      'По данным веса груз пока не ослаб. Но ядро персонажа может крепнуть через учёт, движение и ясность.',
    mainDescription: 'Столько груза уже снято с персонажа.',
    visualPrefix: 'Снятый груз похож на:',
  },
};

export type RemovedLoadVisualThemeText = {
  title: string;
  description: string;
};

export const REMOVED_LOAD_VISUAL_THEME_TEXTS: Record<
  string,
  Record<AppThemeId, RemovedLoadVisualThemeText>
> = {
  stone: {
    cozy: {
      title: 'Первый камень из рюкзака',
      description: 'Маленький, но важный груз уже снят.',
    },
    darkFantasy: {
      title: 'Первый осколок печати',
      description: 'Печать тяжести дала первую трещину.',
    },
  },
  canister: {
    cozy: {
      title: 'Большая канистра воды',
      description: 'Рюкзак стал заметно легче.',
    },
    darkFantasy: {
      title: 'Тяжёлый камень проклятия',
      description: 'Один из грузов больше не давит на персонажа.',
    },
  },
  backpack: {
    cozy: {
      title: 'Тяжёлый походный рюкзак',
      description: 'Это уже большой груз, который больше не нужно нести.',
    },
    darkFantasy: {
      title: 'Сломанная цепь тяжести',
      description: 'Часть цепей больше не держит персонажа у земли.',
    },
  },
  two_canisters: {
    cozy: {
      title: 'Две большие канистры',
      description: 'Два крупных блока нагрузки сняты с плеч.',
    },
    darkFantasy: {
      title: 'Две печати ослабли',
      description: 'Двойной груз больше не участвует в каждом шаге.',
    },
  },
  heavy_load: {
    cozy: {
      title: 'Серьёзный груз',
      description: 'Груз, который больше не нужно нести каждый день.',
    },
    darkFantasy: {
      title: 'Печать тяжести ослабла',
      description: 'Большая часть проклятого груза уже снята.',
    },
  },
  huge_load: {
    cozy: {
      title: 'Огромный груз',
      description: 'Огромный груз снят — новая глава движения.',
    },
    darkFantasy: {
      title: 'Великое освобождение',
      description: 'Огромная печать тяжести разрушена.',
    },
  },
};

export function getRemovedLoadThemeText(themeId: AppThemeId = 'cozy'): RemovedLoadThemeText {
  return REMOVED_LOAD_THEME_TEXTS[themeId];
}

export function getRemovedLoadVisualThemeText(
  visualId: string,
  themeId: AppThemeId = 'cozy',
): RemovedLoadVisualThemeText | null {
  return REMOVED_LOAD_VISUAL_THEME_TEXTS[visualId]?.[themeId] ?? null;
}
