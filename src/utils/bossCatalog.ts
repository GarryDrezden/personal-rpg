import { WEEKLY_BOSS_TEMPLATES, type BossTemplateId } from '../constants/bosses';
import type { AppSettings, DailyEntry, MeasurementEntry } from '../types';
import type { WeeklyBoss } from '../types/boss';
import { getBossHistory, getWeeklyBoss } from './bossEngine';
import { todayISO, weekStart } from './dates';

export type BossCatalogStatus =
  | 'pending'
  | 'active'
  | 'failed'
  | 'defeated'
  | 'perfect';

export type BossCatalogEntry = {
  templateId: BossTemplateId;
  status: BossCatalogStatus;
  encounters: number;
  defeats: number;
  perfects: number;
  lastWeekStart?: string;
  activeBoss?: WeeklyBoss;
};

function resolveCatalogStatus(
  encounters: WeeklyBoss[],
  isActive: boolean,
): BossCatalogStatus {
  if (encounters.length === 0) return 'pending';

  const hasPerfect = encounters.some((b) => b.status === 'perfect');
  const hasDefeat = encounters.some(
    (b) => b.status === 'defeated' || b.status === 'perfect',
  );

  if (isActive) {
    const current = encounters[encounters.length - 1]!;
    if (current.status === 'perfect') return 'perfect';
    if (current.status === 'defeated') return 'defeated';
    return 'active';
  }

  if (hasPerfect) return 'perfect';
  if (hasDefeat) return 'defeated';
  return 'failed';
}

export function getBossCatalog(params: {
  dailyEntries: DailyEntry[];
  measurements: MeasurementEntry[];
  settings: AppSettings;
  today?: string;
}): BossCatalogEntry[] {
  const today = params.today ?? todayISO();
  const currentWs = weekStart(today);
  const history = getBossHistory(
    params.dailyEntries,
    params.settings,
    params.measurements,
  );
  const currentBoss = getWeeklyBoss({
    weekStart: currentWs,
    dailyEntries: params.dailyEntries,
    settings: params.settings,
    measurements: params.measurements,
  });

  return WEEKLY_BOSS_TEMPLATES.map((template) => {
    const encounters = history.filter((b) => b.templateId === template.id);
    const isActive = currentBoss.templateId === template.id;
    const status = resolveCatalogStatus(encounters, isActive);

    return {
      templateId: template.id,
      status,
      encounters: encounters.length,
      defeats: encounters.filter(
        (b) => b.status === 'defeated' || b.status === 'perfect',
      ).length,
      perfects: encounters.filter((b) => b.status === 'perfect').length,
      lastWeekStart: encounters[encounters.length - 1]?.weekStart,
      activeBoss: isActive ? currentBoss : undefined,
    };
  });
}

export const BOSS_CATALOG_STATUS_LABELS: Record<BossCatalogStatus, string> = {
  pending: 'Ещё впереди',
  active: 'Сражение сейчас',
  failed: 'Не побеждён',
  defeated: 'Повержен',
  perfect: 'Идеальная победа',
};
