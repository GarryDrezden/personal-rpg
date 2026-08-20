import { expect, test } from '@playwright/test';
import {
  expectNoFatalErrors,
  openAppReady,
  setupVisualSession,
  type VisualThemeId,
} from './visual-helpers';

const THEMES: VisualThemeId[] = ['cozy', 'darkFantasy'];
const VIEWPORTS = [
  { name: '390', size: { width: 390, height: 844 } },
  { name: '1440', size: { width: 1440, height: 900 } },
] as const;

test.describe('Dashboard NOW / NEXT / LONG hierarchy', () => {
  for (const themeId of THEMES) {
    for (const viewport of VIEWPORTS) {
      test(`${themeId} ${viewport.name}px shows NOW, NEXT, LONG and muted coins`, async ({
        page,
      }) => {
        const { errors } = await setupVisualSession(page, { themeId });
        await page.setViewportSize(viewport.size);
        await openAppReady(page);

        await expect(page.getByTestId('dashboard-now')).toBeVisible();
        await expect(page.getByTestId('dashboard-primary-cta')).toBeVisible();
        await expect(page.getByTestId('dashboard-next')).toBeVisible();
        await expect(page.getByTestId('dashboard-long')).toBeVisible();
        await expect(page.getByTestId('dashboard-coins-meta')).toBeVisible();
        await expect(page.getByTestId('dashboard-hero-state')).toBeVisible();

        if (themeId === 'cozy') {
          await expect(page.getByTestId('cozy-home-dashboard-card')).toBeVisible();
          await expect(page.getByTestId('cozy-home-dashboard-card')).not.toContainText('Ясность');
        } else {
          await expect(page.getByTestId('cozy-home-dashboard-card')).toHaveCount(0);
        }

        if (viewport.name === '390') {
          const hero = page.getByTestId('command-bridge-hero');
          const threats = page.getByTestId('command-bridge-threats');
          const heroBox = await hero.boundingBox();
          const threatBox = await threats.boundingBox();
          expect(heroBox && threatBox).toBeTruthy();
          expect(heroBox!.y).toBeLessThan(threatBox!.y);
        }

        const coinsBox = await page.getByTestId('dashboard-coins-meta').boundingBox();
        const levelBox = await page.getByTestId('dashboard-level-hud').boundingBox();
        expect(coinsBox && levelBox).toBeTruthy();
        expect(coinsBox!.height).toBeLessThan(levelBox!.height + 4);

        expectNoFatalErrors(errors);
      });
    }
  }

  test('cozy Home upgrade available becomes NEXT without hiding Today CTA', async ({ page }) => {
    const { errors } = await setupVisualSession(page, {
      themeId: 'cozy',
      settings: {
        cozyHome: {
          resources: { comfort: 0, materials: 5, garden: 0, clarity: 0 },
          zones: {},
          totalUpgrades: 0,
        },
      },
    });
    await page.setViewportSize({ width: 390, height: 844 });
    await openAppReady(page);

    await expect(page.getByTestId('dashboard-primary-cta')).toBeVisible();
    await expect(page.getByTestId('dashboard-next')).toContainText(/Можно улучшить/i);
    expectNoFatalErrors(errors);
  });
});
