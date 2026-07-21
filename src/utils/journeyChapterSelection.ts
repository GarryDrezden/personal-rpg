/** Toggle Journey chapter selection (mobile accordion can collapse). */
export function nextJourneyChapterSelection(
  currentId: string | undefined,
  clickedId: string,
): string | undefined {
  return currentId === clickedId ? undefined : clickedId;
}
