import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  clearOnboardingDraftStorage,
  ONBOARDING_DRAFT_STORAGE_KEY,
  readOnboardingDraftFromStorage,
  writeOnboardingDraftToStorage,
} from './onboardingDraft';

function mockLocalStorage() {
  const map = new Map<string, string>();
  const ls = {
    getItem: (k: string) => map.get(k) ?? null,
    setItem: (k: string, v: string) => {
      map.set(k, v);
    },
    removeItem: (k: string) => {
      map.delete(k);
    },
    clear: () => map.clear(),
    key: () => null,
    get length() {
      return map.size;
    },
  };
  vi.stubGlobal('window', { localStorage: ls });
  return ls;
}

describe('onboardingDraft localStorage', () => {
  beforeEach(() => {
    mockLocalStorage();
    clearOnboardingDraftStorage();
  });

  it('round-trips draft without crashing', () => {
    writeOnboardingDraftToStorage({
      heroName: 'Гарри',
      themeId: 'cozy',
      stepsNormal: 11500,
    });
    const read = readOnboardingDraftFromStorage();
    expect(read?.heroName).toBe('Гарри');
    expect(read?.themeId).toBe('cozy');
    expect(read?.stepsNormal).toBe(11500);
    clearOnboardingDraftStorage();
    expect(window.localStorage.getItem(ONBOARDING_DRAFT_STORAGE_KEY)).toBeNull();
  });

  it('ignores corrupt storage', () => {
    window.localStorage.setItem(ONBOARDING_DRAFT_STORAGE_KEY, '{not-json');
    expect(readOnboardingDraftFromStorage()).toBeNull();
  });
});
