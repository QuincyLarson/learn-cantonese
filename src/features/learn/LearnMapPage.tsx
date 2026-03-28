import { Link } from 'react-router-dom';
import { getLessonsForSection, getSectionCompletion, getSections } from '@/features/learn/data';
import { useProgressState, useSettingsState } from '@/features/progress';
import { useScriptText } from '@/lib/script';

export function LearnMapPage() {
  const progress = useProgressState();
  const { scriptPreference } = useSettingsState();
  const text = useScriptText(scriptPreference);
  const sections = getSections();

  return (
    <div className="page-stack">
      <section className="page-intro">
        <p className="eyebrow">{text('Curriculum Map')}</p>
        <h1>{text('A1 路線圖')}</h1>
        <p>{text('用一條線把起步課、聲音訓練、實景對話和 A1 小測串起來。每一課都短，先把耳朵和高頻句型跑順。')}</p>
      </section>

      <section className="path-rail" aria-label={text('課程路線')}>
        {sections.map((section, index) => {
          const lessons = getLessonsForSection(section.id);
          const completion = getSectionCompletion(section.id, progress.completedLessonIds);
          const nextLesson = lessons.find((lesson) => !progress.completedLessonIds.includes(lesson.id)) ?? lessons[0];

          return (
            <article key={section.id} className="path-node">
              <div className="path-node__index">{index + 1}</div>
              <div className="path-node__body">
                <header className="path-node__header">
                  <div>
                    <p className="eyebrow">{text(section.title)}</p>
                    <h2>{text(section.subtitle)}</h2>
                    <p>{text(section.summary)}</p>
                  </div>
                  <span className="progress-pill">{Math.round(completion * 100)}%</span>
                </header>

                <div className="lesson-chip-row">
                  {lessons.map((lesson) => (
                    <Link
                      key={lesson.id}
                      to={`/learn/lesson/${lesson.id}`}
                      className={
                        progress.completedLessonIds.includes(lesson.id)
                          ? 'lesson-chip is-complete'
                          : progress.reviewLaterIds.includes(lesson.id)
                            ? 'lesson-chip is-flagged'
                            : 'lesson-chip'
                      }
                    >
                      {text(lesson.title)}
                    </Link>
                  ))}
                </div>

                <div className="path-node__actions">
                  <Link className="button button--primary" to={`/learn/lesson/${nextLesson.id}`}>
                    {text('開始 / 繼續')}
                  </Link>
                  <Link className="button button--secondary" to={`/learn/section/${section.id}`}>
                    {text('看章節')}
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
