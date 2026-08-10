import { describe, expect, it } from 'vitest';
import {
  getMobileDrawerGroups,
  getSidebarNavigation,
  navGroups,
  sidebarContainsPath,
} from '../constants/navigation';
import { DEFAULT_APP_SETTINGS } from '../constants/defaults';
import { normalizeAppSettings } from '../utils/settingsNormalize';
import {
  getSidebarVisibilityForTheme,
  normalizeThemeSidebarSettings,
  withSidebarVisibilityToggle,
} from '../utils/sidebarVisibility';
import type { AppSettings } from '../types';

const CORE_PATHS = [
  '/',
  '/today',
  '/week',
  '/journey',
  '/codex',
  '/freedom',
  '/measurements',
  '/insights',
  '/reports',
  '/faq',
  '/settings',
] as const;

const OPTIONAL_PATHS = {
  chronicle: '/seasons',
  skillMap: '/map',
  momentum: '/momentum',
  heroGrowth: '/growth',
} as const;

function pathsFrom(groups: ReturnType<typeof getSidebarNavigation>): string[] {
  return groups.flatMap((g) => g.items.map((i) => i.to));
}

function freshSettings(partial?: Partial<AppSettings>): AppSettings {
  return normalizeAppSettings({ ...DEFAULT_APP_SETTINGS, ...partial });
}

describe('sidebar visibility normalize', () => {
  it('legacy settings without sidebarVisibility normalize without crash (all optional off)', () => {
    const raw = { ...DEFAULT_APP_SETTINGS };
    delete (raw as { sidebarVisibility?: unknown }).sidebarVisibility;
    const normalized = normalizeAppSettings(raw);
    expect(normalized.sidebarVisibility).toEqual({
      cozy: {
        chronicle: false,
        skillMap: false,
        momentum: false,
        heroGrowth: false,
        companions: false,
      },
      darkFantasy: {
        chronicle: false,
        skillMap: false,
        momentum: false,
        heroGrowth: false,
        companions: false,
      },
    });
    expect(normalizeThemeSidebarSettings(undefined)).toEqual(normalized.sidebarVisibility);
    expect(normalizeThemeSidebarSettings({ cozy: { chronicle: true } as never }).cozy.chronicle).toBe(
      true,
    );
    expect(normalizeThemeSidebarSettings({ cozy: { chronicle: true } as never }).cozy.skillMap).toBe(
      false,
    );
  });
});

describe('getSidebarNavigation — defaults', () => {
  it('new Cozy user hides optional sections', () => {
    const settings = freshSettings({ themeId: 'cozy' });
    const groups = getSidebarNavigation({ themeId: 'cozy', settings });
    const paths = pathsFrom(groups);

    for (const path of Object.values(OPTIONAL_PATHS)) {
      expect(paths).not.toContain(path);
    }
    expect(groups.find((g) => g.id === 'growth')).toBeUndefined();
  });

  it('always shows core shell paths (plus Cozy Home on cozy)', () => {
    const settings = freshSettings({ themeId: 'cozy' });
    const paths = pathsFrom(getSidebarNavigation({ themeId: 'cozy', settings }));

    for (const path of CORE_PATHS) {
      expect(paths).toContain(path);
    }
    expect(paths).toContain('/home');
  });

  it('Dark Fantasy core shell omits Cozy Home', () => {
    const settings = freshSettings({ themeId: 'darkFantasy' });
    const paths = pathsFrom(getSidebarNavigation({ themeId: 'darkFantasy', settings }));
    expect(paths).not.toContain('/home');
    for (const path of CORE_PATHS) {
      expect(paths).toContain(path);
    }
  });
});

describe('getSidebarNavigation — toggles & themes', () => {
  it('toggle chronicle=true shows Летопись; toggle off hides it', () => {
    let settings = freshSettings({ themeId: 'cozy' });
    expect(
      sidebarContainsPath(getSidebarNavigation({ themeId: 'cozy', settings }), '/seasons'),
    ).toBe(false);

    settings = withSidebarVisibilityToggle(settings, 'cozy', 'chronicle', true);
    expect(
      sidebarContainsPath(getSidebarNavigation({ themeId: 'cozy', settings }), '/seasons'),
    ).toBe(true);

    settings = withSidebarVisibilityToggle(settings, 'cozy', 'chronicle', false);
    expect(
      sidebarContainsPath(getSidebarNavigation({ themeId: 'cozy', settings }), '/seasons'),
    ).toBe(false);
  });

  it('Cozy settings do not change Dark Fantasy settings', () => {
    let settings = freshSettings();
    settings = withSidebarVisibilityToggle(settings, 'cozy', 'momentum', true);

    expect(getSidebarVisibilityForTheme(settings, 'cozy').momentum).toBe(true);
    expect(getSidebarVisibilityForTheme(settings, 'darkFantasy').momentum).toBe(false);

    const cozyPaths = pathsFrom(getSidebarNavigation({ themeId: 'cozy', settings }));
    const dfPaths = pathsFrom(getSidebarNavigation({ themeId: 'darkFantasy', settings }));
    expect(cozyPaths).toContain('/momentum');
    expect(dfPaths).not.toContain('/momentum');
  });

  it('theme switch recalculates menu from that theme bucket', () => {
    let settings = freshSettings();
    settings = withSidebarVisibilityToggle(settings, 'darkFantasy', 'skillMap', true);

    expect(
      sidebarContainsPath(getSidebarNavigation({ themeId: 'cozy', settings }), '/map'),
    ).toBe(false);
    expect(
      sidebarContainsPath(getSidebarNavigation({ themeId: 'darkFantasy', settings }), '/map'),
    ).toBe(true);
  });

  it('empty section headers are not returned', () => {
    const settings = freshSettings();
    const groups = getSidebarNavigation({ themeId: 'cozy', settings });
    expect(groups.every((g) => g.items.length > 0)).toBe(true);
    expect(groups.map((g) => g.id)).not.toContain('growth');
  });

  it('enabling heroGrowth restores growth section', () => {
    let settings = freshSettings();
    settings = withSidebarVisibilityToggle(settings, 'cozy', 'heroGrowth', true);
    const groups = getSidebarNavigation({ themeId: 'cozy', settings });
    expect(groups.find((g) => g.id === 'growth')?.items.map((i) => i.to)).toEqual(['/growth']);
  });
});

describe('mobile / desktop parity', () => {
  it('mobile drawer uses the same visibility rules as sidebar', () => {
    let settings = freshSettings({ themeId: 'cozy' });
    settings = withSidebarVisibilityToggle(settings, 'cozy', 'chronicle', true);
    settings = withSidebarVisibilityToggle(settings, 'cozy', 'momentum', true);

    const desktop = pathsFrom(getSidebarNavigation({ themeId: 'cozy', settings }));
    const mobileExtra = pathsFrom(getMobileDrawerGroups('cozy', settings));

    // Mobile tabs already cover /, /today, /week, /codex — drawer should still respect opt-ins
    expect(mobileExtra).toContain('/seasons');
    expect(mobileExtra).toContain('/momentum');
    expect(mobileExtra).not.toContain('/map');
    expect(mobileExtra).not.toContain('/growth');

    for (const path of mobileExtra) {
      expect(desktop).toContain(path);
    }
  });
});

describe('routes stay available', () => {
  it('optional nav items still exist in config for direct URLs', () => {
    const all = navGroups.flatMap((g) => g.items);
    expect(all.some((i) => i.to === '/seasons' && i.optional)).toBe(true);
    expect(all.some((i) => i.to === '/map' && i.optional)).toBe(true);
    expect(all.some((i) => i.to === '/momentum' && i.optional)).toBe(true);
    expect(all.some((i) => i.to === '/growth' && i.optional)).toBe(true);
  });
});
