import { expect, type Locator, type Page } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { installMockApi, type MockApiOptions } from './mock-api';
import { dismissBodyAbilityModals } from './helpers';

export const VISUAL_VIEWPORTS = {
  mobile390: { width: 390, height: 844 },
  mobile430: { width: 430, height: 932 },
  tablet768: { width: 768, height: 1024 },
  laptop1024: { width: 1024, height: 768 },
  desktop1440: { width: 1440, height: 900 },
  desktop1920: { width: 1920, height: 1080 },
} as const;

export type VisualThemeId = 'cozy' | 'darkFantasy';

const HARMLESS_CONSOLE = [
  /Download the React DevTools/i,
  /\[vite\]/i,
  /Failed to load resource: the server responded with a status of 404/i,
];

export async function setupVisualSession(
  page: Page,
  options: MockApiOptions & { themeId?: VisualThemeId } = {},
): Promise<{ errors: string[] }> {
  const errors: string[] = [];
  page.on('pageerror', (error) => {
    errors.push(`pageerror: ${error.message}`);
  });
  page.on('console', (msg) => {
    if (msg.type() !== 'error') return;
    const text = msg.text();
    if (HARMLESS_CONSOLE.some((re) => re.test(text))) return;
    errors.push(`console.error: ${text}`);
  });

  await installMockApi(page, {
    freshOnboarding: false,
    ...options,
    settings: {
      themeId: options.themeId ?? 'cozy',
      onboardingCompleted: true,
      ...options.settings,
    },
  });
  await page.addInitScript(() => {
    localStorage.clear();
    sessionStorage.clear();
    localStorage.setItem(
      'personal-rpg-seen-body-abilities',
      JSON.stringify({ lightness_first_load: '2026-01-01T00:00:00.000Z' }),
    );
  });
  return { errors };
}

export async function gotoAppRoute(page: Page, path: string): Promise<void> {
  let lastError: unknown;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      await page.goto(path, { waitUntil: 'domcontentloaded' });
      return;
    } catch (error) {
      lastError = error;
      const message = error instanceof Error ? error.message : String(error);
      if (!/ERR_ABORTED|NS_BINDING_ABORTED|interrupted/i.test(message)) {
        throw error;
      }
      await page.waitForTimeout(300 * (attempt + 1));
    }
  }
  throw lastError;
}

export async function openAppReady(page: Page): Promise<void> {
  await gotoAppRoute(page, '/');
  await dismissBodyAbilityModals(page);
  await expect(page.getByTestId('dashboard-page')).toBeVisible({ timeout: 15_000 });
}

export async function switchTheme(page: Page, themeId: VisualThemeId): Promise<void> {
  await gotoAppRoute(page, '/settings');
  await expect(page.getByTestId('settings-page')).toBeVisible({ timeout: 15_000 });
  await page.getByTestId(`theme-option-${themeId}`).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', themeId, { timeout: 10_000 });
}

export async function assertNoHorizontalOverflow(page: Page): Promise<void> {
  const report = await page.evaluate(() => {
    const vw = window.innerWidth;
    const docWidth = document.documentElement.scrollWidth;
    if (docWidth <= vw + 1) {
      return { overflow: false, width: docWidth, vw, offenders: [] as string[] };
    }
    const offenders: string[] = [];
    for (const el of Array.from(document.body.querySelectorAll('*'))) {
      const rect = el.getBoundingClientRect();
      if (rect.width < 2 || rect.height < 2) continue;
      if (rect.right <= vw + 2) continue;
      const node = el as HTMLElement;
      const id = node.dataset.testid
        ? `[data-testid=${node.dataset.testid}]`
        : `${node.tagName.toLowerCase()}${node.className ? '.' + String(node.className).split(' ').slice(0, 3).join('.') : ''}`;
      offenders.push(`${id} right=${Math.round(rect.right)}`);
      if (offenders.length >= 8) break;
    }
    return { overflow: true, width: docWidth, vw, offenders };
  });

  expect(
    report.overflow,
    `Horizontal overflow ${report.width}px > ${report.vw}px. Offenders: ${report.offenders.join('; ') || 'unknown'}`,
  ).toBe(false);
}

export async function assertElementInsideViewport(locator: Locator): Promise<void> {
  const box = await locator.boundingBox();
  expect(box, 'element has no bounding box').toBeTruthy();
  const page = locator.page();
  const viewport = page.viewportSize();
  expect(viewport).toBeTruthy();
  if (!box || !viewport) return;
  expect(box.x + box.width).toBeLessThanOrEqual(viewport.width + 2);
  expect(box.y).toBeGreaterThanOrEqual(-2);
}

export async function captureVisualState(
  page: Page,
  themeId: VisualThemeId,
  viewportName: string,
  screenName: string,
): Promise<void> {
  if (!process.env.VISUAL_QA) return;
  const folder = themeId === 'darkFantasy' ? 'dark-fantasy' : 'cozy';
  const file = join(
    process.cwd(),
    'artifacts',
    'visual-qa',
    folder,
    viewportName,
    `${screenName}.png`,
  );
  mkdirSync(dirname(file), { recursive: true });
  await page.screenshot({ path: file, fullPage: true });
}

export function expectNoFatalErrors(errors: string[]): void {
  const fatal = errors.filter(
    (line) =>
      !/favicon/i.test(line) &&
      !/net::ERR_ABORTED/i.test(line) &&
      !/Failed to load resource/i.test(line),
  );
  expect(fatal, fatal.join('\n')).toEqual([]);
}
