import { useParams } from 'react-router-dom';
import { LessonPlayer } from '@/features/learn/LessonPlayer';
import { getLessonById } from '@/features/learn/data';
import { useSettingsState } from '@/features/progress';
import { useScriptText } from '@/lib/script';

export function LessonPage() {
  const { lessonId = '' } = useParams();
  const lesson = getLessonById(lessonId);
  const { scriptPreference } = useSettingsState();
  const text = useScriptText(scriptPreference);

  if (!lesson) {
    return (
      <section className="placeholder-page">
        <div className="placeholder-page__inner">
          <h1>{text('找不到課程')}</h1>
        </div>
      </section>
    );
  }

  return <LessonPlayer lesson={lesson} />;
}
