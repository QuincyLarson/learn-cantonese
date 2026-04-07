import { Link } from 'react-router-dom';
import { useProgressState, useSettingsState } from '@/features/progress';
import { useScriptText } from '@/lib/script';
import { CANTONESE_SENTENCE_CARD_COUNT, cantoneseSentenceLessons, cantoneseSentenceRoadmap } from './data';

function getLessonProgress(
  lessonCardIds: readonly string[],
  sentenceStats: Record<string, { masteryLevel: number; correctCount: number } | undefined>,
) {
  let seenCount = 0;
  let masteredCount = 0;

  for (const cardId of lessonCardIds) {
    const stat = sentenceStats[cardId];
    if (!stat || stat.correctCount === 0) {
      continue;
    }

    seenCount += 1;
    if (stat.masteryLevel >= 3) {
      masteredCount += 1;
    }
  }

  return {
    seenCount,
    masteredCount,
    totalCount: lessonCardIds.length,
  };
}

export function CantoneseSentencesOverviewPage() {
  const progress = useProgressState();
  const { scriptPreference } = useSettingsState();
  const text = useScriptText(scriptPreference);

  const lessonProgress = cantoneseSentenceLessons.map((lesson) => ({
    lesson,
    progress: getLessonProgress(lesson.cardIds, progress.cantoneseSentenceDrill.sentenceStats),
  }));
  const lessonProgressById = new Map(lessonProgress.map((entry) => [entry.lesson.id, entry]));

  const suggestedLesson =
    lessonProgress.find(({ progress: itemProgress }) => itemProgress.seenCount > 0 && itemProgress.masteredCount < itemProgress.totalCount) ??
    lessonProgress.find(({ progress: itemProgress }) => itemProgress.seenCount === 0) ??
    lessonProgress[0];

  return (
    <div className="page-stack">
      <section className="curriculum-head">
        <div className="curriculum-head__copy">
          <h1>{text('第 2 章 粵語字同句式')}</h1>
          <p>{text(`用 ${CANTONESE_SENTENCE_CARD_COUNT} 張短句卡專攻普通話最易帶錯入粵語嘅字、詞同句式。你已經識大部分意思，所以呢一章只集中改口、改音同改慣用法。`)}</p>
        </div>
        {suggestedLesson ? (
          <div className="track-action">
            <Link className="button button--primary" to={`/cantonese-sentences/lesson/${suggestedLesson.lesson.id}`}>
              {suggestedLesson.progress.seenCount > 0 ? text('繼續第 2 章') : text('開始第 2 章')}
            </Link>
          </div>
        ) : null}
      </section>

      {cantoneseSentenceRoadmap.map((stage) => (
        <section key={stage.level} className="surface-card sentence-stage-card" aria-label={text(`${stage.level} ${stage.title}`)}>
          <div className="sentence-stage-card__head">
            <div className="sentence-stage-card__badge">{stage.level}</div>
            <div className="sentence-stage-card__copy">
              <h2>{text(stage.title)}</h2>
              <p className="sentence-stage-card__summary">{text(stage.summary)}</p>
              <p className="sentence-stage-card__note">{text(stage.mandarinAdvantageNote)}</p>
            </div>
          </div>

          {stage.lessonIds.length > 0 ? (
            <div className="sentence-lesson-grid" aria-label={text(`${stage.level} 已開放課組`)}>
              {stage.lessonIds.map((lessonId) => {
                const lessonEntry = lessonProgressById.get(lessonId);
                if (!lessonEntry) {
                  return null;
                }

                const { lesson, progress: itemProgress } = lessonEntry;
                const ctaLabel =
                  itemProgress.seenCount === 0
                    ? text('開始')
                    : itemProgress.masteredCount >= itemProgress.totalCount
                      ? text('再練')
                      : text('繼續');

                return (
                  <article key={lesson.id} className="surface-card sentence-lesson-card">
                    <div className="sentence-lesson-card__copy">
                      <h3>{text(lesson.title)}</h3>
                      <p className="sentence-lesson-card__summary">{text(lesson.summary)}</p>
                      <p className="sentence-lesson-card__note">{text(lesson.teacherNote)}</p>
                    </div>
                    <div className="sentence-lesson-card__meta">
                      <span>{text(`已練 ${itemProgress.seenCount}/${itemProgress.totalCount}`)}</span>
                      <span>{text(`已熟 ${itemProgress.masteredCount}/${itemProgress.totalCount}`)}</span>
                    </div>
                    <Link className="button button--secondary" to={`/cantonese-sentences/lesson/${lesson.id}`}>
                      {ctaLabel}
                    </Link>
                  </article>
                );
              })}
            </div>
          ) : null}

          {stage.plannedTopics && stage.plannedTopics.length > 0 ? (
            <div className="sentence-planned-grid" aria-label={text(`${stage.level} 規劃主題`)}>
              {stage.plannedTopics.map((topic) => (
                <article key={`${stage.level}-${topic.title}`} className="sentence-planned-card">
                  <h3>{text(topic.title)}</h3>
                  <p>{text(topic.summary)}</p>
                </article>
              ))}
            </div>
          ) : null}
        </section>
      ))}
    </div>
  );
}
