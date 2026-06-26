import type { Page } from '@playwright/test';
import { createMockApiHandler, SEED_MEASUREMENTS } from './mock-api';

export async function setupMeasurementsE2e(page: Page) {
  await page.route('**/api/**', createMockApiHandler({ measurements: SEED_MEASUREMENTS }));
  await page.addInitScript(() => {
    if (sessionStorage.getItem('measurements-e2e-seeded') !== '1') {
      localStorage.clear();
      sessionStorage.setItem('measurements-e2e-seeded', '1');
    }
    localStorage.setItem(
      'personal-rpg-seen-body-abilities',
      JSON.stringify({ lightness_first_load: '2026-01-01T00:00:00.000Z' }),
    );
  });
}

export async function dismissBodyAbilityModals(page: Page) {
  for (let i = 0; i < 5; i++) {
    const continueBtn = page.getByTestId('body-ability-modal-close');
    if (!(await continueBtn.isVisible().catch(() => false))) break;
    await continueBtn.click();
  }
}
