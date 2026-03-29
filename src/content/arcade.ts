import { audioSpeakers } from "./audio";
import type { ArcadeActivity } from "./types";

export const arcadeActivities = [
  {
    id: "arcade-tone-sprint-a1",
    title: "聲調快練",
    subtitle: "快聽快選",
    summary: "六十秒內連續做辨音。",
    mode: "toneSprint",
    warmupPrompts: [
      { audioId: "audio-tone-drill-si1", prompt: "選出正確聲調", correctAnswer: "1", wrongAnswers: ["2", "4", "6"] },
      { audioId: "audio-nei5", prompt: "選出正確讀音", correctAnswer: "nei5", wrongAnswers: ["lei5", "ni3", "nei1"] },
      { audioId: "audio-m4-goi1", prompt: "選出禮貌句", correctAnswer: "m4 goi1", wrongAnswers: ["m4 goi2", "ng5 goi1", "goi1"] },
      { audioId: "audio-hello", prompt: "選出問候句", correctAnswer: "你好", wrongAnswers: ["唔該", "多謝", "再見"] },
    ],
    sessionGoal: "六十秒內盡量多答。",
    trackedStats: ["bestStreak", "fastestClear", "lastPlayed", "aggregateCorrectRate"],
  },
] as const satisfies readonly ArcadeActivity[];

export type ArcadeActivityId = (typeof arcadeActivities)[number]["id"];

export const arcadeActivityById = arcadeActivities.reduce<Record<ArcadeActivityId, ArcadeActivity>>(
  (result, activity) => {
    result[activity.id] = activity;
    return result;
  },
  {} as Record<ArcadeActivityId, ArcadeActivity>,
);

export const arcadeMeta = {
  speakers: audioSpeakers,
} as const;
