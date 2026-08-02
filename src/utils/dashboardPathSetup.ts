import type { AppSettings, MeasurementEntry } from '../types';
import type { AppThemeId } from '../types/theme';
import { getThemedEmptyStateCopy } from '../constants/themeContentRegistry';
import { resolveTargetWeight } from '../game/gameProfile';
import { getStartWeight } from '../game/heroProgressEngine';

export type PathSetupState =
  | { kind: 'ready' }
  | {
      kind: 'no_weight';
      title: string;
      description: string;
      ctaLabel: string;
      ctaRoute: string;
    }
  | {
      kind: 'no_target';
      title: string;
      description: string;
      ctaLabel: string;
      ctaRoute: string;
    };

function isAppSettings(
  value: number | null | undefined | AppSettings,
): value is AppSettings {
  return typeof value === 'object' && value !== null;
}

export function getPathSetupState(
  measurements: MeasurementEntry[],
  targetWeightOrSettings: number | null | undefined | AppSettings,
  themeId: AppThemeId = 'darkFantasy',
): PathSetupState {
  const settings = isAppSettings(targetWeightOrSettings) ? targetWeightOrSettings : null;
  const resolvedTheme =
    settings?.themeId != null ? (settings.themeId as AppThemeId) : themeId;
  const targetWeight = settings
    ? resolveTargetWeight(settings)
    : (targetWeightOrSettings as number | null | undefined);

  const startWeight = getStartWeight(measurements);

  if (startWeight === null) {
    const copy = getThemedEmptyStateCopy(resolvedTheme, 'noWeight');
    return {
      kind: 'no_weight',
      title: copy.title,
      description: copy.description,
      ctaLabel: copy.ctaLabel ?? 'Добавить вес',
      ctaRoute: '/measurements',
    };
  }

  if (
    targetWeight === null ||
    targetWeight === undefined ||
    !Number.isFinite(targetWeight) ||
    targetWeight <= 0
  ) {
    const copy = getThemedEmptyStateCopy(resolvedTheme, 'noTarget');
    return {
      kind: 'no_target',
      title: copy.title,
      description: copy.description,
      ctaLabel: copy.ctaLabel ?? 'Указать цель',
      ctaRoute: '/settings#settings-weight',
    };
  }

  return { kind: 'ready' };
}
