import { useLayoutEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { cantoneseSentenceLessons } from '@/features/cantoneseSentences';
import { curriculumBooks } from '@/features/curriculum/catalog';
import { getPronunciationLessonProgressId, pronunciationLessons } from '@/features/pronunciation/data';
import { useProgressState, useSettingsState } from '@/features/progress';
import { getResumeRoute } from '@/lib/navigationState';
import { useScriptText } from '@/lib/script';

type CurriculumChapterRow = {
  id: string;
  chapterNumber: number;
  title: string;
  summary: string;
  route?: string;
  completed: boolean;
  isCurrent: boolean;
};

function getSentenceLessonCompleted(
  cardIds: readonly string[],
  sentenceStats: Record<string, { masteryLevel?: number; correctCount?: number } | undefined>,
): boolean {
  return cardIds.every((cardId) => {
    const stat = sentenceStats[cardId];
    return Boolean(stat) && (stat?.masteryLevel ?? 0) >= 3;
  });
}

function getCurriculumTargetIdFromRoute(route: string | undefined, rows: readonly CurriculumChapterRow[]): string | undefined {
  if (!route) {
    return undefined;
  }

  const matchingRow = rows.find((row) => row.route === route);
  if (matchingRow) {
    return `curriculum-row-${matchingRow.id}`;
  }

  if (route === '/practice' || route === '/vocab') {
    const vocabRow = rows.find((row) => row.id.startsWith('vocab:'));
    return vocabRow ? `curriculum-row-${vocabRow.id}` : undefined;
  }

  return undefined;
}

export function CurriculumPage() {
  const progress = useProgressState();
  const { scriptPreference } = useSettingsState();
  const text = useScriptText(scriptPreference);
  const resumeRoute = useMemo(() => getResumeRoute(), []);

  const chapterRows = useMemo(() => {
    let pronunciationLessonIndex = 0;
    let sentenceLessonIndex = 0;

    return curriculumBooks.map((book, index) => {
      if (book.unitId === 'unit1' && pronunciationLessonIndex < pronunciationLessons.length) {
        const lesson = pronunciationLessons[pronunciationLessonIndex++];
        const route = `/pronunciation/lesson/${lesson.id}`;
        const completed = progress.completedLessonIds.includes(getPronunciationLessonProgressId(lesson.id));

        return {
          id: `pronunciation:${lesson.id}`,
          chapterNumber: index + 1,
          title: lesson.title,
          summary: lesson.summary,
          route,
          completed,
          isCurrent: resumeRoute === route,
        } satisfies CurriculumChapterRow;
      }

      if (book.unitId === 'unit2' && sentenceLessonIndex < cantoneseSentenceLessons.length) {
        const lesson = cantoneseSentenceLessons[sentenceLessonIndex++];
        const route = `/cantonese-sentences/lesson/${lesson.id}`;
        const completed = getSentenceLessonCompleted(lesson.cardIds, progress.cantoneseSentenceDrill.sentenceStats);

        return {
          id: `grammar:${lesson.id}`,
          chapterNumber: index + 1,
          title: lesson.title,
          summary: lesson.summary,
          route,
          completed,
          isCurrent: resumeRoute === route,
        } satisfies CurriculumChapterRow;
      }

      return {
        id: `${book.unitId}:${book.id}`,
        chapterNumber: index + 1,
        title: book.title,
        summary: book.summary,
        route: book.route,
        completed: false,
        isCurrent: resumeRoute === book.route,
      } satisfies CurriculumChapterRow;
    });
  }, [progress.cantoneseSentenceDrill.sentenceStats, progress.completedLessonIds, resumeRoute]);

  useLayoutEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    const targetId = getCurriculumTargetIdFromRoute(resumeRoute, chapterRows);
    if (!targetId) {
      return;
    }

    const target = document.getElementById(targetId);
    target?.scrollIntoView({ block: 'start', inline: 'nearest', behavior: 'auto' });
  }, [chapterRows, resumeRoute]);

  return (
    <div className="linear-curriculum linear-curriculum--stacked">
      <section className="linear-curriculum__intro">
        <h1>{text('普通話學粵語')}</h1>
        <p>
          {text(
            '呢度係完整課程序列。由最前面一路學落去就得：先校準粵語發音同粵拼，再改正普通話帶入嚟嘅字、詞同句法，之後再一路加深到高階語感。',
          )}
        </p>
      </section>

      <section className="unit-card" aria-labelledby="curriculum-sequence-title">
        <div className="unit-card__body">
          <div className="unit-card__head">
            <h2 id="curriculum-sequence-title">{text('課程序列')}</h2>
            <div className="unit-card__meta">
              <p className="unit-card__count">{text(`共 ${chapterRows.length} 課`)}</p>
            </div>
          </div>
          <ol className="unit-card__subsections" aria-label={text('完整課程序列')}>
            {chapterRows.map((row) => (
              <li
                key={row.id}
                id={`curriculum-row-${row.id}`}
                className={[
                  'unit-card__subsection',
                  row.completed ? 'is-completed' : '',
                  row.isCurrent ? 'is-current' : '',
                ].filter(Boolean).join(' ')}
              >
                <div className="unit-card__rail" aria-hidden="true">
                  <span className={row.completed ? 'unit-card__status is-completed' : 'unit-card__status'}>
                    {row.completed ? '✓' : ''}
                  </span>
                  <span className="unit-card__step">{String(row.chapterNumber).padStart(3, '0')}</span>
                </div>
                <div className="unit-card__copy">
                  <h3 className="unit-card__title-row">
                    {row.route ? (
                      <Link className="unit-card__link" to={row.route}>
                        {text(row.title)}
                      </Link>
                    ) : (
                      <span>{text(row.title)}</span>
                    )}
                  </h3>
                  <p>{text(row.summary)}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  );
}
