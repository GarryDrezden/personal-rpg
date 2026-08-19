import { expect, test } from '@playwright/test';
import {
  VISUAL_VIEWPORTS,
  assertNoHorizontalOverflow,
  gotoAppRoute,
  openAppReady,
  setupVisualSession,
} from './visual-helpers';

const PAGES = [
  { path: '/', testId: 'dashboard-page' },
  { path: '/today', testId: 'today-v2' },
  { path: '/journey', testId: 'journey-page' },
  { path: '/freedom', testId: 'freedom-page' },
  { path: '/settings', testId: 'settings-page' },
] as const;

test.describe('Responsive overflow smoke', () => {
  for (const [name, size] of Object.entries(VISUAL_VIEWPORTS)) {
    test(`Cozy ${name} ${size.width}x${size.height}`, async ({ page }) => {
      await setupVisualSession(page, { themeId: 'cozy' });
      await page.setViewportSize(size);
      await openAppReady(page);

      if (size.width < 1024) {
        await expect(page.getByTestId('app-sidebar-nav')).toBeHidden();
      } else {
        await expect(page.getByTestId('app-sidebar-nav')).toBeVisible();
      }

      for (const screen of PAGES) {
        await gotoAppRoute(page, screen.path);
        await expect(page.getByTestId(screen.testId)).toBeVisible({ timeout: 15_000 });
        await assertNoHorizontalOverflow(page);
      }
    });
  }
});
