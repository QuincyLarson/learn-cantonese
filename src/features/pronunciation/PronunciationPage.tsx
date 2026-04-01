import { TrackOverviewPage } from '@/components/TrackOverviewPage';
import { useSettingsState } from '@/features/progress';
import { useScriptText } from '@/lib/script';

export function PronunciationPage() {
  const { scriptPreference } = useSettingsState();
  const text = useScriptText(scriptPreference);

  return (
    <TrackOverviewPage
      title={text('學發音')}
      summary={text('先把粵拼聲母、韻母、聲調系統分清楚，再回來打詞。')}
      items={[
        {
          title: text('粵拼聲母'),
          summary: text('先分清 n、l、z、c、j 這些最易混的起首音。'),
        },
        {
          title: text('粵拼韻母'),
          summary: text('把 aa、a、e、oe、yu 這些核心韻母過一輪。'),
        },
        {
          title: text('六個聲調'),
          summary: text('先聽懂調值，再做辨音和跟讀。'),
        },
      ]}
      action={{
        label: text('去學詞彙'),
        to: '/vocab',
      }}
    />
  );
}
