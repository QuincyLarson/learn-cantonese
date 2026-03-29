import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LessonStepRenderer, type StepContinuePayload } from '@/features/learn/LessonStepRenderer';
import { getAdjacentLessons, getLessonById, getSectionById } from '@/features/learn/data';
import {
  markLessonCompleted,
  recordQuizAttempt,
  useProgressState,
  useSettingsState,
} from '@/features/progress';
import { useScriptText } from '@/lib/script';

export function SectionQuizPage() {
  const navigate = useNavigate();
  const { sectionId = '' } = useParams();
  const section = getSectionById(sectionId);
  const progress = useProgressState();
  const { scriptPreference } = useSettingsState();
  const text = useScriptText(scriptPreference);
  const lesson = section?.checkpointLessonId ? getLessonById(section.checkpointLessonId) : undefined;
  const [stepIndex, setStepIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [advancing, setAdvancing] = useState(false);
  const [flashMessage, setFlashMessage] = useState<string | null>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  if (!section || !lesson) {
    return (
      <section className="placeholder-page">
        <div className="placeholder-page__inner">
          <h1>{text('找不到小測')}</h1>
        </div>
      </section>
    );
  }

  const totalSteps = lesson.steps.length;
  const step = lesson.steps[stepIndex];
  const { nextLesson } = getAdjacentLessons(lesson.id);

  if (!step) {
    return null;
  }

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
    const nextCorrectCount = correctCount + (payload?.firstTryCorrect ? 1 : 0);
    const isLastStep = stepIndex === totalSteps - 1;

    if (!isLastStep) {
      scheduleAdvance(payload?.message ?? '完成', () => {
        setCorrectCount(nextCorrectCount);
        setStepIndex((current) => current + 1);
      });
      return;
    }

    const finalScore = totalSteps ? Math.round((nextCorrectCount / totalSteps) * 100) : 0;
    const completionMessage = nextLesson ? '本章完成' : '全部完成';

    scheduleAdvance(completionMessage, () => {
      recordQuizAttempt({
        quizId: section.id,
        score: finalScore,
        passed: finalScore >= 80,
      });
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

  return (
    <div className="lesson-player">
      <section className="lesson-hero lesson-hero--compact">
        <div className="lesson-hero__copy">
          <p className="lesson-hero__section">{text(section.title)}</p>
          <h1>{text(lesson.title)}</h1>
        </div>

        <div className="lesson-hero__meta">
          <span className="progress-pill">
            {stepIndex + 1} / {totalSteps}
          </span>
          <span className="progress-pill">
            {text('首輪答對')} {correctCount}
          </span>
        </div>

        <div className="lesson-progress" aria-hidden="true">
          <span style={{ width: `${((stepIndex + 1) / totalSteps) * 100}%` }} />
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
          mode="quiz"
          busy={advancing}
          onContinue={handleContinue}
        />
      </div>
    </div>
  );
}
