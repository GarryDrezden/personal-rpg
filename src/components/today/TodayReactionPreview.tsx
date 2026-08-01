import type { TodaySaveReaction } from '../../utils/todayDayReaction';
import type { CozyResourceId } from '../../types/cozyHome';
import { COZY_RESOURCE_LABELS } from '../../constants/cozyHomeConfig';
import { useAppTheme } from '../../hooks/useAppTheme';

type TodayReactionPreviewProps = {
  reaction: TodaySaveReaction;
  cozyPreview?: Partial<Record<CozyResourceId, number>> | null;
  visible: boolean;
};

export function TodayReactionPreview({
  reaction,
  cozyPreview,
  visible,
}: TodayReactionPreviewProps) {
  const { isCozy } = useAppTheme();
  if (!visible) return null;

  const cozyChips = cozyPreview
    ? (Object.entries(cozyPreview) as [CozyResourceId, number][])
        .filter(([, n]) => n > 0)
        .map(([id, n]) => `+${n} ${COZY_RESOURCE_LABELS[id]}`)
    : [];

  return (
    <aside
      data-testid="today-reaction-preview"
      className={`today-reaction-preview${isCozy ? ' today-reaction-preview--cozy' : ''}`}
      aria-live="polite"
    >
      <p className="today-reaction-preview__eyebrow">Прогноз до сохранения</p>
      <p className="today-reaction-preview__headline">{reaction.headline}</p>
      <p className="today-reaction-preview__detail">{reaction.detail}</p>
      {cozyChips.length > 0 ? (
        <p className="today-reaction-preview__cozy">
          {isCozy ? 'Дом может получить: ' : 'Дом получит: '}
          <span className="font-medium text-[var(--app-text)]">{cozyChips.join(' · ')}</span>
        </p>
      ) : null}
      <p className="today-reaction-preview__hint">
        Сохрани ход — реакция закрепится{isCozy ? ', а дом получит ресурсы' : ''}.
      </p>
    </aside>
  );
}
