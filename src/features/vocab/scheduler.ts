import type { VocabCardProgress, VocabProgressState } from '@/features/progress';
import type { VocabPrompt } from './data';

const DEFAULT_EASE_FACTOR = 2.5;
const MIN_EASE_FACTOR = 1.4;
const FIRST_LEARNING_INTERVAL = 2;
const SECOND_LEARNING_INTERVAL = 6;
const REVIEW_GRADUATING_INTERVAL = 12;
const NEW_CARD_BURST = 6;
const DUE_REVIEW_THRESHOLD = 4;
const NEW_CARD_VARIATION_WINDOW = 12;
const DUE_CARD_VARIATION_WINDOW = 6;
export const VOCAB_SESSION_TIMEOUT_MS = 60 * 60 * 1000;

export const VOCAB_MASTERY_HEARTS = 3;

export type VocabQueueKind = 'new' | 'learning' | 'review';

export type VocabSelection = {
  prompt: VocabPrompt | null;
  queue: VocabQueueKind;
  dueCount: number;
  deckIndex?: number;
};

export function createEmptyVocabCardProgress(): VocabCardProgress {
  return {
    seenCount: 0,
    correctCount: 0,
    revealCount: 0,
    lastSeenAt: undefined,
    lastResult: undefined,
    dueTurn: 0,
    intervalTurns: 0,
    easeFactor: DEFAULT_EASE_FACTOR,
    consecutiveCorrect: 0,
    masteryLevel: 0,
    status: 'new',
  };
}

export function clampMasteryLevel(value: number): number {
  return Math.max(0, Math.min(VOCAB_MASTERY_HEARTS, Math.floor(value)));
}

export function getCardMasteryPercentage(progress: Pick<VocabCardProgress, 'masteryLevel'> | undefined): number {
  return Math.round((clampMasteryLevel(progress?.masteryLevel ?? 0) / VOCAB_MASTERY_HEARTS) * 100);
}

export function countDueVocabCards(progress: VocabProgressState): number {
  return Object.values(progress.cardStats).filter(
    (entry) => entry.seenCount > 0 && entry.dueTurn <= progress.reviewTurn && entry.masteryLevel < VOCAB_MASTERY_HEARTS,
  ).length;
}

function parseTimestamp(value: string | undefined): number | null {
  if (!value) {
    return null;
  }

  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? timestamp : null;
}

export function isVocabSessionExpired(
  lastActivityAt: string | undefined,
  nowMs = Date.now(),
): boolean {
  const lastActivityTimestamp = parseTimestamp(lastActivityAt);
  if (lastActivityTimestamp === null) {
    return true;
  }

  return nowMs - lastActivityTimestamp >= VOCAB_SESSION_TIMEOUT_MS;
}

export function getActiveSessionCorrectCardIds(
  progress: Pick<VocabProgressState, 'sessionCorrectCardIds' | 'sessionLastActivityAt'>,
  nowMs = Date.now(),
): string[] {
  if (isVocabSessionExpired(progress.sessionLastActivityAt, nowMs)) {
    return [];
  }

  return progress.sessionCorrectCardIds;
}

export function getPromptSessionSignature(prompt: Pick<VocabPrompt, 'text' | 'simplified' | 'jyutping'>): string {
  return `${prompt.text.trim()}|${prompt.simplified.trim()}|${prompt.jyutping.trim().toLowerCase()}`;
}

export function projectVocabCardAfterAttempt(
  previous: VocabCardProgress | undefined,
  result: 'correct' | 'revealed',
  nextReviewTurn: number,
  answeredAt?: string,
): VocabCardProgress {
  const base = previous ?? createEmptyVocabCardProgress();
  const nextSeenCount = base.seenCount + 1;
  const nextCorrectCount = base.correctCount + (result === 'correct' ? 1 : 0);
  const nextRevealCount = base.revealCount + (result === 'revealed' ? 1 : 0);
  const lastSeenAt = answeredAt ?? base.lastSeenAt;

  if (result === 'revealed') {
    return {
      ...base,
      seenCount: nextSeenCount,
      correctCount: nextCorrectCount,
      revealCount: nextRevealCount,
      lastSeenAt,
      lastResult: 'revealed',
      dueTurn: nextReviewTurn + 1,
      intervalTurns: 1,
      easeFactor: Math.max(MIN_EASE_FACTOR, base.easeFactor - 0.2),
      consecutiveCorrect: 0,
      masteryLevel: clampMasteryLevel(base.masteryLevel - 1),
      status: 'learning',
    };
  }

  const nextConsecutiveCorrect = base.consecutiveCorrect + 1;
  const nextMasteryLevel = clampMasteryLevel(base.masteryLevel + 1);

  if (base.status === 'review') {
    const nextEaseFactor = Math.max(MIN_EASE_FACTOR, base.easeFactor + 0.15);
    const seedInterval = Math.max(base.intervalTurns, REVIEW_GRADUATING_INTERVAL);
    const nextIntervalTurns = Math.max(REVIEW_GRADUATING_INTERVAL, Math.round(seedInterval * nextEaseFactor));

    return {
      ...base,
      seenCount: nextSeenCount,
      correctCount: nextCorrectCount,
      revealCount: nextRevealCount,
      lastSeenAt,
      lastResult: 'correct',
      dueTurn: nextReviewTurn + nextIntervalTurns,
      intervalTurns: nextIntervalTurns,
      easeFactor: nextEaseFactor,
      consecutiveCorrect: nextConsecutiveCorrect,
      masteryLevel: nextMasteryLevel,
      status: 'review',
    };
  }

  if (nextConsecutiveCorrect >= 2) {
    return {
      ...base,
      seenCount: nextSeenCount,
      correctCount: nextCorrectCount,
      revealCount: nextRevealCount,
      lastSeenAt,
      lastResult: 'correct',
      dueTurn: nextReviewTurn + REVIEW_GRADUATING_INTERVAL,
      intervalTurns: REVIEW_GRADUATING_INTERVAL,
      easeFactor: Math.max(DEFAULT_EASE_FACTOR, base.easeFactor),
      consecutiveCorrect: nextConsecutiveCorrect,
      masteryLevel: nextMasteryLevel,
      status: 'review',
    };
  }

  return {
    ...base,
    seenCount: nextSeenCount,
    correctCount: nextCorrectCount,
    revealCount: nextRevealCount,
    lastSeenAt,
    lastResult: 'correct',
    dueTurn: nextReviewTurn + (base.status === 'learning' ? SECOND_LEARNING_INTERVAL : FIRST_LEARNING_INTERVAL),
    intervalTurns: base.status === 'learning' ? SECOND_LEARNING_INTERVAL : FIRST_LEARNING_INTERVAL,
    easeFactor: Math.max(DEFAULT_EASE_FACTOR, base.easeFactor),
    consecutiveCorrect: nextConsecutiveCorrect,
    masteryLevel: nextMasteryLevel,
    status: 'learning',
  };
}

export function chooseNextVocabPrompt(
  prompts: readonly VocabPrompt[],
  progress: VocabProgressState,
  sessionSalt = 0,
): VocabSelection {
  const pickSessionOffset = (length: number, turnOffset = 0) => {
    if (length <= 1) {
      return 0;
    }

    const seed = (((sessionSalt + 1) * 2654435761) + ((progress.reviewTurn + turnOffset + 1) * 1013904223)) >>> 0;
    return seed % length;
  };

  const promptIndexById = new Map(prompts.map((prompt, index) => [prompt.id, index]));
  const sessionCorrectCardIds = new Set(getActiveSessionCorrectCardIds(progress));
  const promptById = new Map(prompts.map((prompt) => [prompt.id, prompt]));
  const sessionCorrectPromptSignatures = new Set(
    [...sessionCorrectCardIds]
      .map((cardId) => promptById.get(cardId))
      .filter((prompt): prompt is VocabPrompt => Boolean(prompt))
      .map((prompt) => getPromptSessionSignature(prompt)),
  );
  const dueEntries = Object.entries(progress.cardStats)
    .filter(([cardId, entry]) =>
      entry.seenCount > 0 &&
      entry.dueTurn <= progress.reviewTurn &&
      promptById.has(cardId) &&
      !sessionCorrectCardIds.has(cardId) &&
      entry.masteryLevel < VOCAB_MASTERY_HEARTS &&
      !sessionCorrectPromptSignatures.has(getPromptSessionSignature(promptById.get(cardId)!)),
    )
    .sort((left, right) => {
      const [leftId, leftEntry] = left;
      const [rightId, rightEntry] = right;

      if (leftEntry.status !== rightEntry.status) {
        return leftEntry.status === 'learning' ? -1 : 1;
      }

      if (leftEntry.dueTurn !== rightEntry.dueTurn) {
        return leftEntry.dueTurn - rightEntry.dueTurn;
      }

      if (leftEntry.consecutiveCorrect !== rightEntry.consecutiveCorrect) {
        return leftEntry.consecutiveCorrect - rightEntry.consecutiveCorrect;
      }

      if ((leftEntry.lastSeenAt ?? '') !== (rightEntry.lastSeenAt ?? '')) {
        return (leftEntry.lastSeenAt ?? '').localeCompare(rightEntry.lastSeenAt ?? '');
      }

      return leftId.localeCompare(rightId);
    });

  const dueCount = dueEntries.length;
  const isEligibleNewPrompt = (prompt: VocabPrompt, index: number) => {
    if (index < progress.nextNewCardIndex) {
      return false;
    }

    const entry = progress.cardStats[prompt.id];
    if (entry?.masteryLevel && entry.masteryLevel >= VOCAB_MASTERY_HEARTS) {
      return false;
    }

    if (sessionCorrectPromptSignatures.has(getPromptSessionSignature(prompt))) {
      return false;
    }

    return !entry || entry.seenCount === 0;
  };
  const eligibleNewPrompts = prompts.filter(isEligibleNewPrompt);
  const wrappedEligibleNewPrompts =
    eligibleNewPrompts.length > 0
      ? eligibleNewPrompts
      : progress.nextNewCardIndex > 0
        ? prompts.filter((prompt) => {
            const entry = progress.cardStats[prompt.id];
            if (entry?.masteryLevel && entry.masteryLevel >= VOCAB_MASTERY_HEARTS) {
              return false;
            }

            if (sessionCorrectPromptSignatures.has(getPromptSessionSignature(prompt))) {
              return false;
            }

            return !entry || entry.seenCount === 0;
          })
        : [];
  const nextNewWindow = wrappedEligibleNewPrompts.slice(0, NEW_CARD_VARIATION_WINDOW);
  const nextNewPrompt =
    nextNewWindow.length > 0
      ? nextNewWindow[pickSessionOffset(nextNewWindow.length)]
      : undefined;
  const wrappedForNewSelection = eligibleNewPrompts.length === 0 && wrappedEligibleNewPrompts.length > 0;
  const nextNewDeckIndex = nextNewPrompt
    ? wrappedForNewSelection
      ? promptIndexById.get(nextNewPrompt.id)
      : progress.nextNewCardIndex
    : undefined;
  const hasDueLearningCards = dueEntries.some(([, entry]) => entry.status === 'learning');
  const canIntroduceNewCard =
    Boolean(nextNewPrompt) &&
    !hasDueLearningCards &&
    (dueCount === 0 || (progress.newCardsSinceReview < NEW_CARD_BURST && dueCount < DUE_REVIEW_THRESHOLD));

  if (canIntroduceNewCard && nextNewPrompt) {
    return { prompt: nextNewPrompt, queue: 'new', dueCount, deckIndex: nextNewDeckIndex };
  }

  if (dueEntries.length > 0) {
    const dueWindow = dueEntries.slice(0, DUE_CARD_VARIATION_WINDOW);
    const [cardId, entry] = dueWindow[pickSessionOffset(dueWindow.length, 17)];
    return {
      prompt: promptById.get(cardId) ?? null,
      queue: entry.status === 'review' ? 'review' : 'learning',
      dueCount,
      deckIndex: promptIndexById.get(cardId),
    };
  }

  if (nextNewPrompt) {
    return { prompt: nextNewPrompt, queue: 'new', dueCount, deckIndex: nextNewDeckIndex };
  }

  return { prompt: null, queue: 'review', dueCount };
}
