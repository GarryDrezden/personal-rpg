import { test, expect } from '@playwright/test';
import { installMockApi } from './mock-api';
import { dismissBodyAbilityModals } from './helpers';

async function finishCozyOnboarding(page: import('@playwright/test').Page) {
  await expect(page.getByTestId('start-route-page')).toBeVisible({ timeout: 15_000 });
  await page.getByTestId('onboarding-next').click();
  await page.getByTestId('onboarding-hero-name').fill('Гарри');
  await page.getByTestId('onboarding-hero-male').click();
  await page.getByTestId('onboarding-next').click();
  await page.getByTestId('onboarding-theme-cozy').click();
  await page.getByTestId('onboarding-next').click();
  await page.getByTestId('onboarding-height').fill('175');
  await page.getByTestId('onboarding-start-weight').fill('92');
  await page.getByTestId('onboarding-target-weight').fill('80');
  await page.getByTestId('onboarding-next').click();
  await expect(page.getByTestId('onboarding-finish')).toBeVisible({ timeout: 15_000 });
  await page.getByTestId('onboarding-finish').click();
  await expect(page).toHaveURL(/\/today/, { timeout: 15_000 });
}

test.describe('Master core loop', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test('new user: onboarding → Today save → Home → Freedom → Dashboard → reload', async ({
    page,
  }) => {
    test.setTimeout(60_000);
    await installMockApi(page, { freshOnboarding: true });
    await page.addInitScript(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    await page.goto('/');
    await finishCozyOnboarding(page);

    await expect(page.getByTestId('today-v2')).toBeVisible();
    await page.getByTestId('today-preset-minimal').click();
    await page.getByTestId('today-save-desktop').click();
    await expect(page.getByTestId('today-save-reaction')).toBeVisible({ timeout: 10_000 });

    await page.goto('/home');
    await expect(page.getByTestId('cozy-home-page')).toBeVisible();

    await page.goto('/freedom');
    await expect(page.getByTestId('freedom-page')).toBeVisible();

    await page.goto('/measurements');
    await expect(page).toHaveURL(/\/measurements/);

    await page.goto('/');
    await expect(page.getByTestId('dashboard-page')).toBeVisible();
    await page.reload();
    await expect(page.getByTestId('dashboard-page')).toBeVisible();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'cozy');
  });
});

test.describe('Legacy user', () => {
  test('loads without forced onboarding and can open Body Map settings', async ({ page }) => {
    await installMockApi(page, {
      freshOnboarding: false,
      dailyEntries: [
        {
          id: 'd1',
          date: '2026-07-01',
          calories: 2000,
          steps: 8000,
          alcohol: 'none',
          morningExercise: false,
          gym: false,
          journal: false,
          cooking: false,
          repair: false,
          plants: false,
          hobby: false,
          comment: '',
          customCompletions: {},
          dayMode: 'normal',
        },
      ],
      settings: { onboardingCompleted: false },
      profile: { heroGender: null, startWeight: null },
    });
    await page.addInitScript(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    await page.goto('/');
    await dismissBodyAbilityModals(page);
    await expect(page.getByTestId('start-route-page')).toHaveCount(0);
    await expect(page.getByTestId('dashboard-page')).toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId('app-sidebar-nav')).toBeVisible();

    await page.goto('/settings');
    await expect(page.getByTestId('setting-row-body-map')).toBeVisible();
    await expect(page.getByTestId('settings-sidebar-visibility')).toBeVisible();
  });
});
