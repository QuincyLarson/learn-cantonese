import { Link, useParams } from 'react-router-dom';
import { getLessonById, getSectionById } from '@/features/learn/data';
import { LessonStepRenderer } from '@/features/learn/LessonStepRenderer';
import {
  markLessonCompleted,
  recordQuizAttempt,
  useProgressState,
  useSettingsState,
} from '@/features/progress';
import { useMemo, useState } from 'react';
import { useScriptText } from '@/lib/script';

export function SectionQuizPage() {
  const { sectionId = '' } = useParams();
  const section = getSectionById(sectionId);
  const progress = useProgressState();
  const { scriptPreference } = useSettingsState();
  const text = useScriptText(scriptPreference);
  const lesson = section?.checkpointLessonId ? getLessonById(section.checkpointLessonId) : undefined;
  const [stepIndex, setStepIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const totalSteps = lesson?.steps.length ?? 0;
  const score = useMemo(() => (totalSteps ? Math.round((correctCount / totalSteps) * 100) : 0), [correctCount, totalSteps]);

  if (!section || !lesson) {
    return (
      <section className="placeholder-page">
        <div className="placeholder-page__inner">
          <h1>{text('找不到測驗')}</h1>
        </div>
      </section>
    );
  }

  const step = lesson.steps[stepIndex];

  if (finished || !step) {
    return (
      <section className="completion-card">
        <p className="eyebrow">{text('Quiz Complete')}</p>
        <h1>{text('A1 小測完成')}</h1>
        <p>
          {text('本次得分')} {score}%。
          {score >= 80 ? text(' 可以往前走。') : text(' 建議你先回去重跑聲調或問路那幾課。')}
        </p>
        <div className="hero__actions">
          <Link className="button button--primary" to={`/learn/section/${section.id}`}>
            {text('回本章')}
          </Link>
          <Link className="button button--secondary" to="/learn">
            {text('回路線圖')}
          </Link>
        </div>
      </section>
    );
  }

  return (
    <div className="page-stack">
      <section className="page-intro">
        <p className="eyebrow">{text(section.title)}</p>
        <h1>{text(lesson.title)}</h1>
        <p>{text(lesson.summary)}</p>
        <div className="lesson-progress" aria-hidden="true">
          <span style={{ width: `${((stepIndex + 1) / totalSteps) * 100}%` }} />
        </div>
      </section>

      <LessonStepRenderer
        lessonId={lesson.id}
        step={step}
        mode="quiz"
        onContinue={(isCorrect) => {
          const nextCorrect = correctCount + (isCorrect ? 1 : 0);

          if (stepIndex === totalSteps - 1) {
            const finalScore = totalSteps ? Math.round((nextCorrect / totalSteps) * 100) : 0;
            recordQuizAttempt({
              quizId: section.id,
              score: finalScore,
              passed: finalScore >= 80,
            });
            markLessonCompleted({
              lessonId: lesson.id,
              revisited: progress.completedLessonIds.includes(lesson.id),
            });
            setCorrectCount(nextCorrect);
            setFinished(true);
            return;
          }

          setCorrectCount(nextCorrect);
          setStepIndex((current) => current + 1);
        }}
      />
    </div>
  );
}
