import { describe, expect, it } from 'vitest';
import { JOURNEY_STAGES } from './journeyMap';
import { resolveJourneyStageText } from '../types/journeyMap';
import { getThemeTerm } from './themeTerms';
import {
  getThemedBossPresentation,
  getThemedDashboardCopy,
  getThemedEmptyStateCopy,
  getThemedJourneyChapterPresentation,
  getThemedMobPresentation,
  getThemedQuestCopy,
  getThemedSeasonPresentation,
  getThemedTodayCopy,
} from './themeContentRegistry';
import { COZY_BOSS_COPY, COZY_JOURNEY_CHAPTERS, COZY_MOB_COPY } from './cozyContentPack';

describe('Cozy Content Pack v1', () => {
  it('cozy boss titles differ from dark fantasy for key bosses', () => {
    const cases: Array<{ id: keyof typeof COZY_BOSS_COPY; dark: string }> = [
      { id: 'misty_baron', dark: 'Туманный Барон' },
      { id: 'lord_of_empty_day', dark: 'Владыка Пустого Дня' },
      { id: 'divan_king', dark: 'Диванный Король' },
      { id: 'resource_devourer', dark: 'Пожиратель Ресурса' },
      { id: 'old_form_guardian', dark: 'Хранитель Старой Формы' },
    ];

    for (const { id, dark } of cases) {
      const cozy = getThemedBossPresentation('cozy', id, {
        title: dark,
        description: 'x',
      });
      const df = getThemedBossPresentation('darkFantasy', id, {
        title: dark,
        description: 'x',
      });
      expect(cozy.title).not.toBe(dark);
      expect(df.title).toBe(dark);
      expect(cozy.title).toBe(COZY_BOSS_COPY[id].title);
    }
  });

  it('cozy mob presentation uses cozy household terms', () => {
    expect(getThemedMobPresentation('cozy', 'sofa_magnet').title).toBe('Сонный плед');
    expect(getThemedMobPresentation('cozy', 'sweet_whisper').title).toBe('Банка варенья');
    expect(getThemedMobPresentation('cozy', 'impulse_of_rollback').title).toBe(
      'Скользкая ступенька',
    );
    expect(COZY_MOB_COPY.snack_chaos.title).toBe('Открытая кладовая');
  });

  it('cozy journey chapters have separate home titles', () => {
    const expected = [
      'Первый свет в доме',
      'Расчищенное крыльцо',
      'Тропинка во дворе',
      'Порядок на кухне',
      'Дыхание сада',
      'Тёплая комната',
      'Дом держит тепло',
      'Открытые окна',
      'Живой дом',
    ];

    JOURNEY_STAGES.forEach((stage, index) => {
      const cozy = getThemedJourneyChapterPresentation('cozy', stage.id, stage);
      const fromResolve = resolveJourneyStageText(stage, 'cozy');
      expect(cozy.title).toBe(expected[index]);
      expect(fromResolve.title).toBe(expected[index]);
      expect(COZY_JOURNEY_CHAPTERS[stage.id]?.title).toBe(expected[index]);
    });
  });

  it('dark fantasy journey titles remain battle-path language', () => {
    const stage1 = JOURNEY_STAGES[0]!;
    const stage9 = JOURNEY_STAGES[8]!;
    expect(resolveJourneyStageText(stage1, 'darkFantasy').title).toBe('Пробуждение ядра');
    expect(resolveJourneyStageText(stage9, 'darkFantasy').title).toBe('Великое перерождение');
    expect(resolveJourneyStageText(stage1, 'cozy').title).not.toBe(
      resolveJourneyStageText(stage1, 'darkFantasy').title,
    );
  });

  it('unknown theme falls back safely', () => {
    const boss = getThemedBossPresentation('darkFantasy', 'unknown_boss', {
      title: 'Fallback Boss',
      description: 'ok',
    });
    expect(boss.title).toBe('Fallback Boss');
    expect(getThemeTerm('darkFantasy', 'boss')).toBe('Босс');
    expect(getThemeTerm('unknown_theme' as 'cozy', 'boss')).toBe('Босс');
  });

  it('unknown cozy entity returns safe placeholder', () => {
    const boss = getThemedBossPresentation('cozy', 'totally_unknown');
    const mob = getThemedMobPresentation('cozy', 'totally_unknown');
    const chapter = getThemedJourneyChapterPresentation('cozy', 'missing_stage');
    expect(boss.title).toBe('Тихая помеха');
    expect(mob.title).toBe('Тихая помеха');
    expect(chapter.title).toBe('Глава дома');
  });

  it('cozy dashboard labels avoid Босс / Моб дня', () => {
    const dash = getThemedDashboardCopy('cozy');
    const labels = [
      getThemeTerm('cozy', 'boss'),
      getThemeTerm('cozy', 'bossActive'),
      getThemeTerm('cozy', 'mob'),
      dash.questsTitle,
      dash.challengeHint,
      dash.obstacleHint,
    ].join(' ');

    expect(labels).not.toMatch(/Босс/i);
    expect(labels).not.toMatch(/Моб дня/i);
    expect(getThemeTerm('cozy', 'boss')).toBe('Главная помеха');
    expect(getThemeTerm('cozy', 'mob')).toBe('Помеха дня');
    expect(dash.questsTitle).toBe('Задачи дня');
  });

  it('dark fantasy still includes battle terminology where expected', () => {
    const dash = getThemedDashboardCopy('darkFantasy');
    expect(getThemeTerm('darkFantasy', 'boss')).toBe('Босс');
    expect(getThemeTerm('darkFantasy', 'mob')).toBe('Моб дня');
    expect(getThemeTerm('darkFantasy', 'victory')).toBe('Победа');
    expect(dash.questsTitle).toBe('Квесты дня');
    expect(dash.challengeHint).toMatch(/боссом/i);
  });

  it('quest and today copy diverge by theme', () => {
    expect(
      getThemedQuestCopy('cozy', 'steps', { title: 'Шаги' }).title,
    ).toBe('Маршрут дня');
    expect(
      getThemedQuestCopy('darkFantasy', 'steps', { title: 'Шаги' }).title,
    ).toBe('Шаги');
    expect(
      getThemedQuestCopy('cozy', 'alcohol', { title: 'День без алкоголя' }).title,
    ).toBe('Ясный вечер');

    const cozyToday = getThemedTodayCopy('cozy', 'recovery', {
      headline: 'Ядро стабилизируется.',
      detail: 'x',
    });
    expect(cozyToday.headline).toBe('Дом не требует рывка.');
    expect(cozyToday.detail).toMatch(/восстановление/i);
  });

  it('season presentation uses diary language in cozy', () => {
    const cozy = getThemedSeasonPresentation('cozy');
    const dark = getThemedSeasonPresentation('darkFantasy');
    expect(cozy.title).toBe('Сезонный дневник');
    expect(cozy.careTraces).toBe('Следы заботы');
    expect(dark.title).toBe('Летопись сезонов');
    expect(dark.careTraces).toBe('Сезонные боссы');
  });

  it('empty states are theme-aware', () => {
    expect(getThemedEmptyStateCopy('cozy', 'noDayData').description).toMatch(/след дня/);
    expect(getThemedEmptyStateCopy('darkFantasy', 'noDayData').title).toBe('День ещё пуст');
    expect(getThemedEmptyStateCopy('cozy', 'noResources').title).toBe('Ресурсы пока спят');
  });
});
