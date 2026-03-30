export const CONTENT_VERSION = "1.0.0" as const;

export const PLAYBACK_RATES = [1, 0.75, 0.5] as const;

export type PlaybackRate = (typeof PLAYBACK_RATES)[number];

export type ToneNumber = 1 | 2 | 3 | 4 | 5 | 6;

export type DisplayMode = "characters" | "jyutping" | "both" | "audio-first";

export type LessonStepKind =
  | "learnCard"
  | "listenAndChoose"
  | "chooseJyutping"
  | "chooseTone"
  | "reorderTiles"
  | "fillBlank"
  | "signageReading"
  | "repeatMachine"
  | "jyutpingInput"
  | "quizItem"
  | "dialogue";

export type AudioSpeakerGender = "male" | "female";

export type AudioKind = "syllable" | "word" | "phrase" | "dialogue" | "quiz" | "tone";

export type AudioVariantKey = "100" | "75" | "50";

export type StepChoice = {
  id: string;
  label: string;
  jyutping?: string;
  note?: string;
};

export type LearnCardStep = {
  kind: "learnCard";
  id: string;
  title: string;
  front: {
    heading: string;
    body: string;
  };
  back: {
    heading: string;
    body: string;
    bullets?: string[];
  };
  glossaryIds?: readonly string[];
  audioIds?: readonly string[];
};

export type ListenAndChooseStep = {
  kind: "listenAndChoose";
  id: string;
  title: string;
  prompt: string;
  audioId: string;
  choices: readonly StepChoice[];
  correctChoiceId: string;
  explanation: string;
  glossaryIds?: readonly string[];
};

export type ChooseJyutpingStep = {
  kind: "chooseJyutping";
  id: string;
  title: string;
  prompt: string;
  targetText: string;
  choices: readonly StepChoice[];
  correctChoiceId: string;
  explanation: string;
  glossaryIds?: readonly string[];
};

export type ChooseToneStep = {
  kind: "chooseTone";
  id: string;
  title: string;
  prompt: string;
  syllable: string;
  correctTone: ToneNumber;
  choices: readonly ToneNumber[];
  explanation: string;
  audioId?: string;
};

export type ReorderTilesStep = {
  kind: "reorderTiles";
  id: string;
  title: string;
  prompt: string;
  tiles: readonly string[];
  correctOrder: readonly string[];
  explanation: string;
  glossaryIds?: readonly string[];
};

export type FillBlankStep = {
  kind: "fillBlank";
  id: string;
  title: string;
  prompt: string;
  template: string;
  wordBank: readonly string[];
  answer: string;
  explanation: string;
  glossaryIds?: readonly string[];
};

export type SignageReadingStep = {
  kind: "signageReading";
  id: string;
  title: string;
  signText: string;
  prompt: string;
  choices: readonly StepChoice[];
  correctChoiceId: string;
  explanation: string;
  glossaryIds?: readonly string[];
};

export type RepeatMachineStep = {
  kind: "repeatMachine";
  id: string;
  title: string;
  prompt: string;
  targetAudioId: string;
  transcript: string;
  speakerId: string;
  selfRatingLabels: readonly [string, string, string];
  loopSuggested?: boolean;
  reviewLaterSuggested?: boolean;
  glossaryIds?: readonly string[];
};

export type JyutpingInputStep = {
  kind: "jyutpingInput";
  id: string;
  title: string;
  prompt: string;
  targetTokens: readonly string[];
  suggestions: ReadonlyArray<{
    token: string;
    displayText: string;
    jyutping: string;
    note?: string;
    glossaryIds?: readonly string[];
  }>;
  phraseSuggestions?: ReadonlyArray<{
    input: string;
    displayText: string;
    note?: string;
  }>;
  explanation: string;
};

export type QuizItemStep = {
  kind: "quizItem";
  id: string;
  title: string;
  question: string;
  choices: readonly StepChoice[];
  correctChoiceId: string;
  explanation: string;
  glossaryIds?: readonly string[];
};

export type DialogueTurn = {
  speakerId: string;
  speakerLabel: string;
  text: string;
  audioId?: string;
};

export type DialogueStep = {
  kind: "dialogue";
  id: string;
  title: string;
  prompt: string;
  turns: readonly DialogueTurn[];
  summary: string;
  glossaryIds?: readonly string[];
};

export type LessonStep =
  | LearnCardStep
  | ListenAndChooseStep
  | ChooseJyutpingStep
  | ChooseToneStep
  | ReorderTilesStep
  | FillBlankStep
  | SignageReadingStep
  | RepeatMachineStep
  | JyutpingInputStep
  | QuizItemStep
  | DialogueStep;

export type Lesson = {
  id: string;
  sectionId: string;
  order: number;
  title: string;
  subtitle?: string;
  summary: string;
  displayMode: DisplayMode;
  estimatedMinutes: number;
  objectives: readonly string[];
  reviewTag?: string;
  prerequisiteLessonIds?: readonly string[];
  stepIds: readonly string[];
  steps: readonly LessonStep[];
};

export type Section = {
  id: string;
  order: number;
  title: string;
  subtitle: string;
  summary: string;
  lessonIds: readonly string[];
  checkpointLessonId?: string;
};

export type GlossaryEntry = {
  id: string;
  headword: string;
  jyutping: string;
  mandarinGloss: string;
  note?: string;
  audioId?: string;
  tags?: readonly string[];
};

export type CommonCharacterEntry = {
  id: string;
  rank: number;
  character: string;
  simplified: string;
  jyutping: string;
  jyutpingCandidates: readonly string[];
};

export type CommonStructureKind = "pair" | "phrase" | "idiom" | "yanyu";

export type CommonStructureEntry = {
  id: string;
  rank: number;
  text: string;
  simplified: string;
  jyutping: string;
  kind: CommonStructureKind;
  frequencyScore: number;
};

export type AudioAsset = {
  id: string;
  speakerId: string;
  kind: AudioKind;
  label: string;
  transcript: string;
  variants: Record<AudioVariantKey, string>;
  glossaryIds?: readonly string[];
};

export type AudioSpeaker = {
  id: string;
  name: string;
  gender: AudioSpeakerGender;
  label: string;
};

export type ArcadePrompt = {
  audioId: string;
  prompt: string;
  correctAnswer: string;
  wrongAnswers: readonly string[];
};

export type ArcadeActivity = {
  id: string;
  title: string;
  subtitle: string;
  summary: string;
  mode: "toneSprint" | "charFlash" | "signSnap" | "minimalPairBlitz";
  warmupPrompts: readonly ArcadePrompt[];
  sessionGoal: string;
  trackedStats: ReadonlyArray<"bestStreak" | "fastestClear" | "lastPlayed" | "aggregateCorrectRate">;
};
