import { useMemo } from 'react';
import { useAppStore } from '../store/appStore';
import { calcAllSkillProgress, getSkillsSummary } from '../utils/skillEngine';
import { SKILLS } from '../constants/skills';
import { SkillCard } from '../components/skills/SkillCard';
import { SKILL_XP_CODEX_ROWS } from '../components/skills/skillUi';
import { SkillRoadInlineIcon } from '../components/skills/SkillRoadInlineIcon';
import { GROWTH_HUB_PANEL, GROWTH_HUB_RADIAL_GOLD, GROWTH_HUB_EYEBROW, GROWTH_HUB_SUMMARY_PANEL } from '../components/growth/growthHubUi';

export function SkillsPage({ embedded = false }: { embedded?: boolean }) {
  const { dailyEntries, measurements, settings } = useAppStore();

  const skills = useMemo(
    () => calcAllSkillProgress(dailyEntries, measurements, settings),
    [dailyEntries, measurements, settings],
  );

  const ordered = SKILLS.map((def) => skills.find((s) => s.id === def.id)!);
  const { totalLevels, strongest, growthFocus, hasAnyXp } = getSkillsSummary(skills);

  return (
    <div className="space-y-6" data-testid="growth-skills-page">
      <header className={embedded ? `${GROWTH_HUB_PANEL} px-4 py-5 sm:px-6` : undefined}>
        {embedded ? (
          <>
            <div className={GROWTH_HUB_RADIAL_GOLD} aria-hidden />
            <div className="relative">
              <p className={GROWTH_HUB_EYEBROW}>Дороги мастерства</p>
              <h1 className="mt-1.5 text-xl font-bold text-[var(--app-text)] sm:text-2xl">
                Навыки героя
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--app-text-muted)]">
                Навыки растут от обычных дней. Это не обязанности, а дороги, которые поддерживают
                маршрут.
              </p>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-[var(--app-text)]">Навыки героя</h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--app-text-muted)]">
              Навыки растут от обычных дней. Это не обязанности, а дороги, которые поддерживают
              маршрут.
            </p>
          </>
        )}
      </header>

      <section className={`${GROWTH_HUB_SUMMARY_PANEL} px-4 py-4 sm:px-5 sm:py-5`}>
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_0%,rgba(88,28,135,0.1),transparent_50%)]"
          aria-hidden
        />
        <dl className="relative grid gap-4 sm:grid-cols-3">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-[var(--app-text-muted)]/70">
              Общий ранг
            </dt>
            <dd className="mt-1 text-2xl font-bold text-[var(--app-gold)]">{totalLevels}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-[var(--app-text-muted)]/70">
              Сильная дорога
            </dt>
            <dd className="mt-1 flex items-center gap-2 text-sm font-semibold text-[var(--app-text)] sm:text-base">
              {hasAnyXp && strongest ? (
                <>
                  <SkillRoadInlineIcon skillId={strongest.id} />
                  <span>{strongest.title}</span>
                </>
              ) : (
                '—'
              )}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-[var(--app-text-muted)]/70">
              Точка роста
            </dt>
            <dd className="mt-1 flex items-center gap-2 text-sm font-semibold text-[var(--app-text)] sm:text-base">
              {hasAnyXp && growthFocus ? (
                <>
                  <SkillRoadInlineIcon skillId={growthFocus.id} />
                  <span>{growthFocus.title}</span>
                </>
              ) : (
                '—'
              )}
            </dd>
          </div>
        </dl>
        {!hasAnyXp ? (
          <p className="relative mt-4 text-sm text-[var(--app-text-muted)]/80">
            Дороги начнут расти после первых записей — персонаж продолжит путь шаг за шагом.
          </p>
        ) : null}
      </section>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {ordered.map((skill) => (
          <SkillCard key={skill.id} skill={skill} />
        ))}
      </div>

      <footer className="rounded-2xl border border-violet-500/15 bg-gradient-to-br from-[#101522]/70 via-[#0e0c16]/85 to-[#08070f] px-4 py-5 sm:px-6">
        <h2 className="text-base font-semibold text-[var(--app-text)]">Откуда приходит опыт</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--app-text-muted)]/80">
          Навыки растут из обычных действий. Не нужно закрывать всё сразу — достаточно удерживать
          маршрут.
        </p>
        <ul className="mt-4 space-y-2">
          {SKILL_XP_CODEX_ROWS.map(({ skill, actions }) => (
            <li
              key={skill}
              className="flex flex-col gap-0.5 border-b border-violet-500/8 pb-2 text-sm last:border-0 last:pb-0 sm:flex-row sm:gap-3"
            >
              <span className="min-w-[5.5rem] shrink-0 font-medium text-[var(--app-text)]/90">
                {skill}
              </span>
              <span className="text-[var(--app-text-muted)]/65">{actions}</span>
            </li>
          ))}
        </ul>
      </footer>
    </div>
  );
}
