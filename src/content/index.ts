import { audioById, audioManifest, audioSpeakers } from "./audio";
import { arcadeActivities, arcadeActivityById } from "./arcade";
import { curriculumLessons, curriculumSections } from "./curriculum";
import { glossaryById, glossaryEntries } from "./lexicon";
import type { Lesson, Section } from "./types";

export * from "./arcade";
export * from "./curriculum";
export * from "./lexicon";
export * from "./types";

export const content = {
  sections: curriculumSections,
  lessons: curriculumLessons,
  glossary: glossaryEntries,
  glossaryById,
  audio: audioManifest,
  audioById,
  speakers: audioSpeakers,
  arcades: arcadeActivities,
  arcadeById: arcadeActivityById,
} as const;

const duplicateCheck = (label: string, ids: readonly string[]) => {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const id of ids) {
    if (seen.has(id)) {
      duplicates.add(id);
    } else {
      seen.add(id);
    }
  }
  return duplicates.size > 0 ? `${label}: ${Array.from(duplicates).join(", ")}` : null;
};

const collectStepRefs = (lesson: Lesson) => {
  const audioRefs: string[] = [];
  const glossaryRefs: string[] = [];

  for (const step of lesson.steps) {
    switch (step.kind) {
      case "learnCard":
        audioRefs.push(...(step.audioIds ?? []));
        glossaryRefs.push(...(step.glossaryIds ?? []));
        break;
      case "listenAndChoose":
      case "chooseJyutping":
      case "reorderTiles":
      case "fillBlank":
      case "signageReading":
      case "quizItem":
      case "dialogue":
        glossaryRefs.push(...(step.glossaryIds ?? []));
        if ("audioId" in step && step.audioId) {
          audioRefs.push(step.audioId);
        }
        if (step.kind === "dialogue") {
          for (const turn of step.turns) {
            if (turn.audioId) {
              audioRefs.push(turn.audioId);
            }
          }
        }
        break;
      case "chooseTone":
        if (step.audioId) {
          audioRefs.push(step.audioId);
        }
        break;
      case "repeatMachine":
        audioRefs.push(step.targetAudioId);
        glossaryRefs.push(...(step.glossaryIds ?? []));
        break;
      case "jyutpingInput":
        break;
      default:
        break;
    }
  }

  return { audioRefs, glossaryRefs };
};

export type ContentValidationResult = {
  ok: boolean;
  errors: string[];
};

export function validateContent() {
  const errors: string[] = [];
  const sections: readonly Section[] = curriculumSections;
  const lessons: readonly Lesson[] = curriculumLessons;

  const sectionIds = sections.map((section) => section.id);
  const lessonIds = lessons.map((lesson) => lesson.id);
  const glossaryIds = glossaryEntries.map((entry) => entry.id as string);
  const audioIds = audioManifest.map((asset) => asset.id as string);

  const duplicates = [
    duplicateCheck("section ids", sectionIds),
    duplicateCheck("lesson ids", lessonIds),
    duplicateCheck("glossary ids", glossaryIds),
    duplicateCheck("audio ids", audioIds),
  ].filter(Boolean);

  errors.push(...(duplicates as string[]));

  const sectionIdSet = new Set<string>(sectionIds);
  const lessonIdSet = new Set<string>(lessonIds);
  const glossaryIdSet = new Set<string>(glossaryIds);
  const audioIdSet = new Set<string>(audioIds);

  for (const section of sections) {
    for (const lessonId of section.lessonIds) {
      if (!lessonIdSet.has(lessonId)) {
        errors.push(`section ${section.id} references missing lesson ${lessonId}`);
      }
    }
    if (section.checkpointLessonId && !lessonIdSet.has(section.checkpointLessonId)) {
      errors.push(`section ${section.id} references missing checkpoint lesson ${section.checkpointLessonId}`);
    }
  }

  for (const lesson of lessons) {
    if (!sectionIdSet.has(lesson.sectionId)) {
      errors.push(`lesson ${lesson.id} references missing section ${lesson.sectionId}`);
    }

    const { audioRefs, glossaryRefs } = collectStepRefs(lesson);
    for (const id of audioRefs) {
      if (!audioIdSet.has(id)) {
        errors.push(`lesson ${lesson.id} references missing audio ${id}`);
      }
    }
    for (const id of glossaryRefs) {
      if (!glossaryIdSet.has(id)) {
        errors.push(`lesson ${lesson.id} references missing glossary ${id}`);
      }
    }

    const stepIds = lesson.steps.map((step) => step.id);
    const stepDuplicate = duplicateCheck(`lesson ${lesson.id} step ids`, stepIds);
    if (stepDuplicate) {
      errors.push(stepDuplicate);
    }
    if (lesson.stepIds.join("|") !== stepIds.join("|")) {
      errors.push(`lesson ${lesson.id} stepIds does not match steps`);
    }

    for (const step of lesson.steps) {
      switch (step.kind) {
        case "learnCard":
          if (step.audioIds) {
            for (const id of step.audioIds) {
              if (!audioIdSet.has(id)) {
                errors.push(`lesson ${lesson.id} step ${step.id} references missing audio ${id}`);
              }
            }
          }
          if (step.glossaryIds) {
            for (const id of step.glossaryIds) {
              if (!glossaryIdSet.has(id)) {
                errors.push(`lesson ${lesson.id} step ${step.id} references missing glossary ${id}`);
              }
            }
          }
          break;
        case "listenAndChoose":
          if (!step.choices.some((choice) => choice.id === step.correctChoiceId)) {
            errors.push(`lesson ${lesson.id} step ${step.id} correctChoiceId is not one of the choices`);
          }
          if (!audioIdSet.has(step.audioId)) {
            errors.push(`lesson ${lesson.id} step ${step.id} references missing audio ${step.audioId}`);
          }
          for (const id of step.glossaryIds ?? []) {
            if (!glossaryIdSet.has(id)) {
              errors.push(`lesson ${lesson.id} step ${step.id} references missing glossary ${id}`);
            }
          }
          break;
        case "chooseTone":
          if (!step.choices.includes(step.correctTone)) {
            errors.push(`lesson ${lesson.id} step ${step.id} correctTone is not one of the choices`);
          }
          if (step.audioId && !audioIdSet.has(step.audioId)) {
            errors.push(`lesson ${lesson.id} step ${step.id} references missing audio ${step.audioId}`);
          }
          break;
        case "repeatMachine":
          if (!audioIdSet.has(step.targetAudioId)) {
            errors.push(`lesson ${lesson.id} step ${step.id} references missing audio ${step.targetAudioId}`);
          }
          for (const id of step.glossaryIds ?? []) {
            if (!glossaryIdSet.has(id)) {
              errors.push(`lesson ${lesson.id} step ${step.id} references missing glossary ${id}`);
            }
          }
          break;
        case "chooseJyutping":
          if (!step.choices.some((choice) => choice.id === step.correctChoiceId)) {
            errors.push(`lesson ${lesson.id} step ${step.id} correctChoiceId is not one of the choices`);
          }
          for (const id of step.glossaryIds ?? []) {
            if (!glossaryIdSet.has(id)) {
              errors.push(`lesson ${lesson.id} step ${step.id} references missing glossary ${id}`);
            }
          }
          break;
        case "reorderTiles":
          if (step.tiles.length !== step.correctOrder.length) {
            errors.push(`lesson ${lesson.id} step ${step.id} correctOrder must match tiles`);
          } else {
            const sameContent =
              [...step.tiles].sort().join("|") === [...step.correctOrder].sort().join("|");
            if (!sameContent) {
              errors.push(`lesson ${lesson.id} step ${step.id} correctOrder must match tiles`);
            }
          }
          for (const id of step.glossaryIds ?? []) {
            if (!glossaryIdSet.has(id)) {
              errors.push(`lesson ${lesson.id} step ${step.id} references missing glossary ${id}`);
            }
          }
          break;
        case "fillBlank":
          if (!(step.wordBank as readonly string[]).includes(step.answer)) {
            errors.push(`lesson ${lesson.id} step ${step.id} answer is not in the word bank`);
          }
          for (const id of step.glossaryIds ?? []) {
            if (!glossaryIdSet.has(id)) {
              errors.push(`lesson ${lesson.id} step ${step.id} references missing glossary ${id}`);
            }
          }
          break;
        case "signageReading":
          if (!step.choices.some((choice) => choice.id === step.correctChoiceId)) {
            errors.push(`lesson ${lesson.id} step ${step.id} correctChoiceId is not one of the choices`);
          }
          for (const id of step.glossaryIds ?? []) {
            if (!glossaryIdSet.has(id)) {
              errors.push(`lesson ${lesson.id} step ${step.id} references missing glossary ${id}`);
            }
          }
          break;
        case "quizItem":
          if (!step.choices.some((choice) => choice.id === step.correctChoiceId)) {
            errors.push(`lesson ${lesson.id} step ${step.id} correctChoiceId is not one of the choices`);
          }
          for (const id of step.glossaryIds ?? []) {
            if (!glossaryIdSet.has(id)) {
              errors.push(`lesson ${lesson.id} step ${step.id} references missing glossary ${id}`);
            }
          }
          break;
        case "dialogue":
          for (const turn of step.turns) {
            if (turn.audioId && !audioIdSet.has(turn.audioId)) {
              errors.push(`lesson ${lesson.id} step ${step.id} references missing audio ${turn.audioId}`);
            }
          }
          for (const id of step.glossaryIds ?? []) {
            if (!glossaryIdSet.has(id)) {
              errors.push(`lesson ${lesson.id} step ${step.id} references missing glossary ${id}`);
            }
          }
          break;
        case "jyutpingInput":
          for (const token of step.targetTokens) {
            if (!token.trim()) {
              errors.push(`lesson ${lesson.id} step ${step.id} contains an empty jyutping token`);
            }
          }
          break;
        default:
          break;
      }
    }
  }

  for (const activity of arcadeActivities) {
    for (const prompt of activity.warmupPrompts) {
      if (!audioIdSet.has(prompt.audioId)) {
        errors.push(`arcade ${activity.id} references missing audio ${prompt.audioId}`);
      }
    }
  }

  return {
    ok: errors.length === 0,
    errors,
  } satisfies ContentValidationResult;
}
