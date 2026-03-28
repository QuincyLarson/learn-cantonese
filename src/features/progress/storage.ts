import type { AppState, AppStateExportPayload, PlaybackSpeed, ScriptPreference, ThemePreference } from './types';

export const PROGRESS_STORAGE_KEY = 'standard-cantonese:app-state:v1';
export const PROGRESS_CHANGE_EVENT = 'standard-cantonese:app-state-change';
export const APP_SCHEMA_VERSION = 1 as const;

export const DEFAULT_THEME_PREFERENCE: ThemePreference = 'system';
export const DEFAULT_SCRIPT_PREFERENCE: ScriptPreference = 'traditional';
export const DEFAULT_PLAYBACK_SPEED: PlaybackSpeed = 1;

export function createDefaultAppState(): AppState {
  return {
    progress: {
      schemaVersion: APP_SCHEMA_VERSION,
      completedLessonIds: [],
      lessonCompletionMeta: {},
      quizScores: {},
      reviewLaterIds: [],
      arcadeStats: {
        totalPlays: 0,
        totalWins: 0,
        totalLosses: 0,
        totalCorrect: 0,
        totalIncorrect: 0,
        bestStreak: 0,
        games: {},
      },
      dismissedCalloutIds: [],
      experimentalFlags: {},
    },
    settings: {
      themePreference: DEFAULT_THEME_PREFERENCE,
      scriptPreference: DEFAULT_SCRIPT_PREFERENCE,
      playbackSpeed: DEFAULT_PLAYBACK_SPEED,
    },
  };
}

export function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function nowIso(): string {
  return new Date().toISOString();
}

export function cloneAppState(state: AppState): AppState {
  return JSON.parse(JSON.stringify(state)) as AppState;
}

export function exportAppState(state: AppState): AppStateExportPayload {
  return {
    exportFormat: 'standard-cantonese-progress',
    schemaVersion: APP_SCHEMA_VERSION,
    exportedAt: nowIso(),
    state: cloneAppState(state),
  };
}

export function serializeAppState(state: AppState): string {
  return JSON.stringify(exportAppState(state), null, 2);
}

export function parseJson(input: string): unknown {
  return JSON.parse(input) as unknown;
}
