import { useMemo, useState } from 'react';
import { getArcadeActivities } from '@/features/learn/data';
import { useSettingsState } from '@/features/progress';
import { useScriptText } from '@/lib/script';
import { JyutpingFlashcardPanel } from '@/features/arcade/JyutpingFlashcardPanel';
import { ToneSprintPanel } from '@/features/arcade/ToneSprintPanel';

export function ArcadePage() {
  const { scriptPreference } = useSettingsState();
  const text = useScriptText(scriptPreference);
  const activities = getArcadeActivities();
  const defaultActivityId = useMemo(
    () => activities.find((item) => item.mode === 'jyutpingFlashcards')?.id ?? activities[0]?.id ?? '',
    [activities],
  );
  const [selectedActivityId, setSelectedActivityId] = useState(defaultActivityId);
  const activity = activities.find((item) => item.id === selectedActivityId) ?? activities[0];

  if (!activity) {
    return null;
  }

  return (
    <div className="page-stack">
      <section className="curriculum-head">
        <div className="curriculum-head__copy">
          <h1>{text('快練')}</h1>
          <p>{text('選一種玩法，集中練耳朵或者見字打音。')}</p>
        </div>
      </section>

      <section className="arcade-selector" aria-label={text('快練模式')}>
        {activities.map((item) => (
          <button
            key={item.id}
            type="button"
            className={item.id === activity.id ? 'arcade-selector__button is-active' : 'arcade-selector__button'}
            onClick={() => setSelectedActivityId(item.id)}
          >
            <strong>{text(item.title)}</strong>
            <span>{text(item.subtitle)}</span>
          </button>
        ))}
      </section>

      {activity.mode === 'jyutpingFlashcards' ? (
        <JyutpingFlashcardPanel activity={activity} />
      ) : (
        <ToneSprintPanel activity={activity} />
      )}
    </div>
  );
}
