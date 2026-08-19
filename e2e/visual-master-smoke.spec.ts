import { expect, test } from '@playwright/test';
import {
  assertNoHorizontalOverflow,
  captureVisualState,
  expectNoFatalErrors,
  gotoAppRoute,
  openAppReady,
  setupVisualSession,
  type VisualThemeId,
} from './visual-helpers';

const THEMES: VisualThemeId[] = ['cozy', 'darkFantasy'];

const VIEWPORTS = [
  { name: '390', size: { width: 390, height: 844 } },
  { name: '1440', size: { width: 1440, height: 900 } },
] as const;

type ScreenVisit = {
  path: string;
  testId: string;
  skipOnDarkFantasy?: boolean;
};

const CORE_SCREENS: ScreenVisit[] = [
  { path: '/', testId: 'dashboard-page' },
  { path: '/today', testId: 'today-v2' },
  { path: '/home', testId: 'cozy-home-page', skipOnDarkFantasy: true },
  { path: '/freedom', testId: 'freedom-page' },
  { path: '/journey', testId: 'journey-page' },
  { path: '/codex', testId: 'game-codex-page' },
  { path: '/measurements', testId: 'measurements-page' },
  { path: '/settings', testId: 'settings-page' },
];

const OPTIONAL_SCREENS: ScreenVisit[] = [
  { path: '/week', testId: 'week-page' },
  { path: '/seasons', testId: 'seasons-page' },
  { path: '/momentum', testId: 'momentum-page' },
  { path: '/map', testId: 'progress-map-page' },
  { path: '/growth', testId: 'growth-hub-page' },
  { path: '/insights', testId: 'insights-page' },
  { path: '/reports', testId: 'reports-page' },
  { path: '/faq', testId: 'faq-page' },
];

test.describe('Visual master smoke', () => {
  test.describe.configure({ timeout: 90_000 });
  for (const themeId of THEMES) {
    for (const viewport of VIEWPORTS) {
      test(`${themeId} ${viewport.name}px core + optional routes`, async ({ page }) => {
        const { errors } = await setupVisualSession(page, { themeId });
        await page.setViewportSize(viewport.size);
        await openAppReady(page);
        await expect(page.locator('html')).toHaveAttribute('data-theme', themeId);

        for (const screen of [...CORE_SCREENS, ...OPTIONAL_SCREENS]) {
          if (screen.skipOnDarkFantasy && themeId === 'darkFantasy') {
            await gotoAppRoute(page, '/home');
            await expect(page).toHaveURL(/\/$/);
            await expect(page.getByTestId('dashboard-page')).toBeVisible();
            continue;
          }

          await gotoAppRoute(page, screen.path);
          await expect(page.getByTestId(screen.testId)).toBeVisible({ timeout: 15_000 });
          await assertNoHorizontalOverflow(page);
          await captureVisualState(page, themeId, viewport.name, screen.testId);
        }

        await gotoAppRoute(page, '/');
        await expect(page.getByTestId('dashboard-page')).toBeVisible();
        if (themeId === 'cozy') {
          await expect(page.getByTestId('cozy-home-dashboard-card')).toBeVisible();
        } else {
          await expect(page.getByTestId('cozy-home-dashboard-card')).toHaveCount(0);
          await expect(page.locator('.cozy-botanical-frame__foliage')).toHaveCount(0);
          await expect(page.locator('.cozy-atmosphere')).toHaveCount(0);
        }

        expectNoFatalErrors(errors);
      });
    }
  }
});
