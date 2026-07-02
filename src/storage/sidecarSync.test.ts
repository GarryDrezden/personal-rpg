import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MOMENTUM_STORAGE_KEY } from '../constants/momentum';
import { ACHIEVEMENTS_STORAGE_KEY } from '../store/achievementStorage';
import { COINS_STORAGE_KEY } from '../store/coinStorage';

const { getAllMock, putTypeMock, getStorageModeMock } = vi.hoisted(() => ({
  getAllMock: vi.fn(),
  putTypeMock: vi.fn(),
  getStorageModeMock: vi.fn(() => 'remote' as 'remote' | 'legacy'),
}));

vi.mock('../api/dataApi', () => ({
  dataApi: {
    getAll: getAllMock,
    putType: putTypeMock,
  },
}));

vi.mock('./storageClient', () => ({
  getStorageMode: getStorageModeMock,
}));

import {
  collectLocalSidecarsForSave,
  hydrateLocalSidecarsFromRemote,
  isEmptySidecarPayload,
  isSidecarHydrating,
  resetSidecarSyncForTests,
  saveLocalSidecarsToRemote,
  scheduleSidecarRemoteSave,
  shouldApplyRemoteSidecar,
} from './sidecarSync';

const store: Record<string, string> = {};

const localStorageMock: Storage = {
  get length() {
    return Object.keys(store).length;
  },
  clear() {
    for (const key of Object.keys(store)) delete store[key];
  },
  getItem(key: string) {
    return store[key] ?? null;
  },
  key(index: number) {
    return Object.keys(store)[index] ?? null;
  },
  removeItem(key: string) {
    delete store[key];
  },
  setItem(key: string, value: string) {
    store[key] = value;
  },
};

describe('sidecarSync', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.stubGlobal('localStorage', localStorageMock);
    localStorage.clear();
    resetSidecarSyncForTests();
    getAllMock.mockReset();
    putTypeMock.mockReset();
    getStorageModeMock.mockReturnValue('remote');
    putTypeMock.mockResolvedValue({ type: 'achievements', payload: [], updatedAt: '' });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    resetSidecarSyncForTests();
  });

  it('collectLocalSidecarsForSave builds payload from localStorage', () => {
    localStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify([{ achievementId: 'a1' }]));
    localStorage.setItem(COINS_STORAGE_KEY, JSON.stringify([{ id: 'c1', amount: 5 }]));
    localStorage.setItem(MOMENTUM_STORAGE_KEY, JSON.stringify({ '2026-01-01': { date: '2026-01-01' } }));

    const payload = collectLocalSidecarsForSave();

    expect(payload.achievements).toEqual([{ achievementId: 'a1' }]);
    expect(payload.coinTransactions).toEqual([{ id: 'c1', amount: 5 }]);
    expect(payload.momentumHistory).toEqual({ '2026-01-01': { date: '2026-01-01' } });
  });

  it('does not apply empty remote over existing local sidecars', () => {
    localStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify([{ achievementId: 'local' }]));

    expect(shouldApplyRemoteSidecar('achievements', [])).toBe(false);
    expect(isEmptySidecarPayload('achievements', [])).toBe(true);
    expect(shouldApplyRemoteSidecar('achievements', [{ achievementId: 'remote' }])).toBe(true);
  });

  it('hydrate keeps local achievements when remote is empty array', async () => {
    localStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify([{ achievementId: 'local' }]));
    getAllMock.mockResolvedValue({
      profile: {},
      settings: {},
      data: { achievements: [] },
    });

    await hydrateLocalSidecarsFromRemote();

    expect(JSON.parse(localStorage.getItem(ACHIEVEMENTS_STORAGE_KEY)!)).toEqual([
      { achievementId: 'local' },
    ]);
    expect(putTypeMock).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1000);
    await Promise.resolve();

    expect(putTypeMock).toHaveBeenCalled();
  });

  it('saveLocalSidecarsToRemote skips while hydrating', async () => {
    getAllMock.mockImplementation(
      () =>
        new Promise((resolve) => {
          scheduleSidecarRemoteSave();
          resolve({ profile: {}, settings: {}, data: {} });
        }),
    );

    const hydratePromise = hydrateLocalSidecarsFromRemote();
    expect(isSidecarHydrating()).toBe(true);
    await saveLocalSidecarsToRemote();
    expect(putTypeMock).not.toHaveBeenCalled();
    await hydratePromise;
    expect(isSidecarHydrating()).toBe(false);
  });

  it('debounces remote save', async () => {
    localStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify([{ achievementId: 'a1' }]));

    scheduleSidecarRemoteSave();
    scheduleSidecarRemoteSave();
    expect(putTypeMock).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1000);
    await Promise.resolve();

    const achievementCalls = putTypeMock.mock.calls.filter((call) => call[0] === 'achievements');
    expect(achievementCalls).toHaveLength(1);
    expect(achievementCalls[0]?.[1]).toEqual([{ achievementId: 'a1' }]);
  });

  it('does not save when storage mode is legacy', async () => {
    getStorageModeMock.mockReturnValue('legacy');
    localStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify([{ achievementId: 'a1' }]));

    scheduleSidecarRemoteSave();
    vi.advanceTimersByTime(1000);
    await saveLocalSidecarsToRemote();

    expect(putTypeMock).not.toHaveBeenCalled();
  });
});
