import { HERO_STAGE_DESCRIPTIONS, HERO_STAGE_TITLES } from '../constants/heroStages';
import { GAME_CHAPTERS } from '../constants/gameChapters';
import type {
  ArtifactId,
  BossId,
  CompanionId,
  GameAssetRegistry,
  HeroGender,
  HeroStageMeta,
  HeroStageNumber,
  MobId,
} from '../types/gameAssets';
import {
  getArtifactPublicPath,
  getBossPublicPath,
  getCompanionPublicPath,
  getGameHeroStageLegacyPath,
  getMobPublicPath,
} from './assetPaths';
import { getChapterFromStage } from './heroProgressEngine';

function buildHeroStages(gender: HeroGender): HeroStageMeta[] {
  return HERO_STAGE_TITLES.map((row) => {
    const stage = row.stage as HeroStageNumber;
    return {
      stage,
      title: row.title,
      description: HERO_STAGE_DESCRIPTIONS[stage],
      progressPercent: row.progressPercent,
      chapter: getChapterFromStage(stage),
      image: getGameHeroStageLegacyPath(gender, stage),
    };
  });
}

export const GAME_ASSET_REGISTRY: GameAssetRegistry = {
  heroStages: {
    male: buildHeroStages('male'),
    female: buildHeroStages('female'),
  },
  companions: {
    golden_chinchilla_cat: {
      id: 'golden_chinchilla_cat',
      title: 'Золотая шиншилла',
      subtitle: 'Маленький хранитель',
      role: 'Спутник ясности и наблюдения',
      description:
        'Плюшевый, серьёзный и слегка королевский спутник. Смотрит так, будто уже знает, чем закончится день.',
      image: getCompanionPublicPath('golden_chinchilla_cat'),
      theme: 'universal',
    },
    alabai: {
      id: 'alabai',
      title: 'Алабай',
      subtitle: 'Верный страж',
      role: 'Спутник защиты и устойчивости',
      description:
        'Большой спокойный защитник. Не торопит, но стоит рядом, когда нужно удержать путь.',
      image: getCompanionPublicPath('alabai'),
      theme: 'universal',
    },
    raven: {
      id: 'raven',
      title: 'Ворон-разведчик',
      subtitle: 'Острый наблюдатель',
      role: 'Спутник инерции и предупреждений',
      description: 'Видит слабые места дня раньше, чем они становятся проблемой.',
      image: getCompanionPublicPath('raven'),
      theme: 'darkFantasy',
    },
    fox_cub: {
      id: 'fox_cub',
      title: 'Лисёнок',
      subtitle: 'Хитрая искра',
      role: 'Спутник энергии и маневра',
      description:
        'Маленький рыжий союзник, который помогает найти обходной путь, когда прямой путь тяжёл.',
      image: getCompanionPublicPath('fox_cub'),
      theme: 'cozy',
    },
  },
  mobs: {
    sofa_magnet: {
      id: 'sofa_magnet',
      title: 'Диванный Магнит',
      subtitle: 'Тянет вниз',
      description: 'Притягивает к паузе и откладыванию. Слабеет, когда ты просто начинаешь двигаться.',
      weakness: 'steps',
      image: getMobPublicPath('sofa_magnet'),
      theme: 'cozy',
    },
    snack_chaos: {
      id: 'snack_chaos',
      title: 'Хаос Перекусов',
      subtitle: 'Импульсивный и вездесущий',
      description: 'Размывает контроль через мелкие срывы. Ослабевает от честного учёта калорий.',
      weakness: 'calories',
      image: getMobPublicPath('snack_chaos'),
      theme: 'universal',
    },
    fog_of_fatigue: {
      id: 'fog_of_fatigue',
      title: 'Туман Усталости',
      subtitle: 'Гасит движение',
      description: 'Делает день тяжелее, чем он есть. Рассеивается в режиме восстановления.',
      weakness: 'recovery',
      image: getMobPublicPath('fog_of_fatigue'),
      theme: 'darkFantasy',
    },
    empty_day: {
      id: 'empty_day',
      title: 'Пустой День',
      subtitle: 'Стирает следы пути',
      description: 'Появляется, когда день исчезает из учёта. Любая запись уже победа.',
      weakness: 'any_data',
      image: getMobPublicPath('empty_day'),
      theme: 'universal',
    },
    impulse_of_rollback: {
      id: 'impulse_of_rollback',
      title: 'Импульс Отката',
      subtitle: 'Бьёт резко и без предупреждения',
      description: 'Провоцирует резкий срыв. Слабеет, когда день осмыслен и записан.',
      weakness: 'journal',
      image: getMobPublicPath('impulse_of_rollback'),
      theme: 'darkFantasy',
    },
    night_call: {
      id: 'night_call',
      title: 'Ночной Зов',
      subtitle: 'Шепчет после заката',
      description: 'Тянет к лишнему вечером. Теряет силу в ясные дни без алкоголя.',
      weakness: 'no_alcohol',
      image: getMobPublicPath('night_call'),
      theme: 'darkFantasy',
    },
    gray_heaviness: {
      id: 'gray_heaviness',
      title: 'Серая Тягость',
      subtitle: 'Делает простой шаг тяжёлым',
      description: 'Давит ожиданиями максимума. Отступает перед минимальным, но честным днём.',
      weakness: 'minimal_day',
      image: getMobPublicPath('gray_heaviness'),
      theme: 'universal',
    },
    sweet_whisper: {
      id: 'sweet_whisper',
      title: 'Сладкий Шёпот',
      subtitle: 'Обещает быстрый дофамин',
      description: 'Обещает лёгкую награду сейчас. Слабеет от стабильного учёта питания.',
      weakness: 'calories',
      image: getMobPublicPath('sweet_whisper'),
      theme: 'cozy',
    },
  },
  bosses: {
    misty_baron: {
      id: 'misty_baron',
      title: 'Туманный Барон',
      subtitle: 'Глава 3',
      description: 'Размывает ясность и делает учёт туманным.',
      chapter: 3,
      image: getBossPublicPath('misty_baron'),
      rewardArtifactId: 'clarity_crystal',
      theme: 'darkFantasy',
    },
    resource_devourer: {
      id: 'resource_devourer',
      title: 'Пожиратель Ресурса',
      subtitle: 'Глава 4',
      description: 'Съедает силы, оставляя только героизм без системы.',
      chapter: 4,
      image: getBossPublicPath('resource_devourer'),
      rewardArtifactId: 'recovery_shield',
      theme: 'darkFantasy',
    },
    divan_king: {
      id: 'divan_king',
      title: 'Диванный Король',
      subtitle: 'Глава 2',
      description: 'Держит тело внизу, пока день не получит движение.',
      chapter: 2,
      image: getBossPublicPath('divan_king'),
      rewardArtifactId: 'step_boots',
      theme: 'cozy',
    },
    lord_of_empty_day: {
      id: 'lord_of_empty_day',
      title: 'Владыка Пустого Дня',
      subtitle: 'Глава 1',
      description: 'Побеждается простым возвращением в учёт.',
      chapter: 1,
      image: getBossPublicPath('lord_of_empty_day'),
      rewardArtifactId: 'control_compass',
      theme: 'universal',
    },
    chain_of_rollback: {
      id: 'chain_of_rollback',
      title: 'Цепь Отката',
      subtitle: 'Связующий босс',
      description: 'Тянет назад после срыва. Ломается возвратом без самобичевания.',
      image: getBossPublicPath('chain_of_rollback'),
      rewardArtifactId: 'return_shield',
      theme: 'darkFantasy',
    },
    night_feast_baron: {
      id: 'night_feast_baron',
      title: 'Барон Ночного Пира',
      subtitle: 'Ночной антагонист',
      description: 'Усиливает вечерние импульсы и размывает границы дня.',
      image: getBossPublicPath('night_feast_baron'),
      rewardArtifactId: 'night_lantern',
      theme: 'darkFantasy',
    },
    promise_collector: {
      id: 'promise_collector',
      title: 'Собиратель Обещаний',
      subtitle: 'Босс ожиданий',
      description: 'Копит обещания «с понедельника» и не даёт начать сегодня.',
      image: getBossPublicPath('promise_collector'),
      rewardArtifactId: 'body_key',
      theme: 'universal',
    },
    old_form_guardian: {
      id: 'old_form_guardian',
      title: 'Хранитель Старой Формы',
      subtitle: 'Финальная глава',
      description: 'Последний страж прошлой версии тела перед новой формой.',
      chapter: 5,
      image: getBossPublicPath('old_form_guardian'),
      rewardArtifactId: 'stability_seal',
      theme: 'darkFantasy',
    },
  },
  artifacts: {
    beer_staff: {
      id: 'beer_staff',
      title: 'Пивной Жезл',
      description: 'Символ длинной ясности без алкоголя.',
      unlockHint: '30 дней без алкоголя',
      rarity: 'legendary',
      image: getArtifactPublicPath('beer_staff'),
      theme: 'darkFantasy',
    },
    clarity_crystal: {
      id: 'clarity_crystal',
      title: 'Кристалл Ясности',
      description: 'Усиливает чистоту дня и учёт.',
      unlockHint: '7 дней без алкоголя',
      rarity: 'rare',
      image: getArtifactPublicPath('clarity_crystal'),
      theme: 'universal',
    },
    recovery_shield: {
      id: 'recovery_shield',
      title: 'Щит Восстановления',
      description: 'Защищает путь в мягкие дни.',
      unlockHint: '3 дня восстановления или минимума',
      rarity: 'rare',
      image: getArtifactPublicPath('recovery_shield'),
      theme: 'cozy',
    },
    return_shield: {
      id: 'return_shield',
      title: 'Щит Возврата',
      description: 'Помогает вернуться после отката без стыда.',
      unlockHint: '5 дней с дневником',
      rarity: 'rare',
      image: getArtifactPublicPath('return_shield'),
      theme: 'universal',
    },
    step_boots: {
      id: 'step_boots',
      title: 'Сапоги Хода',
      description: 'Ускоряют возвращение движения.',
      unlockHint: '7 дней с 7000+ шагов',
      rarity: 'common',
      image: getArtifactPublicPath('step_boots'),
      theme: 'cozy',
    },
    iron_boots: {
      id: 'iron_boots',
      title: 'Железные Сапоги',
      description: 'Стабильный ритм шагов без героизма.',
      unlockHint: '14 дней с 10000+ шагов',
      rarity: 'epic',
      image: getArtifactPublicPath('iron_boots'),
      theme: 'universal',
    },
    control_compass: {
      id: 'control_compass',
      title: 'Компас Контроля',
      description: 'Возвращает ориентир в дне.',
      unlockHint: '7 дней учёта калорий',
      rarity: 'common',
      image: getArtifactPublicPath('control_compass'),
      theme: 'universal',
    },
    journal_quill: {
      id: 'journal_quill',
      title: 'Перо Дневника',
      description: 'Фиксирует опыт и снижает хаос.',
      unlockHint: '7 дней с дневником',
      rarity: 'common',
      image: getArtifactPublicPath('journal_quill'),
      theme: 'cozy',
    },
    stability_seal: {
      id: 'stability_seal',
      title: 'Печать Устойчивости',
      description: 'Знак новой формы и удержанного режима.',
      unlockHint: 'Стадия 17+',
      rarity: 'legendary',
      image: getArtifactPublicPath('stability_seal'),
      theme: 'darkFantasy',
    },
    momentum_core: {
      id: 'momentum_core',
      title: 'Ядро Инерции',
      description: 'Связано с силой хода системы.',
      unlockHint: 'Инерция 40+',
      rarity: 'epic',
      image: getArtifactPublicPath('momentum_core'),
      theme: 'darkFantasy',
    },
    body_key: {
      id: 'body_key',
      title: 'Ключ Формы',
      description: 'Открывает следующий виток трансформации.',
      unlockHint: 'Стадия 5+',
      rarity: 'rare',
      image: getArtifactPublicPath('body_key'),
      theme: 'universal',
    },
    boss_chain_fragment: {
      id: 'boss_chain_fragment',
      title: 'Осколок Цепи Отката',
      description: 'Кусок цепи, которую ты уже начал рвать.',
      unlockHint: 'Стадия 10+',
      rarity: 'epic',
      image: getArtifactPublicPath('boss_chain_fragment'),
      theme: 'darkFantasy',
    },
    night_lantern: {
      id: 'night_lantern',
      title: 'Ночной Фонарь',
      description: 'Освещает вечер без лишних импульсов.',
      unlockHint: '14 дней без алкоголя',
      rarity: 'rare',
      image: getArtifactPublicPath('night_lantern'),
      theme: 'darkFantasy',
    },
    resource_flask: {
      id: 'resource_flask',
      title: 'Фляга Ресурса',
      description: 'Напоминает беречь силы, а не только давить.',
      unlockHint: '5 дней восстановления',
      rarity: 'common',
      image: getArtifactPublicPath('resource_flask'),
      theme: 'cozy',
    },
    golden_collar: {
      id: 'golden_collar',
      title: 'Золотой Ошейник Спутника',
      description: 'Связь с активным спутником пути.',
      unlockHint: '14 дней в системе',
      rarity: 'epic',
      image: getArtifactPublicPath('golden_collar'),
      theme: 'cozy',
    },
  },
};

export function getHeroStageMeta(gender: HeroGender, stage: HeroStageNumber) {
  return GAME_ASSET_REGISTRY.heroStages[gender].find((s) => s.stage === stage)!;
}

export function getCompanionMeta(id: CompanionId) {
  return GAME_ASSET_REGISTRY.companions[id];
}

export function getMobMeta(id: MobId) {
  return GAME_ASSET_REGISTRY.mobs[id];
}

export function getBossMeta(id: BossId) {
  return GAME_ASSET_REGISTRY.bosses[id];
}

export function getArtifactMeta(id: ArtifactId) {
  return GAME_ASSET_REGISTRY.artifacts[id];
}

export function getChapterBossId(chapter: number): BossId {
  return GAME_CHAPTERS.find((c) => c.chapter === chapter)?.bossId ?? 'lord_of_empty_day';
}

export type BossChapterStatus = 'locked' | 'active' | 'defeated';

export function getBossChapterStatus(params: {
  bossChapter: number;
  currentChapter: number;
}): BossChapterStatus {
  const { bossChapter, currentChapter } = params;
  if (bossChapter < currentChapter) return 'defeated';
  if (bossChapter === currentChapter) return 'active';
  return 'locked';
}
