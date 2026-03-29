import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Lesson } from '@/content';
import { LessonStepRenderer, type StepContinuePayload } from '@/features/learn/LessonStepRenderer';
import { getAdjacentLessons, getSectionForLesson } from '@/features/learn/data';
import {
  markLessonCompleted,
  toggleReviewLater,
  useProgressState,
  useSettingsState,
} from '@/features/progress';
import { useScriptText } from '@/lib/script';

type LessonPlayerProps = {
  lesson: Lesson;
};

export function LessonPlayer({ lesson }: LessonPlayerProps) {
  const navigate = useNavigate();
  const progress = useProgressState();
  const { scriptPreference } = useSettingsState();
  const text = useScriptText(scriptPreference);
  const timeoutRef = useRef<number | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [advancing, setAdvancing] = useState(false);
  const [flashMessage, setFlashMessage] = useState<string | null>(null);

  const section = getSectionForLesson(lesson);
  const step = lesson.steps[stepIndex];
  const reviewLater = progress.reviewLaterIds.includes(lesson.id);
  const { nextLesson } = getAdjacentLessons(lesson.id);
  const completionFraction = (stepIndex + 1) / lesson.steps.length;

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const scheduleAdvance = (message: string, action: () => void) => {
    if (advancing) {
      return;
    }

    setAdvancing(true);
    setFlashMessage(message);
    timeoutRef.current = window.setTimeout(() => {
      setFlashMessage(null);
      setAdvancing(false);
      action();
    }, 1000);
  };

  const handleContinue = (payload?: StepContinuePayload) => {
    if (!step) {
      return;
    }

    const isLastStep = stepIndex === lesson.steps.length - 1;

    if (!isLastStep) {
      scheduleAdvance(payload?.message ?? '完成', () => {
        setStepIndex((current) => current + 1);
      });
      return;
    }

    const completionMessage = !nextLesson
      ? '全部完成'
      : nextLesson.sectionId === lesson.sectionId
        ? '本課完成'
        : '本章完成';

    scheduleAdvance(completionMessage, () => {
      markLessonCompleted({
        lessonId: lesson.id,
        revisited: progress.completedLessonIds.includes(lesson.id),
      });

      if (nextLesson) {
        navigate(`/learn/lesson/${nextLesson.id}`);
        return;
      }

      navigate('/');
    });
  };

  if (!step) {
    return null;
  }

  return (
    <div className="lesson-player">
      <section className="lesson-hero lesson-hero--compact">
        <div className="lesson-hero__copy">
          <p className="lesson-hero__section">{section ? text(section.title) : text('課程')}</p>
          <h1>{text(lesson.title)}</h1>
        </div>

        <div className="lesson-hero__meta">
          <span className="progress-pill">
            {stepIndex + 1} / {lesson.steps.length}
          </span>
          <button
            type="button"
            className={reviewLater ? 'button button--secondary is-flagged' : 'button button--secondary'}
            onClick={() => toggleReviewLater(lesson.id)}
            disabled={advancing}
          >
            {reviewLater ? text('已標記複習') : text('稍後複習')}
          </button>
        </div>

        <div className="lesson-progress" aria-hidden="true">
          <span style={{ width: `${completionFraction * 100}%` }} />
        </div>
      </section>

      {flashMessage ? (
        <div className="floating-signal" role="status" aria-live="polite">
          {text(flashMessage)}
        </div>
      ) : null}

      <div className={advancing ? 'lesson-stage is-busy' : 'lesson-stage'}>
        <LessonStepRenderer
          key={step.id}
          lessonId={lesson.id}
          step={step}
          busy={advancing}
          onContinue={handleContinue}
        />
      </div>
    </div>
  );
}
