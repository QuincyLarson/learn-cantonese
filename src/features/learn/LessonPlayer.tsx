import { Link } from 'react-router-dom';
import type { Lesson } from '@/content';
import { LessonStepRenderer } from '@/features/learn/LessonStepRenderer';
import { getAdjacentLessons, getSectionForLesson } from '@/features/learn/data';
import {
  markLessonCompleted,
  toggleReviewLater,
  useProgressState,
  useSettingsState,
} from '@/features/progress';
import { useScriptText } from '@/lib/script';
import { useState } from 'react';

type LessonPlayerProps = {
  lesson: Lesson;
};

export function LessonPlayer({ lesson }: LessonPlayerProps) {
  const progress = useProgressState();
  const { scriptPreference } = useSettingsState();
  const text = useScriptText(scriptPreference);
  const [stepIndex, setStepIndex] = useState(0);
  const [completed, setCompleted] = useState(progress.completedLessonIds.includes(lesson.id));
  const section = getSectionForLesson(lesson);
  const step = lesson.steps[stepIndex];
  const reviewLater = progress.reviewLaterIds.includes(lesson.id);
  const { previousLesson, nextLesson } = getAdjacentLessons(lesson.id);
  const completionFraction = (stepIndex + 1) / lesson.steps.length;

  const finishLesson = () => {
    markLessonCompleted({
      lessonId: lesson.id,
      revisited: progress.completedLessonIds.includes(lesson.id),
    });
    setCompleted(true);
  };

  if (!step) {
    return null;
  }

  return (
    <div className="lesson-player">
      <section className="lesson-hero">
        <div>
          <p className="eyebrow">{section ? text(section.title) : text('Lesson')}</p>
          <h1>{text(lesson.title)}</h1>
          <p className="muted-text">{text(lesson.summary)}</p>
        </div>
        <div className="lesson-hero__meta">
          <span className="progress-pill">
            {text('第')} {stepIndex + 1} / {lesson.steps.length} {text('步')}
          </span>
          <button
            type="button"
            className={reviewLater ? 'button button--secondary is-flagged' : 'button button--secondary'}
            onClick={() => toggleReviewLater(lesson.id)}
          >
            {reviewLater ? text('已加入稍後複習') : text('稍後複習')}
          </button>
        </div>
        <div className="lesson-progress" aria-hidden="true">
          <span style={{ width: `${completionFraction * 100}%` }} />
        </div>
      </section>

      {!completed ? (
        <LessonStepRenderer
          lessonId={lesson.id}
          step={step}
          onContinue={() => {
            if (stepIndex === lesson.steps.length - 1) {
              finishLesson();
              return;
            }
            setStepIndex((current) => current + 1);
          }}
        />
      ) : (
        <section className="completion-card">
          <p className="eyebrow">{text('Lesson Complete')}</p>
          <h2>{text('這一課完成了')}</h2>
          <p>{text('你已經把這一課的核心識別點跑完。現在可以繼續下一課，或者回去再做一次。')}</p>
          <div className="hero__actions">
            {nextLesson ? (
              <Link className="button button--primary" to={`/learn/lesson/${nextLesson.id}`}>
                {text('去下一課')}
              </Link>
            ) : null}
            {section ? (
              <Link className="button button--secondary" to={`/learn/section/${section.id}`}>
                {text('回本章')}
              </Link>
            ) : null}
          </div>
        </section>
      )}

      <nav className="lesson-footer-nav" aria-label={text('課程前後導航')}>
        {previousLesson ? (
          <Link className="button button--secondary" to={`/learn/lesson/${previousLesson.id}`}>
            {text('上一課')}
          </Link>
        ) : <span />}
        {nextLesson ? (
          <Link className="button button--secondary" to={`/learn/lesson/${nextLesson.id}`}>
            {text('下一課')}
          </Link>
        ) : null}
      </nav>
    </div>
  );
}
