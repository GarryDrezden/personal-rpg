import { describe, expect, it } from 'vitest';
import {
  buildTodaySearchParams,
  buildWeekPageSearchParams,
  resolveTodayPageSelection,
} from './todayWeekSelection';

describe('resolveTodayPageSelection', () => {
  const today = '2026-07-21'; // Tuesday; current week Mon 2026-07-20

  it('defaults to today in current week', () => {
    expect(resolveTodayPageSelection({ today, dateParam: null, weekParam: null })).toEqual({
      visibleWeekStart: '2026-07-20',
      selectedDate: '2026-07-21',
    });
  });

  it('allows a day from previous week via week param', () => {
    expect(
      resolveTodayPageSelection({
        today,
        dateParam: '2026-07-16',
        weekParam: '2026-07-13',
      }),
    ).toEqual({
      visibleWeekStart: '2026-07-13',
      selectedDate: '2026-07-16',
    });
  });

  it('infers previous week from date param alone', () => {
    expect(
      resolveTodayPageSelection({
        today,
        dateParam: '2026-07-14',
        weekParam: null,
      }),
    ).toEqual({
      visibleWeekStart: '2026-07-13',
      selectedDate: '2026-07-14',
    });
  });

  it('defaults to last day when viewing past week without date', () => {
    expect(
      resolveTodayPageSelection({
        today,
        dateParam: null,
        weekParam: '2026-07-13',
      }),
    ).toEqual({
      visibleWeekStart: '2026-07-13',
      selectedDate: '2026-07-19',
    });
  });

  it('clamps future weeks to current week', () => {
    expect(
      resolveTodayPageSelection({
        today,
        dateParam: null,
        weekParam: '2026-07-27',
      }),
    ).toEqual({
      visibleWeekStart: '2026-07-20',
      selectedDate: '2026-07-21',
    });
  });
});

describe('buildTodaySearchParams', () => {
  it('omits params on current week today', () => {
    expect(
      buildTodaySearchParams({
        currentWeekStart: '2026-07-20',
        visibleWeekStart: '2026-07-20',
        date: '2026-07-21',
        today: '2026-07-21',
      }),
    ).toEqual({});
  });

  it('includes week and date for previous week day', () => {
    expect(
      buildTodaySearchParams({
        currentWeekStart: '2026-07-20',
        visibleWeekStart: '2026-07-13',
        date: '2026-07-16',
        today: '2026-07-21',
      }),
    ).toEqual({ week: '2026-07-13', date: '2026-07-16' });
  });
});

describe('buildWeekPageSearchParams', () => {
  it('returns empty for current week', () => {
    expect(buildWeekPageSearchParams('2026-07-20', '2026-07-20')).toEqual({});
  });

  it('returns week param for past week', () => {
    expect(buildWeekPageSearchParams('2026-07-13', '2026-07-20')).toEqual({
      week: '2026-07-13',
    });
  });
});
