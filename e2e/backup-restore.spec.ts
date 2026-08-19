import { expect, test } from '@playwright/test';
import { CURRENT_DATA_SCHEMA_VERSION } from '../src/storage/userDataConstants';
import { installMockApi } from './mock-api';

function fixtureBackup(settings: Record<string, unknown>) {
  return {
    format: 'personal-rpg-backup',
    backupFormatVersion: 1,
    dataSchemaVersion: CURRENT_DATA_SCHEMA_VERSION,
    exportedAt: '2026-08-19T12:00:00.000Z',
    data: {
      dailyEntries: [],
      measurements: [],
      rewards: [],
      bankDeposits: [],
      settings,
    },
  };
}

test.describe('Backup export / import', () => {
  test.beforeEach(async ({ page }) => {
    await installMockApi(page);
    await page.addInitScript(() => localStorage.clear());
  });

  test('export downloads versioned JSON metadata', async ({ page }) => {
    await page.goto('/settings');
    await expect(page.getByRole('heading', { name: 'Настройки' })).toBeVisible();

    const downloadPromise = page.waitForEvent('download');
    await page.getByTestId('backup-export').click();
    const download = await downloadPromise;
    const stream = await download.createReadStream();
    const chunks: Buffer[] = [];
    if (!stream) throw new Error('no download stream');
    for await (const chunk of stream) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    const parsed = JSON.parse(Buffer.concat(chunks).toString('utf8')) as {
      format: string;
      backupFormatVersion: number;
      dataSchemaVersion: number;
      exportedAt: string;
      data: { settings?: { weightGoal?: number } };
    };
    expect(parsed.format).toBe('personal-rpg-backup');
    expect(parsed.backupFormatVersion).toBe(1);
    expect(parsed.dataSchemaVersion).toBeGreaterThanOrEqual(1);
    expect(parsed.exportedAt).toMatch(/^\d{4}-/);
    expect(parsed.data.settings?.weightGoal).toBeDefined();
  });

  test('import preview then cancel leaves data unchanged', async ({ page }) => {
    await page.goto('/settings');
    await expect(page.getByRole('heading', { name: 'Настройки' })).toBeVisible();
    const backup = fixtureBackup({
      dataSchemaVersion: CURRENT_DATA_SCHEMA_VERSION,
      weightGoal: 77,
      targetWeight: 77,
    });
    await page.getByTestId('backup-import-input').setInputFiles({
      name: 'backup.json',
      mimeType: 'application/json',
      buffer: Buffer.from(JSON.stringify(backup)),
    });
    await expect(page.getByTestId('backup-preview')).toBeVisible();
    await page.getByTestId('backup-restore-cancel').click();
    await expect(page.getByTestId('backup-preview')).toHaveCount(0);
    await expect(page.locator('#settings-weight input[type="number"]')).toHaveValue('100');
  });

  test('import preview confirm restores weight', async ({ page }) => {
    await page.goto('/settings');
    await expect(page.getByRole('heading', { name: 'Настройки' })).toBeVisible();
    const backup = fixtureBackup({
      dataSchemaVersion: CURRENT_DATA_SCHEMA_VERSION,
      weightGoal: 81,
      targetWeight: 81,
      themeId: 'darkFantasy',
    });
    const downloadPromise = page.waitForEvent('download');
    await page.getByTestId('backup-import-input').setInputFiles({
      name: 'restore.json',
      mimeType: 'application/json',
      buffer: Buffer.from(JSON.stringify(backup)),
    });
    await expect(page.getByTestId('backup-preview')).toBeVisible();
    await page.getByTestId('backup-restore-confirm').click();
    await downloadPromise;
    await expect(page.locator('#settings-weight input[type="number"]')).toHaveValue('81', {
      timeout: 15_000,
    });
  });
});
