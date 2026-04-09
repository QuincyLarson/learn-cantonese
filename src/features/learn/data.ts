import { content, validateContent } from '@/content';
import type { AudioAsset, GlossaryEntry, Lesson, Section } from '@/content';

const validation = validateContent();

if (!validation.ok) {
  console.warn('Content validation failed', validation.errors);
}

const sections = [...content.sections].sort((left, right) => left.order - right.order) as Section[];
const lessons = [...content.lessons].sort((left, right) => {
  if (left.sectionId !== right.sectionId) {
    const leftSection = sections.find((section) => section.id === left.sectionId)?.order ?? 0;
    const rightSection = sections.find((section) => section.id === right.sectionId)?.order ?? 0;
    return leftSection - rightSection;
  }

  return left.order - right.order;
}) as Lesson[];

const lessonById = lessons.reduce<Record<string, Lesson>>((result, lesson) => {
  result[lesson.id] = lesson;
  return result;
}, {});

const sectionById = sections.reduce<Record<string, Section>>((result, section) => {
  result[section.id] = section;
  return result;
}, {});

const glossaryById = content.glossary.reduce<Record<string, GlossaryEntry>>((result, entry) => {
  result[entry.id] = entry;
  return result;
}, {});

const glossaryByJyutping = content.glossary.reduce<Record<string, GlossaryEntry>>((result, entry) => {
  const normalized = entry.jyutping.trim().toLowerCase();
  if (normalized && !result[normalized]) {
    result[normalized] = entry;
  }
  return result;
}, {});

const audioById = content.audio.reduce<Record<string, AudioAsset>>((result, asset) => {
  result[asset.id] = asset;
  return result;
}, {});

const audioByText = content.audio.reduce<Record<string, AudioAsset>>((result, asset) => {
  for (const value of [asset.label, asset.transcript]) {
    const normalized = value.trim();
    if (normalized && !result[normalized]) {
      result[normalized] = asset;
    }
  }

  return result;
}, {});

export function getSections(): Section[] {
  return sections;
}

export function getSectionById(sectionId: string): Section | undefined {
  return sectionById[sectionId];
}

export function getLessons(): Lesson[] {
  return lessons;
}

export function getLessonById(lessonId: string): Lesson | undefined {
  return lessonById[lessonId];
}

export function getLessonsForSection(sectionId: string): Lesson[] {
  return lessons.filter((lesson) => lesson.sectionId === sectionId);
}

export function getSectionForLesson(lesson: Lesson): Section | undefined {
  return sectionById[lesson.sectionId];
}

export function getLessonIndex(lessonId: string): number {
  return lessons.findIndex((lesson) => lesson.id === lessonId);
}

export function getAdjacentLessons(lessonId: string): {
  previousLesson?: Lesson;
  nextLesson?: Lesson;
} {
  const currentIndex = getLessonIndex(lessonId);
  return {
    previousLesson: currentIndex > 0 ? lessons[currentIndex - 1] : undefined,
    nextLesson: currentIndex >= 0 && currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : undefined,
  };
}

export function getGlossaryEntries(ids: readonly string[] | undefined): GlossaryEntry[] {
  if (!ids) {
    return [];
  }

  return ids.map((id) => glossaryById[id]).filter(Boolean);
}

export function getGlossaryEntry(id: string): GlossaryEntry | undefined {
  return glossaryById[id];
}

export function findGlossaryEntryByJyutping(jyutping: string): GlossaryEntry | undefined {
  return glossaryByJyutping[jyutping.trim().toLowerCase()];
}

export function getAudioAsset(audioId: string | undefined): AudioAsset | undefined {
  if (!audioId) {
    return undefined;
  }

  return audioById[audioId];
}

export function findAudioAssetByText(value: string | undefined): AudioAsset | undefined {
  if (!value) {
    return undefined;
  }

  return audioByText[value.trim()];
}

export function getSectionCompletion(sectionId: string, completedLessonIds: string[]): number {
  const sectionLessons = getLessonsForSection(sectionId);
  if (sectionLessons.length === 0) {
    return 0;
  }

  const completedCount = sectionLessons.filter((lesson) => completedLessonIds.includes(lesson.id)).length;
  return completedCount / sectionLessons.length;
}

export function getNextLessonForSection(sectionId: string, completedLessonIds: string[]): Lesson | undefined {
  const sectionLessons = getLessonsForSection(sectionId);
  return sectionLessons.find((lesson) => !completedLessonIds.includes(lesson.id)) ?? sectionLessons[0];
}

export function getNextLessonForApp(completedLessonIds: string[]): Lesson | undefined {
  return lessons.find((lesson) => !completedLessonIds.includes(lesson.id)) ?? lessons[0];
}

export function getSectionStatus(
  sectionId: string,
  completedLessonIds: string[],
  reviewLaterIds: string[] = [],
): 'new' | 'active' | 'done' {
  const sectionLessons = getLessonsForSection(sectionId);
  const completedCount = sectionLessons.filter((lesson) => completedLessonIds.includes(lesson.id)).length;
  const hasReviewLater = sectionLessons.some((lesson) => reviewLaterIds.includes(lesson.id));

  if (completedCount === 0 && !hasReviewLater) {
    return 'new';
  }

  if (completedCount === sectionLessons.length) {
    return 'done';
  }

  return 'active';
}

export function getArcadeActivities() {
  return [...content.arcades];
}
