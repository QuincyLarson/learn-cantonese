import { COMMON_CHARACTER_COUNT } from '@/features/learn/commonCharacters';

export const VOCAB_TIER_ALL = 0;
export const VOCAB_TIER_SIZE = 100;

export type VocabTierOption = {
  value: number;
  label: string;
};

export function clampVocabTierStartRank(value: unknown, maxRank = COMMON_CHARACTER_COUNT): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return 1;
  }

  const normalized = Math.max(0, Math.floor(value));
  if (normalized === VOCAB_TIER_ALL) {
    return VOCAB_TIER_ALL;
  }

  const bounded = Math.min(Math.max(1, normalized), maxRank);
  return Math.floor((bounded - 1) / VOCAB_TIER_SIZE) * VOCAB_TIER_SIZE + 1;
}

export function getVocabTierLabel(startRank: number, maxRank = COMMON_CHARACTER_COUNT): string {
  const normalized = clampVocabTierStartRank(startRank, maxRank);
  if (normalized === VOCAB_TIER_ALL) {
    return '全部詞彙';
  }

  const endRank = Math.min(maxRank, normalized + VOCAB_TIER_SIZE - 1);
  return `${normalized} - ${endRank}`;
}

export function getVocabTierOptions(maxRank = COMMON_CHARACTER_COUNT): VocabTierOption[] {
  const options: VocabTierOption[] = [
    { value: VOCAB_TIER_ALL, label: '全部詞彙' },
  ];

  for (let startRank = 1; startRank <= maxRank; startRank += VOCAB_TIER_SIZE) {
    const endRank = Math.min(maxRank, startRank + VOCAB_TIER_SIZE - 1);
    options.push({
      value: startRank,
      label: `${startRank} - ${endRank}`,
    });
  }

  return options;
}

export function isPromptInVocabTier(
  prompt: Pick<{ rank: number }, 'rank'>,
  startRank: number,
  maxRank = COMMON_CHARACTER_COUNT,
): boolean {
  const normalized = clampVocabTierStartRank(startRank, maxRank);
  if (normalized === VOCAB_TIER_ALL) {
    return true;
  }

  const endRank = Math.min(maxRank, normalized + VOCAB_TIER_SIZE - 1);
  return prompt.rank >= normalized && prompt.rank <= endRank;
}
