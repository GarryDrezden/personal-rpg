import { dataApi } from '../api/dataApi';
import { MOMENTUM_STORAGE_KEY } from '../constants/momentum';
import { ACHIEVEMENTS_STORAGE_KEY } from '../store/achievementStorage';
import { COINS_STORAGE_KEY } from '../store/coinStorage';
import { getStorageMode } from './storageClient';

export const SIDECAR_REMOTE_TYPES = [
  'achievements',
  'coinTransactions',
  'momentumHistory',
] as const;

export type SidecarRemoteType = (typeof SIDECAR_REMOTE_TYPES)[number];

const SIDECAR_SAVE_DEBOUNCE_MS = 1000;

const STORAGE_KEY_BY_TYPE: Record<SidecarRemoteType, string> = {
  achievements: ACHIEVEMENTS_STORAGE_KEY,
  coinTransactions: COINS_STORAGE_KEY,
  momentumHistory: MOMENTUM_STORAGE_KEY,
};

let sidecarHydrating = false;
let sidecarSaveTimer: ReturnType<typeof setTimeout> | null = null;

export function isSidecarHydrating(): boolean {
  return sidecarHydrating;
}

/** @internal test helper */
export function resetSidecarSyncForTests(): void {
  sidecarHydrating = false;
  if (sidecarSaveTimer) {
    clearTimeout(sidecarSaveTimer);
    sidecarSaveTimer = null;
  }
}

function readLocalSidecarRaw(type: SidecarRemoteType): string | null {
  return localStorage.getItem(STORAGE_KEY_BY_TYPE[type]);
}

function parseLocalSidecar(type: SidecarRemoteType): unknown | null {
  const raw = readLocalSidecarRaw(type);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return null;
  }
}

export function isEmptySidecarPayload(type: SidecarRemoteType, value: unknown): boolean {
  if (value == null) return true;
  if (type === 'momentumHistory') {
    return typeof value === 'object' && value !== null && Object.keys(value).length === 0;
  }
  return Array.isArray(value) && value.length === 0;
}

function hasLocalSidecarData(type: SidecarRemoteType): boolean {
  const local = parseLocalSidecar(type);
  return local != null && !isEmptySidecarPayload(type, local);
}

export function shouldApplyRemoteSidecar(
  type: SidecarRemoteType,
  remoteValue: unknown,
): boolean {
  if (remoteValue == null) return false;
  if (isEmptySidecarPayload(type, remoteValue) && hasLocalSidecarData(type)) {
    return false;
  }
  return true;
}

function writeLocalSidecar(type: SidecarRemoteType, value: unknown): void {
  localStorage.setItem(STORAGE_KEY_BY_TYPE[type], JSON.stringify(value));
}

/** Sync JSON sidecar data from server into localStorage for existing game modules. */
export async function hydrateLocalSidecarsFromRemote(): Promise<void> {
  if (getStorageMode() !== 'remote') return;

  sidecarHydrating = true;
  let shouldPushLocalAfterHydrate = false;

  try {
    const res = await dataApi.getAll();
    const { data } = res;

    if (data.achievements != null) {
      if (shouldApplyRemoteSidecar('achievements', data.achievements)) {
        writeLocalSidecar('achievements', data.achievements);
      } else {
        shouldPushLocalAfterHydrate = true;
      }
    }

    if (data.coinTransactions != null) {
      if (shouldApplyRemoteSidecar('coinTransactions', data.coinTransactions)) {
        writeLocalSidecar('coinTransactions', data.coinTransactions);
      } else {
        shouldPushLocalAfterHydrate = true;
      }
    }

    if (data.momentumHistory != null) {
      if (shouldApplyRemoteSidecar('momentumHistory', data.momentumHistory)) {
        writeLocalSidecar('momentumHistory', data.momentumHistory);
      } else {
        shouldPushLocalAfterHydrate = true;
      }
    }
  } finally {
    sidecarHydrating = false;
    if (shouldPushLocalAfterHydrate) {
      scheduleSidecarRemoteSave();
    }
  }
}

/** Persist localStorage sidecars to remote user_data (debounced callers use scheduleSidecarRemoteSave). */
export function collectLocalSidecarsForSave(): Partial<Record<SidecarRemoteType, unknown>> {
  const out: Partial<Record<SidecarRemoteType, unknown>> = {};

  for (const type of SIDECAR_REMOTE_TYPES) {
    const raw = readLocalSidecarRaw(type);
    if (!raw) continue;
    try {
      out[type] = JSON.parse(raw) as unknown;
    } catch {
      // skip corrupt local payload
    }
  }

  return out;
}

export async function saveLocalSidecarsToRemote(): Promise<void> {
  if (getStorageMode() !== 'remote') return;
  if (sidecarHydrating) return;

  const payload = collectLocalSidecarsForSave();
  const entries = Object.entries(payload) as [SidecarRemoteType, unknown][];

  if (entries.length === 0) return;

  await Promise.all(
    entries.map(([type, value]) => dataApi.putType(type, value)),
  );
}

export function scheduleSidecarRemoteSave(): void {
  if (getStorageMode() !== 'remote') return;
  if (sidecarHydrating) return;

  if (sidecarSaveTimer) {
    clearTimeout(sidecarSaveTimer);
  }

  sidecarSaveTimer = setTimeout(() => {
    sidecarSaveTimer = null;
    void saveLocalSidecarsToRemote().catch(logSidecarSaveError);
  }, SIDECAR_SAVE_DEBOUNCE_MS);
}

function logSidecarSaveError(error: unknown): void {
  if (import.meta.env.DEV) {
    console.warn('[sidecarSync] remote save failed', error);
  }
}
