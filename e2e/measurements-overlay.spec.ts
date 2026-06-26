import { test, expect } from '@playwright/test';
import { setupMeasurementsE2e, dismissBodyAbilityModals } from './helpers';

test.describe('Measurements overlay chart', () => {
  test.beforeEach(async ({ page }) => {
    await setupMeasurementsE2e(page);
  });

  async function selectOverlayMetrics(
    page: import('@playwright/test').Page,
    keys: string[],
  ) {
    const selector = page.getByTestId('measurements-overlay-selector');
    for (const key of keys) {
      const chip = selector.getByTestId(`measurement-metric-${key}`);
      const pressed = await chip.getAttribute('aria-pressed');
      if (pressed !== 'true') {
        await chip.click();
      }
    }
  }

  test('overlay chart shows selected cm metrics and persists preferences', async ({ page }) => {
    await page.goto('/measurements');
    await dismissBodyAbilityModals(page);
    await expect(page.getByRole('heading', { name: 'Замеры' })).toBeVisible();

    await page.getByTestId('measurements-chart-mode-overlay').click();
    await expect(page.getByTestId('measurements-chart-mode-overlay')).toHaveAttribute(
      'aria-pressed',
      'true',
    );

    await selectOverlayMetrics(page, ['waist', 'hips', 'chest']);

    const selector = page.getByTestId('measurements-overlay-selector');
    await expect(selector.getByTestId('measurement-metric-waist')).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await expect(selector.getByTestId('measurement-metric-hips')).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await expect(selector.getByTestId('measurement-metric-chest')).toHaveAttribute(
      'aria-pressed',
      'true',
    );

    await expect(page.getByTestId('measurements-overlay-chart')).toBeVisible();

    const legend = page.getByTestId('measurements-chart-legend');
    await expect(legend).toContainText('Талия');
    await expect(legend).toContainText('Ягодицы');
    await expect(legend).toContainText('Грудь');

    await selector.getByTestId('measurement-metric-chest').click();
    await expect(legend).not.toContainText('Грудь');
    await expect(legend).toContainText('Талия');
    await expect(legend).toContainText('Ягодицы');

    await page.reload();
    await expect(page.getByTestId('measurements-chart-mode-overlay')).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await expect(selector.getByTestId('measurement-metric-waist')).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await expect(selector.getByTestId('measurement-metric-hips')).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await expect(selector.getByTestId('measurement-metric-chest')).toHaveAttribute(
      'aria-pressed',
      'false',
    );
    await expect(page.getByTestId('measurements-overlay-chart')).toBeVisible();
  });

  test('overlay mode does not offer weight metric chips', async ({ page }) => {
    await page.goto('/measurements');
    await dismissBodyAbilityModals(page);
    await page.getByTestId('measurements-chart-mode-overlay').click();

    const selector = page.getByTestId('measurements-overlay-selector');
    await expect(selector.getByTestId('measurement-metric-weight')).toHaveCount(0);

    await page.getByTestId('measurements-chart-mode-single').click();
    await expect(page.getByTestId('measurement-metric-weight')).toBeVisible();
  });
});
