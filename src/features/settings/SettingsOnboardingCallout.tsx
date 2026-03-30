import type { CSSProperties } from 'react';
import { dismissCallout, useProgressState } from '../progress';
import { useSettingsState } from '../progress';
import { useScriptText } from '@/lib/script';

export const SCRIPT_TOGGLE_CALLOUT_ID = 'script-toggle-first-visit';

const cardStyle: CSSProperties = {
  border: '1px solid var(--settings-border, #d6d8de)',
  borderRadius: 0,
  padding: '1rem',
  background: 'var(--settings-callout, #f6faf9)',
  display: 'grid',
  gap: '0.75rem',
};

export function SettingsOnboardingCallout(): JSX.Element | null {
  const progress = useProgressState();
  const { scriptPreference } = useSettingsState();
  const text = useScriptText(scriptPreference);

  if (progress.dismissedCalloutIds.includes(SCRIPT_TOGGLE_CALLOUT_ID)) {
    return null;
  }

  return (
    <aside style={cardStyle} aria-label={text('首次使用提示')}>
      <strong>{text('先選字體')}</strong>
      <p style={{ margin: 0, color: 'var(--settings-muted, #586070)' }}>
        {text('右上角可切換繁體或簡體，整站都會一起切換。')}
      </p>
      <div>
        <button
          type="button"
          className="button button--secondary"
          onClick={() => dismissCallout({ calloutId: SCRIPT_TOGGLE_CALLOUT_ID })}
        >
          {text('知道了')}
        </button>
      </div>
    </aside>
  );
}
