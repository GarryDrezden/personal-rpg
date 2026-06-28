import { ACHIEVEMENTS_STORAGE_KEY } from '../store/achievementStorage';
import { COINS_STORAGE_KEY } from '../store/coinStorage';
import { MOMENTUM_STORAGE_KEY } from '../constants/momentum';
import { THEME_STORAGE_KEY } from '../constants/themes';
import { ACTIVE_COMPANION_STORAGE_KEY } from '../game/gameAssetStorage';
import { dataApi } from '../api/dataApi';
import { loadCoinTransactions } from '../store/coinStorage';
import { loadUnlockedAchievements } from '../store/achievementStorage';
import { getMomentumHistoryFromStorage } from '../utils/momentumStorage';
import { getXpTransactions } from '../utils/xpTransactionStorage';

function readJsonObject(key: string): Record<string, unknown> {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

export const LEGACY_MIGRATED_KEY = 'personal-rpg-legacy-migrated';

const LEGACY_TYPE_MAP: Array<{ key: string; type: string; loader: () => unknown }> = [
  { key: ACHIEVEMENTS_STORAGE_KEY, type: 'achievements', loader: loadUnlockedAchievements },
  { key: COINS_STORAGE_KEY, type: 'coinTransactions', loader: loadCoinTransactions },
  { key: MOMENTUM_STORAGE_KEY, type: 'momentumHistory', loader: getMomentumHistoryFromStorage },
];

export function hasLegacyLocalData(): boolean {
  if (localStorage.getItem(LEGACY_MIGRATED_KEY) === '1') return false;
  return LEGACY_TYPE_MAP.some(({ key, loader }) => {
    const raw = localStorage.getItem(key);
    if (!raw) return false;
    try {
      const data = loader();
      if (Array.isArray(data)) return data.length > 0;
      if (data && typeof data === 'object') return Object.keys(data as object).length > 0;
    } catch {
      return Boolean(raw && raw !== '[]' && raw !== '{}');
    }
    return false;
  });
}

export async function importLegacyLocalStorage(): Promise<string[]> {
  const imported: string[] = [];

  for (const { key, type, loader } of LEGACY_TYPE_MAP) {
    const raw = localStorage.getItem(key);
    if (!raw) continue;
    try {
      const payload = loader();
      const empty =
        (Array.isArray(payload) && payload.length === 0) ||
        (payload && typeof payload === 'object' && Object.keys(payload as object).length === 0);
      if (empty) continue;
      await dataApi.putType(type, payload);
      imported.push(type);
    } catch {
      /* skip broken keys */
    }
  }

  const freedom = readJsonObject('personal-rpg-seen-freedom-levels');
  if (Object.keys(freedom).length > 0) {
    await dataApi.putType('freedomHistory', freedom);
    imported.push('freedomHistory');
  }

  const body = readJsonObject('personal-rpg-seen-body-abilities');
  if (Object.keys(body).length > 0) {
    await dataApi.putType('bodyAbilities', body);
    imported.push('bodyAbilities');
  }

  const xp = getXpTransactions();
  if (xp.length > 0) {
    await dataApi.putType('coinTransactions', xp);
  }

  const theme = localStorage.getItem(THEME_STORAGE_KEY);
  const companion = localStorage.getItem(ACTIVE_COMPANION_STORAGE_KEY);
  if (theme || companion) {
    await dataApi.putType('customSettingsBackup', {
      themeId: theme,
      activeCompanionId: companion,
    });
    imported.push('customSettingsBackup');
  }

  localStorage.setItem(LEGACY_MIGRATED_KEY, '1');
  return imported;
}

export function markLegacyMigratedSkipped() {
  localStorage.setItem(LEGACY_MIGRATED_KEY, '1');
}
