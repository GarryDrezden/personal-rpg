import { expect, test } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { SEED_MEASUREMENTS } from './mock-api';
import {
  gotoAppRoute,
  openAppReady,
  setupVisualSession,
} from './visual-helpers';

const PHASE = process.env.COZY_INTEGRATION_PHASE === 'after' ? 'after' : 'before';

const VIEWPORTS = [
  { name: '390', size: { width: 390, height: 844 } },
  { name: '768', size: { width: 768, height: 1024 } },
  { name: '1440', size: { width: 1440, height: 900 } },
  { name: '1920', size: { width: 1920, height: 1080 } },
] as const;

const COZY_SCREENS = [
  { path: '/', testId: 'dashboard-page', name: 'dashboard' },
  { path: '/today', testId: 'today-v2', name: 'today' },
  { path: '/week', testId: 'week-page', name: 'week' },
  { path: '/journey', testId: 'journey-page', name: 'journey' },
  { path: '/home', testId: 'cozy-home-page', name: 'home' },
  { path: '/freedom', testId: 'freedom-page', name: 'freedom' },
  { path: '/seasons', testId: 'seasons-page', name: 'seasons' },
  { path: '/codex', testId: 'game-codex-page', name: 'codex' },
  { path: '/measurements', testId: 'measurements-page', name: 'measurements' },
  { path: '/insights', testId: 'insights-page', name: 'analytics' },
  { path: '/reports', testId: 'reports-page', name: 'reports' },
  { path: '/settings', testId: 'settings-page', name: 'settings' },
] as const;

const DF_SCREENS = [
  { path: '/', testId: 'dashboard-page', name: 'dashboard' },
  { path: '/today', testId: 'today-v2', name: 'today' },
  { path: '/journey', testId: 'journey-page', name: 'journey' },
] as const;

const HOME_SEED = {
  resources: { comfort: 48, materials: 36, garden: 28, clarity: 22 },
  zones: {
    porch: { zoneId: 'porch', level: 3 },
    hallway: { zoneId: 'hallway', level: 1 },
    kitchen: { zoneId: 'kitchen', level: 0 },
    bedroom: { zoneId: 'bedroom', level: 2 },
    yard: { zoneId: 'yard', level: 1 },
    garden: { zoneId: 'garden', level: 3 },
    workshop: { zoneId: 'workshop', level: 0 },
    pet_corner: { zoneId: 'pet_corner', level: 1 },
  },
  totalUpgrades: 11,
  lastUpdatedAt: '2026-08-18T12:00:00.000Z',
  lastDailyGrantDate: '2026-08-18',
  lastUpgrade: {
    zoneId: 'porch',
    level: 3,
    title: 'Фонарь',
    at: '2026-08-18T12:00:00.000Z',
  },
};

async function capture(page: import('@playwright/test').Page, rel: string) {
  const file = join(process.cwd(), 'artifacts', 'visual-qa', 'cozy-integration-v1', PHASE, rel);
  mkdirSync(join(file, '..'), { recursive: true });
  await page.screenshot({ path: file, fullPage: true });
}

test.describe('Cozy integration visual capture', () => {
  test.describe.configure({ timeout: 120_000 });

  for (const viewport of VIEWPORTS) {
    const primary = viewport.name === '390' || viewport.name === '1440';
    test(`Cozy ${viewport.name}${primary ? ' full' : ' core'}`, async ({ page }) => {
      await setupVisualSession(page, {
        themeId: 'cozy',
        measurements: SEED_MEASUREMENTS,
        settings: {
          sidebarVisibility: {
            cozy: {
              chronicle: true,
              skillMap: false,
              momentum: false,
              heroGrowth: false,
              companions: true,
            },
            darkFantasy: {
              chronicle: false,
              skillMap: false,
              momentum: false,
              heroGrowth: false,
              companions: false,
            },
          },
          cozyHome: HOME_SEED,
        },
      });
      await page.setViewportSize(viewport.size);
      await openAppReady(page);

      const screens = primary
        ? COZY_SCREENS
        : COZY_SCREENS.filter((s) =>
            ['dashboard', 'today', 'home', 'journey', 'seasons'].includes(s.name),
          );

      for (const screen of screens) {
        await gotoAppRoute(page, screen.path);
        await expect(page.getByTestId(screen.testId)).toBeVisible({ timeout: 15_000 });
        await capture(page, `${viewport.name}/${screen.name}.png`);
      }
    });
  }

  for (const viewport of [
    { name: '390', size: { width: 390, height: 844 } },
    { name: '1440', size: { width: 1440, height: 900 } },
  ] as const) {
    test(`DF regression ${viewport.name}`, async ({ page }) => {
      await setupVisualSession(page, {
        themeId: 'darkFantasy',
        measurements: SEED_MEASUREMENTS,
      });
      await page.setViewportSize(viewport.size);
      await openAppReady(page);
      for (const screen of DF_SCREENS) {
        await gotoAppRoute(page, screen.path);
        await expect(page.getByTestId(screen.testId)).toBeVisible({ timeout: 15_000 });
        await capture(page, `df-${viewport.name}/${screen.name}.png`);
      }
    });
  }
});
