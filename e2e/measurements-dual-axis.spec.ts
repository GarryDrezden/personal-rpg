import { test, expect } from '@playwright/test';
import { setupMeasurementsE2e, dismissBodyAbilityModals } from './helpers';

test.describe('Measurements dual-axis chart', () => {
  test.use({ viewport: { width: 1280, height: 720 } });

  test.beforeEach(async ({ page }) => {
    await setupMeasurementsE2e(page);
  });

  async function ensureDualAxisChip(
    selector: import('@playwright/test').Locator,
    key: string,
    selected: boolean,
  ) {
    const chip = selector.getByTestId(`dual-axis-metric-${key}`);
    const pressed = await chip.getAttribute('aria-pressed');
    if ((pressed === 'true') !== selected) {
      await chip.click();
    }
  }

  test('dual-axis metrics, legend, tooltip units and persistence', async ({ page }) => {
    await page.goto('/measurements');
    await dismissBodyAbilityModals(page);
    await expect(page.getByRole('heading', { name: 'Замеры' })).toBeVisible();

    await page.getByTestId('measurements-chart-mode-dualAxis').click();
    await expect(page.getByTestId('measurements-chart-mode-dualAxis')).toHaveAttribute(
      'aria-pressed',
      'true',
    );

    await expect(page.getByTestId('measurements-dual-axis-chart')).toBeVisible();

    const selector = page.getByTestId('measurements-dual-axis-selector');
    const legend = page.getByTestId('measurements-chart-legend');

    await expect(page.getByTestId('dual-axis-metric-weight')).toBeVisible();
    await expect(legend).toContainText('Вес, кг');
    await expect(legend).toContainText('Талия');

    await ensureDualAxisChip(selector, 'hips', true);
    await expect(selector.getByTestId('dual-axis-metric-hips')).toHaveAttribute('aria-pressed', 'true');
    await expect(legend).toContainText('Вес, кг');
    await expect(legend).toContainText('Талия');
    await expect(legend).toContainText('Ягодицы');

    await selector.getByTestId('dual-axis-metric-waist').click();
    await expect(legend).not.toContainText('Талия');
    await expect(legend).toContainText('Ягодицы');
    await expect(legend).toContainText('Вес, кг');

    await expect(selector.getByTestId('dual-axis-metric-weight')).toBeVisible();
    await expect(selector.getByRole('button', { name: /Вес/i })).toHaveCount(0);

    const chart = page.getByTestId('measurements-dual-axis-chart');
    const surface = chart.locator('.recharts-surface').first();
    await expect(surface).toBeVisible();
    await surface.hover({ position: { x: 240, y: 120 } });

    const tooltip = page.getByTestId('measurements-chart-tooltip');
    await expect(tooltip).toBeVisible({ timeout: 5000 });
    await expect(tooltip).toContainText('кг');
    await expect(tooltip).toContainText('см');

    await page.reload();
    await dismissBodyAbilityModals(page);

    await expect(page.getByTestId('measurements-chart-mode-dualAxis')).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await expect(selector.getByTestId('dual-axis-metric-hips')).toHaveAttribute('aria-pressed', 'true');
    await expect(selector.getByTestId('dual-axis-metric-waist')).toHaveAttribute('aria-pressed', 'false');
    await expect(page.getByTestId('measurements-dual-axis-chart')).toBeVisible();
    await expect(legend).toContainText('Ягодицы');
    await expect(legend).not.toContainText('Талия');
  });
});
