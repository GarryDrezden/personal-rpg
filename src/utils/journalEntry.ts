import type { DailyEntry } from '../types';

/** День с записью в дневнике: явная отметка или непустые «Заметки / дневник дня». */
export function hasJournalEntry(entry: DailyEntry | undefined | null): boolean {
  if (!entry) return false;
  if (entry.journal) return true;
  return entry.comment.trim().length > 0;
}
