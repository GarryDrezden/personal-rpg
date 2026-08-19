import { describe, expect, it } from 'vitest';
import { SETTINGS_SECTION_IDS, SETTINGS_TOC_SECTIONS } from './settingsTocSections';

describe('settings TOC sections', () => {
  it('keeps unique anchors for every TOC chip', () => {
    const ids = SETTINGS_TOC_SECTIONS.map((section) => section.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('does not put experimental sleep in the TOC', () => {
    expect(SETTINGS_TOC_SECTIONS.some((section) => section.id === SETTINGS_SECTION_IDS.experimental)).toBe(
      false,
    );
    expect(SETTINGS_SECTION_IDS.experimental).toBe('settings-experimental');
  });

  it('keeps body map and theme anchors used by Playwright', () => {
    expect(SETTINGS_SECTION_IDS.theme).toBe('settings-theme');
    expect(SETTINGS_SECTION_IDS.bodyMap).toBe('settings-body-map');
    expect(SETTINGS_SECTION_IDS.sidebar).toBe('settings-sidebar');
  });
});
