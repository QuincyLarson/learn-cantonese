import { Link } from 'react-router-dom';
import {
  getLessonsForSection,
  getNextLessonForApp,
  getNextLessonForSection,
  getSectionStatus,
  getSections,
} from '@/features/learn/data';
import { SettingsOnboardingCallout } from '@/features/settings';
import { useProgressState, useSettingsState } from '@/features/progress';
import { useScriptText } from '@/lib/script';

export function LearnMapPage() {
  const progress = useProgressState();
  const { scriptPreference } = useSettingsState();
  const text = useScriptText(scriptPreference);
  const sections = getSections();
  const nextLesson = getNextLessonForApp(progress.completedLessonIds);
  const started = progress.completedLessonIds.length > 0 || progress.reviewLaterIds.length > 0;

  return (
    <div className="curriculum-page">
      <section className="curriculum-head">
        <div className="curriculum-head__copy">
          <h1>{text('課程')}</h1>
          <p>{text('給普通話使用者的系統粵語課程。')}</p>
        </div>
        {nextLesson ? (
          <Link className="button button--primary" to={`/learn/lesson/${nextLesson.id}`}>
            {started ? text('繼續學習') : text('開始學習')}
          </Link>
        ) : null}
      </section>

      <SettingsOnboardingCallout />

      <section className="curriculum-list" aria-label={text('課程目錄')}>
        {sections.map((section) => {
          const lessons = getLessonsForSection(section.id);
          const sectionNextLesson = getNextLessonForSection(section.id, progress.completedLessonIds);
          const completedCount = lessons.filter((lesson) => progress.completedLessonIds.includes(lesson.id)).length;
          const status = getSectionStatus(section.id, progress.completedLessonIds, progress.reviewLaterIds);
          const buttonLabel =
            status === 'new'
              ? text('開始本章')
              : status === 'active'
                ? text('繼續本章')
                : text('重練本章');

          return (
            <article key={section.id} className="section-card">
              <header className="section-card__header">
                <div>
                  <h2>{text(section.title)}</h2>
                  <p>{text(section.summary)}</p>
                </div>
                <span className="section-card__progress">
                  {completedCount}/{lessons.length}
                </span>
              </header>

              <ul className="section-card__lessons">
                {lessons.map((lesson) => (
                  <li key={lesson.id} className="section-card__lesson">
                    <span className="section-card__lesson-mark" aria-hidden="true">
                      {progress.completedLessonIds.includes(lesson.id) ? '✓' : '•'}
                    </span>
                    <span className="section-card__lesson-title">{text(lesson.title)}</span>
                    <span className="section-card__lesson-summary">{text(lesson.summary)}</span>
                  </li>
                ))}
              </ul>

              {sectionNextLesson ? (
                <div className="section-card__footer">
                  <Link className="button button--primary" to={`/learn/lesson/${sectionNextLesson.id}`}>
                    {buttonLabel}
                  </Link>
                </div>
              ) : null}
            </article>
          );
        })}
      </section>
    </div>
  );
}
