import { test, expect } from '@playwright/test';
import { installMockApi } from './mock-api';
import { dismissBodyAbilityModals } from './helpers';

test.describe('Theme switch presentation', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test('Cozy → Dark Fantasy keeps data, swaps presentation', async ({ page }) => {
    await installMockApi(page, { freshOnboarding: false });
    await page.addInitScript(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    await page.goto('/');
    await dismissBodyAbilityModals(page);
    await expect(page.getByTestId('dashboard-page')).toBeVisible({ timeout: 15_000 });
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'cozy');
    await expect(page.getByTestId('cozy-home-dashboard-card')).toBeVisible();
    const cozyAvatar = page.getByTestId('dashboard-hero-avatar-layer');
    await expect(cozyAvatar).toBeVisible();

    await page.goto('/home');
    await expect(page.getByTestId('cozy-home-page')).toBeVisible();

    await page.goto('/settings');
    await page.getByTestId('theme-option-darkFantasy').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'darkFantasy');

    await page.goto('/');
    await dismissBodyAbilityModals(page);
    await expect(page.getByTestId('dashboard-page')).toBeVisible();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'darkFantasy');
    await expect(page.getByTestId('cozy-home-dashboard-card')).toHaveCount(0);
    await expect(page.getByTestId('dashboard-hero-avatar-layer')).toBeVisible();
    await expect(page.getByTestId('dashboard-avatar-stage')).toBeVisible();
  });
});
