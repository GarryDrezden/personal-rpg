import { describe, expect, it } from 'vitest';
import { PWA_MANIFEST } from './pwa';

describe('PWA manifest', () => {
  it('defines install metadata and icons', () => {
    expect(PWA_MANIFEST.name).toBe('Личная RPG');
    expect(PWA_MANIFEST.display).toBe('standalone');
    expect(PWA_MANIFEST.start_url).toBe('/');
    expect(PWA_MANIFEST.icons?.length).toBeGreaterThanOrEqual(2);
  });

  it('uses existing public icon assets', () => {
    const sources = PWA_MANIFEST.icons?.map((icon) => icon.src) ?? [];
    expect(sources).toContain('favicon-192.png');
    expect(sources).toContain('logo-512.png');
  });
});
