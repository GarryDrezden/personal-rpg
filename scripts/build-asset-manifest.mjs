#!/usr/bin/env node
/**
 * Builds docs/assets/manifest.json (Asset Registry 2.0).
 * Run: node scripts/build-asset-manifest.mjs
 */
import { existsSync, writeFileSync } from 'node:fs';
import { join, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

function entry(partial) {
  return {
    promptStatus: 'missing',
    fileStatus: 'missing',
    manifestStatus: 'registered',
    notes: '',
    ...partial,
  };
}

function inApp(partial) {
  return entry({
    status: 'in-app',
    promptStatus: 'ready',
    fileStatus: 'ready',
    manifestStatus: 'registered',
    ...partial,
  });
}

function needed(partial) {
  return entry({
    status: 'needed',
    promptStatus: 'planned',
    fileStatus: 'missing',
    manifestStatus: 'registered',
    ...partial,
  });
}

function promptReady(partial) {
  return entry({
    status: 'prompt-ready',
    promptStatus: 'prompt-ready',
    fileStatus: 'needed',
    manifestStatus: 'registered',
    ...partial,
  });
}

const JOURNEY_CHAPTERS = [
  [1, 'ruins', 'Руины · начало пути'],
  [2, 'burden', 'Каменный маршрут'],
  [3, 'road', 'Открытый тракт'],
  [4, 'watchtower', 'Башня · контроль'],
  [5, 'pass', 'Перевал · подъём'],
  [6, 'lake', 'Озеро · равнина'],
  [7, 'fortress', 'Крепость · опора'],
  [8, 'river', 'Река · свобода'],
  [9, 'citadel', 'Цитадель · перерождение'],
];

const MALE_HERO_IN_APP = [1, 2, 3, 19, 20];
const FEMALE_STAGES = Array.from({ length: 20 }, (_, i) => i + 1);

const COMPANIONS = [
  ['companion-golden-cat', 'golden_chinchilla_cat', 'Золотая шиншилла', '/game-assets/companions/golden-chinchilla-cat.png'],
  ['companion-alabai', 'alabai', 'Алабай', '/game-assets/companions/alabai.png'],
  ['companion-raven', 'raven', 'Ворон-разведчик', '/game-assets/companions/raven.png'],
  ['companion-fox-cub', 'fox_cub', 'Лисёнок', '/game-assets/companions/fox-cub.png'],
];

const MOBS = [
  ['mob-sofa-magnet', 'sofa_magnet', 'Диванный Магнит', 'sofa-magnet.png'],
  ['mob-snack-chaos', 'snack_chaos', 'Хаос Перекусов', 'snack-chaos.png'],
  ['mob-fog-of-fatigue', 'fog_of_fatigue', 'Туман Усталости', 'fog-of-fatigue.png'],
  ['mob-empty-day', 'empty_day', 'Пустой День', 'empty-day.png'],
  ['mob-impulse-of-rollback', 'impulse_of_rollback', 'Импульс Отката', 'impulse-of-rollback.png'],
  ['mob-night-call', 'night_call', 'Ночной Зов', 'night-call.png'],
  ['mob-gray-heaviness', 'gray_heaviness', 'Серая Тягость', 'gray-heaviness.png'],
  ['mob-sweet-whisper', 'sweet_whisper', 'Сладкий Шёпот', 'sweet-whisper.png'],
];

const LEGACY_BOSSES = [
  ['boss-divan-king', 'divan_king', 'Диванный Король', 'divan-king.png'],
  ['boss-misty-baron', 'misty_baron', 'Туманный Барон', 'misty-baron.png'],
  ['boss-resource-devourer', 'resource_devourer', 'Пожиратель Ресурса', 'resource-devourer.png'],
  ['boss-chain-of-rollback', 'chain_of_rollback', 'Цепь Отката', 'chain-of-rollback.png'],
  ['boss-night-feast-baron', 'night_feast_baron', 'Барон Ночного Пира', 'night-feast-baron.png'],
  ['boss-promise-collector', 'promise_collector', 'Собиратель Обещаний', 'promise-collector.png'],
  ['boss-old-form-guardian', 'old_form_guardian', 'Хранитель Старой Формы', 'old-form-guardian.png'],
];

const SEASON_MINI_BOSSES = [
  [1, 'empty-day-lord', 'Владыка Пустого Дня'],
  [2, 'divan-king', 'Диванный Король'],
  [3, 'snack-chaos', 'Хаос Перекусов'],
  [4, 'misty-baron', 'Туманный Барон'],
  [5, 'resource-devourer', 'Пожиратель Ресурса'],
  [6, 'plateau-guardian', 'Страж Перевала'],
  [7, 'rollback-chain', 'Цепь Отката'],
  [8, 'night-feast-baron', 'Барон Ночного Пира'],
  [9, 'promise-collector', 'Собиратель Обещаний'],
  [10, 'old-form-guardian', 'Хранитель Старой Формы'],
  [11, 'fatigue-archivist', 'Серый Архивариус Усталости'],
  [12, 'mobility-gatekeeper', 'Привратник Новой Мобильности'],
  [13, 'old-year-shadow', 'Тень Старого Года'],
];

const CHAPTER_BOSSES = [
  [1, 'ruins-warden', 'Страж Руин'],
  [2, 'burden-bearer', 'Несущий Груз'],
  [3, 'old-trail-master', 'Хозяин Старой Тропы'],
  [4, 'watchtower-keeper', 'Смотритель Башни Режима'],
  [5, 'heavy-pass-lord', 'Повелитель Тяжёлого Перевала'],
  [6, 'lake-inertia-keeper', 'Озёрный Хранитель Инерции'],
  [7, 'habit-commandant', 'Комендант Крепости Привычек'],
  [8, 'river-guardian', 'Хранитель Реки Движения'],
  [9, 'old-form-shadow', 'Последняя Тень Старой Формы'],
];

const ACT_BOSSES = [
  ['I', 'chaos-lord', 'Повелитель Хаоса'],
  ['II', 'plateau-archon', 'Архонт Плато'],
  ['III', 'old-life-keeper', 'Хранитель Старой Жизни'],
];

const BASE_STAGES = [
  ['ember', 'ember-camp', 'Тлеющий костёр'],
  ['shelter', 'trail-shelter', 'Укрытие'],
  ['trail', 'route-trail', 'Тропа'],
  ['workshop', 'route-workshop', 'Мастерская'],
  ['clarity', 'clarity-tower', 'Башня ясности'],
  ['hearth', 'recovery-hearth', 'Очаг восстановления'],
  ['fortress', 'rhythm-fortress', 'Крепость режима'],
  ['citadel', 'form-citadel', 'Цитадель формы'],
];

const BODY_ABILITIES = [
  ['tie_shoes_easier', 'mobility-shoes', 'Легче завязать обувь'],
  ['stand_from_floor', 'mobility-floor', 'Легче встать с пола'],
  ['stairs_breath', 'endurance-stairs', 'Меньше одышки после лестницы'],
  ['long_route', 'endurance-route', 'Проще пройти длинный маршрут'],
  ['stand_easier', 'mobility-stand', 'Проще стоять'],
  ['car_easier', 'daily-car', 'Проще ездить в машине'],
  ['clothing_freer', 'clothing-freer', 'Одежда сидит свободнее'],
  ['household_easier', 'daily-household', 'Проще заниматься бытом'],
  ['movement_confidence', 'confidence-movement', 'Больше уверенности в движении'],
  ['recovery_awareness', 'recovery-awareness', 'Мягче возвращаться после усталости'],
  ['journal_clarity', 'confidence-journal', 'Яснее видеть свой день'],
  ['stairs_easier', 'endurance-stairs-up', 'Легче подниматься по лестнице'],
];

const SEASON_REWARDS = [
  [1, 'core-spark', 'Искра ядра'],
  [2, 'trail-mark', 'Метка тропы'],
  [3, 'base-stone', 'Камень базы'],
  [4, 'tower-key', 'Ключ башни'],
  [5, 'pass-mark', 'Перевальная метка'],
  [6, 'lake-light', 'Озёрный свет'],
  [7, 'fortress-seal', 'Печать крепости'],
  [8, 'river-drop', 'Капля реки'],
  [9, 'form-shield', 'Щит формы'],
  [10, 'strength-medal', 'Медаль силы'],
  [11, 'clarity-lantern', 'Фонарь ясности'],
  [12, 'gate-key', 'Ключ врат'],
  [13, 'year-artifact', 'Артефакт года'],
];

const assets = [];

// Male hero stages
for (const stage of MALE_HERO_IN_APP) {
  const n = String(stage).padStart(2, '0');
  assets.push(
    inApp({
      id: `male-stage-${n}`,
      type: 'hero-stage',
      category: 'hero',
      title: `Мужской герой — стадия ${stage}`,
      priority: 'P0',
      path: `/game-assets/heroes/male/stage-${n}.png`,
      usedIn: ['Dashboard', 'Codex', 'Journey', 'assetRegistry'],
      relatedEntityId: `male_stage_${stage}`,
      theme: 'darkFantasy',
      gender: 'male',
      stage,
      source: 'Nano Banana',
      date: '2026-06',
      legacyStatus: 'approved',
      notes: stage === 1 || stage === 19 ? 'Anchor stage.' : 'Dark fantasy line.',
    }),
  );
}

for (let stage = 4; stage <= 18; stage++) {
  const n = String(stage).padStart(2, '0');
  assets.push(
    inApp({
      id: `male-stage-${n}-variant`,
      type: 'hero-stage',
      category: 'hero',
      title: `Мужской герой — стадия ${stage} (variant)`,
      priority: stage <= 10 ? 'P0' : 'P1',
      path: `/game-assets/heroes/male/variants/dark-fantasy/stage-${n}.png`,
      usedIn: ['assetPaths fallback chain', 'Codex', 'Dashboard'],
      relatedEntityId: `male_stage_${stage}`,
      theme: 'darkFantasy',
      gender: 'male',
      stage,
      source: 'Nano Banana',
      date: '2026-06',
      legacyStatus: 'approved',
      notes: 'Dark-fantasy variant folder; legacy root fallback for anchors.',
    }),
  );
}

assets.push(
  inApp({
    id: 'male-death',
    type: 'hero-death',
    category: 'hero',
    title: 'Мужской герой — Death (200 kg)',
    priority: 'P1',
    path: '/game-assets/heroes/male/death.png',
    usedIn: ['Measurements', 'Hero progression'],
    relatedEntityId: 'male_death',
    theme: 'darkFantasy',
    gender: 'male',
    source: 'Nano Banana',
    date: '2026-06',
    legacyStatus: 'approved',
    notes: 'Silhouette in black mantle with scythe.',
  }),
);

// Female hero — full set
for (const stage of FEMALE_STAGES) {
  const n = String(stage).padStart(2, '0');
  assets.push(
    inApp({
      id: `female-stage-${n}`,
      type: 'hero-stage',
      category: 'femaleHero',
      title: `Женский герой — стадия ${stage}`,
      priority: stage === 20 ? 'P2' : 'P1',
      path: `/game-assets/heroes/female/stage-${n}.png`,
      usedIn: ['Dashboard', 'Codex', 'Journey'],
      relatedEntityId: `female_stage_${stage}`,
      theme: 'darkFantasy',
      gender: 'female',
      stage,
      source: 'Leonardo',
      date: '2026-05',
      legacyStatus: 'approved',
      notes: stage === 20 ? 'Full female set approved in repo.' : '',
    }),
  );
}

assets.push(
  inApp({
    id: 'female-death',
    type: 'hero-death',
    category: 'femaleHero',
    title: 'Женский герой — Death',
    priority: 'P2',
    path: '/game-assets/heroes/female/death.png',
    usedIn: ['Measurements', 'Hero progression'],
    relatedEntityId: 'female_death',
    theme: 'darkFantasy',
    gender: 'female',
    source: 'Leonardo',
    date: '2026-05',
    legacyStatus: 'approved',
    notes: '',
  }),
);

// Journey chapters
for (const [num, slug, label] of JOURNEY_CHAPTERS) {
  const n = String(num).padStart(2, '0');
  assets.push(
    inApp({
      id: `journey-chapter-${n}`,
      type: 'journey-chapter-bg',
      category: 'journeyChapters',
      title: `Journey Map — глава ${num}: ${label}`,
      priority: 'P0',
      path: `/game-assets/maps/chapters/chapter-${n}-${slug}.webp`,
      usedIn: ['JourneyMapPage', 'JourneyChapterVignette'],
      relatedEntityId: `chapter_${num}`,
      theme: 'darkFantasy',
      source: 'Nano Banana',
      date: '2026-06',
      legacyStatus: 'approved',
      notes: 'Primary .webp; CSS gradient fallback if missing.',
    }),
  );
}

assets.push(
  inApp({
    id: 'journey-map-bg-desktop',
    type: 'journey-map-bg',
    category: 'journeyChapters',
    title: 'Journey Map — desktop background',
    priority: 'P1',
    path: '/game-assets/maps/journey-map-bg-desktop.png',
    usedIn: ['journeyMapConfig (legacy reference)'],
    theme: 'darkFantasy',
    legacyStatus: 'approved',
    notes: 'v3 uses per-chapter vignettes; kept for reference.',
  }),
  inApp({
    id: 'journey-map-bg-mobile',
    type: 'journey-map-bg',
    category: 'journeyChapters',
    title: 'Journey Map — mobile background',
    priority: 'P1',
    path: '/game-assets/maps/journey-map-bg-mobile.png',
    usedIn: ['journeyMapConfig (legacy reference)'],
    theme: 'darkFantasy',
    legacyStatus: 'approved',
    notes: 'v3 uses per-chapter vignettes; kept for reference.',
  }),
);

// Companions
for (const [id, entityId, title, path] of COMPANIONS) {
  assets.push(
    inApp({
      id,
      type: 'companion',
      category: 'companions',
      title: `Спутник — ${title}`,
      priority: 'P0',
      path,
      usedIn: ['Onboarding', 'Codex', 'Dashboard', 'assetRegistry'],
      relatedEntityId: entityId,
      theme: 'universal',
      source: 'Leonardo',
      date: '2026-05',
      legacyStatus: 'approved',
      notes: entityId === 'raven' ? 'Linked to logo Huginn/Muninn direction.' : '',
    }),
  );
}

// Daily mobs
for (const [id, entityId, title, file] of MOBS) {
  assets.push(
    inApp({
      id,
      type: 'mob',
      category: 'dailyMobs',
      title: `Моб дня — ${title}`,
      priority: 'P1',
      path: `/game-assets/mobs/${file}`,
      usedIn: ['Today DailyMobCard', 'Codex', 'assetRegistry'],
      relatedEntityId: entityId,
      theme: 'universal',
      source: 'Leonardo',
      date: '2026-05',
      legacyStatus: 'approved',
      notes: 'Daily mob collection.',
    }),
  );
}

// Legacy codex bosses (PNG in repo; lord_of_empty_day superseded by Batch 2 webp)
assets.push(
  entry({
    id: 'boss-lord-of-empty-day',
    type: 'boss-legacy',
    category: 'chapterBosses',
    title: 'Босс (codex) — Владыка Пустого Дня',
    priority: 'P1',
    status: 'done',
    promptStatus: 'ready',
    fileStatus: 'missing',
    manifestStatus: 'registered',
    usedIn: ['superseded-by season-boss-01-empty-day-lord'],
    relatedEntityId: 'lord_of_empty_day',
    theme: 'darkFantasy',
    source: 'Leonardo',
    date: '2026-05',
    legacyStatus: 'superseded',
    notes:
      'Legacy PNG removed. Codex/Journey use season-boss-01-empty-day-lord via getBossPublicPath().',
  }),
);

for (const [id, entityId, title, file] of LEGACY_BOSSES) {
  assets.push(
    inApp({
      id,
      type: 'boss-legacy',
      category: 'chapterBosses',
      title: `Босс (codex) — ${title}`,
      priority: 'P1',
      path: `/game-assets/bosses/${file}`,
      usedIn: ['Codex', 'assetRegistry', 'Journey (legacy bossId)'],
      relatedEntityId: entityId,
      theme: 'darkFantasy',
      source: 'Leonardo',
      date: '2026-05',
      legacyStatus: 'approved',
      notes: 'Legacy chapter boss art; Boss Campaign v1 uses emoji until campaign art ships.',
    }),
  );
}

// Season mini-bosses (campaign v1 — emoji placeholders)
for (const [seasonId, slug, title] of SEASON_MINI_BOSSES) {
  const n = String(seasonId).padStart(2, '0');
  const isPackBoss = seasonId === 1;
  assets.push(
    isPackBoss
      ? promptReady({
          id: 'season-boss-01-empty-day-lord',
          type: 'season-mini-boss',
          category: 'seasonBosses',
          title: `Сезон 1 — ${title}`,
          priority: 'P1',
          targetPath: `/game-assets/bosses/seasons/season-boss-01-empty-day-lord.webp`,
          usedIn: [
            'SeasonTodayCard',
            'SeasonDashboardSummary',
            'bossConfig',
            'ChapterBossCard',
            'GameCodexPage',
            'assetRegistry',
            'JourneyBossMini',
            'getBossPublicPath',
          ],
          relatedEntityId: 'season_mini_01',
          notes:
            'Batch 2 in-app. Replaces legacy boss-lord-of-empty-day for codex and journey.',
        })
      : needed({
          id: `season-boss-${n}`,
          type: 'season-mini-boss',
          category: 'seasonBosses',
          title: `Сезон ${seasonId} — ${title}`,
          priority: 'P1',
          targetPath: `/game-assets/bosses/seasons/season-boss-${n}-${slug}.webp`,
          usedIn: ['SeasonTodayCard', 'SeasonDashboardSummary', 'bossConfig'],
          relatedEntityId: `season_mini_${n}`,
          promptStatus: seasonId <= 2 ? 'ready' : 'planned',
          notes: 'Campaign v1 UI uses emoji icon. Target path follows naming convention.',
        }),
  );
}

// Chapter bosses (campaign)
for (const [chapterId, slug, title] of CHAPTER_BOSSES) {
  const n = String(chapterId).padStart(2, '0');
  assets.push(
    needed({
      id: `chapter-boss-${n}`,
      type: 'chapter-boss',
      category: 'chapterBosses',
      title: `Глава ${chapterId} — ${title}`,
      priority: chapterId <= 3 ? 'P2' : 'P2',
      targetPath: `/game-assets/bosses/chapters/chapter-boss-${n}-${slug}.webp`,
      usedIn: ['JourneyChapterDetailPanel', 'bossConfig'],
      relatedEntityId: `chapter_${n}`,
      promptStatus: 'planned',
      notes: 'Emoji placeholder in Boss Campaign v1.',
    }),
  );
}

// Act bosses
for (const [actId, slug, title] of ACT_BOSSES) {
  assets.push(
    needed({
      id: `act-boss-${actId}`,
      type: 'act-boss',
      category: 'actBosses',
      title: `Акт ${actId} — ${title}`,
      priority: 'P2',
      targetPath: `/game-assets/bosses/acts/act-boss-${actId.toLowerCase()}-${slug}.webp`,
      usedIn: ['bossConfig', 'future act summary'],
      relatedEntityId: `act_${actId}`,
      promptStatus: 'planned',
      notes: 'Future visual layer; not in UI v1.',
    }),
  );
}

// Camp / base stages
for (let i = 0; i < BASE_STAGES.length; i++) {
  const [entityId, slug, title] = BASE_STAGES[i];
  const n = String(i + 1).padStart(2, '0');
  if (i === 0) {
    assets.push(
      promptReady({
        id: 'camp-base-stage-01-ember-camp',
        type: 'camp-base-scene',
        category: 'campBase',
        title: `Лагерь — ${title}`,
        priority: 'P0',
        targetPath: `/game-assets/base/base-stage-01-ember-camp.webp`,
        usedIn: ['BaseCampPage', 'BaseStageRail', 'ManifestArtScene', '/growth/camp', 'baseProgressionConfig'],
        relatedEntityId: entityId,
        notes: 'Dark MVP Priority Pack v1. Return place, not base-building UI.',
      }),
    );
    continue;
  }
  if (i === 1) {
    assets.push(
      promptReady({
        id: 'camp-base-stage-02-shelter',
        type: 'camp-base-scene',
        category: 'campBase',
        title: `Лагерь — ${title}`,
        priority: 'P0',
        targetPath: `/game-assets/base/base-stage-02-trail-shelter.webp`,
        usedIn: ['BaseCampPage', 'BaseStageRail', 'ManifestArtScene', '/growth/camp', 'baseProgressionConfig'],
        relatedEntityId: entityId,
        notes: 'Dark MVP Priority Pack v1. Early shelter — fire more reliable.',
      }),
    );
    continue;
  }
  assets.push(
    needed({
      id: `base-stage-${n}`,
      type: 'camp-base-scene',
      category: 'campBase',
      title: `Лагерь — ${title}`,
      priority: 'P1',
      targetPath: `/game-assets/base/base-stage-${n}-${slug}.webp`,
      usedIn: ['BaseDashboardSummary', '/growth/camp', 'baseProgressionConfig'],
      relatedEntityId: entityId,
      promptStatus: 'planned',
      notes: 'UI uses emoji icon until scene art exists.',
    }),
  );
}

// Body ability icon set (Dark MVP pack) + per-ability entries
assets.push(
  promptReady({
    id: 'body-ability-icon-set-v1',
    type: 'body-ability-icon-set',
    category: 'bodyAbilities',
    title: 'Набор иконок Body Abilities v1 (12 шт.)',
    priority: 'P0',
    targetPath: '/game-assets/abilities/ability-{slug}.webp',
    usedIn: ['BodyAbilityV1Section', 'BodyAbilityDashboardSummary', 'bodyAbilityConfig'],
    notes:
      'Cohesive RPG token set: mobility, endurance, dailyLife, confidence, clothing, recovery. Not medical icons.',
  }),
);
for (const [entityId, slug, title] of BODY_ABILITIES) {
  assets.push(
    promptReady({
      id: `ability-${entityId}`,
      type: 'body-ability-icon',
      category: 'bodyAbilities',
      title: `Способность — ${title}`,
      priority: 'P0',
      targetPath: `/game-assets/abilities/ability-${slug}.webp`,
      usedIn: [
        'BodyAbilitySkillBoard',
        'BodyAbilitySkillCard',
        'BodyAbilityArtMedallion',
        'BodyAbilityV1Section',
        'BodyAbilityDashboardSummary',
        'BodyAbilitiesPage',
      ],
      relatedEntityId: entityId,
      notes:
        'Body Ability Icons mini-batch prepared. UI uses emoji from bodyAbilityConfig until icon ships.',
    }),
  );
}

// Season rewards
for (const [seasonId, slug, rewardName] of SEASON_REWARDS) {
  const n = String(seasonId).padStart(2, '0');
  if (seasonId === 1) {
    assets.push(
      promptReady({
        id: 'season-01-reward-core-spark',
        type: 'season-reward',
        category: 'seasonRewards',
        title: `Награда сезона 1 — ${rewardName}`,
        priority: 'P1',
        targetPath: `/game-assets/rewards/season-01-core-spark.webp`,
        usedIn: ['seasonConfig', 'SeasonDashboardSummary', 'ManifestArtScene'],
        relatedEntityId: 'season_01_reward',
        notes: 'Dark MVP Priority Pack v1. Small reward for igniting the system.',
      }),
    );
    continue;
  }
  assets.push(
    needed({
      id: `season-reward-${n}`,
      type: 'season-reward',
      category: 'seasonRewards',
      title: `Награда сезона ${seasonId} — ${rewardName}`,
      priority: 'P1',
      targetPath: `/game-assets/rewards/season-${n}-${slug}.webp`,
      usedIn: ['seasonConfig', 'SeasonDashboardSummary'],
      relatedEntityId: `season_${n}_reward`,
      promptStatus: 'planned',
      notes: 'Text-only reward name in Seasons v1.',
    }),
  );
}

// Plateau artifact
assets.push(
  promptReady({
    id: 'plateau-artifact-pass-stone',
    type: 'plateau-artifact',
    category: 'plateauArtifacts',
    title: 'Камень перевала — удержание маршрута',
    priority: 'P1',
    targetPath: '/game-assets/artifacts/plateau-pass-stone.webp',
    usedIn: ['PlateauDashboardSummary', 'achievement plateau_route_guardian'],
    relatedEntityId: 'plateau_route_guardian',
    notes: 'Dark MVP Priority Pack v1. Calm holding seal — not failure imagery.',
  }),
);

// Onboarding & empty states
assets.push(
  promptReady({
    id: 'onboarding-core-awakening',
    type: 'onboarding-hero',
    category: 'onboardingArt',
    title: 'Onboarding — Пробуждение ядра',
    priority: 'P0',
    targetPath: '/game-assets/onboarding/core-awakening.webp',
    usedIn: ['/start', 'StartRoutePage', 'ManifestArtScene'],
    notes: 'Dark MVP Priority Pack v1. Route has begun — core light in ruins.',
  }),
  promptReady({
    id: 'empty-state-no-entries',
    type: 'empty-state',
    category: 'emptyStates',
    title: 'Empty state — нет записей',
    priority: 'P0',
    targetPath: '/game-assets/empty-states/no-entries.webp',
    usedIn: ['Dashboard', 'Measurements', 'Today history', 'generic lists'],
    notes: 'Dark MVP Priority Pack v1. Inviting, not shameful — first traces will appear here.',
  }),
  needed({
    id: 'empty-state-campaign-quiet',
    type: 'empty-state',
    category: 'emptyStates',
    title: 'Empty state — кампания в тишине',
    priority: 'P0',
    targetPath: '/game-assets/ui/empty-campaign-quiet.webp',
    usedIn: ['Season recap stub', 'Growth hub'],
    promptStatus: 'planned',
    notes: 'Soft placeholder; no broken images.',
  }),
);

// Achievement badges (set-level P2)
assets.push(
  needed({
    id: 'achievement-badge-set',
    type: 'achievement-badge-set',
    category: 'achievementBadges',
    title: 'Набор значков достижений',
    priority: 'P2',
    targetPath: '/game-assets/achievements/badge-{iconKey}.webp',
    usedIn: ['Growth achievements', 'constants/achievements iconKey'],
    promptStatus: 'planned',
    notes: 'P2/P3: per-achievement badges; UI uses tier colors + emoji today.',
  }),
);

// Codex artifacts (paths in assetPaths.ts; files mostly missing — tracked as one set)
assets.push(
  needed({
    id: 'codex-artifact-set',
    type: 'artifact-set',
    category: 'seasonRewards',
    title: 'Набор артефактов Codex (15 шт.)',
    priority: 'P2',
    targetPath: '/game-assets/artifacts/{artifact-slug}.webp',
    usedIn: ['Codex', 'assetRegistry', 'assetPaths.ts'],
    promptStatus: 'planned',
    notes:
      'Individual slugs: beer-staff, clarity-crystal, recovery-shield, etc. Legacy .png paths in code.',
  }),
);

// UI logo
assets.push(
  needed({
    id: 'logo-dark-fantasy',
    type: 'logo',
    category: 'uiIcons',
    title: 'Логотип — Dark Fantasy',
    priority: 'P3',
    targetPath: '/game-assets/logos/logo-dark-fantasy.webp',
    usedIn: ['Header', 'brandbook'],
    source: 'ChatGPT Images',
    promptStatus: 'planned',
    notes: 'Huginn/Muninn heraldic direction. Pending generation.',
  }),
);

/** Dark MVP Asset Generation Batch 1 — disk sync; in-app when UI wired. */
const DARK_MVP_BATCH_1_IDS = [
  'onboarding-core-awakening',
  'camp-base-stage-01-ember-camp',
  'camp-base-stage-02-shelter',
  'season-01-reward-core-spark',
];

/** Set true after ManifestArtScene is wired in onboarding, camp, and season UI. */
const BATCH_1_IN_APP = true;

function syncBatch1FromDisk(assetList) {
  let onDisk = 0;
  for (const id of DARK_MVP_BATCH_1_IDS) {
    const asset = assetList.find((a) => a.id === id);
    if (!asset?.targetPath) continue;
    const diskPath = join(root, 'public', asset.targetPath.replace(/^\//, ''));
    if (!existsSync(diskPath)) {
      continue;
    }
    onDisk += 1;
    const ext = extname(diskPath).toLowerCase();
    asset.path = asset.targetPath;
    asset.fileStatus = 'ready';
    asset.promptStatus = 'ready';
    if (BATCH_1_IN_APP) {
      asset.status = 'in-app';
      asset.notes = `${asset.notes || ''} Batch 1 connected in UI (${ext}).`.trim();
    } else {
      asset.status = ext === '.webp' ? 'processed' : 'generated';
      asset.notes = `${asset.notes || ''} Batch 1 on disk (${ext}); not in-app until UI wire.`.trim();
    }
  }
  return onDisk;
}

const batch1OnDisk = syncBatch1FromDisk(assets);
const batch1InApp =
  BATCH_1_IN_APP && batch1OnDisk === DARK_MVP_BATCH_1_IDS.length;

/** Dark MVP Asset Generation Batch 2 — prompt-ready; body ability icons excluded. */
const DARK_MVP_BATCH_2_IDS = [
  'empty-state-no-entries',
  'plateau-artifact-pass-stone',
  'season-boss-01-empty-day-lord',
];

/** Set true after Batch 2 assets are wired in empty state, plateau, and season boss UI. */
const BATCH_2_IN_APP = true;

function syncBatch2FromDisk(assetList) {
  let onDisk = 0;
  for (const id of DARK_MVP_BATCH_2_IDS) {
    const asset = assetList.find((a) => a.id === id);
    if (!asset?.targetPath) continue;
    const diskPath = join(root, 'public', asset.targetPath.replace(/^\//, ''));
    if (!existsSync(diskPath)) continue;
    onDisk += 1;
    const ext = extname(diskPath).toLowerCase();
    asset.path = asset.targetPath;
    asset.fileStatus = 'ready';
    asset.promptStatus = 'ready';
    if (BATCH_2_IN_APP) {
      asset.status = 'in-app';
      asset.notes = `${asset.notes || ''} Batch 2 connected in UI (${ext}).`.trim();
    } else {
      asset.status = ext === '.webp' ? 'processed' : 'generated';
      asset.notes = `${asset.notes || ''} Batch 2 on disk (${ext}); not in-app until UI wire.`.trim();
    }
  }
  return onDisk;
}

const BODY_ABILITY_ICON_IDS = BODY_ABILITIES.map(([entityId]) => `ability-${entityId}`);

/** First visual group — skill board wired via BodyAbilityArtMedallion. */
const BODY_ABILITY_ICON_GROUP1_ENTITY_IDS = [
  'tie_shoes_easier',
  'stand_from_floor',
  'stairs_breath',
  'long_route',
];
const BODY_ABILITY_ICON_GROUP1_IDS = BODY_ABILITY_ICON_GROUP1_ENTITY_IDS.map(
  (entityId) => `ability-${entityId}`,
);

/** Set true when group-1 icons are on disk and wired in /growth/abilities skill board. */
const BODY_ABILITY_ICON_GROUP1_IN_APP = true;

/** Second visual group — daily life / clothing quartet on skill board. */
const BODY_ABILITY_ICON_GROUP2_ENTITY_IDS = [
  'stand_easier',
  'car_easier',
  'clothing_freer',
  'household_easier',
];
const BODY_ABILITY_ICON_GROUP2_IDS = BODY_ABILITY_ICON_GROUP2_ENTITY_IDS.map(
  (entityId) => `ability-${entityId}`,
);

/** Set true when group-2 icons are on disk and wired in /growth/abilities skill board. */
const BODY_ABILITY_ICON_GROUP2_IN_APP = true;

/** Final visual group — confidence / recovery / journal / stairs-up on skill board. */
const BODY_ABILITY_ICON_GROUP3_ENTITY_IDS = [
  'movement_confidence',
  'recovery_awareness',
  'journal_clarity',
  'stairs_easier',
];
const BODY_ABILITY_ICON_GROUP3_IDS = BODY_ABILITY_ICON_GROUP3_ENTITY_IDS.map(
  (entityId) => `ability-${entityId}`,
);

/** Set true when group-3 icons complete Body Ability Icons v1 (12/12) on skill board. */
const BODY_ABILITY_ICON_GROUP3_IN_APP = true;

const BODY_ABILITY_ICON_IN_APP_IDS = new Set([
  ...(BODY_ABILITY_ICON_GROUP1_IN_APP ? BODY_ABILITY_ICON_GROUP1_IDS : []),
  ...(BODY_ABILITY_ICON_GROUP2_IN_APP ? BODY_ABILITY_ICON_GROUP2_IDS : []),
  ...(BODY_ABILITY_ICON_GROUP3_IN_APP ? BODY_ABILITY_ICON_GROUP3_IDS : []),
]);

function bodyAbilityIconGroupNumber(id) {
  if (BODY_ABILITY_ICON_GROUP3_IDS.includes(id)) return 3;
  if (BODY_ABILITY_ICON_GROUP2_IDS.includes(id)) return 2;
  if (BODY_ABILITY_ICON_GROUP1_IDS.includes(id)) return 1;
  return null;
}

function syncBodyAbilityIconsFromDisk(assetList) {
  let onDisk = 0;
  let inApp = 0;
  for (const id of BODY_ABILITY_ICON_IDS) {
    const asset = assetList.find((a) => a.id === id);
    if (!asset?.targetPath) continue;
    const diskPath = join(root, 'public', asset.targetPath.replace(/^\//, ''));
    if (!existsSync(diskPath)) continue;
    onDisk += 1;
    const ext = extname(diskPath).toLowerCase();
    asset.path = asset.targetPath;
    asset.fileStatus = 'ready';
    asset.promptStatus = 'ready';
    if (BODY_ABILITY_ICON_IN_APP_IDS.has(id)) {
      asset.status = 'in-app';
      inApp += 1;
      const group = bodyAbilityIconGroupNumber(id);
      asset.notes = `${asset.notes || ''} Body ability icon group ${group} connected in skill board (${ext}).`.trim();
    } else {
      asset.status = ext === '.webp' ? 'processed' : 'generated';
      asset.notes = `${asset.notes || ''} Icon on disk (${ext}); not in-app until UI wire.`.trim();
    }
  }
  return { onDisk, inApp };
}

const batch2OnDisk = syncBatch2FromDisk(assets);
const { onDisk: bodyAbilityIconsOnDisk, inApp: bodyAbilityIconsInApp } =
  syncBodyAbilityIconsFromDisk(assets);
const bodyAbilityIconsGroup1InApp =
  BODY_ABILITY_ICON_GROUP1_IN_APP &&
  BODY_ABILITY_ICON_GROUP1_IDS.every((id) =>
    assets.find((a) => a.id === id && a.status === 'in-app'),
  );
const bodyAbilityIconsGroup2InApp =
  BODY_ABILITY_ICON_GROUP2_IN_APP &&
  BODY_ABILITY_ICON_GROUP2_IDS.every((id) =>
    assets.find((a) => a.id === id && a.status === 'in-app'),
  );
const bodyAbilityIconsGroup3InApp =
  BODY_ABILITY_ICON_GROUP3_IN_APP &&
  BODY_ABILITY_ICON_GROUP3_IDS.every((id) =>
    assets.find((a) => a.id === id && a.status === 'in-app'),
  );
const bodyAbilityIconsV1CompleteInApp =
  bodyAbilityIconsInApp === BODY_ABILITY_ICON_IDS.length;
const bodyAbilityIconsPartialInApp =
  bodyAbilityIconsInApp > 0 && bodyAbilityIconsInApp < BODY_ABILITY_ICON_IDS.length;
const batch2InApp =
  BATCH_2_IN_APP && batch2OnDisk === DARK_MVP_BATCH_2_IDS.length;

const manifest = {
  version: 2,
  schema: 'asset-registry-2.0',
  updated: '2026-06-06',
  gameAssetVersion: bodyAbilityIconsV1CompleteInApp
    ? '24'
    : bodyAbilityIconsGroup2InApp && bodyAbilityIconsInApp >= 8
      ? '23'
      : bodyAbilityIconsGroup1InApp
        ? '22'
        : '21',
  darkMvpVisualPriorityPackV1: {
    updated: '2026-06-06',
    description: 'Dark MVP Priority Pack v1 — Batch 1 (4 assets) in-app',
    assetIds: [
      'onboarding-core-awakening',
      'empty-state-no-entries',
      'body-ability-icon-set-v1',
      'camp-base-stage-01-ember-camp',
      'camp-base-stage-02-shelter',
      'plateau-artifact-pass-stone',
      'season-01-reward-core-spark',
      'season-boss-01-empty-day-lord',
    ],
  },
  darkMvpAssetGenerationBatch1: {
    updated: '2026-06-06',
    status: batch1InApp
      ? 'in-app'
      : batch1OnDisk === DARK_MVP_BATCH_1_IDS.length
        ? 'files-on-disk'
        : 'awaiting-generation',
    description:
      'First Dark MVP generation drop: onboarding + camp stages 1–2 + season 1 reward. Cozy variant excluded.',
    assetIds: DARK_MVP_BATCH_1_IDS,
    filesOnDisk: batch1OnDisk,
    filesExpected: DARK_MVP_BATCH_1_IDS.length,
    inApp: batch1InApp,
    promptQueue: 'docs/prompts/assets/BATCH-01-nano-banana-queue.md',
    workflow:
      'Generate → place in public/game-assets/ → node scripts/build-asset-manifest.mjs → in-app when BATCH_1_IN_APP',
  },
  darkMvpAssetGenerationBatch2: {
    updated: '2026-06-06',
    status: batch2InApp
      ? 'in-app'
      : batch2OnDisk === DARK_MVP_BATCH_2_IDS.length
        ? 'files-on-disk'
        : 'awaiting-generation',
    description:
      'Second Dark MVP generation drop: empty state + plateau artifact + season 1 boss. Body ability icon set excluded (separate mini-batch). Cozy variant excluded.',
    assetIds: DARK_MVP_BATCH_2_IDS,
    filesOnDisk: batch2OnDisk,
    filesExpected: DARK_MVP_BATCH_2_IDS.length,
    inApp: batch2InApp,
    promptQueue: 'docs/prompts/assets/BATCH-02-nano-banana-queue.md',
    workflow:
      'Generate → place in public/game-assets/ → node scripts/build-asset-manifest.mjs → processed; UI wire in separate sprint',
    excludedFromBatch: ['body-ability-icon-set-v1'],
  },
  bodyAbilityIconsMiniBatch: {
    updated: '2026-06-06',
    status:
      bodyAbilityIconsInApp === BODY_ABILITY_ICON_IDS.length
        ? 'in-app'
        : bodyAbilityIconsInApp > 0
          ? 'partial-in-app'
          : bodyAbilityIconsOnDisk === BODY_ABILITY_ICON_IDS.length
            ? 'files-on-disk'
            : bodyAbilityIconsOnDisk > 0
              ? 'partial-on-disk'
              : 'prepared',
    description: bodyAbilityIconsV1CompleteInApp
      ? 'Body Ability Icons v1 complete: 12/12 in-app on skill board. Visual icon set v1 done; Body Abilities system may expand later (24–36). Cozy variant excluded.'
      : bodyAbilityIconsInApp === BODY_ABILITY_ICON_IDS.length
        ? 'Body Ability Icons mini-batch: 12/12 in-app on skill board. Cozy variant excluded.'
        : bodyAbilityIconsGroup2InApp
          ? 'Body Ability Icons mini-batch: groups 1–2 (8/12) in-app on skill board; remaining 4 prompt-ready with glyph fallback. Cozy variant excluded.'
          : bodyAbilityIconsGroup1InApp
            ? 'Body Ability Icons mini-batch: group 1 (4/12) in-app on skill board; remaining 8 prompt-ready with glyph fallback. Cozy variant excluded.'
            : 'Body Ability Icons mini-batch: 12 RPG tokens for Body Abilities v1. Prompt-ready; generation pending. UI wire later. Cozy variant excluded.',
    setAssetId: 'body-ability-icon-set-v1',
    assetIds: BODY_ABILITY_ICON_IDS,
    filesOnDisk: bodyAbilityIconsOnDisk,
    filesExpected: BODY_ABILITY_ICON_IDS.length,
    filesInApp: bodyAbilityIconsInApp,
    inApp: bodyAbilityIconsInApp === BODY_ABILITY_ICON_IDS.length,
    promptQueue: 'docs/prompts/assets/BODY-ABILITY-ICONS-mini-batch-queue.md',
    workflow:
      'Generate per prompt → public/game-assets/abilities/ → node scripts/build-asset-manifest.mjs → in-app per group when GROUP1/2/3 flags set',
    source: 'src/game/bodyAbilities/bodyAbilityConfig.ts',
    group1InApp: bodyAbilityIconsGroup1InApp,
    group1AssetIds: BODY_ABILITY_ICON_GROUP1_IDS,
    group2InApp: bodyAbilityIconsGroup2InApp,
    group2AssetIds: BODY_ABILITY_ICON_GROUP2_IDS,
    group3InApp: bodyAbilityIconsGroup3InApp,
    group3AssetIds: BODY_ABILITY_ICON_GROUP3_IDS,
    v1Complete: bodyAbilityIconsV1CompleteInApp,
  },
  conventions: {
    naming:
      'lowercase kebab-case: {entity-type}-{index}-{semantic-name}.webp under public/game-assets/{category-folder}/',
    preferredFormat: 'webp for runtime; png legacy allowed; heavy sources not in public/',
    placeholderStrategy:
      'Every missing asset uses emoji/icon/glow/card fallback in UI. Never render broken <img> src. getAssetPathOrNull() returns null until status in-app|done.',
    promptPathPattern: 'docs/prompts/assets/{asset-id}.md',
  },
  categories: [
    'hero', 'femaleHero', 'bodyStages', 'journeyChapters', 'companions', 'dailyMobs',
    'seasonBosses', 'chapterBosses', 'actBosses', 'campBase', 'bodyAbilities',
    'seasonRewards', 'plateauArtifacts', 'achievementBadges', 'onboardingArt',
    'emptyStates', 'uiIcons',
  ],
  statuses: [
    'idea', 'needed', 'prompt-ready', 'generated', 'processed', 'in-app', 'needs-redesign', 'done',
  ],
  priorities: ['P0', 'P1', 'P2', 'P3'],
  assets,
};

const outPath = join(root, 'docs/assets/manifest.json');
writeFileSync(outPath, JSON.stringify(manifest, null, 2) + '\n', 'utf-8');
console.log(`Wrote ${assets.length} assets to ${outPath}`);
console.log(`Dark MVP Batch 1: ${batch1OnDisk}/${DARK_MVP_BATCH_1_IDS.length} files on disk`);
console.log(`Dark MVP Batch 2: ${batch2OnDisk}/${DARK_MVP_BATCH_2_IDS.length} files on disk`);
console.log(
  `Body Ability Icons mini-batch: ${bodyAbilityIconsOnDisk}/${BODY_ABILITY_ICON_IDS.length} on disk, ${bodyAbilityIconsInApp} in-app`,
);
