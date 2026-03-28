import type { CSSProperties } from 'react';
import { dismissCallout, useProgressState } from '../progress';
import { useSettingsState } from '../progress';
import { useScriptText } from '@/lib/script';

export const SCRIPT_TOGGLE_CALLOUT_ID = 'script-toggle-first-visit';

const cardStyle: CSSProperties = {
  border: '1px solid var(--settings-border, #d6d8de)',
  borderRadius: '1rem',
  padding: '1rem',
  background: 'linear-gradient(180deg, var(--settings-callout, #f6faf9), var(--settings-surface, #ffffff))',
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
      <strong>{text('先看這裡')}</strong>
      <p style={{ margin: 0, color: 'var(--settings-muted, #586070)' }}>
        {text('右上角的字體切換會影響整個網站。你可以先用繁體閱讀教材，需要時再切到簡體。')}
      </p>
      <div>
        <button type="button" onClick={() => dismissCallout({ calloutId: SCRIPT_TOGGLE_CALLOUT_ID })}>
          {text('我知道了')}
        </button>
      </div>
    </aside>
  );
}
