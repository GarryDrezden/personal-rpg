import { expect, test } from '@playwright/test';
import {
  assertNoHorizontalOverflow,
  expectNoFatalErrors,
  gotoAppRoute,
  openAppReady,
  setupVisualSession,
} from './visual-helpers';

const VIEWPORTS = [
  { name: '390', size: { width: 390, height: 844 } },
  { name: '768', size: { width: 768, height: 1024 } },
  { name: '1440', size: { width: 1440, height: 900 } },
  { name: '1920', size: { width: 1920, height: 1080 } },
] as const;

const SCREENS = [
  { path: '/', testId: 'dashboard-page' },
  { path: '/home', testId: 'cozy-home-page' },
  { path: '/journey', testId: 'journey-page' },
  { path: '/today', testId: 'today-v2' },
  { path: '/seasons', testId: 'seasons-page' },
] as const;

test.describe('Cozy asset production pack', () => {
  test.describe.configure({ timeout: 90_000 });

  for (const viewport of VIEWPORTS) {
    test(`Cozy ${viewport.name} Dashboard/Home/Journey/Today/Seasons`, async ({ page }) => {
      const missing: string[] = [];
      const dfLeak: string[] = [];
      page.on('response', (response) => {
        const url = response.url();
        if (url.includes('/game-assets/themes/dark-fantasy/') || url.includes('/game-assets/bosses/') || url.includes('/game-assets/mobs/')) {
          if (url.includes('/themes/cozy/')) return;
          dfLeak.push(url);
        }
        if (response.status() !== 404) return;
        if (!url.includes('/game-assets/themes/cozy/')) return;
        if (url.includes('/level-02.webp')) return;
        if (url.includes('/placeholders/')) return;
        missing.push(url);
      });

      const { errors } = await setupVisualSession(page, { themeId: 'cozy' });
      await page.setViewportSize(viewport.size);
      await openAppReady(page);
      await expect(page.locator('html')).toHaveAttribute('data-theme', 'cozy');

      for (const screen of SCREENS) {
        await gotoAppRoute(page, screen.path);
        await expect(page.getByTestId(screen.testId)).toBeVisible({ timeout: 15_000 });
        await assertNoHorizontalOverflow(page);
        await expect(page.locator('html')).toHaveAttribute('data-theme', 'cozy');
      }

      expect(missing, missing.join('\n')).toEqual([]);
      expect(dfLeak, dfLeak.join('\n')).toEqual([]);
      expectNoFatalErrors(errors);
    });
  }
});
