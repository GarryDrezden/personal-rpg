import { describe, expect, it } from 'vitest';
import { getThemeTerm } from '../constants/themeTerms';
import { getBossPresentation, getMobPresentation } from './themeEntityPresentation';
import { getThemeAsset } from './themeAssetRegistry';

describe('theme terminology', () => {
  it('uses cozy recovery labels', () => {
    expect(getThemeTerm('cozy', 'boss')).toBe('Главная помеха');
    expect(getThemeTerm('cozy', 'mob')).toBe('Помеха дня');
    expect(getThemeTerm('cozy', 'victory')).toBe('Дом стал теплее');
    expect(getThemeTerm('darkFantasy', 'boss')).toBe('Босс');
    expect(getThemeTerm('darkFantasy', 'mob')).toBe('Моб дня');
  });
});

describe('theme entity presentation', () => {
  it('maps cozy mob titles without dark fantasy names', () => {
    const presentation = getMobPresentation('cozy', 'sofa_magnet', {
      title: 'Диванный Магнит',
      subtitle: 'x',
      description: 'y',
      image: '/game-assets/mobs/sofa-magnet.webp',
    });
    expect(presentation.title).toBe('Сонный плед');
    expect(presentation.tone).toBe('cozy_challenge');
    expect(presentation.imageCandidates.every((p) => p.includes('/themes/cozy/'))).toBe(true);
  });

  it('keeps dark fantasy boss presentation unchanged', () => {
    const presentation = getBossPresentation('darkFantasy', 'misty_baron', {
      title: 'Туманный Барон',
      subtitle: 'Босс',
      description: 'Тьма',
      image: '/game-assets/bosses/misty-baron.png',
    });
    expect(presentation.title).toBe('Туманный Барон');
    expect(presentation.tone).toBe('battle');
  });
});

describe('theme asset registry', () => {
  it('never returns darkFantasy paths for cozy assets', () => {
    const kinds = ['hero_avatar', 'companion', 'mob', 'boss', 'chapter_background'] as const;
    for (const kind of kinds) {
      const ref = getThemeAsset({
        themeId: 'cozy',
        kind,
        entityId: kind === 'chapter_background' ? '1' : 'sofa_magnet',
        stage: 1,
        gender: 'male',
      });
      expect(ref.path).toContain('/themes/cozy/');
      if (ref.fallbackPath) expect(ref.fallbackPath).toContain('/themes/cozy/');
    }
  });
});
