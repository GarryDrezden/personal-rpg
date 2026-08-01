import type { AppSettings, DailyEntry } from '../types';
import type {
  CozyHomeState,
  CozyHomeZoneId,
  CozyHomeZoneState,
  CozyResourceId,
  CozyRewardsGranted,
  CozyHomeUpgradeLevel,
} from '../types/cozyHome';
import {
  COZY_HOME_MAX_LEVEL,
  COZY_HOME_MAX_UPGRADES,
  COZY_HOME_ZONE_IDS,
  COZY_RESOURCE_LABELS,
  getCozyZoneConfig,
  getCozyZoneLevelDef,
} from '../constants/cozyHomeConfig';
import { getCozyRewardsForEntry } from './cozyHomeRewardsEngine';

function emptyResources(): Record<CozyResourceId, number> {
  return { comfort: 0, materials: 0, garden: 0, clarity: 0 };
}

function defaultZones(): Record<CozyHomeZoneId, CozyHomeZoneState> {
  return Object.fromEntries(
    COZY_HOME_ZONE_IDS.map((id) => [id, { zoneId: id, level: 0 }]),
  ) as Record<CozyHomeZoneId, CozyHomeZoneState>;
}

export const DEFAULT_COZY_HOME_STATE: CozyHomeState = {
  resources: emptyResources(),
  zones: defaultZones(),
  totalUpgrades: 0,
  lastUpdatedAt: null,
  lastUpgrade: null,
};

export function normalizeCozyHomeState(
  raw: CozyHomeState | null | undefined,
): CozyHomeState {
  const base = DEFAULT_COZY_HOME_STATE;
  if (!raw || typeof raw !== 'object') return structuredClone(base);

  const resources = emptyResources();
  for (const id of Object.keys(resources) as CozyResourceId[]) {
    const v = raw.resources?.[id];
    resources[id] = typeof v === 'number' && Number.isFinite(v) ? Math.max(0, Math.floor(v)) : 0;
  }

  const zones = defaultZones();
  for (const id of COZY_HOME_ZONE_IDS) {
    const z = raw.zones?.[id];
    const level =
      typeof z?.level === 'number' && Number.isFinite(z.level)
        ? Math.max(0, Math.min(COZY_HOME_MAX_LEVEL, Math.floor(z.level)))
        : 0;
    zones[id] = {
      zoneId: id,
      level,
      unlockedAt: z?.unlockedAt ?? null,
      upgradedAt: z?.upgradedAt ?? null,
    };
  }

  const totalUpgrades = COZY_HOME_ZONE_IDS.reduce(
    (sum, id) => sum + (zones[id]?.level ?? 0),
    0,
  );

  return {
    resources,
    zones,
    totalUpgrades,
    lastUpdatedAt: raw.lastUpdatedAt ?? null,
    lastUpgrade: raw.lastUpgrade ?? null,
  };
}

export function getCozyHomeState(settings: AppSettings): CozyHomeState {
  return normalizeCozyHomeState(settings.cozyHome);
}

export function withCozyHomeState(
  settings: AppSettings,
  home: CozyHomeState,
): AppSettings {
  return {
    ...settings,
    cozyHome: normalizeCozyHomeState(home),
  };
}

export function getCozyHomeProgress(home: CozyHomeState): {
  done: number;
  total: number;
  percent: number;
} {
  const done = home.totalUpgrades;
  const total = COZY_HOME_MAX_UPGRADES;
  return {
    done,
    total,
    percent: total > 0 ? Math.round((done / total) * 100) : 0,
  };
}

function missingCost(
  have: Record<CozyResourceId, number>,
  cost: Partial<Record<CozyResourceId, number>>,
): Partial<Record<CozyResourceId, number>> {
  const missing: Partial<Record<CozyResourceId, number>> = {};
  for (const [id, need] of Object.entries(cost) as [CozyResourceId, number][]) {
    if (!need) continue;
    const gap = need - (have[id] ?? 0);
    if (gap > 0) missing[id] = gap;
  }
  return missing;
}

export function canUpgradeCozyZone(
  homeState: CozyHomeState,
  zoneId: CozyHomeZoneId,
): {
  canUpgrade: boolean;
  nextLevel?: CozyHomeUpgradeLevel;
  missingResources?: Partial<Record<CozyResourceId, number>>;
  isMax: boolean;
} {
  const home = normalizeCozyHomeState(homeState);
  const current = home.zones[zoneId]?.level ?? 0;
  if (current >= COZY_HOME_MAX_LEVEL) {
    return { canUpgrade: false, isMax: true };
  }
  const nextLevel = getCozyZoneLevelDef(zoneId, current + 1);
  const cost = nextLevel.cost ?? {};
  const missing = missingCost(home.resources, cost);
  const canUpgrade = Object.keys(missing).length === 0;
  return {
    canUpgrade,
    nextLevel,
    missingResources: canUpgrade ? undefined : missing,
    isMax: false,
  };
}

export function upgradeCozyZone(
  homeState: CozyHomeState,
  zoneId: CozyHomeZoneId,
  at = new Date().toISOString(),
): CozyHomeState {
  const home = normalizeCozyHomeState(homeState);
  const check = canUpgradeCozyZone(home, zoneId);
  if (!check.canUpgrade || !check.nextLevel) return home;

  const cost = check.nextLevel.cost ?? {};
  const resources = { ...home.resources };
  for (const [id, need] of Object.entries(cost) as [CozyResourceId, number][]) {
    resources[id] = Math.max(0, (resources[id] ?? 0) - (need ?? 0));
  }

  const nextLevelNum = check.nextLevel.level;
  const zones = {
    ...home.zones,
    [zoneId]: {
      zoneId,
      level: nextLevelNum,
      unlockedAt: home.zones[zoneId]?.unlockedAt ?? (nextLevelNum === 1 ? at : null),
      upgradedAt: at,
    },
  };

  const totalUpgrades = COZY_HOME_ZONE_IDS.reduce(
    (sum, id) => sum + (zones[id]?.level ?? 0),
    0,
  );

  return {
    resources,
    zones,
    totalUpgrades,
    lastUpdatedAt: at,
    lastUpgrade: {
      zoneId,
      level: nextLevelNum,
      title: check.nextLevel.title,
      at,
    },
  };
}

export function addCozyResources(
  homeState: CozyHomeState,
  gain: Partial<Record<CozyResourceId, number>>,
  at = new Date().toISOString(),
): CozyHomeState {
  const home = normalizeCozyHomeState(homeState);
  const resources = { ...home.resources };
  for (const [id, n] of Object.entries(gain) as [CozyResourceId, number][]) {
    if (!n) continue;
    resources[id] = (resources[id] ?? 0) + Math.max(0, Math.floor(n));
  }
  return { ...home, resources, lastUpdatedAt: at };
}

export function findAffordableUpgrade(
  homeState: CozyHomeState,
): { zoneId: CozyHomeZoneId; nextLevel: CozyHomeUpgradeLevel } | null {
  const home = normalizeCozyHomeState(homeState);
  for (const id of COZY_HOME_ZONE_IDS) {
    const check = canUpgradeCozyZone(home, id);
    if (check.canUpgrade && check.nextLevel) {
      return { zoneId: id, nextLevel: check.nextLevel };
    }
  }
  return null;
}

export type NextCozyHomeUpgrade = {
  zoneId: CozyHomeZoneId;
  zoneTitle: string;
  nextLevelTitle: string;
  nextDescription: string;
  canUpgrade: boolean;
  missingResources?: Partial<Record<CozyResourceId, number>>;
};

/** Affordable upgrade first; otherwise the closest unfinished zone by missing resource total. */
export function getNextCozyHomeUpgrade(
  homeState: CozyHomeState,
): NextCozyHomeUpgrade | null {
  const home = normalizeCozyHomeState(homeState);
  const progress = getCozyHomeProgress(home);
  if (progress.done >= progress.total) return null;

  const affordable = findAffordableUpgrade(home);
  if (affordable) {
    const config = getCozyZoneConfig(affordable.zoneId);
    return {
      zoneId: affordable.zoneId,
      zoneTitle: config.title,
      nextLevelTitle: affordable.nextLevel.title,
      nextDescription: affordable.nextLevel.description,
      canUpgrade: true,
    };
  }

  let best: {
    zoneId: CozyHomeZoneId;
    nextLevel: CozyHomeUpgradeLevel;
    missing: Partial<Record<CozyResourceId, number>>;
    missingTotal: number;
  } | null = null;

  for (const id of COZY_HOME_ZONE_IDS) {
    const check = canUpgradeCozyZone(home, id);
    if (check.isMax || !check.nextLevel) continue;
    const missing = check.missingResources ?? {};
    const missingTotal = (Object.values(missing) as number[]).reduce(
      (sum, n) => sum + (n ?? 0),
      0,
    );
    if (!best || missingTotal < best.missingTotal) {
      best = {
        zoneId: id,
        nextLevel: check.nextLevel,
        missing,
        missingTotal,
      };
    }
  }

  if (!best) return null;
  const config = getCozyZoneConfig(best.zoneId);
  return {
    zoneId: best.zoneId,
    zoneTitle: config.title,
    nextLevelTitle: best.nextLevel.title,
    nextDescription: best.nextLevel.description,
    canUpgrade: false,
    missingResources: best.missing,
  };
}

export function getCozyUpgradeHintLine(
  homeState: CozyHomeState,
): string {
  const home = normalizeCozyHomeState(homeState);
  const progress = getCozyHomeProgress(home);
  if (progress.done >= progress.total) {
    return 'Дом полностью восстановлен. Сегодняшний день поддержал уют.';
  }
  const next = getNextCozyHomeUpgrade(home);
  if (!next) return 'Дом ждёт следующего отмеченного дня.';
  if (next.canUpgrade) {
    return `Можно улучшить: ${next.zoneTitle} — ${next.nextDescription.toLowerCase()}`;
  }
  return `Следующее улучшение стало ближе: ${next.zoneTitle} — ${next.nextDescription.toLowerCase()}`;
}

export function formatMissingResources(
  missing: Partial<Record<CozyResourceId, number>> | undefined,
): string {
  if (!missing) return '';
  return (Object.entries(missing) as [CozyResourceId, number][])
    .map(([id, n]) => `${COZY_RESOURCE_LABELS[id]} ${n}`)
    .join(' · ');
}

/**
 * Apply daily rewards once; returns patched entry + settings if granted.
 * MVP: first save that earns resources wins — later edits do not recalculate a diff.
 */
export function applyCozyRewardsOnSave(params: {
  entry: DailyEntry;
  settings: AppSettings;
  previousEntry?: DailyEntry | null;
}): {
  entry: DailyEntry;
  settings: AppSettings;
  granted: CozyRewardsGranted | null;
} {
  const { entry, settings, previousEntry } = params;
  if (entry.cozyRewardsGranted || previousEntry?.cozyRewardsGranted) {
    return {
      entry: {
        ...entry,
        cozyRewardsGranted:
          entry.cozyRewardsGranted ?? previousEntry?.cozyRewardsGranted ?? null,
      },
      settings,
      granted: null,
    };
  }

  const reward = getCozyRewardsForEntry(entry, settings);
  const total = Object.values(reward.resources).reduce((s, n) => s + (n ?? 0), 0);
  if (total <= 0) {
    return { entry, settings, granted: null };
  }

  const grantedAt = new Date().toISOString();
  const granted: CozyRewardsGranted = {
    resources: reward.resources,
    grantedAt,
    reasons: reward.reasons,
  };

  const home = addCozyResources(getCozyHomeState(settings), reward.resources, grantedAt);

  return {
    entry: { ...entry, cozyRewardsGranted: granted },
    settings: withCozyHomeState(settings, home),
    granted,
  };
}

export function getCozyZoneDisplay(
  home: CozyHomeState,
  zoneId: CozyHomeZoneId,
): {
  config: ReturnType<typeof getCozyZoneConfig>;
  level: number;
  current: CozyHomeUpgradeLevel;
  next?: CozyHomeUpgradeLevel;
  check: ReturnType<typeof canUpgradeCozyZone>;
} {
  const config = getCozyZoneConfig(zoneId);
  const level = home.zones[zoneId]?.level ?? 0;
  const current = getCozyZoneLevelDef(zoneId, level);
  const check = canUpgradeCozyZone(home, zoneId);
  return {
    config,
    level,
    current,
    next: check.nextLevel,
    check,
  };
}
