import { Link, useParams } from 'react-router-dom';
import { getLessonsForSection, getNextLessonForSection, getSectionById, getSectionStatus } from '@/features/learn/data';
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
  const nextLesson = getNextLessonForSection(section.id, progress.completedLessonIds);
  const status = getSectionStatus(section.id, progress.completedLessonIds, progress.reviewLaterIds);

  return (
    <div className="page-stack">
      <section className="curriculum-head">
        <div className="curriculum-head__copy">
          <h1>{text(section.title)}</h1>
          <p>{text(section.summary)}</p>
        </div>
        {nextLesson ? (
          <Link className="button button--primary" to={`/learn/lesson/${nextLesson.id}`}>
            {status === 'new' ? text('開始本章') : status === 'active' ? text('繼續本章') : text('重練本章')}
          </Link>
        ) : null}
      </section>

      <section className="lesson-list lesson-list--compact">
        {lessons.map((lesson) => {
          const complete = progress.completedLessonIds.includes(lesson.id);
          const reviewLater = progress.reviewLaterIds.includes(lesson.id);

          return (
            <article key={lesson.id} className="lesson-list__item">
              <div>
                <h2>{text(lesson.title)}</h2>
                <p>{text(lesson.summary)}</p>
              </div>
              <div className="lesson-list__actions">
                <span className={complete ? 'progress-pill is-complete' : reviewLater ? 'progress-pill is-flagged' : 'progress-pill'}>
                  {complete ? text('已完成') : reviewLater ? text('待複習') : text('未開始')}
                </span>
                <Link className="button button--secondary" to={`/learn/lesson/${lesson.id}`}>
                  {complete ? text('重練') : text('進入')}
                </Link>
              </div>
            </article>
          );
        })}
      </section>

      {section.checkpointLessonId ? (
        <section className="surface-card checkpoint-card">
          <h2>{text('本章小測')}</h2>
          <p>{text('把本章內容跑一遍。')}</p>
          <Link className="button button--primary" to={`/learn/section/${section.id}/quiz`}>
            {text('開始小測')}
          </Link>
        </section>
      ) : null}
    </div>
  );
}
