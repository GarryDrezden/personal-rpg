import type { AppThemeId } from '../types/theme';
import type { BossId, CompanionId, MobId } from '../types/gameAssets';
import {
  COZY_BOSS_COPY,
  COZY_FALLBACK_ENTITY,
  COZY_MOB_COPY,
} from '../constants/cozyContentPack';
import {
  getThemeAsset,
  getThemeAssetCandidates,
  type ThemeAssetRef,
} from './themeAssetRegistry';

export type ThemedEntityTone = 'battle' | 'cozy_challenge';

export type ThemedEntityPresentation = {
  entityId: string;
  themeId: AppThemeId;
  title: string;
  subtitle?: string;
  description?: string;
  imagePath: string;
  imageCandidates: string[];
  placeholder: boolean;
  tone: ThemedEntityTone;
  asset: ThemeAssetRef;
};

const COZY_COMPANION: Record<
  CompanionId,
  { title: string; subtitle: string; description: string }
> = {
  golden_chinchilla_cat: {
    title: 'Кот у печки',
    subtitle: 'Домашний спутник',
    description: 'Греется там, где появляется уют. Ждёт спокойных вечеров.',
  },
  alabai: {
    title: 'Пёс во дворе',
    subtitle: 'Дворовой спутник',
    description: 'Рад движению и расчищенной тропинке.',
  },
  raven: {
    title: 'Птица на кормушке',
    subtitle: 'Садовый спутник',
    description: 'Прилетает, когда во дворе появляется порядок.',
  },
  fox_cub: {
    title: 'Лисёнок в саду',
    subtitle: 'Садовый спутник',
    description: 'Любопытный гость грядок и тёплых тропинок.',
  },
};

export function getMobPresentation(
  themeId: AppThemeId,
  mobId: MobId,
  darkMeta: { title: string; subtitle: string; description: string; image: string },
): ThemedEntityPresentation {
  if (themeId !== 'cozy') {
    return {
      entityId: mobId,
      themeId,
      title: darkMeta.title,
      subtitle: darkMeta.subtitle,
      description: darkMeta.description,
      imagePath: darkMeta.image,
      imageCandidates: [darkMeta.image],
      placeholder: false,
      tone: 'battle',
      asset: getThemeAsset({ themeId, kind: 'mob', entityId: mobId }),
    };
  }

  const cozy = COZY_MOB_COPY[mobId] ?? COZY_FALLBACK_ENTITY;
  const asset = getThemeAsset({ themeId: 'cozy', kind: 'mob', entityId: mobId });
  return {
    entityId: mobId,
    themeId: 'cozy',
    title: cozy.title,
    subtitle: cozy.subtitle,
    description: cozy.description,
    imagePath: asset.path,
    imageCandidates: getThemeAssetCandidates(asset),
    placeholder: asset.placeholder,
    tone: 'cozy_challenge',
    asset,
  };
}

export function getBossPresentation(
  themeId: AppThemeId,
  bossId: BossId,
  darkMeta: { title: string; subtitle?: string; description: string; image: string },
): ThemedEntityPresentation {
  if (themeId !== 'cozy') {
    return {
      entityId: bossId,
      themeId,
      title: darkMeta.title,
      subtitle: darkMeta.subtitle,
      description: darkMeta.description,
      imagePath: darkMeta.image,
      imageCandidates: [darkMeta.image],
      placeholder: false,
      tone: 'battle',
      asset: getThemeAsset({ themeId, kind: 'boss', entityId: bossId }),
    };
  }

  const cozy = COZY_BOSS_COPY[bossId] ?? COZY_FALLBACK_ENTITY;
  const asset = getThemeAsset({ themeId: 'cozy', kind: 'boss', entityId: bossId });
  return {
    entityId: bossId,
    themeId: 'cozy',
    title: cozy.title,
    subtitle: cozy.subtitle,
    description: cozy.description,
    imagePath: asset.path,
    imageCandidates: getThemeAssetCandidates(asset),
    placeholder: asset.placeholder,
    tone: 'cozy_challenge',
    asset,
  };
}

export function getCompanionPresentation(
  themeId: AppThemeId,
  companionId: CompanionId,
  darkMeta: { title: string; subtitle: string; description: string; image: string },
): ThemedEntityPresentation {
  if (themeId !== 'cozy') {
    return {
      entityId: companionId,
      themeId,
      title: darkMeta.title,
      subtitle: darkMeta.subtitle,
      description: darkMeta.description,
      imagePath: darkMeta.image,
      imageCandidates: [darkMeta.image],
      placeholder: false,
      tone: 'battle',
      asset: getThemeAsset({ themeId, kind: 'companion', entityId: companionId }),
    };
  }

  const cozy = COZY_COMPANION[companionId];
  const asset = getThemeAsset({
    themeId: 'cozy',
    kind: 'companion',
    entityId: companionId,
  });
  return {
    entityId: companionId,
    themeId: 'cozy',
    title: cozy.title,
    subtitle: cozy.subtitle,
    description: cozy.description,
    imagePath: asset.path,
    imageCandidates: getThemeAssetCandidates(asset),
    placeholder: asset.placeholder,
    tone: 'cozy_challenge',
    asset,
  };
}
