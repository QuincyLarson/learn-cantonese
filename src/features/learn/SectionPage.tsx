import { Link, useParams } from 'react-router-dom';
import { getLessonsForSection, getSectionById } from '@/features/learn/data';
import { useProgressState, useSettingsState } from '@/features/progress';
import { useScriptText } from '@/lib/script';

export function SectionPage() {
  const { sectionId = '' } = useParams();
  const section = getSectionById(sectionId);
  const progress = useProgressState();
  const { scriptPreference } = useSettingsState();
  const text = useScriptText(scriptPreference);

  if (!section) {
    return (
      <section className="placeholder-page">
        <div className="placeholder-page__inner">
          <h1>{text('找不到章節')}</h1>
        </div>
      </section>
    );
  }

  const lessons = getLessonsForSection(section.id);

  return (
    <div className="page-stack">
      <section className="page-intro">
        <p className="eyebrow">{text(section.title)}</p>
        <h1>{text(section.subtitle)}</h1>
        <p>{text(section.summary)}</p>
      </section>

      <section className="lesson-list">
        {lessons.map((lesson) => {
          const complete = progress.completedLessonIds.includes(lesson.id);
          const reviewLater = progress.reviewLaterIds.includes(lesson.id);

          return (
            <article key={lesson.id} className="lesson-list__item">
              <div>
                <p className="eyebrow">
                  {text('約')} {lesson.estimatedMinutes} {text('分鐘')}
                </p>
                <h2>{text(lesson.title)}</h2>
                <p>{text(lesson.summary)}</p>
                <div className="lesson-chip-row">
                  {lesson.objectives.map((objective) => (
                    <span key={objective} className="lesson-chip">
                      {text(objective)}
                    </span>
                  ))}
                </div>
              </div>
              <div className="lesson-list__actions">
                <span className={complete ? 'progress-pill is-complete' : reviewLater ? 'progress-pill is-flagged' : 'progress-pill'}>
                  {complete ? text('已完成') : reviewLater ? text('待複習') : text('未開始')}
                </span>
                <Link className="button button--primary" to={`/learn/lesson/${lesson.id}`}>
                  {complete ? text('再做一次') : text('開始')}
                </Link>
              </div>
            </article>
          );
        })}
      </section>

      {section.checkpointLessonId ? (
        <section className="surface-card checkpoint-card">
          <p className="eyebrow">{text('Section Quiz')}</p>
          <h2>{text('做本章小測')}</h2>
          <p>{text('這份小測會把本段的問候、數字、聲調和實用問路句串成一輪。')}</p>
          <Link className="button button--primary" to={`/learn/section/${section.id}/quiz`}>
            {text('開始測驗')}
          </Link>
        </section>
      ) : null}
    </div>
  );
}
