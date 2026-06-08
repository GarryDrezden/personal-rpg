import { StatTile } from '../ui/StatTile';

type QuickStatsCardProps = {
  streaks: {
    noAlcohol: number;
    caloriesOk: number;
    stepsOk: number;
    journal: number;
  };
  caloriesOkDays: number;
  noAlcoholDays: number;
  weight: string;
  waist?: string | number | null;
};

export function QuickStatsCard({
  streaks,
  caloriesOkDays,
  noAlcoholDays,
  weight,
  waist,
}: QuickStatsCardProps) {
  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold">Быстрая статистика</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="Калории/нед" value={`${caloriesOkDays}/7`} sub={`серия ${streaks.caloriesOk} дн.`} />
        <StatTile label="Без алкоголя" value={`${noAlcoholDays}/7`} sub={`серия ${streaks.noAlcohol} дн.`} />
        <StatTile label="Шаги" value={`${streaks.stepsOk} дн.`} sub="текущая серия" />
        <StatTile
          label="Вес"
          value={weight}
          sub={waist != null ? `талия ${waist}` : undefined}
        />
      </div>
    </section>
  );
}
