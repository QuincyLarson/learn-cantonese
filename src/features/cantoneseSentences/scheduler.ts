import type { CantoneseSentenceCard } from './data';
import type { CantoneseSentenceCardProgress, CantoneseSentenceDrillProgress } from '@/features/progress/types';

export const SENTENCE_MASTERED_LEVEL = 3;
const SENTENCE_REVIEW_AFTER_NEW_CARDS = 3;
const SENTENCE_INTERVAL_BY_LEVEL: Record<number, number> = {
  1: 2,
  2: 8,
};

export type SentenceSelectionReason = 'new' | 'review';

export type SentenceSelection = {
  card: CantoneseSentenceCard;
  index: number;
  reason: SentenceSelectionReason;
};

export function projectSentenceCardAfterCompletion(
  previous: CantoneseSentenceCardProgress | undefined,
  nextReviewTurn: number,
  completedAt: string,
): CantoneseSentenceCardProgress {
  const masteryLevel = Math.min(SENTENCE_MASTERED_LEVEL, (previous?.masteryLevel ?? 0) + 1);

  if (masteryLevel >= SENTENCE_MASTERED_LEVEL) {
    return {
      seenCount: (previous?.seenCount ?? 0) + 1,
      correctCount: (previous?.correctCount ?? 0) + 1,
      dueTurn: Number.MAX_SAFE_INTEGER,
      masteryLevel,
      status: 'mastered',
      lastCompletedAt: completedAt,
    };
  }

  const intervalTurns = SENTENCE_INTERVAL_BY_LEVEL[masteryLevel] ?? SENTENCE_INTERVAL_BY_LEVEL[2];

  return {
    seenCount: (previous?.seenCount ?? 0) + 1,
    correctCount: (previous?.correctCount ?? 0) + 1,
    dueTurn: nextReviewTurn + intervalTurns,
    masteryLevel,
    status: masteryLevel >= 2 ? 'review' : 'learning',
    lastCompletedAt: completedAt,
  };
}

function getSentenceStat(
  progress: CantoneseSentenceDrillProgress,
  sentenceId: string,
): CantoneseSentenceCardProgress | undefined {
  return progress.sentenceStats[sentenceId];
}

function getNextNewSentenceIndex(
  progress: CantoneseSentenceDrillProgress,
  cards: readonly CantoneseSentenceCard[],
): number {
  return cards.findIndex((card) => !(getSentenceStat(progress, card.id)?.seenCount));
}

export function selectNextSentenceCard(
  progress: CantoneseSentenceDrillProgress,
  cards: readonly CantoneseSentenceCard[],
): SentenceSelection | null {
  const dueReviews: SentenceSelection[] = [];
  const pendingReviews: SentenceSelection[] = [];

  cards.forEach((card, index) => {
    const stat = getSentenceStat(progress, card.id);
    if (!stat || stat.seenCount === 0 || stat.masteryLevel >= SENTENCE_MASTERED_LEVEL) {
      return;
    }

    const selection = { card, index, reason: 'review' as const };
    pendingReviews.push(selection);

    if (stat.dueTurn <= progress.reviewTurn) {
      dueReviews.push(selection);
    }
  });

  dueReviews.sort((left, right) => {
    const leftDue = getSentenceStat(progress, left.card.id)?.dueTurn ?? Number.MAX_SAFE_INTEGER;
    const rightDue = getSentenceStat(progress, right.card.id)?.dueTurn ?? Number.MAX_SAFE_INTEGER;
    return leftDue - rightDue || left.index - right.index;
  });

  pendingReviews.sort((left, right) => {
    const leftDue = getSentenceStat(progress, left.card.id)?.dueTurn ?? Number.MAX_SAFE_INTEGER;
    const rightDue = getSentenceStat(progress, right.card.id)?.dueTurn ?? Number.MAX_SAFE_INTEGER;
    return leftDue - rightDue || left.index - right.index;
  });

  const nextNewIndex = getNextNewSentenceIndex(progress, cards);
  const nextNewSelection =
    nextNewIndex >= 0
      ? { card: cards[nextNewIndex], index: nextNewIndex, reason: 'new' as const }
      : null;

  if (dueReviews.length > 0 && (progress.newCardsSinceReview >= SENTENCE_REVIEW_AFTER_NEW_CARDS || !nextNewSelection)) {
    return dueReviews[0];
  }

  if (nextNewSelection) {
    return nextNewSelection;
  }

  if (dueReviews.length > 0) {
    return dueReviews[0];
  }

  if (pendingReviews.length > 0) {
    return pendingReviews[0];
  }

  return null;
}

export function countDueSentenceCards(progress: CantoneseSentenceDrillProgress): number {
  return Object.values(progress.sentenceStats).filter((entry) => (
    entry.masteryLevel > 0 &&
    entry.masteryLevel < SENTENCE_MASTERED_LEVEL &&
    entry.dueTurn <= progress.reviewTurn
  )).length;
}

export function countMasteredSentenceCards(progress: CantoneseSentenceDrillProgress): number {
  return Object.values(progress.sentenceStats).filter((entry) => entry.masteryLevel >= SENTENCE_MASTERED_LEVEL).length;
}
