import { createDefaultAppState, isBrowser, nowIso, parseJson, PROGRESS_CHANGE_EVENT, PROGRESS_STORAGE_KEY, serializeAppState } from './storage';
import type {
  AppState,
  ArcadeSessionInput,
  CalloutDismissInput,
  LessonCompletionInput,
  PlaybackSpeed,
  QuizAttemptInput,
  ScriptPreference,
  SettingsState,
  ThemePreference,
} from './types';

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

  return {
    schemaVersion: 1,
    completedLessonIds,
    lessonCompletionMeta,
    quizScores,
    reviewLaterIds,
    arcadeStats,
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

function safeInt(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
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
