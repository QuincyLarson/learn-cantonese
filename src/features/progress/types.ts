export type ThemePreference = 'system' | 'light' | 'dark';

export type ScriptPreference = 'traditional' | 'simplified';

export type PlaybackSpeed = 1 | 0.75 | 0.5;

export interface LessonCompletionMeta {
  completedAt: string;
  revisitCount: number;
}

export interface QuizScoreRecord {
  quizId: string;
  bestScore: number;
  lastScore: number;
  attempts: number;
  passed: boolean;
  lastAttemptAt: string;
}

export interface ArcadeGameStats {
  plays: number;
  wins: number;
  losses: number;
  bestScore: number;
  lastPlayedAt?: string;
}

export interface ArcadeStats {
  totalPlays: number;
  totalWins: number;
  totalLosses: number;
  totalCorrect: number;
  totalIncorrect: number;
  bestStreak: number;
  lastPlayedAt?: string;
  games: Record<string, ArcadeGameStats>;
}

export interface VocabCharacterProgress {
  seenCount: number;
  correctCount: number;
  revealCount: number;
  lastSeenAt?: string;
  masteredAt?: string;
}

export interface VocabCardProgress {
  seenCount: number;
  correctCount: number;
  revealCount: number;
  lastSeenAt?: string;
  lastResult?: 'correct' | 'revealed';
  dueTurn: number;
  intervalTurns: number;
  easeFactor: number;
  consecutiveCorrect: number;
  masteryLevel: number;
  status: 'new' | 'learning' | 'review';
}

export interface VocabProgressState {
  reviewTurn: number;
  nextNewCardIndex: number;
  newCardsSinceReview: number;
  sessionStartedAt?: string;
  sessionLastActivityAt?: string;
  sessionCorrectCardIds: string[];
  totalAttempts: number;
  totalCorrect: number;
  totalRevealed: number;
  characterStats: Record<string, VocabCharacterProgress>;
  cardStats: Record<string, VocabCardProgress>;
}

export interface CantoneseSentenceDrillProgress {
  reviewTurn: number;
  nextSentenceIndex: number;
  newCardsSinceReview: number;
  completedSentenceIds: string[];
  totalCompleted: number;
  lastCompletedAt?: string;
  sentenceStats: Record<string, CantoneseSentenceCardProgress>;
}

export interface CantoneseSentenceCardProgress {
  seenCount: number;
  correctCount: number;
  dueTurn: number;
  masteryLevel: number;
  status: 'new' | 'learning' | 'review' | 'mastered';
  lastCompletedAt?: string;
}

export interface ProgressState {
  schemaVersion: 1;
  completedLessonIds: string[];
  lessonCompletionMeta: Record<string, LessonCompletionMeta>;
  quizScores: Record<string, QuizScoreRecord>;
  reviewLaterIds: string[];
  arcadeStats: ArcadeStats;
  vocab: VocabProgressState;
  cantoneseSentenceDrill: CantoneseSentenceDrillProgress;
  dismissedCalloutIds: string[];
  experimentalFlags: Record<string, boolean>;
}

export interface SettingsState {
  themePreference: ThemePreference;
  scriptPreference: ScriptPreference;
  playbackSpeed: PlaybackSpeed;
  vocabTierStartRank: number;
}

export interface AppState {
  progress: ProgressState;
  settings: SettingsState;
}

export interface AppStateExportPayload {
  exportFormat: 'standard-cantonese-progress';
  schemaVersion: 1;
  exportedAt: string;
  state: AppState;
}

export interface QuizAttemptInput {
  quizId: string;
  score: number;
  passed?: boolean;
}

export interface LessonCompletionInput {
  lessonId: string;
  revisited?: boolean;
}

export interface ArcadeSessionInput {
  gameId: string;
  score?: number;
  correct?: number;
  incorrect?: number;
  won?: boolean;
  streak?: number;
}

export interface VocabAttemptInput {
  cardId: string;
  characterIds: string[];
  result: 'correct' | 'revealed';
  selectedDeckIndex?: number;
}

export interface CantoneseSentenceCompletionInput {
  sentenceId: string;
  selectedSentenceIndex?: number;
}

export interface CalloutDismissInput {
  calloutId: string;
}
