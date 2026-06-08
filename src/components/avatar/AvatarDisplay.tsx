import { useEffect, useMemo, useState } from 'react';
import type { AvatarGender, AvatarStage } from '../../types/avatar';
import { AVATAR_STAGE_COUNT, AVATAR_STAGE_LABELS } from '../../constants/avatar';
import { getAvatarImageCandidates } from '../../utils/avatarEngine';

type AvatarDisplayProps = {
  stage: AvatarStage;
  gender: AvatarGender;
  imagePath: string;
  weightLossKg: number;
  hasWeightData?: boolean;
  compact?: boolean;
};

function AvatarPlaceholder({
  stage,
  gender,
  compact,
}: {
  stage: AvatarStage;
  gender: AvatarGender;
  compact?: boolean;
}) {
  const gradients = [
    'from-stone-300 to-stone-400',
    'from-stone-400 to-stone-500',
    'from-amber-300 to-orange-400',
    'from-orange-300 to-amber-400',
    'from-emerald-300 to-teal-400',
    'from-teal-300 to-cyan-400',
    'from-indigo-300 to-violet-400',
  ];

  return (
    <div
      className={`flex h-full w-full flex-col items-center justify-end bg-gradient-to-b ${
        gradients[stage - 1]
      } ${compact ? 'p-2' : 'p-3'}`}
    >
      <div
        className={`rounded-full bg-white/30 ${
          compact ? 'mb-1 h-10 w-10' : 'mb-2 h-14 w-14'
        }`}
        aria-hidden
      />
      <div
        className={`rounded-t-full bg-white/25 ${
          compact ? 'h-12 w-16' : 'h-16 w-20'
        }`}
        aria-hidden
      />
      <p className={`mt-2 text-center font-medium text-white/90 ${compact ? 'text-[10px]' : 'text-xs'}`}>
        {gender === 'male' ? '♂' : '♀'} этап {stage}
      </p>
    </div>
  );
}

export function AvatarDisplay({
  stage,
  gender,
  imagePath,
  weightLossKg,
  hasWeightData = true,
  compact = false,
}: AvatarDisplayProps) {
  const candidates = useMemo(
    () => (imagePath ? [imagePath, ...getAvatarImageCandidates(gender, stage)] : getAvatarImageCandidates(gender, stage)),
    [imagePath, gender, stage],
  );
  const uniqueCandidates = useMemo(
    () => [...new Set(candidates)],
    [candidates],
  );

  const [candidateIndex, setCandidateIndex] = useState(0);

  useEffect(() => {
    setCandidateIndex(0);
  }, [uniqueCandidates]);

  const currentSrc = uniqueCandidates[candidateIndex];
  const showPlaceholder = !currentSrc || candidateIndex >= uniqueCandidates.length;

  const handleImageError = () => {
    setCandidateIndex((i) => i + 1);
  };

  return (
    <div className={compact ? 'space-y-1' : 'space-y-2'}>
      <div
        className={`overflow-hidden rounded-3xl border-2 border-amber-300/80 bg-gradient-to-br from-amber-100 to-orange-100 shadow-inner ${
          compact ? 'h-28 w-28' : 'h-36 w-36 md:h-40 md:w-40'
        }`}
      >
        {showPlaceholder ? (
          <AvatarPlaceholder stage={stage} gender={gender} compact={compact} />
        ) : (
          <img
            src={currentSrc}
            alt={`Аватар, ${AVATAR_STAGE_LABELS[stage]}`}
            className="h-full w-full object-contain object-bottom p-2"
            draggable={false}
            onError={handleImageError}
          />
        )}
      </div>

      <div className={`text-center ${compact ? 'text-[10px]' : 'text-xs'}`}>
        <p className="font-semibold text-stone-800">
          Этап {stage}/{AVATAR_STAGE_COUNT}
        </p>
        <p className="text-rpg-muted">{AVATAR_STAGE_LABELS[stage]}</p>
        {hasWeightData ? (
          <p className="mt-0.5 font-medium text-emerald-700">
            −{weightLossKg.toFixed(1)} кг
          </p>
        ) : (
          <p className="mt-0.5 text-amber-800/80">
            Добавь первый вес, чтобы аватар начал меняться
          </p>
        )}
      </div>
    </div>
  );
}
