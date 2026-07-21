import { describe, expect, it } from 'vitest';
import { nextJourneyChapterSelection } from './journeyChapterSelection';

describe('nextJourneyChapterSelection', () => {
  it('selects a chapter when none is active', () => {
    expect(nextJourneyChapterSelection(undefined, 'chapter-2')).toBe('chapter-2');
  });

  it('switches to another chapter', () => {
    expect(nextJourneyChapterSelection('chapter-1', 'chapter-3')).toBe('chapter-3');
  });

  it('collapses when the same chapter is tapped again', () => {
    expect(nextJourneyChapterSelection('chapter-2', 'chapter-2')).toBeUndefined();
  });
});
