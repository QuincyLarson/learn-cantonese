import type { CSSProperties } from 'react';
import type { PlaybackSpeed, ScriptPreference, ThemePreference } from '../progress';
import { useSettingsState } from '../progress';
import { useScriptText } from '@/lib/script';

type Option<T extends string | number> = {
  value: T;
  label: string;
  hint?: string;
};

type SegmentedControlProps<T extends string | number> = {
  label: string;
  value: T;
  options: readonly Option<T>[];
  onChange: (value: T) => void;
  description?: string;
};

const groupStyle: CSSProperties = {
  display: 'grid',
  gap: '0.5rem',
  border: 0,
  padding: 0,
  margin: 0,
};

const buttonRowStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(7.5rem, 1fr))',
  gap: '0.5rem',
};

const optionStyle: CSSProperties = {
  border: '1px solid var(--settings-border, #d6d8de)',
  borderRadius: '0.875rem',
  padding: '0.75rem 0.875rem',
  background: 'var(--settings-surface, #ffffff)',
  color: 'inherit',
  textAlign: 'left',
  cursor: 'pointer',
  font: 'inherit',
  transition: 'transform 120ms ease, border-color 120ms ease, background-color 120ms ease',
};

const activeOptionStyle: CSSProperties = {
  ...optionStyle,
  borderColor: 'var(--settings-accent, #0f766e)',
  background: 'var(--settings-active-surface, #effdfa)',
};

function SegmentedControl<T extends string | number>({
  label,
  value,
  options,
  onChange,
  description,
}: SegmentedControlProps<T>): JSX.Element {
  const { scriptPreference } = useSettingsState();
  const text = useScriptText(scriptPreference);

  return (
    <fieldset style={groupStyle}>
      <legend style={{ fontWeight: 600 }}>{text(label)}</legend>
      {description ? <p style={{ margin: 0, color: 'var(--settings-muted, #586070)' }}>{text(description)}</p> : null}
      <div style={buttonRowStyle} role="group" aria-label={text(label)}>
        {options.map((option) => {
          const active = option.value === value;

          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(option.value)}
              style={active ? activeOptionStyle : optionStyle}
            >
              <div style={{ fontWeight: 600 }}>{text(option.label)}</div>
              {option.hint ? <div style={{ marginTop: '0.25rem', fontSize: '0.875rem', opacity: 0.8 }}>{text(option.hint)}</div> : null}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export function ScriptPreferenceToggle(props: {
  value: ScriptPreference;
  onChange: (value: ScriptPreference) => void;
  description?: string;
}): JSX.Element {
  return (
    <SegmentedControl
      label="字體切換"
      value={props.value}
      onChange={props.onChange}
      description={props.description ?? '全站內容會以同一份資料在繁體與簡體之間切換。'}
      options={[
        { value: 'traditional', label: '繁體', hint: '預設教材字形' },
        { value: 'simplified', label: '簡體', hint: '閱讀用顯示' },
      ]}
    />
  );
}

export function ThemePreferenceToggle(props: {
  value: ThemePreference;
  onChange: (value: ThemePreference) => void;
  description?: string;
}): JSX.Element {
  return (
    <SegmentedControl
      label="深色模式"
      value={props.value}
      onChange={props.onChange}
      description={props.description ?? '可跟隨系統，也可強制淺色或深色。'}
      options={[
        { value: 'system', label: '跟隨系統' },
        { value: 'light', label: '淺色' },
        { value: 'dark', label: '深色' },
      ]}
    />
  );
}

export function PlaybackSpeedToggle(props: {
  value: PlaybackSpeed;
  onChange: (value: PlaybackSpeed) => void;
  description?: string;
}): JSX.Element {
  return (
    <SegmentedControl
      label="播放速度"
      value={props.value}
      onChange={props.onChange}
      description={props.description ?? '音訊播放支援 1.0x、0.75x、0.5x。'}
      options={[
        { value: 1, label: '1.0x' },
        { value: 0.75, label: '0.75x' },
        { value: 0.5, label: '0.5x' },
      ]}
    />
  );
}
