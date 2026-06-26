type MockSettings = {
  themeId?: 'cozy' | 'darkFantasy';
  enableSleepTracking?: boolean;
  defaultCaloriesLimit: number;
  defaultStepsGoal: number;
  defaultGymTarget: number;
  defaultWeeklyPointsGoal: number;
  weightGoal: number;
  pointSettings: Record<string, number>;
  weeklySettings: unknown[];
  gender: 'male' | 'female';
};

type MockAppData = {
  dailyEntries: unknown[];
  measurements: unknown[];
  rewards: unknown[];
  bankDeposits: unknown[];
  settings: MockSettings;
};

function createDefaultSettings(): MockSettings {
  return {
    defaultCaloriesLimit: 2650,
    defaultStepsGoal: 11500,
    defaultGymTarget: 2,
    defaultWeeklyPointsGoal: 500,
    weightGoal: 100,
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
    themeId: 'cozy',
    enableSleepTracking: false,
  };
}

export function createDefaultAppData(): MockAppData {
  return {
    dailyEntries: [],
    measurements: [],
    rewards: [],
    bankDeposits: [],
    settings: createDefaultSettings(),
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

export function createMockApiHandler(initial?: Partial<MockAppData>) {
  let data: MockAppData = {
    ...createDefaultAppData(),
    ...initial,
    settings: {
      ...createDefaultSettings(),
      ...initial?.settings,
    },
    measurements: initial?.measurements ?? [],
  };

  return async (route: import('@playwright/test').Route) => {
    const request = route.request();
    const url = new URL(request.url());
    const path = url.pathname.replace(/^\/api/, '') || '/';
    const method = request.method();

    if (path === '/' && method === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(data),
      });
      return;
    }

    if (path === '/settings' && method === 'PUT') {
      const body = (request.postDataJSON() ?? {}) as Partial<MockSettings>;
      data = {
        ...data,
        settings: {
          ...data.settings,
          ...body,
        },
      };
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(data.settings),
      });
      return;
    }

    if (path === '/settings' && method === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(data.settings),
      });
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([]),
    });
  };
}
