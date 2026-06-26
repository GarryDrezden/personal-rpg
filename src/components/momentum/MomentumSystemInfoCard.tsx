import { useAppTheme } from '../../hooks/useAppTheme';
import { Card } from '../ui/Card';

export function MomentumSystemInfoCard() {
  const { isDarkFantasy } = useAppTheme();

  return (
    <Card className="bg-[color-mix(in_srgb,var(--app-secondary)_5%,var(--app-card))]">
      <h2 className="text-lg font-semibold text-[var(--app-text)]">Как работает инерция</h2>
      <p className="mt-2 text-sm leading-relaxed text-[var(--app-text-muted)]">
        {isDarkFantasy
          ? 'Инерция затухает к нулю. Стабильные действия разгоняют ядро пути. Пустые дни и сильные откаты снижают ход. Низкая инерция не наказывает — она включает помощь.'
          : 'Инерция затухает к нулю. Стабильные действия разгоняют систему. Пустые дни и сильные откаты снижают ход. Низкая инерция не наказывает — она включает помощь.'}
      </p>
      <ul className="mt-3 space-y-1 text-sm text-[var(--app-text-muted)]">
        <li>· Каждый день инерция слегка затухает к нулю (×0.92)</li>
        <li>· Учёт, шаги, ясность и recovery удерживают ход</li>
        <li>· Высокая инерция даёт небольшой бонус XP</li>
        <li>· При просадке доступны recovery и minimal — без автопереключения</li>
      </ul>
    </Card>
  );
}
