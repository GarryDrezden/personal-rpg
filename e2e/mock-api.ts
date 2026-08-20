type MockSettings = {
  themeId?: 'cozy' | 'darkFantasy';
  enableSleepTracking?: boolean;
  enableAlcoholTracking?: boolean;
  enablePhysicalActivityTracking?: boolean;
  onboardingCompleted?: boolean;
  onboardingCompletedAt?: string | null;
  activeCompanionId?: string;
  nutritionTrackingMode?: 'disabled' | 'simple' | 'precise' | 'detailed';
  dailyCalorieLimit?: number | null;
  defaultCaloriesLimit: number;
  defaultStepsGoal: number;
  defaultStepsMinimum?: number;
  defaultStepsNormal?: number;
  defaultStepsExcellent?: number;
  defaultGymTarget: number;
  defaultWeeklyPointsGoal: number;
  weightGoal: number;
  targetWeight?: number | null;
  heroGender?: 'male' | 'female';
  gender: 'male' | 'female';
  pointSettings: Record<string, number>;
  weeklySettings: unknown[];
  cozyHome?: Record<string, unknown>;
  sidebarVisibility?: {
    cozy: Record<string, boolean>;
    darkFantasy: Record<string, boolean>;
  };
};

type MockProfile = {
  id: string;
  userId: string;
  displayName: string | null;
  heroGender: 'male' | 'female' | 'neutral' | null;
  startWeight: number | null;
  targetWeight: number | null;
  height: number | null;
  createdAt: string;
  updatedAt: string;
};

type MockUserSettings = {
  id: string;
  userId: string;
  themeId: string;
  nutritionTrackingMode: 'simple' | 'detailed';
  dailyCalorieLimit: number | null;
  activeCompanionId: string;
  createdAt: string;
  updatedAt: string;
};

type MockAppData = {
  dailyEntries: unknown[];
  measurements: unknown[];
  rewards: unknown[];
  bankDeposits: unknown[];
  settings: MockSettings;
};

export type MockApiOptions = {
  /** New account: force onboarding gate. */
  freshOnboarding?: boolean;
  measurements?: unknown[];
  dailyEntries?: unknown[];
  settings?: Partial<MockSettings>;
  profile?: Partial<MockProfile>;
};

/** Match real backend `/api/...` only — not Vite `/src/api/*.ts` modules. */
export function isBackendApiUrl(url: string): boolean {
  try {
    const { pathname } = new URL(url);
    return pathname === '/api' || pathname.startsWith('/api/');
  } catch {
    return false;
  }
}

function createDefaultSettings(completed: boolean): MockSettings {
  return {
    defaultCaloriesLimit: 2650,
    defaultStepsGoal: 11500,
    defaultStepsMinimum: 7000,
    defaultStepsNormal: 11500,
    defaultStepsExcellent: 14000,
    defaultGymTarget: 2,
    defaultWeeklyPointsGoal: 500,
    weightGoal: 100,
    targetWeight: 100,
    pointSettings: {
      caloriesOk: 40,
      stepsOk: 35,
      noAlcohol: 35,
      alcoholModerate: -20,
      alcoholHeavy: -60,
      morningExercise: 20,
      gym: 25,
      journal: 20,
      cooking: 10,
      repair: 10,
      plants: 10,
      hobby: 10,
      gymWeeklyBonus: 50,
      noAlcoholWeekBonus: 70,
      caloriesWeekBonus: 70,
      measurementsMondayBonus: 30,
    },
    weeklySettings: [],
    gender: 'male',
    heroGender: 'male',
    themeId: 'cozy',
    enableSleepTracking: false,
    enableAlcoholTracking: true,
    enablePhysicalActivityTracking: true,
    activeCompanionId: 'golden_chinchilla_cat',
    nutritionTrackingMode: 'simple',
    dailyCalorieLimit: null,
    onboardingCompleted: completed,
    onboardingCompletedAt: completed ? '2026-01-01T00:00:00.000Z' : null,
    cozyHome: {
      resources: { comfort: 0, materials: 0, garden: 0, clarity: 0 },
      zones: {},
      totalUpgrades: 0,
      lastUpdatedAt: null,
      lastUpgrade: null,
    },
  };
}

function createDefaultProfile(fresh: boolean): MockProfile {
  return {
    id: 'profile-1',
    userId: 'user-1',
    displayName: fresh ? null : 'Герой',
    heroGender: fresh ? null : 'male',
    startWeight: fresh ? null : 90,
    targetWeight: fresh ? null : 80,
    height: fresh ? null : 175,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  };
}

function createUserSettings(settings: MockSettings): MockUserSettings {
  return {
    id: 'settings-1',
    userId: 'user-1',
    themeId: settings.themeId ?? 'cozy',
    nutritionTrackingMode:
      settings.nutritionTrackingMode === 'precise' ||
      settings.nutritionTrackingMode === 'detailed'
        ? 'detailed'
        : 'simple',
    dailyCalorieLimit: settings.dailyCalorieLimit ?? null,
    activeCompanionId: settings.activeCompanionId ?? 'golden_chinchilla_cat',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  };
}

export function createDefaultAppData(completed = true): MockAppData {
  return {
    dailyEntries: [],
    measurements: [],
    rewards: [],
    bankDeposits: [],
    settings: createDefaultSettings(completed),
  };
}

export const SEED_MEASUREMENTS = [
  {
    id: 'seed-m-1',
    date: '2026-01-01',
    weight: 180,
    chest: 126,
    waist: 135,
    belly: null,
    hips: 145,
    thigh: 89,
    biceps: 46,
    comment: '',
  },
  {
    id: 'seed-m-2',
    date: '2026-01-08',
    weight: 178,
    chest: 125,
    waist: 133,
    belly: null,
    hips: 143,
    thigh: 88,
    biceps: 45,
    comment: '',
  },
  {
    id: 'seed-m-3',
    date: '2026-01-15',
    weight: 176,
    chest: 124,
    waist: 131,
    belly: null,
    hips: 141,
    thigh: 87,
    biceps: 45,
    comment: '',
  },
];

function json(data: unknown, status = 200) {
  return {
    status,
    contentType: 'application/json',
    body: JSON.stringify(data),
  };
}

export function createMockApiHandler(initial?: MockApiOptions) {
  const fresh = Boolean(initial?.freshOnboarding);
  let profile = {
    ...createDefaultProfile(fresh),
    ...initial?.profile,
  };
  let appData: MockAppData = {
    ...createDefaultAppData(!fresh),
    dailyEntries: initial?.dailyEntries ?? [],
    measurements: initial?.measurements ?? [],
    settings: {
      ...createDefaultSettings(!fresh),
      ...initial?.settings,
      onboardingCompleted:
        initial?.settings?.onboardingCompleted ?? (!fresh ? true : false),
    },
  };
  let revisions: Record<string, number> = {
    dailyEntries: 1,
    measurements: 1,
    rewards: 1,
    bankDeposits: 1,
    customSettingsBackup: 1,
  };
  let userSettings = createUserSettings(appData.settings);

  const bumpRevision = (type: string) => {
    revisions[type] = (revisions[type] ?? 0) + 1;
    return revisions[type];
  };

  const applyDataMap = (items: Record<string, unknown>) => {
    if (Array.isArray(items.dailyEntries)) {
      appData = { ...appData, dailyEntries: items.dailyEntries };
      bumpRevision('dailyEntries');
    }
    if (Array.isArray(items.measurements)) {
      appData = { ...appData, measurements: items.measurements };
      bumpRevision('measurements');
    }
    if (Array.isArray(items.rewards)) {
      appData = { ...appData, rewards: items.rewards };
      bumpRevision('rewards');
    }
    if (Array.isArray(items.bankDeposits)) {
      appData = { ...appData, bankDeposits: items.bankDeposits };
      bumpRevision('bankDeposits');
    }
    if (items.customSettingsBackup && typeof items.customSettingsBackup === 'object') {
      appData = {
        ...appData,
        settings: {
          ...appData.settings,
          ...(items.customSettingsBackup as MockSettings),
        },
      };
      userSettings = createUserSettings(appData.settings);
      bumpRevision('customSettingsBackup');
    }
  };

  const authPayload = () => ({
    user: {
      id: 'user-1',
      login: 'e2e-user',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
    profile,
    settings: userSettings,
    authToken: 'e2e-token',
  });

  return async (route: import('@playwright/test').Route) => {
    const request = route.request();
    if (!isBackendApiUrl(request.url())) {
      await route.continue();
      return;
    }

    const url = new URL(request.url());
    const path = url.pathname.replace(/^\/api/, '') || '/';
    const method = request.method();

    if (
      (path === '/auth/me' || path === '/auth/login' || path === '/auth/register') &&
      (method === 'GET' || method === 'POST')
    ) {
      await route.fulfill(json(authPayload()));
      return;
    }

    if (path === '/auth/logout' && method === 'POST') {
      await route.fulfill(json({ ok: true }));
      return;
    }

    if (path === '/data' && method === 'GET') {
      await route.fulfill(
        json({
          profile,
          settings: userSettings,
          data: {
            dailyEntries: appData.dailyEntries,
            measurements: appData.measurements,
            rewards: appData.rewards,
            bankDeposits: appData.bankDeposits,
            customSettingsBackup: appData.settings,
          },
          revisions,
        }),
      );
      return;
    }

    if (path === '/data' && method === 'PUT') {
      const body = (request.postDataJSON() ?? {}) as { data?: Record<string, unknown> };
      if (body.data) applyDataMap(body.data);
      await route.fulfill(json({ ok: true }));
      return;
    }

    if (path === '/data/restore' && method === 'POST') {
      const body = (request.postDataJSON() ?? {}) as {
        data?: Record<string, unknown>;
        profile?: Partial<MockProfile>;
      };
      if (body.data) applyDataMap(body.data);
      if (body.profile) {
        profile = { ...profile, ...body.profile, updatedAt: new Date().toISOString() };
      }
      await route.fulfill(json({ ok: true }));
      return;
    }

    if (path.startsWith('/data/') && method === 'PUT') {
      const type = path.replace('/data/', '');
      const body = (request.postDataJSON() ?? {}) as { payload?: unknown; revision?: number };
      const payload = body.payload;
      if (body.revision !== undefined && revisions[type] !== undefined && body.revision !== revisions[type]) {
        await route.fulfill(
          json({ error: 'Data conflict', currentRevision: revisions[type] }, 409),
        );
        return;
      }
      if (type === 'customSettingsBackup' && payload && typeof payload === 'object') {
        appData = {
          ...appData,
          settings: {
            ...appData.settings,
            ...(payload as MockSettings),
          },
        };
        userSettings = createUserSettings(appData.settings);
      } else if (type === 'dailyEntries' && Array.isArray(payload)) {
        appData = { ...appData, dailyEntries: payload };
      } else if (type === 'measurements' && Array.isArray(payload)) {
        appData = { ...appData, measurements: payload };
      }
      const revision = bumpRevision(type);
      await route.fulfill(
        json({
          type,
          payload,
          updatedAt: new Date().toISOString(),
          revision,
        }),
      );
      return;
    }

    if (path === '/profile' && method === 'PATCH') {
      const body = (request.postDataJSON() ?? {}) as Partial<MockProfile>;
      profile = {
        ...profile,
        ...body,
        updatedAt: new Date().toISOString(),
      };
      await route.fulfill(json(profile));
      return;
    }

    if (path === '/settings' && method === 'PATCH') {
      const body = (request.postDataJSON() ?? {}) as Partial<MockUserSettings>;
      userSettings = {
        ...userSettings,
        ...body,
        updatedAt: new Date().toISOString(),
      };
      if (body.themeId) {
        appData.settings.themeId = body.themeId as MockSettings['themeId'];
      }
      if (body.activeCompanionId) {
        appData.settings.activeCompanionId = body.activeCompanionId;
      }
      if (body.dailyCalorieLimit !== undefined) {
        appData.settings.dailyCalorieLimit = body.dailyCalorieLimit;
      }
      await route.fulfill(json(userSettings));
      return;
    }

    // Legacy local API shapes (fallback)
    if (path === '/' && method === 'GET') {
      await route.fulfill(json(appData));
      return;
    }

    if (path === '/settings' && method === 'PUT') {
      const body = (request.postDataJSON() ?? {}) as Partial<MockSettings>;
      appData = {
        ...appData,
        settings: {
          ...appData.settings,
          ...body,
        },
      };
      userSettings = createUserSettings(appData.settings);
      await route.fulfill(json(appData.settings));
      return;
    }

    if (path === '/settings' && method === 'GET') {
      await route.fulfill(json(appData.settings));
      return;
    }

    await route.fulfill(json([]));
  };
}

export async function installMockApi(
  page: import('@playwright/test').Page,
  options?: MockApiOptions,
) {
  const handler = createMockApiHandler(options);
  await page.route(isBackendApiUrl, handler);
}
