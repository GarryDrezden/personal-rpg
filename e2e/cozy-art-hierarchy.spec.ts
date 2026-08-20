import { expect, test } from '@playwright/test';
import {
  expectNoFatalErrors,
  gotoAppRoute,
  openAppReady,
  setupVisualSession,
} from './visual-helpers';

test.describe('Cozy art hierarchy', () => {
  test('Home scene sits above zone grid; Today has one day illustration', async ({ page }) => {
    const { errors } = await setupVisualSession(page, { themeId: 'cozy' });
    await page.setViewportSize({ width: 390, height: 844 });
    await openAppReady(page);

    await gotoAppRoute(page, '/home');
    const scene = page.getByTestId('cozy-home-scene');
    const zone = page.getByTestId('cozy-zone-porch');
    await expect(scene).toBeVisible();
    await expect(zone).toBeVisible();
    const sceneBox = await scene.boundingBox();
    const zoneBox = await zone.boundingBox();
    expect(sceneBox && zoneBox).toBeTruthy();
    expect(sceneBox!.y).toBeLessThan(zoneBox!.y);

    await gotoAppRoute(page, '/today');
    await expect(page.getByTestId('today-v2')).toBeVisible();
    await expect(page.getByTestId('daily-mob-card')).toHaveCount(1);

    expectNoFatalErrors(errors);
  });

  test('Dashboard Cozy threats stay secondary banners, not second heroes', async ({ page }) => {
    const { errors } = await setupVisualSession(page, { themeId: 'cozy' });
    await page.setViewportSize({ width: 1440, height: 900 });
    await openAppReady(page);

    const boss = page.getByTestId('chapter-boss-mini-card');
    const hero = page.getByTestId('command-bridge-hero');
    await expect(boss).toBeVisible();
    await expect(hero).toBeVisible();
    const bossBox = await boss.boundingBox();
    const heroBox = await hero.boundingBox();
    expect(bossBox && heroBox).toBeTruthy();
    expect(bossBox!.width / bossBox!.height).toBeGreaterThan(1.4);
    expect(heroBox!.height).toBeGreaterThan(bossBox!.height);
    expectNoFatalErrors(errors);
  });
});
