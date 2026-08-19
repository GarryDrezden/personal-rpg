import { expect, test } from '@playwright/test';
import { gotoAppRoute, openAppReady, setupVisualSession } from './visual-helpers';

test('lazy reports route shows shell then the page', async ({ page }) => {
  await setupVisualSession(page);
  await openAppReady(page);

  await page.route(/WeeklyReportsPage/, async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 700));
    await route.continue();
  });

  await gotoAppRoute(page, '/reports');
  await expect(
    page.getByText('Загрузка раздела...').or(page.getByTestId('reports-page')),
  ).toBeVisible({ timeout: 15_000 });
  await expect(page.getByTestId('reports-page')).toBeVisible({ timeout: 15_000 });
  await expect(page.getByRole('heading', { name: 'Еженедельные отчёты' })).toBeVisible();
});
