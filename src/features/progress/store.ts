import { createDefaultAppState, isBrowser, nowIso, parseJson, PROGRESS_CHANGE_EVENT, PROGRESS_STORAGE_KEY, serializeAppState } from './storage';
import type {
  AppState,
  ArcadeSessionInput,
  CantoneseSentenceCompletionInput,
  CalloutDismissInput,
  LessonCompletionInput,
  PlaybackSpeed,
  QuizAttemptInput,
  ScriptPreference,
  SettingsState,
  ThemePreference,
  VocabAttemptInput,
} from './types';
import { isVocabSessionExpired, projectVocabCardAfterAttempt } from '@/features/vocab/scheduler';
import { projectSentenceCardAfterCompletion } from '@/features/cantoneseSentences/scheduler';
import { clampVocabTierStartRank } from '@/features/vocab/tiers';

type Listener = () => void;

const listeners = new Set<Listener>();

let snapshot = loadAppState();

if (isBrowser()) {
  window.addEventListener('storage', handleStorageEvent);
}

function handleStorageEvent(event: StorageEvent): void {
  if (event.key !== PROGRESS_STORAGE_KEY) {
    return;
  }

  snapshot = loadAppState();
  emit();
}

function emit(): void {
  listeners.forEach((listener) => listener());

  if (isBrowser()) {
    window.dispatchEvent(new CustomEvent(PROGRESS_CHANGE_EVENT));
  }
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function uniqueStrings(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return [...new Set(value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0))];
}

function clampPlaybackSpeed(value: unknown): PlaybackSpeed {
  return value === 0.5 || value === 0.75 || value === 1 ? value : 1;
}

function normalizeThemePreference(value: unknown): ThemePreference {
  return value === 'light' || value === 'dark' || value === 'system' ? value : 'system';
}

function normalizeScriptPreference(value: unknown): ScriptPreference {
  return value === 'simplified' ? 'simplified' : 'traditional';
}

function normalizeBooleanRecord(value: unknown): Record<string, boolean> {
  if (!isObject(value)) {
    return {};
  }

  const result: Record<string, boolean> = {};

  for (const [key, entry] of Object.entries(value)) {
    if (typeof entry === 'boolean') {
      result[key] = entry;
    }
  }

  return result;
}

function normalizeProgress(input: unknown): AppState['progress'] {
  const defaultState = createDefaultAppState().progress;

  if (!isObject(input)) {
    return defaultState;
  }

  const completedLessonIds = uniqueStrings(input.completedLessonIds);
  const reviewLaterIds = uniqueStrings(input.reviewLaterIds);
  const dismissedCalloutIds = uniqueStrings(input.dismissedCalloutIds);

  const lessonCompletionMeta: AppState['progress']['lessonCompletionMeta'] = {};
  if (isObject(input.lessonCompletionMeta)) {
    for (const [lessonId, entry] of Object.entries(input.lessonCompletionMeta)) {
      if (!isObject(entry)) {
        continue;
      }

      const completedAt = typeof entry.completedAt === 'string' ? entry.completedAt : nowIso();
      const revisitCountValue = typeof entry.revisitCount === 'number' ? entry.revisitCount : 0;
      const revisitCount = Math.max(0, Math.floor(revisitCountValue));

      lessonCompletionMeta[lessonId] = { completedAt, revisitCount };
    }
  }

  const quizScores: AppState['progress']['quizScores'] = {};
  if (isObject(input.quizScores)) {
    for (const [quizId, entry] of Object.entries(input.quizScores)) {
      if (!isObject(entry)) {
        continue;
      }

      const bestScore = normalizeScore(entry.bestScore);
      const lastScore = normalizeScore(entry.lastScore);
      const attemptsValue = typeof entry.attempts === 'number' ? entry.attempts : 0;
      const attempts = Math.max(0, Math.floor(attemptsValue));
      const passed = typeof entry.passed === 'boolean' ? entry.passed : false;
      const lastAttemptAt = typeof entry.lastAttemptAt === 'string' ? entry.lastAttemptAt : nowIso();

      quizScores[quizId] = { quizId, bestScore, lastScore, attempts, passed, lastAttemptAt };
    }
  }

  const arcadeStats = normalizeArcadeStats(input.arcadeStats);
  const vocab = normalizeVocabProgress(input.vocab);
  const cantoneseSentenceDrill = normalizeCantoneseSentenceDrillProgress(input.cantoneseSentenceDrill);

  return {
    schemaVersion: 1,
    completedLessonIds,
    lessonCompletionMeta,
    quizScores,
    reviewLaterIds,
    arcadeStats,
    vocab,
    cantoneseSentenceDrill,
    dismissedCalloutIds,
    experimentalFlags: normalizeBooleanRecord(input.experimentalFlags),
  };
}

function normalizeScore(value: unknown): number {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round(value)));
}

function normalizeArcadeStats(value: unknown): AppState['progress']['arcadeStats'] {
  const defaultStats = createDefaultAppState().progress.arcadeStats;

  if (!isObject(value)) {
    return defaultStats;
  }

  const games: AppState['progress']['arcadeStats']['games'] = {};
  if (isObject(value.games)) {
    for (const [gameId, entry] of Object.entries(value.games)) {
      if (!isObject(entry)) {
        continue;
      }

      const plays = safeInt(entry.plays);
      const wins = safeInt(entry.wins);
      const losses = safeInt(entry.losses);
      const bestScore = normalizeScore(entry.bestScore);
      const lastPlayedAt = typeof entry.lastPlayedAt === 'string' ? entry.lastPlayedAt : undefined;

      games[gameId] = { plays, wins, losses, bestScore, lastPlayedAt };
    }
  }

  return {
    totalPlays: safeInt(value.totalPlays),
    totalWins: safeInt(value.totalWins),
    totalLosses: safeInt(value.totalLosses),
    totalCorrect: safeInt(value.totalCorrect),
    totalIncorrect: safeInt(value.totalIncorrect),
    bestStreak: safeInt(value.bestStreak),
    lastPlayedAt: typeof value.lastPlayedAt === 'string' ? value.lastPlayedAt : undefined,
    games,
  };
}

function normalizeVocabProgress(value: unknown): AppState['progress']['vocab'] {
  const defaultState = createDefaultAppState().progress.vocab;

  if (!isObject(value)) {
    return defaultState;
  }

  const reviewTurn = safeInt(value.reviewTurn ?? value.totalAttempts);

  const characterStats: AppState['progress']['vocab']['characterStats'] = {};
  if (isObject(value.characterStats)) {
    for (const [characterId, entry] of Object.entries(value.characterStats)) {
      if (!isObject(entry)) {
        continue;
      }

      characterStats[characterId] = {
        seenCount: safeInt(entry.seenCount),
        correctCount: safeInt(entry.correctCount),
        revealCount: safeInt(entry.revealCount),
        lastSeenAt: typeof entry.lastSeenAt === 'string' ? entry.lastSeenAt : undefined,
        masteredAt: typeof entry.masteredAt === 'string' ? entry.masteredAt : undefined,
      };
    }
  }

  for (const characterId of uniqueStrings(value.masteredCharacterIds)) {
    const previous = characterStats[characterId];
    characterStats[characterId] = {
      seenCount: previous?.seenCount ?? 1,
      correctCount: Math.max(previous?.correctCount ?? 0, 1),
      revealCount: previous?.revealCount ?? 0,
      lastSeenAt: previous?.lastSeenAt,
      masteredAt: previous?.masteredAt ?? nowIso(),
    };
  }

  const cardStats: AppState['progress']['vocab']['cardStats'] = {};
  if (isObject(value.cardStats)) {
    for (const [cardId, entry] of Object.entries(value.cardStats)) {
      if (!isObject(entry)) {
        continue;
      }

      const lastResult = entry.lastResult === 'correct' || entry.lastResult === 'revealed'
        ? entry.lastResult
        : undefined;
      const correctCount = safeInt(entry.correctCount);
      const revealCount = safeInt(entry.revealCount);
      const status =
        entry.status === 'new' || entry.status === 'learning' || entry.status === 'review'
          ? entry.status
          : correctCount >= 2 || typeof entry.masteryLevel === 'number' && entry.masteryLevel >= 2
            ? 'review'
            : correctCount > 0 || revealCount > 0
              ? 'learning'
              : 'new';
      const intervalTurns = safeInt(
        entry.intervalTurns ??
          (correctCount >= 3
            ? 24
            : correctCount === 2
              ? 12
              : correctCount === 1
                ? 2
                : revealCount > 0
                  ? 1
                  : 0),
      );
      const dueTurn = safeInt(
        entry.dueTurn ??
          ((uniqueStrings(value.backlogCardIds ?? value.backlogItemIds).includes(cardId) || lastResult === 'revealed')
            ? reviewTurn
            : intervalTurns > 0
              ? reviewTurn + intervalTurns
              : 0),
      );

      cardStats[cardId] = {
        seenCount: safeInt(entry.seenCount),
        correctCount,
        revealCount,
        lastSeenAt: typeof entry.lastSeenAt === 'string' ? entry.lastSeenAt : undefined,
        lastResult,
        dueTurn,
        intervalTurns,
        easeFactor: safeNumber(entry.easeFactor, 2.5),
        consecutiveCorrect: safeInt(entry.consecutiveCorrect ?? (lastResult === 'revealed' ? 0 : Math.min(correctCount, 3))),
        masteryLevel: safeInt(entry.masteryLevel ?? (typeof entry.masteredAt === 'string' ? 3 : Math.min(correctCount, 3))),
        status,
      };
    }
  }

  if (isObject(value.itemProgress)) {
    for (const [cardId, entry] of Object.entries(value.itemProgress)) {
      if (!isObject(entry) || cardStats[cardId]) {
        continue;
      }

      const correctCount = safeInt(entry.correctCount);
      const revealCount = safeInt(entry.revealCount);
      const lastResult =
        revealCount > correctCount
          ? 'revealed'
          : correctCount > 0
            ? 'correct'
            : undefined;
      const status =
        correctCount >= 2
          ? 'review'
          : correctCount > 0 || revealCount > 0
            ? 'learning'
            : 'new';
      const intervalTurns =
        correctCount >= 3
          ? 24
          : correctCount === 2
            ? 12
            : correctCount === 1
              ? 2
              : revealCount > 0
                ? 1
                : 0;

      cardStats[cardId] = {
        seenCount: Math.max(correctCount + revealCount, safeInt(entry.seenCount)),
        correctCount,
        revealCount,
        lastSeenAt:
          typeof entry.lastSeenAt === 'string'
            ? entry.lastSeenAt
            : typeof entry.lastAnsweredAt === 'string'
              ? entry.lastAnsweredAt
              : undefined,
        lastResult,
        dueTurn: status === 'learning' ? reviewTurn : reviewTurn + intervalTurns,
        intervalTurns,
        easeFactor: 2.5,
        consecutiveCorrect: lastResult === 'revealed' ? 0 : Math.min(correctCount, 3),
        masteryLevel: Math.min(correctCount, 3),
        status,
      };
    }
  }

  const totalAttempts = safeInt(value.totalAttempts) || Object.values(cardStats).reduce((sum, entry) => sum + entry.seenCount, 0);
  const totalCorrect = safeInt(value.totalCorrect) || Object.values(cardStats).reduce((sum, entry) => sum + entry.correctCount, 0);
  const totalRevealed = safeInt(value.totalRevealed) || Object.values(cardStats).reduce((sum, entry) => sum + entry.revealCount, 0);
  const sessionLastActivityAt = typeof value.sessionLastActivityAt === 'string' ? value.sessionLastActivityAt : undefined;
  const sessionIsActive = !isVocabSessionExpired(sessionLastActivityAt);
  const sessionStartedAt =
    sessionIsActive && typeof value.sessionStartedAt === 'string'
      ? value.sessionStartedAt
      : undefined;
  const sessionCorrectCardIds = sessionIsActive
    ? uniqueStrings(value.sessionCorrectCardIds)
    : [];

  return {
    reviewTurn: safeInt(value.reviewTurn ?? totalAttempts),
    nextNewCardIndex: safeInt(value.nextNewCardIndex ?? value.nextItemIndex),
    newCardsSinceReview: safeInt(value.newCardsSinceReview ?? value.newCardsSinceBacklog),
    sessionStartedAt,
    sessionLastActivityAt: sessionIsActive ? sessionLastActivityAt : undefined,
    sessionCorrectCardIds,
    totalAttempts,
    totalCorrect,
    totalRevealed,
    characterStats,
    cardStats,
  };
}

function normalizeCantoneseSentenceDrillProgress(value: unknown): AppState['progress']['cantoneseSentenceDrill'] {
  const defaultState = createDefaultAppState().progress.cantoneseSentenceDrill;

  if (!isObject(value)) {
    return defaultState;
  }

  const completedSentenceIds = uniqueStrings(value.completedSentenceIds);
  const reviewTurn = safeInt(value.reviewTurn ?? value.totalCompleted ?? completedSentenceIds.length);
  const sentenceStats: AppState['progress']['cantoneseSentenceDrill']['sentenceStats'] = {};

  if (isObject(value.sentenceStats)) {
    for (const [sentenceId, entry] of Object.entries(value.sentenceStats)) {
      if (!isObject(entry)) {
        continue;
      }

      const masteryLevel = Math.min(3, safeInt(entry.masteryLevel ?? entry.correctCount));
      const status =
        entry.status === 'new' || entry.status === 'learning' || entry.status === 'review' || entry.status === 'mastered'
          ? entry.status
          : masteryLevel >= 3
            ? 'mastered'
            : masteryLevel >= 2
              ? 'review'
              : masteryLevel >= 1
                ? 'learning'
                : 'new';

      sentenceStats[sentenceId] = {
        seenCount: safeInt(entry.seenCount ?? entry.correctCount),
        correctCount: safeInt(entry.correctCount),
        dueTurn: masteryLevel >= 3 ? Number.MAX_SAFE_INTEGER : safeInt(entry.dueTurn ?? reviewTurn),
        masteryLevel,
        status,
        lastCompletedAt: typeof entry.lastCompletedAt === 'string' ? entry.lastCompletedAt : undefined,
      };
    }
  }

  for (const sentenceId of completedSentenceIds) {
    if (sentenceStats[sentenceId]) {
      continue;
    }

    sentenceStats[sentenceId] = {
      seenCount: 1,
      correctCount: 1,
      dueTurn: reviewTurn,
      masteryLevel: 1,
      status: 'learning',
      lastCompletedAt: typeof value.lastCompletedAt === 'string' ? value.lastCompletedAt : undefined,
    };
  }

  const normalizedCompletedIds = Array.from(new Set([
    ...completedSentenceIds,
    ...Object.entries(sentenceStats)
      .filter(([, entry]) => entry.correctCount > 0)
      .map(([sentenceId]) => sentenceId),
  ]));
  const totalCompleted = safeInt(value.totalCompleted) || normalizedCompletedIds.length;

  return {
    reviewTurn,
    nextSentenceIndex: safeInt(value.nextSentenceIndex),
    newCardsSinceReview: safeInt(value.newCardsSinceReview),
    completedSentenceIds: normalizedCompletedIds,
    totalCompleted,
    lastCompletedAt: typeof value.lastCompletedAt === 'string' ? value.lastCompletedAt : undefined,
    sentenceStats,
  };
}

function safeInt(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
}

function safeNumber(value: unknown, fallback = 0): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

export function normalizeSettings(input: unknown): SettingsState {
  const defaultSettings = createDefaultAppState().settings;

  if (!isObject(input)) {
    return defaultSettings;
  }

  return {
    themePreference: normalizeThemePreference(input.themePreference),
    scriptPreference: normalizeScriptPreference(input.scriptPreference),
    playbackSpeed: clampPlaybackSpeed(input.playbackSpeed),
    vocabTierStartRank: clampVocabTierStartRank(input.vocabTierStartRank),
  };
}

export function normalizeAppState(input: unknown): AppState {
  if (isObject(input) && isObject(input.state) && typeof input.exportFormat === 'string') {
    return {
      progress: normalizeProgress(input.state.progress),
      settings: normalizeSettings(input.state.settings),
    };
  }

  if (isObject(input) && isObject(input.progress) && isObject(input.settings)) {
    return {
      progress: normalizeProgress(input.progress),
      settings: normalizeSettings(input.settings),
    };
  }

  return createDefaultAppState();
}

export function loadAppState(): AppState {
  if (!isBrowser()) {
    return createDefaultAppState();
  }

  try {
    const raw = window.localStorage.getItem(PROGRESS_STORAGE_KEY);

    if (!raw) {
      return createDefaultAppState();
    }

    return normalizeAppState(parseJson(raw));
  } catch {
    return createDefaultAppState();
  }
}

export function getAppState(): AppState {
  return snapshot;
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

export function setAppState(next: AppState | ((current: AppState) => AppState)): AppState {
  snapshot = typeof next === 'function' ? next(snapshot) : next;
  persistAppState(snapshot);
  emit();
  return snapshot;
}

function persistAppState(state: AppState): void {
  if (!isBrowser()) {
    return;
  }

  try {
    window.localStorage.setItem(PROGRESS_STORAGE_KEY, serializeAppState(state));
  } catch {
    // The app stays usable if storage is unavailable or full.
  }
}

export function resetAppState(): AppState {
  snapshot = createDefaultAppState();
  persistAppState(snapshot);
  emit();
  return snapshot;
}

export function importAppStateJson(json: string): AppState {
  const parsed = normalizeAppState(parseJson(json));
  snapshot = parsed;
  persistAppState(parsed);
  emit();
  return parsed;
}

export function exportAppStateJson(state: AppState = snapshot): string {
  return serializeAppState(state);
}

export function markLessonCompleted(input: LessonCompletionInput): AppState {
  const lessonId = input.lessonId.trim();

  if (!lessonId) {
    return snapshot;
  }

  return setAppState((current) => {
    const completedLessonIds = new Set(current.progress.completedLessonIds);
    const lessonCompletionMeta = { ...current.progress.lessonCompletionMeta };
    const previous = lessonCompletionMeta[lessonId];

    completedLessonIds.add(lessonId);
    lessonCompletionMeta[lessonId] = {
      completedAt: previous?.completedAt ?? nowIso(),
      revisitCount: input.revisited ? (previous?.revisitCount ?? 0) + 1 : previous?.revisitCount ?? 0,
    };

    return {
      ...current,
      progress: {
        ...current.progress,
        completedLessonIds: [...completedLessonIds],
        lessonCompletionMeta,
      },
    };
  });
}

export function markLessonIncomplete(lessonId: string): AppState {
  const id = lessonId.trim();

  if (!id) {
    return snapshot;
  }

  return setAppState((current) => {
    const completedLessonIds = current.progress.completedLessonIds.filter((entry) => entry !== id);
    const lessonCompletionMeta = { ...current.progress.lessonCompletionMeta };
    delete lessonCompletionMeta[id];

    return {
      ...current,
      progress: {
        ...current.progress,
        completedLessonIds,
        lessonCompletionMeta,
      },
    };
  });
}

export function toggleReviewLater(lessonId: string, nextValue?: boolean): AppState {
  const id = lessonId.trim();

  if (!id) {
    return snapshot;
  }

  return setAppState((current) => {
    const exists = current.progress.reviewLaterIds.includes(id);
    const shouldAdd = nextValue ?? !exists;
    const reviewLaterIds = shouldAdd
      ? Array.from(new Set([...current.progress.reviewLaterIds, id]))
      : current.progress.reviewLaterIds.filter((entry) => entry !== id);

    return {
      ...current,
      progress: {
        ...current.progress,
        reviewLaterIds,
      },
    };
  });
}

export function recordQuizAttempt(input: QuizAttemptInput): AppState {
  const quizId = input.quizId.trim();

  if (!quizId) {
    return snapshot;
  }

  return setAppState((current) => {
    const previous = current.progress.quizScores[quizId];
    const score = normalizeScore(input.score);
    const attempts = (previous?.attempts ?? 0) + 1;
    const bestScore = Math.max(previous?.bestScore ?? 0, score);
    const passed = input.passed ?? score >= 80;
    const lastAttemptAt = nowIso();

    return {
      ...current,
      progress: {
        ...current.progress,
        quizScores: {
          ...current.progress.quizScores,
          [quizId]: {
            quizId,
            bestScore,
            lastScore: score,
            attempts,
            passed,
            lastAttemptAt,
          },
        },
      },
    };
  });
}

export function recordArcadeSession(input: ArcadeSessionInput): AppState {
  const gameId = input.gameId.trim();

  if (!gameId) {
    return snapshot;
  }

  return setAppState((current) => {
    const previousGame = current.progress.arcadeStats.games[gameId];
    const score = normalizeScore(input.score);
    const correct = Math.max(0, input.correct ?? 0);
    const incorrect = Math.max(0, input.incorrect ?? 0);
    const won = input.won ?? score >= 80;
    const streak = Math.max(0, input.streak ?? 0);
    const lastPlayedAt = nowIso();

    return {
      ...current,
      progress: {
        ...current.progress,
        arcadeStats: {
          totalPlays: current.progress.arcadeStats.totalPlays + 1,
          totalWins: current.progress.arcadeStats.totalWins + (won ? 1 : 0),
          totalLosses: current.progress.arcadeStats.totalLosses + (won ? 0 : 1),
          totalCorrect: current.progress.arcadeStats.totalCorrect + correct,
          totalIncorrect: current.progress.arcadeStats.totalIncorrect + incorrect,
          bestStreak: Math.max(current.progress.arcadeStats.bestStreak, streak),
          lastPlayedAt,
          games: {
            ...current.progress.arcadeStats.games,
            [gameId]: {
              plays: (previousGame?.plays ?? 0) + 1,
              wins: (previousGame?.wins ?? 0) + (won ? 1 : 0),
              losses: (previousGame?.losses ?? 0) + (won ? 0 : 1),
              bestScore: Math.max(previousGame?.bestScore ?? 0, score),
              lastPlayedAt,
            },
          },
        },
      },
    };
  });
}

export function recordVocabAttempt(input: VocabAttemptInput): AppState {
  const cardId = input.cardId.trim();
  const characterIds = input.characterIds
    .map((characterId) => characterId.trim())
    .filter((characterId) => characterId.length > 0);

  if (!cardId || characterIds.length === 0) {
    return snapshot;
  }

  return setAppState((current) => {
    const answeredAt = nowIso();
    const sessionExpired = isVocabSessionExpired(current.progress.vocab.sessionLastActivityAt, Date.parse(answeredAt));
    const sessionCorrectCardIds = sessionExpired ? [] : [...current.progress.vocab.sessionCorrectCardIds];
    const previousCardProgress = current.progress.vocab.cardStats[cardId];
    const wasNewCard = !previousCardProgress || previousCardProgress.seenCount === 0;
    const nextReviewTurn = current.progress.vocab.reviewTurn + 1;
    const nextCardProgress = projectVocabCardAfterAttempt(previousCardProgress, input.result, nextReviewTurn, answeredAt);
    const cardStats = {
      ...current.progress.vocab.cardStats,
      [cardId]: nextCardProgress,
    };

    if (input.result === 'correct') {
      sessionCorrectCardIds.push(cardId);
    }

    const characterStats = { ...current.progress.vocab.characterStats };
    for (const characterId of characterIds) {
      const previousCharacterProgress = characterStats[characterId];
      const correctCount = (previousCharacterProgress?.correctCount ?? 0) + (input.result === 'correct' ? 1 : 0);

      characterStats[characterId] = {
        seenCount: (previousCharacterProgress?.seenCount ?? 0) + 1,
        correctCount,
        revealCount: (previousCharacterProgress?.revealCount ?? 0) + (input.result === 'revealed' ? 1 : 0),
        lastSeenAt: answeredAt,
        masteredAt:
          previousCharacterProgress?.masteredAt ??
          (input.result === 'correct' && nextCardProgress.masteryLevel >= 3 ? answeredAt : undefined),
      };
    }

    const nextNewCardIndex = wasNewCard
      ? Math.max(
          current.progress.vocab.nextNewCardIndex + 1,
          safeInt(input.selectedDeckIndex ?? current.progress.vocab.nextNewCardIndex) + 1,
        )
      : current.progress.vocab.nextNewCardIndex;
    const newCardsSinceReview = wasNewCard
      ? current.progress.vocab.newCardsSinceReview + 1
      : 0;

    return {
      ...current,
      progress: {
        ...current.progress,
        vocab: {
          reviewTurn: nextReviewTurn,
          nextNewCardIndex,
          newCardsSinceReview,
          sessionStartedAt: sessionExpired ? answeredAt : current.progress.vocab.sessionStartedAt ?? answeredAt,
          sessionLastActivityAt: answeredAt,
          sessionCorrectCardIds: Array.from(new Set(sessionCorrectCardIds)),
          totalAttempts: current.progress.vocab.totalAttempts + 1,
          totalCorrect: current.progress.vocab.totalCorrect + (input.result === 'correct' ? 1 : 0),
          totalRevealed: current.progress.vocab.totalRevealed + (input.result === 'revealed' ? 1 : 0),
          characterStats,
          cardStats,
        },
      },
    };
  });
}

export function recordCantoneseSentenceCompletion(input: CantoneseSentenceCompletionInput): AppState {
  const sentenceId = input.sentenceId.trim();

  if (!sentenceId) {
    return snapshot;
  }

  return setAppState((current) => {
    const completedAt = nowIso();
    const previousProgress = current.progress.cantoneseSentenceDrill.sentenceStats[sentenceId];
    const wasNewSentence = !previousProgress || previousProgress.seenCount === 0;
    const nextReviewTurn = current.progress.cantoneseSentenceDrill.reviewTurn + 1;
    const nextSentenceProgress = projectSentenceCardAfterCompletion(previousProgress, nextReviewTurn, completedAt);
    const completedSentenceIds = Array.from(
      new Set([...current.progress.cantoneseSentenceDrill.completedSentenceIds, sentenceId]),
    );

    return {
      ...current,
      progress: {
        ...current.progress,
        cantoneseSentenceDrill: {
          reviewTurn: nextReviewTurn,
          nextSentenceIndex: wasNewSentence
            ? Math.max(
              current.progress.cantoneseSentenceDrill.nextSentenceIndex,
              safeInt(input.selectedSentenceIndex ?? current.progress.cantoneseSentenceDrill.nextSentenceIndex) + 1,
            )
            : current.progress.cantoneseSentenceDrill.nextSentenceIndex,
          newCardsSinceReview: wasNewSentence
            ? current.progress.cantoneseSentenceDrill.newCardsSinceReview + 1
            : 0,
          completedSentenceIds,
          totalCompleted: completedSentenceIds.length,
          lastCompletedAt: completedAt,
          sentenceStats: {
            ...current.progress.cantoneseSentenceDrill.sentenceStats,
            [sentenceId]: nextSentenceProgress,
          },
        },
      },
    };
  });
}

export function resetCantoneseSentenceDrill(): AppState {
  return setAppState((current) => ({
    ...current,
    progress: {
      ...current.progress,
      cantoneseSentenceDrill: createDefaultAppState().progress.cantoneseSentenceDrill,
    },
  }));
}

export function resetCantoneseSentenceLesson(sentenceIds: readonly string[]): AppState {
  const ids = new Set(
    sentenceIds
      .map((sentenceId) => sentenceId.trim())
      .filter((sentenceId) => sentenceId.length > 0),
  );

  if (ids.size === 0) {
    return snapshot;
  }

  return setAppState((current) => {
    const sentenceStats = { ...current.progress.cantoneseSentenceDrill.sentenceStats };
    ids.forEach((sentenceId) => {
      delete sentenceStats[sentenceId];
    });

    const completedSentenceIds = current.progress.cantoneseSentenceDrill.completedSentenceIds.filter(
      (sentenceId) => !ids.has(sentenceId),
    );

    return {
      ...current,
      progress: {
        ...current.progress,
        cantoneseSentenceDrill: {
          ...current.progress.cantoneseSentenceDrill,
          newCardsSinceReview: 0,
          completedSentenceIds,
          totalCompleted: completedSentenceIds.length,
          sentenceStats,
        },
      },
    };
  });
}

export function dismissCallout(input: CalloutDismissInput): AppState {
  const calloutId = input.calloutId.trim();

  if (!calloutId) {
    return snapshot;
  }

  return setAppState((current) => {
    const dismissedCalloutIds = Array.from(new Set([...current.progress.dismissedCalloutIds, calloutId]));

    return {
      ...current,
      progress: {
        ...current.progress,
        dismissedCalloutIds,
      },
    };
  });
}

export function setExperimentalFlag(flagId: string, enabled: boolean): AppState {
  const id = flagId.trim();

  if (!id) {
    return snapshot;
  }

  return setAppState((current) => ({
    ...current,
    progress: {
      ...current.progress,
      experimentalFlags: {
        ...current.progress.experimentalFlags,
        [id]: enabled,
      },
    },
  }));
}

export function setThemePreference(themePreference: ThemePreference): AppState {
  return setAppState((current) => ({
    ...current,
    settings: {
      ...current.settings,
      themePreference,
    },
  }));
}

export function setScriptPreference(scriptPreference: ScriptPreference): AppState {
  return setAppState((current) => ({
    ...current,
    settings: {
      ...current.settings,
      scriptPreference,
    },
  }));
}

export function setPlaybackSpeed(playbackSpeed: PlaybackSpeed): AppState {
  return setAppState((current) => ({
    ...current,
    settings: {
      ...current.settings,
      playbackSpeed,
    },
  }));
}

export function updateSettings(patch: Partial<SettingsState>): AppState {
  return setAppState((current) => ({
    ...current,
    settings: {
      ...current.settings,
      ...patch,
    },
  }));
}

export function setVocabTierStartRank(vocabTierStartRank: number): AppState {
  return setAppState((current) => ({
    ...current,
    settings: {
      ...current.settings,
      vocabTierStartRank: clampVocabTierStartRank(vocabTierStartRank),
    },
  }));
}
