import { test, expect } from '@playwright/test';
import { createMockApiHandler } from './mock-api';

test.describe('Settings autosave feedback', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/**', createMockApiHandler());
    await page.addInitScript(() => localStorage.clear());
  });

  test('sleep toggle shows feedback and persists', async ({ page }) => {
    await page.goto('/settings');
    await expect(page.getByRole('heading', { name: 'Настройки' })).toBeVisible();

    const toggle = page.getByTestId('sleep-tracking-toggle');
    await expect(toggle).toHaveAttribute('aria-checked', 'false');

    await toggle.click();

    await expect(page.getByTestId('sleep-autosave-status')).toContainText('Учёт сна включён');

    await page.reload();
    await expect(page.getByTestId('sleep-tracking-toggle')).toHaveAttribute('aria-checked', 'true');

    await page.goto('/today');
    await expect(page.getByTestId('sleep-day-card')).toBeVisible();
  });

  test('theme toggle shows feedback and persists', async ({ page }) => {
    await page.goto('/settings');
    await expect(page.getByRole('heading', { name: 'Настройки' })).toBeVisible();

    await expect(page.locator('html')).toHaveAttribute('data-theme', 'cozy');

    await page.getByTestId('theme-option-darkFantasy').getByRole('button', { name: 'Выбрать' }).click();

    await expect(page.getByTestId('theme-autosave-status')).toContainText('Тема сохранена');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'darkFantasy');

    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'darkFantasy');
    await expect(page.getByTestId('theme-option-darkFantasy')).toContainText('Активна');
  });
});
