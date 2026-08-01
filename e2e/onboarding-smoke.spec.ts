import { test, expect } from '@playwright/test';
import { installMockApi } from './mock-api';

test.describe('Onboarding v1 smoke', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('new user is routed to /start and can finish campaign to /today', async ({
    page,
  }) => {
    await installMockApi(page, { freshOnboarding: true });
    await page.addInitScript(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    await page.goto('/');
    await expect(page.getByTestId('start-route-page')).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText('Шаг 1 из 6')).toBeVisible();

    await page.getByTestId('onboarding-next').click();
    await expect(page.getByTestId('onboarding-step-hero')).toBeVisible();
    await page.getByTestId('onboarding-hero-name').fill('Гарри');
    await page.getByTestId('onboarding-hero-male').click();
    await page.getByTestId('onboarding-next').click();

    await expect(page.getByTestId('onboarding-step-theme')).toBeVisible();
    await expect(page.getByTestId('onboarding-theme-forestMyth')).toBeDisabled();
    await expect(page.getByTestId('onboarding-theme-athleteReturn')).toBeDisabled();
    await page.getByTestId('onboarding-theme-cozy').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'cozy');
    await page.getByTestId('onboarding-theme-darkFantasy').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'darkFantasy');
    await page.getByTestId('onboarding-theme-cozy').click();
    await page.getByTestId('onboarding-next').click();

    await expect(page.getByTestId('onboarding-step-body')).toBeVisible();
    await page.getByTestId('onboarding-height').fill('175');
    await page.getByTestId('onboarding-start-weight').fill('92');
    await page.getByTestId('onboarding-target-weight').fill('80');
    await page.getByTestId('onboarding-next').click();

    await expect(page.getByTestId('onboarding-step-rhythm')).toBeVisible();
    await expect(page.getByTestId('onboarding-steps-min')).toHaveValue('7000');
    await expect(page.getByTestId('onboarding-steps-normal')).toHaveValue('11500');
    await expect(page.getByTestId('onboarding-steps-excellent')).toHaveValue('14000');
    await page.getByTestId('onboarding-next').click();

    await expect(page.getByTestId('onboarding-step-companion')).toBeVisible();
    await page.getByTestId('companion-alabai').click();
    await page.getByTestId('onboarding-finish').click();

    await expect(page).toHaveURL(/\/today/, { timeout: 15_000 });
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'cozy');
  });

  test('legacy user with progress is not forced into onboarding', async ({ page }) => {
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

    await page.goto('/today');
    await expect(page).not.toHaveURL(/\/start/, { timeout: 15_000 });
    await expect(page.getByTestId('start-route-page')).toHaveCount(0);
  });
});
