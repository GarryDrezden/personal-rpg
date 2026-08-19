import { expect, test } from '@playwright/test';
import {
  assertNoHorizontalOverflow,
  gotoAppRoute,
  openAppReady,
  setupVisualSession,
  type VisualThemeId,
} from './visual-helpers';

const SETTINGS_ANCHORS = [
  'settings-theme',
  'settings-sidebar',
  'settings-pwa',
  'settings-body-map',
  'settings-weight',
  'settings-game-hero',
  'settings-avatar',
  'settings-nutrition',
  'settings-defaults',
  'settings-weeks',
  'settings-coins',
  'settings-xp',
  'settings-habits',
  'settings-backup',
] as const;

const CASES: { themeId: VisualThemeId; width: number; height: number }[] = [
  { themeId: 'cozy', width: 390, height: 844 },
  { themeId: 'cozy', width: 1440, height: 900 },
  { themeId: 'darkFantasy', width: 390, height: 844 },
  { themeId: 'darkFantasy', width: 1440, height: 900 },
];

test.describe('Today + Settings architecture smoke', () => {
  for (const viewport of CASES) {
    test(`${viewport.themeId} ${viewport.width} Today/Settings shells`, async ({ page }) => {
      await setupVisualSession(page, { themeId: viewport.themeId });
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await openAppReady(page);

      await gotoAppRoute(page, '/today');
      await expect(page.getByTestId('today-v2')).toBeVisible({ timeout: 15_000 });
      await expect(page.getByTestId('today-day-presets')).toBeVisible();
      await expect(page.getByTestId('today-section-body')).toBeVisible();
      await expect(page.getByTestId('today-section-path')).toBeVisible();
      await expect(page.getByTestId('today-section-trace')).toBeVisible();
      await expect(page.getByTestId('today-day-summary')).toBeVisible();
      await expect(page.getByTestId('today-save-desktop')).toHaveCount(1);
      await expect(page.getByTestId('today-save-mobile')).toHaveCount(1);
      if (viewport.width < 1024) {
        await expect(page.getByTestId('today-save-mobile')).toBeVisible();
      } else {
        await expect(page.getByTestId('today-save-desktop')).toBeVisible();
      }
      await assertNoHorizontalOverflow(page);

      await gotoAppRoute(page, '/settings');
      await expect(page.getByTestId('settings-page')).toBeVisible({ timeout: 15_000 });
      await expect(page.getByRole('heading', { name: 'Настройки' })).toBeVisible();
      await expect(page.getByTestId('theme-option-cozy')).toBeVisible();
      await expect(page.getByTestId('theme-option-darkFantasy')).toBeVisible();
      await expect(page.getByTestId('sleep-tracking-toggle')).toBeVisible();
      await expect(page.getByTestId('setting-row-body-map')).toBeVisible();
      await expect(page.getByTestId('settings-sidebar-visibility')).toBeVisible();
      for (const id of SETTINGS_ANCHORS) {
        await expect(page.locator(`#${id}`)).toHaveCount(1);
      }
      await assertNoHorizontalOverflow(page);
    });
  }
});
