import { audioSpeakers } from "./audio";
import type { ArcadeActivity } from "./types";

export const arcadeActivities = [
  {
    id: "arcade-tone-sprint-a1",
    title: "聲調衝刺",
    subtitle: "快節奏辨音",
    summary: "用很短的聲音片段快速判斷聲調，先把反應速度提上來。",
    mode: "toneSprint",
    warmupPrompts: [
      { audioId: "audio-tone-drill-si1", prompt: "選出正確聲調", correctAnswer: "1", wrongAnswers: ["2", "4", "6"] },
      { audioId: "audio-nei5", prompt: "選出正確讀音", correctAnswer: "nei5", wrongAnswers: ["lei5", "ni3", "nei1"] },
      { audioId: "audio-m4-goi1", prompt: "選出禮貌句", correctAnswer: "m4 goi1", wrongAnswers: ["m4 goi2", "ng5 goi1", "goi1"] },
      { audioId: "audio-hello", prompt: "選出問候句", correctAnswer: "你好", wrongAnswers: ["唔該", "多謝", "再見"] },
    ],
    sessionGoal: "在 60 秒內完成一輪高頻辨音。",
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
