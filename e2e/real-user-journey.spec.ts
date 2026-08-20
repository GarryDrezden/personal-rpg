import { expect, test, type Page } from '@playwright/test';
import { installMockApi } from './mock-api';
import {
  expectNoFatalErrors,
  gotoAppRoute,
  openAppReady,
  setupVisualSession,
} from './visual-helpers';

function localIso(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function loggedDay(date: string, extra: Record<string, unknown> = {}) {
  return {
    id: `d-${date}`,
    date,
    calories: 2200,
    steps: 8000,
    alcohol: 'none',
    morningExercise: false,
    gym: false,
    journal: true,
    cooking: false,
    repair: false,
    plants: false,
    hobby: false,
    comment: 'seed',
    customCompletions: {},
    dayMode: 'normal',
    nutritionLevel: 'light',
    ...extra,
  };
}

const COMPLETE_HOME_ZONES = Object.fromEntries(
  ['porch', 'hallway', 'kitchen', 'bedroom', 'yard', 'garden', 'workshop', 'pet_corner'].map(
    (id) => [id, { zoneId: id, level: 3 }],
  ),
);

async function saveMinimalToday(page: Page) {
  await gotoAppRoute(page, '/today');
  await expect(page.getByTestId('today-v2')).toBeVisible({ timeout: 15_000 });
  const preset = page.getByTestId('today-preset-minimal');
  if (await preset.isVisible()) {
    await preset.click();
  }
  const mobileSave = page.getByTestId('today-save-mobile');
  const desktopSave = page.getByTestId('today-save-desktop');
  if (await mobileSave.isVisible()) {
    await expect(mobileSave).toBeEnabled({ timeout: 10_000 });
    await mobileSave.click();
  } else {
    await expect(desktopSave).toBeEnabled({ timeout: 10_000 });
    await desktopSave.click();
  }
}

test.describe('Real user journey', () => {
  test.describe.configure({ timeout: 60_000 });

  test('A. new user first week: onboarding lands on Today and a save reaches Dashboard NOW', async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.setViewportSize({ width: 390, height: 844 });

    await installMockApi(page, { freshOnboarding: true });
    await page.addInitScript(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    await page.goto('/');
    await expect(page.getByTestId('start-route-page')).toBeVisible({ timeout: 15_000 });
    await page.getByTestId('onboarding-next').click();
    await page.getByTestId('onboarding-hero-name').fill('Анна');
    await page.getByTestId('onboarding-hero-male').click();
    await page.getByTestId('onboarding-next').click();
    await page.getByTestId('onboarding-theme-cozy').click();
    await page.getByTestId('onboarding-next').click();
    await page.getByTestId('onboarding-height').fill('170');
    await page.getByTestId('onboarding-start-weight').fill('92');
    await page.getByTestId('onboarding-target-weight').fill('80');
    await page.getByTestId('onboarding-next').click();
    await page.getByTestId('onboarding-finish').click();

    await expect(page).toHaveURL(/\/today/, { timeout: 15_000 });
    await expect(page.getByTestId('today-v2')).toBeVisible();
    await saveMinimalToday(page);
    await expect(page.getByTestId('today-save-reaction')).toBeVisible({ timeout: 15_000 });

    await gotoAppRoute(page, '/');
    await expect(page.getByTestId('dashboard-page')).toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId('dashboard-primary-cta')).toBeVisible();
    await expect(page.getByTestId('dashboard-now')).toBeVisible();
    expectNoFatalErrors(errors);
  });

  test('B. return after 18 days offers a small step, not a debt wall', async ({ page }) => {
    const last = localIso(-18);
    const { errors } = await setupVisualSession(page, {
      themeId: 'cozy',
      dailyEntries: [loggedDay(last)],
      measurements: [{ id: 'm1', date: last, weight: 90, waist: 96 }],
    });
    await page.setViewportSize({ width: 390, height: 844 });
    await openAppReady(page);
    const cta = page.getByTestId('dashboard-primary-cta');
    await expect(cta).toBeVisible();
    await expect(cta).toContainText(/Снова дома|не нужно закрывать/i);
    await expect(cta).not.toContainText(/закрыть прошлые|долг|штраф/i);
    expectNoFatalErrors(errors);
  });

  test('C. small-goal user still sees a full Journey map', async ({ page }) => {
    const { errors } = await setupVisualSession(page, {
      themeId: 'cozy',
      profile: { startWeight: 65, targetWeight: 55, height: 164 },
      settings: { weightGoal: 55, targetWeight: 55 },
      measurements: [{ id: 'm1', date: localIso(-3), weight: 65, waist: 78 }],
      dailyEntries: [loggedDay(localIso(-1))],
    });
    await page.setViewportSize({ width: 390, height: 844 });
    await gotoAppRoute(page, '/journey');
    await expect(page.getByTestId('journey-page')).toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId('journey-map-v3')).toBeVisible();
    await expect(page.getByTestId('journey-v3-summary-bar')).toContainText(/\/ 9/);
    expectNoFatalErrors(errors);
  });

  test('D. Home 24/24 does not keep an upgrade NEXT', async ({ page }) => {
    const { errors } = await setupVisualSession(page, {
      themeId: 'cozy',
      settings: {
        cozyHome: {
          resources: { comfort: 20, materials: 20, garden: 20, clarity: 20 },
          zones: COMPLETE_HOME_ZONES,
          totalUpgrades: 24,
        },
      },
      dailyEntries: [loggedDay(localIso(0))],
    });
    await page.setViewportSize({ width: 390, height: 844 });
    await openAppReady(page);
    const next = page.getByTestId('dashboard-next');
    await expect(next).toBeVisible();
    await expect(next).not.toContainText(/Можно улучшить|До восстановления|До следующего улучшения/i);
    await gotoAppRoute(page, '/home');
    await expect(page.getByTestId('cozy-home-page')).toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId('cozy-home-page')).toContainText(/Дом восстановлен/i);
    expectNoFatalErrors(errors);
  });

  test('E. tracking-disabled dashboard does not ask for calories', async ({ page }) => {
    const { errors } = await setupVisualSession(page, {
      themeId: 'cozy',
      settings: {
        nutritionTrackingMode: 'disabled',
        enableAlcoholTracking: false,
        enablePhysicalActivityTracking: false,
      },
      dailyEntries: [loggedDay(localIso(-1), { calories: null, alcohol: null })],
      measurements: [{ id: 'm1', date: localIso(-1), weight: 88 }],
    });
    await page.setViewportSize({ width: 390, height: 844 });
    await openAppReady(page);
    const cta = page.getByTestId('dashboard-primary-cta');
    await expect(cta).toBeVisible();
    await expect(cta).not.toContainText(/Внести калории/i);
    await expect(cta).not.toContainText(/алкогол/i);
    expectNoFatalErrors(errors);
  });

  test('F. multi-tab conflict tells the user to reload, without revision jargon', async ({
    page,
  }) => {
    const { errors } = await setupVisualSession(page, { themeId: 'cozy' });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.route('**/api/data/dailyEntries', async (route) => {
      if (route.request().method() === 'PUT') {
        await route.fulfill({
          status: 409,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Data conflict', currentRevision: 9 }),
        });
        return;
      }
      await route.fallback();
    });
    await saveMinimalToday(page);
    const status = page.getByTestId('save-status-indicator');
    await expect(status).toBeVisible({ timeout: 15_000 });
    await expect(status).toContainText(/не записалось|другой вкладке|обновите страницу/i);
    await expect(status).not.toContainText(/revision|SQL|409/i);
    expectNoFatalErrors(errors);
  });
});
